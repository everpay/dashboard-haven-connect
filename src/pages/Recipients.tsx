
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/auth';
import { Recipient, useRecipients } from '@/hooks/useRecipients';
import RecipientForm from '@/components/recipients/RecipientForm';
import RecipientTable from '@/components/recipients/RecipientTable';
import RecipientSearch from '@/components/recipients/RecipientSearch';

const Recipients = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentRecipient, setCurrentRecipient] = useState<Recipient | null>(null);
  const [formData, setFormData] = useState<Partial<Recipient>>({
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
  const [searchTerm, setSearchTerm] = useState('');
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  const {
    recipients: allRecipients,
    isLoading,
    addRecipient,
    updateRecipient,
    deleteRecipient
  } = useRecipients();
  
  // Filter recipients based on search term
  const recipients = allRecipients?.filter(recipient => 
    !searchTerm || 
    recipient.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipient.email_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipient.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipient.region?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRecipient(formData);
    setIsAddDialogOpen(false);
    resetForm();
  };
  
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentRecipient) {
      updateRecipient({
        recipientId: currentRecipient.recipient_id,
        updatedRecipient: formData
      });
      setIsEditDialogOpen(false);
      resetForm();
    }
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
      deleteRecipient(recipientId);
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
            <h1 className="text-2xl font-bold text-foreground">Recipients</h1>
            <p className="text-muted-foreground">Manage payout recipients for ACH, SWIFT, or card payments</p>
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
        
        <Card className="p-6 bg-card text-card-foreground">
          <RecipientSearch 
            onSearch={setSearchTerm} 
            searchTerm={searchTerm} 
          />
          
          <RecipientTable 
            recipients={recipients}
            isLoading={isLoading}
            onEditRecipient={openEditDialog}
            onDeleteRecipient={handleDelete}
            user={user}
          />
        </Card>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-background">
          <DialogHeader>
            <DialogTitle className="text-foreground">Add New Recipient</DialogTitle>
          </DialogHeader>
          <RecipientForm 
            formData={formData}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            onSubmit={handleAddSubmit}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-background">
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit Recipient</DialogTitle>
          </DialogHeader>
          <RecipientForm 
            formData={formData}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            onSubmit={handleEditSubmit}
            onCancel={() => setIsEditDialogOpen(false)}
            isEdit={true}
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Recipients;
