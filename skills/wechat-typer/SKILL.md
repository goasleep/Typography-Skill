---
name: wechat-typer
description: Convert Markdown articles to WeChat Official Account-compatible HTML with beautiful typography themes. Use this when the user wants to publish content on WeChat (微信公众号), prepare articles for WeChat editor, format Markdown for WeChat, or mentions "WeChat HTML", "公众号排版", "微信公众号", or needs to convert Markdown for Chinese social media platforms. This skill handles the complete workflow: Markdown preprocessing, theme selection (19 available styles), syntax highlighting, image grid layout, and clipboard-compatible output optimization.
---

# WeChat Typer

Convert Markdown articles to WeChat Official Account-compatible HTML with professional typography themes.

## What This Skill Does

This skill helps you convert Markdown articles into beautifully formatted HTML that's ready to paste into WeChat's Official Account editor. It handles:

- **19 professional typography themes** - From minimalist to editorial styles
- **Syntax highlighting** - Code blocks with macOS-style window chrome
- **Image grids** - Automatic layout for consecutive images
- **WeChat optimization** - Converts modern CSS to WeChat-compatible tables
- **Smart preprocessing** - Fixes formatting issues from tools like Feishu

## Quick Start

### Step 1: Check Prerequisites

First, let's check if you have the `typeset` CLI installed:

```bash
which typeset || command -v typeset
```

If not installed, you'll see output. If installed, it will show the path.

### Step 2: Installation (if needed)

If `typeset` is not installed, install it:

```bash
# Clone the repository
git clone https://github.com/yourusername/Typography-Skill.git
cd Typography-Skill/cli

# Install dependencies with pnpm
pnpm install

# Build TypeScript
pnpm run build

# Add to PATH (add to your ~/.bashrc or ~/.zshrc)
export PATH="$PATH:$(pwd)"
```

### Step 3: Convert Your Markdown

Once installed, convert any Markdown file:

```bash
# Basic usage - output to terminal
typeset article.md

# Specify a theme and save to file
typeset article.md -s wechat-tech -o output.html

# Keep CSS Grid (skip WeChat table conversion)
typeset article.md --no-clipboard
```

## Available Themes

List all 19 available themes:

```bash
typeset styles
```

Popular themes include:
- **wechat-default** - Classic WeChat style (blue-gray)
- **wechat-tech** - Technology theme (blue + green code)
- **wechat-anthropic** - Claude-inspired (terracotta gradient)
- **latepost-depth** - LatePost style (red emphasis)
- **wechat-ft** - Financial Times (serif + beige background)
- **kenya-emptiness** - Kenya Hara minimalist (wide spacing)

## Understanding the Options

### Theme Selection (-s, --style)

Choose from 19 professionally designed themes:

```bash
typeset article.md -s wechat-tech
```

### Output File (-o, --output)

By default, output goes to stdout (you can copy directly). Use `-o` to save:

```bash
typeset article.md -o output.html
```

### Clipboard Mode (--no-clipboard)

**Default behavior**: Optimizes for WeChat's editor
- Converts CSS Grid image layouts to `<table>` elements
- Simplifies code blocks for better compatibility
- Flattens nested lists
- Adjusts blockquotes for dark mode compatibility

**With `--no-clipboard`**: Keeps modern CSS
- Preserves CSS Grid layouts
- Maintains original code block structure
- Better for web viewing, but may not paste correctly into WeChat

```bash
# WeChat-compatible (default)
typeset article.md

# Keep modern CSS (web viewing)
typeset article.md --no-clipboard
```

## Workflow Examples

### Example 1: Quick WeChat Article

```bash
# Convert with tech theme
typeset my-article.md -s wechat-tech -o wechat-article.html

# Open and copy the HTML
cat wechat-article.html | pbcopy  # macOS
# or
cat wechat-article.html | xclip   # Linux
```

### Example 2: Article with Multiple Images

```bash
# Convert - consecutive images will be grouped into a grid
typeset photo-essay.md -s wechat-elegant -o output.html
```

### Example 3: Code-Heavy Tutorial

```bash
# Use a tech theme with good code highlighting
typeset tutorial.md -s wechat-tech -o tutorial.html
```

## Troubleshooting

### "typeset: command not found"

The CLI isn't installed or not in your PATH. See Step 2 above.

### "Cannot find module"

You need to build the TypeScript:

```bash
cd Typography-Skill/cli
pnpm run build
```

### Output Looks Wrong in WeChat

Make sure you're using default mode (without `--no-clipboard`). The clipboard mode converts incompatible CSS to tables.

### Theme Not Found

Check the theme name:

```bash
typeset styles
```

Use the key in the left column (e.g., `wechat-tech`), not the Chinese name.

## Advanced: Understanding the Render Pipeline

If you're interested in how the conversion works:

1. **Preprocessing** - Normalizes Markdown, fixes broken bold from tools like Feishu
2. **Markdown parsing** - Uses markdown-it with highlight.js for code
3. **Inline styles** - Applies theme styles directly to elements (WeChat strips `<style>` tags)
4. **Clipboard optimization** - Converts modern CSS to WeChat-compatible formats

## When to Use This Skill

Use this skill when:
- Publishing articles on WeChat Official Accounts
- Converting Markdown to HTML for Chinese social media
- Preparing content with Chinese typography considerations
- Need professional article formatting without manual styling
- Working with articles exported from other platforms (Feishu, Notion, etc.)

## When NOT to Use This Skill

- For general web HTML (use a standard Markdown converter)
- For email newsletters (different CSS constraints)
- For platforms that support external stylesheets (no need for inline styles)

## Getting Help

View available commands and options:

```bash
typeset --help
typeset image --help
typeset styles
```

For the full documentation and theme previews, visit the project repository.
