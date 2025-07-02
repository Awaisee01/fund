
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type FormSubmission = Database['public']['Tables']['form_submissions']['Row'];
type LeadStatus = Database['public']['Enums']['lead_status'];

export const useAdminDashboard = () => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

  return {
    submissions,
    loading,
    fetchSubmissions,
    updateSubmission
  };
};
