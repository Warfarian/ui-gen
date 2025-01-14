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
        fonts: ['Inter', 'system-ui'],
        animations: {
          hero: 'fade-in-up',
          features: 'fade-in-stagger',
          cta: 'pulse-subtle'
        },
        components: {
          buttons: 'gradient hover:scale-105 transform transition-all',
          cards: 'hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm',
          navigation: 'sticky backdrop-blur-md bg-white/80'
        },
        interactions: {
          hover: 'hover:scale-105 hover:shadow-lg transition-all',
          active: 'active:scale-95 transition-transform',
          focus: 'focus:ring-2 focus:ring-blue-500 focus:outline-none'
        }
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
        fonts: ['Montserrat', 'system-ui'],
        animations: {
          hero: 'slide-in-right',
          services: 'fade-in-stagger',
          team: 'pop-in-stagger',
          testimonials: 'slide-in-left'
        },
        components: {
          buttons: 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700',
          cards: 'group hover:shadow-xl transition-all duration-300 bg-white rounded-xl',
          navigation: 'fixed w-full backdrop-blur-lg bg-white/80'
        },
        interactions: {
          hover: 'group-hover:scale-105 transition-all duration-300',
          active: 'active:scale-95 transition-transform',
          focus: 'focus:ring-2 focus:ring-teal-500 focus:outline-none'
        }
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
        fonts: ['Poppins', 'system-ui'],
        animations: {
          hero: 'gradient-shift',
          projects: 'masonry-fade',
          skills: 'progress-fill',
          contact: 'bounce-in'
        },
        components: {
          buttons: 'bg-gradient-to-br from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600',
          cards: 'group perspective-1000 hover:rotate-y-12 transition-all duration-500',
          navigation: 'sticky top-0 backdrop-blur-xl bg-zinc-900/80'
        },
        interactions: {
          hover: 'hover:scale-105 hover:rotate-3 transition-all duration-300',
          active: 'active:scale-95 transition-transform',
          focus: 'focus:ring-2 focus:ring-indigo-500 focus:outline-none'
        }
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
        fonts: ['Merriweather', 'system-ui'],
        animations: {
          hero: 'text-gradient-flow',
          posts: 'card-hover-lift',
          categories: 'grid-fade-in',
          newsletter: 'shake-subtle'
        },
        components: {
          buttons: {
            primary: 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-6 py-3 rounded-lg font-semibold transform hover:scale-105 hover:shadow-lg active:scale-95 transition-all duration-200',
            secondary: 'bg-white/10 backdrop-blur-sm border border-red-500/20 text-red-500 hover:bg-red-500/10 px-6 py-3 rounded-lg font-semibold transition-all duration-200',
            icon: 'p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm hover:shadow-md transition-all duration-200'
          },
          cards: {
            default: 'group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden',
            interactive: 'group perspective-1000 hover:rotate-y-12 transition-all duration-500 bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden',
            feature: 'relative overflow-hidden rounded-xl bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300'
          },
          navigation: {
            default: 'sticky top-0 backdrop-blur-2xl bg-white/90 z-50 border-b border-gray-200/50',
            transparent: 'fixed w-full bg-transparent hover:bg-white/80 transition-all duration-300',
            colored: 'sticky top-0 bg-gradient-to-r from-red-500 to-rose-500 text-white'
          },
          sections: {
            hero: 'min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800',
            feature: 'py-20 bg-gradient-to-br from-gray-50 to-gray-100',
            cta: 'py-16 bg-gradient-to-r from-red-500 to-rose-500 text-white',
            testimonial: 'py-20 bg-white/80 backdrop-blur-sm'
          }
        },
        interactions: {
          hover: {
            scale: 'hover:scale-102 hover:shadow-lg transition-all duration-300',
            lift: 'hover:-translate-y-1 hover:shadow-lg transition-all duration-300',
            glow: 'hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300',
            rotate: 'hover:rotate-3 transition-all duration-300'
          },
          active: {
            press: 'active:scale-98 transition-transform',
            bounce: 'active:scale-95 transition-transform',
            push: 'active:translate-y-0.5 transition-transform'
          },
          focus: {
            ring: 'focus:ring-2 focus:ring-red-500 focus:outline-none',
            glow: 'focus:shadow-lg focus:shadow-red-500/20 focus:outline-none transition-all duration-300'
          },
          group: {
            card: 'group-hover:scale-105 group-hover:shadow-xl transition-all duration-300',
            image: 'group-hover:scale-110 group-hover:rotate-3 transition-all duration-500',
            text: 'group-hover:text-red-500 transition-colors duration-200'
          }
        },
        animations: {
          initial: {
            fadeIn: 'opacity-0 animate-fade-in',
            slideIn: 'opacity-0 -translate-x-4 animate-slide-in',
            popIn: 'opacity-0 scale-95 animate-pop-in'
          },
          hover: {
            float: 'hover:animate-float',
            bounce: 'hover:animate-bounce-subtle',
            spin: 'hover:animate-spin-slow'
          },
          continuous: {
            pulse: 'animate-pulse-subtle',
            gradient: 'animate-gradient-shift',
            float: 'animate-float'
          }
        }
      }
    }
  }
];

export default templates;
