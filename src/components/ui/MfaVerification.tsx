import React, { useState } from 'react';
import { Shield, Key, X, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface MfaVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const MfaVerification: React.FC<MfaVerificationProps> = ({ isOpen, onClose, onSuccess }) => {
  const { verifyMfaCode } = useAuth();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [useBackupCode, setUseBackupCode] = useState(false);

  if (!isOpen) return null;

  const handleVerify = async () => {
    if (!code.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
              <Shield className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h2>
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

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Key className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">
            Enter Verification Code
          </h3>
          <p className="text-sm text-gray-600">
            {useBackupCode 
              ? 'Enter one of your backup codes:'
              : 'Enter the 6-digit code from your authenticator app:'
            }
          </p>
        </div>
        
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(useBackupCode ? e.target.value : e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder={useBackupCode ? "Backup code" : "000000"}
          className="w-full px-3 py-2 text-center text-lg font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
          maxLength={useBackupCode ? 10 : 6}
          autoFocus
        />

        <div className="space-y-3">
          <button
            onClick={handleVerify}
            disabled={loading || !code.trim()}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
          
          <button
            onClick={() => {
              setUseBackupCode(!useBackupCode);
              setCode('');
              setError('');
            }}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            {useBackupCode ? 'Use Authenticator App' : 'Use Backup Code'}
          </button>
        </div>
      </div>
    </div>
  );
};