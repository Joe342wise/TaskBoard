# TaskBoard APIServer

The backend service for TaskBoard - a collaborative task management platform with real-time updates, comprehensive RBAC, and powerful analytics.

Built with **Hono**, **TypeScript**, and a modular monolith architecture for maintainability and scalability.

## 🎯 Overview

This service powers all TaskBoard functionality including:
- User authentication and authorization (JWT-based)
- Organizations, teams, and workspace management
- Boards, columns, and task management
- Real-time collaboration via WebSockets
- Comments, notifications, and activity tracking
- File attachments and storage
- Analytics and reporting
- Automation rules

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Hono** | Fast, lightweight web framework |
| **TypeScript** | Type-safe development |
| **PostgreSQL** | Primary relational database |
| **Drizzle ORM** | SQL-first ORM with type safety |
| **Redis** | Caching + Pub/Sub for real-time |
| **Zod** | Runtime validation |
| **Pino** | Structured logging |
| **ws / uWebSockets.js** | WebSocket server for real-time updates |
| **MinIO / AWS S3** | File storage for attachments |
| **Docker** | Containerization |

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 20 (or Bun runtime)
- **pnpm** package manager
- **PostgreSQL** 16+
- **Redis** 7+
- **Docker** + Docker Compose (optional)

### 1. Installation

```bash
pnpm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Configure your `.env` file with:

**Database**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/taskboard
```

**Redis**
```env
REDIS_URL=redis://localhost:6379
```

**Authentication**
```env
JWT_SECRET=your-secret-key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
```

**File Storage**
```env
STORAGE_TYPE=minio  # or 's3'
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=taskboard-files
```

**Application**
```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 3. Database Setup

```bash
# Generate migrations
pnpm db:generate

# Run migrations
pnpm db:migrate

# (Optional) Seed database with test data
pnpm db:seed
```

### 4. Start Development Server

```bash
pnpm dev
```

Server will be available at: http://localhost:3000

## 📁 Project Structure

```
src/
├── index.ts                 # Application entry point
├── modules/                 # Feature modules (modular monolith)
│   ├── auth/               # Authentication & authorization
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.repository.ts
│   │   ├── auth.routes.ts
│   │   ├── auth.types.ts
│   │   └── auth.validation.ts
│   ├── organizations/       # Organization management
│   ├── teams/              # Team management
│   ├── boards/             # Board CRUD and management
│   ├── tasks/              # Task CRUD and operations
│   ├── comments/           # Comments on tasks
│   ├── notifications/      # Notification system
│   ├── analytics/          # Analytics and reporting
│   ├── audit/              # Audit logging
│   ├── files/              # File upload/download
│   ├── automation/         # Automation rules
│   └── search/             # Search functionality
├── shared/                  # Shared utilities
│   ├── middleware/         # Hono middleware
│   │   ├── auth.middleware.ts
│   │   ├── rbac.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── ratelimit.middleware.ts
│   ├── database/           # Database utilities
│   │   ├── connection.ts
│   │   └── migrations/
│   ├── cache/              # Redis client
│   ├── storage/            # File storage service
│   ├── websocket/          # WebSocket server
│   ├── utils/              # Utility functions
│   └── types/              # Shared TypeScript types
├── config/                  # Configuration files
│   ├── database.config.ts
│   ├── redis.config.ts
│   └── app.config.ts
└── tests/                   # Test files
```

## 🔧 Available Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Build for production |
| `pnpm start` | Run production build |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run tests (Vitest) |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:seed` | Seed database with test data |

## 🏗️ Architecture

### Modular Monolith

The codebase follows a modular monolith architecture where each feature module is self-contained with its own:
- **Controller**: HTTP request handlers
- **Service**: Business logic
- **Repository**: Data access layer
- **Routes**: Route definitions
- **Types**: TypeScript interfaces
- **Validation**: Zod schemas

### RBAC System

4-level hierarchical permissions:
1. **System Level**: System admin
2. **Organization Level**: Owner, Member
3. **Team Level**: Lead, Member, Viewer
4. **Board Level**: Owner, Collaborator, Viewer

See [ARCHITECTURE.md](../ARCHITECTURE.md#rbac-implementation) for details.

### Real-time Communication

- **WebSocket Server**: For live board updates
- **Redis Pub/Sub**: Message broadcasting across instances
- **Presence Tracking**: User online/offline status
- **Event Types**: Task created, updated, moved, deleted, etc.

## 🔐 Security

- **JWT Authentication**: Access + refresh token pattern
- **Bcrypt**: Password hashing (cost factor: 12)
- **RBAC**: Role-based access control on all resources
- **Rate Limiting**: Prevents abuse
- **Input Validation**: Zod schemas for all inputs
- **SQL Injection Protection**: Drizzle ORM parameterized queries
- **Audit Logging**: All sensitive operations logged

## 📊 API Endpoints

### Authentication
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
GET    /api/v1/auth/me
```

### Boards
```
GET    /api/v1/boards
POST   /api/v1/boards
GET    /api/v1/boards/:id
PATCH  /api/v1/boards/:id
DELETE /api/v1/boards/:id
```

### Tasks
```
GET    /api/v1/boards/:boardId/tasks
POST   /api/v1/boards/:boardId/tasks
GET    /api/v1/tasks/:id
PATCH  /api/v1/tasks/:id
DELETE /api/v1/tasks/:id
PATCH  /api/v1/tasks/:id/move
```

### WebSocket
```
WS     /ws
```

See [ARCHITECTURE.md](../ARCHITECTURE.md#api-design) for complete API reference.

## 🐳 Docker Deployment

### Development with Docker Compose

```bash
docker-compose -f docker-compose.dev.yml up --build
```

### Production Build

```bash
docker build -t taskboard-api .
docker run -p 3000:3000 taskboard-api
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage
```

## 📝 Logging

- Uses **Pino** for structured logging
- Pretty-printed in development
- JSON format in production
- Log levels: `trace`, `debug`, `info`, `warn`, `error`, `fatal`

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Database connection fails | Check `DATABASE_URL` and ensure PostgreSQL is running |
| Redis connection fails | Verify `REDIS_URL` and Redis container status |
| Migrations not applying | Run `pnpm db:migrate` manually |
| Port 3000 already in use | Change `PORT` in `.env` or kill the process |
| WebSocket not connecting | Ensure Redis is running for Pub/Sub |

## 📚 Development Guidelines

### Code Conventions
- Follow the modular structure
- Use Zod for all validation
- Write tests for new features
- Use TypeScript strict mode
- Document complex logic

### Module Pattern
```typescript
// auth.routes.ts
import { Hono } from 'hono';
import { authController } from './auth.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { validate } from '../../shared/middleware/validation.middleware';
import { registerSchema, loginSchema } from './auth.validation';

const auth = new Hono();

auth.post('/register', validate(registerSchema), authController.register);
auth.post('/login', validate(loginSchema), authController.login);
auth.post('/logout', authMiddleware, authController.logout);

export default auth;
```

## 🗺️ Development Roadmap

### Phase 0: Foundation ✅
- [x] Basic Hono template
- [ ] Database setup (PostgreSQL + Drizzle)
- [ ] Redis configuration
- [ ] Module structure
- [ ] Middleware setup

### Phase 1: MVP (Weeks 1-3)
- [ ] Auth module (register, login, JWT)
- [ ] User profile management
- [ ] Boards CRUD
- [ ] Tasks CRUD
- [ ] Basic audit logging

### Phase 2: Collaboration (Weeks 4-6)
- [ ] Organizations & Teams
- [ ] Full RBAC implementation
- [ ] WebSocket real-time updates
- [ ] Comments system
- [ ] Notifications

### Phase 3: Advanced Features (Weeks 7-10)
- [ ] Task dependencies
- [ ] File attachments
- [ ] Search functionality
- [ ] Analytics & reporting

### Phase 4: Production Ready (Weeks 11-12)
- [ ] Automation rules
- [ ] Email notifications
- [ ] Performance optimization
- [ ] Comprehensive testing
- [ ] API documentation (OpenAPI/Swagger)

## 👥 Team

- **Project**: TaskBoard
- **Maintainer**: TaskBoard Development Team
- **Documentation**: [ARCHITECTURE.md](../ARCHITECTURE.md)
- **Issues**: GitHub Issues

## 📖 Additional Resources

- [Hono Documentation](https://hono.dev/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Project Architecture](../ARCHITECTURE.md)
- [Main README](../README.md)

---

**Built for collaborative task management** 🎯
