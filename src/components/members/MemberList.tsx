import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMembers } from '@/hooks/useMembers';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit2, 
  Trash2,
  Mail,
  Phone,
  MoreVertical,
  Loader2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Permission } from '@/lib/permissions';
import { toast } from 'react-hot-toast';

interface MemberListProps {
  filter?: 'active' | 'inactive' | 'pending';
}

export function MemberList({ filter }: MemberListProps) {
  const navigate = useNavigate();
  const { members, loading, deleteMember } = useMembers();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = members?.filter(member => {
    const matchesSearch = 
      member.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchQuery.toLowerCase());

    if (filter) {
      return matchesSearch && member.status === filter;
    }

    return matchesSearch;
  });

  const handleDelete = async (memberId: string) => {
    try {
      await deleteMember(memberId);
      toast.success('Membre supprimé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la suppression du membre');
    }
  };

  return (
    <Card>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher un membre..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
            <Button size="sm" onClick={() => navigate('/members/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un membre
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Membre</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers && filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>
                              {member.firstName?.[0]}{member.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.firstName} {member.lastName}</div>
                            <div className="text-sm text-gray-500">{member.role}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="mr-2 h-4 w-4" />
                            {member.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="mr-2 h-4 w-4" />
                            {member.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {member.commission?.name && (
                          <Badge variant="secondary">
                            {member.commission.name}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={member.status === 'active' ? 'success' : 
                                  member.status === 'inactive' ? 'destructive' : 
                                  'secondary'}
                        >
                          {member.status === 'active' ? 'Actif' : 
                           member.status === 'inactive' ? 'Inactif' : 
                           'En attente'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigate(`/members/${member.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir le profil
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/members/${member.id}/edit`)}>
                              <Edit2 className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDelete(member.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                      Aucun membre trouvé.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </Card>
  );
}
