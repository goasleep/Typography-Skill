/** A single style theme definition */
export interface StyleConfig {
    name: string;
    styles: Record<string, string>;
}
/** The full STYLES dictionary, keyed by style ID */
export type StylesMap = Record<string, StyleConfig>;
/** Style info returned by getAvailableStyles */
export interface StyleInfo {
    key: string;
    name: string;
}
/** Options for the render() function */
export interface RenderOptions {
    clipboard?: boolean;
}
/** A content block used by the Xiaohongshu pipeline */
export interface ContentBlock {
    type: 'h1' | 'h2' | 'h3' | 'p' | 'li' | 'quote' | 'hr';
    text?: string;
}
/** Article metadata for XHS info panel */
export interface ArticleInfo {
    charCount: number;
    readingTime: number;
    imageCount: number;
}
/** Options for generateImages() */
export interface GenerateImagesOptions {
    showInfo?: boolean;
}
/** Result of generateImages() */
export interface GenerateImagesResult {
    files: string[];
    totalPages: number;
    articleInfo: ArticleInfo;
}
/** Options for buildPagesHTML() */
export interface PagesHTMLOptions {
    bgColor: string;
    showInfo: boolean;
    articleInfo: ArticleInfo;
}
/** Internal tracking object for groupConsecutiveImages() */
export interface ImageItem {
    element: Element;
    img: Element;
    index: number;
    inSameParagraph: boolean;
    paragraphImageCount: number;
}
//# sourceMappingURL=types.d.ts.map