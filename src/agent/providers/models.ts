import { createFireworks } from '@ai-sdk/fireworks';
import { createOpenAI } from '@ai-sdk/openai';
import { wrapLanguageModel, extractReasoningMiddleware } from 'ai';
import {
  type InferenceProviderType,
  DEFAULT_FIREWORKS_MODEL,
  DEFAULT_FIREWORKS_BACKUP_MODEL,
} from './config';

const ERR_MISSING_FIREWORKS_KEY =
  'FIREWORKS_API_KEY environment variable is not configured. Please set your Fireworks API key in .env.local.';
const ERR_MISSING_OPENAI_KEY =
  'OPENAI_API_KEY environment variable is not configured. Please set your OpenAI API key in .env.local.';

/**
 * Resolves the active inference provider from options or environment variables
 */
export function getActiveInferenceProvider(override?: InferenceProviderType): InferenceProviderType {
  if (override) return override;
  const envProvider = process.env.INFERENCE_PROVIDER?.toLowerCase();
  if (envProvider === 'openai') return 'openai';
  return 'fireworks';
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
 * Returns a configured model instance for agent reasoning and tool dispatch
 */
export function getAgentModel(
  modelName?: string,
  apiKey?: string,
  providerOverride?: InferenceProviderType
) {
  const provider = getActiveInferenceProvider(providerOverride);

  if (provider === 'openai') {
    const resolvedApiKey = apiKey ?? process.env.OPENAI_API_KEY;
    if (!resolvedApiKey) {
      throw new Error(ERR_MISSING_OPENAI_KEY);
    }
    const openai = createOpenAI({ apiKey: resolvedApiKey });
    const selectedModel = modelName ?? process.env.OPENAI_MODEL ?? 'gpt-4o';
    return wrapModelWithThinking(openai(selectedModel));
  }

  // Default to Fireworks
  const resolvedApiKey = apiKey ?? process.env.FIREWORKS_API_KEY;
  if (!resolvedApiKey) {
    throw new Error(ERR_MISSING_FIREWORKS_KEY);
  }
  const fireworks = createFireworks({ apiKey: resolvedApiKey });
  const selectedModel = modelName ?? process.env.FIREWORKS_MODEL ?? DEFAULT_FIREWORKS_MODEL;
  return wrapModelWithThinking(fireworks(selectedModel));
}

/**
 * Returns the configured backup model instance for automatic failover
 */
export function getBackupAgentModel(
  backupModelName?: string,
  apiKey?: string,
  backupProviderOverride?: InferenceProviderType
) {
  const backupProvider = backupProviderOverride ?? getActiveInferenceProvider();

  if (backupProvider === 'openai') {
    const resolvedApiKey = apiKey ?? process.env.OPENAI_API_KEY;
    if (!resolvedApiKey) return undefined;
    const openai = createOpenAI({ apiKey: resolvedApiKey });
    const selectedModel = backupModelName ?? process.env.OPENAI_BACKUP_MODEL ?? 'gpt-4o-mini';
    return wrapModelWithThinking(openai(selectedModel));
  }

  // Fireworks backup
  const resolvedApiKey = apiKey ?? process.env.FIREWORKS_API_KEY;
  if (!resolvedApiKey) return undefined;
  const fireworks = createFireworks({ apiKey: resolvedApiKey });
  const selectedModel = backupModelName ?? process.env.FIREWORKS_BACKUP_MODEL ?? DEFAULT_FIREWORKS_BACKUP_MODEL;
  return wrapModelWithThinking(fireworks(selectedModel));
}
