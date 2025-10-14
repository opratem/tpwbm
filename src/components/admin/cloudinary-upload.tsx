"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, X, CheckCircle, AlertCircle, Loader2, Image, FileImage, Camera } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UploadResult {
  filename: string;
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
  compressionInfo?: {
    originalSize: string;
    compressionLevel: number;
  };
}

interface CloudinaryUploadProps {
  onUploadComplete?: (results: UploadResult[]) => void;
  defaultContentType?: 'blog' | 'event' | 'gallery' | 'default';
  maxFiles?: number;
}

export default function CloudinaryUpload({
  onUploadComplete,
  defaultContentType = 'default',
  maxFiles = 10
}: CloudinaryUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<UploadResult[]>([]);
  const [folder, setFolder] = useState('church_media');
  const [tags, setTags] = useState('church,media');
  const [contentType, setContentType] = useState(defaultContentType);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const contentTypeInfo = {
    blog: {
      icon: <FileImage className="h-4 w-4" />,
      label: 'Blog Images',
      description: 'Optimized for blog posts (1200x800, 80% quality)',
      color: 'bg-blue-100 text-blue-800'
    },
    event: {
      icon: <Image className="h-4 w-4" />,
      label: 'Event Flyers',
      description: 'Optimized for event flyers (1080x1350, 85% quality)',
      color: 'bg-green-100 text-green-800'
    },
    gallery: {
      icon: <Camera className="h-4 w-4" />,
      label: 'Gallery Photos',
      description: 'High quality for gallery (1600x1200, 90% quality)',
      color: 'bg-purple-100 text-purple-800'
    },
    default: {
      icon: <Upload className="h-4 w-4" />,
      label: 'General Images',
      description: 'Standard compression (1024x768, 75% quality)',
      color: 'bg-gray-100 text-gray-800'
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);

    // Validate file types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const validFiles = selectedFiles.filter(file => allowedTypes.includes(file.type));

    if (validFiles.length !== selectedFiles.length) {
      alert('Some files were skipped. Only JPEG, PNG, and WebP images are allowed.');
    }

    // Check max files limit
    const totalFiles = files.length + validFiles.length;
    if (totalFiles > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed. Some files were not added.`);
      const remainingSlots = maxFiles - files.length;
      setFiles(prev => [...prev, ...validFiles.slice(0, remainingSlots)]);
    } else {
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setResults([]);

    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      formData.append('folder', folder);
      formData.append('tags', tags);
      formData.append('contentType', contentType);

      const response = await fetch('/api/upload', {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.results);
        setFiles([]); // Clear files after successful upload
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        // Call the callback if provided
        if (onUploadComplete) {
          onUploadComplete(data.results);
        }
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setResults([{
        filename: 'Upload Error',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }]);
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setFiles([]);
    setResults([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getTotalSize = () => {
    return files.reduce((total, file) => total + file.size, 0);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const currentInfo = contentTypeInfo[contentType];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Image Upload & Compression
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Content Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="contentType">Image Type</Label>
            <Select value={contentType} onValueChange={(value: any) => setContentType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select image type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(contentTypeInfo).map(([key, info]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      {info.icon}
                      <span>{info.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Badge className={currentInfo.color}>
                {currentInfo.icon}
                <span className="ml-1">{currentInfo.label}</span>
              </Badge>
              <span className="text-sm text-gray-600">{currentInfo.description}</span>
            </div>
          </div>

          {/* Upload Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="folder">Folder</Label>
              <Input
                id="folder"
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                placeholder="e.g., events, blog, gallery"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., church, events, ministry"
              />
            </div>
          </div>

          {/* File Selection */}
          <div className="space-y-4">
            <Label>Select Images</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <Label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-gray-600">
                  Click to select images or drag and drop
                </span>
                <span className="text-sm text-gray-500">
                  JPEG, PNG, WebP up to 10MB each (max {maxFiles} files)
                </span>
              </Label>
            </div>
          </div>

          {/* Selected Files */}
          {files.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Selected Files ({files.length})</Label>
                <div className="text-sm text-gray-600">
                  Total size: {formatFileSize(getTotalSize())}
                </div>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <FileImage className="h-4 w-4 text-blue-600" />
                      <span className="text-sm truncate">{file.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {formatFileSize(file.size)}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Actions */}
          <div className="flex gap-2">
            <Button
              onClick={uploadFiles}
              disabled={files.length === 0 || uploading}
              className="flex-1"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading & Compressing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload {files.length > 0 ? `${files.length} Files` : 'Files'}
                </>
              )}
            </Button>
            {(files.length > 0 || results.length > 0) && (
              <Button variant="outline" onClick={resetUpload}>
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upload Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {result.success ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="font-medium">{result.filename}</span>
                    </div>
                    {result.success && result.compressionInfo && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Badge variant="outline">
                          {result.compressionInfo.originalSize}
                        </Badge>
                        <Badge variant="outline">
                          {result.compressionInfo.compressionLevel}% quality
                        </Badge>
                      </div>
                    )}
                  </div>
                  {result.success && result.url && (
                    <div className="mt-2">
                      <Input
                        value={result.url}
                        readOnly
                        className="text-sm"
                        onClick={(e) => e.currentTarget.select()}
                      />
                    </div>
                  )}
                  {result.error && (
                    <p className="text-red-600 text-sm mt-1">{result.error}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
