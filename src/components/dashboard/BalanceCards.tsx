
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CountUp from 'react-countup';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { InfoIcon } from "lucide-react";

interface BalanceCardsProps {
  balanceData: {
    available: number;
    reserved: number;
    net: number;
  };
  todayTransactions: {
    count: number;
    amount: number;
  };
}

export const BalanceCards = ({ balanceData, todayTransactions }: BalanceCardsProps) => {
  return (
    <>
      {/* Transaction Stats - Styled like the Transaction page */}
      <div className="grid grid-cols-6 gap-2 mb-6">
        <Card className="p-3 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-900">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Today's Transactions</p>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
              <CountUp 
                end={todayTransactions.count} 
                separator="," 
                duration={1.5}
                preserveValue
              />
            </p>
          </div>
        </Card>
        
        <Card className="p-3 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-900">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Today's Balance</p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              $<CountUp 
                end={todayTransactions.amount} 
                separator="," 
                decimals={2}
                duration={1.5}
                preserveValue
              />
            </p>
          </div>
        </Card>
        
        <Card className="p-3 border-purple-200 bg-purple-50 dark:bg-purple-950 dark:border-purple-900">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Succeeded</p>
            <p className="text-xl font-bold text-purple-600 dark:text-purple-400">3</p>
          </div>
        </Card>
        
        <Card className="p-3 border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-900">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Failed</p>
            <p className="text-xl font-bold text-orange-600 dark:text-orange-400">1</p>
          </div>
        </Card>
        
        {/* Available Balance with popup for other balance info */}
        <Popover>
          <PopoverTrigger asChild>
            <Card className="p-3 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-900 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900 transition-colors">
              <div className="text-center relative">
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center">
                  Available Balance
                  <InfoIcon className="ml-1 h-3 w-3" />
                </p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  $<CountUp 
                    end={balanceData.available} 
                    separator="," 
                    decimals={2}
                    duration={1.5}
                    preserveValue
                  />
                </p>
              </div>
            </Card>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
            <div className="grid grid-cols-1 gap-0">
              <div className="p-4 border-b">
                <h4 className="font-medium text-sm mb-1">Net Balance</h4>
                <p className="text-xl font-bold">
                  $<CountUp 
                    end={balanceData.net} 
                    separator="," 
                    decimals={2}
                    duration={1}
                    preserveValue
                  />
                </p>
              </div>
              <div className="p-4">
                <h4 className="font-medium text-sm mb-1">Reserve Balance</h4>
                <p className="text-xl font-bold">
                  $<CountUp 
                    end={balanceData.reserved} 
                    separator="," 
                    decimals={2}
                    duration={1}
                    preserveValue
                  />
                </p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <Card className="p-3 border-gray-200 bg-gray-50 dark:bg-gray-950 dark:border-gray-800">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Uncaptured</p>
            <p className="text-xl font-bold text-gray-600 dark:text-gray-400">0</p>
          </div>
        </Card>
      </div>
    </>
  );
};
