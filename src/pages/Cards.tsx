
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Download, Filter, Plus, Search, CreditCard, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/lib/supabase";

const Cards = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const [revealedCardIndexes, setRevealedCardIndexes] = useState<{ [key: number]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState('');
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
      // Generate a mock card token
      const cardToken = `card_${Math.random().toString(36).substring(2, 10)}`;
      
      // Generate a card expiration date (2 years from now)
      const now = new Date();
      const expiryMonth = String(now.getMonth() + 1).padStart(2, '0');
      const expiryYear = now.getFullYear() + 2;
      const expiration = `${expiryMonth}/${expiryYear}`;
      
      // Insert a new card into the database
      const { data, error } = await supabase
        .from('cards')
        .insert([
          {
            card_token: cardToken,
            card_type: 'virtual',
            expiration: expiration,
            status: 'active'
          }
        ])
        .select();
      
      if (error) {
        throw error;
      }
      
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
    }
  };

  const toggleCardReveal = (index: number) => {
    setRevealedCardIndexes(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const formatCardToken = (token: string) => {
    // Extract the last 4 digits or characters from the token
    const last4 = token.slice(-4);
    return last4;
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
          <Button onClick={createVirtualCard} className="bg-[#1AA47B] hover:bg-[#19363B]">
            <Plus className="h-4 w-4 mr-2" />
            Create Virtual Card
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-[#1AA47B]" />
          </div>
        ) : error ? (
          <Card className="p-6">
            <div className="text-center text-red-500">
              Failed to load cards. Please try again.
            </div>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards && cards.length > 0 ? (
                cards.map((card: any, index: number) => (
                  <Card key={card.id} className="p-6 relative overflow-hidden">
                    <div className="flex justify-between mb-8">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">{card.card_type || 'Virtual'} Card</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        card.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {card.status || 'Active'}
                      </span>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-5 rounded-lg text-white shadow-md mb-4">
                      <div className="flex justify-between mb-8">
                        <div>
                          <p className="text-xs opacity-80">Card Number</p>
                          <p className="font-mono">
                            •••• •••• •••• {revealedCardIndexes[index] ? "1234" : formatCardToken(card.card_token)}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="ml-2 text-white h-5 w-5"
                              onClick={() => toggleCardReveal(index)}
                            >
                              {revealedCardIndexes[index] ? <EyeOff size={14} /> : <Eye size={14} />}
                            </Button>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs opacity-80">Expires</p>
                          <p>{card.expiration || 'MM/YY'}</p>
                        </div>
                      </div>
                      <p className="uppercase text-sm">Virtual Card</p>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Created {new Date(card.created_at).toLocaleDateString()}</span>
                      <Button variant="link" size="sm" className="p-0 h-auto">Manage</Button>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center p-12 border border-dashed rounded-lg">
                  <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No cards found</h3>
                  <p className="text-gray-500 mb-4">You haven't created any cards yet.</p>
                  <Button onClick={createVirtualCard} className="bg-[#1AA47B] hover:bg-[#19363B]">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Virtual Card
                  </Button>
                </div>
              )}
            </div>

            <Card className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search cards"
                    className="pl-10"
                    value={searchTerm}
                    onChange={handleSearch}
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Card Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center">
                          <Loader2 className="h-5 w-5 animate-spin mx-auto text-[#1AA47B]" />
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-red-500">
                          Failed to load cards
                        </td>
                      </tr>
                    ) : cards && cards.length > 0 ? (
                      cards.map((card: any) => (
                        <tr key={card.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <CreditCard className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">Virtual Card</div>
                                <div className="text-sm text-gray-500">•••• {formatCardToken(card.card_token)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{card.card_type || 'Virtual'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{card.expiration || 'MM/YY'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              card.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {card.status || 'Active'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="ghost" size="sm">View</Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          No cards found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {countData && countData > 0 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500">
                    Showing <span className="font-medium">{offset + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(offset + limit, countData)}</span> of{' '}
                    <span className="font-medium">{countData}</span> results
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Cards;
