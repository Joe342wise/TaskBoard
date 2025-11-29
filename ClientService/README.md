# TaskBoard ClientService

The frontend application for TaskBoard - a modern, collaborative task management platform with real-time updates and intuitive user experience.

Built with **React 19**, **React Router 7**, **TypeScript**, and **Tailwind CSS** for a fast, responsive, and maintainable codebase.

## 🎯 Overview

This is the user-facing application that provides:
- Personal task boards and workspaces
- Team collaboration with real-time updates
- Drag-and-drop task management
- Organizations and team management
- Comments, mentions, and notifications
- Analytics and reporting dashboards
- File attachments
- Advanced search and filtering

## ✨ Features

- ⚛️ **React 19** - Latest React with improved performance
- 🛤️ **React Router 7** - File-system routing with SSR support
- 🌀 **TypeScript 5.8** - Full type safety
- 🎨 **Tailwind CSS 4.1** - Modern utility-first styling
- 📊 **TanStack Query** - Advanced server state management with caching
- 🐻 **Zustand** - Lightweight client state management
- 🔐 **better-auth** - Modern authentication with OAuth support
- 🔌 **WebSocket** - Real-time collaboration
- 🚀 **Vite** - Lightning-fast HMR and build
- 📦 **pnpm** - Fast, efficient package management
- 🐳 **Docker** - Production-ready containerization

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 20
- **pnpm** package manager
- TaskBoard **APIServer** running on http://localhost:3000

### 1. Installation

```bash
pnpm install
```

### 2. Development

Run the dev server with Hot Module Replacement:

```bash
pnpm dev
```

Your app will be available at [http://localhost:5173](http://localhost:5173).

### 3. Production Build

```bash
pnpm build
```

Output will be placed in:

```
build/
├── client/    # Static assets for CDN
└── server/    # Server-side rendering code
```

### 4. Start Production Server

```bash
pnpm start
```

## 📁 Project Structure

```
app/
├── routes/              # File-system based routes
│   ├── home.tsx        # Index route (/)
│   ├── auth/           # Authentication routes (planned)
│   ├── boards/         # Board routes (planned)
│   └── teams/          # Team routes (planned)
├── lib/                 # Core utilities
│   ├── auth-client.ts  # better-auth client setup
│   ├── dataManager.ts  # QueryClient, CacheManager, OptimisticUpdates, RealTimeSync
│   └── utils.ts        # Utility functions (cn, etc.)
├── stores/              # Zustand stores
│   └── user-store.ts   # Example store
├── services/            # API service layer
│   └── index.ts        # API client (to be implemented)
├── hooks/               # Custom React hooks
│   └── index.ts
├── config/              # App configuration
│   └── index.ts
├── types/               # TypeScript type definitions
│   └── index.ts
├── welcome/             # Welcome page component
│   └── welcome.tsx
├── app.css              # Tailwind CSS imports + theme
├── root.tsx             # Root layout with providers
├── routes.ts            # Route configuration
└── sign-up.ts           # Auth example
```

## 🛠️ Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.0 | UI library |
| **React Router** | 7.7.1 | File-system routing + SSR |
| **TypeScript** | 5.8.3 | Type safety |
| **Vite** | 6.3.3 | Build tool & dev server |
| **Tailwind CSS** | 4.1.4 | Utility-first styling |
| **TanStack Query** | 5.89.0 | Server state management |
| **Zustand** | 5.0.8 | Client state management |
| **better-auth** | Latest | Authentication library |
| **lucide-react** | 0.544.0 | Icon library |
| **pnpm** | Latest | Package manager |

## 🔧 Available Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server (HMR enabled) |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run tests (to be configured) |

## 🏗️ Architecture

### React Router 7 App Directory

This project uses React Router 7's modern **app directory convention** instead of traditional `src/`:

- **File-system routing**: Routes are defined by file structure
- **Automatic code splitting**: Each route is a separate chunk
- **SSR support**: Server-side rendering for better performance
- **Type-safe routes**: Generated TypeScript types for routes

### State Management Strategy

**TanStack Query** for server state:
- API data fetching and caching
- Optimistic updates
- Real-time synchronization
- Automatic background refetching

**Zustand** for client state:
- UI state (modals, sidebars, etc.)
- User preferences
- Ephemeral app state

### Data Fetching Layer

The `dataManager.ts` provides enterprise-grade utilities:

```typescript
// QueryClient - Configured with smart defaults
// CacheManager - Query invalidation and prefetching
// OptimisticUpdates - UI updates with automatic rollback
// RealTimeSync - WebSocket integration (to be implemented)
```

## 🎨 Styling

### Tailwind CSS 4.1

- Utility-first CSS framework
- Dark mode support via `prefers-color-scheme`
- Custom theme configuration in `app.css`
- `cn()` utility for conditional class merging

### Design System

```typescript
// app/lib/utils.ts
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Usage
<div className={cn('p-4', isActive && 'bg-blue-500')} />
```

## 🔐 Authentication

### better-auth Integration

The app uses **better-auth** for authentication:

```typescript
// app/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000"
});

// Usage in components
import { authClient } from "~/lib/auth-client";

await authClient.signUp.email({
  email, password, name,
  callbackURL: "/dashboard"
});
```

See [auth example](app/sign-up.ts) for complete flow.

## 🔌 Real-time Features

### WebSocket Connection

Real-time updates are handled via the `RealTimeSync` class:

```typescript
// app/lib/dataManager.ts
const realTimeSync = new RealTimeSync(queryClient);

// Connect to board updates
realTimeSync.subscribe('board', boardId, (data) => {
  // Handle real-time task updates
});
```

**Status**: Structure implemented, WebSocket connection pending.

## 🧪 Testing

**Status**: Testing framework not yet configured

**Planned Setup**:
```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom
pnpm test
```

## 🐳 Docker Deployment

### Development

```bash
docker build -t taskboard-client .
docker run -p 5173:5173 taskboard-client
```

### Production

The Dockerfile uses multi-stage builds for optimized images:

```dockerfile
FROM node:20-alpine AS development-dependencies-env
FROM node:20-alpine AS production-dependencies-env
FROM node:20-alpine AS build-env
FROM node:20-alpine
```

## 📚 Development Guidelines

### Adding New Routes

React Router 7 uses file-system routing:

```typescript
// app/routes/boards/$boardId.tsx
import type { Route } from "./+types/$boardId";

export async function loader({ params }: Route.LoaderArgs) {
  const board = await fetchBoard(params.boardId);
  return { board };
}

export default function Board({ loaderData }: Route.ComponentProps) {
  return <div>{loaderData.board.name}</div>;
}
```

### Creating API Services

```typescript
// app/services/boards.service.ts
import { authClient } from "~/lib/auth-client";

export const boardsService = {
  async getAll() {
    const response = await fetch('http://localhost:3000/api/v1/boards', {
      headers: await authClient.getHeaders()
    });
    return response.json();
  }
};
```

### Using State Management

**TanStack Query** for server data:
```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

function BoardList() {
  const { data: boards } = useQuery({
    queryKey: ['boards'],
    queryFn: () => boardsService.getAll()
  });
}
```

**Zustand** for UI state:
```typescript
import { create } from 'zustand';

const useSidebarStore = create((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen }))
}));
```

## 🗺️ Development Roadmap

### Phase 0: Foundation ✅
- [x] React 19 + TypeScript setup
- [x] React Router 7 with SSR
- [x] Zustand + TanStack Query
- [x] Tailwind CSS 4.1.4
- [x] better-auth client
- [x] Data manager utilities
- [x] Docker configuration
- [ ] Testing framework setup
- [ ] API client abstraction
- [ ] Environment variables

### Phase 1: MVP (Weeks 1-3)
- [ ] Authentication UI (login, register)
- [ ] Personal boards interface
- [ ] Task board with columns
- [ ] Drag-and-drop (@dnd-kit)
- [ ] Form handling (React Hook Form + Zod)
- [ ] API integration

### Phase 2: Collaboration (Weeks 4-6)
- [ ] Organization/team UI
- [ ] Board sharing interface
- [ ] Comments UI
- [ ] Notifications UI
- [ ] WebSocket real-time updates
- [ ] Presence indicators

### Phase 3: Advanced Features (Weeks 7-10)
- [ ] Task dependencies UI
- [ ] Labels and filters
- [ ] File upload components
- [ ] Advanced search
- [ ] Analytics dashboard (Recharts)

### Phase 4: Polish (Weeks 11-12)
- [ ] Automation rules UI
- [ ] Email preferences
- [ ] Data export functionality
- [ ] Help documentation
- [ ] User onboarding

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| `pnpm install` fails | Clear `node_modules` and `pnpm-lock.yaml`, reinstall |
| API requests fail | Ensure APIServer is running on http://localhost:3000 |
| Hot reload not working | Restart dev server with `pnpm dev` |
| TypeScript errors | Run `pnpm typecheck` to see all errors |
| Dark mode not working | Check browser's `prefers-color-scheme` setting |

## 🔗 Integration with APIServer

The ClientService expects the APIServer to provide:

### Authentication Endpoints
```
POST /api/auth/sign-up
POST /api/auth/sign-in
POST /api/auth/sign-out
GET  /api/auth/session
```

### API Response Format
```typescript
{
  success: boolean,
  data?: any,
  error?: { code: string, message: string }
}
```

### WebSocket Connection
```
WS /ws
```

## 📖 Additional Resources

- [React 19 Documentation](https://react.dev/)
- [React Router 7 Documentation](https://reactrouter.com/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [better-auth Documentation](https://www.better-auth.com/)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Project Architecture](../ARCHITECTURE.md)
- [Main README](../README.md)

## 👥 Team

- **Project**: TaskBoard
- **Maintainer**: TaskBoard Development Team
- **Documentation**: [ARCHITECTURE.md](../ARCHITECTURE.md)
- **Issues**: GitHub Issues

---

**Built for productive task management** 🚀
