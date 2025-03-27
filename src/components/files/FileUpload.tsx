import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'react-hot-toast';
import { Upload, X, FileIcon, Download, Eye } from 'lucide-react';

interface FileUploadProps {
  onUpload: (files: File[]) => Promise<void>;
  maxFiles?: number;
  maxSize?: number;
  accept?: Record<string, string[]>;
  value?: Array<{ id: string; name: string; url: string }>;
  onChange?: (files: Array<{ id: string; name: string; url: string }>) => void;
}

export function FileUpload({
  onUpload,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  accept = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'image/*': ['.png', '.jpg', '.jpeg'],
  },
  value = [],
  onChange,
}: FileUploadProps) {
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const onDrop = React.useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setUploading(true);
        setProgress(0);

        // Simuler la progression
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 95) {
              clearInterval(interval);
              return prev;
            }
            return prev + 5;
          });
        }, 100);

        await onUpload(acceptedFiles);
        
        clearInterval(interval);
        setProgress(100);
        toast.success('Fichiers téléversés avec succès');
      } catch (error) {
        toast.error('Erreur lors du téléversement');
        console.error('Upload error:', error);
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept,
  });

  const removeFile = (fileId: string) => {
    if (onChange) {
      onChange(value.filter((file) => file.id !== fileId));
    }
  };

  const previewFile = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? 'Déposez les fichiers ici...'
            : 'Glissez-déposez des fichiers ici, ou cliquez pour sélectionner'}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {Object.values(accept)
            .flat()
            .join(', ')}{' '}
          jusqu'à {maxSize / 1024 / 1024}MB
        </p>
      </div>

      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-gray-500 text-center">{progress}%</p>
        </div>
      )}

      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <FileIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium">{file.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => previewFile(file.url)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(file.url)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
