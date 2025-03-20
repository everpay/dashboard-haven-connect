
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PayoutData {
  id: string;
  created_at: string;
  status: string;
  amount: string | number;
  description: string;
  payment_method: string;
  metadata?: {
    RECIPIENT_FULL_NAME?: string;
    [key: string]: any;
  };
}

interface PayoutTableProps {
  payouts: PayoutData[] | null;
  isLoading: boolean;
  error: unknown;
  formatDate: (date: string) => string;
  getStatusColor: (status: string) => string;
  formatPaymentMethod: (method: string) => string;
}

export const PayoutTable: React.FC<PayoutTableProps> = ({
  payouts,
  isLoading,
  error,
  formatDate,
  getStatusColor,
  formatPaymentMethod
}) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Date</TableHeader>
            <TableHeader>Recipient</TableHeader>
            <TableHeader>Method</TableHeader>
            <TableHeader>Description</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader className="text-right">Amount</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1AA47B]"></div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">Loading payouts...</div>
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-red-500">Failed to load payouts</TableCell>
            </TableRow>
          ) : payouts && payouts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">No payouts found</TableCell>
            </TableRow>
          ) : (
            payouts?.map((payout: PayoutData) => (
              <TableRow key={payout.id}>
                <TableCell>
                  <div className="text-sm text-foreground">{formatDate(payout.created_at)}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium text-foreground">
                    {payout.metadata?.RECIPIENT_FULL_NAME || "Unknown Recipient"}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium text-foreground">
                    {formatPaymentMethod(payout.payment_method)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground">{payout.description}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(payout.status || 'pending')}>
                    {payout.status ? payout.status.charAt(0).toUpperCase() + payout.status.slice(1) : 'Pending'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="text-sm font-medium text-foreground">
                    ${payout.amount ? parseFloat(payout.amount.toString()).toFixed(2) : '0.00'}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
