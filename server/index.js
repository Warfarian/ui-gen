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

    // First, get AI response
    const completion = await client.chat.completions.create({
      temperature: 0,
      model: "meta-llama/Llama-3.3-70B-Instruct",
      messages: [
        {
          role: "system",
          content: `You're a friendly and talented web designer collaborating with a project manager. Your task is to turn tree-structured JSON data describing a webpage layout into valid HTML with TailwindCSS. Keep the tone casual and conversational, like you're brainstorming with a teammate.

                    Goals:

                    Convert the JSON into HTML styled with TailwindCSS.
                    Don't mention the JSON structure—just say things like, "Based on what you said..."
                    Keep the page responsive and visually appealing.
                    Follow the layout and sections in the JSON to ensure everything is accurately represented with proper HTML semantics.
                    Add accessibility features (like aria-labels) when needed.
                    Response Style:

                    Talk like you're collaborating with a PM. Keep it concise but focused.
                    Example: "Alright, here's what I've created for you. Let me know if you want any tweaks!" is more than enough. One or two lines. Do not have to go into detail about what you created.
                    Avoid:

                    Lengthy explanations about "how" or "why." Be clear about design choices when needed, but keep it short and to the point.`
        },
        {
          role: "user",
          content: text
        }
      ]
    });

    console.log('Received AI response:', completion.choices[0].message.content);

    // Then call Magic Loops API
    const magicLoopsUrl = 'https://magicloops.dev/api/loop/72f6c668-b246-4d95-bd83-a8525aeddf01/run';
    console.log('Calling Magic Loops API...');
    
    const magicLoopsResponse = await fetch(magicLoopsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        command: text,
        aiResponse: completion.choices[0].message.content 
      })
    });

    if (!magicLoopsResponse.ok) {
      throw new Error(`Magic Loops API responded with status: ${magicLoopsResponse.status}`);
    }

    const responseJson = await magicLoopsResponse.json();
    console.log('Magic Loops API response:', responseJson);
    
    res.json({
      ...responseJson,
      aiResponse: completion.choices[0].message.content
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
