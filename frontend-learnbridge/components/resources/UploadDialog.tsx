import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useResourceUpload } from '@/hooks/useResourceUpload';
import { useToast } from '@/hooks/use-toast';

interface UploadDialogProps {
  onResourceUploaded: (resource: any) => void;
  trigger?: React.ReactNode;
}

export const UploadDialog = ({ onResourceUploaded, trigger }: UploadDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [program, setProgram] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const { uploadResource, uploading } = useResourceUpload();
  const { toast } = useToast();

  const handleOpen = () => {
    toast({
      title: "Upload Resource",
      description: "Fill in the details to share your resource",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !program || !file) {
      toast({
        title: "Missing information",
        description: "Please complete all fields.",
        variant: "destructive"
      });
      return;
    }

    const resource = await uploadResource({ title, program, file });
    
    if (resource) {
      onResourceUploaded(resource);
      setIsOpen(false);
      setTitle('');
      setProgram('');
      setFile(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2 w-full sm:w-auto" onClick={handleOpen} size="sm">
            <Upload className="h-4 w-4" /> 
            <span className="hidden sm:inline">Upload Resource</span>
            <span className="sm:hidden">Upload</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Upload a New Resource</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm sm:text-base">Title</Label>
            <Input
              id="title"
              placeholder="Enter resource title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="text-sm sm:text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="program" className="text-sm sm:text-base">Program/Course</Label>
            <Input
              id="program"
              placeholder="Enter related program/course"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              required
              className="text-sm sm:text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file" className="text-sm sm:text-base">Upload File</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.ppt,.pptx,.jpeg,.jpg,.png,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
              className="text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Supported formats: PDF, PPT, JPEG, PNG, DOC
            </p>
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={uploading} className="w-full text-sm sm:text-base">
              {uploading ? "Uploading..." : "Upload Resource"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};