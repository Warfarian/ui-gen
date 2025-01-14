import { useState } from 'react';
import templates from '../templates';

const TemplateSelector = ({ onSelect, selectedTemplate }) => {
  const [previewTemplate, setPreviewTemplate] = useState(templates[0]);
  const [isolatedComponent, setIsolatedComponent] = useState(null);

  // Function to handle component isolation
  const handleComponentIsolation = (componentType) => {
    if (isolatedComponent === componentType) {
      setIsolatedComponent(null); // Toggle off if already selected
    } else {
      setIsolatedComponent(componentType);
    }
  };

  // Function to render isolated component preview
  const renderIsolatedComponent = () => {
    if (!isolatedComponent || !selectedTemplate) return null;

    const componentMap = {
      'buttons': (
        <div className="space-y-4 p-8 bg-white rounded-lg">
          <h3 className="text-lg font-semibold mb-6">Button Components</h3>
          <div className="space-y-4">
            <button className={`${selectedTemplate.defaultContent.style.components.buttons.primary}`}>
              Primary Button
            </button>
            <button className={`${selectedTemplate.defaultContent.style.components.buttons.secondary}`}>
              Secondary Button
            </button>
            <button className={`${selectedTemplate.defaultContent.style.components.buttons.icon}`}>
              <i className="fas fa-star"></i>
            </button>
          </div>
        </div>
      ),
      'cards': (
        <div className="space-y-4 p-8 bg-white rounded-lg">
          <h3 className="text-lg font-semibold mb-6">Card Components</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className={`${selectedTemplate.defaultContent.style.components.cards.default}`}>
              <div className="p-6">
                <h4 className="text-lg font-medium">Default Card</h4>
                <p className="text-gray-600 mt-2">A simple card component with hover effects.</p>
              </div>
            </div>
            <div className={`${selectedTemplate.defaultContent.style.components.cards.interactive}`}>
              <div className="p-6">
                <h4 className="text-lg font-medium">Interactive Card</h4>
                <p className="text-gray-600 mt-2">Card with advanced hover interactions.</p>
              </div>
            </div>
          </div>
        </div>
      ),
      'navigation': (
        <div className="space-y-4 p-8 bg-white rounded-lg">
          <h3 className="text-lg font-semibold mb-6">Navigation Components</h3>
          <nav className={`${selectedTemplate.defaultContent.style.components.navigation.default} mb-4`}>
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">Default Nav</div>
                <div className="flex space-x-4">
                  <a href="#" className="hover:text-blue-500">Home</a>
                  <a href="#" className="hover:text-blue-500">About</a>
                  <a href="#" className="hover:text-blue-500">Contact</a>
                </div>
              </div>
            </div>
          </nav>
          <nav className={`${selectedTemplate.defaultContent.style.components.navigation.transparent} mb-4`}>
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">Transparent Nav</div>
                <div className="flex space-x-4">
                  <a href="#" className="hover:text-blue-500">Home</a>
                  <a href="#" className="hover:text-blue-500">About</a>
                  <a href="#" className="hover:text-blue-500">Contact</a>
                </div>
              </div>
            </div>
          </nav>
        </div>
      )
    };

    return componentMap[isolatedComponent];
  };

  return (
    <div className="space-y-6">
      {/* Component Isolation Controls */}
      <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-4">Component Preview</h3>
        <div className="flex flex-wrap gap-2">
          {['buttons', 'cards', 'navigation'].map((component) => (
            <button
              key={component}
              onClick={() => handleComponentIsolation(component)}
              className={`px-4 py-2 rounded-md transition-all text-sm font-medium
                ${isolatedComponent === component 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-500'}`}
            >
              {component.charAt(0).toUpperCase() + component.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Isolated Component Preview */}
      {isolatedComponent && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {isolatedComponent.charAt(0).toUpperCase() + isolatedComponent.slice(1)} Preview
            </h3>
            <button
              onClick={() => setIsolatedComponent(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          {renderIsolatedComponent()}
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-white shadow-sm rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between space-x-8">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => {
                onSelect(template);
                setPreviewTemplate(template);
              }}
              className={`flex-1 px-4 py-2 rounded-md transition-all text-sm font-medium
                ${selectedTemplate?.id === template.id 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-500'}`}
            >
              {template.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Template Grid */}
      <div className="grid grid-cols-2 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => {
              onSelect(template);
              setPreviewTemplate(template);
            }}
            className={`relative overflow-hidden rounded-lg transition-all hover:shadow-lg
              ${selectedTemplate?.id === template.id 
                ? 'ring-2 ring-blue-500 shadow-md' 
                : 'hover:ring-1 hover:ring-blue-300'}`}
          >
            {/* Preview Image */}
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={template.previewImage}
                alt={template.name}
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="p-4 bg-white">
              <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              <div className="flex flex-wrap gap-2">
                {template.defaultContent.sections.map((section) => (
                  <span
                    key={section}
                    className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                  >
                    {section}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Template Preview Panel */}
      {previewTemplate && (
        <div className="mt-6 p-6 border rounded-lg bg-white shadow-lg">
          <h4 className="text-lg font-semibold mb-4">Template Details</h4>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Sections</h5>
                <ul className="space-y-2">
                  {previewTemplate.defaultContent.sections.map((section) => (
                    <li 
                      key={section}
                      className="flex items-center text-gray-600"
                    >
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      <span className="capitalize">{section}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <h5 className="font-medium text-gray-700 mb-2">Style Guide</h5>
              <div className="space-y-4">
                <div className="flex gap-2">
                  {previewTemplate.defaultContent.style.colors.map((color) => (
                    <div key={color} className="text-center">
                      <div
                        className="w-12 h-12 rounded-lg shadow-sm border"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs text-gray-500 mt-1">{color}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h6 className="text-sm text-gray-600 mb-1">Typography</h6>
                  <div className="flex gap-4">
                    {previewTemplate.defaultContent.style.fonts.map((font) => (
                      <span
                        key={font}
                        className="px-3 py-1 bg-gray-100 rounded text-sm text-gray-700"
                      >
                        {font}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
