
import React from 'react';
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TimeframeSelector } from "@/components/charts/TimeframeSelector";
import { TimeframeOption } from "@/utils/timeframeUtils";

interface TransactionHistoryChartProps {
  transactionData: any[];
  timeframe: TimeframeOption;
  onTimeframeChange: (timeframe: TimeframeOption) => void;
}

export const TransactionHistoryChart = ({
  transactionData,
  timeframe,
  onTimeframeChange
}: TransactionHistoryChartProps) => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-base">Transaction History</h3>
        <TimeframeSelector 
          currentTimeframe={timeframe} 
          onTimeframeChange={onTimeframeChange}
        />
      </div>
      <div className="h-[300px]">
        {transactionData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={transactionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#1AA47B" 
                activeDot={{ r: 8 }} 
                name="Amount ($)"
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#19363B" 
                name="# Transactions"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex justify-center items-center h-full border border-dashed rounded-md">
            <p className="text-muted-foreground">No transaction data available</p>
          </div>
        )}
      </div>
    </Card>
  );
};
