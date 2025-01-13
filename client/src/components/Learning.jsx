const Learning = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      <div className="container mx-auto px-6 py-12 max-w-6xl fade-in">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <h1 className="text-5xl font-extrabold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-center relative">
          Master UI/UX Design
          <span className="block text-lg font-medium text-gray-600 mt-2">Comprehensive guide to modern design principles</span>
        </h1>

        {/* Introduction */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg mb-12">
          <p className="text-gray-700 leading-relaxed">
            UI (User Interface) and UX (User Experience) design are critical components in creating effective digital products. 
            They focus on how users interact with a product and how satisfying that interaction is. Understanding these principles 
            can significantly enhance user engagement and satisfaction.
          </p>
        </div>
        
        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* UI Design Section */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all">
            <h2 className="text-3xl font-bold mb-6 text-blue-600">UI Design</h2>
            <div className="space-y-4">
              <p className="text-gray-700">UI design refers to the visual elements of a product, including buttons, icons, spacing, typography, and color schemes.</p>
              
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="font-semibold text-blue-800 mb-3">Key Aspects:</h3>
                <ul className="space-y-2 text-blue-700">
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
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all">
            <h2 className="text-3xl font-bold mb-6 text-purple-600">UX Design</h2>
            <div className="space-y-4">
              <p className="text-gray-700">UX design focuses on optimizing a product for effective and enjoyable use, encompassing all aspects of the user's interaction.</p>
              
              <div className="bg-purple-50 p-6 rounded-xl">
                <h3 className="font-semibold text-purple-800 mb-3">Key Benefits:</h3>
                <ul className="space-y-2 text-purple-700">
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
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg mb-12">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Core Design Principles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "User-Centricity",
                description: "Focus on creating products that solve specific user problems and meet user needs effectively.",
                color: "blue"
              },
              {
                title: "Consistency",
                description: "Maintain uniformity in visuals and functionality across all platforms and products.",
                color: "purple"
              },
              {
                title: "Hierarchy",
                description: "Organize information and visual elements to guide users efficiently through the product.",
                color: "pink"
              },
              {
                title: "Accessibility",
                description: "Ensure products are usable by everyone, including those with disabilities.",
                color: "indigo"
              },
              {
                title: "User Control",
                description: "Give users the ability to manage their interactions and correct mistakes.",
                color: "green"
              },
              {
                title: "Feedback",
                description: "Provide clear responses to user actions through visual cues or notifications.",
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
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-3xl font-bold mb-6">Best Practices</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Keep designs simple and intuitive",
              "Maintain consistent design patterns",
              "Use clear visual hierarchy",
              "Ensure responsive design",
              "Optimize loading speed",
              "Test with real users"
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
        <div className="mt-12 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Additional Resources</h2>
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
