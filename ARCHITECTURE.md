# Task Board - System Architecture

## Table of Contents
- [Overview](#overview)
- [High-Level Architecture](#high-level-architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Database Design](#database-design)
- [Module Design](#module-design)
- [RBAC Implementation](#rbac-implementation)
- [Real-time Communication](#real-time-communication)
- [API Design](#api-design)
- [Security Considerations](#security-considerations)
- [Performance Optimization](#performance-optimization)
- [Development Phases](#development-phases)

## Overview

Task Board is a collaborative task management system built with a modular monolith architecture. It supports individual task management, team collaboration, and organizational workflows with real-time updates, comprehensive RBAC, and advanced analytics.

### Design Principles
- **Modular Monolith**: Clear separation of concerns while maintaining deployment simplicity
- **Scalability First**: Designed to handle 20-50 users initially, scalable to hundreds
- **Real-time by Default**: WebSocket-based collaboration for team boards
- **Security & Audit**: Comprehensive RBAC and audit logging from day one
- **Developer Experience**: Type-safe, testable, and maintainable codebase

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌────────────────────────────────────────────────────┐     │
│  │   ClientService (React + TypeScript)               │     │
│  │   - State Management (Zustand/Redux)               │     │
│  │   - WebSocket Client                               │     │
│  │   - REST API Client                                │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/WSS
┌─────────────────────────────────────────────────────────────┐
│                      APIServer (Hono)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              API Gateway Layer                       │   │
│  │  - Authentication Middleware                         │   │
│  │  - RBAC Middleware                                   │   │
│  │  - Request Validation                                │   │
│  │  - Rate Limiting                                     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Core Modules (Modular Monolith)            │   │
│  │                                                       │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │   │
│  │  │   Auth      │  │  Organization│  │   Teams    │  │   │
│  │  │   Module    │  │    Module    │  │   Module   │  │   │
│  │  └─────────────┘  └──────────────┘  └────────────┘  │   │
│  │                                                       │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │   │
│  │  │   Boards    │  │    Tasks     │  │  Comments  │  │   │
│  │  │   Module    │  │    Module    │  │   Module   │  │   │
│  │  └─────────────┘  └──────────────┘  └────────────┘  │   │
│  │                                                       │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │   │
│  │  │Notification │  │   Analytics  │  │   Audit    │  │   │
│  │  │   Module    │  │    Module    │  │   Module   │  │   │
│  │  └─────────────┘  └──────────────┘  └────────────┘  │   │
│  │                                                       │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │   │
│  │  │   Files     │  │  Automation  │  │  Search    │  │   │
│  │  │   Module    │  │    Module    │  │   Module   │  │   │
│  │  └─────────────┘  └──────────────┘  └────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Real-time Communication Layer             │   │
│  │  - WebSocket Server (ws/uWebSockets.js)             │   │
│  │  - Redis Pub/Sub for board updates                   │   │
│  │  - Presence tracking                                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  PostgreSQL  │  │    Redis     │  │  S3/MinIO    │      │
│  │  (Primary)   │  │   (Cache +   │  │ (File Store) │      │
│  │              │  │   Pub/Sub)   │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Backend (APIServer)
| Component | Technology | Purpose |
|-----------|-----------|---------|
| Runtime | Node.js / Bun | JavaScript runtime (Bun for better performance) |
| Framework | Hono | Fast, lightweight web framework |
| Database | PostgreSQL | Primary data store |
| ORM | Drizzle ORM / Prisma | Type-safe database access |
| Cache | Redis | Caching + Pub/Sub for real-time |
| WebSocket | ws / uWebSockets.js | Real-time communication |
| Validation | Zod | Schema validation |
| Authentication | JWT | Token-based auth (access + refresh) |
| File Storage | MinIO / AWS S3 | Object storage for attachments |
| Testing | Vitest | Unit and integration testing |
| API Docs | OpenAPI/Swagger | API documentation |

### Frontend (ClientService)
| Component | Technology | Purpose |
|-----------|-----------|---------|
| Framework | React 18 + TypeScript | UI library with type safety |
| Build Tool | Vite | Fast build and dev server |
| State Management | Zustand / Redux Toolkit | Global state management |
| Routing | React Router v6 | Client-side routing |
| UI Components | shadcn/ui + Tailwind CSS | Component library + styling |
| Forms | React Hook Form + Zod | Form handling and validation |
| Data Fetching | TanStack Query | Server state management |
| WebSocket | Native WebSocket API | Real-time updates |
| Drag & Drop | @dnd-kit | Task board drag and drop |
| Charts | Recharts / Chart.js | Analytics visualization |
| Testing | Vitest + React Testing Library | Component testing |

### DevOps
| Component | Technology | Purpose |
|-----------|-----------|---------|
| Containerization | Docker + Docker Compose | Container orchestration |
| Reverse Proxy | Nginx / Caddy | Load balancing and SSL |
| CI/CD | GitHub Actions | Automated testing and deployment |
| Monitoring | Prometheus + Grafana (Future) | Application monitoring |

## Project Structure

```
TaskBoard/
├── APIServer/                    # Backend (Hono)
│   ├── src/
│   │   ├── modules/             # Modular monolith structure
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.repository.ts
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── auth.types.ts
│   │   │   │   └── auth.validation.ts
│   │   │   ├── organizations/
│   │   │   ├── teams/
│   │   │   ├── boards/
│   │   │   ├── tasks/
│   │   │   ├── comments/
│   │   │   ├── notifications/
│   │   │   ├── analytics/
│   │   │   ├── audit/
│   │   │   ├── files/
│   │   │   ├── automation/
│   │   │   └── search/
│   │   ├── shared/              # Shared utilities
│   │   │   ├── middleware/
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   ├── rbac.middleware.ts
│   │   │   │   ├── validation.middleware.ts
│   │   │   │   └── ratelimit.middleware.ts
│   │   │   ├── database/
│   │   │   │   ├── connection.ts
│   │   │   │   ├── migrations/
│   │   │   │   └── seeds/
│   │   │   ├── cache/
│   │   │   │   └── redis.client.ts
│   │   │   ├── storage/
│   │   │   │   └── file.service.ts
│   │   │   ├── websocket/
│   │   │   │   ├── ws.server.ts
│   │   │   │   └── ws.handlers.ts
│   │   │   ├── utils/
│   │   │   └── types/
│   │   ├── config/
│   │   │   ├── database.config.ts
│   │   │   ├── redis.config.ts
│   │   │   └── app.config.ts
│   │   └── index.ts             # App entry point
│   ├── tests/
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── ClientService/               # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── features/           # Feature-based architecture
│   │   │   ├── auth/
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   ├── services/
│   │   │   │   └── store/
│   │   │   ├── organizations/
│   │   │   ├── teams/
│   │   │   ├── boards/
│   │   │   ├── tasks/
│   │   │   ├── notifications/
│   │   │   └── analytics/
│   │   ├── shared/
│   │   │   ├── components/      # Reusable UI components
│   │   │   ├── hooks/
│   │   │   ├── utils/
│   │   │   ├── types/
│   │   │   ├── api/
│   │   │   │   ├── client.ts
│   │   │   │   └── websocket.ts
│   │   │   └── store/           # Global state
│   │   ├── layouts/
│   │   ├── routes/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
├── ARCHITECTURE.md
└── README.md
```

## Database Design

### Entity Relationship Overview

```
Users ──< Organization Members >── Organizations
  │                                      │
  │                                      │
  └──< Team Members >── Teams ───────────┘
              │            │
              │            │
              └────────< Boards >────────┐
                          │              │
                          │              │
                       Columns          Board Members
                          │
                          │
                       Tasks ──< Comments
                          │
                          ├──< Task Labels >── Labels
                          │
                          ├──< Attachments
                          │
                          └──< Task Dependencies
```

### Core Tables

#### Users & Authentication
```sql
users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  full_name VARCHAR NOT NULL,
  avatar_url VARCHAR,
  role VARCHAR NOT NULL, -- 'system_admin', 'user'
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP
)
```

#### Organizations
```sql
organizations (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES users(id),
  settings JSONB, -- privacy, billing, etc.
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

organization_members (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  user_id UUID REFERENCES users(id),
  role VARCHAR NOT NULL, -- 'owner', 'member'
  joined_at TIMESTAMP,
  UNIQUE(organization_id, user_id)
)
```

#### Teams
```sql
teams (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  name VARCHAR NOT NULL,
  description TEXT,
  lead_id UUID REFERENCES users(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

team_members (
  id UUID PRIMARY KEY,
  team_id UUID REFERENCES teams(id),
  user_id UUID REFERENCES users(id),
  role VARCHAR NOT NULL, -- 'lead', 'member', 'viewer'
  joined_at TIMESTAMP,
  UNIQUE(team_id, user_id)
)
```

#### Boards & Columns
```sql
boards (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  type VARCHAR NOT NULL, -- 'personal', 'team', 'organization'
  owner_id UUID REFERENCES users(id), -- for personal boards
  team_id UUID REFERENCES teams(id), -- for team boards
  organization_id UUID REFERENCES organizations(id), -- for org boards
  settings JSONB, -- background, labels, etc.
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  archived_at TIMESTAMP
)

board_members (
  id UUID PRIMARY KEY,
  board_id UUID REFERENCES boards(id),
  user_id UUID REFERENCES users(id),
  role VARCHAR NOT NULL, -- 'owner', 'collaborator', 'viewer'
  added_at TIMESTAMP,
  UNIQUE(board_id, user_id)
)

columns (
  id UUID PRIMARY KEY,
  board_id UUID REFERENCES boards(id),
  name VARCHAR NOT NULL,
  position INTEGER NOT NULL,
  wip_limit INTEGER, -- work-in-progress limit
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

#### Tasks
```sql
tasks (
  id UUID PRIMARY KEY,
  board_id UUID REFERENCES boards(id),
  column_id UUID REFERENCES columns(id),
  title VARCHAR NOT NULL,
  description TEXT,
  position INTEGER NOT NULL, -- for ordering within column
  priority VARCHAR, -- 'low', 'medium', 'high', 'critical'
  assignee_id UUID REFERENCES users(id),
  reporter_id UUID REFERENCES users(id),
  parent_task_id UUID REFERENCES tasks(id), -- for subtasks
  due_date TIMESTAMP,
  start_date TIMESTAMP,
  completed_at TIMESTAMP,
  estimated_hours DECIMAL,
  actual_hours DECIMAL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  archived_at TIMESTAMP
)

labels (
  id UUID PRIMARY KEY,
  board_id UUID REFERENCES boards(id),
  name VARCHAR NOT NULL,
  color VARCHAR NOT NULL,
  created_at TIMESTAMP
)

task_labels (
  task_id UUID REFERENCES tasks(id),
  label_id UUID REFERENCES labels(id),
  PRIMARY KEY (task_id, label_id)
)

task_dependencies (
  id UUID PRIMARY KEY,
  task_id UUID REFERENCES tasks(id), -- blocked task
  depends_on_task_id UUID REFERENCES tasks(id), -- blocking task
  dependency_type VARCHAR, -- 'blocks', 'blocked_by', 'related'
  created_at TIMESTAMP
)
```

#### Comments & Attachments
```sql
comments (
  id UUID PRIMARY KEY,
  task_id UUID REFERENCES tasks(id),
  user_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  mentions JSONB, -- array of user IDs mentioned
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP
)

attachments (
  id UUID PRIMARY KEY,
  task_id UUID REFERENCES tasks(id),
  uploaded_by UUID REFERENCES users(id),
  file_name VARCHAR NOT NULL,
  file_url VARCHAR NOT NULL,
  file_size BIGINT,
  mime_type VARCHAR,
  created_at TIMESTAMP
)
```

#### Notifications & Audit
```sql
notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR NOT NULL, -- 'task_assigned', 'comment_mention', 'task_updated'
  title VARCHAR NOT NULL,
  message TEXT,
  entity_type VARCHAR, -- 'task', 'comment', 'board'
  entity_id UUID,
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  created_at TIMESTAMP
)

audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action VARCHAR NOT NULL, -- 'create', 'update', 'delete', 'move'
  entity_type VARCHAR NOT NULL, -- 'task', 'board', 'column'
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR,
  user_agent TEXT,
  created_at TIMESTAMP
)

activities (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  board_id UUID REFERENCES boards(id),
  task_id UUID REFERENCES tasks(id),
  action VARCHAR NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP
)
```

#### Automation
```sql
automation_rules (
  id UUID PRIMARY KEY,
  board_id UUID REFERENCES boards(id),
  name VARCHAR NOT NULL,
  trigger_type VARCHAR NOT NULL, -- 'task_moved', 'task_created', 'due_date'
  trigger_conditions JSONB,
  actions JSONB, -- array of actions to perform
  enabled BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

#### Performance Indexes
```sql
CREATE INDEX idx_tasks_board_id ON tasks(board_id);
CREATE INDEX idx_tasks_column_id ON tasks(column_id);
CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date) WHERE due_date IS NOT NULL;
CREATE INDEX idx_comments_task_id ON comments(task_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_activities_board_id ON activities(board_id);
CREATE INDEX idx_activities_created_at ON activities(created_at);
CREATE INDEX idx_board_members_user ON board_members(user_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);
```

## Module Design

### Module Structure Pattern

Each module follows a consistent layered architecture:

```
module/
├── module.controller.ts  # HTTP request handlers
├── module.service.ts     # Business logic
├── module.repository.ts  # Data access layer
├── module.routes.ts      # Route definitions
├── module.types.ts       # TypeScript types/interfaces
└── module.validation.ts  # Zod schemas for validation
```

### Module Responsibilities

#### Auth Module
- User registration and login
- JWT token generation and validation
- Password hashing and verification
- Email verification
- Password reset
- Session management

#### Organization Module
- Create and manage organizations
- Organization settings
- Member management
- Organization-level permissions

#### Teams Module
- Create and manage teams
- Team member management
- Team-level permissions
- Team settings and configuration

#### Boards Module
- Create, update, delete boards
- Board configuration and settings
- Board member management
- Column management
- Board archival

#### Tasks Module
- CRUD operations for tasks
- Task assignment
- Task movement between columns
- Subtask management
- Task dependencies
- Priority and status management

#### Comments Module
- Add, edit, delete comments
- User mentions
- Comment threading (future)

#### Notifications Module
- Real-time notification delivery
- Email notifications
- Notification preferences
- Mark as read/unread

#### Analytics Module
- Board productivity metrics
- Task completion rates
- Time tracking analysis
- Bottleneck identification
- Team performance metrics

#### Audit Module
- Log all significant actions
- Track changes to entities
- Provide audit trail
- Compliance reporting

#### Files Module
- File upload/download
- Storage management
- File metadata
- Access control

#### Automation Module
- Rule creation and management
- Trigger evaluation
- Action execution
- Rule templates

#### Search Module
- Full-text search across tasks
- Filter and sort capabilities
- Advanced query support
- Search indexing

## RBAC Implementation

### Permission Hierarchy

The system implements a 4-level hierarchical RBAC:

```typescript
// Permission levels (from highest to lowest)
enum Permission {
  // Level 1: System
  SYSTEM_ADMIN = 'system:admin',

  // Level 2: Organization
  ORG_OWNER = 'org:owner',
  ORG_MEMBER = 'org:member',

  // Level 3: Team
  TEAM_LEAD = 'team:lead',
  TEAM_MEMBER = 'team:member',
  TEAM_VIEWER = 'team:viewer',

  // Level 4: Board
  BOARD_OWNER = 'board:owner',
  BOARD_COLLABORATOR = 'board:collaborator',
  BOARD_VIEWER = 'board:viewer',
}
```

### Permission Matrix

| Action | System Admin | Org Owner | Team Lead | Team Member | Team Viewer | Board Owner | Board Collaborator | Board Viewer |
|--------|--------------|-----------|-----------|-------------|-------------|-------------|-------------------|--------------|
| Create Organization | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage Organization | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Create Team | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage Team | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Create Board | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Delete Board | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Create Task | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| Edit Task | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| Delete Task | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| View Task | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Assign Task | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| Comment | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |

### Permission Check Flow

```typescript
interface PermissionContext {
  userId: string;
  organizationId?: string;
  teamId?: string;
  boardId?: string;
  resourceId?: string;
}

// Example permission check
async function checkPermission(
  context: PermissionContext,
  requiredPermission: Permission
): Promise<boolean> {
  // 1. Check system-level permissions
  // 2. Check organization-level permissions
  // 3. Check team-level permissions
  // 4. Check board-level permissions
  // 5. Check resource-specific permissions
}
```

### Personal Workspace Rules

Every user automatically has:
- **Personal Workspace**: Private by default
- **Board Owner Role**: Full control of personal boards
- **Invitation Control**: Can invite collaborators to personal boards

## Real-time Communication

### WebSocket Architecture

```typescript
// WebSocket Event Types
enum WSEvent {
  // Connection lifecycle
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  HEARTBEAT = 'heartbeat',

  // Board events
  JOIN_BOARD = 'board:join',
  LEAVE_BOARD = 'board:leave',
  BOARD_UPDATED = 'board:updated',

  // Task events
  TASK_CREATED = 'task:created',
  TASK_UPDATED = 'task:updated',
  TASK_MOVED = 'task:moved',
  TASK_DELETED = 'task:deleted',
  TASK_ASSIGNED = 'task:assigned',

  // Column events
  COLUMN_CREATED = 'column:created',
  COLUMN_UPDATED = 'column:updated',
  COLUMN_DELETED = 'column:deleted',

  // Comment events
  COMMENT_CREATED = 'comment:created',
  COMMENT_UPDATED = 'comment:updated',
  COMMENT_DELETED = 'comment:deleted',

  // Collaboration
  USER_PRESENCE = 'user:presence',
  USER_TYPING = 'user:typing',
  CURSOR_POSITION = 'cursor:position',

  // Notifications
  NOTIFICATION = 'notification',
}
```

### Redis Pub/Sub Channels

```typescript
// Channel naming convention
const channels = {
  board: (boardId: string) => `board:${boardId}`,
  user: (userId: string) => `user:${userId}`,
  team: (teamId: string) => `team:${teamId}`,
  organization: (orgId: string) => `org:${orgId}`,
}
```

### Real-time Update Flow

```
User Action → API Server → Database → Redis Pub/Sub → WebSocket Server → Connected Clients
```

### Presence Tracking

```typescript
interface UserPresence {
  userId: string;
  boardId: string;
  status: 'active' | 'idle' | 'offline';
  lastSeen: Date;
  cursorPosition?: { x: number; y: number };
}

// Store in Redis with TTL
// Key: `presence:board:${boardId}:user:${userId}`
// TTL: 5 minutes (refreshed on heartbeat)
```

### Graceful Degradation

For personal boards or offline scenarios:
- WebSocket connections are optional
- Polling fallback every 30 seconds
- Optimistic UI updates
- Conflict resolution on sync

## API Design

### RESTful Endpoints

#### Authentication
```
POST   /api/v1/auth/register          # Register new user
POST   /api/v1/auth/login             # Login
POST   /api/v1/auth/logout            # Logout
POST   /api/v1/auth/refresh           # Refresh access token
POST   /api/v1/auth/verify-email      # Verify email
POST   /api/v1/auth/forgot-password   # Request password reset
POST   /api/v1/auth/reset-password    # Reset password
GET    /api/v1/auth/me                # Get current user
```

#### Organizations
```
GET    /api/v1/organizations          # List user's organizations
POST   /api/v1/organizations          # Create organization
GET    /api/v1/organizations/:id      # Get organization
PATCH  /api/v1/organizations/:id      # Update organization
DELETE /api/v1/organizations/:id      # Delete organization
GET    /api/v1/organizations/:id/members     # List members
POST   /api/v1/organizations/:id/members     # Add member
DELETE /api/v1/organizations/:id/members/:userId  # Remove member
```

#### Teams
```
GET    /api/v1/teams                  # List user's teams
POST   /api/v1/teams                  # Create team
GET    /api/v1/teams/:id              # Get team
PATCH  /api/v1/teams/:id              # Update team
DELETE /api/v1/teams/:id              # Delete team
GET    /api/v1/teams/:id/members      # List team members
POST   /api/v1/teams/:id/members      # Add team member
PATCH  /api/v1/teams/:id/members/:userId  # Update member role
DELETE /api/v1/teams/:id/members/:userId  # Remove team member
```

#### Boards
```
GET    /api/v1/boards                 # List user's accessible boards
POST   /api/v1/boards                 # Create board
GET    /api/v1/boards/:id             # Get board with columns and tasks
PATCH  /api/v1/boards/:id             # Update board
DELETE /api/v1/boards/:id             # Delete board
POST   /api/v1/boards/:id/archive     # Archive board
POST   /api/v1/boards/:id/members     # Add board member
DELETE /api/v1/boards/:id/members/:userId  # Remove board member
```

#### Columns
```
GET    /api/v1/boards/:boardId/columns       # List columns
POST   /api/v1/boards/:boardId/columns       # Create column
PATCH  /api/v1/columns/:id                   # Update column
DELETE /api/v1/columns/:id                   # Delete column
PATCH  /api/v1/columns/:id/reorder           # Reorder column
```

#### Tasks
```
GET    /api/v1/boards/:boardId/tasks         # List tasks
POST   /api/v1/boards/:boardId/tasks         # Create task
GET    /api/v1/tasks/:id                     # Get task details
PATCH  /api/v1/tasks/:id                     # Update task
DELETE /api/v1/tasks/:id                     # Delete task
PATCH  /api/v1/tasks/:id/move                # Move task to column
POST   /api/v1/tasks/:id/assign              # Assign task
GET    /api/v1/tasks/:id/subtasks            # List subtasks
POST   /api/v1/tasks/:id/subtasks            # Create subtask
POST   /api/v1/tasks/:id/dependencies        # Add dependency
DELETE /api/v1/tasks/:id/dependencies/:depId # Remove dependency
```

#### Comments
```
GET    /api/v1/tasks/:taskId/comments        # List comments
POST   /api/v1/tasks/:taskId/comments        # Create comment
PATCH  /api/v1/comments/:id                  # Update comment
DELETE /api/v1/comments/:id                  # Delete comment
```

#### Labels
```
GET    /api/v1/boards/:boardId/labels        # List labels
POST   /api/v1/boards/:boardId/labels        # Create label
PATCH  /api/v1/labels/:id                    # Update label
DELETE /api/v1/labels/:id                    # Delete label
POST   /api/v1/tasks/:taskId/labels/:labelId # Add label to task
DELETE /api/v1/tasks/:taskId/labels/:labelId # Remove label from task
```

#### Attachments
```
GET    /api/v1/tasks/:taskId/attachments     # List attachments
POST   /api/v1/tasks/:taskId/attachments     # Upload attachment
DELETE /api/v1/attachments/:id               # Delete attachment
GET    /api/v1/attachments/:id/download      # Download attachment
```

#### Notifications
```
GET    /api/v1/notifications                 # List user notifications
PATCH  /api/v1/notifications/:id/read        # Mark as read
PATCH  /api/v1/notifications/read-all        # Mark all as read
DELETE /api/v1/notifications/:id             # Delete notification
```

#### Analytics
```
GET    /api/v1/analytics/board/:boardId      # Board analytics
GET    /api/v1/analytics/team/:teamId        # Team analytics
GET    /api/v1/analytics/user/:userId        # User analytics
GET    /api/v1/analytics/board/:boardId/burndown  # Burndown chart
GET    /api/v1/analytics/board/:boardId/velocity  # Team velocity
```

#### Search
```
GET    /api/v1/search/tasks                  # Search tasks
GET    /api/v1/search/boards                 # Search boards
GET    /api/v1/search/users                  # Search users
```

#### Automation
```
GET    /api/v1/boards/:boardId/automations   # List automation rules
POST   /api/v1/boards/:boardId/automations   # Create rule
PATCH  /api/v1/automations/:id               # Update rule
DELETE /api/v1/automations/:id               # Delete rule
PATCH  /api/v1/automations/:id/toggle        # Enable/disable rule
```

### WebSocket Connection

```
WS     /ws                                    # WebSocket endpoint
```

### Response Format

```typescript
// Success response
{
  success: true,
  data: { ... },
  meta?: {
    pagination?: {
      page: number,
      limit: number,
      total: number
    }
  }
}

// Error response
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  }
}
```

## Security Considerations

### Authentication
- **Bcrypt** for password hashing (cost factor: 12)
- **JWT** tokens with short expiry (15 minutes for access, 7 days for refresh)
- **Refresh token rotation** on each use
- **Email verification** required for sensitive operations
- **Rate limiting** on auth endpoints

### Authorization
- **RBAC** checks on every request
- **Resource ownership** verification
- **Team/Organization membership** validation
- **Board access** control

### Data Protection
- **Input validation** using Zod schemas
- **SQL injection protection** via ORM parameterized queries
- **XSS protection** with proper escaping
- **CSRF protection** for state-changing operations
- **File upload validation** (type, size, virus scanning)

### API Security
- **Rate limiting** (100 req/min per user, 1000 req/min per IP)
- **Request size limits** (10MB max)
- **CORS** configuration for allowed origins
- **HTTPS only** in production
- **Security headers** (CSP, HSTS, X-Frame-Options)

### WebSocket Security
- **JWT authentication** on connection
- **Room-based access control**
- **Message validation**
- **Heartbeat monitoring** for dead connections

### Audit & Compliance
- **Audit logging** for sensitive operations
- **Data retention policies**
- **GDPR compliance** (data export, deletion)
- **PII encryption** at rest

## Performance Optimization

### Database Optimization
- **Indexes** on frequently queried columns
- **Partial indexes** for filtered queries
- **Connection pooling** (max 20 connections)
- **Query optimization** with EXPLAIN ANALYZE
- **Materialized views** for analytics

### Caching Strategy
```typescript
// Redis caching layers
const cache = {
  // User session cache (TTL: 15 minutes)
  session: `session:${userId}`,

  // Board data cache (TTL: 5 minutes)
  board: `board:${boardId}`,

  // Task list cache (TTL: 1 minute)
  tasks: `tasks:board:${boardId}`,

  // Analytics cache (TTL: 1 hour)
  analytics: `analytics:board:${boardId}`,

  // User permissions cache (TTL: 10 minutes)
  permissions: `permissions:user:${userId}:board:${boardId}`,
}
```

### API Optimization
- **Pagination** (default: 50 items, max: 100)
- **Field selection** (only requested fields)
- **N+1 query prevention** with eager loading
- **Response compression** (gzip)
- **HTTP/2** support

### Frontend Optimization
- **Code splitting** by route
- **Lazy loading** for heavy components
- **Virtual scrolling** for long task lists
- **Optimistic UI updates**
- **Debounced search** (300ms)
- **Memoization** for expensive computations
- **Service Worker** for offline support

### Real-time Optimization
- **Connection pooling** for WebSockets
- **Message batching** (100ms window)
- **Selective subscriptions** (only active boards)
- **Presence throttling** (update every 5 seconds)

## Development Phases

### Phase 1: MVP Foundation (Weeks 1-3)
**Goal**: Working personal task board

- [ ] Project setup and tooling
- [ ] Database schema and migrations
- [ ] Auth module (register, login, JWT)
- [ ] User module (profile management)
- [ ] Boards module (CRUD)
- [ ] Columns module (CRUD)
- [ ] Tasks module (CRUD, drag & drop)
- [ ] Basic audit logging
- [ ] Frontend scaffold
- [ ] Auth UI (login, register)
- [ ] Personal board UI
- [ ] Task board with drag & drop
- [ ] Basic styling with Tailwind

**Deliverable**: Single user can create boards, columns, and manage tasks

### Phase 2: Collaboration (Weeks 4-6)
**Goal**: Team collaboration features

- [ ] Organizations module
- [ ] Teams module
- [ ] RBAC implementation
- [ ] Board sharing and permissions
- [ ] Comments module
- [ ] Mentions in comments
- [ ] Notifications module
- [ ] Real-time WebSocket server
- [ ] Real-time board updates
- [ ] Presence tracking
- [ ] Organizations UI
- [ ] Teams UI
- [ ] Board sharing interface
- [ ] Comments UI
- [ ] Notifications UI
- [ ] Real-time indicators

**Deliverable**: Teams can collaborate on shared boards in real-time

### Phase 3: Advanced Features (Weeks 7-10)
**Goal**: Power user features

- [ ] Task dependencies
- [ ] Subtasks
- [ ] Labels module
- [ ] Files module (upload/download)
- [ ] Search module
- [ ] Advanced filters
- [ ] Analytics module
- [ ] Burndown charts
- [ ] Velocity tracking
- [ ] Time tracking
- [ ] Task dependencies UI
- [ ] Subtasks UI
- [ ] Labels and filters UI
- [ ] File attachments UI
- [ ] Advanced search interface
- [ ] Analytics dashboard
- [ ] Charts and visualizations

**Deliverable**: Feature-complete task management system

### Phase 4: Automation & Polish (Weeks 11-12)
**Goal**: Production-ready system

- [ ] Automation module
- [ ] Rule templates
- [ ] Email notifications
- [ ] Data export (CSV, JSON)
- [ ] Performance optimization
- [ ] Comprehensive testing (80%+ coverage)
- [ ] API documentation
- [ ] Docker setup
- [ ] CI/CD pipeline
- [ ] Production deployment
- [ ] Monitoring and logging
- [ ] Automation rules UI
- [ ] Email preferences
- [ ] Export functionality
- [ ] Help documentation
- [ ] User onboarding

**Deliverable**: Production-ready, deployed application

## Deployment Architecture

### Docker Compose Setup

```yaml
services:
  api:
    build: ./APIServer
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL
      - REDIS_URL
      - JWT_SECRET
    depends_on:
      - postgres
      - redis

  client:
    build: ./ClientService
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL

  postgres:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER
      - POSTGRES_PASSWORD
      - POSTGRES_DB

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data
    environment:
      - MINIO_ROOT_USER
      - MINIO_ROOT_PASSWORD

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certs:/etc/nginx/certs
    depends_on:
      - api
      - client
```

### Scaling Considerations

For future horizontal scaling:
- **Load balancer** (Nginx/HAProxy)
- **Multiple API instances** with session stickiness
- **Redis Cluster** for distributed caching
- **PostgreSQL replication** (primary-replica)
- **CDN** for static assets
- **Message queue** (RabbitMQ/Redis) for async jobs

---

## Appendix

### Useful Resources
- [Hono Documentation](https://hono.dev/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Best Practices](https://wiki.postgresql.org/wiki/Don%27t_Do_This)
- [WebSocket Protocol](https://datatracker.ietf.org/doc/html/rfc6455)

### Design Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-11-19 | Modular Monolith over Microservices | Simpler deployment, easier development for MVP |
| 2025-11-19 | Hono over Express | Better TypeScript support, faster performance |
| 2025-11-19 | PostgreSQL over MongoDB | Complex relational data, ACID compliance needed |
| 2025-11-19 | Zustand over Redux | Simpler API, less boilerplate for MVP |

### Migration Path to Microservices (Future)

If scaling requires microservices:
1. Extract **Notifications Service** first (independent)
2. Extract **Analytics Service** second (read-heavy)
3. Extract **File Service** third (storage-intensive)
4. Keep core domain (Boards, Tasks) together

### Contributing Guidelines

See individual module READMEs for:
- Coding standards
- Testing requirements
- PR process
- Module-specific documentation

---

**Last Updated**: 2025-11-19
**Version**: 1.0.0
**Maintainer**: TaskBoard Development Team
