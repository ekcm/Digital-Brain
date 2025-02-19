import { useState, useRef } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { RotateCw } from 'lucide-react';

import { config } from '@/config/env'
import { useFilesStore } from '@/store/useFilesStore'

export function AddSourceButton() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { fetchFiles } = useFilesStore()

  async function addSource() {
    try {
      if (!selectedFile) {
        toast.error('Please select a PDF file')
        return
      }

      if (selectedFile.type !== 'application/pdf') {
        toast.error('Please upload a PDF file')
        return
      }

      setIsLoading(true)
      // Create FormData and append the file
      const formData = new FormData()
      formData.append('file', selectedFile)

      console.log(config.apiUrl + '/sources')

      try {
        const response = await fetch(config.apiUrl + '/sources', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Upload failed with status: ${response.status}`)
        }

        toast.success(`File "${selectedFile.name}" uploaded successfully`)
        setSelectedFile(null)
        // Refresh the files list
        await fetchFiles()
      } catch (error) {
        console.error('Upload error:', error)
        toast.error(`Failed to upload file`)
        return
      } finally {
        setIsLoading(false)
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      toast.error('Failed to upload file')
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className={`rounded-lg bg-gradient-peach h-16 w-full text-neutral-0 flex gap-2 items-center justify-center ${
            isLoading ? 'cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <RotateCw className="animate-spin h-5 w-5 text-neutral-0" />
          ) : (
            <Plus className="text-neutral-0" />
          )}
          {isLoading ? 'Uploading...' : 'Add Source'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Upload PDF Source</AlertDialogTitle>
          <AlertDialogDescription>
            Choose a PDF file to add as a source to your digital brain.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid w-full max-w-sm items-center gap-1.5 py-4">
          <input
            type="file"
            accept=".pdf"
            className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-gray-900 file:border-0 file:bg-transparent file:text-gray-900 file:text-sm file:font-medium"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          {selectedFile && (
            <p className="text-sm text-muted-foreground">
              Selected: {selectedFile.name}
            </p>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setSelectedFile(null)
              if (fileInputRef.current) {
                fileInputRef.current.value = ''
              }
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={addSource}
            className={
              !selectedFile || isLoading
                ? 'neutral-100 cursor-not-allowed'
                : 'bg-gradient-peach hover:bg-gradient-peach/90'
            }
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? 'Uploading...' : 'Upload PDF'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
