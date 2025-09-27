import { verifyToken } from './auth.js';

export class ChatManager {
  constructor(io) {
    this.io = io;
    this.users = new Map(); // socketId -> user info
    this.channels = new Map([
      ['general', { name: 'general', users: new Set(), messages: [] }],
      ['irc', { name: 'irc', users: new Set(), messages: [] }],
      ['team', { name: 'team', users: new Set(), messages: [] }]
    ]);
  }

  handleConnection(socket) {
    // Handle user join
    socket.on('join', (data) => {
      const { username, token, channel = 'general' } = data;
      
      // Verify token
      const decoded = verifyToken(token);
      if (!decoded) {
        socket.emit('error', { message: 'Invalid authentication token' });
        return;
      }

      // Store user info
      this.users.set(socket.id, { 
        username, 
        channel,
        joinTime: new Date()
      });

      // Join channel
      socket.join(channel);
      const channelData = this.channels.get(channel);
      if (channelData) {
        channelData.users.add(username);
      }

      // Send welcome messages
      this.sendWelcomeMessages(socket, username, channel);
      
      // Notify others about user join
      socket.to(channel).emit('user_joined', { 
        username, 
        timestamp: new Date(),
        usersCount: channelData ? channelData.users.size : 1
      });

      // Send current users list
      this.sendUsersList(socket, channel);
    });

    // Handle messages
    socket.on('message', (data) => {
      const user = this.users.get(socket.id);
      if (!user) {
        socket.emit('error', { message: 'User not authenticated' });
        return;
      }

      const { text, channel = user.channel } = data;
      
      const message = {
        id: Date.now().toString(),
        user: user.username,
        text,
        timestamp: new Date(),
        type: 'message'
      };

      // Store message in channel
      const channelData = this.channels.get(channel);
      if (channelData) {
        channelData.messages.push(message);
        // Keep only last 100 messages
        if (channelData.messages.length > 100) {
          channelData.messages = channelData.messages.slice(-100);
        }
      }

      // Broadcast message to all users in channel
      this.io.to(channel).emit('message', message);
    });

    // Handle commands
    socket.on('command', (data) => {
      const user = this.users.get(socket.id);
      if (!user) return;

      this.handleCommand(socket, data.command, user);
    });

    // Handle channel switch
    socket.on('switch_channel', (data) => {
      const user = this.users.get(socket.id);
      if (!user) return;

      const { newChannel } = data;
      const oldChannel = user.channel;

      // Leave old channel
      socket.leave(oldChannel);
      const oldChannelData = this.channels.get(oldChannel);
      if (oldChannelData) {
        oldChannelData.users.delete(user.username);
      }

      // Join new channel
      socket.join(newChannel);
      user.channel = newChannel;
      const newChannelData = this.channels.get(newChannel);
      if (newChannelData) {
        newChannelData.users.add(user.username);
      }

      // Notify about channel switch
      socket.emit('system_message', {
        text: `Switched to #${newChannel}`,
        timestamp: new Date()
      });

      this.sendUsersList(socket, newChannel);
    });
  }

  handleDisconnection(socket) {
    const user = this.users.get(socket.id);
    if (user) {
      // Remove from channel
      const channelData = this.channels.get(user.channel);
      if (channelData) {
        channelData.users.delete(user.username);
      }

      // Notify others about user leave
      socket.to(user.channel).emit('user_left', { 
        username: user.username, 
        timestamp: new Date(),
        usersCount: channelData ? channelData.users.size : 0
      });

      // Remove user
      this.users.delete(socket.id);
    }
  }

  handleCommand(socket, command, user) {
    const [cmd, ...args] = command.slice(1).split(' ');
    
    switch (cmd.toLowerCase()) {
      case 'help':
        socket.emit('system_message', {
          text: 'Available commands: /help, /users, /channels, /join <channel>, /clear, /quit',
          timestamp: new Date()
        });
        break;
        
      case 'users':
        this.sendUsersList(socket, user.channel);
        break;
        
      case 'channels':
        const channelList = Array.from(this.channels.keys()).map(name => `#${name}`).join(', ');
        socket.emit('system_message', {
          text: `Available channels: ${channelList}`,
          timestamp: new Date()
        });
        break;
        
      case 'join':
        if (args.length > 0) {
          const newChannel = args[0].replace('#', '');
          if (this.channels.has(newChannel)) {
            socket.emit('switch_channel', { newChannel });
          } else {
            socket.emit('system_message', {
              text: `Channel #${newChannel} does not exist`,
              timestamp: new Date()
            });
          }
        }
        break;
        
      case 'clear':
        socket.emit('clear_messages');
        break;
        
      default:
        socket.emit('system_message', {
          text: `Unknown command: /${cmd}. Type /help for available commands.`,
          timestamp: new Date()
        });
    }
  }

  sendWelcomeMessages(socket, username, channel) {
    const welcomeMessages = [
      { text: 'Welcome to this small corner of the internet!', type: 'system' },
      { text: 'This chat server was created to power small hacker friendly communities. Be cool and respectful to each other.', type: 'system' },
      { text: 'Made with <3 by @kolobara • Powered by: http://lunatic.solutions', type: 'system' },
      { text: `Connected to #${channel}`, type: 'system' },
      { text: `Your username is ${username}.`, type: 'system' }
    ];

    welcomeMessages.forEach((msg, index) => {
      setTimeout(() => {
        socket.emit('system_message', {
          ...msg,
          timestamp: new Date()
        });
      }, index * 200);
    });
  }

  sendUsersList(socket, channel) {
    const channelData = this.channels.get(channel);
    const usersList = channelData ? Array.from(channelData.users) : [];
    
    socket.emit('system_message', {
      text: `Users online in #${channel}: ${usersList.length} (${usersList.join(', ')})`,
      timestamp: new Date()
    });
  }
}
