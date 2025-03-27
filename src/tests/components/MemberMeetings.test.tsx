import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemberMeetings } from '@/components/members/MemberMeetings';
import { useQuery } from '@tanstack/react-query';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MeetingStatus, MeetingType } from '@/types/meeting';

// Mock useQuery hook
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('MemberMeetings', () => {
  const mockMeetings = [
    {
      id: 1,
      title: 'Assemblée Générale 2024',
      description: 'AG annuelle',
      date: '2024-03-15',
      location: 'Salle Principale',
      type: MeetingType.GENERAL,
      status: MeetingStatus.PLANNED,
      participationStatus: 'REGISTERED',
    },
    {
      id: 2,
      title: 'Réunion Commission Formation',
      description: 'Réunion mensuelle',
      date: '2024-01-10',
      location: 'Salle B',
      type: MeetingType.COMMISSION,
      status: MeetingStatus.COMPLETED,
      participationStatus: 'ATTENDED',
    },
    {
      id: 3,
      title: 'Conseil d\'Administration',
      description: 'CA mensuel',
      date: '2024-02-01',
      location: 'Salle C',
      type: MeetingType.BOARD,
      status: MeetingStatus.PLANNED,
      participationStatus: 'REGISTERED',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useQuery as jest.Mock).mockReturnValue({
      data: mockMeetings,
      isLoading: false,
      error: null,
    });
  });

  it('renders meeting list', () => {
    render(<MemberMeetings memberId={1} />);

    expect(screen.getByText('Réunions')).toBeInTheDocument();
    expect(screen.getByText('Assemblée Générale 2024')).toBeInTheDocument();
    expect(screen.getByText('Réunion Commission Formation')).toBeInTheDocument();
    expect(screen.getByText('Conseil d\'Administration')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<MemberMeetings memberId={1} />);
    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  it('displays meeting type labels', () => {
    render(<MemberMeetings memberId={1} />);

    expect(screen.getByText('Assemblée Générale')).toBeInTheDocument();
    expect(screen.getByText('Commission')).toBeInTheDocument();
    expect(screen.getByText('Conseil d\'Administration')).toBeInTheDocument();
  });

  it('displays meeting status badges', () => {
    render(<MemberMeetings memberId={1} />);

    const plannedBadges = screen.getAllByText('Planifiée');
    const completedBadge = screen.getByText('Terminée');

    plannedBadges.forEach(badge => {
      expect(badge).toHaveClass('bg-blue-100 text-blue-800');
    });
    expect(completedBadge).toHaveClass('bg-green-100 text-green-800');
  });

  it('displays participation status badges', () => {
    render(<MemberMeetings memberId={1} />);

    const registeredBadges = screen.getAllByText('Inscrit');
    const attendedBadge = screen.getByText('Présent');

    registeredBadges.forEach(badge => {
      expect(badge).toHaveClass('bg-blue-100 text-blue-800');
    });
    expect(attendedBadge).toHaveClass('bg-green-100 text-green-800');
  });

  it('navigates to meeting details on click', async () => {
    render(<MemberMeetings memberId={1} />);

    const viewButton = screen.getAllByRole('button')[0];
    await userEvent.click(viewButton);

    expect(mockNavigate).toHaveBeenCalledWith('/meetings/1');
  });

  it('displays meeting statistics', () => {
    render(<MemberMeetings memberId={1} />);

    expect(screen.getByText('Total: 3')).toBeInTheDocument();
    expect(screen.getByText('Assemblée Générale: 1')).toBeInTheDocument();
    expect(screen.getByText('Commission: 1')).toBeInTheDocument();
    expect(screen.getByText('Conseil d\'Administration: 1')).toBeInTheDocument();
  });

  it('allows searching meetings', async () => {
    render(<MemberMeetings memberId={1} />);

    const searchInput = screen.getByPlaceholderText('Rechercher une réunion...');
    await userEvent.type(searchInput, 'Commission');

    expect(screen.getByText('Réunion Commission Formation')).toBeInTheDocument();
    expect(screen.queryByText('Assemblée Générale 2024')).not.toBeInTheDocument();
  });

  it('formats dates in French', () => {
    render(<MemberMeetings memberId={1} />);

    expect(screen.getByText('15 mars 2024')).toBeInTheDocument();
    expect(screen.getByText('10 janvier 2024')).toBeInTheDocument();
    expect(screen.getByText('1 février 2024')).toBeInTheDocument();
  });

  it('displays location information', () => {
    render(<MemberMeetings memberId={1} />);

    expect(screen.getByText('Salle Principale')).toBeInTheDocument();
    expect(screen.getByText('Salle B')).toBeInTheDocument();
    expect(screen.getByText('Salle C')).toBeInTheDocument();
  });

  it('groups meetings by type', () => {
    render(<MemberMeetings memberId={1} />);

    const stats = screen.getByText((content, element) => {
      return content.includes('Assemblée Générale: 1') &&
             content.includes('Commission: 1') &&
             content.includes('Conseil d\'Administration: 1');
    });

    expect(stats).toBeInTheDocument();
  });

  it('handles API errors gracefully', () => {
    const errorMessage = 'Failed to fetch meetings';
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error(errorMessage),
    });

    render(<MemberMeetings memberId={1} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
