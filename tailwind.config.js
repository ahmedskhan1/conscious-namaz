/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary:"var(--primary)",
        primaryhover:"var(--primary-hover)"
      },
      backgroundImage: {
        'vectorImg': "url('/images/flower_bg.png')",
        'vectorImage': "url('/images/flower_bg2.png')"
        // Add more custom background images here if needed
      },
      boxShadow: {
        'section-shadow': 'inset 0px 0px 170px 9px rgba(0, 0, 0, 0.7)',
      },
    },
  },
  plugins: [],
};
