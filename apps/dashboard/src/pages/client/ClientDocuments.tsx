import React, { useState, useEffect, useCallback } from 'react';
import { Upload, Download, FileText, Calendar, User, AlertCircle, CheckCircle, X, Clock } from 'lucide-react';
import { Card, Button } from '@consulting19/shared";
import { supabase } from '@consulting19/supabase';
import { useAuth } from '@consulting19/shared';
import { useI18n } from '../../hooks/useI18n';
import ClientLayout from '../../components/layouts/ClientLayout';
import { Helmet } from 'react-helmet-async';

interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  status: string;
  is_request: boolean;
  file_url: string | null;
  file_size: number | null;
  notes: string | null;
  due_date: string | null;
  uploaded_at: string | null;
  reviewed_at: string | null;
  requested_by_consultant: {
    full_name: string;
  } | null;
}

const ClientDocuments = () => {
  const { user } = useAuth();
  const { t, formatDate, formatRelativeTime } = useI18n();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get client record first
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (!clientData) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          requested_by_consultant:user_profiles!documents_requested_by_consultant_id_fkey(full_name)
        `)
        .eq('client_id', clientData.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
      } else {
        setDocuments(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList, documentId?: string) => {
    if (!user || files.length === 0) return;

    setUploading(true);
    try {
      // Get client record
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (!clientData) return;

      const file = files[0];
      
      // Validate file
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size must be less than 10MB');
        return;
      }

      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('File type not allowed. Please upload PDF, DOC, DOCX, JPG, or PNG files.');
        return;
      }

      // Upload to Supabase Storage
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `${clientData.id}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('client-docs')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        alert('Failed to upload file');
        return;
      }

      // Get signed URL
      const { data: urlData } = await supabase.storage
        .from('client-docs')
        .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 year

      if (documentId) {
        // Update existing document request
        const { error: updateError } = await supabase
          .from('documents')
          .update({
            file_url: urlData?.signedUrl,
            file_size: file.size,
            status: 'pending',
            uploaded_at: new Date().toISOString()
          })
          .eq('id', documentId);

        if (updateError) {
          console.error('Error updating document:', updateError);
        } else {
          // Notify consultant
          await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              recipient_id: clientData.assigned_consultant_id,
              type: 'document_uploaded',
              payload: {
                document_name: file.name,
                client_name: user.user_metadata?.full_name
              },
              email_notification: true
            }),
          });
        }
      } else {
        // Create new document
        const { error: insertError } = await supabase
          .from('documents')
          .insert({
            client_id: clientData.id,
            name: file.name,
            type: file.type,
            category: 'other',
            status: 'pending',
            file_url: urlData?.signedUrl,
            file_size: file.size,
            uploaded_at: new Date().toISOString()
          });

        if (insertError) {
          console.error('Error creating document:', insertError);
        }
      }

      fetchDocuments();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'needs_revision': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'requested': return <Clock className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <X className="w-4 h-4" />;
      case 'needs_revision': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const documentRequests = documents.filter(doc => doc.is_request);
  const myDocuments = documents.filter(doc => !doc.is_request);

  if (loading) {
    return (
      <ClientLayout>
        <Helmet>
          <title>{t('documents.title')} - Consulting19</title>
        </Helmet>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <Helmet>
        <title>{t('documents.title')} - Consulting19</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('documents.title')}</h1>
        <p className="text-gray-600">{t('documents.subtitle')}</p>
      </div>

      {/* Upload Area */}
      <Card className="mb-8">
        <Card.Body>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('documents.uploadInstructions')}
            </h3>
            <p className="text-gray-600 mb-4">
              {t('documents.maxFileSize')} • {t('documents.allowedTypes')}
            </p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              disabled={uploading}
            />
            <label htmlFor="file-upload">
              <Button 
                as="span" 
                loading={uploading}
                disabled={uploading}
                icon={Upload}
              >
                {uploading ? t('common.loading') : t('documents.upload')}
              </Button>
            </label>
          </div>
        </Card.Body>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Document Requests */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">{t('documents.requests')}</h2>
          </Card.Header>
          <Card.Body>
            {documentRequests.length > 0 ? (
              <div className="space-y-4">
                {documentRequests.map((doc) => (
                  <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                        {doc.notes && (
                          <p className="text-sm text-gray-600 mt-1">{doc.notes}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(doc.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                          {t(`documents.status.${doc.status}`)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        <span>{doc.requested_by_consultant?.full_name}</span>
                      </div>
                      {doc.due_date && (
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{formatDate(doc.due_date)}</span>
                        </div>
                      )}
                    </div>

                    {doc.status === 'requested' && (
                      <div className="mt-3">
                        <input
                          type="file"
                          id={`upload-${doc.id}`}
                          className="hidden"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={(e) => e.target.files && handleFileUpload(e.target.files, doc.id)}
                        />
                        <label htmlFor={`upload-${doc.id}`}>
                          <Button 
                            as="span" 
                            size="sm" 
                            icon={Upload}
                            disabled={uploading}
                          >
                            {t('documents.upload')}
                          </Button>
                        </label>
                      </div>
                    )}

                    {doc.file_url && (
                      <div className="mt-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          icon={Download}
                          onClick={() => window.open(doc.file_url!, '_blank')}
                        >
                          {t('documents.download')}
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('documents.requestsEmptyState.title')}
                </h3>
                <p className="text-gray-600">
                  {t('documents.requestsEmptyState.description')}
                </p>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* My Documents */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">{t('documents.myDocuments')}</h2>
          </Card.Header>
          <Card.Body>
            {myDocuments.length > 0 ? (
              <div className="space-y-4">
                {myDocuments.map((doc) => (
                  <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span className="capitalize">{t(`documents.category.${doc.category}`)}</span>
                          {doc.file_size && (
                            <span>{(doc.file_size / 1024 / 1024).toFixed(1)} MB</span>
                          )}
                          {doc.uploaded_at && (
                            <span>{formatRelativeTime(doc.uploaded_at)}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(doc.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                          {t(`documents.status.${doc.status}`)}
                        </span>
                      </div>
                    </div>

                    {doc.notes && (
                      <p className="text-sm text-gray-600 mb-3">{doc.notes}</p>
                    )}

                    {doc.file_url && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        icon={Download}
                        onClick={() => window.open(doc.file_url!, '_blank')}
                      >
                        {t('documents.download')}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('documents.emptyState.title')}
                </h3>
                <p className="text-gray-600">
                  {t('documents.emptyState.description')}
                </p>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default ClientDocuments;