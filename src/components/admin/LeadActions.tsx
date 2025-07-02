
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Phone, Mail, MessageSquare, Eye, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type FormSubmission = Database['public']['Tables']['form_submissions']['Row'];

interface LeadActionsProps {
  submission: FormSubmission;
  onViewDetails: (submission: FormSubmission) => void;
  onStatusUpdate: (submissionId: string, status: Database['public']['Enums']['lead_status']) => void;
}

export const LeadActions = ({ submission, onViewDetails, onStatusUpdate }: LeadActionsProps) => {
  const { toast } = useToast();

  const handleCall = () => {
    if (submission.phone) {
      window.open(`tel:${submission.phone}`);
      onStatusUpdate(submission.id, 'contacted');
      toast({
        title: "Call initiated",
        description: `Calling ${submission.name} at ${submission.phone}`,
      });
    }
  };

  const handleEmail = () => {
    if (submission.email) {
      const subject = `Re: Your ${submission.service_type} enquiry`;
      const body = `Hi ${submission.name},\n\nThank you for your enquiry about our ${submission.service_type} services. I'd like to discuss how we can help you.\n\nBest regards,\nFunding For Scotland Team`;
      window.open(`mailto:${submission.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
      onStatusUpdate(submission.id, 'contacted');
      toast({
        title: "Email opened",
        description: `Email to ${submission.name} opened in your default client`,
      });
    }
  };

  const handleSMS = () => {
    if (submission.phone) {
      const message = `Hi ${submission.name}, thanks for your ${submission.service_type} enquiry. We'd like to discuss your requirements. When would be a good time to call?`;
      window.open(`sms:${submission.phone}?body=${encodeURIComponent(message)}`);
      onStatusUpdate(submission.id, 'contacted');
      toast({
        title: "SMS opened",
        description: `SMS to ${submission.name} opened`,
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Quick Actions */}
      {submission.phone && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleCall}
          className="h-8 px-2"
        >
          <Phone className="w-3 h-3" />
        </Button>
      )}
      
      {submission.email && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleEmail}
          className="h-8 px-2"
        >
          <Mail className="w-3 h-3" />
        </Button>
      )}

      {/* More Actions Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => onViewDetails(submission)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {submission.phone && (
            <DropdownMenuItem onClick={handleSMS}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Send SMS
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => onStatusUpdate(submission.id, 'qualified')}
            disabled={submission.status === 'qualified'}
          >
            <Edit className="mr-2 h-4 w-4" />
            Mark as Qualified
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => onStatusUpdate(submission.id, 'converted')}
            disabled={submission.status === 'converted'}
          >
            <Edit className="mr-2 h-4 w-4" />
            Mark as Converted
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
