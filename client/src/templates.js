const templates = [
  {
    id: 'modern-landing',
    name: 'Modern Landing Page',
    description: 'A clean, modern landing page perfect for products or services',
    previewImage: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop&q=80',
    images: {
      hero: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
      features: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&auto=format&fit=crop&q=80'
      ],
      about: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80'
    },
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
    previewImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
    images: {
      hero: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
      services: [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=80'
      ],
      team: [
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'
      ]
    },
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
    previewImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    images: {
      hero: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
      projects: [
        'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80'
      ],
      about: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=80'
    },
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
    previewImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80',
    images: {
      hero: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80',
      featured: [
        'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80'
      ],
      categories: [
        'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=300&auto=format&fit=crop&q=80'
      ]
    },
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
