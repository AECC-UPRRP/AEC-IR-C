import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
  isLoading: boolean;
  error: string | null;
}

export const LoginForm = ({ onLogin, isLoading, error }: LoginFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      onLogin(username, password);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md p-8 crt-screen border border-primary/30">
        <div className="terminal-text text-center mb-8">
          <h1 className="text-2xl font-bold text-terminal-green mb-2">
            ◆◇◆ RETRO-TUBE IRC ◆◇◆
          </h1>
          <div className="text-terminal-cyan text-sm">
            ╔══════════════════════════════════╗<br/>
            ║     AUTHENTICATION REQUIRED     ║<br/>
            ╚══════════════════════════════════╝
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-terminal-green mb-2">
              {'>'} USER_ID:
            </label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-background border-terminal-cyan/50 text-terminal-green focus:border-terminal-cyan terminal-text"
              placeholder="enter_username"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-terminal-green mb-2">
              {'>'} PASSWORD:
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background border-terminal-cyan/50 text-terminal-green focus:border-terminal-cyan terminal-text"
              placeholder="enter_password"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="text-terminal-red text-sm terminal-text">
              ERROR: {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !username || !password}
            className="w-full bg-terminal-cyan/20 border border-terminal-cyan text-terminal-cyan hover:bg-terminal-cyan hover:text-background terminal-text"
          >
            {isLoading ? 'CONNECTING...' : '>>> LOGIN <<<'}
          </Button>
        </form>

        <div className="mt-6 text-xs text-terminal-pink terminal-text text-center">
          <div>SYSTEM ONLINE • SECURE CONNECTION</div>
          <div className="cursor">█</div>
        </div>
      </Card>
    </div>
  );
};