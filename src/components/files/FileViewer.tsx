import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface FileViewerProps {
  file: { name: string; url: string; type?: string } | null;
  onClose: () => void;
}

export function FileViewer({ file, onClose }: FileViewerProps) {
  if (!file) return null;

  const isImage = file.type?.startsWith('image/') || file.url.match(/\.(jpg|jpeg|png|gif)$/i);
  const isPdf = file.type === 'application/pdf' || file.url.endsWith('.pdf');

  return (
    <Dialog open={!!file} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{file.name}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {isImage ? (
            <img
              src={file.url}
              alt={file.name}
              className="max-w-full h-auto rounded-lg"
            />
          ) : isPdf ? (
            <iframe
              src={`${file.url}#view=FitH`}
              className="w-full h-[80vh] rounded-lg"
              title={file.name}
            />
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p>Aperçu non disponible</p>
              <a
                href={file.url}
                download
                className="mt-4 inline-block text-primary hover:underline"
              >
                Télécharger le fichier
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
