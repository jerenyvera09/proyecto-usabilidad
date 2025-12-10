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
        uleamRed: '#1C7CEB',
        uleamRedDark: '#09223B',
        accentBlue: '#59A66B',
        accentPurple: '#2BA3E7',
        bg900: '#04101F',
        bg800: '#09223B',
        textPrimary: '#F5F7FA',
        textMuted: '#DCE1E8',
        surface: '#0B1A30',
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
