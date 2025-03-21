
import React, { useState, useEffect } from 'react';
import { InteractiveBarChart } from "@/components/charts/InteractiveBarChart";
import { TimeframeSelector } from "@/components/charts/TimeframeSelector";
import { TimeframeOption, formatDateRange } from "@/utils/timeframeUtils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    }
  }, [paymentMethodData]);

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-sm font-semibold">Sales Overview</h2>
          <p className="text-xs text-muted-foreground">{formatDateRange(timeframe)}</p>
        </div>
        <div className="flex items-center gap-2">
          <TimeframeSelector 
            currentTimeframe={timeframe} 
            onTimeframeChange={onTimeframeChange}
          />
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[200px]">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="payment">By Payment</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <TabsContent value="overview" className="mt-0">
        <InteractiveBarChart 
          data={chartData}
          valuePrefix="$"
          title="Sales Overview"
          barSize={chartData.length > 10 ? 12 : 20}
        />
      </TabsContent>
      
      <TabsContent value="payment" className="mt-0">
        <InteractiveBarChart 
          data={processedPaymentData}
          valuePrefix="$"
          title="Sales by Payment Method"
          colorScheme={["#4A6FA5", "#6025C0"]}
          barSize={processedPaymentData.length > 10 ? 12 : 20}
        />
      </TabsContent>
    </div>
  );
};
