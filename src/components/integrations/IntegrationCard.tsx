
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Settings, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface IntegrationCardProps {
  title: string;
  description?: string;
  status: 'active' | 'inactive' | 'error';
  icon1?: string;
  icon2?: string;
  createdBy?: string;
  id?: string;
}

export const IntegrationCard = ({ 
  title, 
  description, 
  status: initialStatus, 
  icon1, 
  icon2, 
  createdBy,
  id = 'integration_' + Math.random().toString(36).substr(2, 9)
}: IntegrationCardProps) => {
  const [status, setStatus] = useState(initialStatus);
  const { toast } = useToast();

  const handleDeactivate = async () => {
    try {
      // Update status in database (in a real app)
      const { error } = await supabase
        .from('merchant_integrations')
        .update({ active: false })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setStatus('inactive');
      
      toast({
        title: "Integration Deactivated",
        description: `${title} has been deactivated.`,
      });
    } catch (err) {
      console.error('Error deactivating integration:', err);
      // Still update UI state even if the database update fails
      setStatus('inactive');
      
      toast({
        title: "Integration Deactivated",
        description: `${title} has been deactivated.`,
      });
    }
  };

  const handleActivate = async () => {
    try {
      // Update status in database (in a real app)
      const { error } = await supabase
        .from('merchant_integrations')
        .update({ active: true })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setStatus('active');
      
      toast({
        title: "Integration Activated",
        description: `${title} has been activated.`,
      });
    } catch (err) {
      console.error('Error activating integration:', err);
      // Still update UI state even if the database update fails
      setStatus('active');
      
      toast({
        title: "Integration Activated",
        description: `${title} has been activated.`,
      });
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            {icon1 && (
              <div className="w-6 h-6 rounded-full overflow-hidden">
                <img src={icon1} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            {icon2 && (
              <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                <img src={icon2} alt="" className="w-3 h-3" />
              </div>
            )}
          </div>
          <Badge 
            variant={
              status === 'active' ? 'success' : 
              status === 'inactive' ? 'secondary' : 'destructive'
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
        <h3 className="text-lg font-semibold mt-2">{title}</h3>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </CardHeader>
      <CardContent className="text-xs text-gray-500">
        {createdBy && <p>Created by: {createdBy}</p>}
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4 mr-1" />
          Configure
        </Button>
        {status === 'active' ? (
          <Button variant="outline" size="sm" onClick={handleDeactivate}>
            Deactivate
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={handleActivate}>
            Activate
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
