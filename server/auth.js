import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'retro-irc-secret-key-2024';

// Simulated user database
const users = new Map([
  ['admin', { username: 'admin', password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' }], // password: 'secure123'
  ['guest', { username: 'guest', password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' }], // password: 'password'
]);

export const authenticateUser = async (username, password) => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Basic validation
    if (password.length < 3) {
      return { success: false, error: 'Password must be at least 3 characters' };
    }

    // Check if user exists
    const user = users.get(username.toLowerCase());
    
    // For admin users, require specific password
    if (username.toLowerCase().includes('admin') && password !== 'secure123') {
      return { success: false, error: 'Invalid admin credentials' };
    }

    // For existing users, verify password
    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid && password !== 'secure123' && password !== 'password') {
        return { success: false, error: 'Invalid credentials' };
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { username: username || `User_${Math.floor(Math.random() * 1000)}` },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const authenticatedUser = {
      username: username || `User_${Math.floor(Math.random() * 1000)}`,
      isAuthenticated: true
    };

    return { 
      success: true, 
      user: authenticatedUser,
      token 
    };

  } catch (error) {
    return { success: false, error: 'Authentication failed' };
  }
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};