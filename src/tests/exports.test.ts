import { exportToPDF, exportToExcel } from '@/lib/exports';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

// Mock jsPDF and XLSX
jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    text: jest.fn(),
    setFontSize: jest.fn(),
    save: jest.fn(),
    autoTable: jest.fn(),
  }));
});

jest.mock('xlsx', () => ({
  utils: {
    book_new: jest.fn(),
    json_to_sheet: jest.fn(),
    book_append_sheet: jest.fn(),
  },
  writeFile: jest.fn(),
}));

describe('Export Functions', () => {
  const mockData = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
  ];

  const mockColumns = [
    { header: 'Name', key: 'name' },
    { header: 'Email', key: 'email' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('exportToPDF', () => {
    it('creates a PDF document with correct data', () => {
      exportToPDF('Test Export', mockData, mockColumns, 'test-export');

      expect(jsPDF).toHaveBeenCalled();
      const mockPdf = (jsPDF as jest.Mock).mock.results[0].value;

      expect(mockPdf.setFontSize).toHaveBeenCalledWith(18);
      expect(mockPdf.text).toHaveBeenCalledWith('Test Export', 14, 22);
      expect(mockPdf.autoTable).toHaveBeenCalled();
      expect(mockPdf.save).toHaveBeenCalledWith('test-export.pdf');
    });

    it('formats data correctly for autoTable', () => {
      exportToPDF('Test Export', mockData, mockColumns, 'test-export');

      const mockPdf = (jsPDF as jest.Mock).mock.results[0].value;
      const autoTableCall = mockPdf.autoTable.mock.calls[0][0];

      expect(autoTableCall.head).toEqual([['Name', 'Email']]);
      expect(autoTableCall.body).toEqual([
        ['John Doe', 'john@example.com'],
        ['Jane Doe', 'jane@example.com'],
      ]);
    });
  });

  describe('exportToExcel', () => {
    it('creates an Excel workbook with correct data', () => {
      exportToExcel('Test Export', mockData, mockColumns, 'test-export');

      expect(XLSX.utils.book_new).toHaveBeenCalled();
      expect(XLSX.utils.json_to_sheet).toHaveBeenCalled();
      expect(XLSX.utils.book_append_sheet).toHaveBeenCalled();
      expect(XLSX.writeFile).toHaveBeenCalledWith(
        expect.anything(),
        'test-export.xlsx'
      );
    });

    it('formats data correctly for Excel', () => {
      exportToExcel('Test Export', mockData, mockColumns, 'test-export');

      const jsonToSheetCall = (XLSX.utils.json_to_sheet as jest.Mock).mock.calls[0][0];
      expect(jsonToSheetCall).toEqual([
        { Name: 'John Doe', Email: 'john@example.com' },
        { Name: 'Jane Doe', Email: 'jane@example.com' },
      ]);
    });
  });
});
