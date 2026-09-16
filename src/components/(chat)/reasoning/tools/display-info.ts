import {
  Globe,
  Sparkles,
} from 'lucide-react';
import type { ToolDisplayInfo } from './types';

/**
 * Derives natural, humanized tool titles and contextual icons using tool arguments.
 */
export function getToolDisplayInfo(
  toolName?: string,
  toolArgs?: Record<string, unknown>
): ToolDisplayInfo {
  const normalizedName = toolName ?? '';
  const query = typeof toolArgs?.query === 'string' ? toolArgs.query : undefined;

  switch (normalizedName) {
    case 'web_search':
      return {
        title: query ? `Searching web for "${query}"` : 'Searching the web',
        icon: Globe,
      };

    default:
      return {
        title: normalizedName ? normalizedName.replace(/_/g, ' ') : 'tool',
        icon: Sparkles,
      };
  }
}
