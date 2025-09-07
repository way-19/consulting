import React, { useState, useEffect } from 'react';
import { Shield, Key, X, AlertTriangle, Copy, Download, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface MfaSetupProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const MfaSetup: React.FC<MfaSetupProps> = ({ isOpen, onClose, onComplete }) => {
  const { enrollMfa, verifyMfaEnrollment, generateBackupCodes } = useAuth();
  const [step, setStep] = useState<'setup' | 'verify' | 'backup'>('setup');
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [factorId, setFactorId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleStartSetup = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { error, factor } = await enrollMfa();
      
      if (error) {
        setError(error.message);
        return;
      }
      
      if (factor) {
        setQrCode(factor.qr_code || '');
        setSecret(factor.secret || '');
        setFactorId(factor.id);
        setStep('verify');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const { error } = await verifyMfaEnrollment(factorId, verificationCode);
      
      if (error) {
        setError(error.message);
        return;
      }
      
      // Generate backup codes
      const { error: backupError, codes } = await generateBackupCodes();
      
      if (backupError) {
        setError(backupError.message);
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

  const handleComplete = () => {
    onComplete();
    onClose();
    setStep('setup');
    setVerificationCode('');
    setError('');
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
  };

  const downloadBackupCodes = () => {
    const content = backupCodes.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'consulting19-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
              <Shield className="w-4 h-4 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Setup 2FA</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        {/* Step 1: Setup */}
        {step === 'setup' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Enable Two-Factor Authentication
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Add an extra layer of security to your account with 2FA using an authenticator app.
            </p>
            <button
              onClick={handleStartSetup}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Setting up...' : 'Start Setup'}
            </button>
          </div>
        )}

        {/* Step 2: Verify */}
        {step === 'verify' && (
          <div>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Key className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                Scan QR Code
              </h3>
              <p className="text-sm text-gray-600">
                Scan this QR code with your authenticator app, then enter the 6-digit code:
              </p>
            </div>

            {qrCode && (
              <div className="text-center mb-4">
                <img src={qrCode} alt="QR Code" className="mx-auto mb-3 border border-gray-200 rounded-lg" />
                <div className="flex items-center justify-center space-x-2">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">{secret}</code>
                  <button
                    onClick={copySecret}
                    className="text-blue-600 hover:text-blue-700"
                    title="Copy secret"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
            
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="w-full px-3 py-2 text-center text-lg font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              maxLength={6}
              autoFocus
            />

            <button
              onClick={handleVerifyCode}
              disabled={loading || verificationCode.length !== 6}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Verifying...' : 'Verify & Enable'}
            </button>
          </div>
        )}

        {/* Step 3: Backup Codes */}
        {step === 'backup' && (
          <div>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                2FA Enabled Successfully!
              </h3>
              <p className="text-sm text-gray-600">
                Save these backup codes in a safe place. You can use them to access your account if you lose your device:
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                {backupCodes.map((code, index) => (
                  <div key={index} className="text-center py-1">
                    {code}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={downloadBackupCodes}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Backup Codes
              </button>
              
              <button
                onClick={handleComplete}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Complete Setup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};