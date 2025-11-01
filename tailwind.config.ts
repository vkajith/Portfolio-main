import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: '#000000',
          dark: '#ffffff'
        },
        secondary: {
          DEFAULT: '#666666',
          dark: '#a3a3a3'
        },
        accent: {
          start: '#6366f1', // indigo-500
          end: '#a855f7',   // purple-500
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'grid-gray-900': 'linear-gradient(to right, rgb(17 24 39 / var(--tw-bg-opacity)) 1px, transparent 1px), linear-gradient(to bottom, rgb(17 24 39 / var(--tw-bg-opacity)) 1px, transparent 1px)',
        'grid-white': 'linear-gradient(to right, rgb(255 255 255 / var(--tw-bg-opacity)) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / var(--tw-bg-opacity)) 1px, transparent 1px)',
        'accent-gradient': 'linear-gradient(90deg, var(--accent-start), var(--accent-end))',
      },
    },
  },
  plugins: [],
} satisfies Config;
