
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Loader2 } from 'lucide-react';

export const TestEmailButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTestEmail = async () => {
    setIsLoading(true);
    
    try {
      console.log('Triggering test email notification...');
      
      const { data, error } = await supabase.functions.invoke('test-email-notification');
      
      if (error) {
        console.error('Test email error:', error);
        throw error;
      }
      
      console.log('Test email response:', data);
      
      toast({
        title: "Test Email Sent!",
        description: "Check your inbox at info@fundingforscotland.co.uk for the test notification.",
      });
      
    } catch (error) {
      console.error('Failed to send test email:', error);
      toast({
        title: "Test Email Failed",
        description: "There was an error sending the test email. Check the console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleTestEmail}
      disabled={isLoading}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Mail className="h-4 w-4" />
      )}
      {isLoading ? 'Sending...' : 'Test Email Notification'}
    </Button>
  );
};
