import { io, Socket } from 'socket.io-client';

export interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: Date;
  type: 'message' | 'join' | 'leave' | 'system';
  color?: string;
}

export interface SystemMessage {
  text: string;
  timestamp: Date;
  type: 'system';
}

export class WebSocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(serverUrl: string = 'http://localhost:3001') {
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io(serverUrl);
    
    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('Connected to IRC server');
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      console.log('Disconnected from IRC server');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinChannel(username: string, token: string, channel: string = 'general') {
    if (this.socket) {
      this.socket.emit('join', { username, token, channel });
    }
  }

  sendMessage(text: string, channel?: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('message', { text, channel });
    }
  }

  sendCommand(command: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('command', { command });
    }
  }

  switchChannel(newChannel: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('switch_channel', { newChannel });
    }
  }

  onMessage(callback: (message: Message) => void) {
    if (this.socket) {
      this.socket.on('message', callback);
    }
  }

  onSystemMessage(callback: (message: SystemMessage) => void) {
    if (this.socket) {
      this.socket.on('system_message', callback);
    }
  }

  onUserJoined(callback: (data: { username: string; timestamp: Date; usersCount: number }) => void) {
    if (this.socket) {
      this.socket.on('user_joined', callback);
    }
  }

  onUserLeft(callback: (data: { username: string; timestamp: Date; usersCount: number }) => void) {
    if (this.socket) {
      this.socket.on('user_left', callback);
    }
  }

  onClearMessages(callback: () => void) {
    if (this.socket) {
      this.socket.on('clear_messages', callback);
    }
  }

  onError(callback: (error: { message: string }) => void) {
    if (this.socket) {
      this.socket.on('error', callback);
    }
  }

  getSocket() {
    return this.socket;
  }

  isSocketConnected() {
    return this.isConnected;
  }
}

export const wsService = new WebSocketService();