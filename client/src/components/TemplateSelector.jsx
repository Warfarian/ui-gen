import { useState } from 'react';
import templates from '../templates';

const TemplateSelector = ({ onSelect, selectedTemplate }) => {
  const [previewTemplate, setPreviewTemplate] = useState(templates[0]);

  return (
    <div className="space-y-6">
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
