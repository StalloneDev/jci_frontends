import { ReactNode } from 'react';
import { useAuth } from '@/lib/auth';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};
