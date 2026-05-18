#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { render, getAvailableStyles } from '../lib/render';
import { generateImages } from '../lib/xiaohongshu';

const program = new Command();

program
  .name('typeset')
  .description('Convert Markdown to WeChat-compatible HTML with styled themes')
  .version('1.0.0')
  .enablePositionalOptions();

program
  .command('styles')
  .description('List all available style themes')
  .action(() => {
    const styles = getAvailableStyles();
    console.log('Available styles:\n');
    styles.forEach(({ key, name }) => {
      console.log(`  ${key.padEnd(25)} ${name}`);
    });
  });

program
  .command('image')
  .description('Generate xiaohongshu-styled card images from Markdown')
  .argument('<file>', 'Markdown file path')
  .option('-s, --style <theme>', 'Style theme key (for background color)', 'wechat-default')
  .option('-o, --output <dir>', 'Output directory', './xhs_output')
  .option('--no-info', 'Skip info panel on page 1')
  .action(async (file: string, options: { style: string; output: string; info: boolean }) => {
    const filePath = path.resolve(file);

    if (!fs.existsSync(filePath)) {
      console.error(`Error: File not found: ${filePath}`);
      process.exit(1);
    }

    const markdown = fs.readFileSync(filePath, 'utf-8');
    const outputDir = path.resolve(options.output);

    try {
      console.log('Generating xiaohongshu images...');
      const result = await generateImages(markdown, options.style, outputDir, {
        showInfo: options.info !== false,
      });

      console.log(`\nGenerated ${result.totalPages} page(s):`);
      result.files.forEach(f => console.log(`  ${f}`));
      if (result.articleInfo) {
        console.log(`\nArticle info: ${result.articleInfo.charCount} chars, ~${result.articleInfo.readingTime} min read, ${result.articleInfo.imageCount} image(s)`);
      }
    } catch (err: unknown) {
      console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
      process.exit(1);
    }
  });

program
  .argument('<file>', 'Markdown file path')
  .option('-s, --style <theme>', 'Style theme key', 'wechat-default')
  .option('-o, --output <file>', 'Output file path (default: stdout)')
  .option('--no-clipboard', 'Skip clipboard-compatible simplifications (Grid→Table, etc.)')
  .action((file: string, options: { style: string; output?: string; clipboard: boolean }) => {
    const filePath = path.resolve(file);

    if (!fs.existsSync(filePath)) {
      console.error(`Error: File not found: ${filePath}`);
      process.exit(1);
    }

    const markdown = fs.readFileSync(filePath, 'utf-8');

    try {
      const html = render(markdown, options.style, {
        clipboard: options.clipboard !== false,
      });

      if (options.output) {
        const outputPath = path.resolve(options.output);
        fs.writeFileSync(outputPath, html, 'utf-8');
        console.error(`Written to ${outputPath}`);
      } else {
        process.stdout.write(html);
      }
    } catch (err: unknown) {
      console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
      process.exit(1);
    }
  });

program.parse();
