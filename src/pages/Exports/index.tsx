import PageHeader from '@/components/shared/PageHeader';
import ExportList from './components/ExportList';

export default function Exports() {
  return (
    <div>
      <PageHeader
        title="Exports"
        description="Exportez vos données dans différents formats"
      />

      <div className="mt-8">
        <ExportList />
      </div>
    </div>
  );
}
