/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Georgia", "serif"],
      },
      // Brand palette. Tailwind's default emerald/amber are overridden so all
      // existing `bg-emerald-*` / `text-amber-*` classes pick up the brand
      // colours automatically. `emerald` = iCover primary blue (#10A3E6).
      // `amber` = iCover accent orange (#FD7D2F). Scales generated to match
      // Tailwind's 50-700 shade conventions.
      colors: {
        emerald: {
          50:  "#E7F6FD",
          100: "#CDEDFB",
          200: "#9CDAF6",
          300: "#6BC7F1",
          400: "#3DB5ED",
          500: "#10A3E6",  // brand blue
          600: "#0D85BD",
          700: "#0A6794",
        },
        amber: {
          50:  "#FFF0E6",
          100: "#FFE0CC",
          200: "#FEC299",
          300: "#FEA366",
          400: "#FE8C4A",
          500: "#FE7A33",  // brand orange (matches logo)
          600: "#E6611A",
          700: "#B34C14",
        },
      },
    },
  },
  plugins: [],
};
