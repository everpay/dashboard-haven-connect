
import React from 'react';
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MetricChartProps {
  title: string;
  data: any[];
  dataKey: string;
  color: string;
  tooltipFormatter?: (value: number) => [string, string];
}

export const MetricChart = ({ title, data, dataKey, color, tooltipFormatter }: MetricChartProps) => {
  return (
    <Card className="p-6">
      <h3 className="font-medium text-lg mb-4">{title}</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={tooltipFormatter} />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              activeDot={{ r: 8 }} 
              name={title}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
