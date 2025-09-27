# Retro IRC Chat Application

Una aplicación de chat IRC retro con interfaz CRT y backend Node.js.

## Estructura del Proyecto

```
├── server/          # Backend Node.js + Socket.io
├── src/            # Frontend React + TypeScript
├── public/         # Archivos estáticos
└── ...
```

## Instalación y Ejecución

### 1. Servidor Backend
```bash
cd server
npm install
npm run dev
```
Servidor corriendo en: `http://localhost:3001`

### 2. Cliente Frontend
```bash
npm install
npm run dev
```
Cliente corriendo en: `http://localhost:8080`

## Credenciales de Prueba

- **Admin**: `admin` / `secure123`
- **Guest**: `guest` / `password`
- **Cualquier usuario**: mínimo 3 caracteres

## Características

### Backend (Node.js + Socket.io)
- ✅ Servidor WebSocket en tiempo real
- ✅ Autenticación JWT
- ✅ Múltiples canales de chat
- ✅ Comandos IRC completos
- ✅ Gestión de usuarios conectados

### Frontend (React + TypeScript)
- ✅ Interfaz CRT retro auténtica
- ✅ Colores personalizados hex especificados
- ✅ Efectos de pantalla de tubo
- ✅ Cliente WebSocket integrado
- ✅ Formulario de login temático

## Comandos IRC Disponibles

- `/help` - Mostrar ayuda
- `/users` - Listar usuarios conectados
- `/channels` - Listar canales disponibles
- `/join #canal` - Cambiar de canal
- `/clear` - Limpiar mensajes
- `/quit` - Desconectarse

## Canales Disponibles

- `#general` - Canal principal
- `#irc` - Discusión sobre IRC
- `#team` - Canal del equipo

## Tecnologías

**Backend:**
- Node.js + Express
- Socket.io (WebSocket)
- JWT para autenticación
- bcryptjs para passwords

**Frontend:**
- React + TypeScript
- Tailwind CSS
- Socket.io-client
- Vite
