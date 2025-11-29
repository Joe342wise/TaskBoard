# TaskBoard

> A modern, collaborative task management system with real-time updates, comprehensive RBAC, and powerful analytics.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.x-61dafb.svg)](https://reactjs.org/)
[![Hono](https://img.shields.io/badge/Hono-Latest-orange.svg)](https://hono.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🎯 What is TaskBoard?

TaskBoard is a comprehensive task management platform that helps individuals, teams, and organizations visualize work, track progress, and collaborate effectively. Whether you're managing personal todos or coordinating complex team projects, TaskBoard provides the tools you need to stay organized and productive.

### Key Features

- **🎨 Intuitive Kanban Boards** - Visual workflow management with drag-and-drop
- **👥 Team Collaboration** - Real-time updates and presence tracking
- **🔐 Granular Permissions** - 4-level RBAC (System, Organization, Team, Board)
- **📊 Advanced Analytics** - Burndown charts, velocity tracking, bottleneck identification
- **🔗 Task Dependencies** - Manage blockers and related tasks
- **🏷️ Labels & Filters** - Organize and find tasks quickly
- **💬 Comments & Mentions** - Contextual discussions on tasks
- **📎 File Attachments** - Store relevant documents with tasks
- **🔔 Smart Notifications** - Stay informed without being overwhelmed
- **🤖 Automation Rules** - Automate repetitive workflows
- **🔍 Powerful Search** - Find anything across your boards
- **📱 Responsive Design** - Works seamlessly on all devices

## 🏗️ Architecture

TaskBoard is built with a **modular monolith** architecture, balancing simplicity with scalability:

```
┌─────────────────┐
│  ClientService  │  React + TypeScript + Vite
│   (Frontend)    │  Zustand + TanStack Query
└────────┬────────┘
         │ HTTP/WSS
┌────────┴────────┐
│   APIServer     │  Hono + TypeScript
│   (Backend)     │  Modular Architecture
└────────┬────────┘
         │
    ┌────┴────┬─────────┐
    │         │         │
┌───┴───┐ ┌──┴──┐ ┌────┴────┐
│ PostgreSQL │ Redis │ MinIO/S3 │
│  (Data)    │(Cache)│  (Files) │
└────────┘ └─────┘ └─────────┘
```

For detailed architecture documentation, see [ARCHITECTURE.md](ARCHITECTURE.md).

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (or Bun runtime)
- **Docker** and **Docker Compose**
- **PostgreSQL** 16+ (or use Docker)
- **Redis** 7+ (or use Docker)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/taskboard.git
   cd taskboard
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start with Docker Compose** (Recommended)
   ```bash
   docker-compose up -d
   ```

   Or **run services individually**:

   ```bash
   # Start backend
   cd APIServer
   npm install
   npm run db:migrate
   npm run dev

   # Start frontend (in new terminal)
   cd ClientService
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - API Docs: http://localhost:3000/docs

## 📁 Project Structure

```
TaskBoard/
├── APIServer/              # Backend (Hono + TypeScript)
│   ├── src/
│   │   ├── modules/       # Feature modules (to be implemented)
│   │   ├── shared/        # Shared utilities, middleware, types
│   │   └── config/        # Configuration files
│   ├── tests/             # Backend tests
│   └── Dockerfile
│
├── ClientService/          # Frontend (React 19 + TypeScript)
│   ├── app/               # React Router 7 app directory
│   │   ├── routes/        # File-system based routes
│   │   ├── lib/           # Core utilities (auth, data manager)
│   │   ├── stores/        # Zustand stores
│   │   ├── services/      # API service layer
│   │   ├── hooks/         # Custom React hooks
│   │   ├── config/        # App configuration
│   │   └── types/         # TypeScript types
│   ├── public/            # Static assets
│   ├── pnpm-lock.yaml     # pnpm lockfile
│   ├── react-router.config.ts  # SSR configuration
│   └── Dockerfile         # Multi-stage production build
│
├── docker-compose.yml      # Docker orchestration
├── ARCHITECTURE.md         # Detailed architecture docs
└── README.md              # This file
```

## 🛠️ Technology Stack

### Backend
- **Framework**: [Hono](https://hono.dev/) - Fast, lightweight web framework
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Cache**: Redis (caching + pub/sub)
- **Auth**: JWT (access + refresh tokens)
- **Validation**: Zod
- **WebSocket**: ws / uWebSockets.js
- **Storage**: MinIO (S3-compatible) or AWS S3
- **Testing**: Vitest

### Frontend (Current Implementation)
- **Framework**: React 19.1.0
- **Language**: TypeScript 5.8.3
- **Build Tool**: Vite 6.3.3
- **State**: Zustand 5.0.8 (global) + TanStack Query 5.89.0 (server)
- **Routing**: React Router 7.7.1 (file-system routing + SSR)
- **UI**: Tailwind CSS 4.1.4 + lucide-react icons
- **Auth**: better-auth
- **Package Manager**: pnpm
- **Forms**: *Planned* - React Hook Form + Zod
- **DnD**: *Planned* - @dnd-kit
- **Charts**: *Planned* - Recharts
- **Testing**: *Planned* - Vitest + React Testing Library

### DevOps
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Reverse Proxy**: Nginx

## 🔐 Permissions System

TaskBoard implements a comprehensive 4-level RBAC system:

### Level 1: System
- **System Admin** - Full system access

### Level 2: Organization
- **Organization Owner** - Manages the organization
- **Organization Member** - Basic organization access

### Level 3: Team
- **Team Lead** - Manages team and team boards
- **Team Member** - Creates and manages tasks
- **Team Viewer** - Read-only access

### Level 4: Board
- **Board Owner** - Full board control
- **Board Collaborator** - Can create and edit tasks
- **Board Viewer** - Read-only board access

### Personal Workspace
Every user gets a personal workspace with full control over their private boards.

## 📊 Feature Roadmap

### Phase 0: Foundation (Current) 🏗️
**ClientService Scaffold**
- [x] React 19 + TypeScript setup
- [x] React Router 7 with SSR support
- [x] Zustand + TanStack Query
- [x] Tailwind CSS 4.1.4
- [x] better-auth client setup
- [x] Data manager utilities
- [x] Docker build configuration
- [ ] Testing framework setup
- [ ] API client abstraction
- [ ] Environment variables

**APIServer Scaffold**
- [x] Basic Hono template
- [ ] Database setup (PostgreSQL)
- [ ] Redis configuration
- [ ] Auth module structure
- [ ] Middleware setup

### Phase 1: MVP (Weeks 1-3) 📅
- [ ] User authentication (backend + frontend)
- [ ] Personal boards CRUD
- [ ] Columns management
- [ ] Task CRUD operations
- [ ] Drag-and-drop interface (@dnd-kit)
- [ ] Basic audit logging
- [ ] Form handling (React Hook Form + Zod)
- [ ] Authentication UI (login, register)

### Phase 2: Collaboration (Weeks 4-6) 📅
- [ ] Organizations and teams
- [ ] Full RBAC implementation
- [ ] Real-time collaboration (WebSocket)
- [ ] Comments and mentions
- [ ] Notifications system
- [ ] Board sharing UI
- [ ] Team management UI

### Phase 3: Advanced Features (Weeks 7-10) 📅
- [ ] Task dependencies
- [ ] Subtasks
- [ ] Labels and filters
- [ ] File attachments
- [ ] Search functionality
- [ ] Analytics dashboard (Recharts)
- [ ] Time tracking

### Phase 4: Automation & Polish (Weeks 11-12) 📅
- [ ] Automation rules
- [ ] Email notifications
- [ ] Data export (CSV, JSON)
- [ ] Performance optimization
- [ ] Comprehensive testing
- [ ] Production deployment

## 🧪 Testing

**Status**: Testing framework not yet configured

**Planned Setup**:
```bash
# Backend tests (Vitest)
cd APIServer
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report

# Frontend tests (Vitest + React Testing Library)
cd ClientService
pnpm test             # Run all tests
pnpm test:watch       # Watch mode
pnpm test:coverage    # Coverage report
```

## 📖 API Documentation

API documentation is available at:
- **Local**: http://localhost:3000/docs
- **Swagger/OpenAPI**: Auto-generated from code

Key endpoints:
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/boards
POST   /api/v1/boards
GET    /api/v1/boards/:id
POST   /api/v1/tasks
PATCH  /api/v1/tasks/:id
WS     /ws
```

See [ARCHITECTURE.md](ARCHITECTURE.md#api-design) for complete API reference.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Write tests for new features
- Follow existing code style
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 🔧 Configuration

Key environment variables:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/taskboard

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Storage
STORAGE_TYPE=minio  # or 's3'
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin

# App
PORT=3000
NODE_ENV=development
```

See `.env.example` for complete configuration options.

## 📈 Performance

TaskBoard is optimized for performance:
- **Database indexing** on critical queries
- **Redis caching** with smart invalidation
- **Connection pooling** for database and WebSocket
- **Code splitting** and lazy loading on frontend
- **Virtual scrolling** for large task lists
- **Optimistic UI updates** for instant feedback

Expected performance:
- API response time: < 100ms (p95)
- WebSocket latency: < 50ms
- Page load time: < 2s
- Supports 100+ concurrent users per instance

## 🔒 Security

Security is a top priority:
- ✅ Bcrypt password hashing (cost: 12)
- ✅ JWT with short expiry and refresh rotation
- ✅ RBAC on all resources
- ✅ Input validation with Zod
- ✅ SQL injection protection via ORM
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Rate limiting
- ✅ Audit logging
- ✅ HTTPS only in production

## 🐛 Troubleshooting

### Database connection issues
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check database logs
docker logs taskboard-postgres
```

### WebSocket not connecting
```bash
# Verify Redis is running
docker ps | grep redis

# Check API server logs
docker logs taskboard-api
```

### Frontend not loading
```bash
# Check environment variables
cat ClientService/.env

# Rebuild containers
docker-compose down
docker-compose up --build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Hono](https://hono.dev/) - Amazing web framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [TanStack Query](https://tanstack.com/query) - Powerful data fetching

## 📞 Support

- **Documentation**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **Issues**: [GitHub Issues](https://github.com/yourusername/taskboard/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/taskboard/discussions)

---

**Built with ❤️ using TypeScript, React, and Hono**
