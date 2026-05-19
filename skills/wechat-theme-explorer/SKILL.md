---
name: wechat-theme-explorer
description: Explore and select from 19 typography themes for WeChat Official Account articles. Use this when the user wants to browse available themes, choose a style for their WeChat article, preview typography options, or asks "what themes are available?", "show me the styles", "帮我看看有哪些主题", "哪个主题适合". This skill helps users understand the visual characteristics of each theme and make informed choices for their content.
---

# WeChat Theme Explorer

Explore and select from 19 professionally designed typography themes for WeChat Official Account articles.

## What This Skill Does

This skill helps you:
- List all 19 available typography themes
- Understand the characteristics of each theme
- Choose the right theme for your content type
- Preview theme styles and color schemes

## Quick Start

### Step 1: Check Prerequisites

Ensure you have the `typeset` CLI installed:

```bash
which typeset || command -v typeset
```

### Step 2: List All Themes

```bash
typeset styles
```

This displays all 19 themes in the format:
```
  theme-key                Theme Name (中文)
```

## Theme Categories

### Minimalist & Clean

**wechat-default** - 默认公众号风格
- Classic blue-gray color scheme
- Safe choice for general content
- Good readability on all devices

**wechat-deepread** - 深度阅读
- Extreme minimalist black and white
- Focus on content without distraction
- Ideal for long-form articles

**kenya-emptiness** - 原研哉·空
- Kenya Hara-inspired ultra-minimalism
- Extra-wide letter and line spacing
- Zen-like breathing room

**jonyive** - Jony Ive
- Ultra-light font weights
- Generous whitespace
- Apple-esque simplicity

### Serif & Editorial

**wechat-ft** - 金融时报 (Financial Times)
- Classic serif typography
- Beige background warmth
- Traditional newspaper feel

**wechat-nyt** - 纽约时报 (New York Times)
- Georgia serif headlines
- Professional editorial style
- News publication aesthetic

**wechat-medium** - Medium 长文
- Georgia headings, sans-serif body
- Optimized for long-form reading
- Medium platform inspired

**hische-editorial** - Hische·编辑部
- Didot serif elegance
- Editorial magazine layout
- High-fashion typography

**lemonde** - Le Monde 世界报
- French newspaper sophistication
- Didot serif with European styling
- Classic editorial design

### Technology & Code

**wechat-tech** - 技术风格
- Blue and green code accents
- Optimized for technical content
- Developer-friendly color scheme

**wechat-anthropic** - Claude
- Terracotta gradient warmth
- AI-inspired aesthetics
- Modern tech company style

### Bold & Impactful

**latepost-depth** - 晚点风格
- Strong red emphasis
- High-contrast headings
- Journalism impact

**guardian** - Guardian 卫报
- Deep navy with yellow highlights
- British editorial authority
- Strong visual hierarchy

**nikkei** - Nikkei 日経
- Japanese sans-serif
- Red accent marks
- Asian business publication style

### Creative & Artistic

**gaudi-organic** - 高迪·有机
- Rainbow gradient backgrounds
- Organic shapes and flowing colors
- Whimsical and playful

**ando-concrete** - 安藤·清水
- Minimalist concrete texture
- Raw and industrial elegance
- Japanese architecture inspired

### Elegant & Traditional

**wechat-elegant** - 优雅简约
- Songti (serif) with first-line indent
- Traditional Chinese typography
- Cultural sophistication

**warm-docs** - 焦橙文档
- Warm orange document aesthetic
- Comfortable reading temperature
- Friendly and approachable

**apple** - Apple 极简
- SF Pro system fonts
- Gray text restraint
- Premium minimalism

## Choosing the Right Theme

### By Content Type

**News & Journalism**
- `latepost-depth` - Bold red, high impact
- `guardian` - Authority and depth
- `wechat-nyt` - Classic editorial

**Technical Tutorials**
- `wechat-tech` - Code-friendly colors
- `wechat-anthropic` - Modern tech warmth
- `wechat-default` - Safe, readable

**Long-form Essays**
- `wechat-medium` - Optimized for length
- `kenya-emptiness` - Zen reading experience
- `wechat-deepread` - Pure focus

**Cultural Content**
- `wechat-elegant` - Traditional sophistication
- `wechat-ft` - Classic newspaper
- `lemonde` - European editorial

**Creative & Visual**
- `gaudi-organic` - Artistic expression
- `ando-concrete` - Architectural minimalism
- `jonyive` - Design-forward

**Business & Professional**
- `guardian` - Corporate authority
- `nikkei` - Business publication
- `wechat-default` - Professional standard

### By Reading Environment

**Mobile-first**
- `kenya-emptiness` - Extra spacing for readability
- `wechat-deepread` - High contrast
- `jonyive` - Light and airy

**Desktop/tablet**
- `wechat-ft` - Serif elegance
- `hische-editorial` - Magazine layout
- `apple` - Screen-optimized

**Dark mode consideration**
Most themes work well, but `wechat-deepread` and `latepost-depth` have strong contrast that adapts well.

## Testing Themes

### Quick Theme Comparison

Convert the same article with different themes to compare:

```bash
typeset article.md -s wechat-default -o default.html
typeset article.md -s wechat-tech -o tech.html
typeset article.md -s latepost-depth -o latepost.html
```

Open each in a browser to preview before choosing.

### Theme Preview Workflow

1. **List themes**: `typeset styles`
2. **Choose 2-3 candidates** based on content type
3. **Generate previews** with each theme
4. **Open in browser** to visualize
5. **Paste into WeChat editor** for final testing

## Theme Details

### Color Psychology

- **Blue themes** (`wechat-default`, `wechat-tech`, `guardian`) - Trust, professionalism
- **Red themes** (`latepost-depth`, `wechat-anthropic`) - Energy, urgency, importance
- **Warm themes** (`warm-docs`, `wechat-ft`) - Comfort, approachability
- **Minimal themes** (`kenya-emptiness`, `jonyive`) - Clarity, focus

### Typography Choices

- **Sans-serif** (most themes) - Modern, screen-optimized
- **Serif** (`wechat-ft`, `wechat-nyt`, `wechat-medium`) - Tradition, elegance
- **Mixed** - Headings serif, body sans-serif for balance

## Special Considerations

### For WeChat Editor

All themes are optimized for WeChat's constraints:
- Inline CSS only (WeChat strips `<style>` tags)
- Table-based image grids (no CSS Grid support)
- Code blocks with macOS window chrome
- Compatible color contrast

### For Accessibility

- All themes maintain WCAG contrast ratios
- Font sizes optimized for mobile reading (16px base)
- Line heights 1.6-1.8 for readability

### For Chinese Typography

- First-line indents where appropriate
- Proper character spacing for CJK
- Cultural design considerations

## Advanced: Customization

While themes are pre-built for consistency, you can:
1. Choose a close theme as base
2. Modify the generated HTML's inline styles
3. Save as a custom template for future use

Theme definitions are in the CLI source if you want to contribute new themes.

## Troubleshooting

**"Theme not found"**
- Check the theme key (use the English key, not Chinese name)
- Run `typeset styles` to see exact keys

**"Colors look wrong in WeChat"**
- WeChat may adjust colors slightly
- Test in actual WeChat editor, not just browser
- Some dark themes may need manual adjustment

**"Text too small/large"**
- Themes are optimized for mobile (16px base)
- Can adjust font-size in generated HTML if needed
- Consider mobile vs desktop readership

## When to Use This Skill

Use this skill when:
- Choosing a theme for a new article
- Exploring visual options for content
- Advising others on typography choices
- Comparing theme characteristics
- Planning content strategy with visual consistency

## Related Skills

- **wechat-typer** - Convert Markdown to WeChat HTML with chosen theme
- **xiaohongshu-generator** - Generate card images for Xiaohongshu

## Theme Recommendation Examples

**"I'm writing a technical tutorial"**
→ `wechat-tech` or `wechat-anthropic`

**"It's a cultural essay about traditional Chinese poetry"**
→ `wechat-elegant` or `wechat-ft`

**"News analysis piece"**
→ `latepost-depth` or `guardian`

**"Personal blog post, want it clean and minimal"**
→ `kenya-emptiness` or `jonyive`

**"Company announcement, professional but not boring"**
→ `wechat-default` or `warm-docs`
