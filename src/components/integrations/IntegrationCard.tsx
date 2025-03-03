
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface IntegrationCardProps {
  title: string;
  description: string;
  status: 'active' | 'inactive';
  icon1: string;
  icon2: string;
  createdBy: string;
}

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
  title,
  description,
  status,
  icon1,
  icon2,
  createdBy,
}) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded bg-[#E3FFCC] flex items-center justify-center">
                <img src={icon1} alt="Icon 1" className="w-6 h-6" />
              </div>
              <ArrowRight className="mx-2 h-4 w-4 text-gray-400" />
              <div className="w-10 h-10 rounded bg-[#E3FFCC] flex items-center justify-center">
                <img src={icon2} alt="Icon 2" className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant={status === 'active' ? 'success' : 'warning'}>
              {status === 'active' ? 'Active' : 'Inactive'}
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Deactivate</DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Created by {createdBy}</span>
          <Button variant="ghost" size="sm" className="text-xs">
            Configure <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
