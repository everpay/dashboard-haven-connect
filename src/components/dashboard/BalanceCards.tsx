
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
  chargebacksCount?: number;
}

export const BalanceCards = ({ balanceData, todayTransactions, chargebacksCount = 2 }: BalanceCardsProps) => {
  return (
    <>
      {/* Transaction Stats - Styled like the Transaction page */}
      <div className="grid grid-cols-6 gap-2 mb-6">
        <Card className="p-3 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-900">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Today's Transactions</p>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100 text-balance break-words">
              <CountUp 
                end={todayTransactions.count} 
                separator="," 
                duration={1.5}
                preserveValue
                className="text-xl md:text-xl sm:text-lg xs:text-base"
              />
            </p>
          </div>
        </Card>
        
        <Card className="p-3 border-slate-700 bg-slate-100 dark:bg-slate-950 dark:border-slate-900">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Today's Balance</p>
            <p className="text-xl font-bold text-slate-700 dark:text-slate-400 text-balance break-words">
              $<CountUp 
                end={todayTransactions.amount} 
                separator="," 
                decimals={2}
                duration={1.5}
                preserveValue
                className="text-xl md:text-xl sm:text-lg xs:text-base"
              />
            </p>
          </div>
        </Card>
        
        <Card className="p-3 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-900">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Approved</p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400 text-balance break-words">3</p>
          </div>
        </Card>
        
        <Card className="p-3 border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-900">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Declined</p>
            <p className="text-xl font-bold text-orange-600 dark:text-orange-400 text-balance break-words">1</p>
          </div>
        </Card>
        
        <Card className="p-3 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-900">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Chargebacks</p>
            <p className="text-xl font-bold text-red-600 dark:text-red-400 text-balance break-words">{chargebacksCount}</p>
          </div>
        </Card>
        
        {/* Available Balance with popup for other balance info - now in last position */}
        <Popover>
          <PopoverTrigger asChild>
            <Card className="p-3 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-900 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900 transition-colors">
              <div className="text-center relative">
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center">
                  Available Balance
                  <InfoIcon className="ml-1 h-3 w-3" />
                </p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400 text-balance break-words">
                  $<CountUp 
                    end={balanceData.available} 
                    separator="," 
                    decimals={2}
                    duration={1.5}
                    preserveValue
                    className="text-xl md:text-xl sm:text-lg xs:text-base"
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
      </div>
    </>
  );
};
