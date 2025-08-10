
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Mail, Trash2, Settings, CheckCircle, Clock, Star, XCircle, AlertTriangle, Phone, Ban } from 'lucide-react';
import { useState } from 'react';
import { ConfirmationDialog } from './ConfirmationDialog';
import type { Database } from '@/integrations/supabase/types';

type FormSubmission = Database['public']['Tables']['form_submissions']['Row'];

type LeadStatus = Database['public']['Enums']['lead_status'];

interface LeadActionsProps {
  submission: FormSubmission;
  onViewDetails: (submission: FormSubmission) => void;
  onStatusUpdate: (status: string) => void;
  onDelete?: (submissionId: string) => void;
}

const statusOptions: { value: LeadStatus; label: string; icon: any; color: string }[] = [
  { value: 'new', label: 'New Lead', icon: Star, color: 'text-blue-600' },
  { value: 'contacted', label: 'Contacted', icon: Phone, color: 'text-yellow-600' },
  { value: 'qualified', label: 'Qualified', icon: CheckCircle, color: 'text-green-600' },
  { value: 'survey_booked', label: 'Survey Booked', icon: Clock, color: 'text-purple-600' },
  { value: 'converted', label: 'Converted', icon: CheckCircle, color: 'text-green-700' },
  { value: 'closed', label: 'Closed', icon: CheckCircle, color: 'text-gray-600' },
  { value: 'lost', label: 'Lost', icon: XCircle, color: 'text-red-600' },
  { value: 'doesnt_qualify', label: "Doesn't Qualify", icon: Ban, color: 'text-orange-600' },
  { value: 'no_contact', label: 'No Contact', icon: AlertTriangle, color: 'text-red-500' },
];

export const LeadActions = ({ 
  submission, 
  onViewDetails, 
  onStatusUpdate,
  onDelete 
}: LeadActionsProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(submission.id);
      setShowDeleteConfirm(false);
    }
  };

  const handleStatusUpdate = (status: LeadStatus) => {
    onStatusUpdate(status);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => onViewDetails(submission)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Settings className="mr-2 h-4 w-4" />
              Change Status
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {statusOptions.map((status) => {
                const StatusIcon = status.icon;
                const isCurrentStatus = submission.status === status.value;
                return (
                  <DropdownMenuItem
                    key={status.value}
                    onClick={() => handleStatusUpdate(status.value)}
                    disabled={isCurrentStatus}
                    className={`${status.color} ${isCurrentStatus ? 'bg-muted font-medium' : ''}`}
                  >
                    <StatusIcon className="mr-2 h-4 w-4" />
                    {status.label}
                    {isCurrentStatus && <span className="ml-auto text-xs">Current</span>}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          
          {submission.email && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => window.open(`mailto:${submission.email}`, '_blank')}
              >
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </DropdownMenuItem>
            </>
          )}
          
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Enquiry"
        description="Are you sure you want to delete this enquiry? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </>
  );
};
