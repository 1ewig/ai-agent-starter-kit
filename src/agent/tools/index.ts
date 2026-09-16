import { webSearchTool } from './web-search';

/**
 * Registry of active agent tools (Real-time Neural Web Search & Research via Exa AI).
 */
export const agentTools = {
  web_search: webSearchTool,
};

export type AgentTools = typeof agentTools;

/**
 * Returns the tools dictionary for the AI SDK stream runner.
 */
export function getAgentTools(): AgentTools {
  return agentTools;
}

export {
  webSearchTool,
};
