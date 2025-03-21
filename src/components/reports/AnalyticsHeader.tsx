
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnalyticsHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const AnalyticsHeader = ({ activeTab, setActiveTab }: AnalyticsHeaderProps) => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Analytics</h1>
      <p className="text-muted-foreground">Advanced metrics and subscription analytics</p>
    </div>
  );
};
