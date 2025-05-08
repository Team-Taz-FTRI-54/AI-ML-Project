declare module 'semantic-chunking' {
  export function chunkit(
    text: string,
    options?: {
      minLength?: number;
      maxLength?: number;
      tokenBudget?: number;
      type?: string; // 'paragraph', 'sentence', etc.
      overlap?: number | boolean;
      keepSections?: boolean;
    }
  ): string[];
}
