import { useState } from 'react'
import DOMPurify from 'dompurify'
import CodeMirror from '@uiw/react-codemirror'
import { html } from '@codemirror/lang-html'
import parse from 'html-react-parser'

function App() {
  const [isListening, setIsListening] = useState(false);
  const [design, setDesign] = useState(null);
  const [generatedHtml, setGeneratedHtml] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessages(prev => [...prev, { type: 'user', text: transcript }]);
        sendToBackend(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  const sendToBackend = async (text) => {
    setIsLoading(true);
    try {
      console.log('Sending request to server...');
      const response = await fetch('http://localhost:3001/create-design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received response:', data);
      setDesign(data);
      setMessages(prev => [...prev, { type: 'bot', text: 'Here is your design:' }]);
      
      if (data.html) {
        const sanitizedHtml = DOMPurify.sanitize(data.html);
        setGeneratedHtml(sanitizedHtml);
      }
    } catch (error) {
      console.error('Error sending data to backend:', error);
      let errorMessage;
      
      if (!navigator.onLine) {
        errorMessage = 'You appear to be offline. Please check your internet connection.';
      } else if (error instanceof TypeError && error.message === 'Failed to fetch') {
        errorMessage = 'Unable to connect to the server. Please make sure the server is running.';
      } else {
        errorMessage = error.response?.data?.details || error.message || 'Sorry, there was an error processing your request.';
      }
      
      setMessages(prev => [...prev, { type: 'bot', text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">UI Generator</h1>
                
                <div className="mb-6 space-y-4">
                  {messages.map((message, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-blue-100 ml-auto max-w-[80%]' 
                          : 'bg-gray-100 mr-auto max-w-[80%]'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                  ))}
                </div>

                <div className="relative">
                  <button
                    onClick={startListening}
                    disabled={isLoading}
                    className={`w-full py-3 px-6 text-white rounded-lg text-lg font-semibold transition-all
                      ${isListening 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : isLoading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600'
                      }`}
                  >
                    {isListening ? 'Listening...' : isLoading ? 'Generating...' : 'Start Voice Input'}
                  </button>
                  
                  {isLoading && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>

                {design && (
                  <>
                    <div className="mt-8">
                      <h2 className="text-xl font-semibold mb-4">AI Response:</h2>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm whitespace-pre-wrap">
                          {design.aiResponse}
                        </p>
                      </div>
                    </div>

                    {generatedHtml && (
                      <div className="mt-8">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-xl font-semibold">Design Preview:</h2>
                          <button
                            onClick={() => setShowCode(!showCode)}
                            className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                          >
                            {showCode ? 'Hide Code' : 'View Code'}
                          </button>
                        </div>
                        
                        <div className="border rounded-lg p-4 bg-white mb-4">
                          <iframe
                            srcDoc={generatedHtml}
                            className="w-full min-h-[600px] border-0"
                            title="Generated UI Preview"
                            sandbox="allow-scripts"
                          />
                        </div>

                        {showCode && (
                          <div className="border rounded-lg overflow-hidden">
                            <CodeMirror
                              value={generatedHtml}
                              height="200px"
                              extensions={[html()]}
                              theme="light"
                              readOnly
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
