import { renderHook, act } from '@testing-library/react';
import { useMembers } from '@/hooks/useMembers';
import { api } from '@/lib/api';

// Mock the API module
jest.mock('@/lib/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('useMembers', () => {
  const mockMembers = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      commission: { id: 1, name: 'Commission A' },
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      commission: { id: 2, name: 'Commission B' },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (api.get as jest.Mock).mockResolvedValue({ data: mockMembers });
  });

  it('fetches members on mount', async () => {
    const { result } = renderHook(() => useMembers());

    expect(result.current.loading).toBe(true);
    expect(result.current.members).toEqual([]);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(api.get).toHaveBeenCalledWith('/members');
    expect(result.current.loading).toBe(false);
    expect(result.current.members).toEqual(mockMembers);
    expect(result.current.error).toBeNull();
  });

  it('handles API error', async () => {
    const error = new Error('Failed to fetch members');
    (api.get as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useMembers());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.members).toEqual([]);
    expect(result.current.error).toBe('Failed to fetch members');
  });

  it('creates a new member', async () => {
    const newMember = {
      firstName: 'New',
      lastName: 'Member',
      email: 'new@example.com',
    };

    (api.post as jest.Mock).mockResolvedValue({ data: { id: 3, ...newMember } });

    const { result } = renderHook(() => useMembers());

    await act(async () => {
      await result.current.createMember(newMember);
    });

    expect(api.post).toHaveBeenCalledWith('/members', newMember);
    expect(result.current.error).toBeNull();
  });

  it('updates a member', async () => {
    const updatedMember = {
      id: 1,
      firstName: 'Updated',
      lastName: 'Member',
      email: 'updated@example.com',
    };

    (api.put as jest.Mock).mockResolvedValue({ data: updatedMember });

    const { result } = renderHook(() => useMembers());

    await act(async () => {
      await result.current.updateMember(1, updatedMember);
    });

    expect(api.put).toHaveBeenCalledWith('/members/1', updatedMember);
    expect(result.current.error).toBeNull();
  });

  it('deletes a member', async () => {
    (api.delete as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() => useMembers());

    await act(async () => {
      await result.current.deleteMember(1);
    });

    expect(api.delete).toHaveBeenCalledWith('/members/1');
    expect(result.current.error).toBeNull();
  });
});
