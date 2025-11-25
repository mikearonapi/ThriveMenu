/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      colors: {
        sage: {
          50: 'var(--sage-50)',
          100: 'var(--sage-100)',
          200: 'var(--sage-200)',
          300: 'var(--sage-300)',
          400: 'var(--sage-400)',
          500: 'var(--sage-500)',
          600: 'var(--sage-600)',
          700: 'var(--sage-700)',
          800: 'var(--sage-800)',
          900: 'var(--sage-900)',
        },
        cream: {
          100: 'var(--cream-100)',
          200: 'var(--cream-200)',
          300: 'var(--cream-300)',
        },
        forest: {
          50: 'var(--forest-50)',
          100: 'var(--forest-100)',
          200: 'var(--forest-200)',
          300: 'var(--forest-300)',
          400: 'var(--forest-400)',
          500: 'var(--forest-500)',
          600: 'var(--forest-600)',
          700: 'var(--forest-700)',
          800: 'var(--forest-800)',
        },
        rose: {
          50: 'var(--rose-50)',
          100: 'var(--rose-100)',
          200: 'var(--rose-200)',
          300: 'var(--rose-300)',
          400: 'var(--rose-400)',
          500: 'var(--rose-500)',
        },
        terracotta: {
          50: 'var(--terracotta-50)',
          100: 'var(--terracotta-100)',
          200: 'var(--terracotta-200)',
          300: 'var(--terracotta-300)',
          400: 'var(--terracotta-400)',
          500: 'var(--terracotta-500)',
          600: 'var(--terracotta-600)',
          700: 'var(--terracotta-700)',
        },
      },
    },
  },
  plugins: [],
};

