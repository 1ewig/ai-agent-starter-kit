import React from 'react';
import type { Metadata } from 'next';
import { ChatPageClient } from '@/components/chat-page.client';

export const metadata: Metadata = {
  title: 'Research Workspace',
  description:
    'Intelligent AI chat workspace featuring real-time reasoning timelines, deep neural web search, and multi-session persistence.',
  alternates: {
    canonical: '/chat',
  },
};

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Sterling AI Assistant',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description:
    'Intelligent AI Agent and Deep Research Assistant with real-time neural web search and multi-turn reasoning.',
  featureList: [
    'Real-time Multi-step Reasoning Timeline',
    'Exa AI Neural Web Search & Research',
    'Real-time News Briefings and Catalyst Tracking',
    'Persistent Multi-session IndexedDB Workspace',
    'Sleek Dark/Light Adaptive Design System',
  ],
};

export default function ChatPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <main className="flex-1 min-h-0 w-full flex flex-col overflow-hidden bg-theme-bg-base">
        <ChatPageClient />
      </main>
    </>
  );
}
