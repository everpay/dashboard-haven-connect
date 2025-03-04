
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { PlusIcon, Mail, Trash2, X, UserPlus, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useRBAC, RoleGuard } from '@/lib/rbac';
import { withRole, logUserActivity } from '@/lib/middleware';
import RoleSelector from '@/components/team/RoleSelector';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';

interface TeamMember {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  role: string;
}

const Team = () => {
  const { session } = useAuth();
  const currentUserId = session?.user.id;
  const { refreshRole } = useRBAC();
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [sendingInvite, setSendingInvite] = useState(false);
  const [pendingInvites, setPendingInvites] = useState<any[]>([]);

  useEffect(() => {
    if (currentUserId) {
      fetchTeamMembers();
      fetchPendingInvites();
    }
  }, [currentUserId]);

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      // Get all users with their profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Get roles for each user
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      // Create a roles map for quicker access
      const rolesMap = rolesData.reduce((acc, role) => {
        acc[role.user_id] = role.role;
        return acc;
      }, {});

      // Map profiles to team members with roles
      const members = profilesData.map((profile) => ({
        id: profile.id,
        email: profile.email || '',
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        avatar_url: profile.avatar_url || '',
        role: rolesMap[profile.id] || 'member',
      }));

      setTeamMembers(members);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingInvites = async () => {
    try {
      const { data, error } = await supabase
        .from('team_invites')
        .select('*')
        .eq('status', 'pending');

      if (error) throw error;
      setPendingInvites(data || []);
    } catch (error) {
      console.error('Error fetching pending invites:', error);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    // Update local state
    setTeamMembers((prev) =>
      prev.map((member) =>
        member.id === userId ? { ...member, role: newRole } : member
      )
    );

    // If current user's role was changed, refresh the RBAC context
    if (userId === currentUserId) {
      await refreshRole();
    }

    // Log the activity
    if (currentUserId) {
      await logUserActivity(currentUserId, 'role_updated', {
        target_user_id: userId,
        new_role: newRole,
      });
    }
  };

  const handleSendInvite = async () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    setSendingInvite(true);
    try {
      // Only owners can send invites
      const result = await withRole(['owner'], async () => {
        // Create invite in the database
        const { data, error } = await supabase
          .from('team_invites')
          .insert({
            email: inviteEmail.toLowerCase().trim(),
            role: inviteRole,
            invited_by: currentUserId,
            status: 'pending',
          })
          .select()
          .single();

        if (error) throw error;

        // Here you would typically send an email invite as well
        // using a Supabase Edge Function

        return data;
      });

      if ('error' in result) {
        throw new Error(result.error);
      }

      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      setInviteDialogOpen(false);
      fetchPendingInvites();

      // Log the activity
      if (currentUserId) {
        await logUserActivity(currentUserId, 'invite_sent', {
          invited_email: inviteEmail,
          assigned_role: inviteRole,
        });
      }
    } catch (error) {
      console.error('Error sending invite:', error);
      toast.error('Failed to send invitation');
    } finally {
      setSendingInvite(false);
    }
  };

  const handleCancelInvite = async (inviteId: string) => {
    try {
      // Only owners can cancel invites
      const result = await withRole(['owner'], async () => {
        const { error } = await supabase
          .from('team_invites')
          .delete()
          .eq('id', inviteId);

        if (error) throw error;
        return { success: true };
      });

      if ('error' in result) {
        throw new Error(result.error);
      }

      toast.success('Invitation canceled');
      fetchPendingInvites();

      // Log the activity
      if (currentUserId) {
        await logUserActivity(currentUserId, 'invite_canceled', {
          invite_id: inviteId,
        });
      }
    } catch (error) {
      console.error('Error canceling invite:', error);
      toast.error('Failed to cancel invitation');
    }
  };

  const filteredMembers = searchQuery.trim() === ''
    ? teamMembers
    : teamMembers.filter(member => 
        `${member.first_name} ${member.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Team Management</h1>
            <p className="text-gray-500">Invite and manage your team members</p>
          </div>
          <RoleGuard 
            requiredRoles={['owner']} 
            fallback={
              <Badge variant="outline" className="px-3 py-1">
                Contact your admin to invite team members
              </Badge>
            }
          >
            <Button 
              className="bg-[#013c3f]"
              onClick={() => setInviteDialogOpen(true)}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </RoleGuard>
        </div>
        
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Team Members</h2>
            <div className="relative w-64">
              <Input 
                placeholder="Search members" 
                className="pr-8" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    </td>
                  </tr>
                ) : filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                      {searchQuery.trim() !== '' ? 'No members found matching your search' : 'No team members yet'}
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => (
                    <tr key={member.id} className={member.id === currentUserId ? 'bg-gray-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar_url} alt={`${member.first_name} ${member.last_name}`} />
                            <AvatarFallback>
                              {member.first_name.charAt(0)}{member.last_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {member.first_name} {member.last_name}
                              {member.id === currentUserId && (
                                <span className="ml-2 text-xs text-gray-500">(You)</span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <RoleSelector 
                          userId={member.id}
                          currentRole={member.role}
                          onRoleChange={(newRole) => handleRoleChange(member.id, newRole)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <RoleGuard
                            requiredRoles={['owner']}
                            fallback={null}
                          >
                            {member.id !== currentUserId && (
                              <Button variant="ghost" size="sm" className="text-red-500">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </RoleGuard>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Pending Invitations</h2>
          
          {pendingInvites.length === 0 ? (
            <div className="rounded-lg border p-8 text-center">
              <p className="text-gray-500">No pending invitations</p>
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invited On</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingInvites.map((invite) => (
                    <tr key={invite.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{invite.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          invite.role === 'owner' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {invite.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(invite.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <RoleGuard
                          requiredRoles={['owner']}
                          fallback={null}
                        >
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500"
                            onClick={() => handleCancelInvite(invite.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </RoleGuard>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Invite Member Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your team.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Role
              </label>
              <Select
                value={inviteRole}
                onValueChange={(value) => setInviteRole(value)}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                {inviteRole === 'owner' 
                  ? 'Owners have full access to all features and settings.'
                  : 'Members have limited access to features and settings.'}
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSendInvite} 
              disabled={sendingInvite || !inviteEmail.trim()}
              className="bg-[#013c3f]"
            >
              {sendingInvite ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Send Invite
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Team;
