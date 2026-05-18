# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**typeset** is a Node.js CLI tool that converts Markdown to WeChat-compatible HTML with styled typography themes, and generates Xiaohongshu (Little Red Book) card images from Markdown content.

All source code lives under `cli/`.

## Commands

```bash
# Install dependencies
cd cli && npm install

# Run the CLI (convert markdown to styled HTML, outputs to stdout)
node cli/bin/typeset.js <file> -s <style-key>
node cli/bin/typeset.js <file> -s <style-key> -o output.html

# List available style themes
node cli/bin/typeset.js styles

# Generate Xiaohongshu card images
node cli/bin/typeset.js image <file> -s <style-key> -o ./xhs_output

# Skip clipboard-compatible simplifications (keeps CSS Grid instead of converting to tables)
node cli/bin/typeset.js <file> --no-clipboard

# Tests (note: test/test.js referenced in package.json does not exist yet)
cd cli && npm test
```

## Architecture

### Render Pipeline (WeChat HTML)

`cli/lib/render.js` is the core module. The pipeline is:

1. **`preprocessMarkdown()`** — Normalizes horizontal rules, fixes broken bold formatting (e.g. from Feishu exports), normalizes list items
2. **`createMarkdownIt()`** — Parses Markdown with syntax highlighting via highlight.js; code blocks get macOS-style window chrome (red/yellow/green dots)
3. **`applyInlineStyles()`** — Uses JSDOM to apply inline CSS styles from the selected theme to every HTML element. Also handles `groupConsecutiveImages()` which wraps consecutive images into CSS Grid layouts
4. **`simplifyForClipboard()`** — Converts CSS Grid image groups to `<table>` elements (WeChat doesn't support Grid), simplifies code blocks, flattens list items, adjusts blockquotes for dark mode. This step is on by default; disable with `--no-clipboard`

### Xiaohongshu Image Pipeline

`cli/lib/xiaohongshu.js` generates paginated card images:

1. **`createSimplifiedContent()`** — Strips Markdown to basic content blocks (headings, paragraphs, lists, quotes)
2. **`splitIntoPages()`** — Uses Puppeteer to measure each block's rendered height, then splits into 750x1000px pages (first page has less content area due to info panel offset)
3. **`generateImages()`** — Renders final paginated HTML and screenshots each page as 2x PNG

### Style System

`cli/lib/styles.js` exports a `STYLES` object keyed by style ID. Each entry has `name` (Chinese display name) and `styles` (CSS selector → inline style string map). There are 19 themes including `wechat-default`, `latepost-depth`, `wechat-ft` (Financial Times), `wechat-anthropic` (Claude), `wechat-tech`, `wechat-elegant`, `wechat-deepread`, `wechat-nyt` (NYT), `wechat-jonyive`, `wechat-medium`, `wechat-apple`, `kenya-emptiness`, `hische-editorial`, `ando-concrete`, `gaudi-organic`, `guardian`, `nikkei`, `warm-docs`, `lemonde`.

To add a new style: add a new key to the `STYLES` object in `cli/lib/styles.js` with `name` and `styles` map. The `styles` map keys are CSS selectors (`h1`, `p`, `code`, `blockquote`, etc.); values are inline CSS strings.

### Key Constraints

- All styling is **inline CSS** because WeChat's editor strips `<style>` tags and class attributes
- Code blocks use highlight.js server-side; the `pre`/`code` selectors in style configs are skipped during `applyInlineStyles()` since code blocks get their own custom styling
- Heading inline elements (strong, em, a, code, etc.) get override styles to inherit the heading color and prevent theme style leaking into nested elements
- WeChat doesn't support CSS Grid, so `simplifyForClipboard` converts image grids to `<table>` layouts
- Puppeteer is required for the `image` command (measuring block heights and generating screenshots)
