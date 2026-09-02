import fs from 'fs'
import path from 'path'
import { theme } from '../src/theme.js'

/**
 * Generate CSS variables from theme.js
 * Flattens nested theme objects into CSS custom properties
 */
function generateCssVariables(obj, prefix = '') {
  let css = ''

  for (const [key, value] of Object.entries(obj)) {
    const varName = prefix ? `${prefix}-${key}` : key
    
    if (typeof value === 'object' && value !== null) {
      // Recursively handle nested objects
      css += generateCssVariables(value, varName)
    } else {
      // Convert to CSS variable format
      css += `  --${varName}: ${value};\n`
    }
  }

  return css
}

// Generate the CSS
const cssVariables = generateCssVariables(theme)
const cssContent = `:root {\n${cssVariables}}\n`

// Write to index.css
const indexCssPath = path.join(process.cwd(), 'src', 'index.css')
const existingContent = fs.readFileSync(indexCssPath, 'utf-8')

// Replace or add the :root block
const updatedContent = existingContent.replace(
  /:root \{[\s\S]*?\n\}/,
  cssContent.trim()
) || `${cssContent}\n${existingContent}`

fs.writeFileSync(indexCssPath, updatedContent)
console.log('✓ CSS variables generated from theme.js')
