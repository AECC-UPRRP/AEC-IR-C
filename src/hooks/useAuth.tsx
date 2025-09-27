import { useState, useCallback } from 'react';
import { useToast } from './use-toast';

interface User {
  username: string;
  isAuthenticated: boolean;
  token: string;
}

const API_URL = 'http://localhost:3001/api';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Real backend authentication
  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Successful login
      const authenticatedUser = {
        username: data.user.username,
        isAuthenticated: true,
        token: data.token
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