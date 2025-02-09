import { create } from 'zustand'
import { config } from '@/config/env'

export interface Message {
  text: string
  type: 'user' | 'assistant'
}

interface ChatStore {
  messages: Message[]
  isLoading: boolean
  addMessage: (message: Message) => void
  sendMessage: (text: string) => void
  clearMessages: () => void
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isLoading: false,
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  sendMessage: (text) =>
    set((state) => {
      // Add user message immediately
      const newMessages = [...state.messages, { text, type: 'user' as const }]

      // Set loading state
      set({ messages: newMessages, isLoading: true })

      console.log(config.apiUrl + '/query')

      // Make API request to backend
      fetch(config.apiUrl + '/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          set({
            messages: [
              ...newMessages,
              { text: data.response || data.message || JSON.stringify(data), type: 'assistant' as const },
            ],
            isLoading: false,
          })
        })
        .catch((error) => {
          set({
            messages: [
              ...newMessages,
              { text: `Error: ${error.message}`, type: 'assistant' as const },
            ],
            isLoading: false,
          })
        })

      return { messages: newMessages }
    }),
  clearMessages: () => set({ messages: [] }),
}))
