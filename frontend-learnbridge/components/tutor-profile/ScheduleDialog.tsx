import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tutor, ScheduleFormData } from '@/interfaces/tutor-profile.interfaces';

interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tutor: Tutor;
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
  tutor,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Session with {tutor.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="subject">Subject *</Label>
            <Select 
              value={formData.subject} 
              onValueChange={(value) => onFormChange({...formData, subject: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {tutor.subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sessionDate">Date *</Label>
              <Input
                id="sessionDate"
                type="date"
                value={formData.sessionDate}
                onChange={(e) => onFormChange({...formData, sessionDate: e.target.value})}
                min={getMinDate()}
              />
            </div>
            <div>
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => onFormChange({...formData, time: e.target.value})}
                min={getMinTime()}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration (minutes) *</Label>
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
              />
              <p className="text-xs text-muted-foreground mt-1">
                {(parseInt(formData.duration) / 60).toFixed(1)} hours
              </p>
            </div>
            <div>
              <Label htmlFor="price">Total Price (₱) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                readOnly
                className="bg-muted cursor-not-allowed"
                placeholder="Auto-calculated"
              />
              <p className="text-xs text-muted-foreground mt-1">
                ₱{tutor.hourlyRate}/hour × {(parseInt(formData.duration) / 60).toFixed(1)} hours
              </p>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-blue-900">Cost Breakdown:</span>
            </div>
            <div className="space-y-1 text-sm text-blue-800">
              <div className="flex justify-between">
                <span>Hourly Rate:</span>
                <span>₱{tutor.hourlyRate}/hour</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>{formData.duration} minutes ({(parseInt(formData.duration) / 60).toFixed(1)} hours)</span>
              </div>
              <div className="flex justify-between font-bold border-t border-blue-200 pt-1 mt-1">
                <span>Total Cost:</span>
                <span className="text-lg">₱{formData.price}</span>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="comment">Additional Comments</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => onFormChange({...formData, comment: e.target.value})}
              placeholder="Any specific topics you want to cover, learning goals, or special requirements..."
              rows={3}
            />
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={loading}>
            {loading ? "Sending Request..." : "Send Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};