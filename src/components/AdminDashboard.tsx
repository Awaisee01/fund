
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DateRange } from 'react-day-picker';
import { isWithinInterval, parseISO } from 'date-fns';
import type { Database } from '@/integrations/supabase/types';

// Import the new components
import { AdminDashboardHeader } from './admin/AdminDashboardHeader';
import { StatsOverview } from './admin/StatsOverview';
import { SubmissionsTable } from './admin/SubmissionsTable';
import { SubmissionDetailModal } from './admin/SubmissionDetailModal';
import { DashboardAnalytics } from './admin/DashboardAnalytics';

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

  const handleViewDetails = (submission: FormSubmission) => {
    setSelectedSubmission(submission);
    setEditingNotes(submission.admin_notes || '');
    setEditingStatus(submission.status);
  };

  const handleEmailSent = (submissionId: string) => {
    updateSubmission(submissionId, { status: 'contacted' });
  };

  const handleSaveSubmission = () => {
    if (selectedSubmission) {
      updateSubmission(selectedSubmission.id, {
        status: editingStatus,
        admin_notes: editingNotes
      });
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
      <AdminDashboardHeader
        showAnalytics={showAnalytics}
        onToggleAnalytics={() => setShowAnalytics(!showAnalytics)}
        onLogout={handleLogout}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Dashboard */}
        {showAnalytics && <DashboardAnalytics submissions={submissions} />}

        {/* Stats Overview */}
        <StatsOverview
          totalSubmissions={stats.totalSubmissions}
          newSubmissions={stats.newSubmissions}
          processedSubmissions={stats.processedSubmissions}
          todaySubmissions={stats.todaySubmissions}
        />

        {/* Submissions Table */}
        <SubmissionsTable
          submissions={submissions}
          filteredSubmissions={filteredSubmissions}
          selectedIds={selectedIds}
          statusFilter={statusFilter}
          dateRange={dateRange}
          onSelectionChange={setSelectedIds}
          onStatusFilterChange={setStatusFilter}
          onDateRangeChange={setDateRange}
          onBulkUpdate={fetchSubmissions}
          onViewDetails={handleViewDetails}
          onEmailSent={handleEmailSent}
        />
      </div>

      {/* Detail Modal */}
      {selectedSubmission && (
        <SubmissionDetailModal
          submission={selectedSubmission}
          editingNotes={editingNotes}
          editingStatus={editingStatus}
          onClose={() => setSelectedSubmission(null)}
          onNotesChange={setEditingNotes}
          onStatusChange={setEditingStatus}
          onSave={handleSaveSubmission}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
