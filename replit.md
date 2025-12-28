# Ma3k Company Platform - Complete Vision

**Last Updated**: December 28, 2025

---

## 📋 Overview

**Ma3k Company Platform** is a unified ecosystem serving multiple brands and business models:

- **Public Website**: Service discovery, pricing, and lead generation
- **Client Portal**: Service requests, order tracking, payments, file delivery
- **Employee Portal**: Order management, task tracking, client communication, project delivery
- **Edutiy by Ma3k**: Complete education platform with courses, lessons, quizzes, certificates
- **Menuza by Ma3k**: Restaurant services (menu design, branding, QR codes, content)
- **Ma3k Edits**: Web development and app services
- **Kafayat Services**: Professional services marketplace

---

## 🎯 Core Principles (Sprint 0 - Foundation)

### Database Strategy
- **Primary DB**: PostgreSQL (via Neon) using Drizzle ORM
- **Core Tables**: Users, Orders, Services, Payments, Invoices, Employees, Clients, Projects
- **No duplication**: Single source of truth for all data
- **Clean schema**: Only essential fields, no unnecessary timestamps

### Authentication & Roles
Three user types with role-based access:
1. **Client**: Customer requesting services
2. **Student**: Learning from courses
3. **Employee**: Staff with roles (Admin, Sales, Support, PM, Specialist)

### Architecture
```
Frontend (React + Wouter + TanStack Query)
    ↓
Backend (Express.js + PostgreSQL)
    ↓
Services (Payment, Email, File Storage)
```

---

## 🏗️ Current Project Status

### ✅ COMPLETED (Already Implemented)
- Basic authentication (students, clients, employees)
- Database setup (PostgreSQL + Drizzle ORM)
- Services catalog (website/app development, courses)
- Order management system
- Invoice generation
- Payment integration (PayPal, Stripe, local methods)
- Course and student management (basic)
- WebSocket chat system
- Project management basics
- File upload and management

### ⏳ IN PROGRESS - Sprint 0 (Foundation Cleanup)
- Code cleanup and removing duplicate pages
- Consolidating database schema for clarity
- Setting up environment variables properly
- Establishing folder structure separation
- Creating RBAC framework for employee roles

### 📝 PENDING (Requires Autonomous Mode for Complete Implementation)
- **Employee Portal Redesign**: Full UI overhaul with employee dashboard, task board, CRM pipeline
- **Client Portal Enhancements**: Service request wizard, status tracking, file delivery system
- **Public Website Redesign**: New brand identity (beige/white/gray/green colors), modern luxury design
- **Edutiy Full Implementation**: Lesson pages, quiz system, certificate generation
- **Menuza Integration**: Restaurant service packages, QR code system
- **Meeting Scheduler**: Zoom/Google Meet integration, scheduling system
- **Activity Logging**: Complete audit trail for all user actions
- **Advanced CRM**: Lead pipeline, conversion tracking, email templates
- **Advanced File Management**: Drag-drop uploads, preview system, versioning

---

## 📁 Folder Structure (Standardized)

```
project/
├── client/                   # Frontend React app
│   └── src/
│       ├── pages/           # Route pages (public, client, employee, student)
│       ├── components/      # Reusable UI components
│       │   ├── ui/         # Shadcn components
│       │   ├── layout/     # Header, footer, sidebar
│       │   ├── forms/      # Form components
│       │   └── features/   # Domain-specific components
│       ├── hooks/          # Custom React hooks
│       ├── context/        # Context providers (Auth, Cart, etc)
│       ├── lib/            # Utilities and constants
│       └── index.css       # Global styles
├── server/                  # Backend Node.js/Express
│       ├── index.ts        # Entry point
│       ├── routes.ts       # API routes
│       ├── auth.ts         # Authentication logic
│       ├── storage.ts      # Database interface
│       ├── db.ts           # Database connection
│       ├── email.ts        # Email sending
│       └── paypal.ts       # PayPal integration
├── shared/                  # Shared types & schemas
│       └── schema.ts       # Database schema + Zod validations
├── data/                    # JSON seed data (deprecated, use DB)
└── package.json            # Dependencies
```

---

## 🗄️ Database Schema (Core Models)

### User-Related Tables
- **users**: Basic platform users (legacy, prefer role-specific tables)
- **employees**: Staff with roles and permissions
- **clients**: Business customers
- **students**: Course learners

### Service & Order Management
- **services**: Service catalog (price, features, category)
- **orders**: Service requests from clients
- **invoices**: Billing and payment records
- **payments**: Payment transaction history

### Project Management
- **projects**: Client projects linked to orders
- **employee_tasks**: Individual task assignments
- **project_files**: File uploads for projects
- **project_questions**: Requirements questionnaire

### Communication
- **chat_conversations**: Conversation threads
- **chat_messages**: Individual messages
- **messages**: Legacy message system (deprecate)
- **tickets**: Support tickets
- **ticket_responses**: Support ticket replies

### Education
- **courses**: Course catalog
- **lessons**: Individual lessons within courses
- **enrollments**: Student course registrations
- **quiz_attempts**: Quiz/exam submissions
- **certificates**: Issued certificates

### Business Features
- **modifications_requests**: Change requests for projects
- **feature_requests**: New feature requests
- **reviews**: Customer reviews and ratings
- **notifications**: Real-time notifications
- **meetings**: Meeting scheduling
- **discount_codes**: Promotional codes

---

## 🔐 Authentication & Roles (Framework)

### User Types & Roles
```typescript
STUDENT:
  - View courses
  - Submit assignments
  - Take quizzes
  - Download certificates

CLIENT:
  - View services
  - Create orders
  - Track order status
  - Communicate with staff
  - Download invoices
  - Upload files

EMPLOYEE:
  - SYSTEM_ADMIN: Full platform access
  - SALES_MANAGER: Lead management, order tracking
  - SUPPORT: Client communication, ticket handling
  - PROJECT_MANAGER: Task assignment, progress tracking
  - SPECIALIST: Task execution, file delivery
  - EDUCATOR: Course and student management
```

---

## 🚀 Frontend Pages Structure

### Public Pages (No Auth Required)
- `/` - Home page
- `/about` - About Ma3k
- `/services` - Service catalog with brand filters
- `/pricing` - Pricing and packages
- `/contact` - Contact form
- `/portfolio` - Case studies / Portfolio
- `/faq` - Frequently asked questions
- `/privacy` - Privacy policy
- `/terms` - Terms of service

### Client Pages (After Login)
- `/client/dashboard` - My orders, stats
- `/client/orders` - Order list and tracking
- `/client/messages` - Chat with employees
- `/client/invoices` - Billing and payment history
- `/client/deliverables` - Download files
- `/client/meetings` - Meeting schedule
- `/client/support` - Support tickets

### Student Pages (After Login)
- `/student/dashboard` - Learning progress
- `/student/courses` - Enrolled courses
- `/student/lessons` - Lesson content
- `/student/quizzes` - Quiz and exam submissions
- `/student/certificates` - Certificate list

### Employee Pages (Requires Role)
- `/employee/dashboard` - Stats and overview
- `/employee/clients` - Client list and CRM
- `/employee/orders` - Order queue and status
- `/employee/tasks` - Task board (Kanban)
- `/employee/messages` - Internal messaging
- `/employee/meetings` - Schedule meetings
- `/employee/finance` - Invoices and payments
- `/employee/settings` - Role and permission management

---

## 📊 Development Roadmap

### Sprint 0: Foundation & Cleanup (Current)
- [x] Analyze current codebase
- [ ] Clean up duplicate pages
- [ ] Consolidate database schema
- [ ] Set up environment variables
- [ ] Create folder structure
- [ ] Document architecture

### Sprint 1-6: (Requires Autonomous Mode)
See attached document for detailed multi-week implementation plan

---

## 🛠️ Environment Setup

### Required Environment Variables

**Development (.env.development)**
```
DATABASE_URL=postgresql://user:password@localhost:5432/ma3k_dev
PAYPAL_CLIENT_ID=xxxxx
PAYPAL_SECRET=xxxxx
SENDGRID_API_KEY=xxxxx
EMPLOYEE_REGISTRATION_CODE=xxxxx
```

**Production (.env.production)**
```
DATABASE_URL=postgresql://user:password@prod-host:5432/ma3k_prod
PAYPAL_CLIENT_ID=xxxxx (production)
PAYPAL_SECRET=xxxxx (production)
SENDGRID_API_KEY=xxxxx (production)
```

---

## 📚 Key Dependencies

### Frontend
- React 18 + TypeScript
- Wouter (routing)
- TanStack Query (data fetching)
- Shadcn/ui + Tailwind CSS
- Framer Motion (animations)

### Backend
- Node.js + Express
- PostgreSQL + Drizzle ORM
- Passport.js (authentication)
- Zod (validation)
- SendGrid (email)
- PayPal SDK

---

## 👥 User Personas & Journeys

### Client Journey
1. Discover service on public website
2. Click "Request Service"
3. Select service package
4. Fill smart request form (or answer interview questions)
5. Create account / Login
6. Submit order
7. Receive order number and SLA
8. Support contacts within SLA
9. Schedule meeting if needed
10. PM breaks into tasks
11. Specialist completes work
12. Receive files and invoice
13. Pay via PayPal/Stripe/Bank/Local
14. Leave review

### Employee Workflow
1. Review new leads/orders
2. Assign to appropriate team
3. Update client via chat
4. Schedule meeting if needed
5. Create tasks in task board
6. Assign to specialists
7. Track progress on Kanban
8. Get approval from PM
9. Deliver files to client
10. Mark complete, send invoice

---

## 🎨 Design System (To Be Implemented)

### Brand Colors
- **Primary**: Beige (#D4C4B9) / Soft
- **Secondary**: White (#FFFFFF)
- **Accent**: Green (#4CAF50) / Ma3k Green
- **Neutral**: Gray (#8C8C8C) / Sidebar & borders
- **Text**: Dark Gray (#333333)

### Typography
- Arabic: Tajawal (primary)
- English: Inter (fallback)
- Sizes: 12px, 14px, 16px, 18px, 20px, 24px, 32px

### Components
- Cards with subtle elevation
- Buttons with ripple effect
- Input fields with labels
- Modals for confirmations
- Toast notifications
- Skeleton loaders

---

## 📞 Contact & Support

- **Email**: support@ma3k.co
- **WhatsApp**: +966 xx xxx xxxx
- **Phone**: +966 xx xxx xxxx
- **Hours**: 9 AM - 5 PM (Saudi Arabia Time)

---

## 📝 Notes for Developers

1. **Always use Drizzle ORM** for database operations - no raw SQL
2. **Validate all inputs** with Zod schemas before processing
3. **Use TanStack Query** for all client-side data fetching
4. **Add data-testid** to all interactive elements
5. **RTL-first CSS** - Arabic text flows right-to-left
6. **Environment variables** - Never hardcode secrets
7. **Error handling** - Provide user-friendly error messages
8. **Logging** - Log important business events for auditing

---

## Last Modified
- December 28, 2025 - Sprint 0 Foundation Planning
