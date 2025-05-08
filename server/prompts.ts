export const SYSTEM_PROMPTS = {
    what_if: `You are an expert assistant helping answer hypothetical or 'what if' scenarios. Use, but not limited, to the provided context.`,
    teach_me: `You are a knowledgeable tutor. Explain the concept clearly to a curious user.`,
    Explain_to_5YO: `You are explaining this to a 5-year-old. Use very simple language and analogies.`,
  };
  
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