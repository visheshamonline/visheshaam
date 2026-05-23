import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
        surface: {
          light: '#ffffff',
          dark: '#0f0f0f',
          'dark-card': '#181818',
          'dark-border': '#2a2a2a',
        },
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        headline: ['Lora', 'Georgia', 'serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '68ch',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
