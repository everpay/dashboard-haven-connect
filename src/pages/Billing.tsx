
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckIcon, CreditCardIcon } from 'lucide-react';

const Billing = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Billing</h1>
          <p className="text-gray-500">Manage your subscription and payment methods</p>
        </div>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="border rounded-lg p-6 bg-[#013c3f]/5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">Free Plan</h3>
                  <p className="text-2xl font-bold mt-2">$0<span className="text-sm font-normal text-gray-500">/month</span></p>
                </div>
                <span className="text-xs font-medium bg-[#013c3f] text-white px-2 py-1 rounded">CURRENT</span>
              </div>
              
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <CheckIcon className="h-4 w-4 text-[#013c3f]" />
                  <span>10 transactions per month</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckIcon className="h-4 w-4 text-[#013c3f]" />
                  <span>Basic analytics</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckIcon className="h-4 w-4 text-[#013c3f]" />
                  <span>Email support</span>
                </li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-6">
              <div>
                <h3 className="font-semibold">Pro Plan</h3>
                <p className="text-2xl font-bold mt-2">$29<span className="text-sm font-normal text-gray-500">/month</span></p>
              </div>
              
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <CheckIcon className="h-4 w-4 text-[#013c3f]" />
                  <span>Unlimited transactions</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckIcon className="h-4 w-4 text-[#013c3f]" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckIcon className="h-4 w-4 text-[#013c3f]" />
                  <span>Priority support</span>
                </li>
              </ul>
              
              <Button className="w-full mt-4 bg-[#013c3f]">Upgrade</Button>
            </div>
            
            <div className="border rounded-lg p-6">
              <div>
                <h3 className="font-semibold">Enterprise Plan</h3>
                <p className="text-2xl font-bold mt-2">$99<span className="text-sm font-normal text-gray-500">/month</span></p>
              </div>
              
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <CheckIcon className="h-4 w-4 text-[#013c3f]" />
                  <span>Unlimited everything</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckIcon className="h-4 w-4 text-[#013c3f]" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckIcon className="h-4 w-4 text-[#013c3f]" />
                  <span>Dedicated support</span>
                </li>
              </ul>
              
              <Button variant="outline" className="w-full mt-4">Contact Sales</Button>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
          
          <div className="border rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                <CreditCardIcon className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium">**** **** **** 4242</p>
                <p className="text-sm text-gray-500">Expires 12/2025</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Edit</Button>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button variant="outline">Add Payment Method</Button>
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Billing History</h2>
          
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Amount</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-4 py-3">May 1, 2023</td>
                  <td className="px-4 py-3">$0.00</td>
                  <td className="px-4 py-3"><span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded">Paid</span></td>
                  <td className="px-4 py-3 text-right"><Button variant="ghost" size="sm">Download</Button></td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Apr 1, 2023</td>
                  <td className="px-4 py-3">$0.00</td>
                  <td className="px-4 py-3"><span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded">Paid</span></td>
                  <td className="px-4 py-3 text-right"><Button variant="ghost" size="sm">Download</Button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Billing;
