
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Filter, ExternalLink } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import type { Database } from '@/integrations/supabase/types';
import { DateRangeFilter } from './DateRangeFilter';
import { ExportControls } from './ExportControls';
import { EmailIntegration } from './EmailIntegration';
import { BulkActions } from './BulkActions';

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
}

export const SubmissionsTable = ({
  submissions,
  filteredSubmissions,
  selectedIds,
  statusFilter,
  dateRange,
  onSelectionChange,
  onStatusFilterChange,
  onDateRangeChange,
  onBulkUpdate,
  onViewDetails,
  onEmailSent
}: SubmissionsTableProps) => {
  const getStatusBadge = (status: LeadStatus) => {
    const statusColors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-purple-100 text-purple-800',
      converted: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
      lost: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={statusColors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Form Submissions</CardTitle>
            <CardDescription>
              Manage and track customer enquiries across all services
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <DateRangeFilter 
              dateRange={dateRange} 
              onDateRangeChange={onDateRangeChange} 
            />
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ExportControls 
              submissions={submissions}
              filteredSubmissions={filteredSubmissions}
            />
          </div>
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
          <div className="text-center py-8">
            <p className="text-gray-500">
              {statusFilter === 'all' && !dateRange?.from ? 'No form submissions yet.' : 'No submissions match your filters.'}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {statusFilter === 'all' && !dateRange?.from
                ? 'Submissions will appear here when visitors fill out your forms.' 
                : 'Try adjusting your filters to see more results.'}
            </p>
          </div>
        ) : (
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
                <TableHead>Name & Contact</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Property Info</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(submission.id)}
                      onCheckedChange={(checked) => handleRowSelect(submission.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <span className="font-medium">{submission.name}</span>
                      {submission.email && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-3 h-3 mr-1" />
                          {submission.email}
                        </div>
                      )}
                      {submission.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-3 h-3 mr-1" />
                          {submission.phone}
                        </div>
                      )}
                      {submission.postcode && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-3 h-3 mr-1" />
                          {submission.postcode}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatServiceType(submission.service_type)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {submission.property_type && <div>Type: {submission.property_type}</div>}
                      {submission.property_ownership && <div>Ownership: {submission.property_ownership}</div>}
                      {submission.current_heating_system && <div>Heating: {submission.current_heating_system}</div>}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(submission.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(submission.created_at).toLocaleDateString()}
                      <div className="text-xs text-gray-500">
                        {new Date(submission.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <EmailIntegration 
                        submission={submission}
                        onEmailSent={() => onEmailSent(submission.id)}
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onViewDetails(submission)}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
