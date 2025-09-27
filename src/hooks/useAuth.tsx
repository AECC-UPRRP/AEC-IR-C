import { useState, useCallback } from 'react';
import { useToast } from './use-toast';

interface User {
  username: string;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Simulate credential verification
  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simple credential validation (in real app, this would be backend verification)
      if (password.length < 3) {
        throw new Error('Password must be at least 3 characters');
      }

      if (username.toLowerCase().includes('admin') && password !== 'secure123') {
        throw new Error('Invalid admin credentials');
      }

      // Successful login
      const authenticatedUser = {
        username: username || `User_${Math.floor(Math.random() * 1000)}`,
        isAuthenticated: true
      };

      setUser(authenticatedUser);
      
      toast({
        title: "Connection established",
        description: `Welcome to IRC, ${authenticatedUser.username}!`,
        className: "border-terminal-green/50 bg-card text-terminal-green"
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
      
      toast({
        title: "Authentication failed",
        description: errorMessage,
        variant: "destructive",
        className: "border-terminal-red/50 bg-card text-terminal-red"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
    
    toast({
      title: "Disconnected",
      description: "You have been logged out of IRC",
      className: "border-terminal-cyan/50 bg-card text-terminal-cyan"
    });
  }, [toast]);

  return {
    user,
    isAuthenticated: !!user?.isAuthenticated,
    login,
    logout,
    isLoading,
    error
  };
};