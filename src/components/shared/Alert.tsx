import { XMarkIcon } from '@heroicons/react/20/solid';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { classNames } from '@/utils/classNames';

interface AlertProps {
  title: string;
  message?: string;
  variant?: 'success' | 'warning' | 'error' | 'info';
  onClose?: () => void;
}

export default function Alert({ title, message, variant = 'info', onClose }: AlertProps) {
  const variants = {
    info: {
      color: 'text-blue-800',
      bg: 'bg-blue-50',
      icon: InformationCircleIcon,
    },
    warning: {
      color: 'text-yellow-800',
      bg: 'bg-yellow-50',
      icon: ExclamationTriangleIcon,
    },
    error: {
      color: 'text-red-800',
      bg: 'bg-red-50',
      icon: XCircleIcon,
    },
    success: {
      color: 'text-green-800',
      bg: 'bg-green-50',
      icon: CheckCircleIcon,
    },
  };

  const { color, bg, icon: Icon } = variants[variant];

  return (
    <div className={classNames('rounded-md p-4', bg)}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={classNames('h-5 w-5', color)} aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className={classNames('text-sm font-medium', color)}>{title}</h3>
          {message && <div className={classNames('mt-2 text-sm', color)}>{message}</div>}
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className={classNames(
                  'inline-flex rounded-md p-1.5',
                  color,
                  'hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-blue-50'
                )}
              >
                <span className="sr-only">Dismiss</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
