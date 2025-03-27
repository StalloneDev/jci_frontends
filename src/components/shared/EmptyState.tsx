interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ComponentType<React.ComponentProps<'svg'>>;
  action?: React.ReactNode;
}

export default function EmptyState({ title, description, icon: Icon, action }: EmptyStateProps) {
  return (
    <div className="text-center">
      {Icon && (
        <div className="mx-auto h-12 w-12 text-gray-400">
          <Icon className="h-full w-full" aria-hidden="true" />
        </div>
      )}
      <h3 className="mt-2 text-sm font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
