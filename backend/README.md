# Backend de appTrackingPaquetesAPA

API backend para el sistema de trazabilidad de envíos internos de Almacén Pájaro Azul.

## Tecnologías

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- Redis
- dotenv
- cors
- helmet
- morgan

## Comandos

Instalar dependencias:

```bash
cd backend
npm install
```

Ejecutar en modo desarrollo:

```bash
npm run dev
```

Compilar para producción:

```bash
npm run build
```

Iniciar versión compilada:

```bash
npm run start
```

Crear o actualizar usuario default para pruebas:

```bash
npm run seed
```

El seed es idempotente: no duplica el usuario y guarda la contrasena con bcrypt.
Tambien crea datos demo minimos para presentacion: lugares, usuarios remitente,
destinatario, motorista y estados base.

Credenciales de prueba:

- Usuario: `Sistemas`
- Correo tecnico: `sistemas@pajaroazul.local`
- Password: `Sistemas*2026`
- Rol: `administrador`

## Variables de entorno

Copiar `.env.example` a `.env` y configurar los valores locales.

- `PUERTO`: Puerto donde escucha el backend.
- `MONGO_URI`: Conexion a MongoDB.
- `REDIS_URL`: Conexion a Redis.
- `CORS_ORIGINS`: Origenes permitidos para el frontend.

## Puerto

El backend se expone en `http://localhost:<PUERTO>`.
