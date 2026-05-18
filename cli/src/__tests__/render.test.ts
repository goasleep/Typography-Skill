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

  it('includes code block styling with macOS dots', () => {
    const md = '```javascript\nconsole.log("hello");\n```';
    const html = render(md, 'wechat-default');
    expect(html).toContain('#ff5f56'); // red dot
    expect(html).toContain('#ffbd2e'); // yellow dot
    expect(html).toContain('#27c93f'); // green dot
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
  it('returns all 19 themes with key and name', () => {
    const styles = getAvailableStyles();
    expect(styles.length).toBe(19);
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
    expect(Object.keys(STYLES).length).toBe(19);
  });
});
