import { useState, useRef, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { wsService, Message } from '@/services/websocket';
import { useToast } from '@/hooks/use-toast';

interface ChatTerminalProps {
  username: string;
  token: string;
  onLogout: () => void;
}

const TERMINAL_COLORS = [
  'terminal-green',
  'terminal-cyan', 
  'terminal-pink',
  'terminal-red',
];

export const ChatTerminal = ({ username, token, onLogout }: ChatTerminalProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [currentChannel, setCurrentChannel] = useState('general');
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Connect to WebSocket server
  useEffect(() => {
    const socket = wsService.connect();
    
    // Join channel after connection
    socket.on('connect', () => {
      setIsConnected(true);
      wsService.joinChannel(username, token, currentChannel);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Handle incoming messages
    wsService.onMessage((message) => {
      setMessages(prev => [...prev, {
        ...message,
        timestamp: new Date(message.timestamp),
        color: getUserColor(message.user)
      }]);
    });

    // Handle system messages
    wsService.onSystemMessage((message) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        user: 'SYSTEM',
        text: message.text,
        timestamp: new Date(message.timestamp),
        type: 'system'
      }]);
    });

    // Handle user join/leave
    wsService.onUserJoined((data) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        user: 'SYSTEM',
        text: `*** ${data.username} joined the channel`,
        timestamp: new Date(data.timestamp),
        type: 'join'
      }]);
    });

    wsService.onUserLeft((data) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        user: 'SYSTEM', 
        text: `*** ${data.username} left the channel`,
        timestamp: new Date(data.timestamp),
        type: 'leave'
      }]);
    });

    // Handle clear messages
    wsService.onClearMessages(() => {
      setMessages([]);
    });

    // Handle errors
    wsService.onError((error) => {
      toast({
        title: "Connection Error",
        description: error.message,
        variant: "destructive"
      });
    });

    // Cleanup on unmount
    return () => {
      wsService.disconnect();
    };
  }, [username, token, currentChannel, toast]);

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
      // Send message through WebSocket
      wsService.sendMessage(input, currentChannel);
    }
    
    setInput('');
  };

  const handleCommand = (command: string) => {
    const [cmd, ...args] = command.slice(1).split(' ');
    
    switch (cmd.toLowerCase()) {
      case 'quit':
        wsService.disconnect();
        onLogout();
        break;
      default:
        // Send command to server
        wsService.sendCommand(command);
    }
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
            Terminal 1: telnet (82x29) • #{currentChannel} • {isConnected ? 'ONLINE' : 'OFFLINE'}
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