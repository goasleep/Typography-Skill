# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## CodeGraph

This project has CodeGraph initialized (`.codegraph/` exists). Use it for efficient code exploration:

**For exploration questions** (e.g., "how does X work?", "explain the Y system"), spawn an Explore agent with this instruction:

> This project has CodeGraph initialized (.codegraph/ exists). Use `codegraph_explore` as your PRIMARY tool — it returns full source code sections from all relevant files in one call.

**Direct use in main session** (for targeted lookups before editing):
- `codegraph_search` — Find symbols by name
- `codegraph_callers`/`codegraph_callees` — Trace call flow
- `codegraph_impact` — Check what's affected before editing
- `codegraph_node` — Get a single symbol's details

**Do NOT use** `codegraph_context` or `codegraph_explore` directly in the main session — they return large amounts of source code that fill up context.

## Project Overview

**typeset** is a Node.js CLI tool that converts Markdown to WeChat-compatible HTML with styled typography themes, and generates Xiaohongshu (Little Red Book) card images from Markdown content. Written in TypeScript.

All source code lives under `cli/src/`.

## Claude Code Skills

This repository includes three Claude Code skills in the `skills/` directory:
- `wechat-typer` - Convert Markdown to WeChat HTML
- `wechat-theme-explorer` - Browse and choose from 19 typography themes
- `xiaohongshu-generator` - Generate Xiaohongshu card images

These skills help users interact with the typeset CLI through natural language. See `skills/README.md` for details.

## Commands

```bash
# Install dependencies
cd cli && pnpm install

# Build TypeScript
pnpm run build

# Watch mode for development
pnpm run dev

# Run the CLI (must build first)
node cli/bin/typeset.js <file> -s <style-key>
node cli/bin/typeset.js <file> -s <style-key> -o output.html

# List available style themes
node cli/bin/typeset.js styles

# Generate Xiaohongshu card images
node cli/bin/typeset.js image <file> -s <style-key> -o ./xhs_output

# Skip clipboard-compatible simplifications (keeps CSS Grid instead of converting to tables)
node cli/bin/typeset.js <file> --no-clipboard

# Tests
cd cli && pnpm test

# Type check without emitting
pnpm run lint
```

## Architecture

### Source Structure

```
cli/src/
  bin/typeset.ts        # CLI entry point (commander)
  lib/
    types.ts             # Shared TypeScript interfaces
    styles.ts            # 19 theme definitions (StyleConfig map)
    render.ts            # Core render pipeline
    xiaohongshu.ts       # Xiaohongshu card image generator (Puppeteer)
  __tests__/             # Vitest test files
```

Compiled output goes to `cli/dist/`. The `cli/bin/typeset.js` is a thin shim that requires from `dist/`.

### Key Types (`src/lib/types.ts`)

- `StyleConfig` — `{ name: string; styles: Record<string, string> }`
- `ContentBlock` — `{ type: 'h1'|'h2'|'h3'|'p'|'li'|'quote'|'hr'; text?: string }`
- `ArticleInfo` — `{ charCount, readingTime, imageCount }`
- `RenderOptions` — `{ clipboard?: boolean }`
- `GenerateImagesResult` — `{ files: string[]; totalPages: number; articleInfo: ArticleInfo }`

### Render Pipeline (WeChat HTML)

`cli/src/lib/render.ts` is the core module. The pipeline is:

1. **`preprocessMarkdown()`** — Normalizes horizontal rules, fixes broken bold formatting (e.g. from Feishu exports), normalizes list items
2. **`createMarkdownIt()`** — Parses Markdown with syntax highlighting via highlight.js; code blocks get macOS-style window chrome (red/yellow/green dots)
3. **`applyInlineStyles()`** — Uses JSDOM to apply inline CSS styles from the selected theme to every HTML element. Also handles `groupConsecutiveImages()` which wraps consecutive images into CSS Grid layouts
4. **`simplifyForClipboard()`** — Converts CSS Grid image groups to `<table>` elements (WeChat doesn't support Grid), simplifies code blocks, flattens list items, adjusts blockquotes for dark mode. This step is on by default; disable with `--no-clipboard`

### Xiaohongshu Image Pipeline

`cli/src/lib/xiaohongshu.ts` generates paginated card images:

1. **`createSimplifiedContent()`** — Strips Markdown to basic content blocks (headings, paragraphs, lists, quotes)
2. **`splitIntoPages()`** — Uses Puppeteer to measure each block's rendered height, then splits into 750x1000px pages (first page has less content area due to info panel offset)
3. **`generateImages()`** — Renders final paginated HTML and screenshots each page as 2x PNG

### Style System

`cli/src/lib/styles.ts` exports a `STYLES` object keyed by style ID. Each entry has `name` (Chinese display name) and `styles` (CSS selector → inline style string map). There are 19 themes.

To add a new style: add a new key to the `STYLES` object in `cli/src/lib/styles.ts` with `name` and `styles` map. The `styles` map keys are CSS selectors (`h1`, `p`, `code`, `blockquote`, etc.); values are inline CSS strings.

### Key Constraints

- All styling is **inline CSS** because WeChat's editor strips `<style>` tags and class attributes
- Code blocks use highlight.js server-side; the `pre`/`code` selectors in style configs are skipped during `applyInlineStyles()` since code blocks get their own custom styling
- Heading inline elements (strong, em, a, code, etc.) get override styles to inherit the heading color and prevent theme style leaking into nested elements
- WeChat doesn't support CSS Grid, so `simplifyForClipboard` converts image grids to `<table>` layouts
- Puppeteer is required for the `image` command (measuring block heights and generating screenshots)
- tsconfig uses `"lib": ["ES2022", "DOM"]` because jsdom requires DOM types
