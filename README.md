# Typeset

将 Markdown 转换为微信公众号兼容的带样式 HTML，并支持生成小红书风格卡片图片。

## 功能特性

- **Markdown → 微信公众号 HTML**：19 种精心设计的排版主题，一键复制粘贴到公众号后台
- **Markdown → 小红书卡片**：自动分页生成 750×1000px 的高清卡片图片
- **智能图片处理**：连续图片自动排列为网格布局，并兼容微信转换为表格
- **代码高亮**：基于 highlight.js，支持多语言语法高亮，macOS 风格窗口装饰
- **Markdown 预处理**：自动修复飞书等平台导出的格式问题

## 安装

支持 npm、npx 和 pnpm 三种方式。

### 方式 1：本地开发（推荐用于开发）

```bash
# 克隆项目
git clone <repo-url>
cd Typography-Skill/cli

# 选择包管理器安装依赖
pnpm install    # 推荐
# 或
npm install

# 构建 TypeScript
pnpm run build   # 或 npm run build

# 运行 CLI
node bin/typeset.js article.md -s wechat-tech
```

### 方式 2：全局安装（推荐用于日常使用）

```bash
# 使用 pnpm（推荐）
cd cli && pnpm install -g
# 或使用 npm
cd cli && npm install -g

# 然后可以在任何地方使用
typeset article.md -s wechat-tech
typeset styles
typeset image article.md -o ./xhs_cards
```

### 方式 3：使用 npx（无需安装）

```bash
# 在项目目录下，使用 npx 直接运行
cd Typography-Skill/cli
npx typeset article.md -s wechat-tech

# npx 会自动：
# 1. 检查本地是否已安装
# 2. 如未安装，自动下载最新版本
# 3. 运行完成后可选择是否保留
```

**环境要求**：Node.js >= 18.0.0

> `image` 命令需要 Puppeteer，首次运行时会自动下载 Chromium。如遇下载问题，可设置镜像：
> ```bash
> export PUPPETEER_DOWNLOAD_HOST=https://registry.npmmirror.com/-/binary/chromium-browser-snapshots
> ```

## 包管理器说明

| 命令 | pnpm | npm | npx |
|------|------|-----|-----|
| 安装依赖 | `pnpm install` | `npm install` | 自动处理 |
| 构建 | `pnpm run build` | `npm run build` | - |
| 运行 CLI | `pnpm start` 或 `node bin/typeset.js` | `npm start` 或 `node bin/typeset.js` | `npx typeset` |
| 全局安装 | `pnpm install -g` | `npm install -g` | - |
| 开发模式 | `pnpm run dev` | `npm run dev` | - |

## Claude Code 技能

项目包含三个 Claude Code 技能，让 Claude AI 帮助你更高效地使用 typeset：

### 可用技能

1. **wechat-typer** - 转换 Markdown 为微信 HTML
2. **wechat-theme-explorer** - 浏览和选择 19 种主题
3. **xiaohongshu-generator** - 生成小红书卡片图片

### 安装技能

```bash
# 安装所有技能
claude skill install skills/wechat-typer.skill
claude skill install skills/wechat-theme-explorer.skill
claude skill install skills/xiaohongshu-generator.skill
```

### 使用技能

安装后，在 Claude Code 中可以直接对话：

```
# 转换文章
"将我的 article.md 转换为微信 HTML，使用 tech 主题"

# 推荐主题
"我有一篇技术教程，应该用哪个主题？"

# 生成小红书卡片
"生成小红书卡片图片，使用 anthropic 主题"
```

详细文档请查看 [skills/README.md](skills/README.md) 和 [skills/INSTALL.md](skills/INSTALL.md)。

## 使用

### 本地开发模式

```bash
# 在项目目录下
cd cli

# 方式 1：直接运行 node
node bin/typeset.js article.md

# 方式 2：使用 npm script
npm start -- article.md -s wechat-tech

# 方式 3：使用 pnpm script
pnpm start article.md -s wechat-tech
```

### 全局安装后使用（推荐）

```bash
# 安装后可在任何目录使用
cd cli && npm install -g   # 或 pnpm install -g

# 转换文章（在任何目录）
typeset article.md -s wechat-tech -o output.html

# 查看主题
typeset styles

# 生成小红书卡片
typeset image article.md -o ./xhs_cards
```

### 使用 npx（无需全局安装）

```bash
# 在项目目录下，npx 会自动运行
cd cli
npx typeset article.md -s wechat-tech

# 首次使用时，npx 会提示安装
# 后续使用会直接运行已安装的版本
```

## 常用命令示例

### 转换为微信公众号 HTML

```bash
# 默认主题，输出到标准输出
typeset article.md

# 指定主题，输出到文件
typeset article.md -s wechat-tech -o output.html

# 跳过剪贴板兼容处理（保留 CSS Grid，不转换为表格）
typeset article.md --no-clipboard
```

### 生成小红书卡片图片

```bash
# 使用默认主题背景色
typeset image article.md -o ./xhs_output

# 指定主题
node cli/bin/typeset.js image article.md -s wechat-anthropic -o ./xhs_output

# 不显示首页信息面板
node cli/bin/typeset.js image article.md --no-info -o ./xhs_output
```

### 查看可用主题

```bash
node cli/bin/typeset.js styles
```

## 可用主题

| 主题 Key | 名称 | 风格 |
|----------|------|------|
| `wechat-default` | 默认公众号风格 | 经典蓝灰 |
| `latepost-depth` | 晚点风格 | 红色强调 |
| `wechat-ft` | 金融时报 | 衬线字体 + 米色背景 |
| `wechat-anthropic` | Claude | 陶土色渐变 |
| `wechat-tech` | 技术风格 | 蓝 + 绿代码感 |
| `wechat-elegant` | 优雅简约 | 宋体 + 首行缩进 |
| `wechat-deepread` | 深度阅读 | 极简黑白 |
| `wechat-nyt` | 纽约时报 | Georgia 衬线 |
| `wechat-jonyive` | Jony Ive | 极细字重 + 大留白 |
| `wechat-medium` | Medium 长文 | Georgia 标题 |
| `wechat-apple` | Apple 极简 | SF Pro + 灰色文字 |
| `kenya-emptiness` | 原研哉·空 | 超大行距 + 宽字距 |
| `hische-editorial` | Hische·编辑部 | Didot 衬线 + 编辑排版 |
| `ando-concrete` | 安藤·清水 | 极简混凝土质感 |
| `gaudi-organic` | 高迪·有机 | 彩虹渐变 + 有机形状 |
| `guardian` | Guardian 卫报 | 深蓝 + 黄色强调 |
| `nikkei` | Nikkei 日経 | 日文黑体 + 红色标记 |
| `warm-docs` | 焦橙文档 | 暖橙色文档风格 |
| `lemonde` | Le Monde 世界报 | Didot 衬线 + 法式排版 |

## 项目结构

```
Typography-Skill/
├── cli/
│   ├── bin/typeset.js        # CLI 入口（shim → dist）
│   ├── src/
│   │   ├── bin/typeset.ts    # CLI 逻辑（commander）
│   │   ├── lib/
│   │   │   ├── types.ts      # TypeScript 类型定义
│   │   │   ├── styles.ts     # 主题样式配置（19 种主题）
│   │   │   ├── render.ts     # 核心：Markdown → 微信 HTML 渲染管线
│   │   │   └── xiaohongshu.ts # 小红书卡片图片生成（Puppeteer）
│   │   └── __tests__/        # Vitest 测试文件
│   ├── dist/                 # 编译输出（gitignore）
│   ├── test/                 # 测试用 Markdown 文件
│   └── package.json
└── CLAUDE.md
```

## 开发

### 添加新主题

编辑 `cli/src/lib/styles.ts`，在 `STYLES` 对象中添加新条目：

```typescript
'my-theme': {
  name: '我的主题',
  styles: {
    container: 'max-width: 700px; margin: 0 auto; ...',
    h1: 'font-size: 28px; font-weight: 700; ...',
    h2: 'font-size: 22px; ...',
    p: 'margin: 18px 0; line-height: 1.8; ...',
    // ... 其他选择器
  }
}
```

**注意**：所有样式必须为内联 CSS 字符串，因为微信公众号编辑器会移除 `<style>` 标签和 class 属性。

### 渲染管线

1. **预处理**：修复飞书等平台导出的格式问题（`preprocessMarkdown`）
2. **Markdown 解析**：使用 markdown-it + highlight.js 语法高亮（`createMarkdownIt`）
3. **内联样式应用**：通过 JSDOM 将主题样式注入每个 HTML 元素（`applyInlineStyles`）
4. **剪贴板兼容**：CSS Grid → `<table>` 转换、代码块简化、列表扁平化（`simplifyForClipboard`）

### 运行测试

```bash
cd cli && pnpm test
```

### 构建

```bash
pnpm run build    # 编译 TypeScript
pnpm run lint     # 仅类型检查
pnpm run dev      # 监听模式编译
```

## License

MIT
