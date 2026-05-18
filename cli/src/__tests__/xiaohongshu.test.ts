import { describe, it, expect } from 'vitest';
import { generateImages } from '../lib/xiaohongshu';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const sampleMd = fs.readFileSync(path.resolve(__dirname, '../../test/sample.md'), 'utf-8');

describe('generateImages', () => {
  it('generates PNG files', async () => {
    const outputDir = path.join(os.tmpdir(), `typeset-test-${Date.now()}`);
    try {
      const result = await generateImages(sampleMd, 'wechat-default', outputDir);

      expect(result.files.length).toBeGreaterThan(0);
      expect(result.totalPages).toBeGreaterThan(0);

      for (const file of result.files) {
        expect(file).toMatch(/\.png$/);
        expect(fs.existsSync(file)).toBe(true);
        const stat = fs.statSync(file);
        expect(stat.size).toBeGreaterThan(0);
      }
    } finally {
      // Cleanup
      fs.rmSync(outputDir, { recursive: true, force: true });
    }
  }, 60_000);

  it('returns correct articleInfo', async () => {
    const outputDir = path.join(os.tmpdir(), `typeset-test-info-${Date.now()}`);
    try {
      const result = await generateImages(sampleMd, 'wechat-default', outputDir);
      expect(result.articleInfo.charCount).toBeGreaterThan(0);
      expect(result.articleInfo.readingTime).toBeGreaterThan(0);
    } finally {
      fs.rmSync(outputDir, { recursive: true, force: true });
    }
  }, 60_000);

  it('throws on empty content', async () => {
    const outputDir = path.join(os.tmpdir(), `typeset-test-empty-${Date.now()}`);
    try {
      await expect(generateImages('', 'wechat-default', outputDir)).rejects.toThrow(/No content/);
    } finally {
      fs.rmSync(outputDir, { recursive: true, force: true });
    }
  }, 60_000);

  it('totalPages is consistent with files.length', async () => {
    const outputDir = path.join(os.tmpdir(), `typeset-test-pages-${Date.now()}`);
    try {
      const result = await generateImages(sampleMd, 'wechat-default', outputDir);
      expect(result.files.length).toBe(result.totalPages);
    } finally {
      fs.rmSync(outputDir, { recursive: true, force: true });
    }
  }, 60_000);

  it('works with different themes', async () => {
    const outputDir1 = path.join(os.tmpdir(), `typeset-test-theme1-${Date.now()}`);
    const outputDir2 = path.join(os.tmpdir(), `typeset-test-theme2-${Date.now()}`);
    try {
      const result1 = await generateImages(sampleMd, 'wechat-default', outputDir1);
      const result2 = await generateImages(sampleMd, 'wechat-anthropic', outputDir2);

      expect(result1.files.length).toBeGreaterThan(0);
      expect(result2.files.length).toBeGreaterThan(0);
    } finally {
      fs.rmSync(outputDir1, { recursive: true, force: true });
      fs.rmSync(outputDir2, { recursive: true, force: true });
    }
  }, 120_000);
});
