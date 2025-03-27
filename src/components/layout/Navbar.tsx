import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { NotificationCenter } from '../notifications/NotificationCenter';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePermissions, Permission } from '@/lib/permissions';

export function Navbar() {
  const { user, logout } = useAuth();
  const { hasPermission } = usePermissions();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold">
              JCI
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              <WithPermission permission={Permission.VIEW_MEMBERS}>
                <Link
                  to="/members"
                  className="text-sm font-medium hover:text-primary"
                >
                  Membres
                </Link>
              </WithPermission>
              <WithPermission permission={Permission.VIEW_COMMISSIONS}>
                <Link
                  to="/commissions"
                  className="text-sm font-medium hover:text-primary"
                >
                  Commissions
                </Link>
              </WithPermission>
              <WithPermission permission={Permission.VIEW_TRAININGS}>
                <Link
                  to="/trainings"
                  className="text-sm font-medium hover:text-primary"
                >
                  Formations
                </Link>
              </WithPermission>
              <WithPermission permission={Permission.VIEW_MEETINGS}>
                <Link
                  to="/meetings"
                  className="text-sm font-medium hover:text-primary"
                >
                  Réunions
                </Link>
              </WithPermission>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <NotificationCenter />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.avatar}
                      alt={user?.firstName}
                    />
                    <AvatarFallback>
                      {getInitials(`${user?.firstName} ${user?.lastName}`)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex w-full items-center">
                    Mon profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
