import React, { useState } from 'react';
import { Shield, Copy, Download, Check, X, Smartphone, Key } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface MfaSetupProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const MfaSetup: React.FC<MfaSetupProps> = ({ isOpen, onClose, onComplete }) => {
  const { enrollMfa, verifyMfaEnrollment, generateBackupCodes } = useAuth();
  const [step, setStep] = useState<'intro' | 'qr' | 'verify' | 'backup' | 'complete'>('intro');
  const [factor, setFactor] = useState<any>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedCodes, setCopiedCodes] = useState(false);

  if (!isOpen) return null;

  const handleEnrollMfa = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { error, factor: newFactor } = await enrollMfa();
      
      if (error) {
        setError(error.message);
        return;
      }
      
      setFactor(newFactor);
      setStep('qr');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEnrollment = async () => {
    if (!verificationCode.trim() || !factor?.id) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // In design mode, always succeed
      const { error } = await verifyMfaEnrollment(factor.id, verificationCode);
      
      if (error) {
        setError(error.message);
        return;
      }
      
      // Generate backup codes
      const { error: codesError, codes } = await generateBackupCodes();
      
      if (codesError) {
        setError(codesError.message);
        return;
      }
      
      setBackupCodes(codes || []);
      setStep('backup');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    navigator.clipboard.writeText(codesText);
    setCopiedCodes(true);
    setTimeout(() => setCopiedCodes(false), 2000);
  };

  const downloadBackupCodes = () => {
    const codesText = `Consulting19 Backup Codes\nGenerated: ${new Date().toLocaleString()}\n\n${backupCodes.join('\n')}\n\nKeep these codes safe and secure!`;
    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'consulting19-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xs max-h-[70vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
              <Shield className="w-4 h-4 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Setup 2FA Security</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
            {error}
          </div>
        )}

        {/* Step 1: Introduction */}
        {step === 'intro' && (
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              Secure Your Account
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Two-factor authentication adds an extra layer of security to your account. 
              You'll need an authenticator app like Google Authenticator or Authy.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">📱 Recommended Apps:</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Google Authenticator</li>
                <li>• Microsoft Authenticator</li>
                <li>• Authy</li>
                <li>• 1Password</li>
              </ul>
            </div>

            <button
              onClick={handleEnrollMfa}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
            >
              {loading ? 'Setting up...' : 'Continue Setup'}
            </button>
          </div>
        )}

        {/* Step 2: QR Code */}
        {step === 'qr' && factor && (
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Smartphone className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              Scan QR Code
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Open your authenticator app and scan this QR code:
            </p>
            
            <div className="bg-white border-2 border-gray-200 rounded-xl p-3 mb-4">
              <img 
                src={factor.qr_code} 
                alt="2FA QR Code"
                className="w-32 h-32 mx-auto"
              />
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-gray-600 mb-2">Manual entry key:</p>
              <code className="text-xs font-mono bg-white px-2 py-1 rounded border">
                {factor.secret}
              </code>
            </div>

            <button
              onClick={() => setStep('verify')}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              I've Added the Account
            </button>
          </div>
        )}

        {/* Step 3: Verify */}
        {step === 'verify' && (
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Key className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              Enter Verification Code
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter the 6-digit code from your authenticator app:
            </p>
            
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="w-full px-3 py-2 text-center text-lg font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4"
              maxLength={6}
            />

            <div className="space-y-2">
              <button
                onClick={handleVerifyEnrollment}
                disabled={loading || verificationCode.length !== 6}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
              >
                {loading ? 'Verifying...' : 'Verify & Enable 2FA'}
              </button>
              
              <button
                onClick={() => setStep('qr')}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Back to QR Code
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Backup Codes */}
        {step === 'backup' && (
          <div>
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Key className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                Save Backup Codes
              </h3>
              <p className="text-sm text-gray-600">
                Store these backup codes safely. You can use them to access your account if you lose your phone.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
              <div className="grid grid-cols-2 gap-1 font-mono text-xs">
                {backupCodes.map((code, index) => (
                  <div key={index} className="bg-white px-2 py-1 rounded border text-center">
                    {code}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <button
                onClick={copyBackupCodes}
                className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center text-sm"
              >
                {copiedCodes ? (
                  <>
                    <Check className="w-3 h-3 mr-1 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 mr-1" />
                    Copy Codes
                  </>
                )}
              </button>
              
              <button
                onClick={downloadBackupCodes}
                className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center text-sm"
              >
                <Download className="w-3 h-3 mr-1" />
                Download as File
              </button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-red-800">
                <strong>⚠️ Important:</strong> Save these codes in a secure location. 
                Each code can only be used once and you won't be able to see them again.
              </p>
            </div>

            <button
              onClick={() => {
                setStep('complete');
                onComplete();
              }}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              I've Saved My Backup Codes
            </button>
          </div>
        )}

        {/* Step 5: Complete */}
        {step === 'complete' && (
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              2FA Successfully Enabled!
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Your account is now protected with two-factor authentication. 
              You'll need your authenticator app to sign in from now on.
            </p>
            
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};