import React from 'react';
import { MemberList } from '@/components/members/MemberList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Members() {
  return (
    <div className="h-full overflow-auto bg-gray-50">
      <div className="py-8 px-6 max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Membres</h1>
          <p className="text-gray-500 mt-2">
            Gérez les membres de votre organisation, leurs rôles et leurs permissions.
          </p>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">Tous les membres</TabsTrigger>
              <TabsTrigger value="active">Actifs</TabsTrigger>
              <TabsTrigger value="inactive">Inactifs</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="space-y-4">
            <MemberList />
          </TabsContent>
          
          <TabsContent value="active" className="space-y-4">
            <MemberList filter="active" />
          </TabsContent>
          
          <TabsContent value="inactive" className="space-y-4">
            <MemberList filter="inactive" />
          </TabsContent>
          
          <TabsContent value="pending" className="space-y-4">
            <MemberList filter="pending" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
