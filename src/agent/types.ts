import { z } from 'zod';
import type { InferenceProviderType } from './providers/config';

export type MessageRole = 'user' | 'assistant';

export type { InferenceProviderType };

/**
 * Chat history message for multi-turn conversational context
 */
export const HistoryMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

export type HistoryMessage = z.infer<typeof HistoryMessageSchema>;

/**
 * Token usage telemetry for an execution step or complete conversation run
 */
export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  reasoningTokens?: number;
}

/**
 * Telemetry record for an executed tool call within the agent reasoning loop
 */
export interface ExecutedToolCall {
  toolName: string;
  args: Record<string, unknown>;
  result: unknown;
}

/**
 * Step type for the real-time reasoning and tool execution process
 */
export type AgentStepType = 'thinking' | 'tool' | 'intermediate_text';

/**
 * An individual lifecycle step in the agent's real-time reasoning timeline
 */
export interface AgentExecutionStep {
  id: string;
  type: AgentStepType;
  label: string;
  toolName?: string;
  reasoningText?: string;
  intermediateText?: string;
  status: 'active' | 'completed' | 'error';
  timestamp: number;
  durationMs?: number;
  toolArgs?: Record<string, unknown>;
  toolResult?: unknown;
  usage?: TokenUsage;
}

/**
 * Real-time SSE streaming events emitted during agent execution
 */
export type AgentStreamEvent =
  | { type: 'step_start'; step: AgentExecutionStep }
  | {
      type: 'step_update';
      stepId: string;
      status?: 'completed' | 'error';
      durationMs?: number;
      label?: string;
      reasoningText?: string;
      intermediateText?: string;
      toolArgs?: Record<string, unknown>;
      toolResult?: unknown;
      usage?: TokenUsage;
    }
  | { type: 'reasoning_delta'; stepId: string; delta: string }
  | { type: 'text_delta'; delta: string }
  | { type: 'clear_text' }
  | { type: 'session_title'; title: string }
  | { type: 'done'; result: AgentResult }
  | { type: 'error'; message: string };

/**
 * Invocation options for the agent execution engine
 */
export interface AgentOptions {
  prompt: string;
  symbol?: string;
  provider?: InferenceProviderType;
  modelName?: string;
  backupModelName?: string;
  apiKey?: string;
  history?: HistoryMessage[];
  maxSteps?: number;
  maxTokens?: number;
  isFirstTurn?: boolean;
  systemDirective?: string;
  abortSignal?: AbortSignal;
}

/**
 * Structured result returned by the agent execution engine
 */
export interface AgentResult {
  symbol?: string;
  sessionTitle?: string;
  analysis: string;
  followUpQuestions?: string[];
  toolCalls: ExecutedToolCall[];
  steps: AgentExecutionStep[];
  stepCount: number;
  workedDurationMs?: number;
  timestamp: number;
  usage?: TokenUsage;
  billedUsage?: TokenUsage;
}

/**
 * Zod schema for runtime validation of incoming HTTP chat requests to the agent
 */
export const AgentChatRequestSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  symbol: z.string().optional(),
  apiKey: z.string().optional(),
  history: z.array(HistoryMessageSchema).optional(),
  isFirstTurn: z.boolean().optional(),
});

export type AgentChatRequest = z.infer<typeof AgentChatRequestSchema>;

/**
 * News Briefing Intelligence Payload
 */
export interface NewsBriefingItem {
  id?: string;
  title: string;
  url: string;
  publishedDate?: string;
  sourceDomain?: string;
  summary?: string;
  highlights?: string[];
}

export interface NewsBriefingData {
  success: boolean;
  source: string;
  topic: string;
  totalResults: number;
  headlines: NewsBriefingItem[];
  summary: string;
  warning?: string;
  actionableGuidance?: string;
}

/**
 * Zod schemas for tool parameters
 */
export const newsBriefingParamsSchema = z.object({
  symbol: z.string().optional().describe('Asset or ticker to scope news (e.g. BTC, ETH, SOL, NVDA)'),
  topic: z.string().default('market news').describe('News topic, catalyst, or theme (e.g. "ETF inflows", "Fed rate cut", "regulation")'),
  limit: z.number().min(2).max(8).default(4).describe('Number of top headlines to retrieve (default 4)'),
});
