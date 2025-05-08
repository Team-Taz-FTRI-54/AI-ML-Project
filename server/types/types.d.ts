declare module 'semantic-chunking' {
  export function chunkit(
    text: string,
    options?: {
      maxTokenSize: number;
      type?: string; // 'paragraph', 'sentence', etc.
      overlap?: number | boolean;
      keepSections?: boolean;
      similarityThreshold?: number;
    }
  ): string[];
}
