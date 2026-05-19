/**
 * 主题系统入口
 * 支持模块化主题文件，同时保持向后兼容
 */

import type { StylesMap, StyleConfig } from '../types';

// 导入基础主题
import { theme as wechatDefault } from './base/wechat-default';
import { theme as wechatElegant } from './base/wechat-elegant';
import { theme as wechatDeepread } from './base/wechat-deepread';
import { theme as warmDocs } from './base/warm-docs';

// 导入技术主题
import { theme as wechatTech } from './tech/wechat-tech';
import { theme as wechatAnthropic } from './tech/wechat-anthropic';

// 导入编辑主题
import { theme as latepostDepth } from './editorial/latepost-depth';
import { theme as wechatFt } from './editorial/wechat-ft';
import { theme as wechatNyt } from './editorial/wechat-nyt';
import { theme as wechatMedium } from './editorial/wechat-medium';
import { theme as hischeEditorial } from './editorial/hische-editorial';
import { theme as lemonde } from './editorial/lemonde';

// 导入艺术主题
import { theme as wechatJonyive } from './artistic/wechat-jonyive';
import { theme as wechatApple } from './artistic/wechat-apple';
import { theme as kenyaEmptiness } from './artistic/kenya-emptiness';
import { theme as andoConcrete } from './artistic/ando-concrete';
import { theme as gaudiOrganic } from './artistic/gaudi-organic';

// 导入商业主题
import { theme as guardian } from './business/guardian';
import { theme as nikkei } from './business/nikkei';

/**
 * 主题映射表
 * 集中管理所有主题的导入路径
 */
const themeModules: Record<string, () => Promise<StyleConfig>> = {
  'wechat-default': () => import('./base/wechat-default').then(m => m.theme),
  'wechat-elegant': () => import('./base/wechat-elegant').then(m => m.theme),
  'wechat-deepread': () => import('./base/wechat-deepread').then(m => m.theme),
  'warm-docs': () => import('./base/warm-docs').then(m => m.theme),
  'wechat-tech': () => import('./tech/wechat-tech').then(m => m.theme),
  'wechat-anthropic': () => import('./tech/wechat-anthropic').then(m => m.theme),
  'latepost-depth': () => import('./editorial/latepost-depth').then(m => m.theme),
  'wechat-ft': () => import('./editorial/wechat-ft').then(m => m.theme),
  'wechat-nyt': () => import('./editorial/wechat-nyt').then(m => m.theme),
  'wechat-medium': () => import('./editorial/wechat-medium').then(m => m.theme),
  'hische-editorial': () => import('./editorial/hische-editorial').then(m => m.theme),
  'lemonde': () => import('./editorial/lemonde').then(m => m.theme),
  'wechat-jonyive': () => import('./artistic/wechat-jonyive').then(m => m.theme),
  'wechat-apple': () => import('./artistic/wechat-apple').then(m => m.theme),
  'kenya-emptiness': () => import('./artistic/kenya-emptiness').then(m => m.theme),
  'ando-concrete': () => import('./artistic/ando-concrete').then(m => m.theme),
  'gaudi-organic': () => import('./artistic/gaudi-organic').then(m => m.theme),
  'guardian': () => import('./business/guardian').then(m => m.theme),
  'nikkei': () => import('./business/nikkei').then(m => m.theme),
};

/**
 * 静态主题集合（用于向后兼容）
 */
export const staticThemes: StylesMap = {
  'wechat-default': wechatDefault,
  'wechat-elegant': wechatElegant,
  'wechat-deepread': wechatDeepread,
  'warm-docs': warmDocs,
  'wechat-tech': wechatTech,
  'wechat-anthropic': wechatAnthropic,
  'latepost-depth': latepostDepth,
  'wechat-ft': wechatFt,
  'wechat-nyt': wechatNyt,
  'wechat-medium': wechatMedium,
  'hische-editorial': hischeEditorial,
  'lemonde': lemonde,
  'wechat-jonyive': wechatJonyive,
  'wechat-apple': wechatApple,
  'kenya-emptiness': kenyaEmptiness,
  'ando-concrete': andoConcrete,
  'gaudi-organic': gaudiOrganic,
  'guardian': guardian,
  'nikkei': nikkei,
};

/**
 * 动态加载主题
 * 支持按需加载和异步导入
 */
export async function loadTheme(key: string) {
  if (staticThemes[key]) {
    return staticThemes[key];
  }

  if (themeModules[key]) {
    return await themeModules[key]();
  }

  throw new Error(`Theme "${key}" not found. Available: ${Object.keys(staticThemes).join(', ')}`);
}

/**
 * 加载所有主题
 */
export async function loadAllThemes(): Promise<StylesMap> {
  const themes: StylesMap = { ...staticThemes };

  // 动态加载其他主题
  for (const key of Object.keys(themeModules)) {
    if (!staticThemes[key]) {
      try {
        themes[key] = await themeModules[key]();
      } catch (error) {
        console.warn(`Failed to load theme "${key}":`, error);
      }
    }
  }

  return themes;
}

/**
 * 获取可用的主题列表
 */
export function getAvailableThemes() {
  return {
    static: Object.keys(staticThemes),
    dynamic: Object.keys(themeModules),
    all: [...Object.keys(staticThemes), ...Object.keys(themeModules)]
  };
}

/**
 * 主题分类
 */
export const themeCategories = {
  base: ['wechat-default', 'wechat-elegant', 'wechat-deepread', 'warm-docs'],
  tech: ['wechat-tech', 'wechat-anthropic'],
  editorial: ['latepost-depth', 'wechat-ft', 'wechat-nyt', 'wechat-medium', 'hische-editorial', 'lemonde'],
  artistic: ['wechat-jonyive', 'wechat-apple', 'kenya-emptiness', 'ando-concrete', 'gaudi-organic'],
  business: ['guardian', 'nikkei'],
  user: [] // 用户自定义主题
};

/**
 * 按类别获取主题
 */
export function getThemesByCategory(category: keyof typeof themeCategories) {
  return themeCategories[category] || [];
}

/**
 * 主题统计
 */
export function getThemeStats() {
  const available = getAvailableThemes();
  return {
    total: available.all.length,
    static: available.static.length,
    dynamic: available.dynamic.length,
    categories: Object.fromEntries(
      Object.entries(themeCategories).map(([cat, themes]) => [cat, themes.length])
    )
  };
}