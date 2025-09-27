import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { authenticateUser } from './auth.js';
import { ChatManager } from './chat.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  }
});

const chatManager = new ChatManager(io);

app.use(cors());
app.use(express.json());

// Authentication endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const result = await authenticateUser(username, password);
    
    if (result.success) {
      res.json({ 
        success: true, 
        user: result.user,
        token: result.token 
      });
    } else {
      res.status(401).json({ 
        success: false, 
        error: result.error 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Authentication failed' 
    });
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  chatManager.handleConnection(socket);
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    chatManager.handleDisconnection(socket);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 IRC Server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready`);
});