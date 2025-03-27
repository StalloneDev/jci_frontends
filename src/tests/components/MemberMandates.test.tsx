import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemberMandates } from '@/components/members/MemberMandates';
import { useMandates } from '@/hooks/useMandates';
import { vi } from 'vitest';
import { Role } from '@/types/member';
import userEvent from '@testing-library/user-event';

// Mock the useMandates hook
vi.mock('@/hooks/useMandates');

describe('MemberMandates', () => {
  const mockMandates = [
    {
      id: 1,
      role: Role.PRESIDENT,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      isActive: true,
    },
    {
      id: 2,
      role: Role.SECRETARY,
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      isActive: false,
    },
  ];

  const mockAddMandate = vi.fn();
  const mockUpdateMandate = vi.fn();

  beforeEach(() => {
    (useMandates as jest.Mock).mockReturnValue({
      mandates: mockMandates,
      isLoading: false,
      error: null,
      addMandate: { mutateAsync: mockAddMandate },
      updateMandate: { mutateAsync: mockUpdateMandate },
    });
  });

  it('renders mandates list', () => {
    render(<MemberMandates memberId={1} />);

    expect(screen.getByText('Mandats')).toBeInTheDocument();
    expect(screen.getByText('Président')).toBeInTheDocument();
    expect(screen.getByText('Secrétaire')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    (useMandates as jest.Mock).mockReturnValue({
      mandates: [],
      isLoading: true,
      error: null,
    });

    render(<MemberMandates memberId={1} />);
    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    const errorMessage = 'Failed to load mandates';
    (useMandates as jest.Mock).mockReturnValue({
      mandates: [],
      isLoading: false,
      error: errorMessage,
    });

    render(<MemberMandates memberId={1} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('opens add mandate dialog', async () => {
    render(<MemberMandates memberId={1} />);

    const addButton = screen.getByRole('button', { name: /nouveau mandat/i });
    await userEvent.click(addButton);

    expect(screen.getByText('Ajouter un mandat')).toBeInTheDocument();
    expect(screen.getByLabelText('Rôle')).toBeInTheDocument();
    expect(screen.getByLabelText('Date de début')).toBeInTheDocument();
    expect(screen.getByLabelText('Date de fin')).toBeInTheDocument();
  });

  it('submits new mandate', async () => {
    render(<MemberMandates memberId={1} />);

    // Open dialog
    const addButton = screen.getByRole('button', { name: /nouveau mandat/i });
    await userEvent.click(addButton);

    // Fill form
    await userEvent.selectOptions(screen.getByLabelText('Rôle'), Role.TREASURER);
    await userEvent.type(screen.getByLabelText('Date de début'), '2025-01-01');
    await userEvent.type(screen.getByLabelText('Date de fin'), '2025-12-31');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /ajouter/i });
    await userEvent.click(submitButton);

    expect(mockAddMandate).toHaveBeenCalledWith({
      role: Role.TREASURER,
      startDate: '2025-01-01',
      endDate: '2025-12-31',
    });
  });

  it('toggles mandate status', async () => {
    render(<MemberMandates memberId={1} />);

    const activeButton = screen.getByText('Actif');
    await userEvent.click(activeButton);

    expect(mockUpdateMandate).toHaveBeenCalledWith({
      mandateId: 1,
      data: { isActive: false },
    });
  });

  it('validates form fields', async () => {
    render(<MemberMandates memberId={1} />);

    // Open dialog
    const addButton = screen.getByRole('button', { name: /nouveau mandat/i });
    await userEvent.click(addButton);

    // Try to submit without filling fields
    const submitButton = screen.getByRole('button', { name: /ajouter/i });
    await userEvent.click(submitButton);

    // Check for validation messages
    expect(screen.getByText(/le rôle est requis/i)).toBeInTheDocument();
    expect(screen.getByText(/la date de début est requise/i)).toBeInTheDocument();
    expect(screen.getByText(/la date de fin est requise/i)).toBeInTheDocument();
  });

  it('validates date range', async () => {
    render(<MemberMandates memberId={1} />);

    // Open dialog
    const addButton = screen.getByRole('button', { name: /nouveau mandat/i });
    await userEvent.click(addButton);

    // Fill form with invalid dates
    await userEvent.selectOptions(screen.getByLabelText('Rôle'), Role.TREASURER);
    await userEvent.type(screen.getByLabelText('Date de début'), '2025-12-31');
    await userEvent.type(screen.getByLabelText('Date de fin'), '2025-01-01');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /ajouter/i });
    await userEvent.click(submitButton);

    expect(screen.getByText(/la date de fin doit être après la date de début/i)).toBeInTheDocument();
  });

  it('displays mandate dates in French format', () => {
    render(<MemberMandates memberId={1} />);

    expect(screen.getByText(/1 janvier 2024/i)).toBeInTheDocument();
    expect(screen.getByText(/31 décembre 2024/i)).toBeInTheDocument();
  });
});
