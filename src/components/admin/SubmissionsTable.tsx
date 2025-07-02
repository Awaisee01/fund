import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Phone, MapPin } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import type { Database } from '@/integrations/supabase/types';
import { ExportControls } from './ExportControls';
import { BulkActions } from './BulkActions';
import { LeadStatusBadge } from './LeadStatusBadge';
import { LeadActions } from './LeadActions';

type FormSubmission = Database['public']['Tables']['form_submissions']['Row'];
type LeadStatus = Database['public']['Enums']['lead_status'];

interface SubmissionsTableProps {
  submissions: FormSubmission[];
  filteredSubmissions: FormSubmission[];
  selectedIds: string[];
  statusFilter: LeadStatus | 'all';
  dateRange: DateRange | undefined;
  onSelectionChange: (ids: string[]) => void;
  onStatusFilterChange: (status: LeadStatus | 'all') => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onBulkUpdate: () => void;
  onViewDetails: (submission: FormSubmission) => void;
  onEmailSent: (submissionId: string) => void;
  onStatusUpdate: (submissionId: string, status: LeadStatus) => void;
  onDelete?: (submissionId: string) => void;
}

export const SubmissionsTable = ({
  submissions,
  filteredSubmissions,
  selectedIds,
  onSelectionChange,
  onBulkUpdate,
  onViewDetails,
  onEmailSent,
  onStatusUpdate,
  onDelete
}: SubmissionsTableProps) => {
  const formatServiceType = (serviceType: string) => {
    const formatted = {
      eco4: 'ECO4',
      solar: 'Solar',
      gas_boilers: 'Gas Boilers',
      home_improvements: 'Home Improvements'
    };
    return formatted[serviceType as keyof typeof formatted] || serviceType;
  };

  const handleRowSelect = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  const getRowPriority = (submission: FormSubmission) => {
    const hoursSinceCreated = (Date.now() - new Date(submission.created_at).getTime()) / (1000 * 60 * 60);
    
    if (submission.status === 'new' && hoursSinceCreated < 2) {
      return 'urgent'; // New leads less than 2 hours old
    }
    if (submission.status === 'new' && hoursSinceCreated < 24) {
      return 'high'; // New leads less than 24 hours old
    }
    return 'normal';
  };

  const getPriorityClasses = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-50 border-l-4 border-l-red-500';
      case 'high':
        return 'bg-orange-50 border-l-4 border-l-orange-500';
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Lead Management</CardTitle>
            <CardDescription>
              {filteredSubmissions.length} {filteredSubmissions.length === 1 ? 'lead' : 'leads'} 
              {filteredSubmissions.length !== submissions.length && ` (filtered from ${submissions.length} total)`}
            </CardDescription>
          </div>
          <ExportControls 
            submissions={submissions}
            filteredSubmissions={filteredSubmissions}
          />
        </div>
      </CardHeader>
      <CardContent>
        <BulkActions
          submissions={filteredSubmissions}
          selectedIds={selectedIds}
          onSelectionChange={onSelectionChange}
          onBulkUpdate={onBulkUpdate}
        />
        
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500 mb-2">No leads found</p>
            <p className="text-sm text-gray-400">
              Try adjusting your filters or check back later for new submissions.
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={filteredSubmissions.length > 0 && selectedIds.length === filteredSubmissions.length}
                      onCheckedChange={(checked) => {
                        onSelectionChange(checked ? filteredSubmissions.map(s => s.id) : []);
                      }}
                    />
                  </TableHead>
                  <TableHead>Lead Details</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission) => {
                  const priority = getRowPriority(submission);
                  const priorityClasses = getPriorityClasses(priority);
                  
                  return (
                    <TableRow 
                      key={submission.id} 
                      className={`${priorityClasses} ${priority === 'urgent' ? 'animate-pulse' : ''}`}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(submission.id)}
                          onCheckedChange={(checked) => handleRowSelect(submission.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900">{submission.name}</div>
                          {submission.email && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{submission.email}</span>
                            </div>
                          )}
                          {submission.phone && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="w-3 h-3 mr-1 flex-shrink-0" />
                              {submission.phone}
                            </div>
                          )}
                          {submission.postcode && (
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                              {submission.postcode}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {formatServiceType(submission.service_type)}
                        </div>
                        {submission.property_type && (
                          <div className="text-sm text-gray-500">
                            {submission.property_type}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <LeadStatusBadge status={submission.status} />
                        {priority === 'urgent' && (
                          <div className="text-xs text-red-600 font-medium mt-1">
                            🔥 URGENT
                          </div>
                        )}
                        {priority === 'high' && (
                          <div className="text-xs text-orange-600 font-medium mt-1">
                            ⚡ HIGH PRIORITY
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">
                            {new Date(submission.created_at).toLocaleDateString('en-GB')}
                          </div>
                          <div className="text-gray-500">
                            {new Date(submission.created_at).toLocaleTimeString('en-GB', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <LeadActions
                          submission={submission}
                          onViewDetails={onViewDetails}
                          onStatusUpdate={onStatusUpdate}
                          onDelete={onDelete}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
