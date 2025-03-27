import { renderHook, act } from '@testing-library/react';
import { useTrainings } from '@/hooks/useTrainings';
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

describe('useTrainings', () => {
  const mockTrainings = [
    {
      id: 1,
      title: 'Formation A',
      description: 'Description A',
      date: '2025-02-01',
      commission: { id: 1, name: 'Commission A' },
      participants: [{ id: 1, firstName: 'John', lastName: 'Doe' }],
    },
    {
      id: 2,
      title: 'Formation B',
      description: 'Description B',
      date: '2025-02-15',
      commission: { id: 2, name: 'Commission B' },
      participants: [],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (api.get as jest.Mock).mockResolvedValue({ data: mockTrainings });
  });

  it('fetches trainings on mount', async () => {
    const { result } = renderHook(() => useTrainings());

    expect(result.current.loading).toBe(true);
    expect(result.current.trainings).toEqual([]);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(api.get).toHaveBeenCalledWith('/trainings');
    expect(result.current.loading).toBe(false);
    expect(result.current.trainings).toEqual(mockTrainings);
    expect(result.current.error).toBeNull();
  });

  it('handles API error', async () => {
    const error = new Error('Failed to fetch trainings');
    (api.get as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useTrainings());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.trainings).toEqual([]);
    expect(result.current.error).toBe('Failed to fetch trainings');
  });

  it('creates a new training', async () => {
    const newTraining = {
      title: 'New Training',
      description: 'New Description',
      date: '2025-03-01',
      commissionId: 1,
    };

    (api.post as jest.Mock).mockResolvedValue({ data: { id: 3, ...newTraining, participants: [] } });

    const { result } = renderHook(() => useTrainings());

    await act(async () => {
      await result.current.createTraining(newTraining);
    });

    expect(api.post).toHaveBeenCalledWith('/trainings', newTraining);
    expect(result.current.error).toBeNull();
  });

  it('updates a training', async () => {
    const updatedTraining = {
      id: 1,
      title: 'Updated Training',
      description: 'Updated Description',
      date: '2025-03-15',
      commissionId: 2,
    };

    (api.put as jest.Mock).mockResolvedValue({ data: updatedTraining });

    const { result } = renderHook(() => useTrainings());

    await act(async () => {
      await result.current.updateTraining(1, updatedTraining);
    });

    expect(api.put).toHaveBeenCalledWith('/trainings/1', updatedTraining);
    expect(result.current.error).toBeNull();
  });

  it('deletes a training', async () => {
    (api.delete as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() => useTrainings());

    await act(async () => {
      await result.current.deleteTraining(1);
    });

    expect(api.delete).toHaveBeenCalledWith('/trainings/1');
    expect(result.current.error).toBeNull();
  });

  it('adds a participant to a training', async () => {
    const trainingId = 1;
    const memberId = 2;

    (api.post as jest.Mock).mockResolvedValue({ data: { success: true } });

    const { result } = renderHook(() => useTrainings());

    await act(async () => {
      await result.current.addParticipant(trainingId, memberId);
    });

    expect(api.post).toHaveBeenCalledWith(`/trainings/${trainingId}/participants`, { memberId });
    expect(result.current.error).toBeNull();
  });

  it('removes a participant from a training', async () => {
    const trainingId = 1;
    const memberId = 2;

    (api.delete as jest.Mock).mockResolvedValue({ data: { success: true } });

    const { result } = renderHook(() => useTrainings());

    await act(async () => {
      await result.current.removeParticipant(trainingId, memberId);
    });

    expect(api.delete).toHaveBeenCalledWith(`/trainings/${trainingId}/participants/${memberId}`);
    expect(result.current.error).toBeNull();
  });
});
