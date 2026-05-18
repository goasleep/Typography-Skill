#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const render_1 = require("../lib/render");
const xiaohongshu_1 = require("../lib/xiaohongshu");
const program = new commander_1.Command();
program
    .name('typeset')
    .description('Convert Markdown to WeChat-compatible HTML with styled themes')
    .version('1.0.0')
    .enablePositionalOptions();
program
    .command('styles')
    .description('List all available style themes')
    .action(() => {
    const styles = (0, render_1.getAvailableStyles)();
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
    .action(async (file, options) => {
    const filePath = path.resolve(file);
    if (!fs.existsSync(filePath)) {
        console.error(`Error: File not found: ${filePath}`);
        process.exit(1);
    }
    const markdown = fs.readFileSync(filePath, 'utf-8');
    const outputDir = path.resolve(options.output);
    try {
        console.log('Generating xiaohongshu images...');
        const result = await (0, xiaohongshu_1.generateImages)(markdown, options.style, outputDir, {
            showInfo: options.info !== false,
        });
        console.log(`\nGenerated ${result.totalPages} page(s):`);
        result.files.forEach(f => console.log(`  ${f}`));
        if (result.articleInfo) {
            console.log(`\nArticle info: ${result.articleInfo.charCount} chars, ~${result.articleInfo.readingTime} min read, ${result.articleInfo.imageCount} image(s)`);
        }
    }
    catch (err) {
        console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
        process.exit(1);
    }
});
program
    .argument('<file>', 'Markdown file path')
    .option('-s, --style <theme>', 'Style theme key', 'wechat-default')
    .option('-o, --output <file>', 'Output file path (default: stdout)')
    .option('--no-clipboard', 'Skip clipboard-compatible simplifications (Grid→Table, etc.)')
    .action((file, options) => {
    const filePath = path.resolve(file);
    if (!fs.existsSync(filePath)) {
        console.error(`Error: File not found: ${filePath}`);
        process.exit(1);
    }
    const markdown = fs.readFileSync(filePath, 'utf-8');
    try {
        const html = (0, render_1.render)(markdown, options.style, {
            clipboard: options.clipboard !== false,
        });
        if (options.output) {
            const outputPath = path.resolve(options.output);
            fs.writeFileSync(outputPath, html, 'utf-8');
            console.error(`Written to ${outputPath}`);
        }
        else {
            process.stdout.write(html);
        }
    }
    catch (err) {
        console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
        process.exit(1);
    }
});
program.parse();
//# sourceMappingURL=typeset.js.map