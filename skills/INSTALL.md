# Quick Start Guide - WeChat Typer Skills

## What You Get

Three Claude Code skills that help you create beautiful content for Chinese social media:

1. **wechat-typer** - Markdown → WeChat HTML
2. **wechat-theme-explorer** - Browse 19 typography themes
3. **xiaohongshu-generator** - Markdown → Xiaohongshu card images

## Installation (3 Steps)

### Step 1: Install the Typeset CLI

Choose one of these installation methods:

**Method A: Local Development**
```bash
git clone https://github.com/yourusername/Typography-Skill.git
cd Typography-Skill/cli

# Install dependencies (choose one)
pnpm install    # Recommended
npm install

# Build
pnpm run build  # or npm run build

# Add to PATH (add to your ~/.bashrc or ~/.zshrc)
export PATH="$PATH:$(pwd)"
```

**Method B: Global Installation (Recommended)**
```bash
cd Typography-Skill/cli
pnpm install -g    # or npm install -g

# Now 'typeset' command is available everywhere
```

**Method C: Using npx (No Installation)**
```bash
cd Typography-Skill/cli
npx typeset article.md -s wechat-tech

# npx handles installation automatically
```

### Step 2: Install the Skills

```bash
# From the wechat-typer-workspace directory
claude skill install wechat-typer.skill
claude skill install wechat-theme-explorer.skill
claude skill install xiaohongshu-generator.skill
```

### Step 3: Verify Installation

```bash
# Check skills are installed
claude skill list

# Test the CLI
typeset styles
```

## First Use

### Option 1: In Claude Code

```
Start a conversation with Claude and say:

"Convert my article.md to WeChat HTML using the tech theme"
```

Claude will automatically use the wechat-typer skill to help you.

### Option 2: Direct CLI Usage

```bash
# Convert to WeChat HTML
typeset article.md -s wechat-tech -o output.html

# List themes
typeset styles

# Generate Xiaohongshu cards
typeset image article.md -s wechat-tech -o ./xhs_output
```

## Common Tasks

### Convert Article for WeChat

```bash
typeset my-article.md -s wechat-tech -o wechat.html
```

### See All Themes

```bash
typeset styles
```

### Generate Social Media Cards

```bash
typeset image my-article.md -s gaudi-organic -o ./cards
```

### Choose the Right Theme

Ask Claude: "Which theme should I use for a technical tutorial?"

## Troubleshooting

**"Skill not found"**
```bash
claude skill list  # Check if installed
claude skill install wechat-typer.skill  # Reinstall
```

**"typeset: command not found"**
```bash
# Make sure you built the CLI
cd Typography-Skill/cli
pnpm run build

# Check PATH
echo $PATH | grep Typography-Skill
```

**"Puppeteer error"**
```bash
# Reinstall dependencies
cd Typography-Skill/cli
pnpm install

# In China, set mirror
export PUPPETEER_DOWNLOAD_HOST=https://registry.npmmirror.com/-/binary/chromium-browser-snapshots
```

## Next Steps

1. Read the full [README.md](./README.md) for detailed documentation
2. Explore the 19 available themes
3. Try converting your own articles
4. Generate Xiaohongshu cards for social media

## File Structure

```
wechat-typer-workspace/
├── wechat-typer.skill              # Install this
├── wechat-theme-explorer.skill     # Install this
├── xiaohongshu-generator.skill     # Install this
├── README.md                       # Full documentation
└── INSTALL.md                      # This file
```

## Need Help?

- Check the main README.md for detailed documentation
- Open an issue on GitHub
- Ask Claude directly once the skills are installed!

---

**Happy creating! 🎨**
