import React, { useState } from 'react';
import { Shield, Key, RefreshCw, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface MfaVerificationProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export const MfaVerification: React.FC<MfaVerificationProps> = ({ 
  isOpen, 
  onSuccess, 
  onCancel 
}) => {
  const { verifyMfaCode } = useAuth();
  const [code, setCode] = useState('');
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleVerify = async () => {
    if (!code.trim()) {
      setError('Please enter a verification code');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // In design mode, always succeed for demo
      const { error } = await verifyMfaCode(code, useBackupCode ? 'backup_code' : 'totp');
      
      if (error) {
        setError(error.message);
        return;
      }
      
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCode('');
    setError('');
    setUseBackupCode(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Two-Factor Authentication
          </h2>
          <p className="text-gray-600 mt-2">
            {useBackupCode 
              ? 'Enter one of your backup codes'
              : 'Enter the code from your authenticator app'
            }
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Code Input */}
        <div className="mb-6">
          <input
            type="text"
            value={code}
            onChange={(e) => {
              const value = useBackupCode 
                ? e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)
                : e.target.value.replace(/\D/g, '').slice(0, 6);
              setCode(value);
            }}
            placeholder={useBackupCode ? "ABCD1234" : "000000"}
            className="w-full px-4 py-3 text-center text-2xl font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={useBackupCode ? 8 : 6}
            autoFocus
          />
          <p className="text-xs text-gray-500 mt-2 text-center">
            {useBackupCode 
              ? 'Enter 8-character backup code'
              : 'Enter 6-digit code from your app'
            }
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleVerify}
            disabled={loading || !code.trim() || (useBackupCode ? code.length !== 8 : code.length !== 6)}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                Verifying...
              </>
            ) : (
              'Verify & Sign In'
            )}
          </button>

          <button
            onClick={() => {
              setUseBackupCode(!useBackupCode);
              resetForm();
            }}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {useBackupCode ? 'Use Authenticator App' : 'Use Backup Code'}
          </button>
        </div>

        {/* Cancel */}
        <button
          onClick={onCancel}
          className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </button>

        {/* Design Mode Notice */}
        <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            🎨 <strong>Design Mode:</strong> 2FA verification is disabled for demo purposes. 
            Any 6-digit code will work.
          </p>
        </div>
      </div>
    </div>
  );
};