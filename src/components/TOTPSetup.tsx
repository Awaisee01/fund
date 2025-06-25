
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, ArrowLeft, Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'qrcode';

interface TOTPSetupProps {
  email: string;
  secret: string;
  onComplete: (code: string) => void;
  onBack: () => void;
  isLoading: boolean;
  error: string;
}

const TOTPSetup = ({ email, secret, onComplete, onBack, isLoading, error }: TOTPSetupProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const generateQRCode = async () => {
      const otpauth = `otpauth://totp/Funding%20For%20Scotland:${email}?secret=${secret}&issuer=Funding%20For%20Scotland`;
      try {
        const qrUrl = await QRCode.toDataURL(otpauth);
        setQrCodeUrl(qrUrl);
      } catch (err) {
        console.error('Error generating QR code:', err);
      }
    };

    if (secret) {
      generateQRCode();
    }
  }, [secret, email]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length === 6) {
      onComplete(verificationCode);
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    toast({
      title: "Secret copied",
      description: "The secret key has been copied to your clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Smartphone className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Set Up Two-Factor Authentication</CardTitle>
          <CardDescription>
            Scan the QR code with your authenticator app or enter the secret manually
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* QR Code */}
          {qrCodeUrl && (
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-lg">
                <img src={qrCodeUrl} alt="TOTP QR Code" className="w-48 h-48" />
              </div>
            </div>
          )}

          {/* Manual Entry */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Or enter this secret manually:</Label>
            <div className="flex items-center space-x-2">
              <Input
                value={secret}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={copySecret}
                className="shrink-0"
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg text-sm">
            <h4 className="font-medium mb-2">Instructions:</h4>
            <ol className="list-decimal list-inside space-y-1 text-gray-700">
              <li>Download Google Authenticator or similar app</li>
              <li>Scan the QR code or enter the secret manually</li>
              <li>Enter the 6-digit code from your app below</li>
            </ol>
          </div>

          {/* Verification */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="text-center text-lg tracking-widest font-mono"
                maxLength={6}
                required
                disabled={isLoading}
              />
            </div>
            
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <div className="flex space-x-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onBack}
                disabled={isLoading}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || verificationCode.length !== 6}
                className="flex-1"
              >
                {isLoading ? 'Verifying...' : 'Complete Setup'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TOTPSetup;
