# WeChat Typer Skills

A collection of four Claude Code skills for converting Markdown to WeChat-compatible HTML, generating Xiaohongshu card images, and replicating custom themes.

## Skills Included

### 1. wechat-typer
Convert Markdown articles to WeChat Official Account-compatible HTML with 20 professional typography themes.

**When to use**: Publishing content on WeChat, preparing articles for WeChat editor, formatting Markdown for Chinese social media.

### 2. wechat-theme-explorer
Explore and select from 20 typography themes for WeChat articles.

**When to use**: Choosing themes, browsing visual options, previewing typography styles.

### 3. xiaohongshu-generator
Generate Xiaohongshu (Little Red Book) card images from Markdown with automatic pagination.

**When to use**: Creating content for Xiaohongshu, generating social media graphics, converting articles to visual cards.

### 4. theme-replicator
Extract typography styles from existing HTML pages and create reusable WeChat themes.

**When to use**: Replicating website designs, copying favorite article styling, creating custom themes from HTML, analyzing web page styles.

## Installation

### Option 1: Claude Code (Recommended)

1. **Download the skill files**:
   - `wechat-typer.skill`
   - `wechat-theme-explorer.skill`
   - `xiaohongshu-generator.skill`
   - `theme-replicator.skill`

2. **Install via Claude Code**:
   ```bash
   claude skill install wechat-typer.skill
   claude skill install wechat-theme-explorer.skill
   claude skill install xiaohongshu-generator.skill
   claude skill install theme-replicator.skill
   ```

3. **Verify installation**:
   ```bash
   claude skill list
   ```

### Option 2: Manual Installation

1. **Extract the skill**:
   ```bash
   mkdir -p ~/.claude/skills/
   tar -xzf wechat-typer.skill -C ~/.claude/skills/
   tar -xzf wechat-theme-explorer.skill -C ~/.claude/skills/
   tar -xzf xiaohongshu-generator.skill -C ~/.claude/skills/
   tar -xzf theme-replicator.skill -C ~/.claude/skills/
   ```

2. **Restart Claude Code** to load the skills.

## Prerequisites

These skills require the **typeset CLI** to be installed. Choose one of the following methods:

### Option 1: Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/Typography-Skill.git
cd Typography-Skill/cli

# Install dependencies (choose one)
pnpm install    # Recommended
npm install

# Build TypeScript
pnpm run build  # or npm run build

# Add to PATH (add to your ~/.bashrc or ~/.zshrc)
export PATH="$PATH:$(pwd)"
```

### Option 2: Global Installation (Recommended)

```bash
cd cli
pnpm install -g    # or npm install -g

# Now you can use 'typeset' from anywhere
typeset article.md -s wechat-tech
```

### Option 3: Using npx (No Installation Required)

```bash
cd cli
npx typeset article.md -s wechat-tech

# npx will automatically handle installation
```

**Requirements**:
- Node.js >= 18.0.0
- npm, pnpm, or npx (package manager)
- Puppeteer (for Xiaohongshu image generation)

## Usage Examples

### Example 1: Convert Article for WeChat

```bash
# Start a Claude Code conversation
claude

# Ask Claude:
"Convert my article.md to WeChat HTML using the tech theme"

# Claude will use the wechat-typer skill to:
# 1. Check if typeset is installed
# 2. Convert the article
# 3. Save the output
```

### Example 2: Explore Themes

```bash
# Ask Claude:
"Show me all available WeChat themes and recommend one for a technical tutorial"

# Claude will use the wechat-theme-explorer skill to:
# 1. List all 19 themes
# 2. Explain each theme's characteristics
# 3. Recommend the best fit
```

### Example 3: Generate Xiaohongshu Cards

```bash
# Ask Claude:
"Generate Xiaohongshu card images from my article using the anthropic theme"

# Claude will use the xiaohongshu-generator skill to:
# 1. Check Puppeteer installation
# 2. Generate paginated card images
# 3. Provide the output files
```

### Example 4: Replicate a Website Design

```bash
# Ask Claude:
"I love this article's design at https://example.com/article, can you create a theme from it?"

# Claude will use the theme-replicator skill to:
# 1. Fetch and analyze the HTML
# 2. Extract typography styles and color palette
# 3. Generate a new theme file
# 4. Integrate it into the typeset system
# 5. Test the new theme
```

## Available Themes

All skills support 20 professional themes:

- **wechat-default** - Classic WeChat style (blue-gray)
- **wechat-tech** - Technology theme (blue + green code)
- **wechat-anthropic** - Claude-inspired (terracotta gradient)
- **sub2api** - Modern API platform (teal gradient, light theme)
- **latepost-depth** - LatePost style (red emphasis)
- **wechat-ft** - Financial Times (serif + beige)
- **wechat-elegant** - Elegant Songti with first-line indent
- **wechat-deepread** - Minimalist black and white
- **wechat-nyt** - New York Times (Georgia serif)
- **jonyive** - Jony Ive minimalism (ultra-light)
- **wechat-medium** - Medium long-form style
- **apple** - Apple minimalism (SF Pro fonts)
- **kenya-emptiness** - Kenya Hara ultra-minimalism
- **hische-editorial** - Didon serif editorial
- **ando-concrete** - Tadao Ando concrete minimalism
- **gaudi-organic** - Gaudi rainbow gradients
- **guardian** - Guardian navy with yellow
- **nikkei** - Nikkei Japanese business style
- **warm-docs** - Warm orange documentation
- **lemonde** - Le Monde French editorial

## How Skills Work

### Skill Triggering

Claude automatically triggers these skills when you mention:
- WeChat, 微信, 公众号, 微信公众号
- "Convert to WeChat HTML"
- "Which theme should I use?"
- Xiaohongshu, 小红书, Little Red Book
- "Generate card images"
- Chinese social media publishing

### Skill Workflow

1. **Intent Recognition** - Claude identifies which skill matches your request
2. **Skill Activation** - The skill's instructions are loaded into context
3. **Guided Execution** - Claude follows the skill's workflow to help you
4. **Result Delivery** - You get the converted HTML or generated images

## Features

### WeChat Typer
- ✅ Markdown preprocessing (fixes Feishu exports, broken bold)
- ✅ 20 professional typography themes
- ✅ Syntax highlighting with macOS-style code blocks
- ✅ Automatic image grid layout
- ✅ WeChat optimization (CSS Grid → tables)
- ✅ Inline CSS only (WeChat strips styles)

### Theme Replicator
- ✅ HTML style analysis and extraction
- ✅ Typography pattern recognition
- ✅ Color palette analysis
- ✅ WeChat compatibility conversion
- ✅ Automatic theme file generation
- ✅ System integration
- ✅ Support for local files and URLs

### Theme Explorer
- ✅ Categorized theme listings
- ✅ Content type recommendations
- ✅ Visual characteristic descriptions
- ✅ Theme psychology guide
- ✅ Accessibility considerations

### Xiaohongshu Generator
- ✅ 750×1000px card images (2x resolution)
- ✅ Automatic pagination
- ✅ Smart content layout
- ✅ Article metadata (char count, reading time)
- ✅ Info panel on first page
- ✅ All 20 themes supported

## Troubleshooting

### "Skill not triggering"

1. Check the skill is installed:
   ```bash
   claude skill list
   ```

2. Restart Claude Code to reload skills.

3. Use more explicit language:
   - Instead of: "Convert this"
   - Try: "Convert this article to WeChat HTML"

### "typeset: command not found"

The typeset CLI isn't installed. See [Prerequisites](#prerequisites) above.

### "Cannot find module"

You need to build the TypeScript:
```bash
cd Typography-Skill/cli
pnpm run build
```

### "Puppeteer not found"

Install dependencies for the Xiaohongshu generator:
```bash
cd Typography-Skill/cli
pnpm install
```

Puppeteer will download Chromium on first use (may take a few minutes).

### In China?

Set the Puppeteer mirror:
```bash
export PUPPETEER_DOWNLOAD_HOST=https://registry.npmmirror.com/-/binary/chromium-browser-snapshots
```

## Advanced Usage

### Custom Workflows

Create your own automation scripts:

```bash
#!/bin/bash
# Convert for both WeChat and Xiaohongshu
INPUT="article.md"
THEME="wechat-tech"

# WeChat HTML
typeset "$INPUT" -s "$THEME" -o "wechat.html"

# Xiaohongshu cards
typeset image "$INPUT" -s "$THEME" -o "./xhs_cards"

echo "✅ Done! Generated wechat.html and ./xhs_cards/"
```

### Batch Processing

Convert multiple articles:

```bash
for file in *.md; do
  typeset "$file" -s wechat-tech -o "output/${file%.md}.html"
done
```

### Theme Testing

Test multiple themes:

```bash
for theme in wechat-default wechat-tech latepost-depth; do
  typeset article.md -s "$theme" -o "tests/${theme}.html"
done
```

## API/Service Usage

For web API or service integration, consider wrapping the typeset CLI in a server:

### Simple Express.js Server

```javascript
const express = require('express');
const { exec } = require('child_process');
const app = express();

app.post('/convert', express.json(), async (req, res) => {
  const { markdown, theme } = req.body;

  // Write temp file
  fs.writeFileSync('/tmp/article.md', markdown);

  // Convert
  exec(`typeset /tmp/article.md -s ${theme} -o /tmp/output.html`);

  // Return result
  const html = fs.readFileSync('/tmp/output.html', 'utf8');
  res.json({ html });
});

app.listen(3000);
```

### Docker Container

```dockerfile
FROM node:18
RUN npm install -g pnpm
RUN git clone https://github.com/yourusername/Typography-Skill.git
WORKDIR Typography-Skill/cli
RUN pnpm install && pnpm run build
ENV PATH="$PATH:$(pwd)"
```

## Contributing

Contributions welcome! Areas to improve:
- New typography themes
- Additional platform formats
- Performance optimizations
- Documentation improvements

## License

MIT

## Support

- **GitHub Issues**: https://github.com/yourusername/Typography-Skill/issues
- **Documentation**: See CLAUDE.md in the repository
- **Theme Previews**: Check the project README for visual examples

## Acknowledgments

Built with:
- markdown-it - Markdown parsing
- highlight.js - Syntax highlighting
- jsdom - DOM manipulation
- Puppeteer - Screenshot generation
- TypeScript - Type safety

---

**Made with ❤️ for Chinese content creators**
