// components/tutors/ScheduleDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tutor, ScheduleFormData } from '@/interfaces/tutors.interfaces';

interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTutor: Tutor | null;
  formData: ScheduleFormData;
  onFormChange: (data: ScheduleFormData) => void;
  onSubmit: () => void;
  loading: boolean;
  onCalculatePrice: (duration: string) => string;
  getMinDate: () => string;
  getMinTime: () => string;
}

export const ScheduleDialog = ({
  open,
  onOpenChange,
  selectedTutor,
  formData,
  onFormChange,
  onSubmit,
  loading,
  onCalculatePrice,
  getMinDate,
  getMinTime
}: ScheduleDialogProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  if (!selectedTutor) return null;

  // Get subjects from the course field (System A uses 'course', not 'subjects')
  const tutorSubjects = selectedTutor.course || [];
  
  // Handle the case where there are no subjects available
  const hasSubjects = tutorSubjects.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Schedule with {selectedTutor.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Subject Selection */}
          <div>
            <Label htmlFor="subject" className="text-sm sm:text-base">Subject *</Label>
            {hasSubjects ? (
              <Select 
                value={formData.subject} 
                onValueChange={(value) => onFormChange({...formData, subject: value})}
                required
              >
                <SelectTrigger className="text-sm sm:text-base">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {tutorSubjects.map((subject: string) => (
                    <SelectItem key={subject} value={subject} className="text-sm sm:text-base">
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                value={formData.subject}
                onChange={(e) => onFormChange({...formData, subject: e.target.value})}
                placeholder="Enter subject/topic"
                required
                className="text-sm sm:text-base"
              />
            )}
            {!hasSubjects && (
              <p className="text-xs text-muted-foreground mt-1">
                Tutor hasn't specified subjects. Please enter the topic you want to learn.
              </p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sessionDate" className="text-sm sm:text-base">Date *</Label>
              <Input
                id="sessionDate"
                type="date"
                value={formData.sessionDate}
                onChange={(e) => onFormChange({...formData, sessionDate: e.target.value})}
                min={getMinDate()}
                className="text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <Label htmlFor="time" className="text-sm sm:text-base">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => onFormChange({...formData, time: e.target.value})}
                min={getMinTime()}
                className="text-sm sm:text-base"
                required
              />
            </div>
          </div>

          {/* Duration and Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration" className="text-sm sm:text-base">Duration (minutes) *</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => {
                  const duration = e.target.value;
                  const calculatedPrice = onCalculatePrice(duration);
                  
                  onFormChange({
                    ...formData,
                    duration: duration,
                    price: calculatedPrice
                  });
                }}
                placeholder="60"
                min="1"
                className="text-sm sm:text-base"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                {(parseInt(formData.duration) || 60) / 60} hours
              </p>
            </div>
            <div>
              <Label htmlFor="price" className="text-sm sm:text-base">Total Price (₱) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                readOnly
                className="bg-muted cursor-not-allowed text-sm sm:text-base"
                placeholder="Auto-calculated"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                ₱{selectedTutor.hourlyRate}/hour × {((parseInt(formData.duration) || 60) / 60).toFixed(1)} hours
              </p>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-blue-900">Cost Breakdown:</span>
            </div>
            <div className="space-y-1 text-xs sm:text-sm text-blue-800">
              <div className="flex justify-between">
                <span>Hourly Rate:</span>
                <span>₱{selectedTutor.hourlyRate}/hour</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>{formData.duration} minutes ({((parseInt(formData.duration) || 60) / 60).toFixed(1)} hours)</span>
              </div>
              <div className="flex justify-between font-bold border-t border-blue-200 pt-1 mt-1">
                <span>Total Cost:</span>
                <span className="text-base sm:text-lg">₱{formData.price || "0.00"}</span>
              </div>
            </div>
          </div>

          {/* Additional Comments */}
          <div>
            <Label htmlFor="comment" className="text-sm sm:text-base">Additional Comments</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => onFormChange({...formData, comment: e.target.value})}
              placeholder="Any specific topics you want to cover..."
              rows={3}
              className="text-sm sm:text-base"
            />
          </div>

          {/* Dialog Footer */}
          <DialogFooter>
            <Button 
              type="button"
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="text-sm sm:text-base"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              onClick={onSubmit} 
              disabled={loading} 
              className="text-sm sm:text-base"
            >
              {loading ? "Sending Request..." : "Send Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};