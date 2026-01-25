import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        background: {
          light: "#f6f6f8",
          dark: "#0B0E14", 
        },
        card: {
          light: "#ffffff",
          dark: "#151921",
        },
        border: {
          light: "#dbdde6",
          dark: "#2D333D",
        },
        input: {
          light: "#ffffff",
          dark: "#0B0E14",
        },
        primary: {
          DEFAULT: "#2563eb",
          light: "#1337ec",
          dark: "#2563eb",
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
export default config;