
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useToast } from '@/components/ui/use-toast';
import { useUserProfile } from '@/hooks/payment/useUserProfile';
import { useRecipients } from '@/hooks/useRecipients';
import { useRecipientForm } from '@/hooks/useRecipientForm';
import RecipientTable from '@/components/recipients/RecipientTable';
import RecipientSearch from '@/components/recipients/RecipientSearch';
import RecipientHeader from '@/components/recipients/RecipientHeader';
import RecipientDialog from '@/components/recipients/RecipientDialog';

const Recipients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Use useUserProfile to ensure profile exists
  const { user } = useUserProfile();
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
    toast({
      title: "Recipient added",
      description: "The recipient has been added successfully",
    });
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
      toast({
        title: "Recipient updated",
        description: "The recipient has been updated successfully",
      });
    }
  };
  
  const handleDelete = (recipientId: number) => {
    if (window.confirm('Are you sure you want to delete this recipient?')) {
      deleteRecipient(recipientId);
      toast({
        title: "Recipient deleted",
        description: "The recipient has been deleted successfully",
      });
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <RecipientHeader 
          onAddRecipient={openAddDialog} 
          isDisabled={false} // Allow adding recipients even for demo
        />
        
        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
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
        </div>
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
