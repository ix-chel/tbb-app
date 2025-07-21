/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.jsx",
    "./resources/**/*.ts",
    "./resources/**/*.tsx",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        primary: {
          light: '#FFFFFF',
          dark: '#11121E',
          DEFAULT: '#F3F3F3',
        },
        secondary: {
          yellow: '#FFBC11',
          blue: '#4578F9',
          green: '#43B430',
          purple: '#CB3EFF',
        },
        typography: {
          light: '#FFFFFF',
          gray: '#7B7B7B',
          dark: '#000000',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        '4xl': ['48px', '1.2'],
        '3xl': ['36px', '1.2'],
        'xl': ['20px', '1.2'],
        'base': ['16px', '1.5'],
        'sm': ['14px', '1.5'],
      },
      fontWeight: {
        semibold: 600,
        medium: 500,
        normal: 400,
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
} 