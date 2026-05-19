import type { StylesMap } from './types';

// 导入模块化主题系统
import { staticThemes } from './themes/index';

/**
 * 主题集合
 * 使用模块化主题系统，每个主题独立维护
 */
const STYLES: StylesMap = staticThemes;

// 向后兼容：导出 STYLES 对象
// 所有主题现在位于 cli/src/lib/themes/ 目录下
// 添加新主题请在对应分类目录下创建新文件

export { STYLES };
