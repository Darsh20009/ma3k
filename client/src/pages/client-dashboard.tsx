import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  ChevronLeft,
  ChevronRight,
  Search,
  Code2,
  Palette,
  Server,
  Upload,
  Star,
  Phone,
  User,
  TrendingUp,
  Download,
  Eye
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

const stages = ["analysis", "design", "backend", "deployment", "completed"] as const;

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("projects");
  const [editingIdea, setEditingIdea] = useState<string | null>(null);
  const [newIdea, setNewIdea] = useState("");
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

  const handleUpdateIdea = (project: Project) => {
    if (!newIdea.trim()) return;
    updateIdeaMutation.mutate({ id: project.id, websiteIdea: newIdea });

    const message = `
تحديث فكرة المشروع

المشروع: ${project.projectName}
الفكرة الجديدة: ${newIdea}

العميل: ${user?.fullName || "غير محدد"}
    `.trim();

    const whatsappUrl = `https://wa.me/+201155201921?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
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
                    { id: "orders", label: "طلباتي", icon: CreditCard },
                    { id: "notifications", label: "الإشعارات", icon: Bell, badge: unreadNotifications },
                    { id: "settings", label: "الإعدادات", icon: Settings },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover-elevate ${
                        activeTab === item.id ? "" : ""
                      }`}
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
                  <div className="flex items-center justify-between">
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
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
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
                                      background: "var(--ma3k-darker)",
                                      ["--progress-color" as string]: statusInfo.color 
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
                                            className="text-xs mt-2 text-center"
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
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        onClick={() => {
                                          setEditingIdea(project.id);
                                          setNewIdea(project.websiteIdea);
                                        }}
                                        style={{ borderColor: "var(--ma3k-teal)", color: "var(--ma3k-teal)" }}
                                        data-testid={`button-edit-idea-${project.id}`}
                                      >
                                        <Edit className="w-4 h-4 ml-2" />
                                        تعديل الفكرة
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent style={{ background: "var(--ma3k-dark)", border: "2px solid var(--ma3k-border)" }}>
                                      <DialogHeader>
                                        <DialogTitle style={{ color: "var(--ma3k-beige)" }}>
                                          تعديل فكرة المشروع
                                        </DialogTitle>
                                        <DialogDescription style={{ color: "var(--ma3k-beige-dark)" }}>
                                          سيتم إرسال التعديل مباشرة لفريق التطوير
                                        </DialogDescription>
                                      </DialogHeader>
                                      <Textarea
                                        value={newIdea}
                                        onChange={(e) => setNewIdea(e.target.value)}
                                        className="min-h-[150px]"
                                        style={{ 
                                          background: "var(--ma3k-darker)", 
                                          borderColor: "var(--ma3k-border)",
                                          color: "var(--ma3k-beige)"
                                        }}
                                        placeholder="اشرح التعديلات المطلوبة..."
                                        data-testid="input-new-idea"
                                      />
                                      <DialogFooter>
                                        <Button
                                          onClick={() => handleUpdateIdea(project)}
                                          disabled={updateIdeaMutation.isPending}
                                          style={{ background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))", color: "white" }}
                                          data-testid="button-submit-idea"
                                        >
                                          <MessageCircle className="w-4 h-4 ml-2" />
                                          {updateIdeaMutation.isPending ? "جاري الإرسال..." : "إرسال التعديل"}
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>

                                  <Button
                                    variant="outline"
                                    onClick={() => window.open("https://wa.me/+201155201921", "_blank")}
                                    style={{ borderColor: "#25d366", color: "#25d366" }}
                                  >
                                    <MessageCircle className="w-4 h-4 ml-2" />
                                    تواصل مع الفريق
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
                                    {order.orderNumber} • {new Date(order.createdAt).toLocaleDateString('ar-SA')}
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
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-4 h-4" style={{ color: "var(--ma3k-teal)" }} />
                            <span className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>الاسم</span>
                          </div>
                          <p className="font-medium" style={{ color: "var(--ma3k-beige)" }}>{user?.fullName}</p>
                        </div>
                        <div className="p-4 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                          <div className="flex items-center gap-2 mb-2">
                            <Mail className="w-4 h-4" style={{ color: "var(--ma3k-teal)" }} />
                            <span className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>البريد الإلكتروني</span>
                          </div>
                          <p className="font-medium" style={{ color: "var(--ma3k-beige)" }}>{user?.email}</p>
                        </div>
                        <div className="p-4 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                          <div className="flex items-center gap-2 mb-2">
                            <Phone className="w-4 h-4" style={{ color: "var(--ma3k-teal)" }} />
                            <span className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>الهاتف</span>
                          </div>
                          <p className="font-medium" style={{ color: "var(--ma3k-beige)" }}>{(user as any)?.phone || "غير محدد"}</p>
                        </div>
                        <div className="p-4 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4" style={{ color: "var(--ma3k-teal)" }} />
                            <span className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>تاريخ الانضمام</span>
                          </div>
                          <p className="font-medium" style={{ color: "var(--ma3k-beige)" }}>
                            {(user as any)?.createdAt ? new Date((user as any).createdAt).toLocaleDateString('ar-SA') : "غير محدد"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card 
                    className="p-6 text-center"
                    style={{ 
                      background: "linear-gradient(135deg, rgba(0, 128, 128, 0.2), rgba(76, 175, 80, 0.2))",
                      border: "1px solid var(--ma3k-teal)"
                    }}
                  >
                    <MessageCircle className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--ma3k-teal)" }} />
                    <h3 className="text-xl font-bold mb-2" style={{ color: "var(--ma3k-beige)" }}>
                      هل تحتاج مساعدة؟
                    </h3>
                    <p className="mb-4" style={{ color: "var(--ma3k-beige-dark)" }}>
                      فريق الدعم الفني متاح للمساعدة على مدار الساعة
                    </p>
                    <Button
                      onClick={() => window.open("https://wa.me/+201155201921", "_blank")}
                      style={{ background: "#25d366", color: "white" }}
                    >
                      <MessageCircle className="w-4 h-4 ml-2" />
                      تواصل معنا
                    </Button>
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
