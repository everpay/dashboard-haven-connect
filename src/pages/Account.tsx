
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useRBAC } from '@/lib/rbac';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { CreditCard, Shield, User } from 'lucide-react';

interface Subscription {
  id: string;
  status: string;
  plan: string;
  current_period_end: string;
}

const Account = () => {
  const { session } = useAuth();
  const { userRole } = useRBAC();
  const user = session?.user;
  
  const [firstName, lastName] = user?.email?.split('@')[0].split('.').map(name => 
    name.charAt(0).toUpperCase() + name.slice(1)
  ) || ['', ''];
  
  const [name, setName] = useState(`${firstName} ${lastName}`);
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Subscription state
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    setLoadingSubscription(true);
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoadingSubscription(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: { full_name: name }
      });
      
      if (error) throw error;
      
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    
    setPasswordLoading(true);
    
    try {
      // First, verify the current password by signing in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword,
      });
      
      if (signInError) {
        throw new Error('Current password is incorrect');
      }
      
      // Update the password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      // Reset form fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      toast.success('Password updated successfully');
    } catch (error: any) {
      setPasswordError(error.message || 'Error updating password');
      toast.error(error.message || 'Error updating password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Account Settings</h1>
          <p className="text-gray-500">Manage your account information and preferences</p>
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="profile" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="subscription" className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              Subscription
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full"
                      placeholder="john@example.com"
                      disabled
                    />
                    <p className="text-xs text-gray-500">Email cannot be changed</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Account Type</label>
                  <div className="flex items-center gap-2">
                    <Badge variant={userRole === 'owner' ? 'success' : 'outline'}>
                      {userRole === 'owner' ? 'Owner' : 'Member'}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {userRole === 'owner' 
                        ? 'You have full access to all features' 
                        : 'You have limited access to features'}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={loading} className="bg-[#013c3f]">
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscription">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Subscription Details</h2>
              
              {loadingSubscription ? (
                <div className="py-8 flex justify-center">
                  <svg className="animate-spin h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : subscription && subscription.status === 'active' ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-lg">{subscription.plan}</h3>
                      <Badge variant="success" className="mt-1">
                        Active
                      </Badge>
                      <p className="mt-2 text-sm text-gray-500">
                        Your subscription will renew on {new Date(subscription.current_period_end).toLocaleDateString()}
                      </p>
                    </div>
                    <Button asChild>
                      <Link to="/billing">
                        Manage Subscription
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Plan Features</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="h-5 w-5 flex-shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Unlimited transactions</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="h-5 w-5 flex-shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Advanced analytics</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="h-5 w-5 flex-shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Priority support</span>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-500">
                    You are currently on the <strong>Free Plan</strong>. Upgrade to access more features.
                  </p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Free Plan Limits</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="h-5 w-5 flex-shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Up to 100 transactions per month</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="h-5 w-5 flex-shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Basic analytics</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="h-5 w-5 flex-shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Email support</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="pt-4">
                    <Button asChild className="bg-[#013c3f]">
                      <Link to="/pricing">
                        View Pricing Plans
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Password</h2>
              
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="currentPassword" className="text-sm font-medium">Current Password</label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full"
                      placeholder="Enter your current password"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="newPassword" className="text-sm font-medium">New Password</label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full"
                      placeholder="Enter your new password"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full"
                      placeholder="Confirm your new password"
                      required
                    />
                  </div>
                  
                  {passwordError && (
                    <p className="text-sm text-red-500">{passwordError}</p>
                  )}
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      variant="outline"
                      disabled={passwordLoading}
                    >
                      {passwordLoading ? 'Updating...' : 'Change Password'}
                    </Button>
                  </div>
                </div>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Account;
