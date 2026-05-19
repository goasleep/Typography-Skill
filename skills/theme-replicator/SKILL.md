---
name: theme-replicator
description: Extract typography styles from existing HTML pages and create reusable WeChat themes. Use this when the user wants to replicate a website's design, copy a favorite article's styling, create a custom theme from existing HTML, analyze web page styles, or mentions "replicate theme", "extract styles", "create theme from HTML", "copy this design". This skill analyzes HTML structure, extracts CSS properties, generates compatible theme files, and integrates them into the typeset system.
---

# Theme Replicator

Extract typography styles from existing HTML pages and create reusable WeChat themes.

## What This Skill Does

This skill helps you analyze beautifully designed HTML pages and extract their styling to create new WeChat-compatible themes. It handles:

- **HTML style analysis** - Extracts CSS from inline styles and style tags
- **Typography pattern recognition** - Identifies fonts, colors, spacing, layouts
- **WeChat compatibility conversion** - Converts web styles to inline CSS format
- **Theme file generation** - Creates properly formatted TypeScript theme files
- **System integration** - Automatically adds new themes to the typeset CLI

## Quick Start

### Step 1: Prerequisites Check

Ensure you have the typeset CLI ready:

```bash
# Check if typeset is available
which typeset || command -v typeset

# If not, navigate to the cli directory
cd cli && pwd
```

### Step 2: Prepare Your HTML

You need an HTML file with the styling you want to replicate:

```bash
# Check if you have an HTML file
ls *.html

# Or provide a URL to analyze
# Example: https://example.com/article
```

### Step 3: Style Extraction

Provide your HTML source (file or URL) and let me extract the styles:

```bash
# From a local file
cat example.html

# Or from a URL (I'll help you fetch it)
# Provide the URL and I'll extract the HTML
```

## How Style Extraction Works

### Analysis Process

1. **HTML Structure Analysis**
   - Identify key elements: headings, paragraphs, lists, quotes, code blocks
   - Extract font families, sizes, weights, colors
   - Measure spacing, margins, padding
   - Detect background colors and gradients

2. **Style Pattern Recognition**
   - Color palette extraction (primary, secondary, accent colors)
   - Typography analysis (font stacks, sizes, line heights)
   - Layout patterns (container widths, alignment)
   - Component styling (buttons, cards, dividers)

3. **WeChat Compatibility Conversion**
   - Convert CSS classes to inline styles
   - Remove unsupported properties (CSS Grid, animations)
   - Simplify complex selectors
   - Ensure proper fallbacks

4. **Theme File Generation**
   - Create TypeScript theme file
   - Format as StyleConfig interface
   - Add proper comments and metadata
   - Organize by element type

## Usage Examples

### Example 1: Replicate a Blog Article

```bash
# You have a beautifully styled blog article
cat blog-article.html

# I'll extract:
# - Main heading styles (h1, h2, h3)
# - Paragraph typography
# - Link colors and hover effects
# - Blockquote styling
# - Code block appearance
# - Table formatting
```

### Example 2: Copy a Website Design

```bash
# Provide a URL
https://medium.com/@author/article-slug

# I'll fetch and analyze:
# - Color scheme (backgrounds, text, accents)
# - Typography choices
# - Spacing patterns
# - Visual hierarchy
```

### Example 3: Custom Theme Creation

```bash
# You have custom HTML with inline styles
<div style="font-family: 'Georgia'; color: #2c3e50;">

# I'll convert it to a reusable theme
# and add it to your typeset system
```

## What Gets Extracted

### Typography Elements

| Element | Properties Extracted |
|---------|---------------------|
| Headings (h1-h6) | Font size, weight, color, margin, line-height |
| Paragraphs | Font family, size, color, line-height, text-align |
| Links | Color, text-decoration, hover states |
| Lists | Type, indentation, spacing, bullet styles |
| Quotes | Background, borders, padding, font style |
| Code blocks | Background, borders, font family, syntax colors |
| Tables | Border styles, padding, background colors, alignment |
| Images | Max-width, border radius, shadows, margins |
| Dividers | Height, color, style (solid, dashed, gradient) |

### Design Characteristics

- **Color Palette**: Primary colors, secondary colors, accent colors
- **Typography**: Font families, fallback stacks, size scale
- **Spacing**: Margin patterns, padding consistency
- **Visual Hierarchy**: Heading size progression, emphasis styles
- **Backgrounds**: Solid colors, gradients, patterns
- **Borders**: Width, color, radius, style
- **Shadows**: Box shadows for depth and emphasis

## Theme File Structure

The generated theme follows this format:

```typescript
/**
 * [Theme Name] 主题
 * [Description]
 */

import type { StyleConfig } from '../../types';

export const theme: StyleConfig = {
  name: '[Theme Name]',
  styles: {
    container: '...', // Main container styles
    h1: '...',       // Heading level 1
    h2: '...',       // Heading level 2
    // ... all elements
  }
};
```

## Integration Steps

### 1. Theme File Creation

I'll create a new theme file in the appropriate category:

```bash
# Choose a category:
# - cli/src/lib/themes/base/      # Basic themes
# - cli/src/lib/themes/tech/      # Technology themes
# - cli/src/lib/themes/editorial/ # Editorial styles
# - cli/src/lib/themes/artistic/  # Artistic designs
# - cli/src/lib/themes/business/  # Business styles
```

### 2. System Registration

Automatically update `cli/src/lib/themes/index.ts`:

```typescript
// Add import
import { theme as yourTheme } from './category/your-theme';

// Add to staticThemes
'your-theme': yourTheme,

// Add to themeModules
'your-theme': () => import('./category/your-theme').then(m => m.theme),

// Add to themeCategories
category: [..., 'your-theme']
```

### 3. Rebuild and Test

```bash
# Rebuild the CLI
cd cli && pnpm run build

# Test the new theme
typeset test.md -s your-theme -o output.html
```

## Advanced Features

### Color Palette Analysis

I'll extract and organize colors:

```bash
# Primary colors (headings, emphasis)
# Secondary colors (paragraphs, body text)
# Accent colors (links, buttons)
# Background colors (main, sections)
# Border colors (dividers, tables)
```

### Typography Stack

Font families are analyzed and organized:

```bash
# Primary font (headings)
# Body font (paragraphs)
# Monospace font (code blocks)
# Fallback stacks for cross-platform compatibility
```

### Responsive Considerations

While WeChat doesn't support responsive CSS, I'll note:

```bash
# Container widths
# Font scaling patterns
# Mobile-first considerations
```

## Best Practices

### 1. Source HTML Quality

For best results, provide HTML with:

- **Consistent styling** - Uniform design patterns
- **Semantic HTML** - Proper heading hierarchy
- **Inline styles or style tags** - Easy to extract
- **Complete content** - All element types present

### 2. Design Elements to Look For

- **Unique typography** - Custom fonts or interesting size scales
- **Color schemes** - Harmonious palettes, good contrast
- **Spacing patterns** - Consistent margins and padding
- **Visual elements** - Decorative borders, shadows, gradients
- **Component styles** - Buttons, cards, dividers

### 3. WeChat Limitations

Keep in mind:

- **No external stylesheets** - Everything must be inline
- **No CSS Grid** - Use tables for complex layouts
- **No animations** - Static styles only
- **Limited selectors** - No pseudo-classes except :hover
- **Font restrictions** - Use web-safe fonts or system fonts

## Troubleshooting

### "Styles Not Extracting"

Make sure your HTML has:

- Inline styles (`style="..."` attributes)
- Or `<style>` tags with CSS
- Or accessible CSS classes

### "Generated Theme Looks Different"

Some CSS properties can't be replicated:

- `@font-face` - Use web-safe fonts instead
- CSS Grid - Converted to tables
- Flexbox - Simplified to block layouts
- Complex gradients - Approximated with solid colors

### "Theme Not Showing in List"

After theme creation:

```bash
# Rebuild the CLI
cd cli && pnpm run build

# Check the theme is in the index
grep "your-theme" cli/src/lib/themes/index.ts

# List available themes
typeset styles
```

## Example Workflow

### Complete Theme Creation Process

```bash
# 1. You provide HTML source
cat beautiful-article.html

# 2. I analyze and extract styles
# - Color palette: #2c3e50 (dark blue), #e74c3c (red accent)
# - Typography: Georgia for headings, Arial for body
# - Spacing: 24px vertical rhythm
# - Container: 680px max-width

# 3. I create theme file
# File: cli/src/lib/themes/artistic/custom-elegant.ts
# Name: "Custom Elegant"

# 4. I register the theme
# Updated: cli/src/lib/themes/index.ts

# 5. Rebuild and test
cd cli && pnpm run build
typeset article.md -s custom-elegant -o output.html

# 6. Verify and refine
# Preview output.html and make adjustments if needed
```

## When to Use This Skill

Use this skill when:
- You see a beautifully designed article and want that style
- You have existing HTML with great typography
- You want to replicate a competitor's design
- You need custom branding for your articles
- You want to analyze what makes a design work

## When NOT to Use This Skill

- For simple color changes (edit existing theme instead)
- For learning basic CSS (use CSS tutorials)
- For creating responsive web design (WeChat is not responsive)
- For complex interactive designs (WeChat doesn't support interactivity)

## Getting Started

Provide your HTML source and I'll help you create a beautiful new theme!

```bash
# Option 1: Local file
cat path/to/your/file.html

# Option 2: URL
# Provide the URL and I'll fetch it

# Option 3: Paste HTML directly
# Just paste the HTML content
```

Let's create something beautiful together! 🎨