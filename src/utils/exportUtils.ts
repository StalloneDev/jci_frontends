import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { RoleMandate } from '@/types/member';

/**
 * Exporte les mandats au format Excel
 */
export const exportMandatesToExcel = (mandates: RoleMandate[], memberName: string) => {
  const workbook = XLSX.utils.book_new();
  
  const data = mandates.map(mandate => ({
    'Rôle': mandate.role,
    'Date de début': format(new Date(mandate.startDate), 'dd MMMM yyyy', { locale: fr }),
    'Date de fin': format(new Date(mandate.endDate), 'dd MMMM yyyy', { locale: fr }),
    'Statut': mandate.isActive ? 'Actif' : 'Terminé'
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Mandats');

  // Ajuster la largeur des colonnes
  const maxWidth = data.reduce((w, r) => Math.max(w, Object.values(r).join('').length), 10);
  const colWidth = Math.max(maxWidth, 20);
  worksheet['!cols'] = [
    { wch: colWidth },
    { wch: colWidth },
    { wch: colWidth },
    { wch: colWidth }
  ];

  XLSX.writeFile(workbook, `mandats_${memberName.replace(/\s+/g, '_')}.xlsx`);
};

/**
 * Exporte les mandats au format PDF
 */
export const exportMandatesToPDF = (mandates: RoleMandate[], memberName: string) => {
  const doc = new jsPDF();

  doc.setFont('helvetica');
  doc.setFontSize(16);
  doc.text(`Historique des mandats - ${memberName}`, 14, 15);

  const tableData = mandates.map(mandate => [
    mandate.role,
    format(new Date(mandate.startDate), 'dd MMMM yyyy', { locale: fr }),
    format(new Date(mandate.endDate), 'dd MMMM yyyy', { locale: fr }),
    mandate.isActive ? 'Actif' : 'Terminé'
  ]);

  (doc as any).autoTable({
    head: [['Rôle', 'Date de début', 'Date de fin', 'Statut']],
    body: tableData,
    startY: 25,
    styles: {
      fontSize: 10,
      cellPadding: 5,
      overflow: 'linebreak',
      halign: 'left'
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    }
  });

  doc.save(`mandats_${memberName.replace(/\s+/g, '_')}.pdf`);
};
