
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckSquare, Mail, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type FormSubmission = Database['public']['Tables']['form_submissions']['Row'];
type LeadStatus = Database['public']['Enums']['lead_status'];

interface BulkActionsProps {
  submissions: FormSubmission[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onBulkUpdate: () => void;
}

export const BulkActions = ({ submissions, selectedIds, onSelectionChange, onBulkUpdate }: BulkActionsProps) => {
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<LeadStatus>('new');
  const [bulkNotes, setBulkNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const selectedSubmissions = submissions.filter(s => selectedIds.includes(s.id));
  const allSelected = submissions.length > 0 && selectedIds.length === submissions.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < submissions.length;

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(submissions.map(s => s.id));
    }
  };

  const handleBulkStatusUpdate = async () => {
    setIsUpdating(true);
    try {
      const updateData: any = { status: bulkStatus };
      
      if (bulkStatus === 'contacted') {
        updateData.contacted_at = new Date().toISOString();
      }
      if (bulkStatus === 'converted') {
        updateData.converted_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('form_submissions')
        .update(updateData)
        .in('id', selectedIds);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Updated ${selectedIds.length} submissions to ${bulkStatus}`,
      });

      setIsStatusDialogOpen(false);
      onSelectionChange([]);
      onBulkUpdate();
    } catch (error) {
      console.error('Error updating submissions:', error);
      toast({
        title: "Error",
        description: "Failed to update submissions",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBulkNotesUpdate = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('form_submissions')
        .update({ admin_notes: bulkNotes })
        .in('id', selectedIds);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Added notes to ${selectedIds.length} submissions`,
      });

      setIsNotesDialogOpen(false);
      setBulkNotes('');
      onSelectionChange([]);
      onBulkUpdate();
    } catch (error) {
      console.error('Error updating submissions:', error);
      toast({
        title: "Error",
        description: "Failed to update submissions",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (submissions.length === 0) return null;

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={allSelected}
          ref={(el) => {
            if (el) el.indeterminate = someSelected;
          }}
          onCheckedChange={handleSelectAll}
        />
        <span className="text-sm font-medium">
          {selectedIds.length > 0 ? `${selectedIds.length} selected` : "Select all"}
        </span>
      </div>

      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2">
          <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <CheckSquare className="w-4 h-4 mr-2" />
                Update Status
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Status for {selectedIds.length} submissions</DialogTitle>
                <DialogDescription>
                  This will update the status for all selected submissions.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>New Status</Label>
                  <Select value={bulkStatus} onValueChange={(value: LeadStatus) => setBulkStatus(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleBulkStatusUpdate} disabled={isUpdating}>
                    {isUpdating ? 'Updating...' : 'Update Status'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isNotesDialogOpen} onOpenChange={setIsNotesDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Add Notes
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Notes to {selectedIds.length} submissions</DialogTitle>
                <DialogDescription>
                  This will add the same note to all selected submissions.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={bulkNotes}
                    onChange={(e) => setBulkNotes(e.target.value)}
                    placeholder="Enter notes to add to selected submissions..."
                    rows={4}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsNotesDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleBulkNotesUpdate} disabled={isUpdating || !bulkNotes.trim()}>
                    {isUpdating ? 'Adding...' : 'Add Notes'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectionChange([])}
          >
            Clear Selection
          </Button>
        </div>
      )}
    </div>
  );
};
