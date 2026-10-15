/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0B0D12",
        surface: "#12151C",
        "surface-2": "#171C27",
        border: "#232937",
        "border-strong": "#323B55",
        text: "#E7EAF0",
        muted: "#98A0B3",
        accent: "#8AB4FF",
        danger: {
          DEFAULT: "#F2555A",
          tint: "#1A1216",
          border: "#5A2A30",
        },
        warning: {
          DEFAULT: "#F5B544",
          tint: "#2B2210",
          border: "#5C4818",
        },
        safe: {
          DEFAULT: "#3DD68C",
          tint: "#12352A",
          border: "#1B4A3A",
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        button: "10px",
        card: "14px",
        badge: "999px",
      },
    },
  },
  plugins: [],
}
