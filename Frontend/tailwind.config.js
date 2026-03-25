/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Gradient from-* classes used by courses
    'from-blue-600', 'from-blue-700', 'from-purple-600', 'from-amber-500',
    'from-green-500', 'from-red-500', 'from-yellow-500', 'from-orange-500',
    'from-teal-500', 'from-indigo-600', 'from-sky-600', 'from-rose-600',
    // Gradient to-* classes used by courses
    'to-cyan-500', 'to-pink-500', 'to-orange-500', 'to-emerald-500',
    'to-rose-500', 'to-indigo-600', 'to-amber-500', 'to-red-500',
    'to-green-500', 'to-violet-500', 'to-blue-500',
    // Background colors used by courses
    'bg-blue-100', 'bg-purple-100', 'bg-amber-100', 'bg-green-100',
    'bg-red-100', 'bg-indigo-100', 'bg-yellow-100', 'bg-orange-100',
    'bg-teal-100', 'bg-rose-100', 'bg-sky-100',
    'bg-blue-600/10', 'bg-purple-600/10', 'bg-indigo-600/10',
    'bg-orange-600/10', 'bg-sky-600/10', 'bg-red-600/10',
    'bg-yellow-600/10', 'bg-teal-600/10', 'bg-rose-600/10',
    // Text colors used by courses
    'text-blue-600', 'text-purple-600', 'text-amber-600', 'text-green-600',
    'text-red-600', 'text-indigo-600', 'text-yellow-600', 'text-orange-600',
    'text-teal-600', 'text-rose-600', 'text-sky-600',
    // Hover border colors used by courses
    'group-hover:border-blue-500/50', 'group-hover:border-purple-500/50',
    'group-hover:border-amber-500/50', 'group-hover:border-green-500/50',
    'group-hover:border-red-500/50', 'group-hover:border-indigo-500/50',
    'group-hover:border-yellow-500/50', 'group-hover:border-orange-500/50',
    'group-hover:border-teal-500/50', 'group-hover:border-sky-500/50',
    'group-hover:border-rose-500/50',
    // Hover shadow colors used by courses
    'group-hover:shadow-blue-500/20', 'group-hover:shadow-purple-500/20',
    'group-hover:shadow-amber-500/20', 'group-hover:shadow-green-500/20',
    'group-hover:shadow-red-500/20', 'group-hover:shadow-indigo-500/20',
    'group-hover:shadow-yellow-500/20', 'group-hover:shadow-orange-500/20',
    'group-hover:shadow-teal-500/20', 'group-hover:shadow-sky-500/20',
    'group-hover:shadow-rose-500/20',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Brand Blue
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // Brand Orange
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        slate: {
          850: '#1e293b', // Custom dark slate
        },
        dark: '#0f172a',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      keyframes: {
        'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        },
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
      animation: {
        'infinite-scroll': 'infinite-scroll 25s linear infinite',
        blob: "blob 7s infinite",
      },
    },
  },
  plugins: [],
}
