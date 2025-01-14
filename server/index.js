import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import ElevenLabs from 'elevenlabs-node';

dotenv.config();
const IMAGE_API_URL = 'https://magicloops.dev/api/loop/0e90271e-dd9d-4745-b253-a82ef4286126/run';
const voice = new ElevenLabs({
  apiKey: process.env.ELEVENLABS_API_KEY,
  voiceId: process.env.ELEVENLABS_VOICE_ID
});
const app = express();
const port = 3001;

// Middleware setup
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Access-Control-Allow-Origin']
}));

app.options('*', cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Voice synthesis endpoint
app.post('/synthesize-voice', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    console.log('Synthesizing voice for text:', text);
    const audioBuffer = await voice.textToSpeechStream({
      textInput: text,
      voiceId: process.env.ELEVENLABS_VOICE_ID,
      stability: 0.5,
      similarityBoost: 0.5,
      responseType: 'arraybuffer'
    });
    
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(audioBuffer);
  } catch (error) {
    console.error('Error synthesizing voice:', error);
    res.status(500).json({ 
      error: 'Failed to synthesize voice',
      details: error.message 
    });
  }
});

// Initialize OpenAI client
const client = new OpenAI({
  baseURL: 'https://api.studio.nebius.ai/v1/',
  apiKey: process.env.NEBIUS_API_KEY,
});

// Image generation endpoint
app.post('/get-image', async (req, res) => {
  const { keywords } = req.body;
  
  try {
    console.log('Requesting image for keywords:', keywords);
    const response = await fetch(IMAGE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: keywords })
    });

    if (!response.ok) {
      throw new Error(`Image API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Image API response:', data);
    res.json(data);
  } catch (error) {
    console.error('Error getting image:', error);
    res.status(500).json({ 
      error: 'Failed to get image',
      details: error.message 
    });
  }
});

// Helper function for template context
const getTemplateContext = (templateId) => {
  const contexts = {
    business: 'Create a professional business landing page with services, value proposition, and call-to-action sections.',
    portfolio: 'Design a portfolio showcase with project highlights and skills sections.',
    blog: 'Create a content-focused blog layout with featured posts and categories.',
    'modern-landing': 'Design a modern landing page with hero section and key features.'
  };
  return contexts[templateId] || '';
};

// Helper function for image placeholder replacement
const replaceImagePlaceholders = (html, template) => {
  if (!template) return html;
  
  let imageIndex = 0;
  return html.replace(/<!-- GENERATE_IMAGE: (.*?) -->\s*<img[^>]*>|<img[^>]*src="IMAGE_URL_PLACEHOLDER"[^>]*>/g, (match, description) => {
    const altText = description || "Template image";
    let imageUrl;

    if (match.toLowerCase().includes('hero') || (description?.toLowerCase().includes('hero'))) {
      imageUrl = template.images.hero;
    } else if (description?.toLowerCase().includes('team') && template.images.team?.length) {
      imageUrl = template.images.team[imageIndex % template.images.team.length];
    } else if (description?.toLowerCase().includes('service') && template.images.services?.length) {
      imageUrl = template.images.services[imageIndex % template.images.services.length];
    } else if (description?.toLowerCase().includes('project') && template.images.projects?.length) {
      imageUrl = template.images.projects[imageIndex % template.images.projects.length];
    } else if (template.images.features?.[imageIndex]) {
      imageUrl = template.images.features[imageIndex];
    } else {
      imageUrl = template.images.about || template.previewImage;
    }

    imageIndex++;
    return `<img src="${imageUrl || template.previewImage}" alt="${altText}" class="w-full h-[300px] object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">`;
  });
};

// Design creation endpoint
app.post('/create-design', async (req, res) => {      
  const { text, template } = req.body;
  
  try {
    const templateContext = template ? getTemplateContext(template.id) : '';
    // Build conversation context
    const conversationContext = req.body.previousMessages?.map(msg => 
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n') || '';


    const userPrompt = `Current request: ${text}

Previous conversation:
${conversationContext}

Template context:
${templateContext}
${template ? `Colors: ${template.defaultContent.style.colors.join(', ')}
Font: ${template.defaultContent.style.fonts.join(', ')}` : ''}

Current HTML to modify:
${req.body.previousDesign || ''}

Please update the HTML based on the current request while preserving the overall structure and styling. Make specific changes requested while maintaining consistency with previous modifications.`;

    // Nebius prompt for code generation
    const nebiusPrompt = `You should strictly generate HTML code in response to the input, 
without offering guidance, examples, or suggestions.

It is imperative that the HTML code you generate is compatible and renderable with TailwindCSS. 
You will often receive existing HTML code from users. 
In such cases, incorporate your additions into the existing code, 
ensuring that the entire HTML code, inclusive of your modifications, 
is provided in the response. 

Your response should consist exclusively of HTML code, omitting markdown or explanatory text.
Make sure to import TailwindCSS into your HTML code. No images unless specifically requested.
Respond exclusively with HTML. No explanations needed.

Important: Do not include error containers or hidden elements in your responses. Focus on the main content structure.

Ensure the HTML code is fully compatible with TailwindCSS. If given existing HTML, integrate the changes while preserving the structure but updating the styling. Pay special attention to color-related requests in the conversation history. Respond exclusively with HTML, with no markdown or explanations.`;

    // ElevenLabs conversation prompt
    const elevenLabsPrompt = `You are Buffy, a friendly and enthusiastic AI web designer. Respond naturally to user requests as if you're having a conversation. Keep it short and friendly. Use at most one emoji. Focus on what you're doing for the user, not technical details. Upon follow ups, do not include any HTML code in your responses - keep responses conversational and focused on what you're doing.

Example responses:
Sure thing! Adding those fields for you right now! ✨
Of course, I'll get those new fields set up! 🌟
I'll add the phone and gender fields to your form! ✨`;

    // Get conversational response from ElevenLabs prompt
    const conversationCompletion = await client.chat.completions.create({
      temperature: 0.7,
      max_tokens: 50,
      model: "Qwen/Qwen2-VL-7B-Instruct",
      messages: [
        { role: "system", content: elevenLabsPrompt },
        { role: "user", content: userPrompt }
      ]
    });

    // Get HTML from Nebius with code-focused prompt
    const codeCompletion = await client.chat.completions.create({
      temperature: 0.2,
      max_tokens: 1000,
      model: "Qwen/Qwen2-VL-7B-Instruct",
      messages: [
        { role: "system", content: nebiusPrompt },
        { role: "user", content: userPrompt }
      ]
    });

    // Extract HTML content and AI response
    let html = codeCompletion.choices[0].message.content;
    let aiResponse = conversationCompletion.choices[0].message.content.replace(/^"|"$/g, '').trim();

    if (!aiResponse) {
      // Fallback to funny messages if no AI response
      const funnyMessages = [
        "Design magic complete! Here's what I created...",
        "Fresh design served! Take a look...",
        "Design ready for launch! Check it out...",
        "Design crafted with care! What do you think..."
      ];
      aiResponse = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
    }

    if (!html) {
      throw new Error('No HTML content received from AI');
    }

    html = replaceImagePlaceholders(html, template);    

    const htmlWithStyles = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Generated with WebWeaver AI">
  <script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp"></script>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
  
  <!-- Error Handling -->
  <script>
    window.onerror = function(msg, url, line) {
      console.error('JavaScript error:', msg, 'at line:', line);
      return false;
    };
    
    // Handle Tailwind Loading
    document.addEventListener('DOMContentLoaded', function() {
      if (!window.tailwind) {
        document.body.innerHTML = '<div class="p-4 bg-red-100 text-red-700">Error: Tailwind failed to load</div>' + document.body.innerHTML;
      }
    });
  </script>

  <!-- Dynamic Tailwind Config -->
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: ${template ? JSON.stringify({
            primary: template.defaultContent.style.colors[0],
            secondary: template.defaultContent.style.colors[1],
            accent: template.defaultContent.style.colors[2]
          }) : `{
            primary: '#3b82f6',
            secondary: '#64748b',
            accent: '#f59e0b'
          }`},
          fontFamily: ${template ? JSON.stringify({
            sans: template.defaultContent.style.fonts
          }) : `{
            sans: ['Inter', 'system-ui']
          }`}
        }
      }
    }
  </script>

  <!-- Base Styles -->
  <style>
    /* Reset */
    body { margin: 0; padding: 0; min-height: 100vh; }
    * { transition: all 0.2s ease-in-out; }

    /* Fallback Styles */
    .fallback-bg { background-color: #f8fafc; }
    .fallback-text { color: #1e293b; }
    
    /* Loading States */
    .loading-skeleton {
      background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }
    
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  </style>
</head>
<body class="bg-white min-h-screen font-sans antialiased">
  <!-- Error Boundary -->
  <div id="error-container" class="hidden fixed top-0 left-0 right-0 bg-red-100 text-red-700 p-4 text-center"></div>
  
  <!-- Main Content -->
  <div class="w-full">
    ${html}
  </div>

  <!-- Fallback Content -->
  <div id="fallback-content" class="hidden p-8">
    <div class="max-w-2xl mx-auto text-center">
      <h2 class="text-2xl font-bold mb-4">Something went wrong</h2>
      <p class="text-gray-600">Please try refreshing the page or contact support if the problem persists.</p>
    </div>
  </div>

  <!-- Error Handling Script -->
  <script>
    function handleError(error) {
      console.error('Runtime error:', error);
      document.getElementById('error-container').classList.remove('hidden');
      document.getElementById('error-container').textContent = 'An error occurred: ' + error.message;
    }

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    // Handle missing images
    document.addEventListener('error', function(e) {
      if (e.target.tagName === 'IMG') {
        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f3f4f6"/%3E%3Ctext x="50" y="50" font-family="system-ui" font-size="12" fill="%236b7280" text-anchor="middle" dy=".3em"%3EImage not found%3C/text%3E%3C/svg%3E';
        e.target.classList.add('fallback-bg');
      }
    }, true);
  </script>
</body>
</html>`;

    // Add context to the AI response
    if (template) {
      aiResponse += ` I've used the ${template.name} template with its predefined styles and components.`;
    }

    res.json({
      aiResponse,
      html: htmlWithStyles,
      imageUrl: template?.previewImage || 'https://via.placeholder.com/800x600?text=Preview',
      designChoices: {
        layout: html.match(/<!-- Layout: (.*?) -->/)?.[1] || '',
        colors: html.match(/<!-- Colors: (.*?) -->/)?.[1] || '',
        features: html.match(/<!-- Features: (.*?) -->/)?.[1] || ''
      }
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ 
      error: 'Failed to generate design',
      details: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    details: err.message 
  });
});

// Start server
const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});