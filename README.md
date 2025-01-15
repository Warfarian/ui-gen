# Ctrl + Alt + Design

[VOTE FOR ME](https://devpost.com/software/ctrl-alt-design)

An AI-powered web development tool that transforms voice commands into beautiful, responsive websites.
Speak, type, or imagine—our AI transforms your ideas into stunning, responsive UIs in seconds. From voice-guided creation to real-time rendering, design has never been this effortless.

## Features

- **Voice-Controlled Design**: Create websites by speaking naturally to our AI assistant
- **Real-time Preview**: See your website take shape instantly as you describe it
- **Professional Templates**: Choose from pre-built templates for quick starts
- **Responsive Design**: Preview your site across desktop, tablet, and mobile views
- **Code Export**: Download production-ready HTML with TailwindCSS styling
- **Image Generation**: Generate images as needed or get them from the unsplash API using magic loops

## Tech Stack

- **Frontend**: React + Vite, TailwindCSS, Monaco Editor
- **Backend**: Express.js
- **AI Services**: 
  - ElevenLabs for natural voice interaction
  - Nebius AI for intelligent code generation
  - Magic Loops for image generation using GPT 4o or for fetching from unsplash API

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/ctrl-alt-design.git
```

2. Install dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables
```bash
# Create .env in server directory
ELEVENLABS_API_KEY=your_key_here
ELEVENLABS_VOICE_ID=your_voice_id
NEBIUS_API_KEY=your_key_here
```

4. Start the development servers
```bash
# Start backend server (from server directory)
npm start

# Start frontend development server (from client directory)
npm run dev
```

5. Open `http://localhost:5173` in your browser

## Usage

1. Select a template (optional)
2. Click "Talk to Buffy" or type your website description
3. Watch as your website is generated in real-time
4. Preview in different device sizes
5. Download the generated code
6. Set up your own api endpoint using magicloops if you want to use the image gen feature

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request




