import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { useNotifications } from '@/hooks/useNotifications';
import { vi } from 'vitest';

// Mock useNotifications hook
vi.mock('@/hooks/useNotifications', () => ({
  useNotifications: vi.fn(),
}));

describe('NotificationCenter', () => {
  const mockNotifications = [
    {
      id: '1',
      title: 'Nouvelle formation',
      message: 'Une nouvelle formation a été ajoutée',
      type: 'info',
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Réunion annulée',
      message: 'La réunion de demain a été annulée',
      type: 'warning',
      read: true,
      createdAt: new Date().toISOString(),
    },
  ];

  const mockMarkAsRead = vi.fn();
  const mockRemoveNotification = vi.fn();
  const mockMarkAllAsRead = vi.fn();
  const mockClearAll = vi.fn();

  beforeEach(() => {
    (useNotifications as jest.Mock).mockReturnValue({
      notifications: mockNotifications,
      markAsRead: mockMarkAsRead,
      removeNotification: mockRemoveNotification,
      markAllAsRead: mockMarkAllAsRead,
      clearAll: mockClearAll,
    });
  });

  it('renders notification button with unread count', () => {
    render(<NotificationCenter />);

    const unreadCount = mockNotifications.filter(n => !n.read).length;
    expect(screen.getByText(unreadCount.toString())).toBeInTheDocument();
  });

  it('opens notification panel on click', () => {
    render(<NotificationCenter />);

    const button = screen.getByRole('button', { name: /notifications/i });
    fireEvent.click(button);

    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Nouvelle formation')).toBeInTheDocument();
    expect(screen.getByText('Réunion annulée')).toBeInTheDocument();
  });

  it('marks notification as read on click', async () => {
    render(<NotificationCenter />);

    const button = screen.getByRole('button', { name: /notifications/i });
    fireEvent.click(button);

    const notification = screen.getByText('Nouvelle formation');
    fireEvent.click(notification);

    await waitFor(() => {
      expect(mockMarkAsRead).toHaveBeenCalledWith('1');
    });
  });

  it('removes notification', async () => {
    render(<NotificationCenter />);

    const button = screen.getByRole('button', { name: /notifications/i });
    fireEvent.click(button);

    const removeButton = screen.getAllByRole('button', { name: /supprimer/i })[0];
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(mockRemoveNotification).toHaveBeenCalledWith('1');
    });
  });

  it('marks all notifications as read', async () => {
    render(<NotificationCenter />);

    const button = screen.getByRole('button', { name: /notifications/i });
    fireEvent.click(button);

    const markAllButton = screen.getByRole('button', { name: /tout marquer comme lu/i });
    fireEvent.click(markAllButton);

    await waitFor(() => {
      expect(mockMarkAllAsRead).toHaveBeenCalled();
    });
  });

  it('clears all notifications', async () => {
    render(<NotificationCenter />);

    const button = screen.getByRole('button', { name: /notifications/i });
    fireEvent.click(button);

    const clearAllButton = screen.getByRole('button', { name: /tout effacer/i });
    fireEvent.click(clearAllButton);

    await waitFor(() => {
      expect(mockClearAll).toHaveBeenCalled();
    });
  });

  it('shows empty state when no notifications', () => {
    (useNotifications as jest.Mock).mockReturnValue({
      notifications: [],
      markAsRead: mockMarkAsRead,
      removeNotification: mockRemoveNotification,
      markAllAsRead: mockMarkAllAsRead,
      clearAll: mockClearAll,
    });

    render(<NotificationCenter />);

    const button = screen.getByRole('button', { name: /notifications/i });
    fireEvent.click(button);

    expect(screen.getByText(/aucune notification/i)).toBeInTheDocument();
  });

  it('groups notifications by date', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const notifications = [
      {
        id: '1',
        title: 'Notification aujourd\'hui',
        message: 'Message',
        type: 'info',
        read: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Notification hier',
        message: 'Message',
        type: 'info',
        read: false,
        createdAt: yesterday.toISOString(),
      },
    ];

    (useNotifications as jest.Mock).mockReturnValue({
      notifications,
      markAsRead: mockMarkAsRead,
      removeNotification: mockRemoveNotification,
      markAllAsRead: mockMarkAllAsRead,
      clearAll: mockClearAll,
    });

    render(<NotificationCenter />);

    const button = screen.getByRole('button', { name: /notifications/i });
    fireEvent.click(button);

    expect(screen.getByText(/aujourd'hui/i)).toBeInTheDocument();
    expect(screen.getByText(/hier/i)).toBeInTheDocument();
  });

  it('applies correct styles based on notification type', () => {
    render(<NotificationCenter />);

    const button = screen.getByRole('button', { name: /notifications/i });
    fireEvent.click(button);

    const infoNotification = screen.getByText('Nouvelle formation').parentElement;
    const warningNotification = screen.getByText('Réunion annulée').parentElement;

    expect(infoNotification).toHaveClass('bg-blue-50');
    expect(warningNotification).toHaveClass('bg-yellow-50');
  });
});
