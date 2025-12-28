/**
 * Role-Based Access Control (RBAC) Middleware
 * Ma3k Company Platform
 */

import { type Request, Response, NextFunction } from "express";

export type UserRole = 
  | "STUDENT"
  | "CLIENT"
  | "SYSTEM_ADMIN"
  | "SALES_MANAGER"
  | "SUPPORT_SPECIALIST"
  | "PROJECT_MANAGER"
  | "SPECIALIST"
  | "EDUCATOR";

export type UserType = "student" | "client" | "employee";

// Extend Express Request to include user info
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userType?: UserType;
      userRole?: UserRole;
      isAuthenticated?: boolean;
    }
  }
}

/**
 * Permission Matrix: Which roles can access which endpoints
 */
export const rolePermissions: Record<UserRole, string[]> = {
  // Student permissions
  STUDENT: [
    "courses:view",
    "courses:enroll",
    "lessons:view",
    "quizzes:take",
    "certificates:view",
    "profile:update",
    "tickets:create",
    "messages:chat",
  ],

  // Client permissions
  CLIENT: [
    "services:view",
    "orders:create",
    "orders:view",
    "orders:update",
    "invoices:view",
    "invoices:download",
    "projects:view",
    "messages:chat",
    "meetings:schedule",
    "files:download",
    "profile:update",
    "tickets:create",
  ],

  // Employee: System Admin (Full Access)
  SYSTEM_ADMIN: [
    "*", // All permissions
  ],

  // Employee: Sales/Account Manager
  SALES_MANAGER: [
    "leads:view",
    "leads:update",
    "orders:view",
    "orders:manage",
    "clients:view",
    "clients:update",
    "invoices:view",
    "invoices:manage",
    "messages:send",
    "reports:view",
  ],

  // Employee: Support Specialist
  SUPPORT_SPECIALIST: [
    "clients:view",
    "orders:view",
    "messages:send",
    "tickets:respond",
    "meetings:schedule",
    "files:view",
  ],

  // Employee: Project Manager
  PROJECT_MANAGER: [
    "projects:view",
    "projects:manage",
    "tasks:assign",
    "tasks:track",
    "messages:send",
    "teams:manage",
    "reports:view",
    "files:manage",
  ],

  // Employee: Specialist/Developer
  SPECIALIST: [
    "tasks:view",
    "tasks:update",
    "projects:view",
    "messages:send",
    "files:upload",
    "files:download",
  ],

  // Employee: Educator
  EDUCATOR: [
    "courses:view",
    "courses:create",
    "courses:edit",
    "lessons:create",
    "lessons:edit",
    "quizzes:create",
    "students:view",
    "grades:manage",
    "certificates:issue",
  ],
};

/**
 * Check if user has permission
 */
export function hasPermission(role: UserRole, permission: string): boolean {
  const permissions = rolePermissions[role];
  if (!permissions) return false;
  
  // Check for wildcard permission
  if (permissions.includes("*")) return true;
  
  // Check for exact permission
  if (permissions.includes(permission)) return true;
  
  // Check for wildcard resource (e.g., "orders:*" covers "orders:view", "orders:create")
  const [resource] = permission.split(":");
  if (permissions.includes(`${resource}:*`)) return true;
  
  return false;
}

/**
 * Middleware: Require authentication
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.isAuthenticated || !req.userId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  next();
}

/**
 * Middleware: Require specific role
 */
export function requireRole(roles: UserRole | UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.isAuthenticated || !req.userRole) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const rolesArray = Array.isArray(roles) ? roles : [roles];
    if (!rolesArray.includes(req.userRole)) {
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }

    next();
  };
}

/**
 * Middleware: Require specific permission
 */
export function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.isAuthenticated || !req.userRole) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    if (!hasPermission(req.userRole, permission)) {
      res.status(403).json({ error: `Missing permission: ${permission}` });
      return;
    }

    next();
  };
}

/**
 * Middleware: Parse user from session
 */
export function parseUserFromSession(req: Request, res: Response, next: NextFunction): void {
  // User info should be in session from Passport
  if ((req as any).user) {
    req.userId = (req as any).user.id;
    req.userType = (req as any).user.userType;
    req.userRole = (req as any).user.role;
    req.isAuthenticated = true;
  }
  next();
}
