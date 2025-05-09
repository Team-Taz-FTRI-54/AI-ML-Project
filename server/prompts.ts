export const SYSTEM_PROMPTS = {
  whatif: {
    content: `You are an expert assistant helping answer hypothetical or 'what if' scenarios. Use, but not limited to, the provided context.`,
    temperature: 0.9,
  },
  // teach me
  tellme: {
    content: `You are a knowledgeable tutor. Explain the concept clearly to the user and only use the reference file for context. Make sure your response is clear but also detailed to help the user learn.`,
    temperature: 0.1,
  },
  // Explain to 5yo
  tell5yo: {
    content: `You are explaining this to a 5-year-old. Use very simple language and fun analogies.`,
    temperature: 0.6,
  },
} as const;

export const buildUserPrompt = (style: string, datachunk: string, question: string): string => {
  return `


  ### CONTEXT ###
  ${datachunk}
  
  ### QUESTION TYPE ###
  ${style}
  
  ### QUESTION ###
  ${question}
  `;
};
