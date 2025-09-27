import { useState, useRef, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: Date;
  type: 'message' | 'join' | 'leave' | 'system';
  color?: string;
}

interface ChatTerminalProps {
  username: string;
  onLogout: () => void;
}

const TERMINAL_COLORS = [
  'terminal-green',
  'terminal-cyan', 
  'terminal-pink',
  'terminal-red',
];

export const ChatTerminal = ({ username, onLogout }: ChatTerminalProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      user: 'SYSTEM',
      text: 'Welcome to this small corner of the internet!',
      timestamp: new Date(),
      type: 'system'
    },
    {
      id: '2', 
      user: 'SYSTEM',
      text: 'This chat server was created to power small hacker friendly communities. Be cool and respectful to each other.',
      timestamp: new Date(),
      type: 'system'
    },
    {
      id: '3',
      user: 'SYSTEM', 
      text: `Made with <3 by @kolobara • Powered by: http://lunatic.solutions`,
      timestamp: new Date(),
      type: 'system'
    },
    {
      id: '4',
      user: 'SYSTEM',
      text: `Users online: 1`,
      timestamp: new Date(),
      type: 'system'
    },
    {
      id: '5',
      user: 'SYSTEM',
      text: `Your starting name is ${username}.`,
      timestamp: new Date(),
      type: 'system'
    }
  ]);
  
  const [input, setInput] = useState('');
  const [onlineUsers] = useState([username]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const getUserColor = (user: string) => {
    const hash = user.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return TERMINAL_COLORS[hash % TERMINAL_COLORS.length];
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Handle commands
    if (input.startsWith('/')) {
      handleCommand(input);
    } else {
      const newMessage: Message = {
        id: Date.now().toString(),
        user: username,
        text: input,
        timestamp: new Date(),
        type: 'message',
        color: getUserColor(username)
      };
      
      setMessages(prev => [...prev, newMessage]);
    }
    
    setInput('');
  };

  const handleCommand = (command: string) => {
    const [cmd, ...args] = command.slice(1).split(' ');
    
    switch (cmd.toLowerCase()) {
      case 'help':
        addSystemMessage('Available commands: /help, /users, /clear, /quit');
        break;
      case 'users':
        addSystemMessage(`Online users: ${onlineUsers.join(', ')}`);
        break;
      case 'clear':
        setMessages([]);
        break;
      case 'quit':
        onLogout();
        break;
      default:
        addSystemMessage(`Unknown command: /${cmd}. Type /help for available commands.`);
    }
  };

  const addSystemMessage = (text: string) => {
    const systemMessage: Message = {
      id: Date.now().toString(),
      user: 'SYSTEM',
      text,
      timestamp: new Date(),
      type: 'system'
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: false });
  };

  const renderMessage = (message: Message) => {
    const timeStr = formatTime(message.timestamp);
    
    if (message.type === 'system') {
      return (
        <div key={message.id} className="text-terminal-green terminal-text">
          [{timeStr}] *** {message.text}
        </div>
      );
    }

    const colorClass = message.color || 'terminal-green';
    
    return (
      <div key={message.id} className="terminal-text">
        <span className="text-muted-foreground">[{timeStr}]</span>{' '}
        <span className={`text-${colorClass}`}>&lt;{message.user}&gt;</span>{' '}
        <span className="text-foreground">{message.text}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-background crt-screen">
      {/* Header */}
      <div className="border-b border-primary/30 p-4">
        <div className="flex justify-between items-center terminal-text">
          <div className="text-terminal-cyan">
            Terminal 1: telnet (82x29) • #general • {onlineUsers.length} users
          </div>
          <div className="flex gap-4 text-sm">
            <span className="text-terminal-green">Welcome</span>
            <span className="text-terminal-pink">Channels</span>
            <span className="text-terminal-cyan">#irc</span>
            <span className="text-terminal-red">#team</span>
            <Button
              onClick={onLogout}
              size="sm"
              variant="outline"
              className="text-xs border-terminal-red/50 text-terminal-red hover:bg-terminal-red hover:text-background"
            >
              /quit
            </Button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex">
        {/* ASCII Art Sidebar */}
        <div className="w-64 border-r border-primary/30 p-4 text-terminal-green terminal-text text-sm">
          <div className="mb-4">
            <div>╔═══════════════════╗</div>
            <div>║ ░░░░░░░░░░░░░░░░░ ║</div>
            <div>║ ░░░███░░██░░░░░░░ ║</div>
            <div>║ ░░░█░█░░░█░░░░░░░ ║</div>
            <div>║ ░░░█░█░░░█░░░░░░░ ║</div>
            <div>║ ░░░███░░██░░░░░░░ ║</div>
            <div>║ ░░░░░░░░░░░░░░░░░ ║</div>
            <div>╠═══════════════════╣</div>
            <div>║ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ║</div>
            <div>║ ─── Hack ───── ║</div>
            <div>║ ─── the ────── ║</div>
            <div>║ ─── Planet! ── ║</div>
            <div>║ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ║</div>
            <div>╚═══════════════════╝</div>
          </div>
          
          <div>
            <div className="text-terminal-cyan">INSTRUCTIONS:</div>
            <div className="mt-2 text-xs">
              You will be navigating this interface using commands. Commands are
              prefixed by a / character. Type /help for more information.
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-1">
              {messages.map(renderMessage)}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-primary/30 p-4">
            <div className="flex items-center gap-2 terminal-text">
              <span className="text-terminal-green shrink-0">{'>'}</span>
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
                className="bg-transparent border-none text-foreground terminal-text focus:ring-0 focus:outline-none"
                placeholder="Type a message or /help for commands..."
              />
              <span className="cursor text-terminal-green">█</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};