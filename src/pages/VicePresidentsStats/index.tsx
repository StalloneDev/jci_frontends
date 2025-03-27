import PageHeader from '@/components/shared/PageHeader';
import { Card, CardBody } from '@/components/shared/Card';
import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const mockData = [
  {
    name: 'Formation',
    objectif: 100,
    realisation: 80,
  },
  {
    name: 'Membres',
    objectif: 50,
    realisation: 45,
  },
  {
    name: 'Activités',
    objectif: 30,
    realisation: 28,
  },
  {
    name: 'Réunions',
    objectif: 24,
    realisation: 20,
  },
];

export default function VicePresidentsStats() {
  const [data] = useState(mockData);

  return (
    <div>
      <PageHeader title="Statistiques des Vice-Présidents" />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardBody>
            <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">
              Objectifs vs Réalisations
            </h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="objectif" fill="#0ea5e9" name="Objectif" />
                  <Bar dataKey="realisation" fill="#22c55e" name="Réalisation" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        {/* D'autres graphiques seront ajoutés ici */}
      </div>
    </div>
  );
}
