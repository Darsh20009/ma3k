import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string) {
  if (!stored.includes('.')) {
    return supplied === stored;
  }
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'ma3k-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use('student', new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const student = await storage.getStudentByEmail(email);
        if (!student) {
          return done(null, false, { message: 'البريد الإلكتروني غير مسجل' });
        }
        const isValid = await comparePasswords(password, student.password);
        if (!isValid) {
          return done(null, false, { message: 'كلمة المرور غير صحيحة' });
        }
        return done(null, { ...student, userType: 'student' });
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.use('client', new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const client = await storage.getClientByEmail(email);
        if (!client) {
          return done(null, false, { message: 'البريد الإلكتروني غير مسجل' });
        }
        const isValid = await comparePasswords(password, client.password);
        if (!isValid) {
          return done(null, false, { message: 'كلمة المرور غير صحيحة' });
        }
        return done(null, { ...client, userType: 'client' });
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.use('employee', new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const employee = await storage.getEmployeeByEmail(email);
        if (!employee) {
          return done(null, false, { message: 'البريد الإلكتروني غير مسجل' });
        }
        const isValid = await comparePasswords(password, employee.password);
        if (!isValid) {
          return done(null, false, { message: 'كلمة المرور غير صحيحة' });
        }
        return done(null, { ...employee, userType: 'employee' });
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.serializeUser((user: any, done) => {
    done(null, { id: user.id, userType: user.userType });
  });

  passport.deserializeUser(async (data: { id: string; userType: string }, done) => {
    try {
      let user = null;
      if (data.userType === 'student') {
        user = await storage.getStudent(data.id);
      } else if (data.userType === 'client') {
        user = await storage.getClient(data.id);
      } else if (data.userType === 'employee') {
        user = await storage.getEmployee(data.id);
      }
      if (user) {
        done(null, { ...user, userType: data.userType });
      } else {
        done(null, null);
      }
    } catch (error) {
      done(error);
    }
  });
}
