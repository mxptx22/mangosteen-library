/** @type {import('tailwindcss').Config} */
module.exports = {
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#997A90",
          "primary-content": "#F8F6F7",
          secondary: "#C9B8C3",
          accent: "#352E33",
          neutral: "#57534e",
          "base-100": "#FFFFFF",
          info: "#60a5fa",
          success: "#4ade80",
          warning: "#e47e66",
          "warning-content": "#fff5f0",
          error: "#ad3964",
          "error-content": "#FAF6F7",
        },
      },
    ],
  },

  content: [
    "./src/*.{html,js,css}",
    "./views/*.ejs",
    "./views/*/*.ejs",
    "./views/**/*.ejs",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("daisyui"),
    {
      tailwindcss: {},
      autoprefixer: {},
    },
  ],
};
