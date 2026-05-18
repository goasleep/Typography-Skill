import { STYLES } from './styles';
import type { StyleInfo, RenderOptions } from './types';
declare function render(markdownContent: string, styleKey?: string, options?: RenderOptions): string;
declare function getAvailableStyles(): StyleInfo[];
export { render, getAvailableStyles, STYLES };
//# sourceMappingURL=render.d.ts.map