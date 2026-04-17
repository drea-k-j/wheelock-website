# Theme Configuration Guide

All theme settings (colors, fonts, spacing, etc.) are centralized in **`frontend/src/theme.js`**.

## How to Use

**Edit only `theme.js`** — everything else auto-generates from it.

### Change Colors
Edit `frontend/src/theme.js` and update the `colors` object:

```javascript
colors: {
  primary: "#00693e",      // Main brand color
  secondary: "#c4dd88",    // Accent color
  background: "#e2e2e2",   // Page background
  text: {
    primary: "#1f2937",    // Main text
    secondary: "#374151",  // Secondary text
    light: "#ffffff",      // Text on dark backgrounds
  },
  // ... etc
}
```

### Change Fonts, Spacing, Shadows, etc.
Same process—just edit the corresponding object in `theme.js`.

## Auto-Generation

When you run `npm run dev` or `npm run build`:
1. `generateThemeVars.js` reads `theme.js`
2. Flattens all nested values into CSS variables
3. Writes them to `index.css` `:root` block
4. Tailwind reads `theme.js` and generates classes
5. Both CSS variables and Tailwind classes stay in sync

**Don't manually edit `index.css` `:root` block** — it will be overwritten on next build.

## How It Works

```
theme.js (source of truth)
    ↓
    ├→ generateThemeVars.js → CSS variables in index.css
    └→ tailwind.config.js → Tailwind utility classes
```

## Using Theme Values in Components

**In JSX (Tailwind classes):**
```jsx
<div className="bg-wheelock-dark text-wheelock-light">
  // Uses colors from theme.js
</div>
```

**In CSS (CSS variables):**
```css
.my-element {
  background-color: var(--color-primary);
  font-family: var(--font-body);
  padding: var(--spacing-lg);
  color: var(--color-text-primary);
}
```

**In inline styles (theme object):**
```jsx
import theme from '@/theme'

<div style={{ 
  backgroundColor: theme.colors.primary,
  color: theme.colors.text.light 
}}>
  // Direct access to theme values
</div>
```

## Example: Changing the Primary Color

1. Open `frontend/src/theme.js`
2. Change `primary: "#00693e"` to your new color
3. Run `npm run dev` (or next build automatically regenerates)
4. The change applies everywhere:
   - Tailwind `bg-wheelock-dark` classes
   - CSS variables `var(--color-primary)`
   - Direct imports `theme.colors.primary`
