const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const STYLES = require('./styles');

const PAGE_WIDTH = 750;
const PAGE_HEIGHT = 1000;
const MAX_CONTENT_HEIGHT = 850;
const FIRST_PAGE_OFFSET = 120;

function createSimplifiedContent(markdown) {
  const lines = markdown.split('\n');
  const content = [];
  let inCodeBlock = false;

  lines.forEach(line => {
    line = line.trim();
    if (!line) return;

    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      return;
    }
    if (inCodeBlock) {
      content.push({ type: 'p', text: line });
      return;
    }

    if (line.startsWith('### ')) {
      content.push({ type: 'h3', text: line.substring(4) });
    } else if (line.startsWith('## ')) {
      content.push({ type: 'h2', text: line.substring(3) });
    } else if (line.startsWith('# ')) {
      content.push({ type: 'h1', text: line.substring(2) });
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      content.push({ type: 'li', text: line.substring(2) });
    } else if (line.startsWith('> ')) {
      content.push({ type: 'quote', text: line.substring(2) });
    } else if (line.startsWith('![')) {
      // skip images
    } else if (line === '---') {
      content.push({ type: 'hr' });
    } else {
      let text = line.replace(/\*\*(.+?)\*\*/g, '$1');
      text = text.replace(/\*(.+?)\*/g, '$1');
      text = text.replace(/`(.+?)`/g, '$1');
      content.push({ type: 'p', text });
    }
  });

  return content;
}

function blockToHTML(block) {
  const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  switch (block.type) {
    case 'h1':
      return `<div style="font-size:28px;font-weight:bold;margin:20px 0 10px 0;color:#000;">${escape(block.text)}</div>`;
    case 'h2':
      return `<div style="font-size:24px;font-weight:bold;margin:16px 0 8px 0;color:#000;">${escape(block.text)}</div>`;
    case 'h3':
      return `<div style="font-size:20px;font-weight:bold;margin:12px 0 6px 0;color:#333;">${escape(block.text)}</div>`;
    case 'p':
      return `<div style="font-size:16px;line-height:1.8;margin:8px 0;color:#333;">${escape(block.text)}</div>`;
    case 'li':
      return `<div style="font-size:16px;line-height:1.8;margin:4px 0;padding-left:10px;color:#333;">• ${escape(block.text)}</div>`;
    case 'quote':
      return `<div style="font-size:15px;line-height:1.8;margin:8px 0;padding:10px 15px;border-left:3px solid #0066FF;background:#f5f5f5;color:#666;">${escape(block.text)}</div>`;
    case 'hr':
      return `<div style="height:1px;background:#ddd;margin:20px 0;border:none;"></div>`;
    default:
      return '';
  }
}

function calculateArticleInfo(markdown) {
  const textContent = markdown.replace(/[#*`>\-!()\[\]]/g, '').replace(/\s/g, '');
  const charCount = textContent.length;
  const readingTime = Math.ceil(charCount / 400);
  const imageCount = (markdown.match(/!\[/g) || []).length;
  return { charCount, readingTime, imageCount };
}

function getBackgroundColor(styleKey) {
  const styleConfig = STYLES[styleKey];
  if (styleConfig && styleConfig.styles && styleConfig.styles.container) {
    const containerStyle = styleConfig.styles.container;
    const bgColorMatch = containerStyle.match(/background-color:\s*([^;]+)/);
    if (bgColorMatch) return bgColorMatch[1].trim();
    const bgMatch = containerStyle.match(/background:\s*([#rgb][^;]+)/);
    if (bgMatch) return bgMatch[1].trim();
  }
  return '#FFFFFF';
}

function infoPanelHTML(articleInfo) {
  return `
    <div style="position:absolute;top:20px;left:40px;right:40px;padding:20px;background-color:#E6F0FF;border-radius:8px;border:1px solid #99CCFF;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="text-align:center;padding:5px;">
            <div style="font-size:24px;font-weight:bold;color:#0066FF;margin-bottom:4px;">${articleInfo.charCount}</div>
            <div style="font-size:12px;color:#666;">字数</div>
          </td>
          <td style="text-align:center;padding:5px;">
            <div style="font-size:24px;font-weight:bold;color:#0066FF;margin-bottom:4px;">${articleInfo.readingTime}分钟</div>
            <div style="font-size:12px;color:#666;">阅读</div>
          </td>
          <td style="text-align:center;padding:5px;">
            <div style="font-size:24px;font-weight:bold;color:#0066FF;margin-bottom:4px;">${articleInfo.imageCount}张</div>
            <div style="font-size:12px;color:#666;">图片</div>
          </td>
        </tr>
      </table>
    </div>`;
}

function pageNumberHTML(current, total) {
  return `<div style="position:absolute;bottom:30px;right:40px;font-size:14px;color:#999;font-weight:500;">${current}/${total}</div>`;
}

function buildMeasurementHTML(blocks, bgColor) {
  const blocksHTML = blocks.map((b, i) => `<div class="block" data-index="${i}">${blockToHTML(b)}</div>`).join('\n');
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>body{margin:0;padding:0;}</style></head>
<body>
<div id="measure" style="width:750px;padding:80px 40px 40px 40px;box-sizing:border-box;background-color:${bgColor};font-family:Arial;font-size:16px;line-height:1.8;color:#333;">
${blocksHTML}
</div>
</body></html>`;
}

function buildPagesHTML(pages, options) {
  const bgColor = options.bgColor;
  const totalPages = pages.length;

  return pages.map((pageBlocks, i) => {
    const pageNum = i + 1;
    const contentHTML = pageBlocks.map(b => blockToHTML(b)).join('\n');
    const infoPanel = (i === 0 && options.showInfo) ? infoPanelHTML(options.articleInfo) : '';

    return `<div class="xhs-page" style="width:750px;height:1000px;background-color:${bgColor};padding:80px 40px 40px 40px;box-sizing:border-box;position:relative;overflow:hidden;font-family:Arial;font-size:16px;line-height:1.8;color:#333;">
${infoPanel}
${contentHTML}
${pageNumberHTML(pageNum, totalPages)}
</div>`;
  }).join('\n');
}

function buildScreenshotHTML(pagesHTML, bgColor) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>body{margin:0;padding:0;background:${bgColor};}</style></head>
<body>
${pagesHTML}
</body></html>`;
}

async function splitIntoPages(blocks, bgColor) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const html = buildMeasurementHTML(blocks, bgColor);
  await page.setContent(html, { waitUntil: 'networkidle0' });

  // Measure each block's height
  const heights = await page.evaluate(() => {
    const blocks = document.querySelectorAll('.block');
    return Array.from(blocks).map(b => b.offsetHeight);
  });

  await browser.close();

  // Split blocks into pages based on measured heights
  const pages = [];
  let currentPage = [];
  let currentHeight = 0;

  for (let i = 0; i < blocks.length; i++) {
    const blockHeight = heights[i] || 50;
    const heightLimit = pages.length === 0
      ? MAX_CONTENT_HEIGHT - FIRST_PAGE_OFFSET
      : MAX_CONTENT_HEIGHT;

    if (currentHeight + blockHeight > heightLimit && currentPage.length > 0) {
      pages.push(currentPage);
      currentPage = [];
      currentHeight = 0;
    }

    currentPage.push(blocks[i]);
    currentHeight += blockHeight;
  }

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
}

async function generateImages(markdown, styleKey, outputDir, options = {}) {
  const showInfo = options.showInfo !== false;
  const bgColor = getBackgroundColor(styleKey);
  const articleInfo = calculateArticleInfo(markdown);
  const blocks = createSimplifiedContent(markdown);

  if (blocks.length === 0) {
    throw new Error('No content to generate images from');
  }

  // Split content into pages
  const pages = await splitIntoPages(blocks, bgColor);

  // Build final HTML with all pages
  const pagesHTML = buildPagesHTML(pages, {
    bgColor,
    showInfo,
    articleInfo,
  });
  const screenshotHTML = buildScreenshotHTML(pagesHTML, bgColor);

  // Ensure output directory exists
  fs.mkdirSync(outputDir, { recursive: true });

  // Launch browser and screenshot each page
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setViewport({ width: PAGE_WIDTH, height: PAGE_HEIGHT, deviceScaleFactor: 2 });
  await page.setContent(screenshotHTML, { waitUntil: 'networkidle0' });

  const pageElements = await page.$$('.xhs-page');
  const files = [];

  for (let i = 0; i < pageElements.length; i++) {
    const filename = `page_${i + 1}.png`;
    const filepath = path.join(outputDir, filename);
    await pageElements[i].screenshot({ path: filepath, type: 'png' });
    files.push(filepath);
  }

  await browser.close();

  return { files, totalPages: pages.length, articleInfo };
}

module.exports = { generateImages, getAvailableStyles: () => Object.keys(STYLES) };
