import { renderHook, act } from '@testing-library/react';
import { useMandates } from '@/hooks/useMandates';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { vi } from 'vitest';
import { Role } from '@/types/member';

// Mock axios
vi.mock('@/lib/axios');

describe('useMandates', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

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

  beforeEach(() => {
    queryClient.clear();
    vi.clearAllMocks();
  });

  it('should fetch mandates', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { mandates: mockMandates },
    });

    const { result } = renderHook(() => useMandates({ memberId: 1 }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.mandates).toBeUndefined();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.mandates).toEqual(mockMandates);
    expect(axios.get).toHaveBeenCalledWith('/api/members/1/mandates');
  });

  it('should add a new mandate', async () => {
    const newMandate = {
      role: Role.TREASURER,
      startDate: '2025-01-01',
      endDate: '2025-12-31',
    };

    (axios.post as jest.Mock).mockResolvedValueOnce({
      data: { ...newMandate, id: 3, isActive: true },
    });

    const { result } = renderHook(() => useMandates({ memberId: 1 }), {
      wrapper,
    });

    await act(async () => {
      await result.current.addMandate.mutateAsync(newMandate);
    });

    expect(axios.post).toHaveBeenCalledWith('/api/members/1/mandates', newMandate);
    expect(result.current.error).toBeNull();
  });

  it('should update a mandate', async () => {
    const updateData = {
      endDate: '2024-06-30',
      isActive: false,
    };

    (axios.put as jest.Mock).mockResolvedValueOnce({
      data: { ...mockMandates[0], ...updateData },
    });

    const { result } = renderHook(() => useMandates({ memberId: 1 }), {
      wrapper,
    });

    await act(async () => {
      await result.current.updateMandate.mutateAsync({
        mandateId: 1,
        data: updateData,
      });
    });

    expect(axios.put).toHaveBeenCalledWith(
      '/api/members/1/mandates/1',
      updateData
    );
    expect(result.current.error).toBeNull();
  });

  it('should handle errors when fetching mandates', async () => {
    const error = new Error('Failed to fetch mandates');
    (axios.get as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useMandates({ memberId: 1 }), {
      wrapper,
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBe('Failed to fetch mandates');
  });

  it('should handle errors when adding a mandate', async () => {
    const error = { response: { data: { message: 'Invalid dates' } } };
    (axios.post as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useMandates({ memberId: 1 }), {
      wrapper,
    });

    await act(async () => {
      try {
        await result.current.addMandate.mutateAsync({
          role: Role.TREASURER,
          startDate: '2025-01-01',
          endDate: '2024-12-31', // Invalid: end before start
        });
      } catch {}
    });

    expect(result.current.error).toBe('Invalid dates');
  });

  it('should handle errors when updating a mandate', async () => {
    const error = { response: { data: { message: 'Mandate not found' } } };
    (axios.put as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useMandates({ memberId: 1 }), {
      wrapper,
    });

    await act(async () => {
      try {
        await result.current.updateMandate.mutateAsync({
          mandateId: 999, // Non-existent ID
          data: { isActive: false },
        });
      } catch {}
    });

    expect(result.current.error).toBe('Mandate not found');
  });
});
