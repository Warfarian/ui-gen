import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

const app = express();
const port = 3001;
dotenv.config();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite's default development port
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Initialize OpenAI client
const client = new OpenAI({
    baseURL: 'https://api.studio.nebius.ai/v1/',
    apiKey: process.env.NEBIUS_API_KEY,
});

// Route to handle design creation
app.post('/create-design', async (req, res) => {
  const { text } = req.body;
  
  try {
    console.log('Received request with text:', text);

    // First call Magic Loops API to get the structure
    const magicLoopsUrl = 'https://magicloops.dev/api/loop/72f6c668-b246-4d95-bd83-a8525aeddf01/run';
    console.log('Calling Magic Loops API...');
    
    const magicLoopsResponse = await fetch(magicLoopsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ command: text })
    });

    if (!magicLoopsResponse.ok) {
      throw new Error(`Magic Loops API responded with status: ${magicLoopsResponse.status}`);
    }

    const responseJson = await magicLoopsResponse.json();
    console.log('Magic Loops API response:', responseJson);

    // Then send the structure to LLaMA to generate HTML
    console.log('Sending request to LLaMA...');
    const completion = await client.chat.completions.create({
      temperature: 0,
      model: "meta-llama/Llama-3.3-70B-Instruct",
      messages: [
        {
          role: "system",
          content: `You are an expert web developer, designer, and content creator specializing in TailwindCSS. Your task is to generate a complete HTML webpage with extensive TailwindCSS styling and engaging, relevant content based on the provided layout structure.

          Content Creation Rules:
          - Generate REAL, specific content related to the website type (no lorem ipsum or placeholders)
          - Create unique, engaging headlines that match the business type
          - Write detailed, realistic descriptions and paragraphs
          - Use industry-appropriate terminology and tone
          - Include specific calls-to-action relevant to the business
          - Generate realistic business details (address, hours, contact info)

          Styling Requirements:
          - Use comprehensive TailwindCSS classes for ALL styling - no inline styles or CSS
          - Include hover effects, transitions, and animations using Tailwind classes
          - Use Tailwind's color palette effectively (primary colors, shades, etc.)
          - Implement proper spacing using Tailwind's padding/margin utilities
          - Use Tailwind's flexbox and grid classes for layouts
          - Include responsive design using Tailwind's breakpoint prefixes (sm:, md:, lg:, xl:)
          - Add shadows, rounded corners, and other visual effects using Tailwind
          - Use Tailwind's typography classes for text styling
          
          Content Requirements:
          - Generate semantic HTML5 with proper accessibility attributes
          - Create realistic, engaging content relevant to the website type
          - Use compelling headlines, descriptions, and calls-to-action
          - Include high-quality images from unsplash.com relevant to the content
          - Ensure proper contrast ratios for accessibility
          
          Important:
          - Every element must have appropriate Tailwind classes
          - Use modern design patterns (cards, gradients, overlays, etc.)
          - Include interactive elements with hover/focus states
          - Ensure smooth transitions between responsive breakpoints
          - Return only raw HTML without any markdown or code blocks`
        },
        {
          role: "user",
          content: `Generate a complete HTML webpage for this layout structure: ${JSON.stringify(responseJson)}. 
          Do not include any markdown code blocks or backticks in your response. Return only the raw HTML.`
        }
      ]
    });

    console.log('Received AI response:', {
      content: completion.choices[0].message.content,
      model: completion.model,
      usage: completion.usage,
      finishReason: completion.choices[0].finish_reason
    });

    // Get the raw HTML from LLaMA and wrap it with necessary tags
    const rawHtml = completion.choices[0].message.content.replace(/```html|```/g, '').trim();
    
    // Wrap the HTML with proper doctype and Tailwind CSS with configuration
    const wrappedHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Website</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: '#3b82f6',
              secondary: '#64748b',
            },
          },
        },
      }
    </script>
    <style type="text/tailwindcss">
      @layer utilities {
        .text-shadow {
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        }
      }
    </style>
</head>
<body>
    ${rawHtml}
</body>
</html>`;

    // Send both the AI response and the wrapped HTML
    res.json({
      aiResponse: "I've generated the HTML based on your request. Let me know if you'd like any adjustments!",
      html: wrappedHtml
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
