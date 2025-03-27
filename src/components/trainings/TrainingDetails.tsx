import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrainings } from '@/hooks/useTrainings';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/DataTable';
import { formatDate } from '@/lib/utils';
import { Edit, Trash, UserPlus } from 'lucide-react';

const participantsColumns = [
  {
    accessorKey: 'name',
    header: 'Nom',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phone',
    header: 'Téléphone',
  },
  {
    accessorKey: 'status',
    header: 'Statut',
    cell: ({ row }) => {
      const status = row.getValue('status');
      return (
        <span className={`px-2 py-1 rounded-full text-sm ${
          status === 'REGISTERED' ? 'bg-blue-100 text-blue-800' :
          status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
          status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {status === 'REGISTERED' ? 'Inscrit' :
           status === 'CONFIRMED' ? 'Confirmé' :
           status === 'CANCELLED' ? 'Annulé' :
           'En attente'}
        </span>
      );
    },
  },
];

export function TrainingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTraining, deleteTraining } = useTrainings();
  const [training, setTraining] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchTraining = async () => {
      try {
        const data = await getTraining(id!);
        setTraining(data);
      } catch (err) {
        setError('Erreur lors du chargement de la formation');
      } finally {
        setLoading(false);
      }
    };

    fetchTraining();
  }, [id, getTraining]);

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      try {
        await deleteTraining(id!);
        navigate('/trainings');
      } catch (err) {
        setError('Erreur lors de la suppression de la formation');
      }
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!training) return <div>Formation non trouvée</div>;

  return (
    <div className="space-y-6 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">{training.title}</h1>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/trainings/${id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Détails</TabsTrigger>
              <TabsTrigger value="participants">Participants</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Date de début</h3>
                  <p>{formatDate(training.startDate)}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Date de fin</h3>
                  <p>{formatDate(training.endDate)}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Lieu</h3>
                  <p>{training.location}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Type</h3>
                  <p>{training.type === 'INTERNAL' ? 'Interne' : 'Externe'}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Prix</h3>
                  <p>{training.price} TND</p>
                </div>
                <div>
                  <h3 className="font-semibold">Statut</h3>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    training.status === 'PLANNED' ? 'bg-blue-100 text-blue-800' :
                    training.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                    training.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {training.status === 'PLANNED' ? 'Planifiée' :
                     training.status === 'IN_PROGRESS' ? 'En cours' :
                     training.status === 'COMPLETED' ? 'Terminée' :
                     'Annulée'}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold">Description</h3>
                <p className="whitespace-pre-wrap">{training.description}</p>
              </div>

              {training.prerequisites && (
                <div>
                  <h3 className="font-semibold">Prérequis</h3>
                  <p className="whitespace-pre-wrap">{training.prerequisites}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold">Objectifs</h3>
                <ul className="list-disc list-inside">
                  {training.objectives.map((objective: string, index: number) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="participants">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Liste des participants</h2>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Ajouter un participant
                  </Button>
                </div>

                <DataTable
                  columns={participantsColumns}
                  data={training.participants || []}
                  pageSize={5}
                />
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        <Card>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Statistiques</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Participants</p>
                  <p className="text-2xl font-bold">
                    {training.participants?.length || 0}
                    {training.maxParticipants && `/${training.maxParticipants}`}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Durée</p>
                  <p className="text-2xl font-bold">
                    {/* Calculate duration in days */}
                    {Math.ceil(
                      (new Date(training.endDate).getTime() -
                        new Date(training.startDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{' '}
                    jours
                  </p>
                </div>
              </div>
            </div>

            {training.certificate && (
              <div>
                <h3 className="font-semibold">Certificat</h3>
                <p className="text-sm text-gray-500">
                  Un certificat sera délivré à la fin de cette formation
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
