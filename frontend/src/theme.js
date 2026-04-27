/**
 * Theme Configuration
 * 
 * Centralized theme settings for the entire application.
 * Modify values here to change colors, fonts, and other design tokens.
 */

export const theme = {
  // Color Palette
  colors: {
    primary: "#00693e",      // Wheelock dark green
    secondary: "#c4dd88",    // Wheelock accent (light green/yellow)
    background: "#e2e2e2",   // Wheelock light gray
    background_alt: "#f7f7f7", // Slightly lighter gray
    text: {
      primary: "#000000",    // black
      secondary: "#12312b",  // dark green
      light: "#ffffff",      // White text on dark backgrounds
    },
    border: "#424141",       // navy
    accent_hover: "#f5dc69", // Darker accent for hover states
    
    // Grayscale
    gray: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
    },
    
    // Semantic colors
    error: "#dc2626",        // Red
    error_light: "#fee2e2",  // Light red background
    success: "#16a34a",      // Green
    success_light: "#dcfce7", // Light green background
  },

  // Typography
  fonts: {
    body: "georgia, serif",
    heading: "georgia, serif",
  },

  fontSize: {
    h1: "2.25rem",    // 36px
    h2: "1.875rem",   // 30px
    h3: "1.5rem",     // 24px
    body: "1rem",     // 16px
    small: "0.875rem", // 14px
  },

  // Spacing (in rems, multiply by 16 for px)
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    xxl: "3rem",
  },

  // Border Radius
  borderRadius: {
    none: "0",
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    full: "9999px",
  },

  // Shadows
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  },

  // Transitions
  transitions: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
  },

  // Z-index scale
  zIndex: {
    dropdown: "10",
    sticky: "20",
    fixed: "30",
    modal_backdrop: "40",
    modal: "50",
  },
};

export default theme;
