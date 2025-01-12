const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const app = express();
const port = 3000;
require('dotenv').config();

// Middleware
app.use(cors());
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
    // First, get AI response
    const completion = await client.chat.completions.create({
      temperature: 0,
      model: "meta-llama/Llama-3.3-70B-Instruct",
      messages: [
        {
          role: "system",
          content: `You are a friendly and talented web designer working with a project manager. Your task is to interpret tree-structured JSON data that describes a webpage layout and turn it into valid HTML with TailwindCSS. Keep your tone casual and conversational, like you are brainstorming and collaborating with a teammate.
                    Goals:
                    Convert the JSON structure into HTML styled with TailwindCSS.
                    Keep the webpage responsive and visually appealing.
                    Follow the structure of the JSON, ensuring each section is accurately represented with proper HTML semantics.
                    Add accessibility features like aria-labels when needed.
                    JSON Structure:
                    layout: The overall page layout type (e.g., homepage, about page).
                    sections: An array of objects where:
                    name specifies the type of section (e.g., hero, footer).
                    content is the text or elements to include in that section.
                    Response Style:
                    Talk like a designer collaborating with a PM.
                    Be casual but focused, like:
                    "Alright, here’s what I’ve got for the hero section: I gave it a big, bold header and centered the text to make it pop. For the footer, I added a clean look with social media icons. Let me know if you want tweaks!"

                    Skip lengthy explanations about "how" or "why," but be clear about design choices if discussing changes.`
        },
        {
          role: "user",
          content: text
        }
      ]
    });

    // Then call Magic Loops API
    const magicLoopsUrl = 'https://magicloops.dev/api/loop/72f6c668-b246-4d95-bd83-a8525aeddf01/run';
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

    const responseJson = await magicLoopsResponse.json();
    console.log('Magic Loops API response:', responseJson);
    
    res.json({
      ...responseJson,
      aiResponse: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Failed to generate design' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
