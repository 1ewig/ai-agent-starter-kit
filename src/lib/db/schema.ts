import Dexie, { type EntityTable } from 'dexie';
import type {
  ExecutedToolCall,
  AgentExecutionStep,
  MessageRole,
} from '@/agent/types';

export type ChatMessageStatus = 'success' | 'error' | 'pending';

export interface ConversationRecord {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
}

export interface ChatMessageRecord {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  status?: ChatMessageStatus;
  followUpQuestions?: string[];
  toolCalls?: ExecutedToolCall[];
  steps?: AgentExecutionStep[];
  stepCount?: number;
  workedDurationMs?: number;
  timestamp: number;
}

export const MAX_MESSAGES_PER_CONVERSATION = 100;
export const DEFAULT_CONVERSATION_ID = 'default';
export const DEFAULT_CONVERSATION_TITLE = 'New Chat';

const CONVERSATION_INDEX = 'id, createdAt, updatedAt';
const MESSAGE_INDEX = 'id, conversationId, timestamp, role, status';

export class SterlingDatabase extends Dexie {
  conversations!: EntityTable<ConversationRecord, 'id'>;
  messages!: EntityTable<ChatMessageRecord, 'id'>;

  constructor() {
    super('SterlingDatabase');

    this.version(1).stores({
      messages: 'id, timestamp, role',
    });

    this.version(2).stores({
      conversations: CONVERSATION_INDEX,
      messages: MESSAGE_INDEX,
    }).upgrade(async (tx) => {
      const messagesTable = tx.table('messages');
      await messagesTable.toCollection().modify((msg) => {
        if (!msg.conversationId) {
          msg.conversationId = DEFAULT_CONVERSATION_ID;
        }
        if (!msg.status) {
          msg.status = 'success';
        }
      });
    });

    this.version(3).stores({
      conversations: CONVERSATION_INDEX,
      messages: MESSAGE_INDEX,
    });
  }
}

export const db = new SterlingDatabase();
