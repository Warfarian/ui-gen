import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Image API endpoint
const IMAGE_API_URL = 'https://magicloops.dev/api/loop/0e90271e-dd9d-4745-b253-a82ef4286126/run';

const app = express();
const port = 3001;
dotenv.config();

// Middleware
// CORS configuration
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Access-Control-Allow-Origin']
}));

// Add OPTIONS handling for preflight requests
app.options('*', cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Route to handle image generation
app.post('/get-image', async (req, res) => {
  const { keywords } = req.body;
  
  try {
    console.log('Requesting image for keywords:', keywords);
    const response = await fetch(IMAGE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
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

// Initialize OpenAI client with vision capabilities
const client = new OpenAI({
  baseURL: 'https://api.studio.nebius.ai/v1/',
  apiKey: process.env.NEBIUS_API_KEY,
});

// Helper function to process image data
const processImageInput = async (imageData) => {
  // Convert image data to base64 if it's not already
  const base64Image = imageData.startsWith('data:') 
    ? imageData 
    : `data:image/jpeg;base64,${imageData}`;
  
  return base64Image;
};

// Helper function to extract image URL from response
const extractImageUrl = (response) => {
  try {
    // If response is undefined or null, return placeholder
    if (!response) {
      return 'https://via.placeholder.com/800x600?text=Image+Generation+Failed';
    }

    // If response is a string, try to parse JSON from it
    if (typeof response === 'string') {
      try {
        const jsonMatch = response.match(/\{.*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed?.data?.[0]?.url) {
            return parsed.data[0].url;
          }
        }
      } catch (parseError) {
        console.error('Error parsing JSON from string:', parseError);
      }
    }

    // If response is an object, try different known formats
    if (response?.data?.[0]?.url) {
      return response.data[0].url;
    }
    if (response?.imageUrl) {
      return response.imageUrl;
    }
    if (response?.url) {
      return response.url;
    }

    // If no URL found, return placeholder
    return 'https://via.placeholder.com/800x600?text=Image+Generation+Failed';
  } catch (error) {
    console.error('Error extracting image URL:', error);
    return 'https://via.placeholder.com/800x600?text=Image+Generation+Failed';
  }
};

// Route to handle design creation
app.post('/create-design', async (req, res) => {      const { text, previousDesign, template, referenceImage } = req.body;
  
  try {
    console.log('Received request with text:', text);
    console.log('Previous design context:', previousDesign);

    let systemPrompt = `You are a friendly web design assistant with visual understanding capabilities. Start your response with a conversational message about what you're creating, wrapped in an HTML comment like this:
<!-- AI Response: I'm creating a modern business website with clean lines and professional styling... -->

Then create modern, responsive web designs with:

1. Content:
- Use meaningful, specific content tailored to the theme
- Generate real headlines and descriptions
- Replace placeholders with realistic details

2. Design:
- Use semantic HTML5 and responsive Tailwind CSS
- Create a sticky header with blur effect backdrop
- Implement mobile-responsive menu with hamburger
- Add smooth hover animations and transitions
- Ensure proper spacing and visual hierarchy

3. Technical:
- Use proper HTML structure and semantic elements
- Implement responsive breakpoints
- Add hover states and transitions
- Ensure accessibility compliance
- Include proper meta tags

4. Style:
- Follow template color scheme
- Maintain consistent typography
- Use proper spacing hierarchy
- Add subtle animations
- Ensure visual harmony

5. Navigation:
- Sticky header with blur effect backdrop
- Mobile-responsive menu with hamburger
- Smooth hover animations
- Proper spacing and alignment
- Call-to-action button
- Responsive breakpoints

${previousDesign ? `Previous Design Context:
${previousDesign}

Important:
- Preserve overall structure
- Only modify requested changes
- Keep existing content unless specified
- Maintain template guidelines` : ''}

Example image usage:
<!-- GENERATE_IMAGE: A stunning modern workspace with natural light -->
<img src="IMAGE_URL_PLACEHOLDER" alt="Hero workspace" class="w-full h-[400px] object-cover rounded-lg shadow-lg">`;

    let messages = [
      { role: "system", content: systemPrompt }
    ];

    // If there's a reference image, add it to the conversation
    if (referenceImage) {
      const processedImage = await processImageInput(referenceImage);
      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: "Here's a reference image for the design style I'm looking for:"
          },
          {
            type: "image",
            image_url: processedImage
          }
        ]
      });
    }

    // Add the main design request
    const userPrompt = `As an expert web designer, create a modern, visually striking webpage based on this description: "${text}"${referenceImage ? " incorporating elements and style inspiration from the reference image provided" : ""}.
    
    Template Information:
    Name: ${template.name}
    Category: ${template.id}
    Required Sections: ${template.defaultContent.sections.join(', ')}
    Color Scheme: ${template.defaultContent.style.colors.join(', ')}
    Font Stack: ${template.defaultContent.style.fonts.join(', ')}
    
    Template Guidelines:
    1. Structure:
       - Implement ALL required sections in the specified order
       - Each section must be clearly defined with semantic HTML5 elements
       - Maintain consistent spacing and padding between sections
    
    2. Styling:
       - Use ONLY the provided color scheme
       - Apply the specified font stack for typography
       - Ensure consistent styling patterns throughout the page
    
    3. Content Requirements:
       - Generate SPECIFIC, RELEVANT content based on the user's request
       - NO lorem ipsum or generic placeholder text
       - Write compelling headlines that directly address the user's needs
       - Create engaging descriptions that match the business/purpose
       - Include realistic details (e.g., actual features, benefits, or testimonials)
       - Ensure all content feels authentic and purposeful
       
    4. Response Style:
       - Analyze the user's request and provide a contextual, friendly response
       - Highlight specific design choices made based on their requirements
       - Point out how the design elements support their goals
       - Suggest potential refinements or alternatives they might consider
       - Make the response personal and relevant to their specific case

    Return only the raw HTML with embedded styles. No markdown or code blocks.
    
    For the AI response message, create a personalized message that:
    1. Acknowledges their specific request
    2. Highlights key design decisions made
    3. Points out how the design supports their goals
    4. Suggests potential refinements they might consider
    5. Invites feedback on specific aspects`;

    const completion = await client.chat.completions.create({
      temperature: 0,
      model: "Qwen/Qwen2-VL-7B-Instruct",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    });

    console.log('Received AI response:', {
      model: completion.model,
      usage: completion.usage,
      finishReason: completion.choices[0].finish_reason
    });

    // Get the raw HTML from LLaMA
    let html = completion.choices[0].message.content.replace(/```html|```/g, '').trim();

    // Replace image placeholders with template images
    let imageIndex = 0;
    html = html.replace(/<!-- GENERATE_IMAGE: (.*?) -->\s*<img[^>]*>|<img[^>]*src="IMAGE_URL_PLACEHOLDER"[^>]*>/g, (match, description) => {
      let imageUrl;
      let altText = description || "Template image";
      
      // Select appropriate image based on context and description
      if (match.toLowerCase().includes('hero') || (description && description.toLowerCase().includes('hero'))) {
        imageUrl = template.images.hero;
      } else if (description && description.toLowerCase().includes('team') && template.images.team) {
        imageUrl = template.images.team[imageIndex % template.images.team.length];
      } else if (description && description.toLowerCase().includes('service') && template.images.services) {
        imageUrl = template.images.services[imageIndex % template.images.services.length];
      } else if (description && description.toLowerCase().includes('project') && template.images.projects) {
        imageUrl = template.images.projects[imageIndex % template.images.projects.length];
      } else if (template.images.features && imageIndex < template.images.features.length) {
        imageUrl = template.images.features[imageIndex];
      } else {
        imageUrl = template.images.about || template.previewImage;
      }
      
      if (!imageUrl) {
        console.warn('No image URL found for template section, using preview image');
        imageUrl = template.previewImage;
      }

      console.log('Using image:', imageUrl, 'for description:', description || 'default image');
      
      imageIndex++;
      return `<img src="${imageUrl}" alt="${altText}" class="w-full h-[300px] object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">`;
    });

    // Verify all IMAGE_URL_PLACEHOLDER have been replaced
    if (html.includes('IMAGE_URL_PLACEHOLDER')) {
      console.warn('Found remaining IMAGE_URL_PLACEHOLDER in HTML after replacement');
      // Replace any remaining placeholders with the preview image
      html = html.replace(/IMAGE_URL_PLACEHOLDER/g, template.previewImage);
    }

    const firstImageUrl = template.previewImage;

    // Extract AI response message if present in a comment
    const aiResponseMatch = completion.choices[0].message.content.match(/<!-- AI Response: (.*?) -->/s);
    let aiResponse;
    
    if (aiResponseMatch) {
      // Remove any HTML/style tags from the response
      aiResponse = aiResponseMatch[1].replace(/<[^>]*>/g, '').trim();
    } else {
      // Fallback to first non-HTML line if no comment
      aiResponse = completion.choices[0].message.content
        .split('\n')
        .find(line => !line.includes('<') && !line.includes('>') && line.trim())
        ?.trim() || "I've created your design based on your requirements. Let me know if you'd like any adjustments.";
    }

    // Extract CSS from the response if present
    const cssMatch = html.match(/\/\* styles\.css \*\/([\s\S]*?)(?=<|$)/);
    const css = cssMatch ? cssMatch[1].trim() : '';
    
    // Remove the CSS from the HTML
    html = html.replace(/\/\* styles\.css \*\/[\s\S]*?(?=<|$)/, '');

    const htmlWithStyles = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            ${css}
            body {
              font-family: 'Montserrat', system-ui, sans-serif;
              line-height: 1.5;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 1200px;
              margin: 0 auto;
              padding: 2rem;
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>`;

    res.json({
      aiResponse: aiResponse,
      html: htmlWithStyles,
      imageUrl: firstImageUrl,
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

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    details: err.message 
  });
});

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});