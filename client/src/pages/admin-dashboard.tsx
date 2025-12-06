import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Users, 
  Settings, 
  LogOut, 
  Monitor,
  MessageSquare,
  Clock,
  Calendar,
  Globe,
  FileText,
  Award,
  Download,
  Eye,
  Briefcase,
  Edit,
  Lightbulb,
  File,
  Check,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  GraduationCap,
  ShoppingCart,
  BarChart3,
  PieChart,
  Activity,
  BookOpen,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Percent,
  RefreshCw
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalStudents: number;
  totalClients: number;
  activeProjects: number;
}

interface Project {
  id: string;
  projectName: string;
  websiteIdea: string;
  status: string;
  daysRemaining: number;
  clientId: string;
  createdAt: string;
}

interface Order {
  id: string;
  orderNumber: string;
  clientId: string;
  serviceName: string;
  price: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

interface Client {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  createdAt: string;
}

interface Employee {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface Student {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  createdAt: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  lessonsCount: number;
  isActive: boolean;
}

interface PendingRequest {
  id: string;
  type: 'modification' | 'feature';
  projectId: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
}

interface Review {
  id: string;
  reviewerName: string;
  reviewerType: string;
  targetType: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  analysis: { label: "التحليل", color: "var(--ma3k-teal)", bgColor: "rgba(0, 128, 128, 0.2)" },
  design: { label: "التصميم", color: "#a855f7", bgColor: "rgba(168, 85, 247, 0.2)" },
  backend: { label: "البرمجة", color: "#eab308", bgColor: "rgba(234, 179, 8, 0.2)" },
  deployment: { label: "النشر", color: "#f97316", bgColor: "rgba(249, 115, 22, 0.2)" },
  completed: { label: "مكتمل", color: "var(--ma3k-green)", bgColor: "rgba(76, 175, 80, 0.2)" }
};

const priorityConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  low: { label: "منخفضة", color: "#22c55e", bgColor: "rgba(34, 197, 94, 0.2)" },
  medium: { label: "متوسطة", color: "#eab308", bgColor: "rgba(234, 179, 8, 0.2)" },
  high: { label: "عالية", color: "#f97316", bgColor: "rgba(249, 115, 22, 0.2)" },
  urgent: { label: "عاجلة", color: "#ef4444", bgColor: "rgba(239, 68, 68, 0.2)" }
};

const CHART_COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#a855f7", "#f59e0b", "#06b6d4"];

const arabicMonths = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

export default function AdminDashboard() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading, isEmployee, isAdmin, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  
  useEffect(() => {
    if (isLoading) return;
    
    if (!isAuthenticated || !isEmployee()) {
      toast({
        title: "يجب تسجيل الدخول",
        description: "يرجى تسجيل الدخول كمدير للوصول إلى هذه الصفحة",
        variant: "destructive"
      });
      setLocation("/employee-login");
      return;
    }
    
    if (!isAdmin() && isEmployee()) {
      toast({
        title: "تنبيه",
        description: "أنت تستخدم صلاحيات موظف. بعض الميزات قد تكون محدودة.",
      });
    }
  }, [isAuthenticated, isEmployee, isAdmin, isLoading]);

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
    enabled: !!user?.id && isEmployee(),
  });

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
    enabled: !!user?.id && isEmployee(),
  });

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
    enabled: !!user?.id && isEmployee(),
  });

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
    enabled: !!user?.id && isEmployee(),
  });

  const { data: employees = [] } = useQuery<Employee[]>({
    queryKey: ['/api/employees'],
    enabled: !!user?.id && isEmployee(),
  });

  const { data: students = [] } = useQuery<Student[]>({
    queryKey: ['/api/students'],
    enabled: !!user?.id && isEmployee(),
  });

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
    enabled: !!user?.id && isEmployee(),
  });

  const { data: pendingRequests = [] } = useQuery<PendingRequest[]>({
    queryKey: ['/api/admin/pending-requests'],
    enabled: !!user?.id && isEmployee(),
  });

  const updateRequestStatusMutation = useMutation({
    mutationFn: async ({ id, type, status }: { id: string; type: string; status: string }) => {
      const endpoint = type === 'modification' ? '/api/modification-requests' : '/api/feature-requests';
      return await apiRequest("PUT", `${endpoint}/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pending-requests'] });
      toast({ title: "تم تحديث حالة الطلب" });
    }
  });

  const handleLogout = () => {
    logout();
    toast({
      title: "تم تسجيل الخروج",
      description: "شكراً لك، أراك قريباً",
    });
    setTimeout(() => {
      setLocation("/");
    }, 1000);
  };

  const activeProjects = projects.filter(p => p.status !== "completed");
  const completedProjects = projects.filter(p => p.status === "completed");
  const pendingOrders = orders.filter(o => o.paymentStatus === "pending");
  const completedOrders = orders.filter(o => o.paymentStatus === "completed");
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.price, 0);

  // Advanced Statistics Calculations
  const revenueByMonth = useMemo(() => {
    const monthlyData: Record<string, number> = {};
    const now = new Date();
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      monthlyData[key] = 0;
    }
    // Calculate revenue per month
    completedOrders.forEach(order => {
      const date = new Date(order.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (monthlyData[key] !== undefined) {
        monthlyData[key] += order.price;
      }
    });
    // Convert to chart format
    return Object.entries(monthlyData).map(([key, value]) => {
      const [year, month] = key.split('-').map(Number);
      return {
        name: arabicMonths[month],
        revenue: value,
        month: month
      };
    });
  }, [completedOrders]);

  const projectsByStatus = useMemo(() => {
    return Object.entries(statusConfig).map(([key, info]) => ({
      name: info.label,
      value: projects.filter(p => p.status === key).length,
      color: info.color
    })).filter(item => item.value > 0);
  }, [projects]);

  const ordersByMonth = useMemo(() => {
    const monthlyData: Record<string, { total: number; completed: number; pending: number }> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      monthlyData[key] = { total: 0, completed: 0, pending: 0 };
    }
    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (monthlyData[key]) {
        monthlyData[key].total += 1;
        if (order.paymentStatus === "completed") {
          monthlyData[key].completed += 1;
        } else {
          monthlyData[key].pending += 1;
        }
      }
    });
    return Object.entries(monthlyData).map(([key, value]) => {
      const [year, month] = key.split('-').map(Number);
      return {
        name: arabicMonths[month],
        total: value.total,
        completed: value.completed,
        pending: value.pending
      };
    });
  }, [orders]);

  const clientGrowth = useMemo(() => {
    const monthlyData: Record<string, number> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      monthlyData[key] = 0;
    }
    clients.forEach(client => {
      const date = new Date(client.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (monthlyData[key] !== undefined) {
        monthlyData[key] += 1;
      }
    });
    let cumulative = 0;
    return Object.entries(monthlyData).map(([key, value]) => {
      cumulative += value;
      const [year, month] = key.split('-').map(Number);
      return {
        name: arabicMonths[month],
        newClients: value,
        totalClients: cumulative
      };
    });
  }, [clients]);

  const performanceMetrics = useMemo(() => {
    const avgOrderValue = completedOrders.length > 0 
      ? Math.round(totalRevenue / completedOrders.length) 
      : 0;
    const completionRate = orders.length > 0 
      ? Math.round((completedOrders.length / orders.length) * 100) 
      : 0;
    const projectCompletionRate = projects.length > 0 
      ? Math.round((completedProjects.length / projects.length) * 100) 
      : 0;
    const activeCoursesCount = courses.filter(c => c.isActive).length;
    const enrollmentRate = courses.length > 0 && students.length > 0
      ? Math.round((students.length / courses.length))
      : 0;
    
    // Calculate trend (compare last 30 days to previous 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    
    const recentRevenue = completedOrders
      .filter(o => new Date(o.createdAt) >= thirtyDaysAgo)
      .reduce((sum, o) => sum + o.price, 0);
    const previousRevenue = completedOrders
      .filter(o => new Date(o.createdAt) >= sixtyDaysAgo && new Date(o.createdAt) < thirtyDaysAgo)
      .reduce((sum, o) => sum + o.price, 0);
    
    // Handle trend calculation - avoid division by zero and NaN
    let revenueTrend = 0;
    if (previousRevenue > 0) {
      revenueTrend = Math.round(((recentRevenue - previousRevenue) / previousRevenue) * 100);
    } else if (recentRevenue > 0) {
      // If no previous revenue but current revenue exists, show 100% growth
      revenueTrend = 100;
    }
    // Ensure finite value
    if (!isFinite(revenueTrend)) {
      revenueTrend = 0;
    }

    return {
      avgOrderValue,
      completionRate,
      projectCompletionRate,
      activeCoursesCount,
      enrollmentRate,
      revenueTrend,
      recentRevenue,
      previousRevenue
    };
  }, [completedOrders, orders, projects, completedProjects, courses, students, totalRevenue]);

  const topServices = useMemo(() => {
    const serviceCount: Record<string, { count: number; revenue: number }> = {};
    orders.forEach(order => {
      if (!serviceCount[order.serviceName]) {
        serviceCount[order.serviceName] = { count: 0, revenue: 0 };
      }
      serviceCount[order.serviceName].count += 1;
      if (order.paymentStatus === "completed") {
        serviceCount[order.serviceName].revenue += order.price;
      }
    });
    return Object.entries(serviceCount)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [orders]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--ma3k-darker)" }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: "#ef4444", borderTopColor: "transparent" }} />
          <p style={{ color: "var(--ma3k-beige)" }}>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20" style={{ background: "var(--ma3k-darker)" }}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-72 flex-shrink-0">
            <Card className="sticky top-24" style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarFallback style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "white", fontSize: "1.5rem" }}>
                      {user?.fullName?.charAt(0) || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold" style={{ color: "var(--ma3k-beige)" }}>
                    {user?.fullName || "المدير"}
                  </h2>
                  <Badge style={{ background: "rgba(239, 68, 68, 0.2)", color: "#ef4444" }}>مدير النظام</Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="text-center p-3 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                    <div className="text-2xl font-bold" style={{ color: "#ef4444" }}>{activeProjects.length}</div>
                    <div className="text-xs" style={{ color: "var(--ma3k-beige-dark)" }}>مشاريع نشطة</div>
                  </div>
                  <div className="text-center p-3 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                    <div className="text-2xl font-bold" style={{ color: "var(--ma3k-green)" }}>{clients.length}</div>
                    <div className="text-xs" style={{ color: "var(--ma3k-beige-dark)" }}>عملاء</div>
                  </div>
                </div>

                <nav className="space-y-2">
                  {[
                    { id: "overview", label: "نظرة عامة", icon: Monitor },
                    { id: "projects", label: "المشاريع", icon: Briefcase },
                    { id: "orders", label: "الطلبات", icon: ShoppingCart },
                    { id: "clients", label: "العملاء", icon: Users },
                    { id: "employees", label: "الموظفين", icon: Award },
                    { id: "students", label: "الطلاب", icon: GraduationCap },
                    { id: "courses", label: "الدورات", icon: BookOpen },
                    { id: "requests", label: "الطلبات المعلقة", icon: AlertTriangle, badge: pendingRequests.length },
                    { id: "reports", label: "التقارير", icon: BarChart3 },
                    { id: "settings", label: "الإعدادات", icon: Settings },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover-elevate`}
                      style={{
                        background: activeTab === item.id ? "linear-gradient(135deg, #ef4444, #dc2626)" : "transparent",
                        color: activeTab === item.id ? "white" : "var(--ma3k-beige)"
                      }}
                      data-testid={`nav-${item.id}`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="flex-1 text-right">{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <Badge className="text-xs" style={{ background: "#eab308", color: "black" }}>
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  ))}
                </nav>

                <Button
                  variant="outline"
                  className="w-full mt-6"
                  onClick={handleLogout}
                  style={{ borderColor: "#ef4444", color: "#ef4444" }}
                  data-testid="button-logout"
                >
                  <LogOut className="w-4 h-4 ml-2" />
                  تسجيل الخروج
                </Button>
              </CardContent>
            </Card>
          </aside>

          <main className="flex-1">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h1 className="text-3xl font-bold" style={{ color: "var(--ma3k-beige)" }}>لوحة تحكم المدير</h1>
                    <p style={{ color: "var(--ma3k-beige-dark)" }}>مرحباً {user?.fullName}، إليك نظرة شاملة على النظام</p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card style={{ background: "linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.1))", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: "rgba(239, 68, 68, 0.3)" }}>
                            <DollarSign className="w-7 h-7" style={{ color: "#ef4444" }} />
                          </div>
                          <div>
                            <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>إجمالي الإيرادات</p>
                            <p className="text-2xl font-bold" style={{ color: "#ef4444" }}>{totalRevenue.toLocaleString()} ر.س</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card style={{ background: "linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.1))", border: "1px solid rgba(34, 197, 94, 0.3)" }}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: "rgba(34, 197, 94, 0.3)" }}>
                            <Users className="w-7 h-7" style={{ color: "#22c55e" }} />
                          </div>
                          <div>
                            <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>العملاء</p>
                            <p className="text-2xl font-bold" style={{ color: "#22c55e" }}>{stats?.totalClients || clients.length}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card style={{ background: "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.1))", border: "1px solid rgba(59, 130, 246, 0.3)" }}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: "rgba(59, 130, 246, 0.3)" }}>
                            <Briefcase className="w-7 h-7" style={{ color: "#3b82f6" }} />
                          </div>
                          <div>
                            <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>المشاريع النشطة</p>
                            <p className="text-2xl font-bold" style={{ color: "#3b82f6" }}>{stats?.activeProjects || activeProjects.length}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card style={{ background: "linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(147, 51, 234, 0.1))", border: "1px solid rgba(168, 85, 247, 0.3)" }}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: "rgba(168, 85, 247, 0.3)" }}>
                            <GraduationCap className="w-7 h-7" style={{ color: "#a855f7" }} />
                          </div>
                          <div>
                            <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>الطلاب</p>
                            <p className="text-2xl font-bold" style={{ color: "#a855f7" }}>{stats?.totalStudents || students.length}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                      <CardHeader>
                        <CardTitle style={{ color: "var(--ma3k-beige)" }}>المشاريع الأخيرة</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {projects.slice(0, 5).map((project) => {
                          const statusInfo = statusConfig[project.status] || statusConfig.analysis;
                          return (
                            <div
                              key={project.id}
                              className="p-4 rounded-xl flex items-center justify-between"
                              style={{ background: "var(--ma3k-darker)" }}
                            >
                              <div className="flex-1">
                                <p className="font-medium" style={{ color: "var(--ma3k-beige)" }}>{project.projectName}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge style={{ background: statusInfo.bgColor, color: statusInfo.color }}>
                                    {statusInfo.label}
                                  </Badge>
                                </div>
                              </div>
                              <span className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>
                                {project.daysRemaining} يوم
                              </span>
                            </div>
                          );
                        })}
                        {projects.length === 0 && (
                          <p className="text-center py-4" style={{ color: "var(--ma3k-beige-dark)" }}>لا توجد مشاريع</p>
                        )}
                      </CardContent>
                    </Card>

                    <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                      <CardHeader>
                        <CardTitle style={{ color: "var(--ma3k-beige)" }}>الطلبات الأخيرة</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {orders.slice(0, 5).map((order) => (
                          <div
                            key={order.id}
                            className="p-4 rounded-xl flex items-center justify-between"
                            style={{ background: "var(--ma3k-darker)" }}
                          >
                            <div className="flex-1">
                              <p className="font-medium" style={{ color: "var(--ma3k-beige)" }}>{order.serviceName}</p>
                              <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>{order.orderNumber}</p>
                            </div>
                            <div className="text-left">
                              <p className="font-bold" style={{ color: "var(--ma3k-green)" }}>{order.price.toLocaleString()} ر.س</p>
                              <Badge style={{ 
                                background: order.paymentStatus === "completed" ? "rgba(34, 197, 94, 0.2)" : "rgba(234, 179, 8, 0.2)",
                                color: order.paymentStatus === "completed" ? "#22c55e" : "#eab308"
                              }}>
                                {order.paymentStatus === "completed" ? "مدفوع" : "معلق"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                        {orders.length === 0 && (
                          <p className="text-center py-4" style={{ color: "var(--ma3k-beige-dark)" }}>لا توجد طلبات</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {pendingRequests.length > 0 && (
                    <Card style={{ background: "var(--ma3k-dark)", border: "1px solid rgba(234, 179, 8, 0.5)" }}>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5" style={{ color: "#eab308" }} />
                          <CardTitle style={{ color: "#eab308" }}>طلبات تحتاج انتباهك ({pendingRequests.length})</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {pendingRequests.slice(0, 3).map((request) => {
                          const priorityInfo = priorityConfig[request.priority] || priorityConfig.medium;
                          return (
                            <div
                              key={request.id}
                              className="p-4 rounded-xl flex items-center justify-between"
                              style={{ background: "var(--ma3k-darker)" }}
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline" style={{ borderColor: request.type === 'modification' ? "#f97316" : "#a855f7", color: request.type === 'modification' ? "#f97316" : "#a855f7" }}>
                                    {request.type === 'modification' ? 'تعديل' : 'ميزة'}
                                  </Badge>
                                  <Badge style={{ background: priorityInfo.bgColor, color: priorityInfo.color }}>
                                    {priorityInfo.label}
                                  </Badge>
                                </div>
                                <p className="font-medium" style={{ color: "var(--ma3k-beige)" }}>{request.title}</p>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => setActiveTab("requests")}
                                style={{ background: "#eab308", color: "black" }}
                              >
                                مراجعة
                              </Button>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              )}

              {activeTab === "projects" && (
                <motion.div
                  key="projects"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h1 className="text-3xl font-bold" style={{ color: "var(--ma3k-beige)" }}>إدارة المشاريع</h1>
                    <p style={{ color: "var(--ma3k-beige-dark)" }}>جميع مشاريع الشركة</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold" style={{ color: "#3b82f6" }}>{activeProjects.length}</div>
                        <p style={{ color: "var(--ma3k-beige-dark)" }}>مشاريع نشطة</p>
                      </CardContent>
                    </Card>
                    <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold" style={{ color: "#22c55e" }}>{completedProjects.length}</div>
                        <p style={{ color: "var(--ma3k-beige-dark)" }}>مكتملة</p>
                      </CardContent>
                    </Card>
                    <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold" style={{ color: "var(--ma3k-beige)" }}>{projects.length}</div>
                        <p style={{ color: "var(--ma3k-beige-dark)" }}>إجمالي</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid gap-4">
                    {projects.map((project) => {
                      const statusInfo = statusConfig[project.status] || statusConfig.analysis;
                      return (
                        <Card key={project.id} style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                              <div className="flex-1">
                                <h3 className="text-xl font-bold" style={{ color: "var(--ma3k-beige)" }}>{project.projectName}</h3>
                                <p className="mt-1" style={{ color: "var(--ma3k-beige-dark)" }}>{project.websiteIdea}</p>
                                <div className="flex items-center gap-3 mt-3 flex-wrap">
                                  <Badge style={{ background: statusInfo.bgColor, color: statusInfo.color }}>
                                    {statusInfo.label}
                                  </Badge>
                                  <span className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>
                                    {project.daysRemaining} يوم متبقي
                                  </span>
                                  <span className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>
                                    {new Date(project.createdAt).toLocaleDateString('ar-SA')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {activeTab === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h1 className="text-3xl font-bold" style={{ color: "var(--ma3k-beige)" }}>إدارة الطلبات</h1>
                    <p style={{ color: "var(--ma3k-beige-dark)" }}>جميع طلبات الخدمات</p>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4">
                    <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold" style={{ color: "var(--ma3k-beige)" }}>{orders.length}</div>
                        <p style={{ color: "var(--ma3k-beige-dark)" }}>إجمالي الطلبات</p>
                      </CardContent>
                    </Card>
                    <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold" style={{ color: "#22c55e" }}>{completedOrders.length}</div>
                        <p style={{ color: "var(--ma3k-beige-dark)" }}>مدفوعة</p>
                      </CardContent>
                    </Card>
                    <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold" style={{ color: "#eab308" }}>{pendingOrders.length}</div>
                        <p style={{ color: "var(--ma3k-beige-dark)" }}>معلقة</p>
                      </CardContent>
                    </Card>
                    <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold" style={{ color: "#ef4444" }}>{totalRevenue.toLocaleString()}</div>
                        <p style={{ color: "var(--ma3k-beige-dark)" }}>إجمالي الإيرادات</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid gap-4">
                    {orders.map((order) => (
                      <Card key={order.id} style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between gap-4 flex-wrap">
                            <div className="flex-1">
                              <h4 className="font-bold text-lg" style={{ color: "var(--ma3k-beige)" }}>{order.serviceName}</h4>
                              <p style={{ color: "var(--ma3k-beige-dark)" }}>{order.orderNumber}</p>
                              <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>
                                {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                              </p>
                            </div>
                            <div className="text-left">
                              <p className="text-xl font-bold" style={{ color: "var(--ma3k-green)" }}>{order.price.toLocaleString()} ر.س</p>
                              <Badge style={{ 
                                background: order.paymentStatus === "completed" ? "rgba(34, 197, 94, 0.2)" : "rgba(234, 179, 8, 0.2)",
                                color: order.paymentStatus === "completed" ? "#22c55e" : "#eab308"
                              }}>
                                {order.paymentStatus === "completed" ? "مدفوع" : "معلق"}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "clients" && (
                <motion.div
                  key="clients"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h1 className="text-3xl font-bold" style={{ color: "var(--ma3k-beige)" }}>إدارة العملاء</h1>
                    <p style={{ color: "var(--ma3k-beige-dark)" }}>جميع العملاء المسجلين</p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {clients.map((client) => (
                      <Card key={client.id} style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-14 h-14">
                              <AvatarFallback style={{ background: "var(--ma3k-teal)", color: "white", fontSize: "1.2rem" }}>
                                {client.fullName?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-bold text-lg" style={{ color: "var(--ma3k-beige)" }}>{client.fullName}</p>
                              <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>{client.email}</p>
                              {client.phone && (
                                <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>{client.phone}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {clients.length === 0 && (
                      <Card className="md:col-span-2 lg:col-span-3" style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                        <CardContent className="text-center py-16">
                          <Users className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--ma3k-beige-dark)" }} />
                          <h3 className="text-xl font-bold mb-2" style={{ color: "var(--ma3k-beige)" }}>لا يوجد عملاء</h3>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "employees" && (
                <motion.div
                  key="employees"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h1 className="text-3xl font-bold" style={{ color: "var(--ma3k-beige)" }}>إدارة الموظفين</h1>
                    <p style={{ color: "var(--ma3k-beige-dark)" }}>فريق العمل</p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {employees.map((emp) => (
                      <Card key={emp.id} style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-14 h-14">
                              <AvatarFallback style={{ background: "#f59e0b", color: "white", fontSize: "1.2rem" }}>
                                {emp.fullName?.charAt(0) || "E"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-bold text-lg" style={{ color: "var(--ma3k-beige)" }}>{emp.fullName}</p>
                              <Badge style={{ background: "rgba(245, 158, 11, 0.2)", color: "#f59e0b" }}>{emp.role}</Badge>
                              <p className="text-sm mt-1" style={{ color: "var(--ma3k-beige-dark)" }}>{emp.email}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {employees.length === 0 && (
                      <Card className="md:col-span-2 lg:col-span-3" style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                        <CardContent className="text-center py-16">
                          <Award className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--ma3k-beige-dark)" }} />
                          <h3 className="text-xl font-bold mb-2" style={{ color: "var(--ma3k-beige)" }}>لا يوجد موظفين</h3>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "students" && (
                <motion.div
                  key="students"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h1 className="text-3xl font-bold" style={{ color: "var(--ma3k-beige)" }}>إدارة الطلاب</h1>
                    <p style={{ color: "var(--ma3k-beige-dark)" }}>طلاب الأكاديمية</p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {students.map((student) => (
                      <Card key={student.id} style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-14 h-14">
                              <AvatarFallback style={{ background: "#a855f7", color: "white", fontSize: "1.2rem" }}>
                                {student.fullName?.charAt(0) || "S"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-bold text-lg" style={{ color: "var(--ma3k-beige)" }}>{student.fullName}</p>
                              <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>{student.email}</p>
                              {student.phone && (
                                <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>{student.phone}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {students.length === 0 && (
                      <Card className="md:col-span-2 lg:col-span-3" style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                        <CardContent className="text-center py-16">
                          <GraduationCap className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--ma3k-beige-dark)" }} />
                          <h3 className="text-xl font-bold mb-2" style={{ color: "var(--ma3k-beige)" }}>لا يوجد طلاب</h3>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "courses" && (
                <motion.div
                  key="courses"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h1 className="text-3xl font-bold" style={{ color: "var(--ma3k-beige)" }}>إدارة الدورات</h1>
                    <p style={{ color: "var(--ma3k-beige-dark)" }}>دورات الأكاديمية</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {courses.map((course) => (
                      <Card key={course.id} style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-bold text-lg" style={{ color: "var(--ma3k-beige)" }}>{course.title}</h4>
                              <p className="mt-1 text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>{course.description}</p>
                              <div className="flex items-center gap-3 mt-3 flex-wrap">
                                <Badge style={{ background: "rgba(168, 85, 247, 0.2)", color: "#a855f7" }}>
                                  {course.duration}
                                </Badge>
                                <span className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>
                                  {course.lessonsCount} درس
                                </span>
                              </div>
                            </div>
                            <div className="text-left">
                              <p className="text-xl font-bold" style={{ color: "var(--ma3k-green)" }}>{course.price} ر.س</p>
                              <Badge style={{ 
                                background: course.isActive ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)",
                                color: course.isActive ? "#22c55e" : "#ef4444"
                              }}>
                                {course.isActive ? "نشط" : "غير نشط"}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {courses.length === 0 && (
                      <Card className="md:col-span-2" style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                        <CardContent className="text-center py-16">
                          <BookOpen className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--ma3k-beige-dark)" }} />
                          <h3 className="text-xl font-bold mb-2" style={{ color: "var(--ma3k-beige)" }}>لا توجد دورات</h3>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "requests" && (
                <motion.div
                  key="requests"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h1 className="text-3xl font-bold" style={{ color: "var(--ma3k-beige)" }}>الطلبات المعلقة</h1>
                    <p style={{ color: "var(--ma3k-beige-dark)" }}>طلبات التعديل والميزات التي تحتاج مراجعة</p>
                  </div>

                  <div className="grid gap-4">
                    {pendingRequests.map((request) => {
                      const priorityInfo = priorityConfig[request.priority] || priorityConfig.medium;
                      return (
                        <Card key={request.id} style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                  <Badge variant="outline" style={{ borderColor: request.type === 'modification' ? "#f97316" : "#a855f7", color: request.type === 'modification' ? "#f97316" : "#a855f7" }}>
                                    {request.type === 'modification' ? 'طلب تعديل' : 'طلب ميزة'}
                                  </Badge>
                                  <Badge style={{ background: priorityInfo.bgColor, color: priorityInfo.color }}>
                                    {priorityInfo.label}
                                  </Badge>
                                </div>
                                <h4 className="font-bold text-lg" style={{ color: "var(--ma3k-beige)" }}>{request.title}</h4>
                                <p className="mt-1" style={{ color: "var(--ma3k-beige-dark)" }}>{request.description}</p>
                                <p className="text-sm mt-2" style={{ color: "var(--ma3k-beige-dark)" }}>
                                  {new Date(request.createdAt).toLocaleDateString('ar-SA')}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => updateRequestStatusMutation.mutate({ id: request.id, type: request.type, status: "in_progress" })}
                                  style={{ background: "#3b82f6", color: "white" }}
                                >
                                  قبول
                                </Button>
                                <Button
                                  onClick={() => updateRequestStatusMutation.mutate({ id: request.id, type: request.type, status: "rejected" })}
                                  style={{ background: "#ef4444", color: "white" }}
                                >
                                  رفض
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                    {pendingRequests.length === 0 && (
                      <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                        <CardContent className="text-center py-16">
                          <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: "#22c55e" }} />
                          <h3 className="text-xl font-bold mb-2" style={{ color: "var(--ma3k-beige)" }}>لا توجد طلبات معلقة</h3>
                          <p style={{ color: "var(--ma3k-beige-dark)" }}>تم معالجة جميع الطلبات</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "reports" && (
                <motion.div
                  key="reports"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <h1 className="text-3xl font-bold" style={{ color: "var(--ma3k-beige)" }}>التقارير والإحصائيات</h1>
                      <p style={{ color: "var(--ma3k-beige-dark)" }}>تحليل شامل لأداء الشركة</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => window.print()}
                      style={{ borderColor: "var(--ma3k-border)", color: "var(--ma3k-beige)" }}
                      data-testid="button-print-report"
                    >
                      <Download className="w-4 h-4 ml-2" />
                      تصدير التقرير
                    </Button>
                  </div>

                  {/* KPI Cards */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card style={{ background: "linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.05))", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="text-xs mb-1" style={{ color: "var(--ma3k-beige-dark)" }}>إجمالي الإيرادات</p>
                            <p className="text-2xl font-bold" style={{ color: "#ef4444" }}>{totalRevenue.toLocaleString()} ر.س</p>
                            <div className="flex items-center gap-1 mt-1">
                              {performanceMetrics.revenueTrend >= 0 ? (
                                <ArrowUpRight className="w-3 h-3" style={{ color: "#22c55e" }} />
                              ) : (
                                <ArrowDownRight className="w-3 h-3" style={{ color: "#ef4444" }} />
                              )}
                              <span className="text-xs" style={{ color: performanceMetrics.revenueTrend >= 0 ? "#22c55e" : "#ef4444" }}>
                                {Math.abs(performanceMetrics.revenueTrend)}% عن الشهر السابق
                              </span>
                            </div>
                          </div>
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(239, 68, 68, 0.2)" }}>
                            <DollarSign className="w-6 h-6" style={{ color: "#ef4444" }} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card style={{ background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.05))", border: "1px solid rgba(59, 130, 246, 0.3)" }}>
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="text-xs mb-1" style={{ color: "var(--ma3k-beige-dark)" }}>متوسط قيمة الطلب</p>
                            <p className="text-2xl font-bold" style={{ color: "#3b82f6" }}>{performanceMetrics.avgOrderValue.toLocaleString()} ر.س</p>
                            <p className="text-xs mt-1" style={{ color: "var(--ma3k-beige-dark)" }}>
                              من {completedOrders.length} طلب مكتمل
                            </p>
                          </div>
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(59, 130, 246, 0.2)" }}>
                            <Target className="w-6 h-6" style={{ color: "#3b82f6" }} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card style={{ background: "linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(22, 163, 74, 0.05))", border: "1px solid rgba(34, 197, 94, 0.3)" }}>
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="text-xs mb-1" style={{ color: "var(--ma3k-beige-dark)" }}>نسبة إكمال الطلبات</p>
                            <p className="text-2xl font-bold" style={{ color: "#22c55e" }}>{performanceMetrics.completionRate}%</p>
                            <p className="text-xs mt-1" style={{ color: "var(--ma3k-beige-dark)" }}>
                              {completedOrders.length} من {orders.length}
                            </p>
                          </div>
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(34, 197, 94, 0.2)" }}>
                            <Percent className="w-6 h-6" style={{ color: "#22c55e" }} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card style={{ background: "linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(147, 51, 234, 0.05))", border: "1px solid rgba(168, 85, 247, 0.3)" }}>
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="text-xs mb-1" style={{ color: "var(--ma3k-beige-dark)" }}>نسبة إكمال المشاريع</p>
                            <p className="text-2xl font-bold" style={{ color: "#a855f7" }}>{performanceMetrics.projectCompletionRate}%</p>
                            <p className="text-xs mt-1" style={{ color: "var(--ma3k-beige-dark)" }}>
                              {completedProjects.length} من {projects.length}
                            </p>
                          </div>
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(168, 85, 247, 0.2)" }}>
                            <Briefcase className="w-6 h-6" style={{ color: "#a855f7" }} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Revenue Chart */}
                  <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" style={{ color: "#ef4444" }} />
                        <CardTitle style={{ color: "var(--ma3k-beige)" }}>تطور الإيرادات الشهرية</CardTitle>
                      </div>
                      <CardDescription style={{ color: "var(--ma3k-beige-dark)" }}>آخر 6 أشهر</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={revenueByMonth} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="name" stroke="var(--ma3k-beige-dark)" fontSize={12} />
                            <YAxis stroke="var(--ma3k-beige-dark)" fontSize={12} tickFormatter={(value) => `${(value/1000).toFixed(0)}k`} />
                            <Tooltip 
                              contentStyle={{ background: "var(--ma3k-darker)", border: "1px solid var(--ma3k-border)", borderRadius: "8px" }}
                              labelStyle={{ color: "var(--ma3k-beige)" }}
                              formatter={(value: number) => [`${value.toLocaleString()} ر.س`, "الإيرادات"]}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Orders Chart */}
                    <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="w-5 h-5" style={{ color: "#3b82f6" }} />
                          <CardTitle style={{ color: "var(--ma3k-beige)" }}>إحصائيات الطلبات</CardTitle>
                        </div>
                        <CardDescription style={{ color: "var(--ma3k-beige-dark)" }}>مقارنة الطلبات المكتملة والمعلقة</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ordersByMonth} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                              <XAxis dataKey="name" stroke="var(--ma3k-beige-dark)" fontSize={11} />
                              <YAxis stroke="var(--ma3k-beige-dark)" fontSize={11} />
                              <Tooltip 
                                contentStyle={{ background: "var(--ma3k-darker)", border: "1px solid var(--ma3k-border)", borderRadius: "8px" }}
                                labelStyle={{ color: "var(--ma3k-beige)" }}
                              />
                              <Bar dataKey="completed" name="مكتملة" fill="#22c55e" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="pending" name="معلقة" fill="#eab308" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Projects by Status */}
                    <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <PieChart className="w-5 h-5" style={{ color: "#a855f7" }} />
                          <CardTitle style={{ color: "var(--ma3k-beige)" }}>توزيع المشاريع</CardTitle>
                        </div>
                        <CardDescription style={{ color: "var(--ma3k-beige-dark)" }}>حسب الحالة</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {projectsByStatus.length > 0 ? (
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <RePieChart>
                                <Pie
                                  data={projectsByStatus}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={50}
                                  outerRadius={80}
                                  paddingAngle={5}
                                  dataKey="value"
                                >
                                  {projectsByStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip 
                                  contentStyle={{ background: "var(--ma3k-darker)", border: "1px solid var(--ma3k-border)", borderRadius: "8px" }}
                                  formatter={(value: number, name: string) => [value, name]}
                                />
                                <Legend 
                                  formatter={(value) => <span style={{ color: "var(--ma3k-beige)" }}>{value}</span>}
                                />
                              </RePieChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="h-64 flex items-center justify-center">
                            <p style={{ color: "var(--ma3k-beige-dark)" }}>لا توجد بيانات</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Client Growth */}
                    <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5" style={{ color: "#22c55e" }} />
                          <CardTitle style={{ color: "var(--ma3k-beige)" }}>نمو العملاء</CardTitle>
                        </div>
                        <CardDescription style={{ color: "var(--ma3k-beige-dark)" }}>العملاء الجدد شهرياً</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={clientGrowth} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                              <XAxis dataKey="name" stroke="var(--ma3k-beige-dark)" fontSize={11} />
                              <YAxis stroke="var(--ma3k-beige-dark)" fontSize={11} />
                              <Tooltip 
                                contentStyle={{ background: "var(--ma3k-darker)", border: "1px solid var(--ma3k-border)", borderRadius: "8px" }}
                                labelStyle={{ color: "var(--ma3k-beige)" }}
                              />
                              <Line type="monotone" dataKey="newClients" name="عملاء جدد" stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e" }} />
                              <Line type="monotone" dataKey="totalClients" name="الإجمالي" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6" }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Top Services */}
                    <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5" style={{ color: "#f59e0b" }} />
                          <CardTitle style={{ color: "var(--ma3k-beige)" }}>أفضل الخدمات</CardTitle>
                        </div>
                        <CardDescription style={{ color: "var(--ma3k-beige-dark)" }}>حسب الإيرادات</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {topServices.length > 0 ? topServices.map((service, index) => (
                          <div
                            key={service.name}
                            className="flex items-center justify-between p-3 rounded-xl"
                            style={{ background: "var(--ma3k-darker)" }}
                          >
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
                                style={{ background: `${CHART_COLORS[index]}30`, color: CHART_COLORS[index] }}
                              >
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-medium text-sm" style={{ color: "var(--ma3k-beige)" }}>{service.name}</p>
                                <p className="text-xs" style={{ color: "var(--ma3k-beige-dark)" }}>{service.count} طلب</p>
                              </div>
                            </div>
                            <div className="text-left">
                              <p className="font-bold" style={{ color: CHART_COLORS[index] }}>{service.revenue.toLocaleString()} ر.س</p>
                            </div>
                          </div>
                        )) : (
                          <p className="text-center py-4" style={{ color: "var(--ma3k-beige-dark)" }}>لا توجد بيانات</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Summary Statistics */}
                  <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5" style={{ color: "#06b6d4" }} />
                        <CardTitle style={{ color: "var(--ma3k-beige)" }}>ملخص الأداء</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="w-4 h-4" style={{ color: "#22c55e" }} />
                            <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>إجمالي العملاء</p>
                          </div>
                          <p className="text-2xl font-bold" style={{ color: "#22c55e" }}>{clients.length}</p>
                        </div>
                        <div className="p-4 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                          <div className="flex items-center gap-2 mb-2">
                            <GraduationCap className="w-4 h-4" style={{ color: "#a855f7" }} />
                            <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>إجمالي الطلاب</p>
                          </div>
                          <p className="text-2xl font-bold" style={{ color: "#a855f7" }}>{students.length}</p>
                        </div>
                        <div className="p-4 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="w-4 h-4" style={{ color: "#3b82f6" }} />
                            <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>الدورات النشطة</p>
                          </div>
                          <p className="text-2xl font-bold" style={{ color: "#3b82f6" }}>{performanceMetrics.activeCoursesCount}</p>
                        </div>
                        <div className="p-4 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                          <div className="flex items-center gap-2 mb-2">
                            <Award className="w-4 h-4" style={{ color: "#f59e0b" }} />
                            <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>الموظفين</p>
                          </div>
                          <p className="text-2xl font-bold" style={{ color: "#f59e0b" }}>{employees.length}</p>
                        </div>
                      </div>

                      {/* Progress Bars for Status */}
                      <div className="mt-6 space-y-4">
                        <h4 className="font-medium" style={{ color: "var(--ma3k-beige)" }}>توزيع حالات المشاريع</h4>
                        {Object.entries(statusConfig).map(([key, info]) => {
                          const count = projects.filter(p => p.status === key).length;
                          const percentage = projects.length > 0 ? (count / projects.length) * 100 : 0;
                          return (
                            <div key={key}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm" style={{ color: "var(--ma3k-beige)" }}>{info.label}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium" style={{ color: info.color }}>{count}</span>
                                  <span className="text-xs" style={{ color: "var(--ma3k-beige-dark)" }}>({percentage.toFixed(0)}%)</span>
                                </div>
                              </div>
                              <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--ma3k-darker)" }}>
                                <div 
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{ width: `${percentage}%`, background: info.color }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h1 className="text-3xl font-bold" style={{ color: "var(--ma3k-beige)" }}>الإعدادات</h1>
                    <p style={{ color: "var(--ma3k-beige-dark)" }}>إعدادات النظام والحساب</p>
                  </div>

                  <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                    <CardHeader>
                      <CardTitle style={{ color: "var(--ma3k-beige)" }}>معلومات الحساب</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                          <p className="text-sm mb-1" style={{ color: "var(--ma3k-beige-dark)" }}>الاسم</p>
                          <p className="font-medium" style={{ color: "var(--ma3k-beige)" }}>{user?.fullName}</p>
                        </div>
                        <div className="p-4 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                          <p className="text-sm mb-1" style={{ color: "var(--ma3k-beige-dark)" }}>الدور</p>
                          <p className="font-medium" style={{ color: "var(--ma3k-beige)" }}>مدير النظام</p>
                        </div>
                        <div className="p-4 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                          <p className="text-sm mb-1" style={{ color: "var(--ma3k-beige-dark)" }}>البريد الإلكتروني</p>
                          <p className="font-medium" style={{ color: "var(--ma3k-beige)" }}>{user?.email}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
