import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from "sonner";
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      // Error is already handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="w-12 h-12 rounded-full bg-brand-600 flex items-center justify-center mx-auto">
              <span className="text-white font-semibold text-xl">VI</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold">Voice Interview</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">AI-powered Interview Platform</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Please enter a valid email'
                    }
                  })}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-brand-600 hover:text-brand-500">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register('password', { required: 'Password is required' })}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Log in'
                )}
              </Button>
              
              <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link to="/signup" className="text-brand-600 hover:text-brand-500 font-medium">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
        
        {/* Demo account info for testing */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            <span className="font-bold">Demo:</span> Create an account to get started
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
