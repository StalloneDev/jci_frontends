import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/Button';
import { FileDown } from 'lucide-react';

interface ExportButtonProps {
  onExport: (format: string) => void;
  formats?: string[];
}

export const ExportButton: React.FC<ExportButtonProps> = ({ onExport, formats = ['PDF', 'EXCEL', 'CSV'] }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <FileDown className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {formats.map((format) => (
          <DropdownMenuItem
            key={format}
            onClick={() => onExport(format)}
          >
            Exporter en {format}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
