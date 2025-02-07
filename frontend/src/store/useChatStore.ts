import { create } from 'zustand'

export interface Message {
  text: string
  type: 'user' | 'assistant'
}

interface ChatStore {
  messages: Message[]
  addMessage: (message: Message) => void
  clearMessages: () => void
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
}))
