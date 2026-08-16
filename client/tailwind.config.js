/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sentinel: {
          bg: '#080A0D',
          surface: '#0B0D10',
          card: '#111418',
          border: '#1E2631',
          primary: '#E11D2A',
          amber: '#F59E0B',
          green: '#22C55E',
          text: '#F5F7FA',
          muted: '#8B949E',
          accent: '#1F2937',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['IBM Plex Sans', 'sans-serif'],
      },
      boxShadow: {
        'glow-red': '0 0 20px rgba(225, 29, 42, 0.35)',
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.35)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.35)',
        'cyber': '0 0 15px rgba(225, 29, 42, 0.15), inset 0 0 15px rgba(225, 29, 42, 0.05)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
      },
    },
  },
  plugins: [],
}
