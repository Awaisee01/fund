
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Database } from '@/integrations/supabase/types';

type FormSubmission = Database['public']['Tables']['form_submissions']['Row'];
type LeadStatus = Database['public']['Enums']['lead_status'];

interface SubmissionDetailModalProps {
  submission: FormSubmission;
  editingNotes: string;
  editingStatus: LeadStatus;
  onClose: () => void;
  onNotesChange: (notes: string) => void;
  onStatusChange: (status: LeadStatus) => void;
  onSave: () => void;
}

export const SubmissionDetailModal = ({
  submission,
  editingNotes,
  editingStatus,
  onClose,
  onNotesChange,
  onStatusChange,
  onSave
}: SubmissionDetailModalProps) => {
  const formatServiceType = (serviceType: string) => {
    const formatted = {
      eco4: 'ECO4',
      solar: 'Solar',
      gas_boilers: 'Gas Boilers',
      home_improvements: 'Home Improvements'
    };
    return formatted[serviceType as keyof typeof formatted] || serviceType;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">Submission Details</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Contact Information</h3>
              <div className="bg-gray-50 p-3 rounded">
                <p><strong>Name:</strong> {submission.name}</p>
                {submission.email && <p><strong>Email:</strong> {submission.email}</p>}
                {submission.phone && <p><strong>Phone:</strong> {submission.phone}</p>}
                {submission.postcode && <p><strong>Postcode:</strong> {submission.postcode}</p>}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Service & Property</h3>
              <div className="bg-gray-50 p-3 rounded">
                <p><strong>Service:</strong> {formatServiceType(submission.service_type)}</p>
                {submission.property_type && <p><strong>Property Type:</strong> {submission.property_type}</p>}
                {submission.property_ownership && <p><strong>Ownership:</strong> {submission.property_ownership}</p>}
                {submission.current_heating_system && <p><strong>Heating System:</strong> {submission.current_heating_system}</p>}
              </div>
            </div>

            {(submission.utm_source || submission.utm_medium || submission.utm_campaign) && (
              <div>
                <h3 className="font-medium mb-2">Marketing Attribution</h3>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  {submission.utm_source && <p><strong>Source:</strong> {submission.utm_source}</p>}
                  {submission.utm_medium && <p><strong>Medium:</strong> {submission.utm_medium}</p>}
                  {submission.utm_campaign && <p><strong>Campaign:</strong> {submission.utm_campaign}</p>}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <Select value={editingStatus} onValueChange={onStatusChange}>
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

            <div>
              <label className="block text-sm font-medium mb-2">Admin Notes</label>
              <Textarea
                value={editingNotes}
                onChange={(e) => onNotesChange(e.target.value)}
                placeholder="Add notes about this submission..."
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={onSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
