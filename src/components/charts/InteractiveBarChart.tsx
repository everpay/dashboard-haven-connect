
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';

interface DataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

interface InteractiveBarChartProps {
  data: DataPoint[];
  title: string;
  description?: string;
  className?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  colorScheme?: string[];
  showLegend?: boolean;
  height?: number;
  barSize?: number;
}

export const InteractiveBarChart = ({
  data,
  title,
  description,
  className,
  valuePrefix = "",
  valueSuffix = "",
  colorScheme = ["#1AA47B", "#19363B"],
  showLegend = false,
  height = 300,
  barSize = 20
}: InteractiveBarChartProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleMouseEnter = (data: any, index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-2 border border-border rounded shadow-md">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-sm text-primary">
            {`${valuePrefix}${payload[0].value.toLocaleString()}${valueSuffix}`}
          </p>
          {payload[0].payload.secondaryValue && (
            <p className="text-xs text-muted-foreground">
              Count: {payload[0].payload.secondaryValue}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
        {description && <CardDescription className="text-xs">{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className={`h-[${height}px]`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              margin={{ top: 5, right: 5, left: 5, bottom: 20 }}
              barSize={barSize}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                angle={data.length > 8 ? -45 : 0}
                textAnchor={data.length > 8 ? "end" : "middle"}
                height={data.length > 8 ? 60 : 30}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
              <Bar 
                dataKey="value" 
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={index === activeIndex ? colorScheme[1] : colorScheme[0]}
                    cursor="pointer"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
