import { theme } from './src/theme.js'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wheelock: {
          dark: theme.colors.primary,
          light: theme.colors.background,
          "light-alt": theme.colors.background_alt,
          accent: theme.colors.secondary,
        },
        gray: theme.colors.gray,
        error: theme.colors.error,
        error_light: theme.colors.error_light,
        success: theme.colors.success,
        success_light: theme.colors.success_light,
      },
      fontFamily: {
        sans: theme.fonts.body,
        serif: theme.fonts.heading,
      },
      fontSize: {
        h1: theme.fontSize.h1,
        h2: theme.fontSize.h2,
        h3: theme.fontSize.h3,
      },
    },
  },
  plugins: [],
}
