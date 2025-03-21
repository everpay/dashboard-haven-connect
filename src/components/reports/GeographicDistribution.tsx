
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GeographicDistributionProps {
  geoData: any[];
}

export const GeographicDistribution = ({ geoData }: GeographicDistributionProps) => {
  return (
    <>
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
    </>
  );
};
