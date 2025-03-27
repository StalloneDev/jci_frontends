import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { 
  BellIcon, 
  SunIcon, 
  MoonIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/lib/auth';
import logo from '@/assets/images/logo.png';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const isDarkMode = false;

  const userNavigation = [
    { name: 'Mon profil', href: '/profile', icon: UserCircleIcon },
    { name: 'Paramètres', href: '/settings', icon: Cog6ToothIcon },
    { name: 'Déconnexion', href: '#', onClick: logout, icon: ArrowRightOnRectangleIcon },
  ];

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-x-4">
          <div className="flex-shrink-0">
            <img className="h-12 w-25" src={logo} alt="JCI Logo" />
          </div>
        </div>

        <div className="flex items-center gap-x-4">
          <button
            type="button"
            className="rounded-full bg-white p-1.5 text-gray-400 hover:text-gray-500"
          >
            {isDarkMode ? (
              <SunIcon className="h-6 w-6" />
            ) : (
              <MoonIcon className="h-6 w-6" />
            )}
          </button>

          <button
            type="button"
            className="rounded-full bg-white p-1.5 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Voir les notifications</span>
            <BellIcon className="h-6 w-6" />
          </button>

          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-x-4 rounded-full bg-white text-sm focus:outline-none">
              <span className="sr-only">Ouvrir le menu utilisateur</span>
              <div className="flex items-center">
                <span className="hidden text-sm font-medium text-gray-700 sm:block">
                  {user?.firstName} {user?.lastName}
                </span>
                <div className="h-8 w-8 rounded-full bg-gray-100 ml-2">
                  {user?.avatar ? (
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user.avatar}
                      alt=""
                    />
                  ) : (
                    <UserCircleIcon className="h-8 w-8 text-gray-400" />
                  )}
                </div>
              </div>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {userNavigation.map((item) => (
                  <Menu.Item key={item.name}>
                    {({ active }) => (
                      item.onClick ? (
                        <a
                          href={item.href}
                          onClick={item.onClick}
                          className={classNames(
                            active ? 'bg-gray-50' : '',
                            'flex items-center px-4 py-2 text-sm text-gray-700'
                          )}
                        >
                          <item.icon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                          {item.name}
                        </a>
                      ) : (
                        <Link
                          to={item.href}
                          className={classNames(
                            active ? 'bg-gray-50' : '',
                            'flex items-center px-4 py-2 text-sm text-gray-700'
                          )}
                        >
                          <item.icon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                          {item.name}
                        </Link>
                      )
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
}
