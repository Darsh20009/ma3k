import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Briefcase,
  Globe,
  Calendar,
  Mail,
  Wrench,
  Edit,
  MessageCircle,
  CheckCircle,
  Clock,
  Rocket,
  LogOut,
  Bell,
  FileText,
  CreditCard,
  Settings,
  Search,
  Code2,
  Palette,
  Server,
  Upload,
  Star,
  TrendingUp,
  Download,
  Send,
  Paperclip,
  Plus,
  AlertCircle,
  Lightbulb,
  File,
  Image,
  Trash2,
  Database,
  Key,
  HardDrive,
  Link2,
  Copy,
  ExternalLink,
  Eye,
  EyeOff
} from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";

type Project = {
  id: string;
  projectName: string;
  websiteIdea: string;
  status: "analysis" | "design" | "backend" | "deployment" | "completed";
  daysRemaining: number;
  targetDate?: string;
  domain?: string;
  email?: string;
  toolsUsed?: string[];
  assignedEmployees?: string[];
  createdAt?: string;
};

type Order = {
  id: string;
  orderNumber: string;
  serviceName: string;
  price: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
};

type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: string;
  senderName: string;
  content: string;
  messageType: string;
  fileUrl?: string;
  fileName?: string;
  isRead: boolean;
  createdAt: string;
};

type ChatConversation = {
  id: string;
  projectId: string;
  clientId: string;
  employeeId?: string;
  type: string;
  status: string;
  lastMessageAt: string;
};

type ModificationRequest = {
  id: string;
  projectId: string;
  clientId: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  assignedTo?: string;
  attachments?: string[];
  completedAt?: string;
  createdAt: string;
};

type FeatureRequest = {
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
};

type ProjectFile = {
  id: string;
  projectId: string;
  uploadedBy: string;
  uploaderType: string;
  uploaderName: string;
  fileName: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: number;
  description?: string;
  createdAt: string;
};

const statusConfig = {
  analysis: { 
    label: "التحليل", 
    color: "var(--ma3k-teal)", 
    bgColor: "rgba(0, 128, 128, 0.2)",
    icon: Search,
    progress: 20,
    description: "جاري دراسة متطلبات المشروع"
  },
  design: { 
    label: "التصميم", 
    color: "#a855f7", 
    bgColor: "rgba(168, 85, 247, 0.2)",
    icon: Palette,
    progress: 40,
    description: "العمل على التصميم والواجهات"
  },
  backend: { 
    label: "البرمجة", 
    color: "#eab308", 
    bgColor: "rgba(234, 179, 8, 0.2)",
    icon: Code2,
    progress: 60,
    description: "تطوير النظام والوظائف"
  },
  deployment: { 
    label: "النشر", 
    color: "#f97316", 
    bgColor: "rgba(249, 115, 22, 0.2)",
    icon: Upload,
    progress: 80,
    description: "إعداد الموقع للإطلاق"
  },
  completed: { 
    label: "مكتمل", 
    color: "var(--ma3k-green)", 
    bgColor: "rgba(76, 175, 80, 0.2)",
    icon: CheckCircle,
    progress: 100,
    description: "تم إنجاز المشروع بنجاح"
  }
};

const priorityConfig = {
  low: { label: "منخفضة", color: "#22c55e", bgColor: "rgba(34, 197, 94, 0.2)" },
  medium: { label: "متوسطة", color: "#eab308", bgColor: "rgba(234, 179, 8, 0.2)" },
  high: { label: "عالية", color: "#f97316", bgColor: "rgba(249, 115, 22, 0.2)" },
  urgent: { label: "عاجلة", color: "#ef4444", bgColor: "rgba(239, 68, 68, 0.2)" }
};

const requestStatusConfig = {
  pending: { label: "قيد الانتظار", color: "#eab308", bgColor: "rgba(234, 179, 8, 0.2)" },
  in_progress: { label: "قيد التنفيذ", color: "#3b82f6", bgColor: "rgba(59, 130, 246, 0.2)" },
  completed: { label: "مكتمل", color: "#22c55e", bgColor: "rgba(34, 197, 94, 0.2)" },
  rejected: { label: "مرفوض", color: "#ef4444", bgColor: "rgba(239, 68, 68, 0.2)" },
  approved: { label: "تمت الموافقة", color: "#22c55e", bgColor: "rgba(34, 197, 94, 0.2)" }
};

const stages = ["analysis", "design", "backend", "deployment", "completed"] as const;

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("projects");
  const [editingIdea, setEditingIdea] = useState<string | null>(null);
  const [newIdea, setNewIdea] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showModificationDialog, setShowModificationDialog] = useState(false);
  const [showFeatureDialog, setShowFeatureDialog] = useState(false);
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [modificationForm, setModificationForm] = useState({ title: "", description: "", priority: "medium" });
  const [featureForm, setFeatureForm] = useState({ title: "", description: "", category: "functionality", priority: "medium" });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, isLoading, isClient, logout } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isLoading) return;
    
    if (!isAuthenticated || !isClient()) {
      toast({
        title: "يجب تسجيل الدخول",
        description: "يرجى تسجيل الدخول كعميل للوصول إلى هذه الصفحة",
        variant: "destructive"
      });
      setLocation("/login");
    }
  }, [isAuthenticated, isClient, isLoading]);

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: [`/api/clients/${user?.id}/projects`],
    enabled: !!user?.id && isClient(),
  });

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: [`/api/clients/${user?.id}/orders`],
    enabled: !!user?.id && isClient(),
  });

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: [`/api/notifications/client/${user?.id}`],
    enabled: !!user?.id && isClient(),
  });

  const { data: conversations = [] } = useQuery<ChatConversation[]>({
    queryKey: ['/api/chat/conversations/client', user?.id],
    enabled: !!user?.id && isClient(),
  });

  const { data: modificationRequests = [] } = useQuery<ModificationRequest[]>({
    queryKey: ['/api/modification-requests/client', user?.id],
    enabled: !!user?.id && isClient(),
  });

  const { data: featureRequests = [] } = useQuery<FeatureRequest[]>({
    queryKey: ['/api/feature-requests/client', user?.id],
    enabled: !!user?.id && isClient(),
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

  const updateIdeaMutation = useMutation({
    mutationFn: async ({ id, websiteIdea }: { id: string; websiteIdea: string }) => {
      return await apiRequest("PATCH", `/api/projects/${id}`, { websiteIdea });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/clients/${user?.id}/projects`] });
      toast({
        title: "تم التحديث بنجاح",
        description: "تم إرسال التعديل للفريق التقني",
      });
      setEditingIdea(null);
    }
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { conversationId: string; content: string }) => {
      return await apiRequest("POST", "/api/chat/messages", {
        ...data,
        senderId: user?.id,
        senderType: "client",
        senderName: user?.fullName || "عميل",
        messageType: "text"
      });
    },
    onSuccess: () => {
      setNewMessage("");
      refetchMessages();
      toast({ title: "تم إرسال الرسالة" });
    }
  });

  const createConversationMutation = useMutation({
    mutationFn: async (projectId: string) => {
      return await apiRequest("POST", "/api/chat/conversations", {
        projectId,
        clientId: user?.id,
        type: "project"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations/client', user?.id] });
    }
  });

  const createModificationMutation = useMutation({
    mutationFn: async (data: { projectId: string; title: string; description: string; priority: string }) => {
      return await apiRequest("POST", "/api/modification-requests", {
        ...data,
        clientId: user?.id
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/modification-requests/client', user?.id] });
      setShowModificationDialog(false);
      setModificationForm({ title: "", description: "", priority: "medium" });
      toast({ title: "تم إرسال طلب التعديل بنجاح" });
    }
  });

  const createFeatureMutation = useMutation({
    mutationFn: async (data: { projectId: string; title: string; description: string; category: string; priority: string }) => {
      return await apiRequest("POST", "/api/feature-requests", {
        ...data,
        clientId: user?.id
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/feature-requests/client', user?.id] });
      setShowFeatureDialog(false);
      setFeatureForm({ title: "", description: "", category: "functionality", priority: "medium" });
      toast({ title: "تم إرسال طلب الميزة بنجاح" });
    }
  });

  const handleUpdateIdea = (project: Project) => {
    if (!newIdea.trim()) return;
    updateIdeaMutation.mutate({ id: project.id, websiteIdea: newIdea });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedProject) return;
    
    let conv = conversations.find(c => c.projectId === selectedProject.id);
    
    if (!conv) {
      try {
        const response = await apiRequest("POST", "/api/chat/conversations", {
          projectId: selectedProject.id,
          clientId: user?.id,
          type: "project"
        });
        const newConv = await response.json() as ChatConversation;
        queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations/client', user?.id] });
        conv = newConv;
      } catch (error) {
        toast({ title: "خطأ في إنشاء المحادثة", variant: "destructive" });
        return;
      }
    }
    
    if (conv) {
      sendMessageMutation.mutate({ conversationId: conv.id, content: newMessage });
    }
  };

  const handleCreateModification = () => {
    if (!selectedProject || !modificationForm.title || !modificationForm.description) return;
    createModificationMutation.mutate({
      projectId: selectedProject.id,
      ...modificationForm
    });
  };

  const handleCreateFeature = () => {
    if (!selectedProject || !featureForm.title || !featureForm.description) return;
    createFeatureMutation.mutate({
      projectId: selectedProject.id,
      ...featureForm
    });
  };

  const getStageIndex = (status: string) => stages.indexOf(status as typeof stages[number]);

  const getDaysColor = (days: number) => {
    if (days <= 2) return "#ef4444";
    if (days <= 5) return "#eab308";
    return "var(--ma3k-green)";
  };

  const totalSpent = orders.reduce((sum, order) => 
    order.paymentStatus === "completed" ? sum + order.price : sum, 0
  );

  const activeProjects = projects.filter(p => p.status !== "completed").length;
  const completedProjects = projects.filter(p => p.status === "completed").length;
  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

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
                    <AvatarFallback style={{ background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))", color: "white", fontSize: "1.5rem" }}>
                      {user?.fullName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold" style={{ color: "var(--ma3k-beige)" }}>
                    {user?.fullName || "العميل"}
                  </h2>
                  <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>
                    {user?.email}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="text-center p-3 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                    <div className="text-2xl font-bold" style={{ color: "var(--ma3k-green)" }}>{activeProjects}</div>
                    <div className="text-xs" style={{ color: "var(--ma3k-beige-dark)" }}>مشاريع نشطة</div>
                  </div>
                  <div className="text-center p-3 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                    <div className="text-2xl font-bold" style={{ color: "var(--ma3k-teal)" }}>{completedProjects}</div>
                    <div className="text-xs" style={{ color: "var(--ma3k-beige-dark)" }}>مكتملة</div>
                  </div>
                </div>

                <nav className="space-y-2">
                  {[
                    { id: "projects", label: "مشاريعي", icon: Briefcase },
                    { id: "chat", label: "المراسلات", icon: MessageCircle },
                    { id: "requests", label: "طلبات التعديل", icon: Edit },
                    { id: "features", label: "طلب ميزات", icon: Lightbulb },
                    { id: "files", label: "ملفات المشروع", icon: File },
                    { id: "orders", label: "طلباتي", icon: CreditCard },
                    { id: "myinfo", label: "بياناتي", icon: Database },
                    { id: "notifications", label: "الإشعارات", icon: Bell, badge: unreadNotifications },
                    { id: "settings", label: "الإعدادات", icon: Settings },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover-elevate`}
                      style={{
                        background: activeTab === item.id ? "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))" : "transparent",
                        color: activeTab === item.id ? "white" : "var(--ma3k-beige)"
                      }}
                      data-testid={`nav-${item.id}`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="flex-1 text-right">{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <Badge className="text-xs" style={{ background: "#ef4444", color: "white" }}>
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  ))}
                </nav>

                <Button
                  variant="outline"
                  className="w-full mt-6"
                  onClick={() => {
                    logout();
                    setLocation("/login");
                  }}
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
              {activeTab === "projects" && (
                <motion.div
                  key="projects"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h1 className="text-3xl font-bold" style={{ color: "var(--ma3k-beige)" }}>مشاريعي</h1>
                      <p style={{ color: "var(--ma3k-beige-dark)" }}>تتبع تقدم مشاريعك التطويرية</p>
                    </div>
                    <Button
                      onClick={() => setLocation("/services")}
                      style={{ background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))", color: "white" }}
                      data-testid="button-new-project"
                    >
                      <Rocket className="w-4 h-4 ml-2" />
                      مشروع جديد
                    </Button>
                  </div>

                  {projects.length === 0 ? (
                    <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                      <CardContent className="text-center py-16">
                        <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: "var(--ma3k-darker)" }}>
                          <Briefcase className="w-10 h-10" style={{ color: "var(--ma3k-beige-dark)" }} />
                        </div>
                        <h3 className="text-xl font-bold mb-2" style={{ color: "var(--ma3k-beige)" }}>
                          لا توجد مشاريع حالياً
                        </h3>
                        <p className="mb-6" style={{ color: "var(--ma3k-beige-dark)" }}>
                          ابدأ رحلتك الرقمية معنا اليوم
                        </p>
                        <Button
                          onClick={() => setLocation("/services")}
                          style={{ background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))", color: "white" }}
                        >
                          <Rocket className="w-4 h-4 ml-2" />
                          استكشف خدماتنا
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-6">
                      {projects.map((project, idx) => {
                        const statusInfo = statusConfig[project.status];
                        const StatusIcon = statusInfo.icon;
                        const currentStageIndex = getStageIndex(project.status);

                        return (
                          <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            <Card 
                              className="overflow-hidden"
                              style={{ 
                                background: "var(--ma3k-dark)", 
                                border: "2px solid var(--ma3k-border)" 
                              }}
                            >
                              <CardHeader className="pb-4">
                                <div className="flex items-start justify-between gap-4 flex-wrap">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                      <div 
                                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                                        style={{ background: statusInfo.bgColor }}
                                      >
                                        <StatusIcon className="w-6 h-6" style={{ color: statusInfo.color }} />
                                      </div>
                                      <div>
                                        <CardTitle style={{ color: "var(--ma3k-beige)" }}>
                                          {project.projectName}
                                        </CardTitle>
                                        <Badge 
                                          style={{ 
                                            background: statusInfo.bgColor, 
                                            color: statusInfo.color,
                                            border: `1px solid ${statusInfo.color}40`
                                          }}
                                        >
                                          {statusInfo.label}
                                        </Badge>
                                      </div>
                                    </div>
                                    <CardDescription style={{ color: "var(--ma3k-beige-dark)" }}>
                                      {project.websiteIdea}
                                    </CardDescription>
                                  </div>
                                  
                                  <div className="text-left">
                                    <div className="text-sm mb-1" style={{ color: "var(--ma3k-beige-dark)" }}>
                                      المتبقي
                                    </div>
                                    <div 
                                      className="text-2xl font-bold"
                                      style={{ color: getDaysColor(project.daysRemaining) }}
                                    >
                                      {project.daysRemaining} يوم
                                    </div>
                                  </div>
                                </div>
                              </CardHeader>

                              <CardContent className="space-y-6">
                                <div>
                                  <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>
                                      التقدم العام
                                    </span>
                                    <span className="font-bold" style={{ color: statusInfo.color }}>
                                      {statusInfo.progress}%
                                    </span>
                                  </div>
                                  <Progress 
                                    value={statusInfo.progress} 
                                    className="h-3"
                                    style={{ 
                                      background: "var(--ma3k-darker)"
                                    }}
                                  />
                                </div>

                                <div className="relative">
                                  <div className="flex items-center justify-between relative">
                                    {stages.map((stage, i) => {
                                      const stageInfo = statusConfig[stage];
                                      const StageIcon = stageInfo.icon;
                                      const isActive = i === currentStageIndex;
                                      const isCompleted = i < currentStageIndex;

                                      return (
                                        <div key={stage} className="flex flex-col items-center relative z-10">
                                          <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                              isActive ? "ring-4 ring-offset-2 ring-opacity-40" : ""
                                            }`}
                                            style={{
                                              background: isCompleted || isActive ? stageInfo.color : "var(--ma3k-darker)",
                                              color: isCompleted || isActive ? "white" : "var(--ma3k-beige-dark)"
                                            }}
                                          >
                                            {isCompleted ? (
                                              <CheckCircle className="w-5 h-5" />
                                            ) : (
                                              <StageIcon className="w-5 h-5" />
                                            )}
                                          </div>
                                          <span 
                                            className="text-xs mt-2 text-center hidden sm:block"
                                            style={{ 
                                              color: isActive ? stageInfo.color : "var(--ma3k-beige-dark)" 
                                            }}
                                          >
                                            {stageInfo.label}
                                          </span>
                                        </div>
                                      );
                                    })}

                                    <div 
                                      className="absolute top-5 left-0 right-0 h-0.5 -z-0"
                                      style={{ background: "var(--ma3k-border)" }}
                                    />
                                    <div 
                                      className="absolute top-5 left-0 h-0.5 -z-0 transition-all duration-500"
                                      style={{ 
                                        background: statusInfo.color,
                                        width: `${(currentStageIndex / (stages.length - 1)) * 100}%`
                                      }}
                                    />
                                  </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-4">
                                  {project.domain && (
                                    <div className="p-4 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                                      <div className="flex items-center gap-2 mb-2">
                                        <Globe className="w-4 h-4" style={{ color: "var(--ma3k-teal)" }} />
                                        <span className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>الدومين</span>
                                      </div>
                                      <p className="font-medium text-sm truncate" style={{ color: "var(--ma3k-green)" }}>
                                        {project.domain}
                                      </p>
                                    </div>
                                  )}

                                  {project.email && (
                                    <div className="p-4 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                                      <div className="flex items-center gap-2 mb-2">
                                        <Mail className="w-4 h-4" style={{ color: "var(--ma3k-teal)" }} />
                                        <span className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>البريد</span>
                                      </div>
                                      <p className="font-medium text-sm truncate" style={{ color: "var(--ma3k-beige)" }}>
                                        {project.email}
                                      </p>
                                    </div>
                                  )}

                                  {project.targetDate && (
                                    <div className="p-4 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                                      <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="w-4 h-4" style={{ color: "var(--ma3k-teal)" }} />
                                        <span className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>الموعد المتوقع</span>
                                      </div>
                                      <p className="font-medium text-sm" style={{ color: "var(--ma3k-beige)" }}>
                                        {new Date(project.targetDate).toLocaleDateString('ar-SA')}
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {project.toolsUsed && project.toolsUsed.length > 0 && (
                                  <div>
                                    <div className="flex items-center gap-2 mb-3">
                                      <Wrench className="w-4 h-4" style={{ color: "var(--ma3k-teal)" }} />
                                      <span className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>
                                        التقنيات المستخدمة
                                      </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {project.toolsUsed.map((tool, i) => (
                                        <Badge 
                                          key={i} 
                                          variant="outline"
                                          style={{ 
                                            borderColor: "var(--ma3k-border)", 
                                            color: "var(--ma3k-beige)" 
                                          }}
                                        >
                                          {tool}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                <div className="flex flex-wrap gap-3 pt-4 border-t" style={{ borderColor: "var(--ma3k-border)" }}>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedProject(project);
                                      setActiveTab("chat");
                                    }}
                                    style={{ borderColor: "var(--ma3k-teal)", color: "var(--ma3k-teal)" }}
                                    data-testid={`button-chat-${project.id}`}
                                  >
                                    <MessageCircle className="w-4 h-4 ml-2" />
                                    المراسلات
                                  </Button>

                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedProject(project);
                                      setShowModificationDialog(true);
                                    }}
                                    style={{ borderColor: "#f97316", color: "#f97316" }}
                                    data-testid={`button-modification-${project.id}`}
                                  >
                                    <Edit className="w-4 h-4 ml-2" />
                                    طلب تعديل
                                  </Button>

                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedProject(project);
                                      setShowFeatureDialog(true);
                                    }}
                                    style={{ borderColor: "#a855f7", color: "#a855f7" }}
                                    data-testid={`button-feature-${project.id}`}
                                  >
                                    <Lightbulb className="w-4 h-4 ml-2" />
                                    طلب ميزة
                                  </Button>

                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedProject(project);
                                      setActiveTab("files");
                                    }}
                                    style={{ borderColor: "var(--ma3k-green)", color: "var(--ma3k-green)" }}
                                    data-testid={`button-files-${project.id}`}
                                  >
                                    <File className="w-4 h-4 ml-2" />
                                    الملفات
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
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
                    <p style={{ color: "var(--ma3k-beige-dark)" }}>تواصل مع فريق التطوير</p>
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
                            className={`w-full p-3 rounded-xl text-right transition-all hover-elevate ${selectedProject?.id === project.id ? "" : ""}`}
                            style={{
                              background: selectedProject?.id === project.id ? "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))" : "var(--ma3k-darker)",
                              color: selectedProject?.id === project.id ? "white" : "var(--ma3k-beige)"
                            }}
                            data-testid={`chat-project-${project.id}`}
                          >
                            <div className="font-medium">{project.projectName}</div>
                            <div className="text-xs opacity-70">{statusConfig[project.status].label}</div>
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
                                <AvatarFallback style={{ background: "var(--ma3k-teal)", color: "white" }}>
                                  {selectedProject.projectName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle style={{ color: "var(--ma3k-beige)" }}>{selectedProject.projectName}</CardTitle>
                                <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>محادثة مع فريق التطوير</p>
                              </div>
                            </div>
                          </CardHeader>
                          <ScrollArea className="h-80 p-4">
                            {chatMessages.length === 0 ? (
                              <div className="text-center py-8">
                                <MessageCircle className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--ma3k-beige-dark)" }} />
                                <p style={{ color: "var(--ma3k-beige-dark)" }}>لا توجد رسائل بعد. ابدأ المحادثة!</p>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {chatMessages.map((msg) => (
                                  <div
                                    key={msg.id}
                                    className={`flex ${msg.senderType === "client" ? "justify-end" : "justify-start"}`}
                                  >
                                    <div
                                      className="max-w-xs p-3 rounded-xl"
                                      style={{
                                        background: msg.senderType === "client" ? "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))" : "var(--ma3k-darker)",
                                        color: msg.senderType === "client" ? "white" : "var(--ma3k-beige)"
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
                              data-testid="input-chat-message"
                            />
                            <Button
                              onClick={handleSendMessage}
                              disabled={!newMessage.trim() || sendMessageMutation.isPending}
                              style={{ background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))", color: "white" }}
                              data-testid="button-send-message"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          </div>
                        </>
                      ) : (
                        <CardContent className="text-center py-16">
                          <MessageCircle className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--ma3k-beige-dark)" }} />
                          <h3 className="text-xl font-bold mb-2" style={{ color: "var(--ma3k-beige)" }}>
                            اختر مشروعاً للمراسلة
                          </h3>
                        </CardContent>
                      )}
                    </Card>
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
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h1 className="text-3xl font-bold" style={{ color: "var(--ma3k-beige)" }}>طلبات التعديل</h1>
                      <p style={{ color: "var(--ma3k-beige-dark)" }}>تتبع طلبات التعديل على مشاريعك</p>
                    </div>
                    {projects.length > 0 && (
                      <Button
                        onClick={() => {
                          setSelectedProject(projects[0]);
                          setShowModificationDialog(true);
                        }}
                        style={{ background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))", color: "white" }}
                        data-testid="button-new-modification"
                      >
                        <Plus className="w-4 h-4 ml-2" />
                        طلب جديد
                      </Button>
                    )}
                  </div>

                  {modificationRequests.length === 0 ? (
                    <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                      <CardContent className="text-center py-16">
                        <Edit className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--ma3k-beige-dark)" }} />
                        <h3 className="text-xl font-bold mb-2" style={{ color: "var(--ma3k-beige)" }}>
                          لا توجد طلبات تعديل
                        </h3>
                        <p style={{ color: "var(--ma3k-beige-dark)" }}>
                          يمكنك إرسال طلب تعديل من صفحة المشروع
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {modificationRequests.map((request) => {
                        const priorityInfo = priorityConfig[request.priority as keyof typeof priorityConfig] || priorityConfig.medium;
                        const statusInfo = requestStatusConfig[request.status as keyof typeof requestStatusConfig] || requestStatusConfig.pending;
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
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
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
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h1 className="text-3xl font-bold" style={{ color: "var(--ma3k-beige)" }}>طلبات الميزات</h1>
                      <p style={{ color: "var(--ma3k-beige-dark)" }}>اقترح ميزات جديدة لمشاريعك</p>
                    </div>
                    {projects.length > 0 && (
                      <Button
                        onClick={() => {
                          setSelectedProject(projects[0]);
                          setShowFeatureDialog(true);
                        }}
                        style={{ background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))", color: "white" }}
                        data-testid="button-new-feature"
                      >
                        <Plus className="w-4 h-4 ml-2" />
                        طلب ميزة جديدة
                      </Button>
                    )}
                  </div>

                  {featureRequests.length === 0 ? (
                    <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                      <CardContent className="text-center py-16">
                        <Lightbulb className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--ma3k-beige-dark)" }} />
                        <h3 className="text-xl font-bold mb-2" style={{ color: "var(--ma3k-beige)" }}>
                          لا توجد طلبات ميزات
                        </h3>
                        <p style={{ color: "var(--ma3k-beige-dark)" }}>
                          يمكنك اقتراح ميزات جديدة لمشاريعك
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {featureRequests.map((request) => {
                        const priorityInfo = priorityConfig[request.priority as keyof typeof priorityConfig] || priorityConfig.medium;
                        const statusInfo = requestStatusConfig[request.status as keyof typeof requestStatusConfig] || requestStatusConfig.pending;
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
                                      التكلفة المتوقعة: {request.estimatedCost} ر.س
                                    </p>
                                  )}
                                  {request.adminNotes && (
                                    <p className="text-sm mt-2 p-2 rounded" style={{ background: "var(--ma3k-darker)", color: "var(--ma3k-beige)" }}>
                                      ملاحظات: {request.adminNotes}
                                    </p>
                                  )}
                                  <p className="text-sm mt-2" style={{ color: "var(--ma3k-beige-dark)" }}>
                                    {new Date(request.createdAt).toLocaleDateString('ar-SA')}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
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
                    <h1 className="text-3xl font-bold" style={{ color: "var(--ma3k-beige)" }}>ملفات المشروع</h1>
                    <p style={{ color: "var(--ma3k-beige-dark)" }}>عرض وتحميل ملفات مشاريعك</p>
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
                              background: selectedProject?.id === project.id ? "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))" : "var(--ma3k-darker)",
                              color: selectedProject?.id === project.id ? "white" : "var(--ma3k-beige)"
                            }}
                            data-testid={`files-project-${project.id}`}
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
                                      {file.fileType === "image" ? (
                                        <Image className="w-8 h-8" style={{ color: "var(--ma3k-teal)" }} />
                                      ) : (
                                        <FileText className="w-8 h-8" style={{ color: "var(--ma3k-teal)" }} />
                                      )}
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
                                      style={{ borderColor: "var(--ma3k-teal)", color: "var(--ma3k-teal)" }}
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

              {activeTab === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h1 className="text-3xl font-bold" style={{ color: "var(--ma3k-beige)" }}>طلباتي</h1>
                    <p style={{ color: "var(--ma3k-beige-dark)" }}>سجل جميع طلباتك ومدفوعاتك</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(76, 175, 80, 0.2)" }}>
                            <TrendingUp className="w-6 h-6" style={{ color: "var(--ma3k-green)" }} />
                          </div>
                          <div>
                            <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>إجمالي المدفوعات</p>
                            <p className="text-2xl font-bold" style={{ color: "var(--ma3k-green)" }}>
                              {totalSpent.toLocaleString()} ر.س
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(0, 128, 128, 0.2)" }}>
                            <FileText className="w-6 h-6" style={{ color: "var(--ma3k-teal)" }} />
                          </div>
                          <div>
                            <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>عدد الطلبات</p>
                            <p className="text-2xl font-bold" style={{ color: "var(--ma3k-teal)" }}>
                              {orders.length}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(168, 85, 247, 0.2)" }}>
                            <Star className="w-6 h-6" style={{ color: "#a855f7" }} />
                          </div>
                          <div>
                            <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>التقييم</p>
                            <p className="text-2xl font-bold" style={{ color: "#a855f7" }}>
                              عميل مميز
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {orders.length === 0 ? (
                    <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                      <CardContent className="text-center py-16">
                        <CreditCard className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--ma3k-beige-dark)" }} />
                        <h3 className="text-xl font-bold mb-2" style={{ color: "var(--ma3k-beige)" }}>
                          لا توجد طلبات
                        </h3>
                        <p style={{ color: "var(--ma3k-beige-dark)" }}>
                          ستظهر هنا جميع طلباتك ومدفوعاتك
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <Card key={order.id} style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "var(--ma3k-darker)" }}>
                                  <FileText className="w-6 h-6" style={{ color: "var(--ma3k-teal)" }} />
                                </div>
                                <div>
                                  <h4 className="font-bold" style={{ color: "var(--ma3k-beige)" }}>{order.serviceName}</h4>
                                  <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>
                                    {order.orderNumber} - {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-left">
                                  <p className="text-xl font-bold" style={{ color: "var(--ma3k-green)" }}>
                                    {order.price.toLocaleString()} ر.س
                                  </p>
                                  <Badge 
                                    style={{ 
                                      background: order.paymentStatus === "completed" ? "rgba(76, 175, 80, 0.2)" : "rgba(234, 179, 8, 0.2)",
                                      color: order.paymentStatus === "completed" ? "var(--ma3k-green)" : "#eab308"
                                    }}
                                  >
                                    {order.paymentStatus === "completed" ? "مدفوع" : "قيد الانتظار"}
                                  </Badge>
                                </div>
                                {order.paymentStatus === "completed" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(`/api/invoices/${order.id}/pdf`, '_blank')}
                                    style={{ borderColor: "var(--ma3k-teal)", color: "var(--ma3k-teal)" }}
                                    data-testid={`button-download-invoice-${order.id}`}
                                  >
                                    <Download className="w-4 h-4 ml-2" />
                                    تحميل الفاتورة
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "notifications" && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h1 className="text-3xl font-bold" style={{ color: "var(--ma3k-beige)" }}>الإشعارات</h1>
                    <p style={{ color: "var(--ma3k-beige-dark)" }}>آخر التحديثات والإشعارات</p>
                  </div>

                  {notifications.length === 0 ? (
                    <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                      <CardContent className="text-center py-16">
                        <Bell className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--ma3k-beige-dark)" }} />
                        <h3 className="text-xl font-bold mb-2" style={{ color: "var(--ma3k-beige)" }}>
                          لا توجد إشعارات
                        </h3>
                        <p style={{ color: "var(--ma3k-beige-dark)" }}>
                          ستصلك الإشعارات هنا عند وجود تحديثات
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {notifications.map((notification) => (
                        <Card 
                          key={notification.id} 
                          style={{ 
                            background: notification.isRead ? "var(--ma3k-dark)" : "var(--ma3k-darker)",
                            border: `1px solid ${notification.isRead ? "var(--ma3k-border)" : "var(--ma3k-teal)"}`
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{ background: "rgba(0, 128, 128, 0.2)" }}
                              >
                                <Bell className="w-5 h-5" style={{ color: "var(--ma3k-teal)" }} />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold" style={{ color: "var(--ma3k-beige)" }}>
                                  {notification.title}
                                </h4>
                                <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>
                                  {notification.message}
                                </p>
                                <p className="text-xs mt-2" style={{ color: "var(--ma3k-beige-dark)" }}>
                                  {new Date(notification.createdAt).toLocaleDateString('ar-SA')}
                                </p>
                              </div>
                              {!notification.isRead && (
                                <div className="w-2 h-2 rounded-full" style={{ background: "var(--ma3k-teal)" }} />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "myinfo" && (
                <motion.div
                  key="myinfo"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h1 className="text-3xl font-bold" style={{ color: "var(--ma3k-beige)" }}>بياناتي</h1>
                    <p style={{ color: "var(--ma3k-beige-dark)" }}>معلومات مشاريعك والخدمات التقنية</p>
                  </div>

                  {projects.length === 0 ? (
                    <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                      <CardContent className="text-center py-16">
                        <Database className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--ma3k-beige-dark)" }} />
                        <h3 className="text-xl font-bold mb-2" style={{ color: "var(--ma3k-beige)" }}>
                          لا توجد مشاريع
                        </h3>
                        <p style={{ color: "var(--ma3k-beige-dark)" }}>
                          ابدأ مشروعك الأول لعرض بياناتك هنا
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-6">
                      {projects.map((project) => (
                        <Card 
                          key={project.id} 
                          style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}
                        >
                          <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-12 h-12 rounded-xl flex items-center justify-center"
                                style={{ background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))" }}
                              >
                                <Globe className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <CardTitle style={{ color: "var(--ma3k-beige)" }}>
                                  {project.projectName}
                                </CardTitle>
                                <CardDescription style={{ color: "var(--ma3k-beige-dark)" }}>
                                  {project.websiteIdea?.slice(0, 60)}...
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="p-4 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                                <div className="flex items-center gap-2 mb-2">
                                  <Link2 className="w-4 h-4" style={{ color: "var(--ma3k-teal)" }} />
                                  <span className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>الدومين</span>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                  <p className="font-medium" style={{ color: "var(--ma3k-beige)" }}>
                                    {project.domain || "قيد الإعداد"}
                                  </p>
                                  {project.domain && (
                                    <div className="flex gap-1">
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => navigator.clipboard.writeText(project.domain || "")}
                                        data-testid={`copy-domain-${project.id}`}
                                      >
                                        <Copy className="w-4 h-4" style={{ color: "var(--ma3k-teal)" }} />
                                      </Button>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => window.open(`https://${project.domain}`, "_blank")}
                                        data-testid={`open-domain-${project.id}`}
                                      >
                                        <ExternalLink className="w-4 h-4" style={{ color: "var(--ma3k-teal)" }} />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="p-4 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                                <div className="flex items-center gap-2 mb-2">
                                  <Mail className="w-4 h-4" style={{ color: "var(--ma3k-teal)" }} />
                                  <span className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>البريد الإلكتروني للموقع</span>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                  <p className="font-medium" style={{ color: "var(--ma3k-beige)" }}>
                                    {project.email || "غير مُعدّ بعد"}
                                  </p>
                                  {project.email && (
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      onClick={() => navigator.clipboard.writeText(project.email || "")}
                                      data-testid={`copy-email-${project.id}`}
                                    >
                                      <Copy className="w-4 h-4" style={{ color: "var(--ma3k-teal)" }} />
                                    </Button>
                                  )}
                                </div>
                              </div>

                              <div className="p-4 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                                <div className="flex items-center gap-2 mb-2">
                                  <HardDrive className="w-4 h-4" style={{ color: "var(--ma3k-teal)" }} />
                                  <span className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>قاعدة البيانات</span>
                                </div>
                                <p className="font-medium" style={{ color: "var(--ma3k-beige)" }}>
                                  PostgreSQL / MongoDB
                                </p>
                                <p className="text-xs mt-1" style={{ color: "var(--ma3k-beige-dark)" }}>
                                  تُدار بالكامل من فريق معك
                                </p>
                              </div>

                              <div className="p-4 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                                <div className="flex items-center gap-2 mb-2">
                                  <Server className="w-4 h-4" style={{ color: "var(--ma3k-teal)" }} />
                                  <span className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>الاستضافة</span>
                                </div>
                                <p className="font-medium" style={{ color: "var(--ma3k-beige)" }}>
                                  Ma3k Cloud Hosting
                                </p>
                                <p className="text-xs mt-1" style={{ color: "var(--ma3k-beige-dark)" }}>
                                  سيرفرات عالية الأداء
                                </p>
                              </div>

                              <div className="p-4 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                                <div className="flex items-center gap-2 mb-2">
                                  <Calendar className="w-4 h-4" style={{ color: "var(--ma3k-teal)" }} />
                                  <span className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>تاريخ الإنشاء</span>
                                </div>
                                <p className="font-medium" style={{ color: "var(--ma3k-beige)" }}>
                                  {project.createdAt ? new Date(project.createdAt).toLocaleDateString('ar-SA') : "غير محدد"}
                                </p>
                              </div>

                              <div className="p-4 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                                <div className="flex items-center gap-2 mb-2">
                                  <Clock className="w-4 h-4" style={{ color: "var(--ma3k-teal)" }} />
                                  <span className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>تاريخ التسليم المتوقع</span>
                                </div>
                                <p className="font-medium" style={{ color: "var(--ma3k-beige)" }}>
                                  {project.targetDate ? new Date(project.targetDate).toLocaleDateString('ar-SA') : "قيد التحديد"}
                                </p>
                              </div>
                            </div>

                            {project.toolsUsed && project.toolsUsed.length > 0 && (
                              <div className="p-4 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                                <div className="flex items-center gap-2 mb-3">
                                  <Code2 className="w-4 h-4" style={{ color: "var(--ma3k-teal)" }} />
                                  <span className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>التقنيات المستخدمة</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {project.toolsUsed.map((tool, idx) => (
                                    <Badge 
                                      key={idx}
                                      style={{ 
                                        background: "rgba(0, 128, 128, 0.2)", 
                                        color: "var(--ma3k-teal)",
                                        border: "1px solid var(--ma3k-teal)"
                                      }}
                                    >
                                      {tool}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex justify-end gap-2 pt-4 border-t flex-wrap" style={{ borderColor: "var(--ma3k-border)" }}>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setSelectedProject(project);
                                  setActiveTab("files");
                                }}
                                style={{ borderColor: "var(--ma3k-teal)", color: "var(--ma3k-teal)" }}
                                data-testid={`myinfo-files-${project.id}`}
                              >
                                <File className="w-4 h-4 ml-2" />
                                ملفات المشروع
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setSelectedProject(project);
                                  setActiveTab("chat");
                                }}
                                style={{ borderColor: "var(--ma3k-green)", color: "var(--ma3k-green)" }}
                                data-testid={`myinfo-chat-${project.id}`}
                              >
                                <MessageCircle className="w-4 h-4 ml-2" />
                                التواصل مع الفريق
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
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
                          <p className="text-sm mb-1" style={{ color: "var(--ma3k-beige-dark)" }}>البريد الإلكتروني</p>
                          <p className="font-medium" style={{ color: "var(--ma3k-beige)" }}>{user?.email}</p>
                        </div>
                        <div className="p-4 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                          <p className="text-sm mb-1" style={{ color: "var(--ma3k-beige-dark)" }}>رقم الهاتف</p>
                          <p className="font-medium" style={{ color: "var(--ma3k-beige)" }}>{user?.phone || "غير محدد"}</p>
                        </div>
                        <div className="p-4 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                          <p className="text-sm mb-1" style={{ color: "var(--ma3k-beige-dark)" }}>تاريخ التسجيل</p>
                          <p className="font-medium" style={{ color: "var(--ma3k-beige)" }}>
                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-SA') : "غير محدد"}
                          </p>
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

      <Dialog open={showModificationDialog} onOpenChange={setShowModificationDialog}>
        <DialogContent style={{ background: "var(--ma3k-dark)", border: "2px solid var(--ma3k-border)" }}>
          <DialogHeader>
            <DialogTitle style={{ color: "var(--ma3k-beige)" }}>طلب تعديل جديد</DialogTitle>
            <DialogDescription style={{ color: "var(--ma3k-beige-dark)" }}>
              أرسل طلب تعديل لفريق التطوير
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm block mb-2" style={{ color: "var(--ma3k-beige)" }}>عنوان التعديل</label>
              <Input
                value={modificationForm.title}
                onChange={(e) => setModificationForm({ ...modificationForm, title: e.target.value })}
                placeholder="مثال: تغيير لون الخلفية"
                style={{ background: "var(--ma3k-darker)", borderColor: "var(--ma3k-border)", color: "var(--ma3k-beige)" }}
                data-testid="input-modification-title"
              />
            </div>
            <div>
              <label className="text-sm block mb-2" style={{ color: "var(--ma3k-beige)" }}>الوصف التفصيلي</label>
              <Textarea
                value={modificationForm.description}
                onChange={(e) => setModificationForm({ ...modificationForm, description: e.target.value })}
                placeholder="اشرح التعديل المطلوب بالتفصيل..."
                className="min-h-[100px]"
                style={{ background: "var(--ma3k-darker)", borderColor: "var(--ma3k-border)", color: "var(--ma3k-beige)" }}
                data-testid="input-modification-description"
              />
            </div>
            <div>
              <label className="text-sm block mb-2" style={{ color: "var(--ma3k-beige)" }}>الأولوية</label>
              <Select value={modificationForm.priority} onValueChange={(v) => setModificationForm({ ...modificationForm, priority: v })}>
                <SelectTrigger style={{ background: "var(--ma3k-darker)", borderColor: "var(--ma3k-border)", color: "var(--ma3k-beige)" }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">منخفضة</SelectItem>
                  <SelectItem value="medium">متوسطة</SelectItem>
                  <SelectItem value="high">عالية</SelectItem>
                  <SelectItem value="urgent">عاجلة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleCreateModification}
              disabled={createModificationMutation.isPending || !modificationForm.title || !modificationForm.description}
              style={{ background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))", color: "white" }}
              data-testid="button-submit-modification"
            >
              {createModificationMutation.isPending ? "جاري الإرسال..." : "إرسال الطلب"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showFeatureDialog} onOpenChange={setShowFeatureDialog}>
        <DialogContent style={{ background: "var(--ma3k-dark)", border: "2px solid var(--ma3k-border)" }}>
          <DialogHeader>
            <DialogTitle style={{ color: "var(--ma3k-beige)" }}>طلب ميزة جديدة</DialogTitle>
            <DialogDescription style={{ color: "var(--ma3k-beige-dark)" }}>
              اقترح ميزة جديدة لمشروعك
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm block mb-2" style={{ color: "var(--ma3k-beige)" }}>عنوان الميزة</label>
              <Input
                value={featureForm.title}
                onChange={(e) => setFeatureForm({ ...featureForm, title: e.target.value })}
                placeholder="مثال: إضافة نظام تسجيل دخول"
                style={{ background: "var(--ma3k-darker)", borderColor: "var(--ma3k-border)", color: "var(--ma3k-beige)" }}
                data-testid="input-feature-title"
              />
            </div>
            <div>
              <label className="text-sm block mb-2" style={{ color: "var(--ma3k-beige)" }}>الوصف التفصيلي</label>
              <Textarea
                value={featureForm.description}
                onChange={(e) => setFeatureForm({ ...featureForm, description: e.target.value })}
                placeholder="اشرح الميزة المطلوبة بالتفصيل..."
                className="min-h-[100px]"
                style={{ background: "var(--ma3k-darker)", borderColor: "var(--ma3k-border)", color: "var(--ma3k-beige)" }}
                data-testid="input-feature-description"
              />
            </div>
            <div>
              <label className="text-sm block mb-2" style={{ color: "var(--ma3k-beige)" }}>التصنيف</label>
              <Select value={featureForm.category} onValueChange={(v) => setFeatureForm({ ...featureForm, category: v })}>
                <SelectTrigger style={{ background: "var(--ma3k-darker)", borderColor: "var(--ma3k-border)", color: "var(--ma3k-beige)" }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ui">واجهة المستخدم</SelectItem>
                  <SelectItem value="functionality">وظائف جديدة</SelectItem>
                  <SelectItem value="integration">تكامل مع خدمات</SelectItem>
                  <SelectItem value="other">أخرى</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm block mb-2" style={{ color: "var(--ma3k-beige)" }}>الأولوية</label>
              <Select value={featureForm.priority} onValueChange={(v) => setFeatureForm({ ...featureForm, priority: v })}>
                <SelectTrigger style={{ background: "var(--ma3k-darker)", borderColor: "var(--ma3k-border)", color: "var(--ma3k-beige)" }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">منخفضة</SelectItem>
                  <SelectItem value="medium">متوسطة</SelectItem>
                  <SelectItem value="high">عالية</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleCreateFeature}
              disabled={createFeatureMutation.isPending || !featureForm.title || !featureForm.description}
              style={{ background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))", color: "white" }}
              data-testid="button-submit-feature"
            >
              {createFeatureMutation.isPending ? "جاري الإرسال..." : "إرسال الطلب"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
