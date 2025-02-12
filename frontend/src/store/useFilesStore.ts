import { create } from 'zustand'
import { config } from '@/config/env'

interface File {
  key: string
  filename: string
  size: number
  lastModified: string
  url: string
}

interface FilesResponse {
  files: File[]
  total: number
}

interface FilesStore {
  files: File[]
  isLoading: boolean
  fetchFiles: () => Promise<void>
}

export const useFilesStore = create<FilesStore>((set) => ({
  files: [],
  isLoading: false,
  fetchFiles: async () => {
    set({ isLoading: true })
    try {
      const response = await fetch(`${config.apiUrl}/storage/`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: FilesResponse = await response.json()
      set({ files: data.files, isLoading: false })
    } catch (error) {
      console.error('Failed to fetch files:', error)
      set({ files: [], isLoading: false })
    }
  },
}))
