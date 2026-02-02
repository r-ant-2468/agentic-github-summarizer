import { InferenceClient } from '@huggingface/inference';

export const getProjectOverview = async (token, url) => {
  const hf = new InferenceClient(token);
  
  const response = await hf.chatCompletion({
    model: "Qwen/Qwen2.5-7B-Instruct",
    messages: [
      { 
        role: "system", 
        content: `You are a technical analyst. Provide a high-level overview of the GitHub repository. 
        Focus on:
        1. Project Purpose (1-2 sentences)
        2. Key Features
        3. Tech Stack (Frameworks/Libraries)
        4. Quick Start Summary
        Use clean Markdown. Be concise. No conversational fluff.` 
      },
      { role: "user", content: `Analyze this repo: ${url}` }
    ],
    max_tokens: 800,
    temperature: 0.3, // Slightly higher for better descriptive writing
  });

  return response.choices[0].message.content;
};