import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserType = "student" | "client" | "employee" | null;

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  type: UserType;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userType: UserType;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  registerStudent: (data: any) => Promise<{ success: boolean; error?: string }>;
  registerClient: (data: any) => Promise<{ success: boolean; error?: string }>;
  checkAuth: () => boolean;
  isStudent: () => boolean;
  isClient: () => boolean;
  isEmployee: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userType, setUserType] = useState<UserType>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUserId = localStorage.getItem("ma3k_user_id");
    const savedUserType = localStorage.getItem("ma3k_user_type");
    const savedUserName = localStorage.getItem("ma3k_user_name");
    const savedUserEmail = localStorage.getItem("ma3k_user_email");

    if (savedUserId && savedUserType && savedUserName && savedUserEmail) {
      setUser({
        id: savedUserId,
        fullName: savedUserName,
        email: savedUserEmail,
        type: savedUserType as UserType
      });
      setUserType(savedUserType as UserType);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.error || "فشل تسجيل الدخول" };
      }

      const data = await response.json();
      
      const authUser: AuthUser = {
        id: data.user.id,
        fullName: data.user.fullName,
        email: data.user.email,
        type: data.type
      };

      setUser(authUser);
      setUserType(data.type);

      localStorage.setItem("ma3k_user_id", data.user.id);
      localStorage.setItem("ma3k_user_type", data.type);
      localStorage.setItem("ma3k_user_email", data.user.email);
      localStorage.setItem("ma3k_user_name", data.user.fullName);

      return { success: true };
    } catch (error) {
      return { success: false, error: "حدث خطأ أثناء تسجيل الدخول" };
    }
  };

  const registerStudent = async (data: any): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch("/api/auth/register-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.error || "فشل إنشاء الحساب" };
      }

      const student = await response.json();
      
      const authUser: AuthUser = {
        id: student.id,
        fullName: student.fullName,
        email: student.email,
        type: "student"
      };

      setUser(authUser);
      setUserType("student");

      localStorage.setItem("ma3k_user_id", student.id);
      localStorage.setItem("ma3k_user_type", "student");
      localStorage.setItem("ma3k_user_email", student.email);
      localStorage.setItem("ma3k_user_name", student.fullName);

      return { success: true };
    } catch (error) {
      return { success: false, error: "حدث خطأ أثناء إنشاء الحساب" };
    }
  };

  const registerClient = async (data: any): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch("/api/auth/register-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.error || "فشل إنشاء الحساب" };
      }

      const client = await response.json();
      
      const authUser: AuthUser = {
        id: client.id,
        fullName: client.fullName,
        email: client.email,
        type: "client"
      };

      setUser(authUser);
      setUserType("client");

      localStorage.setItem("ma3k_user_id", client.id);
      localStorage.setItem("ma3k_user_type", "client");
      localStorage.setItem("ma3k_user_email", client.email);
      localStorage.setItem("ma3k_user_name", client.fullName);

      return { success: true };
    } catch (error) {
      return { success: false, error: "حدث خطأ أثناء إنشاء الحساب" };
    }
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    localStorage.removeItem("ma3k_user_id");
    localStorage.removeItem("ma3k_user_type");
    localStorage.removeItem("ma3k_user_email");
    localStorage.removeItem("ma3k_user_name");
  };

  const checkAuth = (): boolean => {
    return !!user;
  };

  const isStudent = (): boolean => {
    return userType === "student";
  };

  const isClient = (): boolean => {
    return userType === "client";
  };

  const isEmployee = (): boolean => {
    return userType === "employee";
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      userType,
      login,
      logout,
      registerStudent,
      registerClient,
      checkAuth,
      isStudent,
      isClient,
      isEmployee
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
