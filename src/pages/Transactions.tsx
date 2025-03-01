
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronLeft, ChevronRight, Download, Filter, Search } from 'lucide-react';

const Transactions = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const transactions = [
    {
      id: '1',
      date: 'Jun 27, 2023',
      time: '15:30',
      name: 'Alex Johnson',
      type: 'Payment',
      amount: '-$250.00',
      status: 'Completed',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61',
      initials: 'AJ',
    },
    {
      id: '2',
      date: 'Jun 26, 2023',
      time: '12:15',
      name: 'Sarah Wilson',
      type: 'Deposit',
      amount: '+$1,500.00',
      status: 'Completed',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      initials: 'SW',
    },
    {
      id: '3',
      date: 'Jun 25, 2023',
      time: '09:45',
      name: 'Transfer to Bank',
      type: 'Withdrawal',
      amount: '-$500.00',
      status: 'Completed',
      avatar: '',
      initials: 'TB',
    },
    {
      id: '4',
      date: 'Jun 24, 2023',
      time: '18:20',
      name: 'Subscription',
      type: 'Payment',
      amount: '-$15.99',
      status: 'Completed',
      avatar: '',
      initials: 'SB',
    },
    {
      id: '5',
      date: 'Jun 23, 2023',
      time: '14:10',
      name: 'Miguel Rodriguez',
      type: 'Payment',
      amount: '-$75.50',
      status: 'Pending',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
      initials: 'MR',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-gray-500">View and manage all your transactions</p>
        </div>
        
        <Card className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search transactions"
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{transaction.date}</div>
                        <div className="text-sm text-gray-500">{transaction.time}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {transaction.avatar ? (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={transaction.avatar} alt={transaction.name} />
                            <AvatarFallback>{transaction.initials}</AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <span className="text-xs font-medium">{transaction.initials}</span>
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{transaction.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{transaction.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        transaction.amount.startsWith('+') ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {transaction.amount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm">Details</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">20</span> results
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
