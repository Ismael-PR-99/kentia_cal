/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "green-dark": "#3d6b1e",
        "gray-light": "#e5e7eb",
        "gray-ultra-light": "#f9fafb",
        "text-dark": "#111827",
        "badge-edit": "#6b7280",
        "badge-app": "#f97316",
        "badge-rc": "#3b82f6",
        "badge-rel": "#16a34a",
        "badge-dep": "#dc2626",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"]
      },
      borderRadius: {
        sm: "0.375rem",
        DEFAULT: "0.5rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        full: "9999px"
      }
    }
  },
  plugins: []
};
