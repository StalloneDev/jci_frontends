import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemberTrainings } from '@/components/members/MemberTrainings';
import { useQuery } from '@tanstack/react-query';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { TrainingStatus } from '@/types/training';

// Mock useQuery hook
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('MemberTrainings', () => {
  const mockTrainings = [
    {
      id: 1,
      title: 'Formation Leadership',
      description: 'Formation sur le leadership',
      date: '2024-03-15',
      location: 'Salle A',
      status: TrainingStatus.PLANNED,
      participationStatus: 'REGISTERED',
      maxParticipants: 20,
      commissionId: 1,
    },
    {
      id: 2,
      title: 'Gestion de Projet',
      description: 'Formation sur la gestion de projet',
      date: '2024-01-10',
      location: 'Salle B',
      status: TrainingStatus.COMPLETED,
      participationStatus: 'ATTENDED',
      maxParticipants: 15,
      commissionId: 2,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useQuery as jest.Mock).mockReturnValue({
      data: mockTrainings,
      isLoading: false,
      error: null,
    });
  });

  it('renders training list', () => {
    render(<MemberTrainings memberId={1} />);

    expect(screen.getByText('Formations suivies')).toBeInTheDocument();
    expect(screen.getByText('Formation Leadership')).toBeInTheDocument();
    expect(screen.getByText('Gestion de Projet')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<MemberTrainings memberId={1} />);
    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  it('displays training status badges', () => {
    render(<MemberTrainings memberId={1} />);

    const plannedBadge = screen.getByText('Planifiée');
    const completedBadge = screen.getByText('Terminée');

    expect(plannedBadge).toHaveClass('bg-blue-100 text-blue-800');
    expect(completedBadge).toHaveClass('bg-green-100 text-green-800');
  });

  it('displays participation status badges', () => {
    render(<MemberTrainings memberId={1} />);

    const registeredBadge = screen.getByText('Inscrit');
    const attendedBadge = screen.getByText('Présent');

    expect(registeredBadge).toHaveClass('bg-blue-100 text-blue-800');
    expect(attendedBadge).toHaveClass('bg-green-100 text-green-800');
  });

  it('navigates to training details on click', async () => {
    render(<MemberTrainings memberId={1} />);

    const viewButton = screen.getAllByRole('button')[0];
    await userEvent.click(viewButton);

    expect(mockNavigate).toHaveBeenCalledWith('/trainings/1');
  });

  it('displays training statistics', () => {
    render(<MemberTrainings memberId={1} />);

    expect(screen.getByText('Total: 2')).toBeInTheDocument();
    expect(screen.getByText('Terminées: 1')).toBeInTheDocument();
  });

  it('allows searching trainings', async () => {
    render(<MemberTrainings memberId={1} />);

    const searchInput = screen.getByPlaceholderText('Rechercher une formation...');
    await userEvent.type(searchInput, 'Leadership');

    expect(screen.getByText('Formation Leadership')).toBeInTheDocument();
    expect(screen.queryByText('Gestion de Projet')).not.toBeInTheDocument();
  });

  it('formats dates in French', () => {
    render(<MemberTrainings memberId={1} />);

    expect(screen.getByText('15 mars 2024')).toBeInTheDocument();
    expect(screen.getByText('10 janvier 2024')).toBeInTheDocument();
  });

  it('displays location information', () => {
    render(<MemberTrainings memberId={1} />);

    expect(screen.getByText('Salle A')).toBeInTheDocument();
    expect(screen.getByText('Salle B')).toBeInTheDocument();
  });

  it('handles API errors gracefully', () => {
    const errorMessage = 'Failed to fetch trainings';
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error(errorMessage),
    });

    render(<MemberTrainings memberId={1} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
