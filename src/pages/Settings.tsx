
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import PaymentSettings from '@/components/settings/PaymentSettings';
import { User, Bell, Shield, CreditCard, Mail, Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  
  const saveSettings = (section: string) => {
    toast({
      title: `${section} Settings Saved`,
      description: `Your ${section.toLowerCase()} settings have been updated successfully`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-500">Manage your account settings and preferences</p>
        </div>
        
        <Tabs defaultValue="payment" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-4xl">
            <TabsTrigger value="account">
              <User className="h-4 w-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger value="payment">
              <CreditCard className="h-4 w-4 mr-2" />
              Payment
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="api">
              <SettingsIcon className="h-4 w-4 mr-2" />
              API
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your personal account information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input id="company" placeholder="Acme Inc." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="+1 (555) 123-4567" />
                  </div>
                </div>
                
                <Button 
                  className="mt-4 bg-[#1AA47B] text-white hover:bg-[#19363B]"
                  onClick={() => saveSettings('Account')}
                >
                  Save Account Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payment">
            <PaymentSettings />
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Decide which notifications you'd like to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="payment-notifications">Payment Alerts</Label>
                    <p className="text-sm text-gray-500">
                      Get notified about new payments and payment status changes
                    </p>
                  </div>
                  <Switch id="payment-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-gray-500">
                      Receive updates about new features and promotions
                    </p>
                  </div>
                  <Switch id="marketing-emails" />
                </div>
                
                <Button 
                  className="mt-4 bg-[#1AA47B] text-white hover:bg-[#19363B]"
                  onClick={() => saveSettings('Notification')}
                >
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Protect your account with security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch id="two-factor" />
                </div>
                
                <Button 
                  className="mt-4 bg-[#1AA47B] text-white hover:bg-[#19363B]"
                  onClick={() => saveSettings('Security')}
                >
                  Save Security Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>API Settings</CardTitle>
                <CardDescription>
                  Manage your API keys and webhooks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="flex">
                    <Input id="api-key" value="sk_test_••••••••••••••••••••••••" readOnly className="rounded-r-none" />
                    <Button variant="outline" className="rounded-l-none">Copy</Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    This is your secret API key. Keep it confidential.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input id="webhook-url" placeholder="https://your-website.com/webhooks/everpay" />
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="webhook-active">Webhook Enabled</Label>
                    <p className="text-sm text-gray-500">
                      Receive real-time notifications via webhooks
                    </p>
                  </div>
                  <Switch id="webhook-active" />
                </div>
                
                <Button 
                  className="mt-4 bg-[#1AA47B] text-white hover:bg-[#19363B]"
                  onClick={() => saveSettings('API')}
                >
                  Save API Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
