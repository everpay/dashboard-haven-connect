
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Package, 
  CreditCard, 
  AlertOctagon, 
  RefreshCcw, 
  ArrowLeftRight, 
  FileText, 
  CheckCircle, 
  Clock
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Activity {
  id: string;
  type: 'transaction' | 'customer' | 'invoice' | 'product' | 'chargeback' | 'refund' | 'transfer' | 'payment';
  title: string;
  description: string;
  timestamp: string;
  amount?: number;
  status?: string;
  user?: {
    name: string;
    avatar?: string;
    initials: string;
  };
  paymentMethod?: string;
}

// Generate sample activity data
const generateSampleActivities = (): Activity[] => {
  return [
    {
      id: '1',
      type: 'transaction',
      title: 'New transaction',
      description: 'Payment received from John Doe',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
      amount: 253.85,
      status: 'completed',
      paymentMethod: 'Credit Card',
      user: {
        name: 'John Doe',
        initials: 'JD'
      }
    },
    {
      id: '2',
      type: 'customer',
      title: 'New customer',
      description: 'Sarah Wilson created an account',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
      user: {
        name: 'Sarah Wilson',
        initials: 'SW'
      }
    },
    {
      id: '3',
      type: 'invoice',
      title: 'Invoice paid',
      description: 'Invoice #INV-2023-0042 was paid',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
      amount: 1250.00,
      status: 'paid',
      paymentMethod: 'Bank Transfer',
      user: {
        name: 'Tech Solutions Inc.',
        initials: 'TS'
      }
    },
    {
      id: '4',
      type: 'transfer',
      title: 'Funds transfer',
      description: 'Transfer to external account',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      amount: 500.00,
      status: 'completed'
    },
    {
      id: '5',
      type: 'chargeback',
      title: 'Chargeback received',
      description: 'Chargeback for transaction #TXN-8876',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
      amount: 89.99,
      status: 'pending',
      user: {
        name: 'Alex Brown',
        initials: 'AB'
      }
    },
    {
      id: '6',
      type: 'product',
      title: 'Product added',
      description: 'New product "Premium Plan" added',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
    {
      id: '7',
      type: 'refund',
      title: 'Refund processed',
      description: 'Refund issued to customer',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // 26 hours ago
      amount: 125.50,
      status: 'completed',
      user: {
        name: 'Maria Garcia',
        initials: 'MG'
      }
    },
    {
      id: '8',
      type: 'payment',
      title: 'Recurring payment',
      description: 'Monthly subscription charge',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
      amount: 29.99,
      status: 'completed',
      paymentMethod: 'Credit Card',
      user: {
        name: 'David Lee',
        initials: 'DL'
      }
    }
  ];
};

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'transaction':
      return <CreditCard className="h-4 w-4" />;
    case 'customer':
      return <User className="h-4 w-4" />;
    case 'invoice':
      return <FileText className="h-4 w-4" />;
    case 'product':
      return <Package className="h-4 w-4" />;
    case 'chargeback':
      return <AlertOctagon className="h-4 w-4" />;
    case 'refund':
      return <RefreshCcw className="h-4 w-4" />;
    case 'transfer':
      return <ArrowLeftRight className="h-4 w-4" />;
    case 'payment':
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getActivityColor = (type: Activity['type']) => {
  switch (type) {
    case 'transaction':
      return 'bg-blue-500';
    case 'customer':
      return 'bg-purple-500';
    case 'invoice':
      return 'bg-green-500';
    case 'product':
      return 'bg-indigo-500';
    case 'chargeback':
      return 'bg-red-500';
    case 'refund':
      return 'bg-orange-500';
    case 'transfer':
      return 'bg-teal-500';
    case 'payment':
      return 'bg-emerald-500';
    default:
      return 'bg-gray-500';
  }
};

const formatTimeAgo = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds} seconds ago`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  
  const days = Math.floor(hours / 24);
  return `${days} ${days === 1 ? 'day' : 'days'} ago`;
};

export const RecentActivityTimeline = () => {
  const navigate = useNavigate();
  const activities = generateSampleActivities();
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm">Recent Activity</CardTitle>
          <CardDescription className="text-xs">Your latest activity across all services</CardDescription>
        </div>
        <Button 
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => navigate('/transactions')}
        >
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-3">
              {/* Left Timeline */}
              <div className="flex flex-col items-center">
                <div className={`p-1.5 rounded-full ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                {activities.indexOf(activity) !== activities.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-200 my-1"></div>
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-medium">{activity.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.description}</p>
                    
                    {/* User Info */}
                    {activity.user && (
                      <div className="mt-2 flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          {activity.user.avatar ? (
                            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                          ) : (
                            <AvatarFallback className="text-xs">{activity.user.initials}</AvatarFallback>
                          )}
                        </Avatar>
                        <span className="text-xs font-medium">{activity.user.name}</span>
                        
                        {activity.paymentMethod && (
                          <span className="text-xs text-muted-foreground ml-2">
                            via {activity.paymentMethod}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Payment info without user */}
                    {!activity.user && activity.paymentMethod && (
                      <div className="mt-1">
                        <span className="text-xs text-muted-foreground">
                          via {activity.paymentMethod}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Right side info */}
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</span>
                    
                    {activity.amount !== undefined && (
                      <span className={`text-sm font-medium mt-1 ${activity.type === 'chargeback' || activity.type === 'refund' ? 'text-red-500' : 'text-green-500'}`}>
                        {activity.type === 'chargeback' || activity.type === 'refund' ? '-' : '+'} 
                        ${activity.amount.toFixed(2)}
                      </span>
                    )}
                    
                    {activity.status && (
                      <span className={`text-xs mt-1 px-1.5 py-0.5 rounded-full ${
                        activity.status === 'completed' || activity.status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : activity.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {activity.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
