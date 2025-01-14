import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

const IMAGE_API_URL = 'https://magicloops.dev/api/loop/0e90271e-dd9d-4745-b253-a82ef4286126/run';
const app = express();
const port = 3001;
dotenv.config();

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
    const userPrompt = `${templateContext}${text}
${template ? `Colors: ${template.defaultContent.style.colors.join(', ')}
Font: ${template.defaultContent.style.fonts.join(', ')}` : ''}`;

    const systemPrompt = `You are an expert web developer specializing in modern, responsive design with TailwindCSS.

COMPONENT STRUCTURE:
1. Always use semantic HTML5 elements (nav, header, main, section, footer)
2. Follow this structure for sections:
   <!-- Section: [NAME] -->
   <section class="[BASE_CLASSES]">
     <div class="container mx-auto px-4">
       [CONTENT]
     </div>
   </section>

TEMPLATE GUIDELINES:
1. Navigation:
   - Always include responsive navigation
   - Use template.components.navigation patterns
   - Include mobile menu toggle

2. Hero Sections:
   - Full-width design
   - Responsive text sizing
   - Clear call-to-action
   - Optional background image/pattern

3. Content Sections:
   - Consistent padding/margins
   - Grid/Flex for layout
   - Responsive breakpoints
   - Proper heading hierarchy

4. Interactive Elements:
   - Hover/focus states
   - Smooth transitions
   - Accessible buttons/links
   - Loading states

TAILWIND PATTERNS:
1. Layout:
   - Container: "container mx-auto px-4"
   - Grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
   - Stack: "space-y-4 md:space-y-6"

2. Components:
   - Cards: "group rounded-lg bg-white shadow-md hover:shadow-xl transition-all"
   - Buttons: "px-6 py-3 rounded-lg font-medium transition-all"
   - Images: "w-full h-full object-cover rounded-lg"

3. Typography:
   - Headings: "text-3xl md:text-4xl lg:text-5xl font-bold"
   - Body: "text-base md:text-lg text-gray-600"
   - Links: "text-primary hover:text-primary-dark transition-colors"

ERROR HANDLING:
1. Always include fallback classes
2. Use optional chaining for dynamic content
3. Provide alt text for images
4. Include ARIA labels for accessibility

RESPONSIVE DESIGN:
1. Mobile-first approach
2. Use standard breakpoints: sm, md, lg, xl
3. Stack on mobile, grid on larger screens
4. Adjust text sizes across breakpoints

OUTPUT FORMAT:
1. Return complete HTML document
2. Include TailwindCSS CDN
3. Add required meta tags
4. Include Font Awesome for icons

Remember to:
- Use template colors and fonts if provided
- Implement proper spacing hierarchy
- Add subtle animations/transitions
- Ensure accessibility compliance
- Include proper meta tags`;

    const completion = await client.chat.completions.create({
      temperature: 0.5,
      max_tokens: 1000,
      model: "Qwen/Qwen2-VL-7B-Instruct",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    });

    // Extract AI response message
    const funnyMessages = [
      "Design magic complete! Here's what I created...",
      "Fresh design served! Take a look...",
      "Design ready for launch! Check it out...",
      "Design crafted with care! What do you think..."
    ];
    const aiResponse = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];

    // Extract HTML content
    let html = completion.choices[0].message.content;
    const htmlStartIndex = html.indexOf('<!DOCTYPE html>');
    if (htmlStartIndex === -1) {
      html = html.replace(/```html\n|```\n|```/g, '').trim();
    } else {
      html = html.substring(htmlStartIndex);
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

    res.json({
      aiResponse: funnyMessages[Math.floor(Math.random() * funnyMessages.length)],
      html: htmlWithStyles,
      imageUrl: template?.previewImage || 'https://via.placeholder.com/800x600?text=Preview',
      designChoices: {
        layout: completion.choices[0].message.content.match(/<!-- Layout: (.*?) -->/)?.[1] || '',
        colors: completion.choices[0].message.content.match(/<!-- Colors: (.*?) -->/)?.[1] || '',
        features: completion.choices[0].message.content.match(/<!-- Features: (.*?) -->/)?.[1] || ''
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