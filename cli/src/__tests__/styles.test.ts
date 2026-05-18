import { describe, it, expect } from 'vitest';
import { STYLES } from '../lib/styles';

describe('STYLES', () => {
  it('has exactly 19 style entries', () => {
    expect(Object.keys(STYLES).length).toBe(19);
  });

  it('every style has a non-empty name', () => {
    for (const [key, config] of Object.entries(STYLES)) {
      expect(config.name, `Style "${key}" should have a name`).toBeTruthy();
      expect(typeof config.name).toBe('string');
    }
  });

  it('every style has a styles object', () => {
    for (const [key, config] of Object.entries(STYLES)) {
      expect(config.styles, `Style "${key}" should have styles`).toBeDefined();
      expect(typeof config.styles).toBe('object');
    }
  });

  it('every style has a container selector', () => {
    for (const [key, config] of Object.entries(STYLES)) {
      expect(config.styles.container, `Style "${key}" should have container`).toBeDefined();
    }
  });

  it('every style has core selectors (h1, h2, h3, p, code, blockquote, img)', () => {
    const requiredSelectors = ['h1', 'h2', 'h3', 'p', 'code', 'blockquote', 'img'];
    for (const [key, config] of Object.entries(STYLES)) {
      for (const selector of requiredSelectors) {
        expect(config.styles[selector], `Style "${key}" should have "${selector}"`).toBeDefined();
        expect(config.styles[selector].length, `Style "${key}"."${selector}" should be non-empty`).toBeGreaterThan(0);
      }
    }
  });

  it('no style has empty CSS values', () => {
    for (const [key, config] of Object.entries(STYLES)) {
      for (const [selector, value] of Object.entries(config.styles)) {
        expect(value.trim().length, `Style "${key}"."${selector}" should not be empty`).toBeGreaterThan(0);
      }
    }
  });
});
