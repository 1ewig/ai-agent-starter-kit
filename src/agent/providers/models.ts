import { createFireworks } from '@ai-sdk/fireworks';
import { createOpenAI } from '@ai-sdk/openai';
import { wrapLanguageModel, extractReasoningMiddleware } from 'ai';
import {
  type InferenceProviderType,
  DEFAULT_FIREWORKS_MODEL,
  DEFAULT_OPENAI_MODEL,
} from './config';

/**
 * Resolves the active inference provider from override or environment variables
 */
export function getActiveInferenceProvider(override?: InferenceProviderType): InferenceProviderType {
  if (override) return override;
  const envProvider = process.env.INFERENCE_PROVIDER?.toLowerCase();
  return envProvider === 'openai' ? 'openai' : 'fireworks';
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

  if (provider === 'openai') {
    const key = apiKey ?? process.env.OPENAI_API_KEY;
    if (!key) throw new Error('OPENAI_API_KEY is not configured in .env.local');
    const openai = createOpenAI({ apiKey: key });
    return wrapModelWithThinking(openai(modelName ?? process.env.OPENAI_MODEL ?? DEFAULT_OPENAI_MODEL));
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
  const backupProvider: InferenceProviderType = primaryProvider === 'fireworks' ? 'openai' : 'fireworks';

  if (backupProvider === 'openai') {
    const key = process.env.OPENAI_API_KEY;
    if (!key) return undefined;
    const openai = createOpenAI({ apiKey: key });
    return wrapModelWithThinking(openai(process.env.OPENAI_MODEL ?? DEFAULT_OPENAI_MODEL));
  }

  const key = process.env.FIREWORKS_API_KEY;
  if (!key) return undefined;
  const fireworks = createFireworks({ apiKey: key });
  return wrapModelWithThinking(fireworks(process.env.FIREWORKS_MODEL ?? DEFAULT_FIREWORKS_MODEL));
}
