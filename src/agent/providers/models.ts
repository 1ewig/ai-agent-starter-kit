import { createFireworks } from '@ai-sdk/fireworks';
import { createGroq } from '@ai-sdk/groq';
import { wrapLanguageModel, extractReasoningMiddleware } from 'ai';
import {
  type InferenceProviderType,
  DEFAULT_FIREWORKS_MODEL,
  DEFAULT_GROQ_MODEL,
} from './config';

/**
 * Resolves the active inference provider from override or environment variables
 */
export function getActiveInferenceProvider(override?: InferenceProviderType): InferenceProviderType {
  if (override) return override;
  const envProvider = process.env.INFERENCE_PROVIDER?.toLowerCase();
  return envProvider === 'groq' ? 'groq' : 'fireworks';
}

/**
 * Wraps models with reasoning extraction middleware to capture thinking deltas
 */
export function wrapModelWithThinking<T extends Parameters<typeof wrapLanguageModel>[0]['model']>(model: T) {
  return wrapLanguageModel({
    model,
    middleware: extractReasoningMiddleware({ tagName: 'think' }),
  });
}

/**
 * Returns a configured model instance for the specified or active provider
 */
export function getAgentModel(
  providerOverride?: InferenceProviderType,
  apiKey?: string,
  modelName?: string
) {
  const provider = getActiveInferenceProvider(providerOverride);

  if (provider === 'groq') {
    const key = apiKey ?? process.env.GROQ_API_KEY;
    if (!key) throw new Error('GROQ_API_KEY is not configured in .env.local');
    const groq = createGroq({ apiKey: key });
    return wrapModelWithThinking(groq(modelName ?? process.env.GROQ_MODEL ?? DEFAULT_GROQ_MODEL));
  }

  const key = apiKey ?? process.env.FIREWORKS_API_KEY;
  if (!key) throw new Error('FIREWORKS_API_KEY is not configured in .env.local');
  const fireworks = createFireworks({ apiKey: key });
  return wrapModelWithThinking(fireworks(modelName ?? process.env.FIREWORKS_MODEL ?? DEFAULT_FIREWORKS_MODEL));
}

/**
 * Returns a backup model instance on the alternative provider if available
 */
export function getBackupAgentModel(primaryProviderOverride?: InferenceProviderType) {
  const primaryProvider = getActiveInferenceProvider(primaryProviderOverride);
  const backupProvider: InferenceProviderType = primaryProvider === 'fireworks' ? 'groq' : 'fireworks';

  if (backupProvider === 'groq') {
    const key = process.env.GROQ_API_KEY;
    if (!key) return undefined;
    const groq = createGroq({ apiKey: key });
    return wrapModelWithThinking(groq(process.env.GROQ_MODEL ?? DEFAULT_GROQ_MODEL));
  }

  const key = process.env.FIREWORKS_API_KEY;
  if (!key) return undefined;
  const fireworks = createFireworks({ apiKey: key });
  return wrapModelWithThinking(fireworks(process.env.FIREWORKS_MODEL ?? DEFAULT_FIREWORKS_MODEL));
}


