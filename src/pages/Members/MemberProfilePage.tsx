import React from 'react';
import { useParams } from 'react-router-dom';
import { useMember } from '@/hooks/useMembers';
import { MemberMandates } from '@/components/members/MemberMandates';
import { MemberTrainings } from '@/components/members/MemberTrainings';
import { MemberMeetings } from '@/components/members/MemberMeetings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Permission } from '@/lib/permissions';
import { ActionButton } from '@/components/common/ActionButton';
import { useNavigate } from 'react-router-dom';
import { Edit2Icon } from 'lucide-react';

/**
 * Page de profil d'un membre.
 * Affiche les informations personnelles, mandats, formations et réunions d'un membre.
 * 
 * @component
 * @param {Object} props - Les propriétés du composant
 * 
 * @example
 * ```tsx
 * // Dans le routeur
 * <Route path="/members/:id" element={<MemberProfilePage />} />
 * ```
 */
export function MemberProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { member, isLoading, error } = useMember(Number(id));

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!member) {
    return <div>Membre non trouvé</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          {member.firstName} {member.lastName}
        </h1>
        <ActionButton
          onClick={() => navigate(`/members/${member.id}/edit`)}
          permission={Permission.EDIT_MEMBER}
        >
          <Edit2Icon className="mr-2 h-4 w-4" />
          Modifier
        </ActionButton>
      </div>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Informations</TabsTrigger>
          <TabsTrigger value="mandates">Mandats</TabsTrigger>
          <TabsTrigger value="trainings">Formations</TabsTrigger>
          <TabsTrigger value="meetings">Réunions</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Informations personnelles</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">Email</dt>
                    <dd>{member.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Téléphone</dt>
                    <dd>{member.phone}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Date de naissance</dt>
                    <dd>
                      {format(new Date(member.birthDate), 'PPP', { locale: fr })}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Adresse</dt>
                    <dd>{member.address}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Informations professionnelles</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">Profession</dt>
                    <dd>{member.profession}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Employeur</dt>
                    <dd>{member.employer}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Formation</dt>
                    <dd>{member.education}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="mandates">
          <MemberMandates memberId={member.id} />
        </TabsContent>

        <TabsContent value="trainings">
          <MemberTrainings memberId={member.id} />
        </TabsContent>

        <TabsContent value="meetings">
          <MemberMeetings memberId={member.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
