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
  const [conversationState, setConversationState] = useState({
    messages: [],
    isProcessing: false,
    error: null
  });
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
    await sendToBackend(textInput);
    setTextInput('');
  };

  // Speech recognition setup
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      setConversationState(prev => ({
        ...prev,
        error: 'Speech recognition is not supported in this browser.'
      }));
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setConversationState(prev => ({
        ...prev,
        error: null
      }));
    };

    recognition.onresult = (event) => {
      // Show interim results
      const interimTranscript = Array.from(event.results)
        .filter(result => !result.isFinal)
        .map(result => result[0].transcript)
        .join('');

      const finalTranscript = Array.from(event.results)
        .filter(result => result.isFinal)
        .map(result => result[0].transcript)
        .join('');
      
      // Show interim or final transcript
      const currentTranscript = interimTranscript || finalTranscript;
      if (currentTranscript) {
        setConversationState(prev => ({
          ...prev,
          messages: [
            ...prev.messages.filter(m => !m.interim), // Keep only non-interim messages
            { type: 'user', text: currentTranscript, interim: !finalTranscript }
          ]
        }));
      }

      // Process final results without adding a new message
      if (finalTranscript) {
        handleUserInput(finalTranscript, true);
      }
    };

    recognition.onerror = (event) => {
      setConversationState(prev => ({
        ...prev,
        error: `Speech recognition error: ${event.error}`
      }));
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (error) {
      setConversationState(prev => ({
        ...prev,
        error: `Failed to start speech recognition: ${error.message}`
      }));
    }
  };

  // Handle user input (both voice and text)
  const handleUserInput = async (input, skipMessageAdd = false) => {
    try {
      setConversationState(prev => ({
        ...prev,
        isProcessing: true,
        messages: skipMessageAdd ? prev.messages : [...prev.messages, { type: 'user', text: input }]
      }));

      // Send to backend for processing
      const result = await sendToBackend(input);

      if (result && result.aiResponse) {
        // Generate unique ID for the message
        const messageId = Date.now().toString();
        
        // Add AI message to conversation
        setConversationState(prev => ({
          ...prev,
          isProcessing: false,
          messages: [...prev.messages, { 
            id: messageId,
            type: 'ai', 
            text: result.aiResponse,
            speaking: false
          }]
        }));

        // Play AI response
        await playAIResponse(result.aiResponse, messageId);
      } else {
        // Just update processing state without adding a message
        setConversationState(prev => ({
          ...prev,
          isProcessing: false
        }));
      }
    } catch (error) {
      setConversationState(prev => ({
        ...prev,
        isProcessing: false,
        error: `Error processing input: ${error.message}`
      }));
    }
  };

  // Play AI response using ElevenLabs
  const playAIResponse = async (text, messageId) => {
    try {
      const response = await fetch('http://localhost:3001/synthesize-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error(`Voice synthesis failed: ${response.statusText}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      // Update UI to show speaking state
      setConversationState(prev => ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === messageId ? { ...msg, speaking: true } : msg
        )
      }));

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        // Update UI to remove speaking state
        setConversationState(prev => ({
          ...prev,
          messages: prev.messages.map(msg => 
            msg.id === messageId ? { ...msg, speaking: false } : msg
          )
        }));
      };

      await audio.play();
    } catch (error) {
      console.error('Error playing AI response:', error);
      setConversationState(prev => ({
        ...prev,
        error: `Failed to play voice response: ${error.message}`
      }));
    }
  };

  const [currentDesign, setCurrentDesign] = useState(null);
  const [referenceImage, setReferenceImage] = useState(null);

  // Extract AI response from HTML
  const extractAIResponse = (html) => {
    // Look for AI response in a comment or specific tag
    const responseMatch = html.match(/<!-- AI Response: (.*?) -->/) || 
                         html.match(/<ai-response>(.*?)<\/ai-response>/);
    return responseMatch ? responseMatch[1] : null;
  };

  const sendToBackend = async (text) => {
    setIsLoading(true);
    try {
      console.log('Sending request to server...');
      // Get the current HTML from the iframe
      const previewIframe = document.querySelector('#preview-iframe');
      const currentHtml = previewIframe?.srcdoc || currentDesign?.html || '';

      const response = await fetch('http://localhost:3001/create-design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text,
          template: selectedTemplate,
          previousDesign: currentHtml, // Send the current HTML from the iframe
          referenceImage: referenceImage,
          previousMessages: conversationState.messages.map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.text
          }))
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received response:', data);
      setDesign(data);
      setCurrentDesign(data);
      
      // Add AI response to conversation and trigger voice synthesis
      if (data.aiResponse) {
        const messageId = Date.now().toString();
        setConversationState(prev => ({
          ...prev,
          messages: [...prev.messages, { 
            id: messageId,
            type: 'ai', 
            text: data.aiResponse,
            speaking: false
          }]
        }));
        
        // Play AI response
        await playAIResponse(data.aiResponse, messageId);
      }
      
      if (data.html) {
        try {
          // Sanitize HTML
          const sanitizedHtml = DOMPurify.sanitize(data.html, {
            ADD_TAGS: ['script', 'style'],
            ADD_ATTR: ['onerror', 'onload'],
            FORCE_BODY: true,
          });

          // Validate HTML structure
          const parser = new DOMParser();
          const doc = parser.parseFromString(sanitizedHtml, 'text/html');
          const errors = doc.getElementsByTagName('parsererror');
          
          if (errors.length > 0) {
            throw new Error('Invalid HTML structure');
          }

          // Update state with new HTML
          setGeneratedHtml(sanitizedHtml);
          setDesign(data);
          setCurrentDesign(data);
          
          // Force iframe refresh
          const previewIframe = document.querySelector('#preview-iframe');
          if (previewIframe) {
            previewIframe.srcdoc = sanitizedHtml;
            
            // Force Tailwind to reprocess styles after a short delay
            setTimeout(() => {
              const doc = previewIframe.contentDocument;
              if (doc) {
                doc.body.style.display = 'none';
                setTimeout(() => {
                  doc.body.style.display = '';
                }, 50);
              }
            }, 100);
          }
          
          // Get reference to iframe
          if (previewIframe) {
            console.log('Updating preview with new HTML');
            
            // Store current scroll position
            const currentScroll = previewIframe.contentWindow?.scrollY || 0;
            
            // Update content
            previewIframe.srcdoc = sanitizedHtml;
            
            // Restore scroll position and reprocess styles after load
            previewIframe.onload = () => {
              const doc = previewIframe.contentDocument;
              if (doc) {
                // Force Tailwind reprocessing
                doc.body.style.display = 'none';
                requestAnimationFrame(() => {
                  doc.body.style.display = '';
                  // Restore scroll position
                  previewIframe.contentWindow.scrollTo(0, currentScroll);
                });
              }
            };
          }
        } catch (error) {
          console.error('Error processing HTML:', error);
          setMessages(prev => [...prev, { 
            type: 'bot', 
            text: 'There was an error processing the generated HTML. Please try again.' 
          }]);
        }
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
        </h1>          {/* Template Selector */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Template (Optional)</h2>
              {selectedTemplate && (
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear Template
                </button>
              )}
            </div>
            <TemplateSelector 
              onSelect={setSelectedTemplate}
              selectedTemplate={selectedTemplate}
            />
          </div>
        
        <div className="mb-6 space-y-4">
          {conversationState.messages.map((message, index) => (
            <div 
              key={index}
              className={`p-3 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md ${
                message.type === 'user' 
                  ? `bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-auto max-w-[80%] 
                     ${message.interim ? 'opacity-70' : ''}`
                  : `bg-white mr-auto max-w-[80%] border border-gray-100
                     ${message.speaking ? 'animate-pulse border-blue-300' : ''}`
              }`}
            >
              <div className="flex items-center gap-2">
                {message.type === 'user' && message.interim && (
                  <span className="text-xs text-white/80">Listening...</span>
                )}
                {message.type === 'ai' && message.speaking && (
                  <span className="text-xs text-blue-500">Speaking...</span>
                )}
                <p className="text-sm">{message.text}</p>
              </div>
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
          <div>
            {/* Voice Input Button with Processing State */}
            {conversationState.isProcessing ? (
              <div className="flex items-center justify-center space-x-2 py-3 px-6 bg-gray-400 text-white rounded-lg text-lg font-semibold">
                <div className="animate-pulse">Processing</div>
                <div className="animate-bounce">•</div>
                <div className="animate-bounce delay-100">•</div>
                <div className="animate-bounce delay-200">•</div>
              </div>
            ) : (
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
                {isListening ? 'Listening...' 
                  : isLoading ? 'Generating...' 
                  : 'Talk to Buffy'}
              </button>
            )}

            {/* Error Display */}
            {conversationState.error && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                {conversationState.error}
              </div>
            )}
          </div>
          
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
                  {generatedHtml && (
                    <iframe
                      id="preview-iframe"
                      srcDoc={generatedHtml}
                      className="w-full min-h-[800px] border-0 bg-white"
                      sandbox="allow-scripts allow-same-origin allow-modals"
                      sandbox="allow-scripts allow-same-origin allow-modals"
                      onLoad={(e) => {
                        const doc = e.target.contentDocument;
                        if (doc) {
                          // Force Tailwind to re-process styles
                          doc.body.style.display = 'none';
                          setTimeout(() => {
                            doc.body.style.display = '';
                          }, 50);
                        }
                      }}
                      style={{
                        height: previewMode === 'mobile' ? '667px' : 
                               previewMode === 'tablet' ? '1024px' : 
                               '800px'
                      }}
                      title="Generated UI Preview"
                    />
                  )}
                </div>
              </div>
            </div>

            {showCode && (
              <div className="border rounded-lg overflow-hidden bg-white">
                <Editor
                  height="400px"
                  defaultLanguage="html"
                  value={generatedHtml || '<!-- No code generated yet -->'}
                  options={{
                    ...monacoConfig.editor,
                    readOnly: true,
                    minimap: { enabled: false },
                    lineNumbers: 'on',
                    wordWrap: 'on',
                    wrappingIndent: 'same',
                    formatOnPaste: true,
                    formatOnType: true
                  }}
                  onMount={(editor) => {
                    // Format the code on initial load
                    setTimeout(() => {
                      editor.getAction('editor.action.formatDocument').run();
                    }, 100);
                  }}
                  theme={editorTheme}
                  beforeMount={(monaco) => {
                    defineThemes(monaco);
                    monaco.languages.html.htmlDefaults.setOptions(monacoConfig.html);
                    console.log("Monaco Editor Content:", {
                      hasHtml: !!generatedHtml,
                      length: generatedHtml?.length,
                      preview: generatedHtml?.substring(0, 500),
                      hasTailwind: generatedHtml?.includes('cdn.tailwindcss.com')
                    });
                    
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

export {App};
