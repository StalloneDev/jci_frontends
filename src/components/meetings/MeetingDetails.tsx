import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMeetings } from '@/hooks/useMeetings';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/DataTable';
import { formatDate } from '@/lib/utils';
import { Edit, Trash, UserPlus, Download } from 'lucide-react';

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
    accessorKey: 'role',
    header: 'Rôle',
  },
  {
    accessorKey: 'presence',
    header: 'Présence',
    cell: ({ row }) => {
      const presence = row.getValue('presence');
      return (
        <span className={`px-2 py-1 rounded-full text-sm ${
          presence === 'PRESENT' ? 'bg-green-100 text-green-800' :
          presence === 'ABSENT' ? 'bg-red-100 text-red-800' :
          presence === 'EXCUSED' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {presence === 'PRESENT' ? 'Présent' :
           presence === 'ABSENT' ? 'Absent' :
           presence === 'EXCUSED' ? 'Excusé' :
           'Non confirmé'}
        </span>
      );
    },
  },
];

export function MeetingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMeeting, deleteMeeting } = useMeetings();
  const [meeting, setMeeting] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const data = await getMeeting(id!);
        setMeeting(data);
      } catch (err) {
        setError('Erreur lors du chargement de la réunion');
      } finally {
        setLoading(false);
      }
    };

    fetchMeeting();
  }, [id, getMeeting]);

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réunion ?')) {
      try {
        await deleteMeeting(id!);
        navigate('/meetings');
      } catch (err) {
        setError('Erreur lors de la suppression de la réunion');
      }
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!meeting) return <div>Réunion non trouvée</div>;

  return (
    <div className="space-y-6 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">{meeting.title}</h1>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/meetings/${id}/edit`)}
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
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Date</h3>
                  <p>{formatDate(meeting.date)}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Horaires</h3>
                  <p>{meeting.startTime} - {meeting.endTime}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Lieu</h3>
                  <p>{meeting.location}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Type</h3>
                  <p>
                    {meeting.meetingType === 'REGULAR' ? 'Régulière' :
                     meeting.meetingType === 'EXTRAORDINARY' ? 'Extraordinaire' :
                     'Urgente'}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Commission</h3>
                  <p>{meeting.commission?.name || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Statut</h3>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    meeting.status === 'PLANNED' ? 'bg-blue-100 text-blue-800' :
                    meeting.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                    meeting.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {meeting.status === 'PLANNED' ? 'Planifiée' :
                     meeting.status === 'IN_PROGRESS' ? 'En cours' :
                     meeting.status === 'COMPLETED' ? 'Terminée' :
                     'Annulée'}
                  </span>
                </div>
              </div>

              {meeting.agenda && (
                <div>
                  <h3 className="font-semibold">Ordre du jour</h3>
                  <p className="whitespace-pre-wrap">{meeting.agenda}</p>
                </div>
              )}

              {meeting.minutes && (
                <div>
                  <h3 className="font-semibold">Compte-rendu</h3>
                  <p className="whitespace-pre-wrap">{meeting.minutes}</p>
                </div>
              )}
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
                  data={meeting.participants || []}
                  pageSize={5}
                />
              </div>
            </TabsContent>

            <TabsContent value="documents">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Documents</h2>
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger tout
                  </Button>
                </div>

                <div className="space-y-2">
                  {meeting.documents?.map((doc: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <span>{doc.name}</span>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
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
                    {meeting.participants?.length || 0}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Durée</p>
                  <p className="text-2xl font-bold">
                    {/* Calculate duration in hours */}
                    {Math.round(
                      (new Date(`2000/01/01 ${meeting.endTime}`).getTime() -
                        new Date(`2000/01/01 ${meeting.startTime}`).getTime()) /
                        (1000 * 60 * 60)
                    )}{' '}
                    heures
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold">Présence</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Présents</p>
                  <p className="text-2xl font-bold text-green-600">
                    {meeting.participants?.filter((p: any) => p.presence === 'PRESENT').length || 0}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Absents</p>
                  <p className="text-2xl font-bold text-red-600">
                    {meeting.participants?.filter((p: any) => p.presence === 'ABSENT').length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
