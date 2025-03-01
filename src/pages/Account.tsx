
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const Account = () => {
  const { session } = useAuth();
  const user = session?.user;
  
  const [firstName, lastName] = user?.email?.split('@')[0].split('.').map(name => 
    name.charAt(0).toUpperCase() + name.slice(1)
  ) || ['', ''];
  
  const [name, setName] = useState(`${firstName} ${lastName}`);
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Account Settings</h1>
          <p className="text-gray-500">Manage your account information</p>
        </div>
        
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
            
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Password</h2>
          
          <div className="space-y-4">
            <p className="text-gray-500">Update your password to secure your account</p>
            
            <div className="flex justify-end">
              <Button variant="outline">Change Password</Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Account;
