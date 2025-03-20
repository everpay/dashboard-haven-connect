
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { AddCardModal } from '@/components/payment/AddCardModal';
import { FundCardModal } from '@/components/payment/FundCardModal';
import CardTransactions from '@/components/payment/CardTransactions';
import { FinupService } from '@/services/FinupService';
import CardList from '@/components/payment/CardList';
import CardTable from '@/components/payment/CardTable';
import CardActions from '@/components/payment/CardActions';

const Cards = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const [isFundCardModalOpen, setIsFundCardModalOpen] = useState(false);
  const [selectedCardToken, setSelectedCardToken] = useState<string>('');
  const [activeTab, setActiveTab] = useState("cards");
  const limit = 6; // Items per page
  const offset = (currentPage - 1) * limit;

  // Fetch cards from Supabase
  const { data: cards, isLoading, error, refetch } = useQuery({
    queryKey: ['cards', currentPage, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('cards')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply search filter if provided
      if (searchTerm) {
        query = query.or(`card_type.ilike.%${searchTerm}%,status.ilike.%${searchTerm}%`);
      }
      
      // Apply pagination
      query = query.range(offset, offset + limit - 1);
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // If no data, return empty array (we'll show the no cards state)
      return data || [];
    },
  });

  // Count total cards for pagination
  const { data: countData } = useQuery({
    queryKey: ['cards-count', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('cards')
        .select('*', { count: 'exact', head: true });
      
      // Apply search filter if provided
      if (searchTerm) {
        query = query.or(`card_type.ilike.%${searchTerm}%,status.ilike.%${searchTerm}%`);
      }
      
      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
    },
  });

  const createVirtualCard = async () => {
    try {
      setIsCreatingCard(true);
      console.log("Creating virtual card via Finup API...");
      
      await FinupService.createVirtualCard();
      
      toast({
        title: "Virtual card created",
        description: "Your new virtual card has been created successfully."
      });
      
      // Refresh the cards list
      refetch();
    } catch (error) {
      console.error('Error creating virtual card:', error);
      toast({
        title: "Error",
        description: "Failed to create virtual card. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingCard(false);
    }
  };

  const handleFundCard = (cardToken: string) => {
    setSelectedCardToken(cardToken);
    setIsFundCardModalOpen(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCardAdded = (cardToken: string) => {
    toast({
      title: "Card Added",
      description: "Your card has been added successfully.",
    });
    refetch();
    setIsAddCardModalOpen(false);
  };

  const handleCardFunded = () => {
    queryClient.invalidateQueries({ queryKey: ['cards'] });
    queryClient.invalidateQueries({ queryKey: ['card-transactions'] });
  };

  const totalPages = Math.ceil((countData || 0) / limit);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Cards</h1>
            <p className="text-gray-500">Manage your virtual and physical cards</p>
          </div>
          <CardActions 
            onAddCard={() => setIsAddCardModalOpen(true)}
            onCreateVirtualCard={createVirtualCard}
            isCreatingCard={isCreatingCard}
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="cards">My Cards</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cards" className="mt-6">
            <CardList 
              cards={cards}
              isLoading={isLoading}
              error={error}
              onFundCard={handleFundCard}
            />

            <CardTable 
              cards={cards}
              isLoading={isLoading}
              error={error}
              searchTerm={searchTerm}
              onSearchChange={handleSearch}
              currentPage={currentPage}
              totalPages={totalPages}
              countData={countData}
              limit={limit}
              offset={offset}
              onPageChange={setCurrentPage}
              onFundCard={handleFundCard}
            />
          </TabsContent>
          
          <TabsContent value="transactions" className="mt-6">
            <CardTransactions />
          </TabsContent>
        </Tabs>
      </div>

      <AddCardModal 
        open={isAddCardModalOpen} 
        onOpenChange={setIsAddCardModalOpen}
        onSuccess={handleCardAdded}
      />
      
      <FundCardModal
        open={isFundCardModalOpen}
        onOpenChange={setIsFundCardModalOpen}
        cardToken={selectedCardToken}
        onSuccess={handleCardFunded}
      />
    </DashboardLayout>
  );
};

export default Cards;
