import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdvancedFilters } from '@/components/members/AdvancedFilters';

describe('AdvancedFilters', () => {
  const mockOptions = {
    search: '',
    status: 'all',
    dateRange: { from: null, to: null },
    type: 'all',
  };

  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all filter components', () => {
    render(
      <AdvancedFilters
        options={mockOptions}
        onFilterChange={mockOnFilterChange}
        types={[
          { value: 'type1', label: 'Type 1' },
          { value: 'type2', label: 'Type 2' },
        ]}
        showTypeFilter
      />
    );

    expect(screen.getByPlaceholderText('Rechercher...')).toBeInTheDocument();
    expect(screen.getByText('Statut')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Sélectionner les dates')).toBeInTheDocument();
  });

  it('handles search input changes', async () => {
    render(
      <AdvancedFilters options={mockOptions} onFilterChange={mockOnFilterChange} />
    );

    const searchInput = screen.getByPlaceholderText('Rechercher...');
    await userEvent.type(searchInput, 'test');

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...mockOptions,
      search: 'test',
    });
  });

  it('handles status changes', async () => {
    render(
      <AdvancedFilters options={mockOptions} onFilterChange={mockOnFilterChange} />
    );

    const statusSelect = screen.getByText('Statut');
    await userEvent.click(statusSelect);
    await userEvent.click(screen.getByText('Actifs'));

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...mockOptions,
      status: 'active',
    });
  });

  it('handles type filter changes when enabled', async () => {
    render(
      <AdvancedFilters
        options={mockOptions}
        onFilterChange={mockOnFilterChange}
        types={[
          { value: 'type1', label: 'Type 1' },
          { value: 'type2', label: 'Type 2' },
        ]}
        showTypeFilter
      />
    );

    const typeSelect = screen.getByText('Type');
    await userEvent.click(typeSelect);
    await userEvent.click(screen.getByText('Type 1'));

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...mockOptions,
      type: 'type1',
    });
  });

  it('handles date range selection', async () => {
    render(
      <AdvancedFilters options={mockOptions} onFilterChange={mockOnFilterChange} />
    );

    const dateButton = screen.getByText('Sélectionner les dates');
    await userEvent.click(dateButton);

    // Simuler la sélection de dates
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...mockOptions,
      dateRange: {
        from: today,
        to: nextWeek,
      },
    });
  });

  it('resets all filters', async () => {
    const filledOptions = {
      search: 'test',
      status: 'active',
      dateRange: {
        from: new Date(),
        to: new Date(),
      },
      type: 'type1',
    };

    render(
      <AdvancedFilters
        options={filledOptions}
        onFilterChange={mockOnFilterChange}
        showTypeFilter
      />
    );

    const resetButton = screen.getByText('Réinitialiser');
    await userEvent.click(resetButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      search: '',
      status: 'all',
      type: 'all',
      dateRange: { from: null, to: null },
    });
  });

  it('does not show type filter when disabled', () => {
    render(
      <AdvancedFilters
        options={mockOptions}
        onFilterChange={mockOnFilterChange}
        showTypeFilter={false}
      />
    );

    expect(screen.queryByText('Type')).not.toBeInTheDocument();
  });

  it('displays selected date range correctly', () => {
    const selectedDates = {
      ...mockOptions,
      dateRange: {
        from: new Date('2024-01-01'),
        to: new Date('2024-12-31'),
      },
    };

    render(
      <AdvancedFilters
        options={selectedDates}
        onFilterChange={mockOnFilterChange}
      />
    );

    expect(screen.getByText(/1 janvier 2024/)).toBeInTheDocument();
    expect(screen.getByText(/31 décembre 2024/)).toBeInTheDocument();
  });
});
