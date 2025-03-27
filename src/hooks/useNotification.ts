import { useState, useCallback } from 'react';
import { NotificationType } from '@/components/shared/Notification';

interface NotificationState {
  type: NotificationType;
  title: string;
  message: string;
  show: boolean;
}

const initialState: NotificationState = {
  type: 'info',
  title: '',
  message: '',
  show: false,
};

export const useNotification = () => {
  const [notification, setNotification] = useState<NotificationState>(initialState);

  const showNotification = useCallback(
    (type: NotificationType, title: string, message: string) => {
      setNotification({
        type,
        title,
        message,
        show: true,
      });
    },
    []
  );

  const hideNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, show: false }));
  }, []);

  const notifySuccess = useCallback(
    (title: string, message: string) => {
      showNotification('success', title, message);
    },
    [showNotification]
  );

  const notifyError = useCallback(
    (title: string, message: string) => {
      showNotification('error', title, message);
    },
    [showNotification]
  );

  const notifyWarning = useCallback(
    (title: string, message: string) => {
      showNotification('warning', title, message);
    },
    [showNotification]
  );

  const notifyInfo = useCallback(
    (title: string, message: string) => {
      showNotification('info', title, message);
    },
    [showNotification]
  );

  return {
    notification,
    showNotification,
    hideNotification,
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
  };
};
