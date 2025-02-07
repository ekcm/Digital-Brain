import { create } from 'zustand'

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

      // Make API request to backend
      fetch('http://0.0.0.0:8000/v1/query', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          set({
            messages: [
              ...newMessages,
              { text: JSON.stringify(data, null, 2), type: 'assistant' as const },
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
