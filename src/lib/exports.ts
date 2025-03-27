import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Types
type ExportData = Record<string, any>[];
type Column = {
  header: string;
  key: string;
  format?: (value: any) => string;
};

// Utilitaires
const formatDate = (date: Date | string) => {
  return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
};

const formatDateTime = (date: Date | string) => {
  return format(new Date(date), 'dd MMMM yyyy HH:mm', { locale: fr });
};

// Export PDF
export const exportToPDF = (
  title: string,
  data: ExportData,
  columns: Column[],
  filename: string
) => {
  const doc = new jsPDF();

  // En-tête
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.text(`Généré le ${formatDateTime(new Date())}`, 14, 30);

  // Tableau
  const tableData = data.map(item =>
    columns.map(col => {
      const value = item[col.key];
      return col.format ? col.format(value) : value;
    })
  );

  (doc as any).autoTable({
    head: [columns.map(col => col.header)],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [63, 131, 248],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
  });

  doc.save(`${filename}.pdf`);
};

// Export Excel
export const exportToExcel = (
  title: string,
  data: ExportData,
  columns: Column[],
  filename: string
) => {
  // Préparer les données
  const excelData = data.map(item =>
    columns.reduce((acc, col) => {
      const value = item[col.key];
      acc[col.header] = col.format ? col.format(value) : value;
      return acc;
    }, {} as Record<string, any>)
  );

  // Créer le workbook
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);

  // Ajouter la feuille au workbook
  XLSX.utils.book_append_sheet(wb, ws, title);

  // Sauvegarder le fichier
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

// Colonnes prédéfinies pour différents types de données
export const memberColumns: Column[] = [
  { header: 'Prénom', key: 'firstName' },
  { header: 'Nom', key: 'lastName' },
  { header: 'Email', key: 'email' },
  { header: 'Téléphone', key: 'phone' },
  { header: 'Commission', key: 'commission.name' },
  {
    header: 'Date d\'inscription',
    key: 'createdAt',
    format: formatDate,
  },
];

export const trainingColumns: Column[] = [
  { header: 'Titre', key: 'title' },
  { header: 'Description', key: 'description' },
  { header: 'Commission', key: 'commission.name' },
  {
    header: 'Date',
    key: 'date',
    format: formatDate,
  },
  {
    header: 'Participants',
    key: 'participants',
    format: (participants: any[]) => participants?.length.toString() || '0',
  },
];

export const meetingColumns: Column[] = [
  { header: 'Titre', key: 'title' },
  { header: 'Description', key: 'description' },
  { header: 'Commission', key: 'commission.name' },
  {
    header: 'Date',
    key: 'date',
    format: formatDateTime,
  },
  {
    header: 'Participants',
    key: 'participants',
    format: (participants: any[]) => participants?.length.toString() || '0',
  },
];

// Fonction générique d'export
export const exportData = (
  type: 'pdf' | 'excel',
  title: string,
  data: ExportData,
  columns: Column[],
  filename: string
) => {
  if (type === 'pdf') {
    exportToPDF(title, data, columns, filename);
  } else {
    exportToExcel(title, data, columns, filename);
  }
};
