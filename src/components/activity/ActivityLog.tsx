
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { RefreshCcw } from 'lucide-react';

interface ActivityItem {
  id: string;
  user_id: string;
  event: string;
  details: any;
  created_at: string;
  ip_address: string;
}

interface ActivityLogProps {
  limit?: number;
  title?: string;
  className?: string;
}

const getEventIcon = (event: string) => {
  if (event.includes('subscription')) {
    return '💳';
  } else if (event.includes('login') || event.includes('logout')) {
    return '🔐';
  } else if (event.includes('update')) {
    return '✏️';
  } else if (event.includes('invite')) {
    return '📧';
  } else if (event.includes('role')) {
    return '👥';
  } else {
    return '📝';
  }
};

const getEventColor = (event: string) => {
  if (event.includes('error') || event.includes('failed')) {
    return 'destructive';
  } else if (event.includes('subscription') || event.includes('payment')) {
    return 'success';
  } else {
    return 'default';
  }
};

const formatEventName = (event: string) => {
  return event
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const ActivityLog: React.FC<ActivityLogProps> = ({ 
  limit = 5,
  title = "Recent Activity",
  className = ""
}) => {
  const { session } = useAuth();
  const userId = session?.user.id;
  
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchActivities = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (userId) {
      fetchActivities();
    }
  }, [userId]);

  return (
    <Card className={`p-5 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button 
          onClick={fetchActivities}
          className="text-gray-500 hover:text-gray-800 transition-colors"
          disabled={loading}
        >
          <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <RefreshCcw className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          No recent activity
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div 
              key={activity.id} 
              className="flex items-start gap-3 pb-3 border-b border-gray-100"
            >
              <div className="text-xl">
                {getEventIcon(activity.event)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge variant={getEventColor(activity.event)}>
                      {formatEventName(activity.event)}
                    </Badge>
                    <div className="mt-1 text-sm">
                      {activity.details && typeof activity.details === 'object' ? (
                        <ul className="text-gray-500 space-y-1">
                          {Object.entries(activity.details).map(([key, value]) => (
                            <li key={key} className="truncate">
                              <span className="font-medium">{key.replace(/_/g, ' ')}:</span>{' '}
                              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">{activity.details || 'No details provided'}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(activity.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default ActivityLog;
