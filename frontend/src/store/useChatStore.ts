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

      // Simulate API delay
      setTimeout(() => {
        set({
          messages: [
            ...newMessages,
            { text: 'This is the output message', type: 'assistant' as const },
          ],
          isLoading: false,
        })
      }, 3000)

      return { messages: newMessages }
    }),
  clearMessages: () => set({ messages: [] }),
}))
