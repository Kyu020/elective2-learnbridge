// hooks/forms/useResourceForm.ts - UPDATED VERSION
import { useState } from 'react'
import { UploadResourceData, Resource } from '@/interfaces/resource.interface'
import { useToast } from '../ui/use-toast'
import { resourcesService } from '@/services/resources.service'

export const useResourceForm = () => {
  const [formData, setFormData] = useState<UploadResourceData>({
    title: '',
    course: '',
    file: null as any,
  })
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const handleChange = (field: keyof UploadResourceData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const upload = async (uploadData: UploadResourceData): Promise<Resource | null> => {
    try {
      if (!uploadData.title.trim() || !uploadData.course.trim() || !uploadData.file) {
        toast({
          title: "Missing fields",
          description: "Please fill in all required fields",
          variant: "destructive"
        })
        return null
      }

      setUploading(true)
      const resource = await resourcesService.uploadResource(uploadData)
      
      toast({
        title: "Success! 🎉",
        description: "Resource uploaded successfully!"
      })
      
      return resource
    } catch (err: any) {
      toast({
        title: "Upload failed",
        description: err.message || "An error occurred",
        variant: "destructive"
      })
      return null
    } finally {
      setUploading(false)
    }
  }

  const reset = () => {
    setFormData({ title: '', course: '', file: null as any })
    setUploading(false)
  }

  return {
    formData,
    uploading,
    handleChange,
    upload, // Make sure this is exported
    reset,
  }
}