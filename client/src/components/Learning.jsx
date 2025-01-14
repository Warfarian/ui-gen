const Learning = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-blue via-pastel-lavender to-pastel-pink relative overflow-hidden">
      <div className="container mx-auto px-6 py-12 max-w-6xl fade-in">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <h1 className="text-7xl font-teko mb-8 text-center relative">
          <span className="bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent drop-shadow-lg">
            Master UI/UX Design
          </span>
          <span className="block text-2xl text-gray-700 mt-2 drop-shadow">Where pixels meet purpose, and bugs become features</span>
        </h1>

        {/* Introduction */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg mb-12 border border-pastel-blue/30">
          <p className="text-gray-700 leading-relaxed">
            Welcome to the world of UI/UX design, where we turn "404 Not Found" into "404 Too Cool to Exist". 
            Here's where you'll learn to create interfaces so intuitive, even your grandma could launch a rocket ship. 
            We'll explore the art of making digital products that don't just work - they work it. 🚀
          </p>
        </div>
        
        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* UI Design Section */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all border border-pastel-lavender/30">
            <h2 className="text-3xl font-bold mb-6 text-blue-600">UI Design</h2>
            <div className="space-y-4">
              <p className="text-gray-700">UI design refers to the visual elements of a product, including buttons, icons, spacing, typography, and color schemes.</p>
              
              <div className="bg-pastel-blue/20 p-6 rounded-xl">
                <h3 className="font-teko text-2xl text-gray-800 mb-3">Key Aspects:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    User Experience Enhancement
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Engagement Optimization
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Brand Communication
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Efficiency Improvement
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* UX Design Section */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all border border-pastel-pink/30">
            <h2 className="text-3xl font-bold mb-6 text-purple-600">UX Design</h2>
            <div className="space-y-4">
              <p className="text-gray-700">UX design focuses on optimizing a product for effective and enjoyable use, encompassing all aspects of the user's interaction.</p>
              
              <div className="bg-pastel-pink/20 p-6 rounded-xl">
                <h3 className="font-teko text-2xl text-gray-800 mb-3">Key Benefits:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    Increased User Engagement
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    Enhanced Usability
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    Improved Brand Perception
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    Competitive Advantage
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Core Principles Section */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg mb-12 border border-pastel-mint/30">
          <h2 className="text-4xl font-teko mb-8 text-gray-800">Core Design Principles (Or: How to Make Users Say "Wow")</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "User-Centricity",
                description: "Because nobody ever said 'Wow, this app really understands my existential crisis!'... until now.",
                color: "blue"
              },
              {
                title: "Consistency",
                description: "Like your favorite pair of socks - matching, reliable, and oddly comforting.",
                color: "purple"
              },
              {
                title: "Hierarchy",
                description: "It's like Marie Kondo met Information Architecture - sparking joy, one click at a time.",
                color: "pink"
              },
              {
                title: "Accessibility",
                description: "Because good design is like a good party - everyone's invited!",
                color: "indigo"
              },
              {
                title: "User Control",
                description: "Like a time machine for your mistakes, but way more practical.",
                color: "green"
              },
              {
                title: "Feedback",
                description: "We talk back, but in a good way - unlike your smart home device.",
                color: "red"
              }
            ].map((principle, index) => (
              <div 
                key={index}
                className={`bg-${principle.color}-50 p-6 rounded-xl transform hover:scale-[1.02] transition-all`}
              >
                <h3 className={`text-xl font-bold mb-3 text-${principle.color}-600`}>{principle.title}</h3>
                <p className={`text-${principle.color}-700`}>{principle.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Best Practices */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-pastel-lavender/30">
          <h2 className="text-4xl font-teko mb-6">Best Practices (AKA: The "Don't Make Users Cry" Guide)</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Keep it simple - like explaining tech to your cat",
              "Stay consistent - unlike your workout routine",
              "Visual hierarchy - because chaos was so 2023",
              "Responsive design - it's yoga for your website",
              "Speed matters - faster than your coffee getting cold",
              "Test with real humans - your mom doesn't count"
            ].map((practice, index) => (
              <div 
                key={index}
                className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-3"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                {index + 1}
              </div>
              <p className="text-gray-700 font-medium">{practice}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Resources Section */}
        <div className="mt-12 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-pastel-mint/30">
          <h2 className="text-4xl font-teko mb-6 bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent drop-shadow-lg">
            Level Up Your Design Game
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Microsoft Design Guidelines",
                url: "https://learn.microsoft.com/it-it/dynamics365/guidance/develop/ui-ux-design-principles",
                description: "Comprehensive guide to UI/UX design principles from Microsoft"
              },
              {
                title: "Advanced UX Design Principles",
                url: "https://www.linkedin.com/pulse/mastering-advanced-ux-design-principles-elevating-digital-kimitei-f8rwf",
                description: "Deep dive into advanced UX design concepts"
              },
              {
                title: "Figma Design Resources",
                url: "https://www.figma.com/resource-library/ui-design-principles/",
                description: "Practical UI design principles from Figma"
              },
              {
                title: "GeeksforGeeks UI/UX Guide",
                url: "https://www.geeksforgeeks.org/principles-of-ui-ux-design/",
                description: "Comprehensive overview of UI/UX principles"
              }
            ].map((resource, index) => (
              <a 
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-gray-600">{resource.description}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Real World Examples */}
        <div className="mt-12 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Real World Examples of Great UI Design
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Let's explore some outstanding examples of UI design that demonstrate these principles in action.
          </p>
          <div className="space-y-12">
            {[
              {
                name: "Medium",
                image: "/medium.jpg",
                features: ["Minimalist Design", "Content Focus", "User Engagement"],
                description: "Medium prioritizes content delivery with a clean, almost empty page for new articles. The minimalist design and generous line spacing creates a calm reading environment, while features like estimated read time and text highlighting encourage interaction.",
                highlights: ["Clean reading environment", "Minimal color palette", "Focus on typography"]
              },
              {
                name: "Virgin America",
                image: "/virginAmerica.jpg",
                features: ["Streamlined Booking", "Visual Appeal", "User-Friendly Interface"],
                description: "Virgin America's site focuses on the essential question, 'Where would you like to go?' The streamlined booking process and persistent information bar reduce cognitive load, while vibrant visuals create a unique brand identity.",
                highlights: ["Simplified flight booking", "Clear visual hierarchy", "Brand personality"]
              },
              {
                name: "Airbnb",
                image: "/airbnbjpg.jpg",
                features: ["Conversational Interface", "Trust Building", "Seamless Experience"],
                description: "Airbnb effectively combines ease of use with trust-building elements. The conversational interface makes search approachable, while the platform encourages communication between guests and hosts before payment.",
                highlights: ["Intuitive search", "Trust mechanisms", "Clear communication"]
              },
              {
                name: "Dropbox",
                image: "/dropbox.png",
                features: ["Familiar Structure", "Friendly Design", "Efficient Organization"],
                description: "Dropbox leverages familiarity and friendliness to enhance usability. The folder and file organization is intuitive, while lighthearted illustrations make the interface approachable and enjoyable.",
                highlights: ["Intuitive navigation", "Friendly illustrations", "Efficient file management"]
              },
              {
                name: "Pitch",
                image: "/Pitch.png",
                features: ["Clear Messaging", "Guided Journey", "Dynamic Elements"],
                description: "Pitch balances simplicity with comprehensive information. The homepage succinctly communicates the product's purpose, while subtle animations enhance engagement without cluttering the interface.",
                highlights: ["Clear value proposition", "Progressive disclosure", "Engaging animations"]
              },
              {
                name: "Frank and Oak",
                image: "/frankAndOak.png",
                features: ["Visual Impact", "Seamless Shopping", "Brand Focus"],
                description: "Frank and Oak successfully combines aesthetic appeal with a logical user journey. Bold photography captures attention while maintaining brand identity, and the checkout process is broken into manageable sections.",
                highlights: ["Strong photography", "Clear CTAs", "Streamlined checkout"]
              }
            ].map((example, index) => (
              <div 
                key={index}
                className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-2xl transform hover:scale-[1.01] transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="lg:w-1/3">
                    <img 
                      src={example.image} 
                      alt={example.name}
                      className="w-full h-[300px] object-cover rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                    />
                  </div>
                  <div className="lg:w-2/3">
                    <h3 className="text-2xl font-bold mb-4 text-gray-800">{example.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {example.features.map((feature, fIndex) => (
                        <span 
                          key={fIndex}
                          className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 shadow-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4">{example.description}</p>
                    <div className="space-y-2">
                      {example.highlights.map((highlight, hIndex) => (
                        <div key={hIndex} className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {highlight}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learning;
