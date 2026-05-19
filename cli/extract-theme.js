#!/usr/bin/env node

/**
 * Theme Extractor Script
 * Analyze HTML and extract typography styles to create WeChat themes
 */

const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

/**
 * Fetch HTML from URL
 */
async function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;

    client.get(url, (res) => {
      let data = '';

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        return;
      }

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data);
      });
    }).on('error', reject);
  });
}

/**
 * Extract inline styles from element
 */
function extractInlineStyles(element, window) {
  const styles = [];

  // First, get inline styles
  if (element.getAttribute('style')) {
    styles.push(element.getAttribute('style'));
  }

  // Then, get computed style properties if window is available
  if (window) {
    try {
      const computed = window.getComputedStyle(element);
      const importantProps = [
        'font-family', 'font-size', 'font-weight', 'color', 'background-color',
        'line-height', 'margin', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right',
        'padding', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right',
        'text-align', 'text-decoration', 'text-transform',
        'border', 'border-left', 'border-right', 'border-top', 'border-bottom',
        'border-radius', 'box-shadow', 'width', 'max-width', 'background', 'font-style'
      ];

      for (const prop of importantProps) {
        const value = computed.getPropertyValue(prop);
        if (value && value !== 'none' && value !== 'auto' && value !== 'normal' && value !== 'initial') {
          // Don't add if already in inline styles
          const alreadyExists = styles.some(s => s.includes(`${prop}:`) || s.includes(`${prop} :`));
          if (!alreadyExists) {
            styles.push(`${prop}: ${value}`);
          }
        }
      }
    } catch (error) {
      // Computed style not available, skip it
    }
  }

  return styles.join('; ');
}

/**
 * Extract styles from DOM
 */
function extractStyles(document, window) {
  const styles = {
    container: '',
    h1: '', h2: '', h3: '', h4: '', h5: '', h6: '',
    p: '',
    strong: '',
    em: '',
    a: '',
    ul: '', ol: '', li: '',
    blockquote: '',
    code: '',
    pre: '',
    hr: '',
    img: '',
    table: '', th: '', td: '', tr: ''
  };

  // Extract styles from actual elements
  const elements = {
    container: document.querySelector('.container') || document.querySelector('body'),
    h1: document.querySelector('h1'),
    h2: document.querySelector('h2'),
    h3: document.querySelector('h3'),
    h4: document.querySelector('h4'),
    h5: document.querySelector('h5'),
    h6: document.querySelector('h6'),
    p: document.querySelector('p'),
    strong: document.querySelector('strong'),
    em: document.querySelector('em'),
    a: document.querySelector('a'),
    ul: document.querySelector('ul'),
    ol: document.querySelector('ol'),
    li: document.querySelector('li'),
    blockquote: document.querySelector('blockquote'),
    code: document.querySelector('code'),
    pre: document.querySelector('pre'),
    hr: document.querySelector('hr'),
    img: document.querySelector('img'),
    table: document.querySelector('table'),
    th: document.querySelector('th'),
    td: document.querySelector('td'),
    tr: document.querySelector('tr')
  };

  // Extract inline styles and computed properties
  for (const [key, element] of Object.entries(elements)) {
    if (element) {
      styles[key] = extractInlineStyles(element, window);
    }
  }

  return styles;
}

/**
 * Analyze color palette from styles
 */
function analyzeColorPalette(styles) {
  const colors = {
    primary: [],
    secondary: [],
    accent: [],
    background: [],
    border: []
  };

  const colorRegex = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})|rgb\([^)]+\)|rgba\([^)]+\)/g;

  for (const [element, style] of Object.entries(styles)) {
    if (style) {
      const matches = style.match(colorRegex) || [];

      if (element.startsWith('h')) {
        colors.primary.push(...matches);
      } else if (element === 'p' || element === 'li') {
        colors.secondary.push(...matches);
      } else if (element === 'a' || element === 'strong') {
        colors.accent.push(...matches);
      } else if (element === 'container' || element.includes('background')) {
        colors.background.push(...matches);
      } else if (element.includes('border')) {
        colors.border.push(...matches);
      }
    }
  }

  return colors;
}

/**
 * Generate TypeScript theme file
 */
function generateThemeFile(name, styles, colors, category = 'tech') {
  const themeKey = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const variableName = themeKey.replace(/-([a-z])/g, (g) => g[1].toUpperCase()); // Convert kebab-case to camelCase
  const timestamp = new Date().toISOString().split('T')[0];

  return `/**
 * ${name} 主题
 * Auto-generated from HTML analysis on ${timestamp}
 */

import type { StyleConfig } from '../../types';

export const theme: StyleConfig = {
  name: '${name}',
  styles: {
    container: '${styles.container || 'max-width: 680px; margin: 0 auto; padding: 12px 16px 32px 16px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 16px; line-height: 1.7 !important; color: #1e293b !important; background-color: #ffffff !important; word-wrap: break-word;'}',
    h1: '${styles.h1 || 'font-size: 38px; font-weight: 700; color: #0d9488 !important; line-height: 1.2 !important; margin: 32px 0 20px; padding-bottom: 12px; border-bottom: 2px solid rgba(13, 148, 136, 0.3); letter-spacing: -0.02em;'}',
    h2: '${styles.h2 || 'font-size: 28px; font-weight: 600; color: #14b8a6 !important; line-height: 1.3 !important; margin: 28px 0 16px; padding-left: 16px; border-left: 4px solid #14b8a6; background: linear-gradient(90deg, rgba(20, 184, 166, 0.08) 0%, transparent 100%); padding: 10px 16px; border-radius: 0 8px 8px 0;'}',
    h3: '${styles.h3 || 'font-size: 22px; font-weight: 600; color: #2dd4bf !important; line-height: 1.4 !important; margin: 24px 0 14px; padding: 8px 12px; background-color: rgba(20, 184, 166, 0.06) !important; border-radius: 8px; border: 1px solid rgba(20, 184, 166, 0.15);'}',
    h4: '${styles.h4 || 'font-size: 18px; font-weight: 600; color: #5eead4 !important; line-height: 1.5 !important; margin: 20px 0 12px;'}',
    h5: '${styles.h5 || 'font-size: 16px; font-weight: 600; color: #334155 !important; line-height: 1.5 !important; margin: 16px 0 10px;'}',
    h6: '${styles.h6 || 'font-size: 14px; font-weight: 600; color: #64748b !important; line-height: 1.5 !important; margin: 14px 0 8px; text-transform: uppercase; letter-spacing: 0.05em;'}',
    p: '${styles.p || 'margin: 14px 0 !important; line-height: 1.75 !important; color: #334155 !important; text-align: justify;'}',
    strong: '${styles.strong || 'font-weight: 700; color: #0d9488 !important; background: linear-gradient(180deg, transparent 60%, rgba(13, 148, 136, 0.1) 60%); padding: 1px 3px; border-radius: 3px;'}',
    em: '${styles.em || 'font-style: italic; color: #14b8a6 !important; font-weight: 500;'}',
    a: '${styles.a || 'color: #14b8a6 !important; text-decoration: none; border-bottom: 1px solid #14b8a6; transition: all 0.2s ease; padding: 0 2px;'}',
    ul: '${styles.ul || 'margin: 16px 0; padding-left: 28px; list-style-type: disc;'}',
    ol: '${styles.ol || 'margin: 16px 0; padding-left: 28px; list-style-type: decimal;'}',
    li: '${styles.li || 'margin: 8px 0; line-height: 1.7 !important; color: #334155 !important; padding: 4px 0;'}',
    blockquote: '${styles.blockquote || 'margin: 20px 0; padding: 16px 20px; background: linear-gradient(135deg, rgba(20, 184, 166, 0.08) 0%, rgba(45, 212, 191, 0.04) 100%) !important; border-left: 4px solid #14b8a6; border-right: 1px solid rgba(20, 184, 166, 0.2); border-radius: 8px; color: #334155 !important; font-size: 15px; line-height: 1.6 !important; font-style: italic; position: relative;'}',
    code: '${styles.code || 'font-family: "Fira Code", "SF Mono", Consolas, "Monaco", monospace; font-size: 13px; padding: 3px 6px; background-color: rgba(20, 184, 166, 0.1) !important; color: #0d9488 !important; border-radius: 4px; border: 1px solid rgba(20, 184, 166, 0.2); font-weight: 500;'}',
    pre: '${styles.pre || 'margin: 24px 0; padding: 20px; background: linear-gradient(145deg, #f1f5f9, #e2e8f0) !important; border: 1px solid rgba(20, 184, 166, 0.2); border-radius: 12px; overflow-x: auto; line-height: 1.6 !important; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), inset 0 1px rgba(255, 255, 255, 0.8);'}',
    hr: '${styles.hr || 'margin: 36px 0; border: none; height: 2px; background: linear-gradient(90deg, transparent 0%, #14b8a6 50%, transparent 100%) !important; opacity: 0.4;'}',
    img: '${styles.img || 'max-width: 100%; max-height: 500px !important; height: auto; display: block; margin: 24px auto; border-radius: 12px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.08);'}',
    table: '${styles.table || 'width: 100%; margin: 24px 0; border-collapse: separate; border-spacing: 0; font-size: 14px; border-radius: 12px; overflow: hidden; border: 1px solid rgba(20, 184, 166, 0.2);'}',
    th: '${styles.th || 'background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%) !important; color: #ffffff !important; padding: 12px 16px; text-align: left; font-weight: 600; border-bottom: 2px solid rgba(255, 255, 255, 0.2);'}',
    td: '${styles.td || 'padding: 10px 16px; border-bottom: 1px solid rgba(20, 184, 166, 0.1); color: #334155 !important; background-color: #ffffff !important;'}',
    tr: '${styles.tr || 'border-bottom: 1px solid rgba(20, 184, 166, 0.08);'}',
  }
};
`;
}

/**
 * Update theme index file
 */
function updateThemeIndex(themeKey, themeName, category) {
  const indexPath = path.join(__dirname, 'src/lib/themes/index.ts');

  if (!fs.existsSync(indexPath)) {
    console.error('Theme index file not found:', indexPath);
    return false;
  }

  let indexContent = fs.readFileSync(indexPath, 'utf8');

  // Convert themeKey to valid variable name (camelCase)
  const variableName = themeKey.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

  // Check if theme already exists
  if (indexContent.includes(`'${themeKey}'`)) {
    console.log(`Theme ${themeKey} already exists in index`);
    return false;
  }

  // Add import - find the appropriate section and add after existing imports
  const importStatement = `import { theme as ${variableName} } from './${category}/${themeKey}';`;

  // Find the correct section based on category
  const sectionImports = {
    'base': '// 导入基础主题',
    'tech': '// 导入技术主题',
    'editorial': '// 导入编辑主题',
    'artistic': '// 导入艺术主题',
    'business': '// 导入商业主题'
  };

  const sectionMarker = sectionImports[category] || '// 导入其他主题';
  const sectionPattern = new RegExp(`(${sectionMarker}[^\\n]*\\n)((?:import[^\\n]*\\n)*)`);

  if (sectionPattern.test(indexContent)) {
    indexContent = indexContent.replace(
      sectionPattern,
      `$1$2${importStatement}\n`
    );
  } else {
    // If section not found, add before the themeModules declaration
    indexContent = indexContent.replace(
      /(const themeModules)/,
      `${importStatement}\n\n$1`
    );
  }

  // Add to staticThemes
  indexContent = indexContent.replace(
    /export const staticThemes: StylesMap = \{/,
    `export const staticThemes: StylesMap = {\n  '${themeKey}': ${variableName},`
  );

  // Add to themeModules
  indexContent = indexContent.replace(
    /const themeModules.*?\{/,
    `const themeModules: Record<string, () => Promise<StyleConfig>> = {\n  '${themeKey}': () => import('./${category}/${themeKey}').then(m => m.theme),`
  );

  // Add to themeCategories
  const categoryPattern = new RegExp(`${category}:\\s*\\[([^\\]]+)\\]`);
  indexContent = indexContent.replace(
    categoryPattern,
    `${category}: [$1, '${themeKey}']`
  );

  fs.writeFileSync(indexPath, indexContent);
  console.log('Updated theme index successfully');
  return true;
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Theme Extractor - Extract styles from HTML to create WeChat themes');
    console.log('');
    console.log('Usage:');
    console.log('  node extract-theme.js <input> [name] [category]');
    console.log('');
    console.log('Arguments:');
    console.log('  input    HTML file path or URL');
    console.log('  name     Theme name (default: extracted from input)');
    console.log('  category Theme category: base|tech|editorial|artistic|business (default: tech)');
    console.log('');
    console.log('Examples:');
    console.log('  node extract-theme.js article.html "My Custom Theme" tech');
    console.log('  node extract-theme.js https://example.com/article "Website Style" editorial');
    process.exit(1);
  }

  const input = args[0];
  const themeName = args[1] || 'Custom Theme';
  const category = args[2] || 'tech';
  const validCategories = ['base', 'tech', 'editorial', 'artistic', 'business'];

  if (!validCategories.includes(category)) {
    console.error(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
    process.exit(1);
  }

  try {
    console.log('🎨 Extracting theme from:', input);

    let html;

    if (input.startsWith('http')) {
      console.log('📡 Fetching HTML from URL...');
      html = await fetchHTML(input);
    } else {
      console.log('📁 Reading HTML from file...');
      const filePath = path.resolve(input);
      if (!fs.existsSync(filePath)) {
        console.error('File not found:', filePath);
        process.exit(1);
      }
      html = fs.readFileSync(filePath, 'utf8');
    }

    console.log('🔍 Analyzing HTML structure...');
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const window = dom.window;
    const styles = extractStyles(document, window);
    const colors = analyzeColorPalette(styles);

    console.log('✨ Extracted styles:');
    console.log('  - Color palette:', Object.keys(colors).map(k => `${k}: ${colors[k].length} colors`).join(', '));
    console.log('  - Typography elements:', Object.keys(styles).filter(k => styles[k]).length);

    console.log('📝 Generating theme file...');
    const themeKey = themeName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const themeFile = generateThemeFile(themeName, styles, colors, category);

    const outputPath = path.join(__dirname, `src/lib/themes/${category}/${themeKey}.ts`);
    fs.writeFileSync(outputPath, themeFile);
    console.log('💾 Theme file saved:', outputPath);

    console.log('🔧 Updating theme index...');
    const updated = updateThemeIndex(themeKey, themeName, category);

    if (updated) {
      console.log('✅ Theme created successfully!');
      console.log('');
      console.log('Next steps:');
      console.log('  1. Rebuild the CLI: cd cli && pnpm run build');
      console.log('  2. Test the theme: typeset test.md -s', themeKey);
      console.log('  3. Verify and refine the theme if needed');
    } else {
      console.log('⚠️  Theme file created but index update may need manual intervention');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { extractStyles, generateThemeFile, analyzeColorPalette };