import { describe, it, expect } from 'vitest';
import { render, getAvailableStyles, STYLES } from '../lib/render';
import * as fs from 'fs';
import * as path from 'path';

const sampleMd = fs.readFileSync(path.resolve(__dirname, '../../test/sample.md'), 'utf-8');
const articleMd = fs.readFileSync(path.resolve(__dirname, '../../test/article.md'), 'utf-8');

describe('render', () => {
  it('produces non-empty HTML from valid markdown', () => {
    const html = render(sampleMd, 'wechat-default');
    expect(html.length).toBeGreaterThan(100);
    expect(html).toContain('<div');
    expect(html).toContain('</div>');
  });

  it('applies correct theme styles — different themes produce different output', () => {
    const htmlDefault = render(sampleMd, 'wechat-default');
    const htmlLatepost = render(sampleMd, 'latepost-depth');
    const htmlTech = render(sampleMd, 'wechat-tech');

    // They should all produce HTML but with different styling
    expect(htmlDefault).toBeTruthy();
    expect(htmlLatepost).toBeTruthy();
    expect(htmlTech).toBeTruthy();

    // The outputs should be different (different themes)
    expect(htmlDefault).not.toBe(htmlLatepost);
    expect(htmlDefault).not.toBe(htmlTech);
  });

  it('throws on unknown style', () => {
    expect(() => render('test', 'nonexistent-style')).toThrow(/Unknown style/);
  });

  it('includes code block wrapper with clean structure', () => {
    const md = '```javascript\nconsole.log("hello");\n```';
    const html = render(md, 'wechat-default');
    expect(html).toContain('<section style="');
    expect(html).toContain('<pre style="');
    expect(html).toContain('<code style="');
    // No macOS dots in simplified output
    expect(html).not.toContain('#ff5f56');
    expect(html).not.toContain('#ffbd2e');
    expect(html).not.toContain('#27c93f');
  });

  it('preserves syntax highlighting in code blocks', () => {
    const md = '```javascript\nfunction hello() {\n  console.log("hello world");\n}\n```';
    const html = render(md, 'wechat-default');
    // Should contain inline color styles (converted from hljs classes), not hljs class names
    expect(html).toMatch(/style="[^"]*color:#/);
    expect(html).not.toMatch(/class="hljs-/);
  });

  it('protects code whitespace for WeChat', () => {
    const md = '```javascript\nfunction hello() {\n  console.log("hello world");\n}\n```';
    const html = render(md, 'wechat-default');
    // Should contain &nbsp; for spaces and <br> for newlines in code content
    expect(html).toContain('&nbsp;');
    expect(html).toContain('<br>');
  });

  it('applies inline code styles from theme', () => {
    const md = 'This is `inline code` in a paragraph.';
    const html = render(md, 'wechat-default');
    // Inline code should receive theme styles (e.g. background-color from wechat-default code selector)
    expect(html).toContain('background-color:');
  });

  it('preserves Chinese content', () => {
    const html = render(articleMd, 'wechat-default');
    expect(html).toContain('微信公众号');
    expect(html.length).toBeGreaterThan(100);
  });

  it('with clipboard=false skips simplifyForClipboard', () => {
    const htmlWithClipboard = render(sampleMd, 'wechat-default', { clipboard: true });
    const htmlNoClipboard = render(sampleMd, 'wechat-default', { clipboard: false });
    // Both should produce valid HTML
    expect(htmlWithClipboard.length).toBeGreaterThan(0);
    expect(htmlNoClipboard.length).toBeGreaterThan(0);
    // They may differ since simplifyForClipboard transforms the HTML
    expect(typeof htmlWithClipboard).toBe('string');
    expect(typeof htmlNoClipboard).toBe('string');
  });

  it('default styleKey is wechat-default', () => {
    const htmlExplicit = render(sampleMd, 'wechat-default');
    const htmlDefault = render(sampleMd);
    expect(htmlExplicit).toBe(htmlDefault);
  });
});

describe('getAvailableStyles', () => {
  it('returns all 21 themes with key and name', () => {
    const styles = getAvailableStyles();
    expect(styles.length).toBe(21);
    styles.forEach(s => {
      expect(s.key).toBeTruthy();
      expect(s.name).toBeTruthy();
      expect(typeof s.key).toBe('string');
      expect(typeof s.name).toBe('string');
    });
  });

  it('includes well-known theme keys', () => {
    const keys = getAvailableStyles().map(s => s.key);
    expect(keys).toContain('wechat-default');
    expect(keys).toContain('wechat-tech');
    expect(keys).toContain('wechat-anthropic');
    expect(keys).toContain('guardian');
    expect(keys).toContain('lemonde');
  });
});

describe('STYLES re-export', () => {
  it('STYLES object is exported from render', () => {
    expect(STYLES).toBeDefined();
    expect(Object.keys(STYLES).length).toBe(21);
  });
});
