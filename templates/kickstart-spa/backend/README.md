# Backend Directory

This directory is a placeholder for your backend implementation.

## Future Implementation

When you're ready to add a backend, we recommend using **Fastify** with authentication and CORS support.

### Quick Start with Fastify

```bash
cd backend
npm init -y
npm install fastify @fastify/cors @fastify/jwt @fastify/static
```

### Basic Server Setup

Create `server.js`:

```javascript
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import staticFiles from '@fastify/static';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fastify = Fastify({ logger: true });

// JWT Authentication
await fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'supersecret-change-in-production'
});

// CORS configuration
await fastify.register(cors, {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
});

// Serve frontend files
await fastify.register(staticFiles, {
  root: join(__dirname, '..', 'frontend'),
  prefix: '/frontend/'
});

// Health check
fastify.get('/api/health', async () => ({
  status: 'ok',
  timestamp: new Date().toISOString()
}));

// Protected route example
fastify.get('/api/protected', {
  onRequest: [fastify.authenticate]
}, async (request, reply) => {
  return { user: request.user };
});

// Authentication middleware
fastify.decorate('authenticate', async function(request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

// Start server
const start = async () => {
  try {
    await fastify.listen({
      port: parseInt(process.env.PORT || '3000'),
      host: '0.0.0.0'
    });
    console.log(`Server running on http://localhost:${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
```

### Authentication

For JWT-based authentication:

```javascript
// Login route
fastify.post('/api/login', async (request, reply) => {
  const { username, password } = request.body;

  // Verify credentials (replace with your logic)
  if (username === 'admin' && password === 'password') {
    const token = fastify.jwt.sign({
      id: 1,
      username: 'admin'
    });

    return { token };
  }

  reply.code(401).send({ error: 'Invalid credentials' });
});
```

### CORS Configuration

The `@fastify/cors` plugin is recommended for handling cross-origin requests:

```javascript
await fastify.register(cors, {
  origin: [
    'http://localhost:3000',
    'https://yourdomain.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
});
```

## Recommended Directory Structure

```
backend/
├── server.js           # Entry point
├── routes/
│   ├── api.js          # API routes
│   ├── auth.js         # Authentication routes
│   └── users.js        # User management
├── middleware/
│   └── auth.js         # Auth middleware
├── models/
│   └── user.js         # Data models
├── utils/
│   └── db.js           # Database connection
├── .env                # Environment variables (don't commit!)
└── package.json
```

## Environment Variables

Create a `.env` file:

```env
PORT=3000
JWT_SECRET=your-secret-key-here
CORS_ORIGIN=http://localhost:3000
DATABASE_URL=your-database-url
```

## Resources

- [Fastify Documentation](https://www.fastify.io/docs/latest/)
- [@fastify/cors](https://github.com/fastify/fastify-cors)
- [@fastify/jwt](https://github.com/fastify/fastify-jwt)
