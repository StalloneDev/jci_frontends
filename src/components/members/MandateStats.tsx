import React, { Suspense, lazy } from 'react';
import { RoleMandate } from '@/types/member';
import { roleLabels } from '@/utils/roles';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Lazy load des composants de graphiques
const BarChart = lazy(() => import('react-chartjs-2').then(({ Bar }) => Bar));
const PieChart = lazy(() => import('react-chartjs-2').then(({ Pie }) => Pie));

interface MandateStatsProps {
  mandates: RoleMandate[];
}

export function MandateStats({ mandates }: MandateStatsProps) {
  // Calculer les statistiques par rôle
  const roleStats = Object.entries(roleLabels).reduce((acc, [role, label]) => {
    const roleCount = mandates.filter(m => m.role === role).length;
    if (roleCount > 0) {
      acc[label] = roleCount;
    }
    return acc;
  }, {} as Record<string, number>);

  // Calculer les statistiques actif/inactif
  const activeCount = mandates.filter(m => m.isActive).length;
  const inactiveCount = mandates.length - activeCount;

  // Configuration du graphique en barres
  const barData = {
    labels: Object.keys(roleStats),
    datasets: [
      {
        label: 'Nombre de mandats',
        data: Object.values(roleStats),
        backgroundColor: [
          '#3498db',
          '#2ecc71',
          '#e74c3c',
          '#f1c40f',
          '#9b59b6',
        ],
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Répartition des mandats par rôle',
      },
    },
  };

  // Configuration du graphique en camembert
  const pieData = {
    labels: ['Actifs', 'Terminés'],
    datasets: [
      {
        data: [activeCount, inactiveCount],
        backgroundColor: ['#2ecc71', '#95a5a6'],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Statut des mandats',
      },
    },
  };

  // Calculer la durée moyenne des mandats
  const averageDuration = mandates.reduce((acc, mandate) => {
    const start = new Date(mandate.startDate);
    const end = new Date(mandate.endDate);
    return acc + (end.getTime() - start.getTime());
  }, 0) / mandates.length / (1000 * 60 * 60 * 24 * 30); // En mois

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <BarChart data={barData} options={barOptions} />
        </Suspense>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <PieChart data={pieData} options={pieOptions} />
        </Suspense>
      </div>
      <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
        <h3 className="text-lg font-semibold mb-2">Statistiques générales</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {mandates.length}
            </div>
            <div className="text-sm text-gray-600">Total des mandats</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {activeCount}
            </div>
            <div className="text-sm text-gray-600">Mandats actifs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {averageDuration.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Durée moyenne (mois)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
