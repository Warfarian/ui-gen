import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const LandingPage = () => {  const playWelcomeMessage = async () => {
    try {
      const response = await fetch('http://localhost:3001/synthesize-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: "Welcome to Ctrl Alt Design! I'm your AI assistant, ready to help you create stunning websites. Would you like to start building, or learn more about UI/UX design?"
        })
      });

      if (!response.ok) {
        throw new Error(`Voice synthesis failed: ${response.statusText}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };
      
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Autoplay failed:', error);
          // Only create button if autoplay fails
          const playButton = document.createElement('button');
          playButton.className = 'fixed top-4 right-4 px-4 py-2 bg-pastel-blue text-gray-700 rounded-lg shadow-md hover:bg-pastel-lavender transition-colors z-50 font-medium';
          playButton.textContent = '🔊 Play Welcome Message';
          playButton.onclick = playWelcomeMessage;
          document.body.appendChild(playButton);
        });
      }
    } catch (error) {
      console.error('Error playing welcome message:', error);
    }
  };

  useEffect(() => {
    // Attempt to play welcome message immediately
    playWelcomeMessage();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-blue via-pastel-lavender to-pastel-pink relative overflow-hidden">
      <div className="container mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20 fade-in">
          <h1 className="text-8xl font-teko mb-6 relative">
            <span className="bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent drop-shadow-lg">
              Ctrl + Alt + Design
            </span>
            <span className="block text-4xl font-teko text-gray-700 mt-4 drop-shadow">
              Where AI Meets Design Excellence
            </span>
          </h1>
          <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow">
            Transform your ideas into stunning websites with AI, or master the art of UI/UX design through our comprehensive learning platform.
          </p>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pastel-blue/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-pastel-lavender/30 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto relative fade-in-delay-1">
          {/* AI Builder Card */}
          <Link 
            to="/builder" 
            className="group relative bg-white/80 backdrop-blur-sm p-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-pastel-blue/30 overflow-hidden hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pastel-blue/20 via-pastel-lavender/20 to-pastel-mint/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <h2 className="text-4xl font-teko mb-4 bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent drop-shadow">
                AI Website Builder
              </h2>
              <p className="text-gray-600 mb-8 text-base leading-relaxed">
                Create professional websites instantly using our AI-powered design tool. Just describe what you want!
              </p>
              <span className="inline-flex items-center text-gray-700 group-hover:text-gray-900 transition-colors text-lg font-medium">
                Start Building 
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </Link>

          {/* Learning Card */}
          <Link 
            to="/learn" 
            className="group relative bg-white/80 backdrop-blur-sm p-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-pastel-pink/30 overflow-hidden hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pastel-pink/20 via-pastel-peach/20 to-pastel-yellow/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <h2 className="text-4xl font-teko mb-4 bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent drop-shadow">
                Learn UI/UX Design
              </h2>
              <p className="text-gray-600 mb-8 text-base leading-relaxed">
                Master the principles of modern web design through our comprehensive guides and tutorials.
              </p>
              <span className="inline-flex items-center text-gray-700 group-hover:text-gray-900 transition-colors text-lg font-medium">
                Start Learning
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
