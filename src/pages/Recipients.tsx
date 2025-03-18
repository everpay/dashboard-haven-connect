
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Search, Plus, Edit, Trash2, Download, Filter, User, UserPlus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

interface Recipient {
  recipient_id: number;
  first_names: string;
  last_names: string;
  full_name: string;
  email_address?: string;
  telephone_number?: string;
  street_1?: string;
  street_2?: string;
  city?: string;
  region?: string;
  postal_code?: string;
  country_iso3?: string;
  created_at?: string;
  user_id?: string;
}

const Recipients = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentRecipient, setCurrentRecipient] = useState<Recipient | null>(null);
  const [formData, setFormData] = useState<Partial<Recipient>>({
    first_names: '',
    last_names: '',
    full_name: '',
    email_address: '',
    telephone_number: '',
    street_1: '',
    street_2: '',
    city: '',
    region: '',
    postal_code: '',
    country_iso3: 'USA',
  });
  
  const queryClient = useQueryClient();
  const { session, user } = useAuth();
  const { toast } = useToast();
  
  const { data: recipients, isLoading } = useQuery({
    queryKey: ['recipients', user?.id],
    queryFn: async () => {
      console.log('Fetching recipients for user:', user?.id);
      
      if (!user) {
        console.log('No authenticated user found');
        return [];
      }
      
      const { data, error } = await supabase
        .from('recipients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching recipients:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!user
  });
  
  const addRecipient = useMutation({
    mutationFn: async (newRecipient: Partial<Recipient>) => {
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Instead of using user.id directly, let's save in the profiles table first
      // Check if the user exists in the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        // User doesn't exist in profiles table, create a profile first
        const { error: insertProfileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
          });
        
        if (insertProfileError) {
          console.error('Error creating profile:', insertProfileError);
          throw insertProfileError;
        }
      }
      
      const recipient = {
        ...newRecipient,
        full_name: `${newRecipient.first_names} ${newRecipient.last_names}`,
        user_id: user.id
      };
      
      console.log('Adding recipient:', recipient);
      
      const { data, error } = await supabase
        .from('recipients')
        .insert([recipient])
        .select();
      
      if (error) {
        console.error('Error details:', error);
        throw error;
      }
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipients'] });
      toast({ title: "Success", description: "Recipient added successfully" });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error('Error adding recipient:', error);
      toast({ 
        title: "Error", 
        description: "Failed to add recipient", 
        variant: "destructive" 
      });
    }
  });
  
  const updateRecipient = useMutation({
    mutationFn: async (updatedRecipient: Partial<Recipient>) => {
      if (!currentRecipient?.recipient_id) throw new Error("No recipient selected");
      if (!user) throw new Error("User not authenticated");
      
      const recipient = {
        ...updatedRecipient,
        full_name: `${updatedRecipient.first_names} ${updatedRecipient.last_names}`,
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from('recipients')
        .update(recipient)
        .eq('recipient_id', currentRecipient.recipient_id)
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipients'] });
      toast({ title: "Success", description: "Recipient updated successfully" });
      setIsEditDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error('Error updating recipient:', error);
      toast({ 
        title: "Error", 
        description: "Failed to update recipient", 
        variant: "destructive" 
      });
    }
  });
  
  const deleteRecipient = useMutation({
    mutationFn: async (recipientId: number) => {
      const { error } = await supabase
        .from('recipients')
        .delete()
        .eq('recipient_id', recipientId);
      
      if (error) throw error;
      return recipientId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipients'] });
      toast({ title: "Success", description: "Recipient deleted successfully" });
    },
    onError: (error) => {
      console.error('Error deleting recipient:', error);
      toast({ 
        title: "Error", 
        description: "Failed to delete recipient", 
        variant: "destructive" 
      });
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRecipient.mutate(formData);
  };
  
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateRecipient.mutate(formData);
  };
  
  const openEditDialog = (recipient: Recipient) => {
    setCurrentRecipient(recipient);
    setFormData({
      first_names: recipient.first_names,
      last_names: recipient.last_names,
      email_address: recipient.email_address || '',
      telephone_number: recipient.telephone_number || '',
      street_1: recipient.street_1 || '',
      street_2: recipient.street_2 || '',
      city: recipient.city || '',
      region: recipient.region || '',
      postal_code: recipient.postal_code || '',
      country_iso3: recipient.country_iso3 || 'USA',
    });
    setIsEditDialogOpen(true);
  };
  
  const handleDelete = (recipientId: number) => {
    if (window.confirm('Are you sure you want to delete this recipient?')) {
      deleteRecipient.mutate(recipientId);
    }
  };
  
  const resetForm = () => {
    setFormData({
      first_names: '',
      last_names: '',
      email_address: '',
      telephone_number: '',
      street_1: '',
      street_2: '',
      city: '',
      region: '',
      postal_code: '',
      country_iso3: 'USA',
    });
    setCurrentRecipient(null);
  };
  
  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };
  
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to manage recipients",
        variant: "destructive"
      });
    }
  }, [user, toast]);
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Recipients</h1>
            <p className="text-gray-500">Manage payout recipients for ACH, SWIFT, or card payments</p>
          </div>
          <Button 
            onClick={openAddDialog} 
            className="bg-[#E3FFCC] text-[#19363B] hover:bg-[#D1EEBB]"
            disabled={!user}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Recipient
          </Button>
        </div>
        
        <Card className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search recipients"
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {!user ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center">
                      Please sign in to view your recipients
                    </td>
                  </tr>
                ) : isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center">Loading recipients...</td>
                  </tr>
                ) : recipients && recipients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center">No recipients found</td>
                  </tr>
                ) : (
                  recipients?.map((recipient: Recipient) => (
                    <tr key={recipient.recipient_id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{recipient.full_name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{recipient.email_address || "—"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{recipient.telephone_number || "—"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {recipient.city && recipient.region ? `${recipient.city}, ${recipient.region}` : 
                           recipient.city || recipient.region || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openEditDialog(recipient)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(recipient.recipient_id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Recipient</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_names">First Name</Label>
                  <Input
                    id="first_names"
                    name="first_names"
                    value={formData.first_names}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_names">Last Name</Label>
                  <Input
                    id="last_names"
                    name="last_names"
                    value={formData.last_names}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email_address">Email Address</Label>
                  <Input
                    id="email_address"
                    name="email_address"
                    type="email"
                    value={formData.email_address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephone_number">Telephone Number</Label>
                  <Input
                    id="telephone_number"
                    name="telephone_number"
                    value={formData.telephone_number}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="street_1">Address Line 1</Label>
                <Input
                  id="street_1"
                  name="street_1"
                  value={formData.street_1}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="street_2">Address Line 2 (Optional)</Label>
                <Input
                  id="street_2"
                  name="street_2"
                  value={formData.street_2}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">State/Region</Label>
                  <Input
                    id="region"
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input
                    id="postal_code"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country_iso3">Country</Label>
                  <Select 
                    value={formData.country_iso3} 
                    onValueChange={(value) => handleSelectChange('country_iso3', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USA">United States</SelectItem>
                      <SelectItem value="CAN">Canada</SelectItem>
                      <SelectItem value="GBR">United Kingdom</SelectItem>
                      <SelectItem value="AUS">Australia</SelectItem>
                      <SelectItem value="DEU">Germany</SelectItem>
                      <SelectItem value="FRA">France</SelectItem>
                      <SelectItem value="JPN">Japan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#E3FFCC] text-[#19363B] hover:bg-[#D1EEBB]">
                Add Recipient
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Recipient</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_first_names">First Name</Label>
                  <Input
                    id="edit_first_names"
                    name="first_names"
                    value={formData.first_names}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_last_names">Last Name</Label>
                  <Input
                    id="edit_last_names"
                    name="last_names"
                    value={formData.last_names}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_email_address">Email Address</Label>
                  <Input
                    id="edit_email_address"
                    name="email_address"
                    type="email"
                    value={formData.email_address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_telephone_number">Telephone Number</Label>
                  <Input
                    id="edit_telephone_number"
                    name="telephone_number"
                    value={formData.telephone_number}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit_street_1">Address Line 1</Label>
                <Input
                  id="edit_street_1"
                  name="street_1"
                  value={formData.street_1}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit_street_2">Address Line 2 (Optional)</Label>
                <Input
                  id="edit_street_2"
                  name="street_2"
                  value={formData.street_2}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_city">City</Label>
                  <Input
                    id="edit_city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_region">State/Region</Label>
                  <Input
                    id="edit_region"
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_postal_code">Postal Code</Label>
                  <Input
                    id="edit_postal_code"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_country_iso3">Country</Label>
                  <Select 
                    value={formData.country_iso3} 
                    onValueChange={(value) => handleSelectChange('country_iso3', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USA">United States</SelectItem>
                      <SelectItem value="CAN">Canada</SelectItem>
                      <SelectItem value="GBR">United Kingdom</SelectItem>
                      <SelectItem value="AUS">Australia</SelectItem>
                      <SelectItem value="DEU">Germany</SelectItem>
                      <SelectItem value="FRA">France</SelectItem>
                      <SelectItem value="JPN">Japan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#E3FFCC] text-[#19363B] hover:bg-[#D1EEBB]">
                Update Recipient
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Recipients;
