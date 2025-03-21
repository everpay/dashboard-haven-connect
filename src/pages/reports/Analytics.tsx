
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TabsContent } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { AnalyticsHeader } from "@/components/reports/AnalyticsHeader";
import { MetricsSection } from "@/components/reports/MetricsSection";
import { CustomersSection } from "@/components/reports/CustomersSection";
import { GeographicDistribution } from "@/components/reports/GeographicDistribution";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

const COLORS = ['#1AA47B', '#19363B', '#e3a008', '#9333ea'];

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('metrics');
  const [timeframe, setTimeframe] = useState('6months');
  
  // Use our custom hook to fetch data
  const { mrrData, churnData, customerData, geoData, isLoading } = useAnalyticsData(activeTab, timeframe);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AnalyticsHeader activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="mt-6">
          {activeTab === 'metrics' && (
            <MetricsSection 
              mrrData={mrrData} 
              churnData={churnData} 
              timeframe={timeframe}
              setTimeframe={setTimeframe}
            />
          )}

          {activeTab === 'customers' && (
            <CustomersSection customerData={customerData} colors={COLORS} />
          )}

          {activeTab === 'geography' && (
            <GeographicDistribution geoData={geoData} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
