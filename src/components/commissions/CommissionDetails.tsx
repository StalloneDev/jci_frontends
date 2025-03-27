import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';

interface Member {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface CommissionHistory {
  id: number;
  member: Member;
  role: string;
  startDate: string;
  endDate?: string;
}

interface Commission {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: string;
  commissionHistory: CommissionHistory[];
}

export const CommissionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: commission, isLoading, error } = useQuery<Commission>({
    queryKey: ['commission', id],
    queryFn: async () => {
      const response = await axios.get(`/api/commissions/${id}`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center p-6">
          <p className="text-red-500">Une erreur est survenue lors du chargement des détails de la commission.</p>
          <Button onClick={() => navigate('/commissions')} className="mt-4">
            Retour à la liste
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!commission) {
    return (
      <Card>
        <CardContent className="text-center p-6">
          <p>Commission non trouvée.</p>
          <Button onClick={() => navigate('/commissions')} className="mt-4">
            Retour à la liste
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl">{commission.name}</CardTitle>
            <Badge variant={commission.status === 'ACTIVE' ? 'success' : 'secondary'} className="mt-2">
              {commission.status}
            </Badge>
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => navigate('/commissions')}>
              Retour
            </Button>
            <Button onClick={() => navigate(`/commissions/${commission.id}/edit`)}>
              Modifier
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{commission.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Période</h3>
            <div className="flex gap-x-6">
              <div>
                <span className="text-muted-foreground">Date de début:</span>{' '}
                {new Date(commission.startDate).toLocaleDateString()}
              </div>
              {commission.endDate && (
                <div>
                  <span className="text-muted-foreground">Date de fin:</span>{' '}
                  {new Date(commission.endDate).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Membres</h3>
            <div className="space-y-4">
              {commission.commissionHistory
                .filter(history => !history.endDate)
                .map(history => (
                  <div
                    key={history.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">
                        {history.member.firstName} {history.member.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{history.member.email}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge>{history.role}</Badge>
                      <p className="text-sm text-muted-foreground">
                        Depuis le {new Date(history.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {commission.commissionHistory.some(history => history.endDate) && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Anciens membres</h3>
              <div className="space-y-4">
                {commission.commissionHistory
                  .filter(history => history.endDate)
                  .map(history => (
                    <div
                      key={history.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-muted/50"
                    >
                      <div>
                        <p className="font-medium">
                          {history.member.firstName} {history.member.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">{history.member.email}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary">{history.role}</Badge>
                        <div className="text-sm text-muted-foreground">
                          <p>Du {new Date(history.startDate).toLocaleDateString()}</p>
                          <p>Au {new Date(history.endDate!).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
