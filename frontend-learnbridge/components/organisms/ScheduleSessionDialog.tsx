// components/organisms/ScheduleSessionDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tutor } from "@/interfaces/tutor.interface";
import { ScheduleFormData } from "@/interfaces/booking.interface";

interface ScheduleSessionDialogProps {
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

export const ScheduleSessionDialog = ({
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
}: ScheduleSessionDialogProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  if (!selectedTutor) return null;

  const tutorSubjects = selectedTutor.course || [];
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
          <div>
            <Label htmlFor="course" className="text-sm sm:text-base">Course *</Label>
            {hasSubjects ? (
              <Select 
                value={formData.course} 
                onValueChange={(value) => onFormChange({...formData, course: value})}
                required
              >
                <SelectTrigger className="text-sm sm:text-base">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {tutorSubjects.map((course: string) => (
                    <SelectItem key={course} value={course} className="text-sm sm:text-base">
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                value={formData.course}
                onChange={(e) => onFormChange({...formData, course: e.target.value})}
                placeholder="Enter course/topic"
                required
                className="text-sm sm:text-base"
              />
            )}
            {!hasSubjects && (
              <p className="text-xs text-muted-foreground mt-1">
                Tutor hasn't specified courses. Please enter the course you want to learn.
              </p>
            )}
          </div>

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

