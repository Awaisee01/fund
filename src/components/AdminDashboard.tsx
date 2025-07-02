
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, FileText, Settings, LogOut, Mail, Phone, MapPin, Calendar, ExternalLink, Filter, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DateRange } from 'react-day-picker';
import { isWithinInterval, parseISO } from 'date-fns';
import type { Database } from '@/integrations/supabase/types';

// Import the new components
import { DateRangeFilter } from './admin/DateRangeFilter';
import { ExportControls } from './admin/ExportControls';
import { EmailIntegration } from './admin/EmailIntegration';
import { DashboardAnalytics } from './admin/DashboardAnalytics';
import { BulkActions } from './admin/BulkActions';

interface AdminDashboardProps {
  onLogout: () => void;
}

type FormSubmission = Database['public']['Tables']['form_submissions']['Row'];
type LeadStatus = Database['public']['Enums']['lead_status'];

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [editingNotes, setEditingNotes] = useState<string>('');
  const [editingStatus, setEditingStatus] = useState<LeadStatus>('new');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const { toast } = useToast();

  // Stats derived from submissions
  const stats = {
    totalSubmissions: submissions.length,
    newSubmissions: submissions.filter(s => s.status === 'new').length,
    processedSubmissions: submissions.filter(s => s.status === 'converted').length,
    todaySubmissions: submissions.filter(s => 
      new Date(s.created_at).toDateString() === new Date().toDateString()
    ).length
  };

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch form submissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSubmission = async (id: string, updates: { status?: LeadStatus; admin_notes?: string }) => {
    try {
      const updateData: any = { ...updates };
      
      if (updates.status === 'contacted') {
        updateData.contacted_at = new Date().toISOString();
      }
      if (updates.status === 'converted') {
        updateData.converted_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('form_submissions')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      await fetchSubmissions();
      setSelectedSubmission(null);
      
      toast({
        title: "Success",
        description: "Submission updated successfully",
      });
    } catch (error) {
      console.error('Error updating submission:', error);
      toast({
        title: "Error",
        description: "Failed to update submission",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Filter submissions based on status and date range
  useEffect(() => {
    let filtered = submissions;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(s => s.status === statusFilter);
    }

    // Filter by date range
    if (dateRange?.from) {
      filtered = filtered.filter(s => {
        const submissionDate = parseISO(s.created_at);
        if (dateRange.to) {
          return isWithinInterval(submissionDate, { start: dateRange.from!, end: dateRange.to });
        } else {
          return submissionDate >= dateRange.from!;
        }
      });
    }

    setFilteredSubmissions(filtered);
  }, [submissions, statusFilter, dateRange]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    onLogout();
  };

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
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading submissions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-600">Funding For Scotland</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setShowAnalytics(!showAnalytics)} 
                variant="outline" 
                size="sm"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                {showAnalytics ? 'Hide' : 'Show'} Analytics
              </Button>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Dashboard */}
        {showAnalytics && <DashboardAnalytics submissions={submissions} />}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
              <p className="text-xs text-muted-foreground">All time submissions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Submissions</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newSubmissions}</div>
              <p className="text-xs text-muted-foreground">Awaiting response</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Converted</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.processedSubmissions}</div>
              <p className="text-xs text-muted-foreground">Successful conversions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todaySubmissions}</div>
              <p className="text-xs text-muted-foreground">Submissions today</p>
            </CardContent>
          </Card>
        </div>

        {/* Submissions Table */}
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
                  onDateRangeChange={setDateRange} 
                />
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <Select value={statusFilter} onValueChange={(value: LeadStatus | 'all') => setStatusFilter(value)}>
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
              onSelectionChange={setSelectedIds}
              onBulkUpdate={fetchSubmissions}
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
                          setSelectedIds(checked ? filteredSubmissions.map(s => s.id) : []);
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
                            onEmailSent={() => {
                              updateSubmission(submission.id, { status: 'contacted' });
                            }}
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setEditingNotes(submission.admin_notes || '');
                              setEditingStatus(submission.status);
                            }}
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
      </div>

      {/* Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">Submission Details</h2>
                <Button variant="ghost" size="sm" onClick={() => setSelectedSubmission(null)}>
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Contact Information</h3>
                  <div className="bg-gray-50 p-3 rounded">
                    <p><strong>Name:</strong> {selectedSubmission.name}</p>
                    {selectedSubmission.email && <p><strong>Email:</strong> {selectedSubmission.email}</p>}
                    {selectedSubmission.phone && <p><strong>Phone:</strong> {selectedSubmission.phone}</p>}
                    {selectedSubmission.postcode && <p><strong>Postcode:</strong> {selectedSubmission.postcode}</p>}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Service & Property</h3>
                  <div className="bg-gray-50 p-3 rounded">
                    <p><strong>Service:</strong> {formatServiceType(selectedSubmission.service_type)}</p>
                    {selectedSubmission.property_type && <p><strong>Property Type:</strong> {selectedSubmission.property_type}</p>}
                    {selectedSubmission.property_ownership && <p><strong>Ownership:</strong> {selectedSubmission.property_ownership}</p>}
                    {selectedSubmission.current_heating_system && <p><strong>Heating System:</strong> {selectedSubmission.current_heating_system}</p>}
                  </div>
                </div>

                {(selectedSubmission.utm_source || selectedSubmission.utm_medium || selectedSubmission.utm_campaign) && (
                  <div>
                    <h3 className="font-medium mb-2">Marketing Attribution</h3>
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      {selectedSubmission.utm_source && <p><strong>Source:</strong> {selectedSubmission.utm_source}</p>}
                      {selectedSubmission.utm_medium && <p><strong>Medium:</strong> {selectedSubmission.utm_medium}</p>}
                      {selectedSubmission.utm_campaign && <p><strong>Campaign:</strong> {selectedSubmission.utm_campaign}</p>}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <Select value={editingStatus} onValueChange={(value: LeadStatus) => setEditingStatus(value)}>
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
                    onChange={(e) => setEditingNotes(e.target.value)}
                    placeholder="Add notes about this submission..."
                    rows={4}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="outline" onClick={() => setSelectedSubmission(null)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => updateSubmission(selectedSubmission.id, {
                      status: editingStatus,
                      admin_notes: editingNotes
                    })}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
