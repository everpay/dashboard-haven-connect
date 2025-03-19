
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { RoleSelector } from '@/components/team/RoleSelector';
import { Plus, Search, Filter, Mail, Trash, Edit } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// Custom TableCell component that supports colSpan
interface CustomTableCellProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}

const CustomTableCell: React.FC<CustomTableCellProps> = ({ children, className, colSpan }) => (
  <td className={`px-4 py-3 ${className || ''}`} colSpan={colSpan}>
    {children}
  </td>
);

interface TeamMember {
  id: string;
  email: string;
  full_name: string;
  role: string;
  status: string;
}

const Team = () => {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('member');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const { data: teamMembers, isLoading, refetch } = useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const mockTeamMembers: TeamMember[] = [
        {
          id: '1',
          email: 'admin@example.com',
          full_name: 'Admin User',
          role: 'admin',
          status: 'active'
        },
        {
          id: '2',
          email: 'manager@example.com',
          full_name: 'Manager User',
          role: 'manager',
          status: 'active'
        },
        {
          id: '3',
          email: 'member@example.com',
          full_name: 'Team Member',
          role: 'member',
          status: 'pending'
        }
      ];
      
      return mockTeamMembers;
    }
  });

  const handleAddMember = async () => {
    if (!newMemberEmail || !newMemberName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      toast({
        title: "Team member invited",
        description: `An invitation has been sent to ${newMemberEmail}`
      });
      
      setIsAddMemberOpen(false);
      setNewMemberEmail('');
      setNewMemberName('');
      setNewMemberRole('member');
      refetch();
    } catch (error) {
      console.error('Error adding team member:', error);
      toast({
        title: "Error",
        description: "Failed to add team member. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveMember = (memberId: string) => {
    toast({
      title: "Team member removed",
      description: "The team member has been removed successfully"
    });
    refetch();
  };

  const filteredMembers = teamMembers?.filter(member => 
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Team Management</h1>
            <p className="text-muted-foreground">Manage your team members and their access permissions</p>
          </div>
          <Button 
            onClick={() => setIsAddMemberOpen(true)}
            className="bg-[#1AA47B] hover:bg-[#19363B]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>View and manage your team members and their roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search team members"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>

            <div className="overflow-x-auto rounded-lg border dark:border-gray-800">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-xs text-gray-500 dark:text-gray-300 text-left">Name</th>
                    <th className="px-4 py-3 text-xs text-gray-500 dark:text-gray-300 text-left">Email</th>
                    <th className="px-4 py-3 text-xs text-gray-500 dark:text-gray-300 text-left">Role</th>
                    <th className="px-4 py-3 text-xs text-gray-500 dark:text-gray-300 text-left">Status</th>
                    <th className="px-4 py-3 text-xs text-gray-500 dark:text-gray-300 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {isLoading ? (
                    <tr>
                      <CustomTableCell colSpan={5} className="text-center py-4">
                        Loading team members...
                      </CustomTableCell>
                    </tr>
                  ) : filteredMembers.length === 0 ? (
                    <tr>
                      <CustomTableCell colSpan={5} className="text-center py-4">
                        No team members found
                      </CustomTableCell>
                    </tr>
                  ) : (
                    filteredMembers.map((member) => (
                      <tr key={member.id}>
                        <td className="px-4 py-3 font-medium dark:text-gray-100">{member.full_name}</td>
                        <td className="px-4 py-3 dark:text-gray-300">{member.email}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-full text-xs capitalize">
                            {member.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            member.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                          }`}>
                            {member.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900 dark:hover:text-red-300"
                              onClick={() => handleRemoveMember(member.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                toast({
                                  title: "Invitation resent",
                                  description: `A new invitation has been sent to ${member.email}`
                                });
                              }}
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invite Link</CardTitle>
            <CardDescription>Share this link to invite people to your organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input value="https://everpay.app/invite/org123abc" readOnly className="font-mono" />
              <Button onClick={() => {
                navigator.clipboard.writeText("https://everpay.app/invite/org123abc");
                toast({
                  title: "Link copied",
                  description: "Invite link copied to clipboard"
                });
              }}>
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <RoleSelector
                currentRole={newMemberRole}
                onRoleChange={setNewMemberRole}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>Cancel</Button>
            <Button 
              className="bg-[#1AA47B] hover:bg-[#19363B]"
              onClick={handleAddMember}
            >
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Team;
