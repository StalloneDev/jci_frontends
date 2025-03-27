import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMembers } from '@/hooks/useMembers';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Globe2,
  Calendar,
  Edit2,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function MemberDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMember, loading } = useMembers();
  const member = getMember(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-semibold text-gray-900">Membre non trouvé</h2>
        <p className="text-gray-500 mt-2">Le membre que vous recherchez n'existe pas.</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate('/members')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la liste
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-gray-50">
      <div className="py-8 px-6 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/members')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profil du membre</h1>
              <p className="text-gray-500">Consultez et gérez les informations du membre</p>
            </div>
          </div>
          <Button onClick={() => navigate(`/members/${id}/edit`)}>
            <Edit2 className="mr-2 h-4 w-4" />
            Modifier
          </Button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Personal Info */}
          <Card className="md:col-span-1 p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={member.avatar} />
                <AvatarFallback className="text-lg">
                  {member.firstName?.[0]}{member.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                {member.firstName} {member.lastName}
              </h2>
              <p className="text-gray-500">{member.role}</p>
              <Badge 
                className="mt-2"
                variant={member.status === 'active' ? 'success' : 
                        member.status === 'inactive' ? 'destructive' : 
                        'secondary'}
              >
                {member.status === 'active' ? 'Actif' : 
                 member.status === 'inactive' ? 'Inactif' : 
                 'En attente'}
              </Badge>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{member.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{member.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{member.address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Building2 className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{member.city}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Globe2 className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{member.country}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">Membre depuis {new Date(member.joinedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>

          {/* Right Column - Tabs */}
          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="mandates" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="mandates" className="flex-1">Mandats</TabsTrigger>
                <TabsTrigger value="trainings" className="flex-1">Formations</TabsTrigger>
                <TabsTrigger value="meetings" className="flex-1">Réunions</TabsTrigger>
              </TabsList>

              <TabsContent value="mandates">
                <Card className="p-6">
                  {member.mandates?.length > 0 ? (
                    <div className="space-y-4">
                      {member.mandates.map((mandate, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium text-gray-900">{mandate.role}</h3>
                            <p className="text-sm text-gray-500">{mandate.commission}</p>
                          </div>
                          <Badge variant="outline">
                            {mandate.startDate} - {mandate.endDate || 'Présent'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500">Aucun mandat trouvé</p>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="trainings">
                <Card className="p-6">
                  {member.trainings?.length > 0 ? (
                    <div className="space-y-4">
                      {member.trainings.map((training, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium text-gray-900">{training.name}</h3>
                            <p className="text-sm text-gray-500">{training.description}</p>
                          </div>
                          <Badge variant="outline">{training.date}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500">Aucune formation trouvée</p>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="meetings">
                <Card className="p-6">
                  {member.meetings?.length > 0 ? (
                    <div className="space-y-4">
                      {member.meetings.map((meeting, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium text-gray-900">{meeting.title}</h3>
                            <p className="text-sm text-gray-500">{meeting.type}</p>
                          </div>
                          <Badge variant="outline">{meeting.date}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500">Aucune réunion trouvée</p>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
