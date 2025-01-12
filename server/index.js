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
app.use(cors({
  origin: 'http://localhost:5173', // Vite's default development port
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

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

          Image Requirements:
          - Include ONE hero image at the top of the page
          - Place a detailed image description in a special comment tag:
          <!-- GENERATE_IMAGE: A modern office space with floor-to-ceiling windows, natural light streaming in, minimalist furniture -->
          - Make the description vivid and specific for better image generation
          - Include mood, style, and important details in the description
          - Place the comment right before the hero section
          - Follow the comment with an img tag that has appropriate classes and alt text
          
          Image Generation:
          - Use <!-- GENERATE_IMAGE: [description] --> comments to request AI-generated images
          - Make image descriptions detailed and specific
          - Request multiple images if needed for different sections
          - Each GENERATE_IMAGE comment will trigger a unique image generation
          - Follow each comment with an img tag using IMAGE_URL_PLACEHOLDER as src
          
          Example:
          <!-- GENERATE_IMAGE: A luxurious modern office with panoramic city views, sleek furniture, warm lighting -->
          <img src="IMAGE_URL_PLACEHOLDER" alt="Modern office space" class="hero-image w-full">

          Key Requirements:

          Content & Copy:
          - Generate REAL, relevant content (no Lorem Ipsum)
          - Write compelling headlines and copy that match the business/purpose
          - Include realistic business details, prices, features, or testimonials as appropriate
          - Use engaging calls-to-action
          
          Visual Design:
          - Create a clean, professional layout with proper visual hierarchy
          - Use a cohesive, modern color scheme (specify exact colors)
          - Include appropriate high-quality images by describing what should be generated
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
          
          Return only the raw HTML with embedded styles. No markdown or code blocks.
          
          Example image usage:
          <!-- GENERATE_IMAGE: A stunning modern workspace with natural light -->
          <img src="IMAGE_URL_PLACEHOLDER" alt="Hero workspace" class="w-full h-[400px] object-cover rounded-lg shadow-lg">
          `
        }
      ]
    });

    console.log('Received AI response:', {
      content: completion.choices[0].message.content,
      model: completion.model,
      usage: completion.usage,
      finishReason: completion.choices[0].finish_reason
    });

    // Get the raw HTML from LLaMA
    let html = completion.choices[0].message.content.replace(/```html|```/g, '').trim();

    // Helper function to extract just the URL from the response data
    const extractImageUrl = (response) => {
      try {
        if (typeof response === 'string') {
          const jsonMatch = response.match(/\{.*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.data?.[0]?.url) {
              return parsed.data[0].url;
            }
          }
        }
        if (response.data?.[0]?.url) return response.data[0].url;
        if (response.imageUrl) return response.imageUrl;
      } catch (error) {
        console.error('Error extracting image URL:', error);
      }
      return 'https://via.placeholder.com/800x600?text=Image+Generation+Failed';
    };

    // Find all image generation requests
    const imageRegex = /<!-- GENERATE_IMAGE: (.*?) -->/g;
    const imagePromises = new Map();
    const imagePlaceholders = [];
    let match;

    while ((match = imageRegex.exec(html)) !== null) {
      const imageDescription = match[1];
      imagePlaceholders.push(match[0]);
      
      // Only generate new image if we haven't generated one for this exact description
      if (!imagePromises.has(imageDescription)) {
        imagePromises.set(
          imageDescription,
          fetch('http://localhost:3001/get-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ keywords: imageDescription })
          }).then(res => res.json())
        );
      }
    }

    // Wait for all unique images to be generated
    const uniqueImageResults = new Map();
    for (const [desc, promise] of imagePromises) {
      const result = await promise;
      uniqueImageResults.set(desc, result.imageUrl || 'https://via.placeholder.com/800x600?text=Image+Generation+Failed');
    }

    // Replace all placeholders with generated image URLs
    for (const placeholder of imagePlaceholders) {
      const desc = placeholder.match(/<!-- GENERATE_IMAGE: (.*?) -->/)[1];
      const imageUrl = uniqueImageResults.get(desc);
      const extractedUrl = extractImageUrl(imageUrl);
      
      html = html.replace(placeholder, ''); // Remove the comment
      html = html.replace(/(<img[^>]*src=")IMAGE_URL_PLACEHOLDER("[^>]*)(>)/, 
        (match, start, middle, end) => {
          // Add size classes based on the context
          if (match.includes('hero-image')) {
            return `${start}${extractedUrl}${middle} class="w-full h-[400px] object-cover rounded-lg shadow-lg"${end}`;
          } else if (match.includes('image-small')) {
            return `${start}${extractedUrl}${middle} class="w-full h-[200px] object-cover rounded-lg shadow-sm"${end}`;
          } else {
            return `${start}${extractedUrl}${middle} class="w-full h-[300px] object-cover rounded-lg shadow-md"${end}`;
          }
        }
      );
    }

    // Get the first generated image URL for the preview for the preview
    const firstImageUrl = extractImageUrl(Array.from(uniqueImageResults.values())[0]);

    // Send the response with generated images
    res.json({
      aiResponse: "I've created a custom design based on your request. I used a modern, professional style with real content and proper visual hierarchy. Feel free to ask for specific adjustments to the layout, colors, content, or any other aspect!",
      html: html,
      imageUrl: firstImageUrl, // Add the image URL directly to the response
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
