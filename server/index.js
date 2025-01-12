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
          content: `You are an expert web developer. Your task is to generate a complete HTML webpage with TailwindCSS styling based on the provided layout structure.

          Requirements:
          - Generate semantic HTML5 with proper accessibility attributes
          - Use TailwindCSS classes for all styling
          - Make the design fully responsive
          - Include realistic content and images relevant to the website type
          - Return ONLY the complete HTML code without any explanations
          
          The response should be valid HTML that can be directly rendered in a browser with TailwindCSS included.`
        },
        {
          role: "user",
          content: `Generate a complete HTML webpage for this layout structure: ${JSON.stringify(responseJson)}`
        }
      ]
    });

    console.log('Received AI response:', {
      content: completion.choices[0].message.content,
      model: completion.model,
      usage: completion.usage,
      finishReason: completion.choices[0].finish_reason
    });

    // Send both the AI response and the generated HTML
    res.json({
      aiResponse: "I've generated the HTML based on your request. Let me know if you'd like any adjustments!",
      html: completion.choices[0].message.content
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
