import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';

// Import the components
import { AdminDashboardHeader } from './admin/AdminDashboardHeader';
import { QuickStats } from './admin/QuickStats';
import { AdvancedFilters } from './admin/AdvancedFilters';
import { SubmissionsTable } from './admin/SubmissionsTable';
import { SubmissionDetailModal } from './admin/SubmissionDetailModal';
import { DashboardAnalytics } from './admin/DashboardAnalytics';
import { PaginationControls } from './admin/PaginationControls';

// Import hooks
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { useAdminFilters } from '@/hooks/useAdminFilters';

interface AdminDashboardProps {
  onLogout: () => void;
}

type FormSubmission = Database['public']['Tables']['form_submissions']['Row'];
type LeadStatus = Database['public']['Enums']['lead_status'];

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const { submissions, loading, fetchSubmissions, updateSubmission } = useAdminDashboard();
  const {
    statusFilter,
    serviceFilter,  
    dateRange,
    searchQuery,
    currentPage,
    pageSize,
    paginatedSubmissions,
    setStatusFilter,
    setServiceFilter,
    setDateRange,
    setSearchQuery,
    setCurrentPage,
    setPageSize,
    handleClearAllFilters
  } = useAdminFilters(submissions);

  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [editingNotes, setEditingNotes] = useState<string>('');
  const [editingStatus, setEditingStatus] = useState<LeadStatus>('new');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const { toast } = useToast();

  const deleteSubmission = async (id: string) => {
    try {
      const { error } = await supabase
        .from('form_submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchSubmissions();
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null);
      }
      
      toast({
        title: "Success",
        description: "Enquiry deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast({
        title: "Error",
        description: "Failed to delete enquiry",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = (submissionId: string, status: LeadStatus) => {
    updateSubmission(submissionId, { status });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminAuthTime');
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

  const handleSaveSubmission = (updates: {
    status: LeadStatus;
    admin_notes: string;
    property_type?: string;
    property_ownership?: string;
    current_heating_system?: string;
    epc_score?: string;
  }) => {
    if (selectedSubmission) {
      updateSubmission(selectedSubmission.id, updates);
      setSelectedSubmission(null);
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

        {/* Quick Stats Overview */}
        <QuickStats submissions={submissions} />

        {/* Advanced Filters */}
        <AdvancedFilters
          statusFilter={statusFilter}
          serviceFilter={serviceFilter}
          dateRange={dateRange}
          searchQuery={searchQuery}
          onStatusFilterChange={setStatusFilter}
          onServiceFilterChange={setServiceFilter}
          onDateRangeChange={setDateRange}
          onSearchChange={setSearchQuery}
          onClearAll={handleClearAllFilters}
        />

        {/* Submissions Table */}
        <SubmissionsTable
          submissions={submissions}
          filteredSubmissions={paginatedSubmissions.items}
          selectedIds={selectedIds}
          statusFilter={statusFilter}
          dateRange={dateRange}
          onSelectionChange={setSelectedIds}
          onStatusFilterChange={setStatusFilter}
          onDateRangeChange={setDateRange}
          onBulkUpdate={fetchSubmissions}
          onViewDetails={handleViewDetails}
          onEmailSent={handleEmailSent}
          onStatusUpdate={handleStatusUpdate}
          onDelete={deleteSubmission}
        />

        {/* Pagination */}
        {paginatedSubmissions.totalItems > 0 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={paginatedSubmissions.totalPages}
            pageSize={pageSize}
            totalItems={paginatedSubmissions.totalItems}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        )}
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
