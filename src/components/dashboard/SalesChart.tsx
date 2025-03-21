
import React, { useState, useEffect } from 'react';
import { InteractiveBarChart } from "@/components/charts/InteractiveBarChart";
import { TimeframeSelector } from "@/components/charts/TimeframeSelector";
import { TimeframeOption, formatDateRange } from "@/utils/timeframeUtils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SalesChartProps {
  chartData: any[];
  timeframe: TimeframeOption;
  onTimeframeChange: (timeframe: TimeframeOption) => void;
  paymentMethodData?: any[];
}

export const SalesChart = ({ 
  chartData, 
  timeframe, 
  onTimeframeChange,
  paymentMethodData = []
}: SalesChartProps) => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [processedPaymentData, setProcessedPaymentData] = useState<any[]>([]);
  
  useEffect(() => {
    // Process payment method data for visualization
    if (paymentMethodData && paymentMethodData.length > 0) {
      // Sort payment method data by value in descending order
      const sortedData = [...paymentMethodData].sort((a, b) => b.value - a.value);
      
      // Take the top 8 methods and group the rest as "Other"
      if (sortedData.length > 8) {
        const topMethods = sortedData.slice(0, 7);
        const otherMethods = sortedData.slice(7);
        
        const otherTotal = otherMethods.reduce((total, item) => total + item.value, 0);
        
        const processedData = [
          ...topMethods,
          { name: 'Other', value: otherTotal }
        ];
        
        setProcessedPaymentData(processedData);
      } else {
        setProcessedPaymentData(sortedData);
      }
    } else {
      setProcessedPaymentData([]);
    }
  }, [paymentMethodData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-2 border border-border rounded shadow-md">
          <p className="font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: $${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-sm font-semibold">Sales Overview</h2>
          <p className="text-xs text-muted-foreground">{formatDateRange(timeframe)}</p>
        </div>
        <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-[200px]">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payment">By Payment</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="overview" className="mt-0">
          <Card>
            <CardContent className="pt-6">
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      name="Sales ($)" 
                      stroke="#1AA47B" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="declines" 
                      name="Declines ($)" 
                      stroke="#F97066" 
                      strokeDasharray="5 5"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="chargebacks" 
                      name="Chargebacks ($)" 
                      stroke="#9E77ED" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment" className="mt-0">
          {processedPaymentData.length > 0 ? (
            <InteractiveBarChart 
              data={processedPaymentData}
              valuePrefix="$"
              title="Sales by Payment Method"
              colorScheme={["#4A6FA5", "#6025C0"]}
              barSize={processedPaymentData.length > 10 ? 12 : 20}
            />
          ) : (
            <div className="flex justify-center items-center h-[300px] border border-dashed rounded-md">
              <p className="text-muted-foreground">No payment data available</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
