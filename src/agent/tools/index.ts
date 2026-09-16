import { webSearchTool } from './web-search';
import { newsBriefingTool } from './news-briefing';

/**
 * Registry of active agent tools (Web Search & Real-time News Briefing via Exa AI).
 */
export const agentTools = {
  web_search: webSearchTool,
  news_briefing: newsBriefingTool,
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
  newsBriefingTool,
};
