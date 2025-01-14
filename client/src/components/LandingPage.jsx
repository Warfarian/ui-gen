import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const LandingPage = () => {
  const playWelcomeMessage = async () => {
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
          playButton.className = 'fixed top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors z-50';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      <div className="container mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20 fade-in">
          <h1 className="text-6xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ctrl + Alt + Design
            </span>
            <span className="block text-2xl font-medium text-gray-600 mt-4">
              Where AI Meets Design Excellence
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Transform your ideas into stunning websites with AI, or master the art of UI/UX design through our comprehensive learning platform.
          </p>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto relative fade-in-delay-1">
          {/* AI Builder Card */}
          <Link 
            to="/builder" 
            className="group relative bg-white/80 backdrop-blur-sm p-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Website Builder
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Create professional websites instantly using our AI-powered design tool. Just describe what you want!
            </p>
            <span className="inline-flex items-center text-blue-500 group-hover:text-blue-600 transition-colors text-lg font-semibold">
              Start Building 
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>

          {/* Learning Card */}
          <Link 
            to="/learn" 
            className="group relative bg-white/80 backdrop-blur-sm p-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Learn UI/UX Design
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Master the principles of modern web design through our comprehensive guides and tutorials.
            </p>
            <span className="inline-flex items-center text-purple-500 group-hover:text-purple-600 transition-colors text-lg font-semibold">
              Start Learning
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
