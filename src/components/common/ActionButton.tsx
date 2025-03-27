import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { WithPermission } from '@/lib/permissions';
import { Permission } from '@/lib/permissions';

interface ActionButtonProps extends ButtonProps {
  permission?: Permission;
}

export function ActionButton({ permission, children, ...props }: ActionButtonProps) {
  if (!permission) {
    return <Button {...props}>{children}</Button>;
  }

  return (
    <WithPermission permission={permission}>
      <Button {...props}>{children}</Button>
    </WithPermission>
  );
}
