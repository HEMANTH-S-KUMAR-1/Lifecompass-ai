// OpenRouter AI Model Configuration
export interface OpenRouterConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  rateLimit: number;
  timeout: number;
  appName: string;
  appUrl: string;
}

export interface ModelResponse {
  content: string;
  model: string;
  tokens?: number;
  responseTime?: number;
}

export enum ModelType {
  STRUCTURED = 'structured', // DeepSeek R1 - for detailed analysis
  CONVERSATIONAL = 'conversational', // DeepSeek V3.1 - for smooth interactions
  QUICK = 'quick' // DeepSeek R1 Qwen3 8B - for fast responses
}

export enum QueryType {
  CAREER_GUIDANCE = 'career_guidance',
  ROADMAP = 'roadmap',
  RESUME_COACHING = 'resume_coaching',
  SKILL_ANALYSIS = 'skill_analysis',
  INTERVIEW_PREP = 'interview_prep',
  CASUAL_CHAT = 'casual_chat',
  QUICK_SUMMARY = 'quick_summary',
  CLARIFICATION = 'clarification'
}

export class OpenRouterModelConfig {
  private static instance: OpenRouterModelConfig;
  
  private readonly configs: Record<ModelType, OpenRouterConfig> = {
    [ModelType.STRUCTURED]: {
      apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
      baseUrl: import.meta.env.VITE_OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
      model: import.meta.env.VITE_DEEPSEEK_R1_MODEL || 'deepseek/deepseek-r1',
      rateLimit: parseInt(import.meta.env.VITE_R1_RATE_LIMIT || '20'),
      timeout: parseInt(import.meta.env.VITE_R1_TIMEOUT || '30000'),
      appName: import.meta.env.VITE_APP_NAME || 'LifeCompass-AI',
      appUrl: import.meta.env.VITE_APP_URL || 'http://localhost:5173'
    },
    [ModelType.CONVERSATIONAL]: {
      apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
      baseUrl: import.meta.env.VITE_OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
      model: import.meta.env.VITE_DEEPSEEK_V3_MODEL || 'deepseek/deepseek-v3',
      rateLimit: parseInt(import.meta.env.VITE_V3_RATE_LIMIT || '60'),
      timeout: parseInt(import.meta.env.VITE_V3_TIMEOUT || '15000'),
      appName: import.meta.env.VITE_APP_NAME || 'LifeCompass-AI',
      appUrl: import.meta.env.VITE_APP_URL || 'http://localhost:5173'
    },
    [ModelType.QUICK]: {
      apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
      baseUrl: import.meta.env.VITE_OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
      model: import.meta.env.VITE_DEEPSEEK_QWEN_MODEL || 'qwen/qwen-2.5-72b-instruct',
      rateLimit: parseInt(import.meta.env.VITE_QWEN_RATE_LIMIT || '100'),
      timeout: parseInt(import.meta.env.VITE_QWEN_TIMEOUT || '10000'),
      appName: import.meta.env.VITE_APP_NAME || 'LifeCompass-AI',
      appUrl: import.meta.env.VITE_APP_URL || 'http://localhost:5173'
    }
  };

  private constructor() {}

  public static getInstance(): OpenRouterModelConfig {
    if (!OpenRouterModelConfig.instance) {
      OpenRouterModelConfig.instance = new OpenRouterModelConfig();
    }
    return OpenRouterModelConfig.instance;
  }

  public getConfig(modelType: ModelType): OpenRouterConfig {
    return this.configs[modelType];
  }

  public selectModelForQuery(queryType: QueryType, messageLength?: number): ModelType {
    // Optimized for speed - prioritize faster models
    switch (queryType) {
      case QueryType.QUICK_SUMMARY:
      case QueryType.CLARIFICATION:
        return ModelType.QUICK; // Use Qwen for ultra-fast responses

      case QueryType.CASUAL_CHAT:
        return ModelType.CONVERSATIONAL; // Use V3 for smooth conversation

      case QueryType.CAREER_GUIDANCE:
      case QueryType.ROADMAP:
      case QueryType.SKILL_ANALYSIS:
      case QueryType.RESUME_COACHING:
      case QueryType.INTERVIEW_PREP:
        // For complex queries, still use structured but with shorter fallback
        return messageLength && messageLength < 100 ? ModelType.CONVERSATIONAL : ModelType.STRUCTURED;

      default:
        // Optimized fallback - prioritize speed
        if (messageLength && messageLength < 30) {
          return ModelType.QUICK; // Very short queries = instant response
        } else if (messageLength && messageLength < 150) {
          return ModelType.CONVERSATIONAL; // Medium queries = fast response
        }
        return ModelType.STRUCTURED; // Long queries = detailed response
    }
  }

  public getFallbackOrder(primaryModel: ModelType): ModelType[] {
    // Optimized fallback order - always prioritize speed
    switch (primaryModel) {
      case ModelType.STRUCTURED:
        return [ModelType.QUICK, ModelType.CONVERSATIONAL]; // Try fastest first
      case ModelType.CONVERSATIONAL:
        return [ModelType.QUICK, ModelType.STRUCTURED]; // Try fastest first
      case ModelType.QUICK:
        return [ModelType.CONVERSATIONAL, ModelType.STRUCTURED]; // Quick model failed, try others
      default:
        return [ModelType.QUICK, ModelType.CONVERSATIONAL]; // Always prioritize speed
    }
  }

  public isConfigured(): boolean {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    return !!(apiKey && apiKey !== 'your_openrouter_api_key_here');
  }

  public getDebugMode(): boolean {
    return import.meta.env.VITE_DEBUG_MODE === 'true';
  }

  public isModelSwitchingEnabled(): boolean {
    return import.meta.env.VITE_ENABLE_MODEL_SWITCHING !== 'false';
  }
}

export default OpenRouterModelConfig;