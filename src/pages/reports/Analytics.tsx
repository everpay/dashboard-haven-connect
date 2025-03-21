
import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { logIpEvent } from "@/utils/logIpEvent";
import { AnalyticsHeader } from "@/components/reports/AnalyticsHeader";
import { MetricsSection } from "@/components/reports/MetricsSection";
import { CustomersSection } from "@/components/reports/CustomersSection";
import { GeographicDistribution } from "@/components/reports/GeographicDistribution";

// ChartMogul integration - this would be replaced with actual API calls
const fetchChartMogulData = async (userId: string, dataType: string) => {
  // Simulate ChartMogul API data
  // In production, you would make actual API calls to ChartMogul
  const mockMRRData = [
    { name: 'Jan', value: 5000 },
    { name: 'Feb', value: 5200 },
    { name: 'Mar', value: 5500 },
    { name: 'Apr', value: 5800 },
    { name: 'May', value: 6200 },
    { name: 'Jun', value: 6500 },
  ];

  const mockChurnData = [
    { name: 'Jan', value: 2.1 },
    { name: 'Feb', value: 1.9 },
    { name: 'Mar', value: 2.3 },
    { name: 'Apr', value: 1.8 },
    { name: 'May', value: 1.5 },
    { name: 'Jun', value: 1.4 },
  ];

  const mockCustomerData = [
    { name: 'Active', value: 240 },
    { name: 'Churned', value: 15 },
    { name: 'Trial', value: 45 },
  ];

  // Return different data based on the requested type
  if (dataType === 'mrr') return mockMRRData;
  if (dataType === 'churn') return mockChurnData;
  if (dataType === 'customers') return mockCustomerData;

  return [];
};

const COLORS = ['#1AA47B', '#19363B', '#e3a008', '#9333ea'];

const Analytics = () => {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const [activeTab, setActiveTab] = useState('metrics');
  const [timeframe, setTimeframe] = useState('6months');

  // Log page view
  useEffect(() => {
    if (userId) {
      logIpEvent(userId, 'page_view_reports_analytics');
    }
  }, [userId]);

  // Fetch ChartMogul MRR data
  const { data: mrrData, isLoading: mrrLoading } = useQuery({
    queryKey: ['chartmogul-mrr', userId, timeframe],
    queryFn: async () => {
      if (!userId) return [];
      return fetchChartMogulData(userId, 'mrr');
    },
    enabled: !!userId && activeTab === 'metrics',
  });

  // Fetch ChartMogul churn data
  const { data: churnData, isLoading: churnLoading } = useQuery({
    queryKey: ['chartmogul-churn', userId, timeframe],
    queryFn: async () => {
      if (!userId) return [];
      return fetchChartMogulData(userId, 'churn');
    },
    enabled: !!userId && activeTab === 'metrics',
  });

  // Fetch ChartMogul customer segments
  const { data: customerData, isLoading: customerLoading } = useQuery({
    queryKey: ['chartmogul-customers', userId],
    queryFn: async () => {
      if (!userId) return [];
      return fetchChartMogulData(userId, 'customers');
    },
    enabled: !!userId && activeTab === 'customers',
  });

  // Fetch geo data
  const { data: geoData, isLoading: geoLoading } = useQuery({
    queryKey: ['analytics-geo', userId],
    queryFn: async () => {
      // This would be a real database query in production
      // For now, return mock data
      return [
        { country: 'United States', count: 120 },
        { country: 'Canada', count: 80 },
        { country: 'United Kingdom', count: 60 },
        { country: 'Germany', count: 40 },
        { country: 'France', count: 30 },
      ];
    },
    enabled: !!userId && activeTab === 'geography',
  });

  const isLoading = mrrLoading || churnLoading || customerLoading || geoLoading;

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

        <div className="flex items-center justify-between">
          <Tabs defaultValue="metrics" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="geography">Geography</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="metrics" className="space-y-6">
                <MetricsSection 
                  mrrData={mrrData || []} 
                  churnData={churnData || []} 
                  timeframe={timeframe}
                  setTimeframe={setTimeframe}
                />
              </TabsContent>

              <TabsContent value="customers" className="space-y-6">
                <CustomersSection customerData={customerData || []} colors={COLORS} />
              </TabsContent>

              <TabsContent value="geography" className="space-y-6">
                <GeographicDistribution geoData={geoData || []} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
