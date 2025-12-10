/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        uleamRed: '#C8102E',
        uleamRedDark: '#8E001A',
        accentBlue: '#4F8BFF',
        accentPurple: '#A070FF',
        bg900: '#050D24',
        bg800: '#0B162F',
        textPrimary: '#F2F4F7',
        textMuted: '#C8CCD4',
        surface: '#0F1C3A',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-in-out',
        'pulse-soft': 'pulseSoft 1.8s ease-in-out infinite',
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
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.03)' },
        },
      },
      dropShadow: {
        neon: '0 0 15px rgba(124,58,237,0.45)',
      },
      boxShadow: {
        soft: '0 20px 70px rgba(0,0,0,0.45)',
        glow: '0 20px 60px rgba(124,58,237,0.35)',
      },
      backdropBlur: {
        lg: '18px',
      },
    },
  },
  plugins: [],
}
