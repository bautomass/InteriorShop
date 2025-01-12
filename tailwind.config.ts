// tailwind.config.ts
import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f6f5f3', // Warm paper
          100: '#ebe7e0', // Rice paper
          200: '#dcd5ca', // Oyster white
          300: '#c7baa8', // Warm sand
          400: '#b39e86', // Raw silk
          500: '#9c826b', // Cedar wood
          600: '#846a57', // Walnut
          700: '#6b5445', // Coffee bean
          800: '#534238', // Deep earth
          900: '#3b312d' // Charcoal clay
        },
        accent: {
          50: '#f4f6f4', // Sage mist
          100: '#e5e9e4', // Morning fog
          200: '#ccd5c9', // Eucalyptus
          300: '#aebdaa', // Dried sage
          400: '#8fa089', // Olive stone
          500: '#71836b', // Forest shadow
          600: '#5c6a56', // Pine bark
          700: '#4a5445', // Deep moss
          800: '#3a4137', // Night forest
          900: '#2b2f29' // Dark bamboo
        }
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)']
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        fadeInSoft: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        blink: {
          '0%': { opacity: '0.2' },
          '20%': { opacity: '1' },
          '100%': { opacity: '0.2' }
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1deg)' }
        },
        'text-shimmer': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        ping: {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: '0',
          },
        },
        slideIn: {
          '0%': { 
            opacity: '0', 
            transform: 'translate(-20px, -50%) scale(0.95)'
          },
          '100%': { 
            opacity: '1', 
            transform: 'translate(0, -50%) scale(1)'
          },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        fadeIn: 'fadeIn .3s ease-in-out',
        'fadeInSoft': 'fadeInSoft 0.3s ease-out forwards',
        carousel: 'marquee 60s linear infinite',
        blink: 'blink 1.4s both infinite',
        wiggle: 'wiggle 1s ease-in-out infinite',
        'text-shimmer': 'text-shimmer 3s ease infinite',
        ping: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        slideIn: 'slideIn 0.3s ease-out forwards',
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.23, 1, 0.32, 1)',
      }
    }
  },
  future: {
    hoverOnlyWhenSupported: true
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/typography'),
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          'animation-delay': (value) => {
            return {
              'animation-delay': value
            };
          }
        },
        {
          values: theme('transitionDelay')
        }
      );
    }),
    require('tailwind-scrollbar-hide')
  ]
};

export default config;
