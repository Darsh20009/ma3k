# Ma3k Company Platform - Roles & Permissions

## Overview

The Ma3k Company Platform has **3 main user types** with **8 employee roles**.

---

## User Types

### 1. STUDENT
- Learning from courses
- Cannot request services
- Cannot manage projects

### 2. CLIENT
- Can request services
- Can manage own projects
- Can communicate with employees
- Can make payments

### 3. EMPLOYEE
- Can manage system, clients, projects
- Can execute assigned tasks
- Role determines permissions

---

## Employee Roles & Permissions

### 1. SYSTEM_ADMIN
**Full system access. Can:**
- Access all features
- Manage users and roles
- Configure system settings
- Manage financial records
- View all reports
- Manage integrations

**Access Level:** 🟢 Unrestricted

---

### 2. SALES_MANAGER
**Lead and order management. Can:**
- View all leads
- Convert leads to orders
- Track sales pipeline
- Manage client relationships
- Create and send quotes
- Track payments
- Generate sales reports

**Access Level:** 🟡 Orders & Clients

---

### 3. SUPPORT_SPECIALIST
**Customer communication. Can:**
- Respond to support tickets
- Chat with clients
- Schedule meetings
- View client information
- Upload files for clients
- Create internal notes

**Access Level:** 🟡 Communication & Support

---

### 4. PROJECT_MANAGER
**Project execution oversight. Can:**
- View all projects
- Create and assign tasks
- Track project progress
- Manage team assignments
- Monitor timelines
- Approve deliverables
- Generate project reports
- Communicate with clients and specialists

**Access Level:** 🟡 Projects & Tasks

---

### 5. SPECIALIST (Developer/Designer)
**Hands-on execution. Can:**
- View assigned tasks
- Update task progress
- Upload deliverables
- Chat with team
- Request clarifications
- View project requirements
- Access design tools

**Access Level:** 🔴 Assigned Tasks Only

---

### 6. EDUCATOR
**Course management. Can:**
- Create and edit courses
- Create lessons and materials
- Create quizzes and exams
- View student progress
- Grade assignments
- Issue certificates
- Manage course announcements

**Access Level:** 🟡 Education Platform

---

## Permission Matrix

| Permission | Admin | Sales | Support | PM | Specialist | Educator |
|-----------|-------|-------|---------|----|----|----------|
| courses:view | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ |
| courses:create | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ |
| courses:edit | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ |
| lessons:create | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ |
| quizzes:create | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ |
| students:view | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ |
| grades:manage | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ |
| certificates:issue | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ |
| leads:view | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| leads:update | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| orders:create | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| orders:view | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| orders:manage | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ |
| invoices:view | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ |
| invoices:manage | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ |
| clients:view | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| clients:update | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ |
| projects:view | ✓ | ✗ | ✗ | ✓ | ✓ | ✗ |
| projects:manage | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ |
| tasks:assign | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ |
| tasks:view | ✓ | ✗ | ✗ | ✓ | ✓ | ✗ |
| tasks:update | ✓ | ✗ | ✗ | ✓ | ✓ | ✗ |
| messages:send | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| messages:view | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| tickets:respond | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ |
| files:upload | ✓ | ✗ | ✓ | ✓ | ✓ | ✗ |
| files:download | ✓ | ✗ | ✓ | ✓ | ✓ | ✗ |
| files:manage | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ |
| reports:view | ✓ | ✓ | ✗ | ✓ | ✗ | ✓ |
| settings:manage | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |

---

## How to Assign Roles

### For Employees
1. Admin creates employee account
2. Admin assigns initial role
3. Employee logs in with employee credentials
4. Can view their permitted resources

### For Clients & Students
1. Self-register on platform
2. Automatically assigned CLIENT or STUDENT role
3. Cannot change own role

---

## Role Assignment Workflow

```
New Employee Joins
        ↓
Admin Creates Account (employee-login page)
        ↓
Admin Assigns Role (SYSTEM_ADMIN, SALES_MANAGER, etc)
        ↓
Employee Receives Credentials
        ↓
Employee Logs In
        ↓
Dashboard Shows Role-Specific Content
```

---

## Implementation Details

### Frontend (React)
```typescript
// Check if user has permission
const canManageProjects = hasPermission(userRole, "projects:manage");

// Role-based UI rendering
{userRole === "PROJECT_MANAGER" && <ProjectManagement />}
```

### Backend (Express)
```typescript
// Middleware protection
app.delete("/api/projects/:id", requireRole(["SYSTEM_ADMIN", "PROJECT_MANAGER"]), deleteProject);

// Permission checking
if (!hasPermission(userRole, "orders:create")) {
  return res.status(403).json({ error: "Insufficient permissions" });
}
```

---

## Best Practices

1. **Least Privilege**: Assign minimum role needed for job
2. **Separation of Duties**: Don't mix financial and execution roles
3. **Regular Audits**: Review who has what roles monthly
4. **Change Logs**: Track role changes for compliance
5. **Role Documentation**: Keep updated list of team members and roles

---

For implementation code, see `/server/middleware/rbac.ts`.
