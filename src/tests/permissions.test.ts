import { renderHook } from '@testing-library/react';
import { usePermissions, Permission, Role } from '@/lib/permissions';
import { useAuth } from '@/lib/auth';

// Mock useAuth hook
jest.mock('@/lib/auth', () => ({
  useAuth: jest.fn(),
}));

describe('usePermissions', () => {
  it('returns false for all permissions when user is not logged in', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null });
    const { result } = renderHook(() => usePermissions());

    expect(result.current.hasPermission(Permission.VIEW_MEMBERS)).toBe(false);
    expect(result.current.hasPermission(Permission.CREATE_MEMBER)).toBe(false);
    expect(result.current.hasRole(Role.ADMIN)).toBe(false);
  });

  it('returns correct permissions for ADMIN role', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { role: Role.ADMIN },
    });
    const { result } = renderHook(() => usePermissions());

    // Admin should have all permissions
    Object.values(Permission).forEach((permission) => {
      expect(result.current.hasPermission(permission)).toBe(true);
    });
  });

  it('returns correct permissions for MEMBER role', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { role: Role.MEMBER },
    });
    const { result } = renderHook(() => usePermissions());

    // Member should have view permissions only
    expect(result.current.hasPermission(Permission.VIEW_MEMBERS)).toBe(true);
    expect(result.current.hasPermission(Permission.VIEW_COMMISSIONS)).toBe(true);
    expect(result.current.hasPermission(Permission.VIEW_TRAININGS)).toBe(true);
    expect(result.current.hasPermission(Permission.VIEW_MEETINGS)).toBe(true);

    // Member should not have create/edit/delete permissions
    expect(result.current.hasPermission(Permission.CREATE_MEMBER)).toBe(false);
    expect(result.current.hasPermission(Permission.EDIT_MEMBER)).toBe(false);
    expect(result.current.hasPermission(Permission.DELETE_MEMBER)).toBe(false);
  });

  it('returns correct permissions for PRESIDENT role', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { role: Role.PRESIDENT },
    });
    const { result } = renderHook(() => usePermissions());

    // President should have specific permissions
    expect(result.current.hasPermission(Permission.CREATE_COMMISSION)).toBe(true);
    expect(result.current.hasPermission(Permission.EDIT_COMMISSION)).toBe(true);
    expect(result.current.hasPermission(Permission.CREATE_TRAINING)).toBe(true);
    expect(result.current.hasPermission(Permission.MANAGE_TRAINING_PARTICIPANTS)).toBe(true);
  });

  it('returns correct role status', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { role: Role.SECRETARY },
    });
    const { result } = renderHook(() => usePermissions());

    expect(result.current.hasRole(Role.SECRETARY)).toBe(true);
    expect(result.current.hasRole(Role.ADMIN)).toBe(false);
    expect(result.current.hasRole(Role.MEMBER)).toBe(false);
  });
});
