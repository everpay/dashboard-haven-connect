
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Download, Filter, Plus, Search, CreditCard, Eye, EyeOff } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const Cards = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const [revealedCardIndexes, setRevealedCardIndexes] = useState<{ [key: number]: boolean }>({});

  // Mock card data - would be replaced with real API call
  const cards = [
    {
      id: "1",
      cardholderName: "John Smith",
      last4: "4242",
      expirationDate: "12/2025",
      cardType: "Virtual",
      status: "Active",
      createdAt: "2023-05-15"
    },
    {
      id: "2",
      cardholderName: "Sarah Johnson",
      last4: "5678",
      expirationDate: "09/2024",
      cardType: "Physical",
      status: "Active",
      createdAt: "2023-04-02"
    },
    {
      id: "3",
      cardholderName: "Michael Brown",
      last4: "9012",
      expirationDate: "03/2026",
      cardType: "Virtual",
      status: "Inactive",
      createdAt: "2023-06-20"
    }
  ];

  const createVirtualCard = () => {
    toast({
      title: "Creating virtual card",
      description: "This would connect to the Marqeta API to create a new virtual card."
    });
    // Here you would call the Marqeta API to create a virtual card
  };

  const toggleCardReveal = (index: number) => {
    setRevealedCardIndexes(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Cards</h1>
            <p className="text-gray-500">Manage your virtual and physical cards</p>
          </div>
          <Button onClick={createVirtualCard}>
            <Plus className="h-4 w-4 mr-2" />
            Create Virtual Card
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <Card key={card.id} className="p-6 relative overflow-hidden">
              <div className="flex justify-between mb-8">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">{card.cardType} Card</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  card.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {card.status}
                </span>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-5 rounded-lg text-white shadow-md mb-4">
                <div className="flex justify-between mb-8">
                  <div>
                    <p className="text-xs opacity-80">Card Number</p>
                    <p className="font-mono">
                      •••• •••• •••• {revealedCardIndexes[index] ? "1234" : card.last4}
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
                    <p>{card.expirationDate}</p>
                  </div>
                </div>
                <p className="uppercase text-sm">{card.cardholderName}</p>
              </div>
              
              <div className="flex justify-between text-sm text-gray-500">
                <span>Created {card.createdAt}</span>
                <Button variant="link" size="sm" className="p-0 h-auto">Manage</Button>
              </div>
            </Card>
          ))}
        </div>
        
        <Card className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search cards"
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Card Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cards.map((card) => (
                  <tr key={card.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <CreditCard className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{card.cardholderName}</div>
                          <div className="text-sm text-gray-500">•••• {card.last4}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{card.cardType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{card.expirationDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        card.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {card.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{cards.length}</span> of <span className="font-medium">{cards.length}</span> results
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" disabled={true} onClick={() => setCurrentPage(currentPage + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Cards;
