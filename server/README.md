# Retro IRC Server

Backend Node.js para la aplicación de chat IRC retro.

## Instalación y Ejecución

1. Instalar dependencias:
```bash
cd server
npm install
```

2. Ejecutar servidor:
```bash
npm run dev
```

El servidor se ejecutará en `http://localhost:3001`

## Credenciales de Prueba

- **Admin**: username=`admin`, password=`secure123`
- **Guest**: username=`guest`, password=`password`
- **Cualquier usuario**: mínimo 3 caracteres en password

## Características

- ✅ Autenticación con JWT
- ✅ Chat en tiempo real con WebSocket
- ✅ Múltiples canales (#general, #irc, #team)
- ✅ Comandos IRC: /help, /users, /channels, /join, /clear, /quit
- ✅ Notificaciones de usuarios entrando/saliendo
- ✅ Historial de mensajes por canal
- ✅ Verificación de tokens

## Endpoints API

- `POST /api/auth/login` - Autenticación de usuarios

## WebSocket Events

### Cliente → Servidor
- `join` - Unirse a un canal
- `message` - Enviar mensaje
- `command` - Ejecutar comando
- `switch_channel` - Cambiar canal

### Servidor → Cliente
- `message` - Nuevo mensaje
- `system_message` - Mensaje del sistema
- `user_joined` - Usuario se unió
- `user_left` - Usuario se desconectó
- `clear_messages` - Limpiar mensajes
- `error` - Error de conexión