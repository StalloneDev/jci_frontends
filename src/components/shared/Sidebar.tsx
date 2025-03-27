import { Link, useLocation } from 'react-router-dom';
import { navigation } from '@/config/navigation';
import { classNames } from '@/utils/classNames';

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="h-full px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={classNames(
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-lg'
                )}
              >
                <item.icon
                  className={classNames(
                    isActive 
                      ? 'text-blue-600' 
                      : 'text-gray-400 group-hover:text-gray-500',
                    'flex-shrink-0 h-6 w-6 mr-3'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
