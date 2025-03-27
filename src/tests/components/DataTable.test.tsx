import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataTable } from '@/components/ui/DataTable';

describe('DataTable', () => {
  const mockData = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
  ];

  const mockColumns = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
  ];

  it('renders table with data', () => {
    render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        loading={false}
        searchPlaceholder="Search..."
      />
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(
      <DataTable
        columns={mockColumns}
        data={[]}
        loading={true}
        searchPlaceholder="Search..."
      />
    );

    expect(screen.getByText(/chargement/i)).toBeInTheDocument();
  });

  it('shows empty state', () => {
    render(
      <DataTable
        columns={mockColumns}
        data={[]}
        loading={false}
        searchPlaceholder="Search..."
      />
    );

    expect(screen.getByText(/aucun résultat/i)).toBeInTheDocument();
  });

  it('filters data based on search input', () => {
    render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        loading={false}
        searchPlaceholder="Search..."
      />
    );

    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'John' } });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument();
  });

  it('handles row click', () => {
    const handleRowClick = jest.fn();

    render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        loading={false}
        searchPlaceholder="Search..."
        onRowClick={handleRowClick}
      />
    );

    fireEvent.click(screen.getByText('John Doe'));
    expect(handleRowClick).toHaveBeenCalledWith(mockData[0]);
  });

  it('handles sorting', () => {
    render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        loading={false}
        searchPlaceholder="Search..."
      />
    );

    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);

    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Jane Doe');
    expect(rows[2]).toHaveTextContent('John Doe');

    fireEvent.click(nameHeader);
    expect(rows[1]).toHaveTextContent('John Doe');
    expect(rows[2]).toHaveTextContent('Jane Doe');
  });

  it('handles pagination', () => {
    const manyItems = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `Person ${i + 1}`,
      email: `person${i + 1}@example.com`,
    }));

    render(
      <DataTable
        columns={mockColumns}
        data={manyItems}
        loading={false}
        searchPlaceholder="Search..."
      />
    );

    expect(screen.getByText('Person 1')).toBeInTheDocument();
    expect(screen.queryByText('Person 25')).not.toBeInTheDocument();

    const nextPageButton = screen.getByLabelText(/page suivante/i);
    fireEvent.click(nextPageButton);

    expect(screen.queryByText('Person 1')).not.toBeInTheDocument();
    expect(screen.getByText('Person 11')).toBeInTheDocument();
  });
});
