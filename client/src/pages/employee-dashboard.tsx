import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Users, 
  Video, 
  Code2, 
  Settings, 
  LogOut, 
  UserPlus, 
  Key,
  Monitor,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Share,
  MessageSquare,
  Coffee,
  Clock,
  Calendar,
  Database,
  Globe,
  FileText,
  Award,
  FileCheck,
  Calculator,
  Download,
  Copy,
  Eye,
  Plus,
  Trash2,
  Save,
  Play,
  Zap,
  X,
  Heart,
  Star,
  RotateCcw,
  Badge as BadgeIcon,
  Briefcase,
  Edit,
  Lightbulb,
  File,
  Send,
  Check,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface Project {
  id: string;
  projectName: string;
  websiteIdea: string;
  status: string;
  daysRemaining: number;
  clientId: string;
  targetDate?: string;
  domain?: string;
  toolsUsed?: string[];
}

interface EmployeeTask {
  id: string;
  employeeId: string;
  projectId: string;
  title: string;
  description: string;
  isCompleted: boolean;
  hoursRemaining: number;
  createdAt: string;
}

interface ModificationRequest {
  id: string;
  projectId: string;
  clientId: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  assignedTo?: string;
  createdAt: string;
}

interface FeatureRequest {
  id: string;
  projectId: string;
  clientId: string;
  title: string;
  description: string;
  category?: string;
  priority: string;
  status: string;
  estimatedCost?: number;
  estimatedDays?: number;
  adminNotes?: string;
  createdAt: string;
}

interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: string;
  senderName: string;
  content: string;
  messageType: string;
  isRead: boolean;
  createdAt: string;
}

interface ChatConversation {
  id: string;
  projectId: string;
  clientId: string;
  employeeId?: string;
  type: string;
  status: string;
  lastMessageAt: string;
}

interface ProjectFile {
  id: string;
  projectId: string;
  uploadedBy: string;
  uploaderType: string;
  uploaderName: string;
  fileName: string;
  fileUrl: string;
  fileType?: string;
  createdAt: string;
}

interface Client {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string; progress: number }> = {
  analysis: { label: "التحليل", color: "var(--ma3k-teal)", bgColor: "rgba(0, 128, 128, 0.2)", progress: 20 },
  design: { label: "التصميم", color: "#a855f7", bgColor: "rgba(168, 85, 247, 0.2)", progress: 40 },
  backend: { label: "البرمجة", color: "#eab308", bgColor: "rgba(234, 179, 8, 0.2)", progress: 60 },
  deployment: { label: "النشر", color: "#f97316", bgColor: "rgba(249, 115, 22, 0.2)", progress: 80 },
  completed: { label: "مكتمل", color: "var(--ma3k-green)", bgColor: "rgba(76, 175, 80, 0.2)", progress: 100 }
};

const priorityConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  low: { label: "منخفضة", color: "#22c55e", bgColor: "rgba(34, 197, 94, 0.2)" },
  medium: { label: "متوسطة", color: "#eab308", bgColor: "rgba(234, 179, 8, 0.2)" },
  high: { label: "عالية", color: "#f97316", bgColor: "rgba(249, 115, 22, 0.2)" },
  urgent: { label: "عاجلة", color: "#ef4444", bgColor: "rgba(239, 68, 68, 0.2)" }
};

const requestStatusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  pending: { label: "قيد الانتظار", color: "#eab308", bgColor: "rgba(234, 179, 8, 0.2)" },
  in_progress: { label: "قيد التنفيذ", color: "#3b82f6", bgColor: "rgba(59, 130, 246, 0.2)" },
  completed: { label: "مكتمل", color: "#22c55e", bgColor: "rgba(34, 197, 94, 0.2)" },
  rejected: { label: "مرفوض", color: "#ef4444", bgColor: "rgba(239, 68, 68, 0.2)" },
  approved: { label: "تمت الموافقة", color: "#22c55e", bgColor: "rgba(34, 197, 94, 0.2)" }
};

export default function EmployeeDashboard() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading, isEmployee, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isLoading) return;
    
    if (!isAuthenticated || !isEmployee()) {
      toast({
        title: "يجب تسجيل الدخول",
        description: "يرجى تسجيل الدخول كموظف للوصول إلى هذه الصفحة",
        variant: "destructive"
      });
      setLocation("/employee-login");
    }
  }, [isAuthenticated, isEmployee, isLoading]);

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
    enabled: !!user?.id && isEmployee(),
  });

  const { data: tasks = [] } = useQuery<EmployeeTask[]>({
    queryKey: ['/api/employees', user?.id, 'tasks'],
    queryFn: async () => {
      const res = await fetch(`/api/employees/${user?.id}/tasks`);
      return res.json();
    },
    enabled: !!user?.id && isEmployee(),
  });

  const { data: conversations = [] } = useQuery<ChatConversation[]>({
    queryKey: ['/api/chat/conversations/employee', user?.id],
    enabled: !!user?.id && isEmployee(),
  });

  const { data: modificationRequests = [] } = useQuery<ModificationRequest[]>({
    queryKey: ['/api/modification-requests/project', selectedProject?.id],
    queryFn: async () => {
      if (!selectedProject) return [];
      const res = await fetch(`/api/modification-requests/project/${selectedProject.id}`);
      return res.json();
    },
    enabled: !!selectedProject?.id,
  });

  const { data: featureRequests = [] } = useQuery<FeatureRequest[]>({
    queryKey: ['/api/feature-requests/project', selectedProject?.id],
    queryFn: async () => {
      if (!selectedProject) return [];
      const res = await fetch(`/api/feature-requests/project/${selectedProject.id}`);
      return res.json();
    },
    enabled: !!selectedProject?.id,
  });

  const { data: chatMessages = [], refetch: refetchMessages } = useQuery<ChatMessage[]>({
    queryKey: ['/api/chat/conversations', selectedProject?.id, 'messages'],
    queryFn: async () => {
      if (!selectedProject) return [];
      const conv = conversations.find(c => c.projectId === selectedProject.id);
      if (!conv) return [];
      const res = await fetch(`/api/chat/conversations/${conv.id}/messages`);
      return res.json();
    },
    enabled: !!selectedProject && conversations.length > 0,
    refetchInterval: 5000,
  });

  const { data: projectFiles = [] } = useQuery<ProjectFile[]>({
    queryKey: ['/api/project-files', selectedProject?.id],
    enabled: !!selectedProject?.id,
  });

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
    enabled: !!user?.id && isEmployee(),
  });

  const { data: dashboardStats } = useQuery<{
    totalOrders: number;
    totalRevenue: number;
    totalStudents: number;
    totalClients: number;
    activeProjects: number;
  }>({
    queryKey: ['/api/dashboard/stats'],
    enabled: !!user?.id && isEmployee(),
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, isCompleted, hoursRemaining }: { id: string; isCompleted: boolean; hoursRemaining?: number }) => {
      return await apiRequest("PUT", `/api/employee-tasks/${id}`, { isCompleted, hoursRemaining });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/employees', user?.id, 'tasks'] });
      toast({ title: "تم تحديث المهمة" });
    }
  });

  const updateProjectStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await apiRequest("PATCH", `/api/projects/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({ title: "تم تحديث حالة المشروع" });
    }
  });

  const updateModificationStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await apiRequest("PUT", `/api/modification-requests/${id}/status`, { status, assignedTo: user?.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/modification-requests/project', selectedProject?.id] });
      toast({ title: "تم تحديث حالة الطلب" });
    }
  });

  const updateFeatureStatusMutation = useMutation({
    mutationFn: async ({ id, status, adminNotes, estimatedCost, estimatedDays }: { id: string; status: string; adminNotes?: string; estimatedCost?: number; estimatedDays?: number }) => {
      return await apiRequest("PUT", `/api/feature-requests/${id}/status`, { status, adminNotes, estimatedCost, estimatedDays });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/feature-requests/project', selectedProject?.id] });
      toast({ title: "تم تحديث حالة الطلب" });
    }
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { conversationId: string; content: string }) => {
      return await apiRequest("POST", "/api/chat/messages", {
        ...data,
        senderId: user?.id,
        senderType: "employee",
        senderName: user?.fullName || "موظف",
        messageType: "text"
      });
    },
    onSuccess: () => {
      setNewMessage("");
      refetchMessages();
      toast({ title: "تم إرسال الرسالة" });
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

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedProject) return;
    const conv = conversations.find(c => c.projectId === selectedProject.id);
    if (conv) {
      sendMessageMutation.mutate({ conversationId: conv.id, content: newMessage });
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const activeProjects = projects.filter(p => p.status !== "completed");
  const completedProjects = projects.filter(p => p.status === "completed");
  const pendingTasks = tasks.filter(t => !t.isCompleted);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--ma3k-darker)" }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: "var(--ma3k-teal)", borderTopColor: "transparent" }} />
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
                    <AvatarFallback style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "white", fontSize: "1.5rem" }}>
                      {user?.fullName?.charAt(0) || "M"}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold" style={{ color: "var(--ma3k-beige)" }}>
                    {user?.fullName || "الموظف"}
                  </h2>
                  <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>
                    {user?.role || "مطور"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="text-center p-3 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                    <div className="text-2xl font-bold" style={{ color: "#f59e0b" }}>{activeProjects.length}</div>
                    <div className="text-xs" style={{ color: "var(--ma3k-beige-dark)" }}>مشاريع نشطة</div>
                  </div>
                  <div className="text-center p-3 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                    <div className="text-2xl font-bold" style={{ color: "var(--ma3k-green)" }}>{pendingTasks.length}</div>
                    <div className="text-xs" style={{ color: "var(--ma3k-beige-dark)" }}>مهام معلقة</div>
                  </div>
                </div>

                <nav className="space-y-2">
                  {[
                    { id: "dashboard", label: "الرئيسية", icon: Monitor },
                    { id: "projects", label: "المشاريع", icon: Briefcase },
                    { id: "tasks", label: "المهام", icon: CheckCircle },
                    { id: "requests", label: "طلبات التعديل", icon: Edit },
                    { id: "features", label: "طلبات الميزات", icon: Lightbulb },
                    { id: "chat", label: "المراسلات", icon: MessageSquare },
                    { id: "files", label: "الملفات", icon: File },
                    { id: "clients", label: "العملاء", icon: Users },
                    { id: "settings", label: "الإعدادات", icon: Settings },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover-elevate`}
                      style={{
                        background: activeTab === item.id ? "linear-gradient(135deg, #f59e0b, #d97706)" : "transparent",
                        color: activeTab === item.id ? "white" : "var(--ma3k-beige)"
                      }}
                      data-testid={`nav-${item.id}`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="flex-1 text-right">{item.label}</span>
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
              {activeTab === "dashboard" && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h1 className="text-3xl font-bold" style={{ color: "var(--ma3k-beige)" }}>لوحة التحكم</h1>
                    <p style={{ color: "var(--ma3k-beige-dark)" }}>مرحباً {user?.fullName}، إليك نظرة عامة</p>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4">
                    <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(245, 158, 11, 0.2)" }}>
                            <Briefcase className="w-6 h-6" style={{ color: "#f59e0b" }} />
                          </div>
                          <div>
                            <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>المشاريع النشطة</p>
                            <p className="text-2xl font-bold" style={{ color: "#f59e0b" }}>{activeProjects.length}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(34, 197, 94, 0.2)" }}>
                            <CheckCircle className="w-6 h-6" style={{ color: "#22c55e" }} />
                          </div>
                          <div>
                            <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>مكتملة</p>
                            <p className="text-2xl font-bold" style={{ color: "#22c55e" }}>{completedProjects.length}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(59, 130, 246, 0.2)" }}>
                            <Users className="w-6 h-6" style={{ color: "#3b82f6" }} />
                          </div>
                          <div>
                            <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>العملاء</p>
                            <p className="text-2xl font-bold" style={{ color: "#3b82f6" }}>{dashboardStats?.totalClients || clients.length}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(168, 85, 247, 0.2)" }}>
                            <AlertTriangle className="w-6 h-6" style={{ color: "#a855f7" }} />
                          </div>
                          <div>
                            <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>المهام المعلقة</p>
                            <p className="text-2xl font-bold" style={{ color: "#a855f7" }}>{pendingTasks.length}</p>
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
                        {activeProjects.slice(0, 5).map((project) => {
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
                                  <span className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>
                                    {project.daysRemaining} يوم متبقي
                                  </span>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedProject(project);
                                  setActiveTab("projects");
                                }}
                                style={{ borderColor: "#f59e0b", color: "#f59e0b" }}
                              >
                                عرض
                              </Button>
                            </div>
                          );
                        })}
                        {activeProjects.length === 0 && (
                          <p className="text-center py-4" style={{ color: "var(--ma3k-beige-dark)" }}>لا توجد مشاريع نشطة</p>
                        )}
                      </CardContent>
                    </Card>

                    <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                      <CardHeader>
                        <CardTitle style={{ color: "var(--ma3k-beige)" }}>المهام المعلقة</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {pendingTasks.slice(0, 5).map((task) => (
                          <div
                            key={task.id}
                            className="p-4 rounded-xl flex items-center justify-between"
                            style={{ background: "var(--ma3k-darker)" }}
                          >
                            <div className="flex-1">
                              <p className="font-medium" style={{ color: "var(--ma3k-beige)" }}>{task.title}</p>
                              <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>
                                {task.hoursRemaining} ساعة متبقية
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateTaskMutation.mutate({ id: task.id, isCompleted: true })}
                              style={{ borderColor: "#22c55e", color: "#22c55e" }}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        {pendingTasks.length === 0 && (
                          <p className="text-center py-4" style={{ color: "var(--ma3k-beige-dark)" }}>لا توجد مهام معلقة</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
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
                    <h1 className="text-3xl font-bold" style={{ color: "var(--ma3k-beige)" }}>المشاريع</h1>
                    <p style={{ color: "var(--ma3k-beige-dark)" }}>إدارة وتتبع جميع المشاريع</p>
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
                                  {project.domain && (
                                    <span className="text-sm" style={{ color: "var(--ma3k-teal)" }}>
                                      <Globe className="w-4 h-4 inline ml-1" />
                                      {project.domain}
                                    </span>
                                  )}
                                </div>
                                <div className="mt-4">
                                  <Progress value={statusInfo.progress} className="h-2" />
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Select
                                  value={project.status}
                                  onValueChange={(v) => updateProjectStatusMutation.mutate({ id: project.id, status: v })}
                                >
                                  <SelectTrigger className="w-40" style={{ background: "var(--ma3k-darker)", borderColor: "var(--ma3k-border)", color: "var(--ma3k-beige)" }}>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="analysis">التحليل</SelectItem>
                                    <SelectItem value="design">التصميم</SelectItem>
                                    <SelectItem value="backend">البرمجة</SelectItem>
                                    <SelectItem value="deployment">النشر</SelectItem>
                                    <SelectItem value="completed">مكتمل</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedProject(project);
                                    setActiveTab("chat");
                                  }}
                                  style={{ borderColor: "var(--ma3k-teal)", color: "var(--ma3k-teal)" }}
                                >
                                  <MessageSquare className="w-4 h-4 ml-2" />
                                  مراسلة
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                    {projects.length === 0 && (
                      <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                        <CardContent className="text-center py-16">
                          <Briefcase className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--ma3k-beige-dark)" }} />
                          <h3 className="text-xl font-bold mb-2" style={{ color: "var(--ma3k-beige)" }}>لا توجد مشاريع</h3>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "tasks" && (
                <motion.div
                  key="tasks"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h1 className="text-3xl font-bold" style={{ color: "var(--ma3k-beige)" }}>المهام</h1>
                    <p style={{ color: "var(--ma3k-beige-dark)" }}>إدارة مهامك ومتابعة تقدمك</p>
                  </div>

                  <div className="grid gap-4">
                    {tasks.map((task) => (
                      <Card key={task.id} style={{ background: "var(--ma3k-dark)", border: `1px solid ${task.isCompleted ? "#22c55e40" : "var(--ma3k-border)"}` }}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between gap-4 flex-wrap">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <h4 className="font-bold text-lg" style={{ color: "var(--ma3k-beige)" }}>{task.title}</h4>
                                {task.isCompleted && (
                                  <Badge style={{ background: "rgba(34, 197, 94, 0.2)", color: "#22c55e" }}>مكتمل</Badge>
                                )}
                              </div>
                              <p className="mt-1" style={{ color: "var(--ma3k-beige-dark)" }}>{task.description}</p>
                              <p className="text-sm mt-2" style={{ color: "var(--ma3k-beige-dark)" }}>
                                <Clock className="w-4 h-4 inline ml-1" />
                                {task.hoursRemaining} ساعة متبقية
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {!task.isCompleted && (
                                <Button
                                  onClick={() => updateTaskMutation.mutate({ id: task.id, isCompleted: true })}
                                  style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white" }}
                                >
                                  <Check className="w-4 h-4 ml-2" />
                                  إكمال
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {tasks.length === 0 && (
                      <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                        <CardContent className="text-center py-16">
                          <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--ma3k-beige-dark)" }} />
                          <h3 className="text-xl font-bold mb-2" style={{ color: "var(--ma3k-beige)" }}>لا توجد مهام</h3>
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
                    <h1 className="text-3xl font-bold" style={{ color: "var(--ma3k-beige)" }}>طلبات التعديل</h1>
                    <p style={{ color: "var(--ma3k-beige-dark)" }}>مراجعة وإدارة طلبات التعديل من العملاء</p>
                  </div>

                  <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                    <CardHeader>
                      <CardTitle style={{ color: "var(--ma3k-beige)" }}>اختر المشروع</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      {projects.map((project) => (
                        <Button
                          key={project.id}
                          variant={selectedProject?.id === project.id ? "default" : "outline"}
                          onClick={() => setSelectedProject(project)}
                          style={selectedProject?.id === project.id ? { background: "#f59e0b", color: "white" } : { borderColor: "var(--ma3k-border)", color: "var(--ma3k-beige)" }}
                        >
                          {project.projectName}
                        </Button>
                      ))}
                    </CardContent>
                  </Card>

                  {selectedProject && (
                    <div className="grid gap-4">
                      {modificationRequests.map((request) => {
                        const priorityInfo = priorityConfig[request.priority] || priorityConfig.medium;
                        const statusInfo = requestStatusConfig[request.status] || requestStatusConfig.pending;
                        return (
                          <Card key={request.id} style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between gap-4 flex-wrap">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <h4 className="font-bold text-lg" style={{ color: "var(--ma3k-beige)" }}>{request.title}</h4>
                                    <Badge style={{ background: priorityInfo.bgColor, color: priorityInfo.color }}>
                                      {priorityInfo.label}
                                    </Badge>
                                    <Badge style={{ background: statusInfo.bgColor, color: statusInfo.color }}>
                                      {statusInfo.label}
                                    </Badge>
                                  </div>
                                  <p style={{ color: "var(--ma3k-beige-dark)" }}>{request.description}</p>
                                  <p className="text-sm mt-2" style={{ color: "var(--ma3k-beige-dark)" }}>
                                    {new Date(request.createdAt).toLocaleDateString('ar-SA')}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  {request.status === "pending" && (
                                    <>
                                      <Button
                                        onClick={() => updateModificationStatusMutation.mutate({ id: request.id, status: "in_progress" })}
                                        style={{ background: "#3b82f6", color: "white" }}
                                      >
                                        بدء العمل
                                      </Button>
                                    </>
                                  )}
                                  {request.status === "in_progress" && (
                                    <Button
                                      onClick={() => updateModificationStatusMutation.mutate({ id: request.id, status: "completed" })}
                                      style={{ background: "#22c55e", color: "white" }}
                                    >
                                      إكمال
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                      {modificationRequests.length === 0 && (
                        <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                          <CardContent className="text-center py-16">
                            <Edit className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--ma3k-beige-dark)" }} />
                            <h3 className="text-xl font-bold mb-2" style={{ color: "var(--ma3k-beige)" }}>لا توجد طلبات تعديل</h3>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "features" && (
                <motion.div
                  key="features"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h1 className="text-3xl font-bold" style={{ color: "var(--ma3k-beige)" }}>طلبات الميزات</h1>
                    <p style={{ color: "var(--ma3k-beige-dark)" }}>مراجعة وتقييم طلبات الميزات من العملاء</p>
                  </div>

                  <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                    <CardHeader>
                      <CardTitle style={{ color: "var(--ma3k-beige)" }}>اختر المشروع</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      {projects.map((project) => (
                        <Button
                          key={project.id}
                          variant={selectedProject?.id === project.id ? "default" : "outline"}
                          onClick={() => setSelectedProject(project)}
                          style={selectedProject?.id === project.id ? { background: "#f59e0b", color: "white" } : { borderColor: "var(--ma3k-border)", color: "var(--ma3k-beige)" }}
                        >
                          {project.projectName}
                        </Button>
                      ))}
                    </CardContent>
                  </Card>

                  {selectedProject && (
                    <div className="grid gap-4">
                      {featureRequests.map((request) => {
                        const priorityInfo = priorityConfig[request.priority] || priorityConfig.medium;
                        const statusInfo = requestStatusConfig[request.status] || requestStatusConfig.pending;
                        return (
                          <Card key={request.id} style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between gap-4 flex-wrap">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <h4 className="font-bold text-lg" style={{ color: "var(--ma3k-beige)" }}>{request.title}</h4>
                                    <Badge style={{ background: priorityInfo.bgColor, color: priorityInfo.color }}>
                                      {priorityInfo.label}
                                    </Badge>
                                    <Badge style={{ background: statusInfo.bgColor, color: statusInfo.color }}>
                                      {statusInfo.label}
                                    </Badge>
                                  </div>
                                  <p style={{ color: "var(--ma3k-beige-dark)" }}>{request.description}</p>
                                  {request.estimatedCost && (
                                    <p className="text-sm mt-2" style={{ color: "var(--ma3k-green)" }}>
                                      التكلفة المقدرة: {request.estimatedCost} ر.س
                                    </p>
                                  )}
                                  <p className="text-sm mt-2" style={{ color: "var(--ma3k-beige-dark)" }}>
                                    {new Date(request.createdAt).toLocaleDateString('ar-SA')}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  {request.status === "pending" && (
                                    <>
                                      <Button
                                        onClick={() => updateFeatureStatusMutation.mutate({ id: request.id, status: "approved" })}
                                        style={{ background: "#22c55e", color: "white" }}
                                      >
                                        موافقة
                                      </Button>
                                      <Button
                                        onClick={() => updateFeatureStatusMutation.mutate({ id: request.id, status: "rejected" })}
                                        style={{ background: "#ef4444", color: "white" }}
                                      >
                                        رفض
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                      {featureRequests.length === 0 && (
                        <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                          <CardContent className="text-center py-16">
                            <Lightbulb className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--ma3k-beige-dark)" }} />
                            <h3 className="text-xl font-bold mb-2" style={{ color: "var(--ma3k-beige)" }}>لا توجد طلبات ميزات</h3>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "chat" && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h1 className="text-3xl font-bold" style={{ color: "var(--ma3k-beige)" }}>المراسلات</h1>
                    <p style={{ color: "var(--ma3k-beige-dark)" }}>تواصل مع العملاء</p>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-6">
                    <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                      <CardHeader>
                        <CardTitle style={{ color: "var(--ma3k-beige)" }}>المشاريع</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {projects.map((project) => (
                          <button
                            key={project.id}
                            onClick={() => setSelectedProject(project)}
                            className={`w-full p-3 rounded-xl text-right transition-all hover-elevate`}
                            style={{
                              background: selectedProject?.id === project.id ? "linear-gradient(135deg, #f59e0b, #d97706)" : "var(--ma3k-darker)",
                              color: selectedProject?.id === project.id ? "white" : "var(--ma3k-beige)"
                            }}
                          >
                            <div className="font-medium">{project.projectName}</div>
                            <div className="text-xs opacity-70">{statusConfig[project.status]?.label || project.status}</div>
                          </button>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="lg:col-span-2" style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                      {selectedProject ? (
                        <>
                          <CardHeader className="border-b" style={{ borderColor: "var(--ma3k-border)" }}>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback style={{ background: "#f59e0b", color: "white" }}>
                                  {selectedProject.projectName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle style={{ color: "var(--ma3k-beige)" }}>{selectedProject.projectName}</CardTitle>
                                <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>محادثة مع العميل</p>
                              </div>
                            </div>
                          </CardHeader>
                          <ScrollArea className="h-80 p-4">
                            {chatMessages.length === 0 ? (
                              <div className="text-center py-8">
                                <MessageSquare className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--ma3k-beige-dark)" }} />
                                <p style={{ color: "var(--ma3k-beige-dark)" }}>لا توجد رسائل بعد</p>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {chatMessages.map((msg) => (
                                  <div
                                    key={msg.id}
                                    className={`flex ${msg.senderType === "employee" ? "justify-end" : "justify-start"}`}
                                  >
                                    <div
                                      className="max-w-xs p-3 rounded-xl"
                                      style={{
                                        background: msg.senderType === "employee" ? "linear-gradient(135deg, #f59e0b, #d97706)" : "var(--ma3k-darker)",
                                        color: msg.senderType === "employee" ? "white" : "var(--ma3k-beige)"
                                      }}
                                    >
                                      <p className="text-sm font-medium mb-1">{msg.senderName}</p>
                                      <p>{msg.content}</p>
                                      <p className="text-xs opacity-70 mt-1">
                                        {new Date(msg.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                                <div ref={messagesEndRef} />
                              </div>
                            )}
                          </ScrollArea>
                          <div className="p-4 border-t flex gap-2" style={{ borderColor: "var(--ma3k-border)" }}>
                            <Input
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              placeholder="اكتب رسالتك..."
                              className="flex-1"
                              style={{ background: "var(--ma3k-darker)", borderColor: "var(--ma3k-border)", color: "var(--ma3k-beige)" }}
                              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                            />
                            <Button
                              onClick={handleSendMessage}
                              disabled={!newMessage.trim() || sendMessageMutation.isPending}
                              style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "white" }}
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          </div>
                        </>
                      ) : (
                        <CardContent className="text-center py-16">
                          <MessageSquare className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--ma3k-beige-dark)" }} />
                          <h3 className="text-xl font-bold mb-2" style={{ color: "var(--ma3k-beige)" }}>
                            اختر مشروعاً للمراسلة
                          </h3>
                        </CardContent>
                      )}
                    </Card>
                  </div>
                </motion.div>
              )}

              {activeTab === "files" && (
                <motion.div
                  key="files"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h1 className="text-3xl font-bold" style={{ color: "var(--ma3k-beige)" }}>ملفات المشاريع</h1>
                    <p style={{ color: "var(--ma3k-beige-dark)" }}>عرض وإدارة ملفات المشاريع</p>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-6">
                    <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                      <CardHeader>
                        <CardTitle style={{ color: "var(--ma3k-beige)" }}>المشاريع</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {projects.map((project) => (
                          <button
                            key={project.id}
                            onClick={() => setSelectedProject(project)}
                            className={`w-full p-3 rounded-xl text-right transition-all hover-elevate`}
                            style={{
                              background: selectedProject?.id === project.id ? "linear-gradient(135deg, #f59e0b, #d97706)" : "var(--ma3k-darker)",
                              color: selectedProject?.id === project.id ? "white" : "var(--ma3k-beige)"
                            }}
                          >
                            <div className="font-medium">{project.projectName}</div>
                          </button>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="lg:col-span-2" style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                      {selectedProject ? (
                        <>
                          <CardHeader>
                            <CardTitle style={{ color: "var(--ma3k-beige)" }}>ملفات {selectedProject.projectName}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {projectFiles.length === 0 ? (
                              <div className="text-center py-8">
                                <File className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--ma3k-beige-dark)" }} />
                                <p style={{ color: "var(--ma3k-beige-dark)" }}>لا توجد ملفات حتى الآن</p>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {projectFiles.map((file) => (
                                  <div
                                    key={file.id}
                                    className="flex items-center justify-between p-4 rounded-xl"
                                    style={{ background: "var(--ma3k-darker)" }}
                                  >
                                    <div className="flex items-center gap-3">
                                      <FileText className="w-8 h-8" style={{ color: "#f59e0b" }} />
                                      <div>
                                        <p className="font-medium" style={{ color: "var(--ma3k-beige)" }}>{file.fileName}</p>
                                        <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>
                                          {file.uploaderName} - {new Date(file.createdAt).toLocaleDateString('ar-SA')}
                                        </p>
                                      </div>
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => window.open(file.fileUrl, '_blank')}
                                      style={{ borderColor: "#f59e0b", color: "#f59e0b" }}
                                    >
                                      <Download className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </>
                      ) : (
                        <CardContent className="text-center py-16">
                          <File className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--ma3k-beige-dark)" }} />
                          <h3 className="text-xl font-bold mb-2" style={{ color: "var(--ma3k-beige)" }}>
                            اختر مشروعاً لعرض ملفاته
                          </h3>
                        </CardContent>
                      )}
                    </Card>
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
                    <h1 className="text-3xl font-bold" style={{ color: "var(--ma3k-beige)" }}>العملاء</h1>
                    <p style={{ color: "var(--ma3k-beige-dark)" }}>قائمة العملاء المسجلين</p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {clients.map((client) => (
                      <Card key={client.id} style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarFallback style={{ background: "var(--ma3k-teal)", color: "white" }}>
                                {client.fullName?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-bold" style={{ color: "var(--ma3k-beige)" }}>{client.fullName}</p>
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
                    <p style={{ color: "var(--ma3k-beige-dark)" }}>إدارة حسابك وتفضيلاتك</p>
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
                          <p className="font-medium" style={{ color: "var(--ma3k-beige)" }}>{user?.role || "موظف"}</p>
                        </div>
                        <div className="p-4 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                          <p className="text-sm mb-1" style={{ color: "var(--ma3k-beige-dark)" }}>البريد الإلكتروني</p>
                          <p className="font-medium" style={{ color: "var(--ma3k-beige)" }}>{user?.email}</p>
                        </div>
                        <div className="p-4 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                          <p className="text-sm mb-1" style={{ color: "var(--ma3k-beige-dark)" }}>رقم الهاتف</p>
                          <p className="font-medium" style={{ color: "var(--ma3k-beige)" }}>{user?.phone || "غير محدد"}</p>
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
