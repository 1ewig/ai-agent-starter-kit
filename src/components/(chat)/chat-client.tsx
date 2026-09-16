'use client';

import React, { useMemo, memo } from 'react';
import { useAgentChat } from '@/hooks';
import { ChatEmptyState, ChatInput, type QuickActionItem } from './input';
import { ChatMessageList } from './messages';

const DEFAULT_QUICK_ACTIONS: QuickActionItem[] = [
  { id: 'etf-flows', label: 'Crypto ETF Flows', template: 'Provide a comprehensive research briefing on recent Bitcoin and Ethereum ETF inflows and institutional demand.' },
  { id: 'macro-outlook', label: 'Macro & Fed Policy', template: 'Synthesize the latest macroeconomic outlook, Federal Reserve interest rate policy, and global liquidity trends.' },
  { id: 'tech-ai-narrative', label: 'AI & Tech Catalysts', template: 'What are the major breaking market catalysts and technological developments shaping tech equities and digital assets this week?' },
];

/**
 * Dedicated Chat Stage Client Orchestrator
 */
export const ChatClient = memo(function ChatClient() {
  const {
    messages,
    isMessagesLoading,
    activeStreamMessage,
    isLoading,
    errorNotice,
    messagesEndRef,
    scrollContainerRef,
    handleScroll,
    handleSend,
    handleStop,
  } = useAgentChat();

  const isChatEmpty = !isMessagesLoading && messages.length === 0 && !activeStreamMessage;

  const lastAssistantMessageId = useMemo(() => {
    if (activeStreamMessage) return null;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant' && messages[i].status === 'success') {
        return messages[i].id;
      }
    }
    return null;
  }, [messages, activeStreamMessage]);

  return (
    <div className="relative flex-1 min-h-0 min-w-0 flex flex-col overflow-hidden">
      {isChatEmpty && (
        <ChatEmptyState
          isLoading={isLoading}
          onSend={handleSend}
          onStop={handleStop}
          quickActions={DEFAULT_QUICK_ACTIONS}
        />
      )}

      <ChatMessageList
        messages={messages}
        activeStreamMessage={activeStreamMessage}
        isLoading={isLoading}
        errorNotice={errorNotice}
        lastAssistantMessageId={lastAssistantMessageId}
        isChatEmpty={isChatEmpty}
        scrollContainerRef={scrollContainerRef}
        messagesEndRef={messagesEndRef}
        onScroll={handleScroll}
        onSend={handleSend}
      />

      {!isChatEmpty && (
        <div className="relative z-20 w-full bg-gradient-to-t from-theme-bg-base via-theme-bg-base/95 to-transparent pb-[calc(env(safe-area-inset-bottom,0px)+0.5rem)] sm:pb-spacing-md px-spacing-md sm:px-spacing-lg shrink-0">
          <ChatInput
            isLoading={isLoading}
            onSend={handleSend}
            onStop={handleStop}
            className="max-w-4xl"
            containerClassName="w-full p-0 bg-transparent"
          />
        </div>
      )}
    </div>
  );
});
