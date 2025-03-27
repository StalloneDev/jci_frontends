import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FileUpload } from '@/components/files/FileUpload';
import { vi } from 'vitest';

describe('FileUpload', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders upload area', () => {
    render(
      <FileUpload
        value={[]}
        onChange={mockOnChange}
        accept="image/*"
      />
    );

    expect(screen.getByText(/glisser et déposer/i)).toBeInTheDocument();
    expect(screen.getByText(/ou cliquer pour sélectionner/i)).toBeInTheDocument();
  });

  it('handles file selection', async () => {
    render(
      <FileUpload
        value={[]}
        onChange={mockOnChange}
        accept="image/*"
      />
    );

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = screen.getByTestId('file-input');

    Object.defineProperty(input, 'files', {
      value: [file],
    });

    fireEvent.change(input);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith([file]);
    });
  });

  it('validates file type', async () => {
    render(
      <FileUpload
        value={[]}
        onChange={mockOnChange}
        accept="image/*"
      />
    );

    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByTestId('file-input');

    Object.defineProperty(input, 'files', {
      value: [file],
    });

    fireEvent.change(input);

    await waitFor(() => {
      expect(screen.getByText(/type de fichier non autorisé/i)).toBeInTheDocument();
      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  it('respects maxFiles limit', async () => {
    render(
      <FileUpload
        value={[]}
        onChange={mockOnChange}
        accept="image/*"
        maxFiles={2}
      />
    );

    const files = [
      new File(['test1'], 'test1.png', { type: 'image/png' }),
      new File(['test2'], 'test2.png', { type: 'image/png' }),
      new File(['test3'], 'test3.png', { type: 'image/png' }),
    ];

    const input = screen.getByTestId('file-input');

    Object.defineProperty(input, 'files', {
      value: files,
    });

    fireEvent.change(input);

    await waitFor(() => {
      expect(screen.getByText(/nombre maximum de fichiers dépassé/i)).toBeInTheDocument();
      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  it('handles drag and drop', async () => {
    render(
      <FileUpload
        value={[]}
        onChange={mockOnChange}
        accept="image/*"
      />
    );

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const dropzone = screen.getByTestId('dropzone');

    fireEvent.dragOver(dropzone);
    expect(dropzone).toHaveClass('border-primary');

    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith([file]);
    });
  });

  it('shows file preview', () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    URL.createObjectURL = vi.fn(() => 'blob:test');

    render(
      <FileUpload
        value={[file]}
        onChange={mockOnChange}
        accept="image/*"
      />
    );

    expect(screen.getByText('test.png')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /supprimer/i })).toBeInTheDocument();
  });

  it('allows file removal', async () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    render(
      <FileUpload
        value={[file]}
        onChange={mockOnChange}
        accept="image/*"
      />
    );

    const removeButton = screen.getByRole('button', { name: /supprimer/i });
    fireEvent.click(removeButton);

    expect(mockOnChange).toHaveBeenCalledWith([]);
  });

  it('shows upload progress', async () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const progress = 50;

    render(
      <FileUpload
        value={[file]}
        onChange={mockOnChange}
        accept="image/*"
        uploadProgress={{ [file.name]: progress }}
      />
    );

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', progress.toString());
  });
});
