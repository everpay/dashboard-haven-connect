
import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { logIpEvent } from "@/utils/logIpEvent";

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
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Advanced metrics and subscription analytics</p>
        </div>

        <div className="flex items-center justify-between">
          <Tabs defaultValue="metrics" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="geography">Geography</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="metrics" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-medium">Subscription Metrics</h2>
                  <Select 
                    value={timeframe} 
                    onValueChange={setTimeframe}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30days">Last 30 Days</SelectItem>
                      <SelectItem value="3months">Last 3 Months</SelectItem>
                      <SelectItem value="6months">Last 6 Months</SelectItem>
                      <SelectItem value="12months">Last 12 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Card className="p-6">
                  <h3 className="font-medium text-lg mb-4">Monthly Recurring Revenue (MRR)</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mrrData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, 'MRR']} />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#1AA47B" 
                          activeDot={{ r: 8 }} 
                          name="MRR"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-medium text-lg mb-4">Churn Rate (%)</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={churnData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value}%`, 'Churn Rate']} />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#e11d48" 
                          activeDot={{ r: 8 }} 
                          name="Churn Rate"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="customers" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-medium">Customer Segments</h2>
                  <Input
                    type="search"
                    placeholder="Search customers..."
                    className="max-w-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="font-medium text-lg mb-4">Customer Distribution</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={customerData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {customerData?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [value, 'Customers']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="font-medium text-lg mb-4">Customers Summary</h3>
                    <div className="space-y-4">
                      {customerData?.map((segment) => (
                        <div key={segment.name} className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2" 
                              style={{ backgroundColor: COLORS[customerData.indexOf(segment) % COLORS.length] }}
                            ></div>
                            <span>{segment.name} Customers</span>
                          </div>
                          <span className="font-bold">{segment.value}</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center font-bold">
                          <span>Total Customers</span>
                          <span>{customerData?.reduce((sum, item) => sum + item.value, 0)}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="geography" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-medium">Geographic Distribution</h2>
                  <Button variant="outline">Export Data</Button>
                </div>

                <Card className="p-6">
                  <h3 className="font-medium text-lg mb-4">Customers by Country</h3>
                  <div className="space-y-4">
                    {geoData?.map((country) => (
                      <div key={country.country} className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-[#1AA47B] h-2.5 rounded-full" 
                            style={{ width: `${(country.count / Math.max(...geoData.map(c => c.count))) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between w-full ml-3">
                          <span>{country.country}</span>
                          <span className="font-medium">{country.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
