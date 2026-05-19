---
name: xiaohongshu-generator
description: Generate Xiaohongshu (小红书/Little Red Book) card images from Markdown articles with automatic pagination and professional typography. Use this when the user wants to create content for Xiaohongshu, generate card-style images, create social media graphics, or mentions "小红书", "Little Red Book", "card images", "图片生成", or needs to convert articles into visual card format for Chinese social media platforms. This skill handles the complete image generation pipeline including content splitting, pagination, and rendering.
---

# Xiaohongshu Card Generator

Generate professional Xiaohongshu (Little Red Book) card images from Markdown articles with automatic pagination and beautiful typography.

## What This Skill Does

This skill helps you convert Markdown articles into:
- **750×1000px card images** (2x resolution for quality)
- **Automatic pagination** - Splits long content into multiple cards
- **Smart content layout** - Optimizes for mobile card format
- **Professional typography** - Uses any of the 19 WeChat themes
- **Article metadata** - Character count, reading time, image count

## Quick Start

### Step 1: Check Prerequisites

First, ensure you have the `typeset` CLI installed:

```bash
which typeset || command -v typeset
```

### Step 2: Installation (if needed)

```bash
# Clone the repository
git clone https://github.com/yourusername/Typography-Skill.git
cd Typography-Skill/cli

# Install with pnpm
pnpm install

# Build TypeScript
pnpm run build

# Add to PATH
export PATH="$PATH:$(pwd)"
```

**Note**: The `image` command requires Puppeteer, which will download Chromium on first run. This may take a few minutes.

### Step 3: Generate Card Images

```bash
# Basic usage - generate cards with default theme
typeset image article.md -o ./xhs_output

# Specify a theme (uses theme's background color)
typeset image article.md -s wechat-tech -o ./xhs_output

# Hide the info panel on first page
typeset image article.md --no-info -o ./xhs_output
```

Generated files will be in the output directory as `page-1.png`, `page-2.png`, etc.

## Understanding Card Format

### Specifications

- **Dimensions**: 750×1000px (3:4 aspect ratio)
- **Resolution**: 2x (Retina quality)
- **Format**: PNG with transparency support
- **Pagination**: Automatic based on content length

### Card Structure

**Page 1** (with info panel):
- Article title (if present)
- Info panel: character count, reading time, image count
- Content until vertical space is filled

**Subsequent pages**:
- Content continuation
- Automatic pagination based on measured height
- Each page optimized for readability

## Command Options

### Theme Selection (-s, --style)

Choose from 19 themes for background color and typography:

```bash
typeset image article.md -s wechat-anthropic -o ./output
```

The theme affects:
- Background color
- Text colors
- Typography styles
- Overall mood

Popular choices for Xiaohongshu:
- **wechat-anthropic** - Warm terracotta (engaging)
- **gaudi-organic** - Rainbow gradients (eye-catching)
- **warm-docs** - Orange comfort (friendly)
- **latepost-depth** - Red emphasis (bold)

### Output Directory (-o, --output)

Specify where to save generated images:

```bash
typeset image article.md -o ./my_cards
```

Default: `./xhs_output`

### Info Panel (--no-info)

Control the first-page info panel:

```bash
# With info panel (default)
typeset image article.md -o ./output

# Without info panel
typeset image article.md --no-info -o ./output
```

The info panel shows:
- 📝 Character count
- ⏱️ Estimated reading time
- 🖼️ Number of images

## Workflow Examples

### Example 1: Tutorial or Guide

```bash
# Technical content with code snippets
typeset image tutorial.md -s wechat-tech -o ./tutorial_cards

# Result: Multiple cards with clean code formatting
```

### Example 2: Lifestyle or Travel

```bash
# Visual content with vibrant theme
typeset image travel-guide.md -s gaudi-organic -o ./travel_cards

# Result: Colorful, eye-catching cards
```

### Example 3: Professional Content

```bash
# Business or educational
typeset image article.md -s wechat-ft -o ./professional_cards

# Result: Elegant, editorial-style cards
```

### Example 4: Minimalist Aesthetic

```bash
# Clean, focus on content
typeset image essay.md -s kenya-emptiness --no-info -o ./minimal_cards

# Result: Zen-like cards without distractions
```

## Content Optimization

### What Works Well

**Short to medium articles** (500-2000 characters)
- Fits in 1-3 cards
- Good engagement on Xiaohongshu

**Listicles and tips**
- Clear structure
- Easy to scan in card format

**Visual content**
- Images are preserved
- Automatic layout optimization

**Code snippets**
- Syntax highlighting maintained
- Monospace font for clarity

### Content Preparation

**Add structure** to help pagination:
```markdown
# Clear Title

## Section 1
Content here...

## Section 2
More content...
```

**Use shorter paragraphs** for card format:
- Break long paragraphs into 2-3 sentences
- Each paragraph should fit comfortably on a card

**Include images** strategically:
- Images break up text visually
- Each image is counted in the info panel

## Pagination Logic

The generator uses Puppeteer to:
1. Render the content with the chosen theme
2. Measure the height of each content block
3. Calculate how much fits per card
4. Split intelligently at logical breaks

**First page**: Less content area due to info panel offset
**Subsequent pages**: Full content area available

## Output Files

Generated files follow this naming pattern:
```
page-1.png
page-2.png
page-3.png
...
```

Each file is a standalone card image ready to upload to Xiaohongshu.

## Article Information

After generation, you'll see:
```
Generated 3 page(s):
  ./xhs_output/page-1.png
  ./xhs_output/page-2.png
  ./xhs_output/page-3.png

Article info: 1847 chars, ~6 min read, 4 image(s)
```

This metadata helps with:
- Title/description on Xiaohongshu
- Hashtag strategy
- Content planning

## Theme Recommendations for Xiaohongshu

### High Engagement (Eye-catching)

**gaudi-organic** - Rainbow gradients
- Stands out in feed
- Artistic and creative
- Good for: Lifestyle, art, creative content

**latepost-depth** - Red emphasis
- Strong visual impact
- News and commentary
- Good for: Opinion pieces, analysis

### Approachable (Friendly)

**warm-docs** - Orange warmth
- Inviting and friendly
- Comfortable reading
- Good for: Tips, tutorials, lifestyle

**wechat-anthropic** - Terracotta gradient
- Modern and warm
- Tech-forward but approachable
- Good for: Tech, productivity, business

### Professional (Trustworthy)

**wechat-ft** - Financial Times
- Editorial credibility
- Sophisticated
- Good for: Business, finance, professional content

**guardian** - Navy with yellow
- Authority and depth
- Journalism standards
- Good for: News, analysis, research

### Minimalist (Clean)

**kenya-emptiness** - Ultra-minimal
- Zen aesthetic
- Focus on content
- Good for: Philosophy, essays, poetry

**jonyive** - Apple minimalism
- Design-forward
- Premium feel
- Good for: Design, tech, creativity

## Best Practices

### Before Generating

1. **Proofread** - Cards are images, text can't be edited after
2. **Test themes** - Generate samples with 2-3 themes
3. **Check length** - Very long articles generate many cards
4. **Optimize images** - Large images increase card count

### After Generating

1. **Review all pages** - Check for pagination issues
2. **Test upload** - Upload one card to check quality
3. **Add hashtags** - Use the character count info for planning
4. **Schedule posts** - Multiple cards can be posted as a series

### For Xiaohongshu Success

- **First card matters most** - Include compelling title/hook
- **Consistent branding** - Use same theme for series
- **Vertical video ratio** - 3:4 is optimized for mobile
- **Text readability** - Ensure text is large enough on mobile

## Troubleshooting

### "Chromium not found"

Puppeteer needs to download Chromium:

```bash
# Set mirror if needed (China)
export PUPPETEER_DOWNLOAD_HOST=https://registry.npmmirror.com/-/binary/chromium-browser-snapshots

# Re-run the command
typeset image article.md -o ./output
```

### "Too many pages generated"

Your article is too long. Solutions:
- Split into multiple articles
- Edit for brevity
- Accept that it will be a long-form series

### "Text cut off on card"

Check your markdown:
- Avoid extremely long paragraphs
- Use more headings for breaks
- Insert manual page breaks with `---` if needed

### "Wrong background color"

The theme determines the background. Try different themes:

```bash
typeset image article.md -s wechat-tech -o ./output
```

### "Images not showing"

- Check image paths are correct
- Use absolute paths or relative to markdown file
- Ensure images are accessible (not local-only if sharing)

## Advanced: Content Strategy

### Card Series Planning

**Long article** → Split into parts:
```
Part 1: Introduction + Topic 1 (3-4 cards)
Part 2: Topic 2 + Topic 3 (3-4 cards)
Part 3: Conclusion + Takeaways (2-3 cards)
```

**Thematic series**:
```bash
# Generate with consistent theme
typeset image part1.md -s wechat-anthropic -o ./series1
typeset image part2.md -s wechat-anthropic -o ./series2
typeset image part3.md -s wechat-anthropic -o ./series3
```

### Cross-Platform Strategy

1. **Write once in Markdown**
2. **Generate WeChat HTML**: `typeset article.md -s wechat-tech -o wechat.html`
3. **Generate Xiaohongshu cards**: `typeset image article.md -s wechat-tech -o ./xhs`
4. **Post to both platforms** with consistent branding

## When to Use This Skill

Use this skill when:
- Creating content for Xiaohongshu
- Converting blog posts to card format
- Making social media graphics from articles
- Creating visual summaries
- Planning multi-platform content strategy
- Need professional card images without manual design

## When NOT to Use This Skill

- For simple image sharing (use Xiaohongshu's built-in editor)
- For video content (different format needed)
- For very long articles (consider editing down first)
- When you need editable text (cards are images)

## Related Skills

- **wechat-typer** - Convert Markdown to WeChat HTML
- **wechat-theme-explorer** - Choose the right theme for your content

## Integration with Content Workflows

### Blog → Social Media

```bash
# Start with blog post in Markdown
blog-post.md

# Generate WeChat article
typeset blog-post.md -s wechat-tech -o wechat.html

# Generate Xiaohongshu cards
typeset image blog-post.md -s wechat-tech -o ./xhs_cards
```

### Newsletter → Social

```markdown
# Newsletter content
newsletter.md

# Create visual snippets for social
typeset image newsletter.md -s warm-docs -o ./promo
```

## Getting Help

```bash
typeset image --help
typeset styles  # List all available themes
```

For more examples and theme previews, visit the project repository.
