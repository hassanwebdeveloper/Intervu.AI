import React, { useState } from 'react';
import { toast } from "sonner";
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Lock, Mail, User, Building, Save } from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  
  // Profile form state
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: user?.company || '',
  });
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    interviewCompleted: true,
    candidateReminders: true,
    weeklyReports: false,
  });
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // In a real app, this would update the user profile in DynamoDB
      // For this prototype, we'll just simulate a successful update
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleApiKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey) {
      toast.error('Please enter an API key');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // In a real app, this would store the API key securely
      // For this prototype, we'll just simulate a successful update
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('API key saved successfully');
    } catch (error) {
      console.error('Failed to save API key:', error);
      toast.error('Failed to save API key');
    } finally {
      setIsLoading(false);
      setApiKey(''); // Clear the input for security
    }
  };
  
  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key]
    });
    
    toast.success('Notification settings updated');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <form onSubmit={handleProfileSubmit}>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-muted-foreground mr-2" />
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      placeholder="john.doe@example.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company (Optional)</Label>
                  <div className="flex items-center">
                    <Building className="h-4 w-4 text-muted-foreground mr-2" />
                    <Input
                      id="company"
                      value={profile.company || ''}
                      onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                      placeholder="Acme Inc."
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="api-keys">
          <Card>
            <form onSubmit={handleApiKeySubmit}>
              <CardHeader>
                <CardTitle>ElevenLabs API Key</CardTitle>
                <CardDescription>
                  Add your ElevenLabs API key to enable voice interviews
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Your API key is required to use the ElevenLabs conversation API for interviews. You can get your API key from the <a href="https://elevenlabs.io/app" target="_blank" rel="noopener noreferrer" className="font-medium underline">ElevenLabs dashboard</a>.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="apiKey">ElevenLabs API Key</Label>
                  <div className="flex items-center">
                    <Lock className="h-4 w-4 text-muted-foreground mr-2" />
                    <Input
                      id="apiKey"
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your API key"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save API Key'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailNotifications" className="flex-1">
                    <span className="font-medium">Email Notifications</span>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </Label>
                  <Switch
                    id="emailNotifications"
                    checked={notifications.emailNotifications}
                    onCheckedChange={() => handleNotificationChange('emailNotifications')}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Interview Notifications</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="interviewCompleted" className="flex-1">
                      <span>Interview Completed</span>
                      <p className="text-sm text-muted-foreground">
                        Notify when an interview is finished
                      </p>
                    </Label>
                    <Switch
                      id="interviewCompleted"
                      checked={notifications.interviewCompleted}
                      onCheckedChange={() => handleNotificationChange('interviewCompleted')}
                      disabled={!notifications.emailNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="candidateReminders" className="flex-1">
                      <span>Candidate Reminders</span>
                      <p className="text-sm text-muted-foreground">
                        Send reminders to candidates about upcoming interviews
                      </p>
                    </Label>
                    <Switch
                      id="candidateReminders"
                      checked={notifications.candidateReminders}
                      onCheckedChange={() => handleNotificationChange('candidateReminders')}
                      disabled={!notifications.emailNotifications}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Summary & Reports</h3>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="weeklyReports" className="flex-1">
                    <span>Weekly Reports</span>
                    <p className="text-sm text-muted-foreground">
                      Receive a weekly summary of your interviews
                    </p>
                  </Label>
                  <Switch
                    id="weeklyReports"
                    checked={notifications.weeklyReports}
                    onCheckedChange={() => handleNotificationChange('weeklyReports')}
                    disabled={!notifications.emailNotifications}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
