import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import { JSDOM } from 'jsdom';
import { STYLES } from './styles';
import type { StyleConfig, StyleInfo, RenderOptions, ImageItem } from './types';

const headingInlineOverrides: Record<string, string> = {
  strong: 'font-weight: 700; color: inherit !important; background-color: transparent !important;',
  em: 'font-style: italic; color: inherit !important; background-color: transparent !important;',
  a: 'color: inherit !important; text-decoration: none !important; border-bottom: 1px solid currentColor !important; background-color: transparent !important;',
  code: 'color: inherit !important; background-color: transparent !important; border: none !important; padding: 0 !important;',
  span: 'color: inherit !important; background-color: transparent !important;',
  b: 'font-weight: 700; color: inherit !important; background-color: transparent !important;',
  i: 'font-style: italic; color: inherit !important; background-color: transparent !important;',
  del: 'color: inherit !important; background-color: transparent !important;',
  mark: 'color: inherit !important; background-color: transparent !important;',
  s: 'color: inherit !important; background-color: transparent !important;',
  u: 'color: inherit !important; text-decoration: underline !important; background-color: transparent !important;',
  ins: 'color: inherit !important; text-decoration: underline !important; background-color: transparent !important;',
  kbd: 'color: inherit !important; background-color: transparent !important; border: none !important; padding: 0 !important;',
  sub: 'color: inherit !important; background-color: transparent !important;',
  sup: 'color: inherit !important; background-color: transparent !important;',
};
const headingInlineSelectorList = Object.keys(headingInlineOverrides).join(', ');

function createMarkdownIt(): MarkdownIt {
  return new MarkdownIt({
    html: true,
    linkify: true,
    typographer: false,
    highlight(str: string, lang: string): string {
      const dots = '<div style="display: flex; align-items: center; gap: 6px; padding: 10px 12px; background: #2a2c33; border-bottom: 1px solid #1e1f24;"><span style="width: 12px; height: 12px; border-radius: 50%; background: #ff5f56;"></span><span style="width: 12px; height: 12px; border-radius: 50%; background: #ffbd2e;"></span><span style="width: 12px; height: 12px; border-radius: 50%; background: #27c93f;"></span></div>';

      let codeContent = '';
      if (lang && hljs.getLanguage(lang)) {
        try {
          codeContent = hljs.highlight(str, { language: lang }).value;
        } catch {
          codeContent = escapeHtml(str);
        }
      } else {
        codeContent = escapeHtml(str);
      }

      return `<div data-code-block="true" style="margin: 20px 0; border-radius: 8px; overflow: hidden; background: #383a42; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">${dots}<div style="padding: 16px; overflow-x: auto; background: #383a42;"><code style="display: block; color: #abb2bf; font-family: 'SF Mono', Monaco, 'Cascadia Code', Consolas, monospace; font-size: 14px; line-height: 1.6; white-space: pre;">${codeContent}</code></div></div>`;
    },
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// highlight.js class → inline style (One Dark Pro palette, matching hardcoded code block colors)
const HLJS_CLASS_TO_STYLE: Record<string, string> = {
  'hljs-comment': 'color:#5c6370;font-style:italic;',
  'hljs-quote': 'color:#5c6370;font-style:italic;',
  'hljs-doctag': 'color:#c678dd;',
  'hljs-keyword': 'color:#c678dd;',
  'hljs-formula': 'color:#c678dd;',
  'hljs-section': 'color:#e06c75;',
  'hljs-name': 'color:#e06c75;',
  'hljs-selector-tag': 'color:#e06c75;',
  'hljs-deletion': 'color:#e06c75;',
  'hljs-subst': 'color:#e06c75;',
  'hljs-literal': 'color:#56b6c2;',
  'hljs-addition': 'color:#98c379;',
  'hljs-attribute': 'color:#98c379;',
  'hljs-meta-string': 'color:#98c379;',
  'hljs-string': 'color:#98c379;',
  'hljs-built_in': 'color:#e5c07b;',
  'hljs-class': 'color:#e5c07b;',
  'hljs-title': 'color:#e5c07b;',
  'hljs-title.class_': 'color:#e5c07b;',
  'hljs-attr': 'color:#d19a66;',
  'hljs-variable': 'color:#d19a66;',
  'hljs-template-variable': 'color:#d19a66;',
  'hljs-type': 'color:#e5c07b;',
  'hljs-selector-class': 'color:#e5c07b;',
  'hljs-selector-attr': 'color:#e5c07b;',
  'hljs-selector-pseudo': 'color:#e5c07b;',
  'hljs-number': 'color:#d19a66;',
  'hljs-symbol': 'color:#d19a66;',
  'hljs-bullet': 'color:#d19a66;',
  'hljs-link': 'color:#d19a66;text-decoration:underline;',
  'hljs-meta': 'color:#61afef;',
  'hljs-selector-id': 'color:#61afef;',
  'hljs-function': 'color:#61afef;',
  'hljs-title.function_': 'color:#61afef;',
  'hljs-regexp': 'color:#98c379;',
  'hljs-tag': 'color:#e06c75;',
  'hljs-params': 'color:#abb2bf;',
  'hljs-punctuation': 'color:#abb2bf;',
  'hljs-operator': 'color:#56b6c2;',
  'hljs-emphasis': 'font-style:italic;',
  'hljs-strong': 'font-weight:700;',
};

function convertHljsToInlineStyles(html: string): string {
  return html.replace(
    /<span class="([^"]*)"/g,
    (match, classes: string) => {
      const classList = classes.split(/\s+/).filter(Boolean);
      const styles = classList
        .map(c => HLJS_CLASS_TO_STYLE[c])
        .filter(Boolean);
      if (styles.length === 0) return match;
      return `<span style="${styles.join('')}"`;
    }
  );
}

function protectCodeWhitespace(html: string): string {
  const parts = html.split(/(<[^>]+>)/);
  return parts.map((part, i) => {
    if (i % 2 === 0) {
      return part.replace(/ /g, '&nbsp;').replace(/\n/g, '<br>');
    }
    return part;
  }).join('');
}

function preprocessMarkdown(content: string): string {
  // Normalize horizontal rules
  content = content.replace(/^[ ]{0,3}(\*[ ]*\*[ ]*\*[\* ]*)[ \t]*$/gm, '***');
  content = content.replace(/^[ ]{0,3}(-[ ]*-[ ]*-[- ]*)[ \t]*$/gm, '---');
  content = content.replace(/^[ ]{0,3}(_[ ]*_[ ]*_[_ ]*)[ \t]*$/gm, '___');

  // Fix broken bold formatting (e.g. from Feishu)
  content = content.replace(/\*\*\s+\*\*/g, ' ');
  content = content.replace(/\*{4,}/g, '');
  content = content.replace(/\*\*([）」』》〉】〕〗］｝"'。，、；：？！])/g, '**​$1');
  content = content.replace(/([（「『《〈【〔〖［｛"'])\*\*/g, '$1​**');
  content = content.replace(/__\s+__/g, ' ');
  content = content.replace(/_{4,}/g, '');

  // Normalize list items
  content = content.replace(/^(\s*(?:\d+\.|-|\*)\s+[^:\n]+)\n\s*:\s*(.+?)$/gm, '$1: $2');
  content = content.replace(/^(\s*(?:\d+\.|-|\*)\s+.+?:)\s*\n\s+(.+?)$/gm, '$1 $2');
  content = content.replace(/^(\s*(?:\d+\.|-|\*)\s+[^:\n]+)\n:\s*(.+?)$/gm, '$1: $2');
  content = content.replace(/^(\s*(?:\d+\.|-|\*)\s+.+?)\n\n\s+(.+?)$/gm, '$1 $2');

  return content;
}

function groupConsecutiveImages(doc: Document): void {
  const body = doc.body;
  const children = Array.from(body.children);

  const imagesToProcess: ImageItem[] = [];

  children.forEach((child, index) => {
    if (child.tagName === 'P') {
      const images = child.querySelectorAll('img');
      if (images.length > 1) {
        const group = Array.from(images).map(img => ({
          element: child,
          img,
          index,
          inSameParagraph: true,
          paragraphImageCount: images.length,
        }));
        imagesToProcess.push(...group);
      } else if (images.length === 1) {
        imagesToProcess.push({
          element: child,
          img: images[0],
          index,
          inSameParagraph: false,
          paragraphImageCount: 1,
        });
      }
    } else if (child.tagName === 'IMG') {
      imagesToProcess.push({
        element: child,
        img: child,
        index,
        inSameParagraph: false,
        paragraphImageCount: 1,
      });
    }
  });

  const groups: ImageItem[][] = [];
  let currentGroup: ImageItem[] = [];

  imagesToProcess.forEach((item, i) => {
    if (i === 0) {
      currentGroup.push(item);
    } else {
      const prevItem = imagesToProcess[i - 1];
      let isContinuous = false;

      if (item.index === prevItem.index) {
        isContinuous = true;
      } else if (item.index - prevItem.index === 1) {
        isContinuous = true;
      }

      if (isContinuous) {
        currentGroup.push(item);
      } else {
        if (currentGroup.length > 0) {
          groups.push([...currentGroup]);
        }
        currentGroup = [item];
      }
    }
  });

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  groups.forEach(group => {
    if (group.length < 2) return;

    const imageCount = group.length;
    const firstElement = group[0].element;

    const gridContainer = doc.createElement('div');
    gridContainer.setAttribute('class', 'image-grid');
    gridContainer.setAttribute('data-image-count', String(imageCount));

    let gridStyle = '';
    let columns = 2;

    if (imageCount === 2) {
      gridStyle = 'display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 20px auto; max-width: 100%; align-items: start;';
      columns = 2;
    } else if (imageCount === 3) {
      gridStyle = 'display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 20px auto; max-width: 100%; align-items: start;';
      columns = 3;
    } else if (imageCount === 4) {
      gridStyle = 'display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 20px auto; max-width: 100%; align-items: start;';
      columns = 2;
    } else {
      gridStyle = 'display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 20px auto; max-width: 100%; align-items: start;';
      columns = 3;
    }

    gridContainer.setAttribute('style', gridStyle);
    gridContainer.setAttribute('data-columns', String(columns));

    group.forEach(item => {
      const imgWrapper = doc.createElement('div');
      imgWrapper.setAttribute('style', 'width: 100%; height: auto; overflow: hidden;');

      const img = item.img.cloneNode(true) as Element;
      img.setAttribute('style', 'width: 100%; height: auto; display: block; border-radius: 8px;');

      imgWrapper.appendChild(img);
      gridContainer.appendChild(imgWrapper);
    });

    firstElement.parentNode?.insertBefore(gridContainer, firstElement);

    const elementsToRemove = new Set<Element>();
    group.forEach(item => {
      elementsToRemove.add(item.element);
    });
    elementsToRemove.forEach(element => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
  });
}

function applyInlineStyles(html: string, styleKey: string): string {
  const styleConfig = STYLES[styleKey];
  if (!styleConfig) {
    throw new Error(`Unknown style: "${styleKey}". Available: ${Object.keys(STYLES).join(', ')}`);
  }

  const style = styleConfig.styles;
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  groupConsecutiveImages(doc);

  Object.keys(style).forEach(selector => {
    if (selector === 'pre' || selector === 'pre code') {
      return;
    }

    // code 选择器特殊处理：只应用到不在代码块内的行内 code
    if (selector === 'code') {
      const elements = doc.querySelectorAll(selector);
      elements.forEach(el => {
        if (el.closest('[data-code-block]')) {
          return;
        }
        const currentStyle = el.getAttribute('style') || '';
        el.setAttribute('style', currentStyle + '; ' + style[selector]);
      });
      return;
    }

    const elements = doc.querySelectorAll(selector);
    elements.forEach(el => {
      if (el.tagName === 'IMG' && el.closest('.image-grid')) {
        return;
      }

      const currentStyle = el.getAttribute('style') || '';
      el.setAttribute('style', currentStyle + '; ' + style[selector]);
    });
  });

  // Override inline elements inside headings to inherit heading color
  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach(heading => {
    const inlineNodes = heading.querySelectorAll(headingInlineSelectorList);
    inlineNodes.forEach(node => {
      const tag = node.tagName.toLowerCase();
      const override = headingInlineOverrides[tag];
      if (!override) return;

      const currentStyle = node.getAttribute('style') || '';
      const sanitizedStyle = currentStyle
        .replace(/color:\s*[^;]+;?/gi, '')
        .replace(/background(?:-color)?:\s*[^;]+;?/gi, '')
        .replace(/border(?:-bottom)?:\s*[^;]+;?/gi, '')
        .replace(/text-decoration:\s*[^;]+;?/gi, '')
        .replace(/box-shadow:\s*[^;]+;?/gi, '')
        .replace(/padding:\s*[^;]+;?/gi, '')
        .replace(/;\s*;/g, ';')
        .trim();
      node.setAttribute('style', sanitizedStyle + '; ' + override);
    });
  });

  const container = doc.createElement('div');
  container.setAttribute('style', style.container);
  container.innerHTML = doc.body.innerHTML;

  return container.outerHTML;
}

function convertGridToTable(doc: Document): void {
  const imageGrids = doc.querySelectorAll('.image-grid');
  imageGrids.forEach(grid => {
    const columns = parseInt(grid.getAttribute('data-columns') || '2', 10);
    convertToTable(doc, grid, columns);
  });
}

function convertToTable(doc: Document, grid: Element, columns: number): void {
  const imgWrappers = Array.from(grid.children);

  const table = doc.createElement('table');
  table.setAttribute('style',
    'width: 100% !important; border-collapse: collapse !important; margin: 20px auto !important; table-layout: fixed !important; border: none !important; background: transparent !important;'
  );

  const rows = Math.ceil(imgWrappers.length / columns);

  for (let i = 0; i < rows; i++) {
    const tr = doc.createElement('tr');

    for (let j = 0; j < columns; j++) {
      const index = i * columns + j;
      const td = doc.createElement('td');

      td.setAttribute('style',
        `padding: 4px !important; vertical-align: top !important; width: ${100 / columns}% !important; border: none !important; background: transparent !important;`
      );

      if (index < imgWrappers.length) {
        const imgWrapper = imgWrappers[index];
        const img = imgWrapper.querySelector('img');

        if (img) {
          const imgMaxHeight = '340px';
          const containerHeight = '360px';

          const wrapper = doc.createElement('div');
          wrapper.setAttribute('style',
            `width: 100% !important; height: ${containerHeight} !important; text-align: center !important; background-color: #f5f5f5 !important; border-radius: 4px !important; padding: 10px !important; box-sizing: border-box !important; overflow: hidden !important; display: table !important;`
          );

          const innerWrapper = doc.createElement('div');
          innerWrapper.setAttribute('style',
            'display: table-cell !important; vertical-align: middle !important; text-align: center !important;'
          );

          const newImg = img.cloneNode(true) as Element;
          newImg.setAttribute('style',
            `max-width: calc(100% - 20px) !important; max-height: ${imgMaxHeight} !important; width: auto !important; height: auto !important; display: inline-block !important; margin: 0 auto !important; border-radius: 4px !important; object-fit: contain !important;`
          );

          innerWrapper.appendChild(newImg);
          wrapper.appendChild(innerWrapper);
          td.appendChild(wrapper);
        }
      }

      tr.appendChild(td);
    }

    table.appendChild(tr);
  }

  grid.parentNode?.replaceChild(table, grid);
}

function extractBackgroundColor(styleString: string | null): string | null {
  if (!styleString) return null;

  const bgColorMatch = styleString.match(/background-color:\s*([^;]+)/);
  if (bgColorMatch) return bgColorMatch[1].trim();

  const bgMatch = styleString.match(/background:\s*([#rgb][^;]+)/);
  if (bgMatch) {
    const bgValue = bgMatch[1].trim();
    if (bgValue.startsWith('#') || bgValue.startsWith('rgb')) return bgValue;
  }

  return null;
}

function simplifyForClipboard(html: string, styleKey: string): string {
  const styleConfig = STYLES[styleKey];
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  // Grid → Table
  convertGridToTable(doc);

  // Section wrapper for non-white backgrounds
  const containerBg = extractBackgroundColor(styleConfig.styles.container);
  if (containerBg && containerBg !== '#fff' && containerBg !== '#ffffff') {
    const section = doc.createElement('section');
    const containerStyle = styleConfig.styles.container;
    const paddingMatch = containerStyle.match(/padding:\s*([^;]+)/);
    const maxWidthMatch = containerStyle.match(/max-width:\s*([^;]+)/);
    const padding = paddingMatch ? paddingMatch[1].trim() : '40px 20px';
    const maxWidth = maxWidthMatch ? maxWidthMatch[1].trim() : '100%';

    section.setAttribute('style',
      `background-color: ${containerBg}; padding: ${padding}; max-width: ${maxWidth}; margin: 0 auto; box-sizing: border-box; word-wrap: break-word;`
    );

    while (doc.body.firstChild) {
      section.appendChild(doc.body.firstChild);
    }

    const allElements = section.querySelectorAll('*');
    allElements.forEach(el => {
      let currentStyle = el.getAttribute('style') || '';
      currentStyle = currentStyle
        .replace(/max-width:\s*[^;]+;?/g, '')
        .replace(/margin:\s*0\s+auto;?/g, '');
      if (currentStyle.includes(`background-color: ${containerBg}`)) {
        currentStyle = currentStyle.replace(new RegExp(`background-color:\\s*${containerBg.replace(/[()]/g, '\\$&')};?`, 'g'), '');
      }
      currentStyle = currentStyle.replace(/;\s*;/g, ';').replace(/^\s*;\s*|\s*;\s*$/g, '').trim();
      if (currentStyle) {
        el.setAttribute('style', currentStyle);
      } else {
        el.removeAttribute('style');
      }
    });

    doc.body.appendChild(section);
  }

  // Simplify code blocks for WeChat compatibility
  const codeBlocks = doc.querySelectorAll('[data-code-block]');
  codeBlocks.forEach(block => {
    const codeElement = block.querySelector('code');
    if (!codeElement) return;

    // 1. Retain highlight.js HTML, convert classes to inline styles
    let codeHtml = codeElement.innerHTML;
    codeHtml = convertHljsToInlineStyles(codeHtml);

    // 2. Protect whitespace and newlines from WeChat editor compression
    codeHtml = protectCodeWhitespace(codeHtml);

    // Outer container
    const wrapper = doc.createElement('section');
    const wrapperStyle = styleConfig.styles['code_block'] ||
      'margin: 20px 0; border-radius: 8px; overflow: hidden; background: #383a42; box-shadow: 0 2px 8px rgba(0,0,0,0.15);';
    wrapper.setAttribute('style', wrapperStyle);

    // <pre> and <code> — clean, no nested divs
    const pre = doc.createElement('pre');
    let preStyle = styleConfig.styles['pre'] ||
      'margin: 0; padding: 16px 20px; background: transparent; overflow-x: auto; line-height: 1.7; border-radius: 0;';
    // Strip properties that should be owned by the wrapper — the wrapper provides
    // the code block background, margin, border-radius and shadow as a single unit.
    preStyle = preStyle
      .replace(/background:\s*[^;]+;?/gi, '')
      .replace(/background-color:\s*[^;]+;?/gi, '')
      .replace(/background-image:\s*[^;]+;?/gi, '')
      .replace(/box-shadow:\s*[^;]+;?/gi, '')
      .replace(/;\s*;/g, ';')
      .trim();
    // Force margin and border-radius to 0 so the pre fills the wrapper cleanly
    preStyle = preStyle
      .replace(/margin\s*:\s*[^;]+;?/gi, '')
      .replace(/border-radius\s*:\s*[^;]+;?/gi, '')
      .replace(/;\s*;/g, ';')
      .trim();
    preStyle += '; margin: 0; border-radius: 0';
    pre.setAttribute('style', preStyle);

    const code = doc.createElement('code');
    const codeStyle = styleConfig.styles['pre_code'] ||
      'color: #abb2bf; font-family: "SF Mono", Consolas, Monaco, "Courier New", monospace;' +
      'font-size: 14px; line-height: 1.7; display: block; white-space: pre;' +
      'padding: 0; -webkit-font-smoothing: antialiased;';
    code.setAttribute('style', codeStyle);
    code.innerHTML = codeHtml;

    pre.appendChild(code);
    wrapper.appendChild(pre);

    const outerPre = block.closest('pre') || block.parentNode;
    if (outerPre?.parentNode) {
      outerPre.parentNode.replaceChild(wrapper, outerPre);
    }
  });

  // Flatten list items
  const listItems = doc.querySelectorAll('li');
  listItems.forEach(li => {
    let text = li.textContent || '';
    text = text.replace(/\n/g, ' ').replace(/\r/g, ' ').replace(/\s+/g, ' ').trim();
    li.innerHTML = '';
    li.textContent = text;
  });

  // Dark mode: adjust blockquotes with transparent colors
  const blockquotes = doc.querySelectorAll('blockquote');
  blockquotes.forEach(blockquote => {
    let currentStyle = blockquote.getAttribute('style') || '';
    currentStyle = currentStyle
      .replace(/background(?:-color)?:\s*[^;]+;?/gi, '')
      .replace(/color:\s*[^;]+;?/gi, '');
    currentStyle += '; background: rgba(0, 0, 0, 0.05) !important';
    currentStyle += '; color: rgba(0, 0, 0, 0.8) !important';
    currentStyle = currentStyle.replace(/;\s*;/g, ';').replace(/^\s*;\s*|\s*;\s*$/g, '').trim();
    blockquote.setAttribute('style', currentStyle);
  });

  return doc.body.innerHTML;
}

function render(markdownContent: string, styleKey: string = 'wechat-default', options: RenderOptions = {}): string {
  const md = createMarkdownIt();
  const processed = preprocessMarkdown(markdownContent);
  let html = md.render(processed);

  html = applyInlineStyles(html, styleKey);

  if (options.clipboard !== false) {
    html = simplifyForClipboard(html, styleKey);
  }

  return html;
}

function getAvailableStyles(): StyleInfo[] {
  return Object.entries(STYLES).map(([key, config]) => ({
    key,
    name: config.name,
  }));
}

export { render, getAvailableStyles, STYLES };
