/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-in': 'slideInRight 0.6s ease-out',
        'pop-in': 'popIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'gradient-shift': 'gradientShift 3s ease infinite',
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
        'spin-slow': 'spin 4s linear infinite',
        'scale-fade-in': 'scaleFadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
        scaleFadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      scale: {
        '102': '1.02',
      },
      blur: {
        xs: '2px',
      },
      perspective: {
        '1000': '1000px',
        '2000': '2000px',
      },
      rotate: {
        '12': '12deg',
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'inherit',
            a: {
              color: 'inherit',
              textDecoration: 'none',
              fontWeight: '500',
            },
            strong: {
              fontWeight: '600',
            },
          },
        },
      },
    },
  },
  plugins: [],
  safelist: [
    // Animation classes
    'fade-in',
    'slide-in-right',
    'pop-in',
    'gradient-shift',
    // Interactive classes
    'hover-lift',
    'hover-scale',
    'card-hover',
    // Glass morphism
    'glass',
    'glass-dark',
    // Gradient text
    'gradient-text',
    'gradient-text-primary',
    'gradient-text-secondary',
    // Loading states
    'loading-shimmer',
    'button-pulse',
    // Scroll animations
    'scroll-fade',
    'visible',
    // Progress animations
    'progress-bar',
    // Masonry grid
    'masonry-grid',
  ],
}
