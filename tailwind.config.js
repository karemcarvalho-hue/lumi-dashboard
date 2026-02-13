/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          surface: '#eef5ff',
          'surface-highlight': '#96c1fc',
          interactive: '#006BC8',
          'interactive-hover': '#0050c3',
          'text-low': '#002C53',
          'text-high': '#00255a',
        },
        success: {
          surface: '#defef2',
          'surface-highlight': '#7af7c7',
          interactive: '#00a656',
          'text-low': '#005333',
        },
        danger: {
          surface: '#ffecec',
          'surface-highlight': '#ffb3b3',
          interactive: '#d82c2c',
          'text-low': '#530001',
        },
        warning: {
          surface: '#fff4e0',
          'surface-highlight': '#ffcc66',
          interactive: '#cc7a00',
          'text-low': '#533300',
        },
        neutral: {
          background: '#ffffff',
          surface: '#f6f6f6',
          'surface-highlight': '#d1d1d1',
          'surface-disabled': '#e7e7e7',
          'text-high': '#0a0a0a',
          'text-low': '#5d5d5d',
          'text-disabled': '#a0a0a0',
        },
        ai: {
          purple: '#e2dcfa',
          'generative-interactive': '#e2dcfa',
          gradient: 'linear-gradient(17deg, #0050C3 28%, #4629BA 49%, #D8446E 83%)',
        },
        'moon-light': '#eef4fa',
        'neutral-interactive': '#b0b0b0',
      },
      fontFamily: {
        sans: ['Geist Variable', 'Geist', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'caption': ['12px', { lineHeight: '16px' }],
        'base': ['14px', { lineHeight: '20px' }],
        'highlight': ['16px', { lineHeight: '24px' }],
        'h1': ['32px', { lineHeight: '40px', fontWeight: '600' }],
        'h2': ['24px', { lineHeight: '32px', fontWeight: '600' }],
      },
      spacing: {
        '0.5': '2px',
        '1': '4px',
        '1.5': '6px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        'full': '9999px',
      },
      boxShadow: {
        'level-1': '0px 1px 2px rgba(0, 0, 0, 0.05)',
        'level-2': '0px 0px 2px rgba(0, 0, 0, 0.1)',
        'ai-focus': '0px 0px 0px 3px #e2dcfa',
      }
    },
  },
  plugins: [],
}
