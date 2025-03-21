
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnalyticsHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const AnalyticsHeader = ({ activeTab, setActiveTab }: AnalyticsHeaderProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Advanced metrics and subscription analytics</p>
      </div>
      
      <TabsList className="grid w-full max-w-md grid-cols-3">
        <TabsTrigger value="metrics" onClick={() => setActiveTab('metrics')}>Key Metrics</TabsTrigger>
        <TabsTrigger value="customers" onClick={() => setActiveTab('customers')}>Customers</TabsTrigger>
        <TabsTrigger value="geography" onClick={() => setActiveTab('geography')}>Geography</TabsTrigger>
      </TabsList>
    </div>
  );
};
