import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type LeadStatus = Database['public']['Enums']['lead_status'];
type FormSubmission = Database['public']['Tables']['form_submissions']['Row'];

interface StatusUpdateDialogProps {
  submission: FormSubmission;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: () => void;
}

export const StatusUpdateDialog = ({ submission, isOpen, onClose, onStatusUpdate }: StatusUpdateDialogProps) => {
  const [newStatus, setNewStatus] = useState<string>(submission.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    try {
      const sessionToken = localStorage.getItem('adminSessionToken');
      if (!sessionToken) {
        throw new Error('No admin session found');
      }

      const updateData: any = { status: newStatus };
      
      // Update contacted_at for survey_booked status
      if (newStatus === 'survey_booked') {
        updateData.contacted_at = new Date().toISOString();
      }

      const { data, error } = await supabase.functions.invoke('update-admin-submission', {
        body: {
          session_token: sessionToken,
          submission_id: submission.id,
          updates: updateData
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (data?.error) {
        console.error('Backend error:', data.error);
        throw new Error(data.error);
      }

      toast({
        title: "Success",
        description: `Updated ${submission.name}'s status to ${newStatus}`,
      });

      onClose();
      onStatusUpdate();
    } catch (error) {
      console.error('Error updating submission:', error);
      toast({
        title: "Error",
        description: "Failed to update submission",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Status for {submission.name}</DialogTitle>
          <DialogDescription>
            Change the status for this submission.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>New Status</Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="survey_booked">Survey Booked</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
                <SelectItem value="doesnt_qualify">Doesn't Qualify</SelectItem>
                <SelectItem value="no_contact">No Contact</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleStatusUpdate} 
              disabled={isUpdating || newStatus === submission.status}
            >
              {isUpdating ? 'Updating...' : 'Update Status'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};