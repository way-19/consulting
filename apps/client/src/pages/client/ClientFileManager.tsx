import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  Folder, 
  File, 
  Upload, 
  Download, 
  Eye, 
  Trash2,
  Search,
  Filter,
  Grid,
  List,
  Plus,
  FolderPlus,
  Image,
  FileText,
  Archive,
  Video,
  Music,
  HardDrive,
  Cloud,
  Share2,
  MoreVertical,
  Star,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  X,
  Move,
  Copy,
  RefreshCw,
  SortAsc,
  ArrowLeft
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  file_type?: string;
  file_url?: string;
  file_size?: number;
  mime_type?: string;
  folder_path: string;
  parent_folder_id?: string;
  is_starred: boolean;
  is_shared: boolean;
  version: number;
  created_at: string;
  updated_at: string;
  created_by: {
    full_name: string;
    role: string;
  };
}

interface FolderStats {
  total_files: number;
  total_size: number;
  file_types: Record<string, number>;
}

const ClientFileManager = () => {
  const { user, profile } = useAuth();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState('/');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [folderStats, setFolderStats] = useState<FolderStats>({
    total_files: 0,
    total_size: 0,
    file_types: {}
  });
  const [showFilePreview, setShowFilePreview] = useState<FileItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user && profile) {
      fetchFiles();
    }
  }, [user, profile, currentPath]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      
      // Get client ID
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (clientError || !clientData) {
        console.error('Client fetch error:', clientError);
        return;
      }

      // Fetch files in current folder
      const { data: filesData, error: filesError } = await supabase
        .from('file_manager')
        .select(`
          *,
          created_by:user_profiles!file_manager_created_by_fkey(full_name, role)
        `)
        .eq('client_id', clientData.id)
        .eq('folder_path', currentPath)
        .order(sortBy, { ascending: sortDirection === 'asc' });

      if (filesError) {
        console.error('Error fetching files:', filesError);
        return;
      }

      setFiles(filesData || []);
      
      // Calculate folder stats
      calculateFolderStats(filesData || []);
      
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateFolderStats = (fileList: FileItem[]) => {
    const stats = fileList.reduce((acc, file) => {
      if (file.type === 'file') {
        acc.total_files++;
        acc.total_size += file.file_size || 0;
        
        const fileType = getFileCategory(file.mime_type || '');
        acc.file_types[fileType] = (acc.file_types[fileType] || 0) + 1;
      }
      return acc;
    }, {
      total_files: 0,
      total_size: 0,
      file_types: {} as Record<string, number>
    });

    setFolderStats(stats);
  };

  const handleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    try {
      setUploading(true);

      // Get client ID
      const { data: clientData } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id')
        .eq('profile_id', user?.id)
        .single();

      if (!clientData) {
        throw new Error('Client data not found');
      }

      const uploadPromises = Array.from(files).map(async (file) => {
        // Upload to Supabase Storage
        const fileName = `${Date.now()}-${file.name}`;
        const storagePath = `file-manager/${clientData.id}${currentPath}${fileName}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(storagePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('documents')
          .getPublicUrl(uploadData.path);

        // Save to file_manager table
        const { error: dbError } = await supabase
          .from('file_manager')
          .insert({
            client_id: clientData.id,
            created_by: user?.id,
            name: file.name,
            type: 'file',
            file_type: getFileCategory(file.type),
            file_url: urlData.publicUrl,
            file_size: file.size,
            mime_type: file.type,
            folder_path: currentPath,
            version: 1,
            is_starred: false,
            is_shared: false
          });

        if (dbError) throw dbError;

        return { success: true, fileName: file.name };
      });

      await Promise.all(uploadPromises);

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'files_uploaded',
          description: `Uploaded ${files.length} files to ${currentPath}`,
          payload: { 
            file_count: files.length,
            folder_path: currentPath
          }
        });

      // Notify consultant if assigned
      if (clientData.assigned_consultant_id) {
        await supabase.functions.invoke('notify', {
          body: {
            recipient_id: clientData.assigned_consultant_id,
            type: 'files_uploaded',
            payload: {
              client_name: profile?.full_name,
              file_count: files.length,
              folder_path: currentPath
            }
          }
        });
      }

      fetchFiles();
      alert(`Successfully uploaded ${files.length} file(s)!`);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) {
      alert('Please enter a folder name');
      return;
    }

    try {
      // Get client ID
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user?.id)
        .single();

      if (!clientData) {
        throw new Error('Client data not found');
      }

      const { error } = await supabase
        .from('file_manager')
        .insert({
          client_id: clientData.id,
          created_by: user?.id,
          name: newFolderName,
          type: 'folder',
          folder_path: currentPath,
          version: 1,
          is_starred: false,
          is_shared: false
        });

      if (error) throw error;

      setNewFolderName('');
      setShowCreateFolderModal(false);
      fetchFiles();
    } catch (err) {
      console.error('Create folder error:', err);
      alert('Failed to create folder. Please try again.');
    }
  };

  const toggleStar = async (fileId: string, isStarred: boolean) => {
    try {
      const { error } = await supabase
        .from('file_manager')
        .update({ is_starred: !isStarred })
        .eq('id', fileId);

      if (error) throw error;

      setFiles(prev => 
        prev.map(file => 
          file.id === fileId 
            ? { ...file, is_starred: !isStarred }
            : file
        )
      );
    } catch (err) {
      console.error('Toggle star error:', err);
    }
  };

  const deleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      // Get file info first
      const fileToDelete = files.find(f => f.id === fileId);
      if (!fileToDelete) return;

      // Delete from storage if it's a file
      if (fileToDelete.type === 'file' && fileToDelete.file_url) {
        const path = fileToDelete.file_url.split('/').pop();
        if (path) {
          await supabase.storage
            .from('documents')
            .remove([`file-manager/${path}`]);
        }
      }

      // Delete from database
      const { error } = await supabase
        .from('file_manager')
        .delete()
        .eq('id', fileId);

      if (error) throw error;

      setFiles(prev => prev.filter(file => file.id !== fileId));
      
      // Remove from selected files
      setSelectedFiles(prev => prev.filter(id => id !== fileId));

    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete file. Please try again.');
    }
  };

  const getFileIcon = (fileType: string, mimeType: string = '') => {
    if (fileType === 'folder') return <Folder className="w-8 h-8 text-blue-500" />;
    
    if (mimeType.startsWith('image/')) return <Image className="w-8 h-8 text-green-500" />;
    if (mimeType.startsWith('video/')) return <Video className="w-8 h-8 text-purple-500" />;
    if (mimeType.startsWith('audio/')) return <Music className="w-8 h-8 text-pink-500" />;
    if (mimeType.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />;
    if (mimeType.includes('zip') || mimeType.includes('rar')) return <Archive className="w-8 h-8 text-orange-500" />;
    
    return <File className="w-8 h-8 text-gray-500" />;
  };

  const getFileCategory = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('pdf')) return 'document';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return 'archive';
    return 'other';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getBreadcrumbs = () => {
    const parts = currentPath.split('/').filter(Boolean);
    const breadcrumbs = [{ name: 'Home', path: '/' }];
    
    let currentPathBuild = '';
    parts.forEach(part => {
      currentPathBuild += `/${part}`;
      breadcrumbs.push({ name: part, path: currentPathBuild });
    });
    
    return breadcrumbs;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || 
      (typeFilter === 'folders' && file.type === 'folder') ||
      (typeFilter !== 'folders' && typeFilter !== 'all' && getFileCategory(file.mime_type || '') === typeFilter);
    
    return matchesSearch && matchesType;
  });

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    // Folders first
    if (a.type === 'folder' && b.type === 'file') return -1;
    if (a.type === 'file' && b.type === 'folder') return 1;
    
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'size':
        aValue = a.file_size || 0;
        bValue = b.file_size || 0;
        break;
      case 'created':
        aValue = new Date(a.created_at);
        bValue = new Date(b.created_at);
        break;
      case 'modified':
        aValue = new Date(a.updated_at);
        bValue = new Date(b.updated_at);
        break;
      default:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleFileClick = (file: FileItem) => {
    if (file.type === 'folder') {
      setCurrentPath(currentPath === '/' ? `/${file.name}` : `${currentPath}/${file.name}`);
    } else {
      setShowFilePreview(file);
    }
  };

  const navigateToPath = (path: string) => {
    setCurrentPath(path);
    setSelectedFiles([]);
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const fileTypeStats = Object.entries(folderStats.file_types).map(([type, count]) => ({
    type,
    count,
    percentage: folderStats.total_files > 0 ? (count / folderStats.total_files) * 100 : 0
  }));

  if (loading) {
    return (
      <>
        <Helmet>
          <title>File Manager - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>File Manager - Client Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">File Manager</h1>
            <p className="text-gray-600 mt-1">Organize and manage your business documents</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCreateFolderModal(true)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              New Folder
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            />
          </div>
        </div>

        {/* Storage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Files</p>
                <p className="text-2xl font-bold text-blue-600">{folderStats.total_files}</p>
              </div>
              <File className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Storage Used</p>
                <p className="text-2xl font-bold text-green-600">{formatFileSize(folderStats.total_size)}</p>
              </div>
              <HardDrive className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Documents</p>
                <p className="text-2xl font-bold text-purple-600">{fileTypeStats.find(s => s.type === 'document')?.count || 0}</p>
              </div>
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Images</p>
                <p className="text-2xl font-bold text-orange-600">{fileTypeStats.find(s => s.type === 'image')?.count || 0}</p>
              </div>
              <Image className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <nav className="flex items-center space-x-2 text-sm">
            {getBreadcrumbs().map((crumb, index) => (
              <React.Fragment key={crumb.path}>
                {index > 0 && <span className="text-gray-400">/</span>}
                <button
                  onClick={() => navigateToPath(crumb.path)}
                  className={`px-2 py-1 rounded transition-colors ${
                    crumb.path === currentPath
                      ? 'bg-blue-100 text-blue-600 font-medium'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {crumb.name}
                </button>
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search files and folders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="folders">Folders</option>
                <option value="document">Documents</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="other">Other</option>
              </select>
              
              <select
                value={`${sortBy}-${sortDirection}`}
                onChange={(e) => {
                  const [sort, direction] = e.target.value.split('-');
                  setSortBy(sort);
                  setSortDirection(direction as 'asc' | 'desc');
                }}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="created-desc">Newest First</option>
                <option value="created-asc">Oldest First</option>
                <option value="size-desc">Size (Large-Small)</option>
                <option value="size-asc">Size (Small-Large)</option>
              </select>
              
              <div className="flex items-center bg-gray-100 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {selectedFiles.length > 0 && (
            <div className="mt-4 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
              <span className="text-sm text-blue-800">
                {selectedFiles.length} file(s) selected
              </span>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="w-4 h-4 mr-1 inline" />
                  Download
                </button>
                <button className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  <Trash2 className="w-4 h-4 mr-1 inline" />
                  Delete
                </button>
                <button
                  onClick={() => setSelectedFiles([])}
                  className="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* File Grid/List */}
        <div
          className={`bg-white rounded-lg shadow-sm border-2 transition-all duration-300 ${
            dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {dragActive && (
            <div className="absolute inset-0 bg-blue-100/50 flex items-center justify-center z-10 rounded-lg">
              <div className="text-center">
                <Upload className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <p className="text-xl font-semibold text-blue-900">Drop files here to upload</p>
              </div>
            </div>
          )}
          
          {sortedFiles.length > 0 ? (
            <div className={`p-6 ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4' : 'space-y-2'}`}>
              {sortedFiles.map((file) => (
                <div
                  key={file.id}
                  className={`group relative ${
                    viewMode === 'grid'
                      ? 'bg-gray-50 rounded-lg p-4 hover:bg-gray-100 cursor-pointer transition-all duration-200 hover:scale-105'
                      : 'flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors'
                  }`}
                  onClick={() => handleFileClick(file)}
                >
                  {viewMode === 'grid' ? (
                    // Grid View
                    <>
                      <div className="text-center">
                        <div className="mx-auto mb-3">
                          {getFileIcon(file.type, file.mime_type || '')}
                        </div>
                        <p className="text-sm font-medium text-gray-900 truncate mb-1">
                          {file.name}
                        </p>
                        {file.type === 'file' && file.file_size && (
                          <p className="text-xs text-gray-500">{formatFileSize(file.file_size)}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(file.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      {/* File Actions */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStar(file.id, file.is_starred);
                            }}
                            className={`p-1 rounded ${
                              file.is_starred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                            }`}
                          >
                            <Star className={`w-4 h-4 ${file.is_starred ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFileSelection(file.id);
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600 rounded"
                          >
                            <CheckCircle className={`w-4 h-4 ${selectedFiles.includes(file.id) ? 'text-blue-600' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* Shared indicator */}
                      {file.is_shared && (
                        <div className="absolute bottom-2 left-2">
                          <Share2 className="w-3 h-3 text-blue-500" />
                        </div>
                      )}
                    </>
                  ) : (
                    // List View
                    <>
                      <div className="flex items-center space-x-3 flex-1">
                        <input
                          type="checkbox"
                          checked={selectedFiles.includes(file.id)}
                          onChange={() => toggleFileSelection(file.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        {getFileIcon(file.type, file.mime_type || '')}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900">{file.name}</h3>
                            {file.is_starred && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            )}
                            {file.is_shared && (
                              <Share2 className="w-4 h-4 text-blue-500" />
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            {file.type === 'file' && file.file_size && (
                              <span>{formatFileSize(file.file_size)}</span>
                            )}
                            <span>Modified {new Date(file.updated_at).toLocaleDateString()}</span>
                            <span>By {file.created_by?.full_name}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {file.type === 'file' && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(file.file_url!, '_blank');
                              }}
                              className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const a = document.createElement('a');
                                a.href = file.file_url!;
                                a.download = file.name;
                                a.click();
                              }}
                              className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteFile(file.id);
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="relative">
                <Folder className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                {uploading ? 'Uploading Files...' : 'No Files in This Folder'}
              </h3>
              <p className="text-gray-600 mb-8">
                {uploading 
                  ? 'Please wait while your files are being uploaded'
                  : 'Drag and drop files here or use the upload button to add documents'
                }
              </p>
              
              {!uploading && (
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Files
                  </button>
                  <button
                    onClick={() => setShowCreateFolderModal(true)}
                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FolderPlus className="w-5 h-5 mr-2" />
                    Create Folder
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Create Folder Modal */}
        {showCreateFolderModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Folder</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Folder Name
                  </label>
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Enter folder name..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && createFolder()}
                    autoFocus
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateFolderModal(false);
                    setNewFolderName('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createFolder}
                  disabled={!newFolderName.trim()}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                  <FolderPlus className="w-4 h-4 mr-2 inline" />
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* File Preview Modal */}
        {showFilePreview && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{showFilePreview.name}</h3>
                <button
                  onClick={() => setShowFilePreview(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {showFilePreview.mime_type?.startsWith('image/') ? (
                  <img 
                    src={showFilePreview.file_url!} 
                    alt={showFilePreview.name}
                    className="max-w-full h-auto rounded-lg"
                  />
                ) : (
                  <div className="text-center py-12">
                    {getFileIcon(showFilePreview.type, showFilePreview.mime_type || '')}
                    <p className="text-lg font-medium text-gray-900 mt-4">{showFilePreview.name}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      {showFilePreview.file_size && formatFileSize(showFilePreview.file_size)}
                    </p>
                    <button
                      onClick={() => window.open(showFilePreview.file_url!, '_blank')}
                      className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Open File
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ClientFileManager;