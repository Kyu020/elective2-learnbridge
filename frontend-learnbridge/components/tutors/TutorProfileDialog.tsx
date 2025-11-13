// components/tutors/TutorProfileDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TutorFormData } from '@/interfaces/tutors.interfaces';

interface TutorProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  formData: TutorFormData;
  onFormChange: (data: TutorFormData) => void;
  onSubmit: () => void;
  loading: boolean;
  isEdit?: boolean;
}

export const TutorProfileDialog = ({
  open,
  onOpenChange,
  title,
  formData,
  onFormChange,
  onSubmit,
  loading,
  isEdit = false
}: TutorProfileDialogProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Bio *</Label>
            <Textarea
              value={formData.bio}
              onChange={(e) => onFormChange({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              required
              className="text-sm sm:text-base min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Subjects (comma separated) *</Label>
            <Input
              value={formData.subjects}
              onChange={(e) => onFormChange({ ...formData, subjects: e.target.value })}
              placeholder="e.g. Database, Web Development"
              required
              className="text-sm sm:text-base"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Hourly Rate (₱) *</Label>
            <Input
              type="number"
              value={formData.hourlyRate}
              onChange={(e) => onFormChange({ ...formData, hourlyRate: e.target.value })}
              placeholder="150"
              required
              className="text-sm sm:text-base"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Availability (comma separated)</Label>
            <Input
              value={formData.availability}
              onChange={(e) => onFormChange({ ...formData, availability: e.target.value })}
              placeholder="Monday 10AM-12PM, Wednesday 1PM-4PM"
              className="text-sm sm:text-base"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Credentials</Label>
            <Input
              value={formData.credentials}
              onChange={(e) => onFormChange({ ...formData, credentials: e.target.value })}
              placeholder="Portfolio, Achievements, etc."
              className="text-sm sm:text-base"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="text-sm sm:text-base">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="text-sm sm:text-base">
              {loading ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Update Profile" : "Create Profile")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};