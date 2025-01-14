import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DOMPurify from 'dompurify'
import Editor from '@monaco-editor/react'
import { monacoConfig, defineThemes } from './config/monaco'
import TemplateSelector from './components/TemplateSelector'
import LandingPage from './components/LandingPage'
import Learning from './components/Learning'

// Rename the existing App component to Builder
const Builder = () => {
  const [isListening, setIsListening] = useState(false);
  const [design, setDesign] = useState(null);
  const [previewMode, setPreviewMode] = useState('desktop');

  // Helper function to get preview width based on mode
  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile':
        return 'max-w-[375px]';
      case 'tablet':
        return 'max-w-[768px]';
      default:
        return 'w-full';
    }
  };
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [generatedHtml, setGeneratedHtml] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [editorTheme, setEditorTheme] = useState('custom-dark');
  const [textInput, setTextInput] = useState('');

  const handleTextSubmit = async () => {
    if (!textInput.trim() || isLoading) return;
    
    setMessages(prev => [...prev, { type: 'user', text: textInput }]);
    await sendToBackend(textInput);
    setTextInput('');
  };

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

  const [currentDesign, setCurrentDesign] = useState(null);
  const [referenceImage, setReferenceImage] = useState(null);

  const sendToBackend = async (text) => {
    if (!selectedTemplate) {
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: 'Please select a template first before generating a design.' 
      }]);
      return;
    }
    setIsLoading(true);
    try {
      console.log('Sending request to server...');
      const response = await fetch('http://localhost:3001/create-design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text,
          template: selectedTemplate,
          previousDesign: currentDesign?.html,
          referenceImage: referenceImage
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received response:', data);
      setDesign(data);
      setCurrentDesign(data);
      
      // Add AI response messages to chat
      if (data.aiResponse) {
        const funnyMessages = [
          'Beep boop, here ya go!',
          'Boop beep, fresh design coming up!',
          'Beep beep, design served hot!',
          'Boop boop, design magic complete!'
        ];
        const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
        
        if (!currentDesign) {
          // First design - show both AI response and funny message
          setMessages(prev => [
            ...prev, 
            { type: 'bot', text: data.aiResponse },
            { type: 'bot', text: randomMessage }
          ]);
        } else {
          // Subsequent designs - only show funny message
          setMessages(prev => [...prev, { type: 'bot', text: randomMessage }]);
        }
      }
      
      if (data.html) {
        // Extract the first image URL from the HTML content
        const imageUrlMatch = data.html.match(/<img[^>]*src="([^"]*)"[^>]*>/);
        const imageUrl = imageUrlMatch ? imageUrlMatch[1] : null;
        
        // Add default styles and Tailwind CDN to the HTML content
        const htmlWithStyles = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
              <meta name="theme-color" content="#ffffff">
              <meta name="color-scheme" content="light dark">
              <script src="https://cdn.tailwindcss.com"></script>
              <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                  line-height: 1.5;
                  padding: 2rem;
                  max-width: 1200px;
                  margin: 0 auto;
                  background-color: #f8fafc;
                }
                .ai-response {
                  background: linear-gradient(to right, #e0f2fe, #f0f9ff);
                  border-left: 4px solid #0ea5e9;
                  padding: 1.5rem;
                  border-radius: 0.5rem;
                  margin-bottom: 2rem;
                  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }
                .ai-label {
                  color: #0369a1;
                  font-weight: 500;
                  font-size: 0.875rem;
                  text-transform: uppercase;
                  letter-spacing: 0.05em;
                  margin-bottom: 0.5rem;
                }
              </style>
            </head>
            <body>
              ${data.html}
            </body>
          </html>
        `;
        const sanitizedHtml = DOMPurify.sanitize(htmlWithStyles);
        setGeneratedHtml(sanitizedHtml);
      }
    } catch (error) {
      console.error('Error sending data to backend:', error);
      let errorMessage;
      
      if (!navigator.onLine) {
        errorMessage = 'You appear to be offline. Please check your internet connection.';
      } else if (error instanceof TypeError && error.message === 'Failed to fetch') {
        errorMessage = 'Unable to connect to the server. Please make sure the server is running on port 3001.';
      } else {
        errorMessage = error.response?.data?.details || error.message || 'Sorry, there was an error processing your request.';
      }
      
      setMessages(prev => [...prev, { type: 'bot', text: errorMessage }]);
      console.log('Server URL:', 'http://localhost:3001/create-design');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex fade-in">
      {/* Left side - Chat */}
      <div className="w-1/3 p-6 border-r border-gray-200 bg-white/90 backdrop-blur-sm overflow-y-auto shadow-lg">
        <h1 className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Ctrl + Alt + Design
          <span className="block text-sm font-medium text-gray-500 mt-2">AI-Powered Web Design Studio</span>
        </h1>
        
        {/* Template Selector */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Choose a Template</h2>
          <TemplateSelector 
            onSelect={setSelectedTemplate}
            selectedTemplate={selectedTemplate}
          />
        </div>
        
        <div className="mb-6 space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index}
              className={`p-3 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md ${
                message.type === 'user' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-auto max-w-[80%]' 
                  : 'bg-white mr-auto max-w-[80%] border border-gray-100'
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          ))}
        </div>

        <div className="relative mt-auto space-y-4">
          {/* Text Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  e.preventDefault();
                  handleTextSubmit();
                }
              }}
              placeholder="Type your website description..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200 hover:bg-white"
              disabled={isLoading || isListening}
            />
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setReferenceImage(reader.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <div className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </label>
            <button
              onClick={handleTextSubmit}
              disabled={isLoading || isListening || !textInput.trim()}
              className="px-4 py-2 text-white bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>

          {/* Voice Input Button */}
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
      </div>

      {/* Right side - Preview */}
      <div className="w-2/3 p-6 bg-gray-50/80 backdrop-blur-sm overflow-y-auto">
        {design && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Design Preview</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCode(!showCode)}
                  className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg transition-all duration-200 hover:shadow-md hover:scale-105"
                >
                  {showCode ? 'Hide Code' : 'View Code'}
                </button>
                {showCode && (
                  <button
                    onClick={() => setEditorTheme(theme => theme === 'custom-dark' ? 'custom-light' : 'custom-dark')}
                    className="px-4 py-2 text-sm bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg transition-all duration-200 hover:shadow-md hover:scale-105"
                  >
                    {editorTheme === 'custom-dark' ? '☀️ Light' : '🌙 Dark'}
                  </button>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Preview Controls */}
              <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-semibold text-gray-700">Preview</h3>
                  <div className="flex items-center gap-2 border-l pl-4">
                    <button
                      onClick={() => setPreviewMode('desktop')}
                      className={`p-2 rounded ${previewMode === 'desktop' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                      title="Desktop View"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setPreviewMode('tablet')}
                      className={`p-2 rounded ${previewMode === 'tablet' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                      title="Tablet View"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setPreviewMode('mobile')}
                      className={`p-2 rounded ${previewMode === 'mobile' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                      title="Mobile View"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const blob = new Blob([generatedHtml], { type: 'text/html' });
                      const url = URL.createObjectURL(blob);
                      window.open(url, '_blank');
                      URL.revokeObjectURL(url);
                    }}
                    className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Open in New Tab
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([generatedHtml], { type: 'text/html' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'generated-design.html';
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-3 py-1.5 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  >
                    Download HTML
                  </button>
                </div>
              </div>

              {/* Preview Frame */}
              <div className="border rounded-lg bg-white overflow-hidden">
                <div className="border-b border-gray-200 p-2 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-sm text-gray-500 font-mono bg-white px-3 py-1 rounded border">
                    preview.html
                  </div>
                </div>
                <div className={`transition-all duration-300 mx-auto ${getPreviewWidth()}`}>
                  <iframe
                    srcDoc={generatedHtml}
                    className="w-full min-h-[800px] border-0"
                    style={{
                      height: previewMode === 'mobile' ? '667px' : 
                             previewMode === 'tablet' ? '1024px' : 
                             '800px'
                    }}
                    title="Generated UI Preview"
                    sandbox="allow-scripts allow-same-origin"
                    onLoad={(e) => {
                      try {
                        // Inject custom styles for preview
                        const style = e.target.contentDocument.createElement('style');
                        style.textContent = `
                          * { transition: all 0.2s ease-in-out; }
                          .hover-highlight:hover { outline: 2px solid #3b82f6; }
                        `;
                        e.target.contentDocument.head.appendChild(style);

                        // Add hover highlight to elements
                        const elements = e.target.contentDocument.querySelectorAll('div, section, article, nav, header, footer');
                        elements.forEach(el => el.classList.add('hover-highlight'));
                      } catch (error) {
                        console.error('Error injecting preview styles:', error);
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {showCode && (
              <div className="border rounded-lg overflow-hidden bg-white">
                <Editor
                  height="400px"
                  defaultLanguage="html"
                  value={generatedHtml}
                  options={monacoConfig.editor}
                  theme={editorTheme}
                  beforeMount={(monaco) => {
                    // Define custom themes
                    defineThemes(monaco);
                    // Register HTML language features
                    monaco.languages.html.htmlDefaults.setOptions(monacoConfig.html);
                    
                    // Register custom completions
                    monaco.languages.registerCompletionItemProvider('html', {
                      provideCompletionItems: (model, position) => {
                        return {
                          suggestions: [
                            // Add class attribute suggestion
                            {
                              label: 'class',
                              kind: monaco.languages.CompletionItemKind.Property,
                              documentation: 'HTML class attribute',
                              insertText: 'class="${1}"',
                              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                              range: {
                                startLineNumber: position.lineNumber,
                                endLineNumber: position.lineNumber,
                                startColumn: position.column,
                                endColumn: position.column
                              },
                            },
                            // Add Tailwind class suggestions
                            ...monacoConfig.tailwindClasses.map(className => ({
                              label: className,
                              kind: monaco.languages.CompletionItemKind.Value,
                              documentation: `Tailwind class: ${className}`,
                              insertText: className,
                              range: {
                                startLineNumber: position.lineNumber,
                                endLineNumber: position.lineNumber,
                                startColumn: position.column,
                                endColumn: position.column
                              },
                            }))
                          ]
                        };
                      }
                    });
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// New App component with routing
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/learn" element={<Learning />} />
      </Routes>
    </Router>
  );
}

export default App;
