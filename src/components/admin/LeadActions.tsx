import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Mail, Trash2, Settings } from 'lucide-react';
import { useState } from 'react';
import { ConfirmationDialog } from './ConfirmationDialog';
import { StatusUpdateDialog } from './StatusUpdateDialog';
import type { Database } from '@/integrations/supabase/types';

type FormSubmission = Database['public']['Tables']['form_submissions']['Row'];

interface LeadActionsProps {
  submission: FormSubmission;
  onViewDetails: (submission: FormSubmission) => void;
  onStatusUpdate: () => void;
  onDelete?: (submissionId: string) => void;
}

export const LeadActions = ({ 
  submission, 
  onViewDetails, 
  onStatusUpdate, 
  onDelete 
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(submission.id);
      setShowDeleteConfirm(false);
    }
  };

  const handleStatusDialogOpen = () => {
    setShowStatusDialog(true);
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
          
          <DropdownMenuItem onClick={handleStatusDialogOpen}>
            <Settings className="mr-2 h-4 w-4" />
            Change Status
          </DropdownMenuItem>
          
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
      
      <StatusUpdateDialog
        submission={submission}
        isOpen={showStatusDialog}
        onClose={() => setShowStatusDialog(false)}
        onStatusUpdate={onStatusUpdate}
      />
    </>
  );
};