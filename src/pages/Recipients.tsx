
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/auth';
import { Recipient, useRecipients } from '@/hooks/useRecipients';
import RecipientTable from '@/components/recipients/RecipientTable';
import RecipientSearch from '@/components/recipients/RecipientSearch';
import RecipientHeader from '@/components/recipients/RecipientHeader';
import RecipientDialog from '@/components/recipients/RecipientDialog';
import { useRecipientForm } from '@/hooks/useRecipientForm';

const Recipients = () => {
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
  
  const {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    currentRecipient,
    formData,
    handleInputChange,
    handleSelectChange,
    resetForm,
    openEditDialog,
    openAddDialog
  } = useRecipientForm();
  
  // Filter recipients based on search term
  const recipients = allRecipients?.filter(recipient => 
    !searchTerm || 
    recipient.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipient.email_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipient.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipient.region?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
  
  const handleDelete = (recipientId: number) => {
    if (window.confirm('Are you sure you want to delete this recipient?')) {
      deleteRecipient(recipientId);
    }
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
        <RecipientHeader 
          onAddRecipient={openAddDialog} 
          isDisabled={!user}
        />
        
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

      <RecipientDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        formData={formData}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
        onSubmit={handleAddSubmit}
        title="Add New Recipient"
      />

      <RecipientDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        formData={formData}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
        onSubmit={handleEditSubmit}
        title="Edit Recipient"
        isEdit={true}
      />
    </DashboardLayout>
  );
};

export default Recipients;
