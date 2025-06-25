
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

interface TOTPSetupProps {
  email: string;
  onSetupComplete: () => void;
}

const TOTPSetup = ({ email, onSetupComplete }: TOTPSetupProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [manualSecret, setManualSecret] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  useEffect(() => {
    const setupTOTP = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        const { data, error } = await supabase.functions.invoke('setup-admin-totp', {
          body: { email }
        });

        if (error) {
          throw error;
        }

        if (data?.qrCodeUrl && data?.manualSecret) {
          setQrCodeUrl(data.qrCodeUrl);
          setManualSecret(data.manualSecret);
        } else {
          throw new Error('Invalid response from TOTP setup');
        }
      } catch (err) {
        console.error('TOTP setup error:', err);
        setError(err instanceof Error ? err.message : 'Failed to set up TOTP');
      } finally {
        setIsLoading(false);
      }
    };

    if (email) {
      setupTOTP();
    }
  }, [email]);

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a 6-digit verification code');
      return;
    }

    try {
      setIsVerifying(true);
      setError('');

      const { data, error } = await supabase.functions.invoke('verify-admin-totp', {
        body: { 
          email, 
          token: verificationCode 
        }
      });

      if (error) {
        throw error;
      }

      if (data?.verified) {
        onSetupComplete();
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (err) {
      console.error('TOTP verification error:', err);
      setError(err instanceof Error ? err.message : 'Failed to verify TOTP code');
    } finally {
      setIsVerifying(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Setting up Two-Factor Authentication</CardTitle>
          <CardDescription>Please wait while we generate your TOTP secret...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Set up Two-Factor Authentication</CardTitle>
        <CardDescription>
          Scan the QR code with your authenticator app or enter the secret manually
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {qrCodeUrl && (
          <div className="text-center">
            <img 
              src={qrCodeUrl} 
              alt="TOTP QR Code" 
              className="mx-auto mb-4 border rounded-lg"
              width={200}
              height={200}
            />
            <p className="text-sm text-gray-600 mb-2">
              Or enter this secret manually in your authenticator app:
            </p>
            <code className="text-xs bg-gray-100 p-2 rounded break-all">
              {manualSecret}
            </code>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="verification-code">Enter 6-digit code from your app</Label>
          <Input
            id="verification-code"
            type="text"
            placeholder="123456"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
          />
        </div>

        <Button 
          onClick={handleVerifyCode} 
          disabled={isVerifying || verificationCode.length !== 6}
          className="w-full"
        >
          {isVerifying ? 'Verifying...' : 'Verify and Complete Setup'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TOTPSetup;
