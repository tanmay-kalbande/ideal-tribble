// src/types.ts
export type ModelProvider = 'google' | 'mistral' | 'groq' | 'cerebras';

export type ModelID =
  // Google Gemini Models
  | 'gemini-3-flash-preview'
  | 'gemini-2.5-flash'
  | 'gemma-3-27b-it'
  // Mistral Models
  | 'mistral-small-latest'
  | 'mistral-medium-latest'
  | 'mistral-large-latest'
  // Groq Models
  | 'llama-3.3-70b-versatile'
  | 'moonshotai/kimi-k2-instruct-0905'
  // Cerebras Models
  | 'gpt-oss-120b'
  | 'qwen-3-235b-a22b-instruct-2507'
  | 'zai-glm-4.6';

export interface APISettings {
  googleApiKey: string;
  mistralApiKey: string;
  groqApiKey: string;
  cerebrasApiKey: string;
  selectedModel: ModelID;
  selectedProvider: ModelProvider;
}

export * from './types/book';
