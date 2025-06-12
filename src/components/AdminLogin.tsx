
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import VerificationCodeInput from './VerificationCodeInput';
import { useToast } from '@/hooks/use-toast';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [adminEmail] = useState('info@fundingforscotland.co.uk'); // Configure this email
  const { toast } = useToast();

  const ADMIN_PASSWORD = 'FundingScotland2024!';

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate a brief loading period for security
    setTimeout(async () => {
      if (password === ADMIN_PASSWORD) {
        try {
          // Send verification code
          const response = await fetch('/functions/v1/send-admin-verification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: adminEmail }),
          });

          const result = await response.json();

          if (result.success) {
            setShowVerification(true);
            toast({
              title: "Verification code sent",
              description: `Please check ${adminEmail} for your 6-digit code.`,
            });
          } else {
            throw new Error(result.error || 'Failed to send verification code');
          }
        } catch (err) {
          console.error('Error sending verification code:', err);
          setError('Failed to send verification code. Please try again.');
        }
      } else {
        setError('Invalid password. Access denied.');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleCodeVerification = async (code: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/functions/v1/verify-admin-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: adminEmail, 
          code 
        }),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('adminAuthTime', Date.now().toString());
        toast({
          title: "Login successful",
          description: "Welcome to the admin panel!",
        });
        onLogin();
      } else {
        throw new Error(result.error || 'Invalid verification code');
      }
    } catch (err) {
      console.error('Error verifying code:', err);
      setError('Invalid or expired verification code. Please try again.');
    }
    setIsLoading(false);
  };

  const handleBackToPassword = () => {
    setShowVerification(false);
    setPassword('');
    setError('');
  };

  if (showVerification) {
    return (
      <VerificationCodeInput
        email={adminEmail}
        onVerify={handleCodeVerification}
        onBack={handleBackToPassword}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <CardDescription>
            Enter the admin password to continue with 2FA verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                disabled={isLoading}
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !password}
            >
              {isLoading ? 'Sending verification code...' : 'Continue to 2FA'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
