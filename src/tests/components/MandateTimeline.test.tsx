import React from 'react';
import { render, screen } from '@testing-library/react';
import { MandateTimeline } from '@/components/members/MandateTimeline';
import { Role } from '@/types/member';

// Mock react-vis car il utilise des fonctionnalités canvas
jest.mock('react-vis', () => ({
  Timeline: ({ items, itemRenderer }) => (
    <div data-testid="timeline">
      {items.map((item: any) => (
        <div key={item.id} data-testid={`timeline-item-${item.id}`}>
          {itemRenderer({ item, itemContext: { styles: {} }, getItemProps: () => ({}) })}
        </div>
      ))}
    </div>
  ),
}));

describe('MandateTimeline', () => {
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
  ];

  it('renders timeline component', () => {
    render(<MandateTimeline mandates={mockMandates} />);
    expect(screen.getByTestId('timeline')).toBeInTheDocument();
  });

  it('displays correct number of timeline items', () => {
    render(<MandateTimeline mandates={mockMandates} />);
    const items = screen.getAllByTestId(/timeline-item/);
    expect(items).toHaveLength(2);
  });

  it('formats dates correctly', () => {
    render(<MandateTimeline mandates={mockMandates} />);
    expect(screen.getByText(/janv\. 2024/)).toBeInTheDocument();
    expect(screen.getByText(/déc\. 2024/)).toBeInTheDocument();
  });

  it('displays role labels', () => {
    render(<MandateTimeline mandates={mockMandates} />);
    expect(screen.getByText('Président')).toBeInTheDocument();
    expect(screen.getByText('Secrétaire')).toBeInTheDocument();
  });

  it('handles empty mandates array', () => {
    render(<MandateTimeline mandates={[]} />);
    expect(screen.getByTestId('timeline')).toBeInTheDocument();
  });

  it('displays chronological order', () => {
    render(<MandateTimeline mandates={mockMandates} />);
    const items = screen.getAllByTestId(/timeline-item/);
    expect(items[0]).toHaveTextContent('Président');
    expect(items[1]).toHaveTextContent('Secrétaire');
  });
});
