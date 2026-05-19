const fs = require('fs');
const path = require('path');

// 读取原始 styles.ts 文件
const stylesPath = path.join(__dirname, 'src/lib/styles.ts');
const content = fs.readFileSync(stylesPath, 'utf8');

// 提取 STYLES 对象
const stylesMatch = content.match(/const STYLES: StylesMap = ({[\s\S]*});/);
if (!stylesMatch) {
  console.error('无法找到 STYLES 对象');
  process.exit(1);
}

// 解析主题对象（使用简单的方法）
const themeCategories = {
  'wechat-default': 'base',
  'wechat-deepread': 'base',
  'wechat-elegant': 'base',
  'wechat-jonyive': 'base',
  'wechat-medium': 'base',
  'wechat-apple': 'base',
  'wechat-tech': 'tech',
  'wechat-anthropic': 'tech',
  'latepost-depth': 'editorial',
  'wechat-ft': 'editorial',
  'wechat-nyt': 'editorial',
  'hische-editorial': 'editorial',
  'lemonde': 'editorial',
  'guardian': 'editorial',
  'nikkei': 'editorial',
  'kenya-emptiness': 'artistic',
  'gaudi-organic': 'artistic',
  'ando-concrete': 'artistic',
  'warm-docs': 'business'
};

// 为每个主题创建独立文件
Object.entries(themeCategories).forEach(([key, category]) => {
  console.log(`正在处理主题: ${key} (${category})`);

  // 提取单个主题的正则
  const regex = new RegExp(`'${key}':\\s*{\\s*name:\\s*'([^']+)',\\s*styles:\\s*{([^}]+(?:{[^}]*}[^}]*)*)},`, 's');
  const match = content.match(regex);

  if (match) {
    const [, name, stylesString] = match;

    // 创建主题文件内容
    const themeContent = `/**
 * ${name}
 * 自动生成的主题文件 - ${new Date().toISOString()}
 */

import type { StyleConfig } from '../types';

export const theme: StyleConfig = {
  name: '${name}',
  styles: {
    ${stylesString.trim()}
  }
};
`;

    // 确保目录存在
    const dir = path.join(__dirname, `src/lib/themes/${category}`);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // 写入文件
    const filePath = path.join(dir, `${key}.ts`);
    fs.writeFileSync(filePath, themeContent);

    console.log(`✅ 已创建: ${filePath}`);
  } else {
    console.log(`❌ 跳过: ${key} (无法解析)`);
  }
});

console.log('主题拆分完成！');