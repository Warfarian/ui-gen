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

    // Send request directly to LLaMA
    console.log('Sending request to LLaMA...');
    const completion = await client.chat.completions.create({
      temperature: 0,
      model: "meta-llama/Llama-3.3-70B-Instruct",
      messages: [
        {
          role: "system",
          content: `You are a skilled web designer and developer with expertise in HTML, CSS, and content creation. Your role is to interpret user-provided input or tree-structured JSON data describing a webpage layout and turn it into a fully functional, engaging HTML page styled with custom CSS. Your approach should be casual, friendly, and collaborative, as if brainstorming ideas with a project manager.

          Goals:
          
          Generate Real Content:
          Use meaningful, specific, and engaging content tailored to the website's theme.
          Replace placeholders with realistic details (headlines, descriptions, business information, and image links from unsplash.com).

          Stylish, Modern Design:
          Write CSS within a <style> tag in the <head> section of the HTML file.
          Use modern CSS techniques (e.g., flexbox, grid, custom properties, gradients, animations).
          Implement engaging visual effects like glassmorphism, hover animations, and smooth transitions.
          Maintain responsive design using media queries.

          Accessibility & Usability:
          Use semantic HTML5 elements and proper accessibility attributes (e.g., aria-labels, alt text).
          Ensure sufficient contrast ratios and keyboard navigation support.

          User Collaboration:
          Present design choices conversationally and iteratively (e.g., "I’ve added a bold header and a gradient background—let me know what you think!")
          Only make incremental changes based on user feedback without starting from scratch.`
        },
        {
          role: "user",
          content: `As an expert web designer, create a modern, visually striking webpage based on this description: "${text}".

          Key Requirements:

          Content & Copy:
          - Generate REAL, relevant content (no Lorem Ipsum)
          - Write compelling headlines and copy that match the business/purpose
          - Include realistic business details, prices, features, or testimonials as appropriate
          - Use engaging calls-to-action
          
          Visual Design:
          - Create a clean, professional layout with proper visual hierarchy
          - Use a cohesive, modern color scheme (specify exact colors)
          - Include appropriate high-quality images from Unsplash
          - Add subtle animations and hover effects for interactivity
          - Implement modern design patterns (cards, gradients, shadows, etc.)
          
          Technical Implementation:
          - Use semantic HTML5 elements (<header>, <nav>, <main>, etc.)
          - Implement responsive design using Tailwind CSS
          - Ensure accessibility (ARIA labels, proper contrast, semantic structure)
          - Add smooth transitions and micro-interactions
          - Include Font Awesome icons where appropriate
          
          Additional Features:
          - Add a sticky navigation header
          - Include hover states for interactive elements
          - Implement proper spacing and padding
          - Use modern typography with proper font hierarchy
          - Add subtle background patterns or gradients
          
          Important Notes:
          - Focus on creating a cohesive, professional design
          - Ensure all content is relevant to the page purpose
          - Make the design unique and memorable
          - Include comments explaining key design decisions
          
          Return only the raw HTML with embedded styles. No markdown or code blocks.`
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

    // Send both the AI response and the HTML with design context
    res.json({
      aiResponse: "I've created a custom design based on your request. I used a modern, professional style with real content and proper visual hierarchy. Feel free to ask for specific adjustments to the layout, colors, content, or any other aspect!",
      html: rawHtml,
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
