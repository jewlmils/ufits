/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0a1628',
          light: '#0d1f3c',
          medium: '#112240',
          border: '#1e3a5f',
        },
        'gov-teal': {
          DEFAULT: '#1a6b4a',
          light: '#2d8a62',
          dark: '#145538',
        },
      },
      keyframes: {
        'pulse-sla': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'pulse-sla': 'pulse-sla 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
