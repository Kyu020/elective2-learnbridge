import { useState } from 'react'
import { useToast } from './use-toast'
import { resourcesService } from '@/services/resources.service'
import { Resource, UploadResourceData } from '@/interfaces/resource.interface'

interface UploadOptions<T> {
  uploadFn: (data: any) => Promise<T>
  onSuccess?: (result: T) => void
  onError?: (error: any) => void
  allowedTypes?: string[]
  maxSize?: number // in MB
}

export function useUpload<T>(options: UploadOptions<T>) {
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const upload = async (data: any, file?: File) => {
    // Validate file if provided
    if (file) {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      const allowedTypes = options.allowedTypes || ['.pdf', '.ppt', '.pptx', '.jpeg', '.jpg', '.png', '.doc', '.docx']
      
      if (!allowedTypes.includes(fileExtension || '')) {
        toast({
          title: "Invalid file type",
          description: `Allowed types: ${allowedTypes.join(', ')}`,
          variant: "destructive"
        })
        throw new Error('Invalid file type')
      }

      if (options.maxSize && file.size > options.maxSize * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `Maximum file size is ${options.maxSize}MB`,
          variant: "destructive"
        })
        throw new Error('File too large')
      }
    }

    try {
      setUploading(true)
      
      toast({
        title: "Uploading...",
        description: "Please wait while we process your file",
      })

      const result = await options.uploadFn(data)
      
      toast({
        title: "Success! 🎉",
        description: "Upload completed successfully!"
      })
      
      options.onSuccess?.(result)
      return result
    } catch (err: any) {
      const errorMessage = err.message || "An error occurred while uploading."
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive"
      })
      
      options.onError?.(err)
      throw err
    } finally {
      setUploading(false)
    }
  }

  const reset = () => {
    setUploading(false)
  }

  return {
    upload,
    uploading,
    reset,
  }
}

// Resource upload hook - FIXED: Now includes uploadFn
export const useResourceUpload = () => {
  const { upload, uploading, reset } = useUpload({
    uploadFn: (uploadData: UploadResourceData) => resourcesService.uploadResource(uploadData),
    allowedTypes: ['.pdf', '.ppt', '.pptx', '.jpeg', '.jpg', '.png', '.doc', '.docx'],
    maxSize: 10 // 10MB
  })
  
  return {
    uploadResource: upload,
    uploading,
    reset,
  }
}