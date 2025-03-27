import React from 'react';
import { render, screen } from '@testing-library/react';
import { MandateStats } from '@/components/members/MandateStats';
import { Role } from '@/types/member';

// Mock react-chartjs-2
jest.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="bar-chart" />,
  Pie: () => <div data-testid="pie-chart" />,
}));

describe('MandateStats', () => {
  const mockMandates = [
    {
      id: 1,
      role: Role.PRESIDENT,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      isActive: true,
      memberId: 1,
    },
    {
      id: 2,
      role: Role.SECRETARY,
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      isActive: false,
      memberId: 1,
    },
    {
      id: 3,
      role: Role.TREASURER,
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      isActive: true,
      memberId: 1,
    },
  ];

  it('renders all chart components', () => {
    render(<MandateStats mandates={mockMandates} />);
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  it('displays correct total mandates count', () => {
    render(<MandateStats mandates={mockMandates} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('displays correct active mandates count', () => {
    render(<MandateStats mandates={mockMandates} />);
    const activeCount = mockMandates.filter(m => m.isActive).length;
    expect(screen.getByText(activeCount.toString())).toBeInTheDocument();
  });

  it('calculates average duration correctly', () => {
    render(<MandateStats mandates={mockMandates} />);
    // Le format est "X.X" mois
    expect(screen.getByText(/\d+\.\d+/)).toBeInTheDocument();
  });

  it('handles empty mandates array', () => {
    render(<MandateStats mandates={[]} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('displays statistics labels', () => {
    render(<MandateStats mandates={mockMandates} />);
    expect(screen.getByText('Total des mandats')).toBeInTheDocument();
    expect(screen.getByText('Mandats actifs')).toBeInTheDocument();
    expect(screen.getByText(/Durée moyenne/)).toBeInTheDocument();
  });
});
