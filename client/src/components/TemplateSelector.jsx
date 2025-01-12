import { useState } from 'react';
import templates from '../templates';

const TemplateSelector = ({ onSelect, selectedTemplate }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {templates.map((template) => (
        <div
          key={template.id}
          onClick={() => onSelect(template)}
          className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md
            ${selectedTemplate?.id === template.id 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-blue-300'}`}
        >
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
      ))}
    </div>
  );
};

export default TemplateSelector;
