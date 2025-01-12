const templates = [
  {
    id: 'modern-landing',
    name: 'Modern Landing Page',
    description: 'A clean, modern landing page perfect for products or services',
    imagePrompt: 'A modern, minimalist landing page with hero section, sleek product showcase, and call-to-action buttons',
    defaultContent: {
      sections: ['hero', 'features', 'about', 'cta'],
      style: {
        colors: ['#1a365d', '#2563eb', '#f3f4f6'],
        fonts: ['Inter', 'system-ui']
      }
    }
  },
  {
    id: 'business',
    name: 'Business Site',
    description: 'Professional business website with services and contact information',
    imagePrompt: 'A professional business website with corporate styling, team section, and service offerings',
    defaultContent: {
      sections: ['hero', 'services', 'team', 'testimonials', 'contact'],
      style: {
        colors: ['#1e293b', '#0f766e', '#f8fafc'],
        fonts: ['Montserrat', 'system-ui']
      }
    }
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Showcase your work with this elegant portfolio template',
    imagePrompt: 'A creative portfolio website with project gallery, about section, and contact form',
    defaultContent: {
      sections: ['hero', 'projects', 'about', 'skills', 'contact'],
      style: {
        colors: ['#18181b', '#6366f1', '#fafafa'],
        fonts: ['Poppins', 'system-ui']
      }
    }
  },
  {
    id: 'blog',
    name: 'Blog',
    description: 'Clean and readable blog layout for content creators',
    imagePrompt: 'A modern blog website with featured posts, categories, and newsletter signup',
    defaultContent: {
      sections: ['hero', 'featured-posts', 'categories', 'newsletter'],
      style: {
        colors: ['#262626', '#ef4444', '#f5f5f5'],
        fonts: ['Merriweather', 'system-ui']
      }
    }
  }
];

export default templates;
