import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Clock,
  CheckCircle,
  Calendar,
  TrendingUp,
  Settings,
  LogOut,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  MessageCircle,
  Play,
  Pause,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Code2,
  Palette,
  Server,
  Upload,
  Target,
  Zap,
  Award,
  FileText,
  Bell
} from "lucide-react";

type Project = {
  id: string;
  clientId: string;
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

type Task = {
  id: string;
  employeeId: string;
  projectId: string;
  projectName?: string;
  isCompleted: boolean;
  hoursRemaining?: number;
  notes?: string;
  createdAt?: string;
};

type Employee = {
  id: string;
  employeeNumber?: string;
  fullName: string;
  email: string;
  position: string;
  jobTitle: string;
  photoUrl?: string;
  isAdmin: boolean;
};

type Client = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
};

const statusConfig = {
  analysis: { 
    label: "التحليل", 
    color: "var(--ma3k-teal)", 
    bgColor: "rgba(0, 128, 128, 0.2)",
    icon: Search,
    progress: 20
  },
  design: { 
    label: "التصميم", 
    color: "#a855f7", 
    bgColor: "rgba(168, 85, 247, 0.2)",
    icon: Palette,
    progress: 40
  },
  backend: { 
    label: "البرمجة", 
    color: "#eab308", 
    bgColor: "rgba(234, 179, 8, 0.2)",
    icon: Code2,
    progress: 60
  },
  deployment: { 
    label: "النشر", 
    color: "#f97316", 
    bgColor: "rgba(249, 115, 22, 0.2)",
    icon: Upload,
    progress: 80
  },
  completed: { 
    label: "مكتمل", 
    color: "var(--ma3k-green)", 
    bgColor: "rgba(76, 175, 80, 0.2)",
    icon: CheckCircle,
    progress: 100
  }
};

export default function EmployeeDashboardNew() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { user, isAuthenticated, isLoading, isEmployee, logout } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

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
    queryKey: ["/api/projects"],
    enabled: !!user?.id && isEmployee(),
  });

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: [`/api/employees/${user?.id}/tasks`],
    enabled: !!user?.id && isEmployee(),
  });

  const { data: employees = [] } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
    enabled: !!user?.id && isEmployee(),
  });

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
    enabled: !!user?.id && isEmployee(),
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await apiRequest("PATCH", `/api/projects/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "تم التحديث",
        description: "تم تحديث حالة المشروع بنجاح",
      });
    }
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, isCompleted }: { id: string; isCompleted: boolean }) => {
      return await apiRequest("PATCH", `/api/tasks/${id}`, { isCompleted });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/employees/${user?.id}/tasks`] });
      toast({
        title: "تم التحديث",
        description: "تم تحديث حالة المهمة",
      });
    }
  });

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.websiteIdea.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeProjects = projects.filter(p => p.status !== "completed");
  const completedProjects = projects.filter(p => p.status === "completed");
  const pendingTasks = tasks.filter(t => !t.isCompleted);
  const completedTasks = tasks.filter(t => t.isCompleted);

  const urgentProjects = activeProjects.filter(p => p.daysRemaining <= 3);

  const getDaysColor = (days: number) => {
    if (days <= 2) return "#ef4444";
    if (days <= 5) return "#eab308";
    return "var(--ma3k-green)";
  };

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
    <div className="min-h-screen" style={{ background: "var(--ma3k-darker)" }}>
      <header className="sticky top-0 z-50 border-b" style={{ background: "var(--ma3k-dark)", borderColor: "var(--ma3k-border)" }}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback style={{ background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))", color: "white" }}>
                  {user?.fullName?.charAt(0) || "E"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-bold text-lg" style={{ color: "var(--ma3k-beige)" }}>لوحة تحكم الموظفين</h1>
                <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>
                  مرحباً، {user?.fullName || "الموظف"} • {(user as any)?.jobTitle || "موظف"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                <Clock className="w-4 h-4" style={{ color: "var(--ma3k-teal)" }} />
                <span style={{ color: "var(--ma3k-beige)" }}>{new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              
              <Button
                size="icon"
                variant="ghost"
                className="relative"
                style={{ color: "var(--ma3k-beige)" }}
              >
                <Bell className="w-5 h-5" />
                {urgentProjects.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center" style={{ background: "#ef4444", color: "white" }}>
                    {urgentProjects.length}
                  </span>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logout();
                  setLocation("/");
                }}
                style={{ borderColor: "#ef4444", color: "#ef4444" }}
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4 ml-2" />
                خروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 h-[calc(100vh-73px)] sticky top-[73px] border-l p-4" style={{ background: "var(--ma3k-dark)", borderColor: "var(--ma3k-border)" }}>
          <nav className="space-y-2">
            {[
              { id: "dashboard", label: "الرئيسية", icon: LayoutDashboard },
              { id: "projects", label: "المشاريع", icon: Briefcase, badge: activeProjects.length },
              { id: "tasks", label: "مهامي", icon: Target, badge: pendingTasks.length },
              { id: "team", label: "فريق العمل", icon: Users },
              { id: "clients", label: "العملاء", icon: Users },
              { id: "reports", label: "التقارير", icon: FileText },
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
                {item.badge !== undefined && item.badge > 0 && (
                  <Badge 
                    className="text-xs" 
                    style={{ 
                      background: activeTab === item.id ? "rgba(255,255,255,0.2)" : "var(--ma3k-teal)",
                      color: "white"
                    }}
                  >
                    {item.badge}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-4 gap-4">
                  <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>المشاريع النشطة</p>
                          <p className="text-3xl font-bold" style={{ color: "var(--ma3k-teal)" }}>{activeProjects.length}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(0, 128, 128, 0.2)" }}>
                          <Briefcase className="w-6 h-6" style={{ color: "var(--ma3k-teal)" }} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>المهام المعلقة</p>
                          <p className="text-3xl font-bold" style={{ color: "#eab308" }}>{pendingTasks.length}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(234, 179, 8, 0.2)" }}>
                          <Target className="w-6 h-6" style={{ color: "#eab308" }} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>مشاريع مكتملة</p>
                          <p className="text-3xl font-bold" style={{ color: "var(--ma3k-green)" }}>{completedProjects.length}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(76, 175, 80, 0.2)" }}>
                          <CheckCircle className="w-6 h-6" style={{ color: "var(--ma3k-green)" }} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>العملاء</p>
                          <p className="text-3xl font-bold" style={{ color: "#a855f7" }}>{clients.length}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(168, 85, 247, 0.2)" }}>
                          <Users className="w-6 h-6" style={{ color: "#a855f7" }} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {urgentProjects.length > 0 && (
                  <Card style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444" }}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2" style={{ color: "#ef4444" }}>
                        <AlertCircle className="w-5 h-5" />
                        مشاريع عاجلة
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        {urgentProjects.map((project) => (
                          <div 
                            key={project.id}
                            className="p-4 rounded-xl flex items-center justify-between"
                            style={{ background: "var(--ma3k-darker)" }}
                          >
                            <div>
                              <h4 className="font-bold" style={{ color: "var(--ma3k-beige)" }}>{project.projectName}</h4>
                              <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>
                                المتبقي: {project.daysRemaining} يوم
                              </p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedProject(project);
                                setActiveTab("projects");
                              }}
                              style={{ background: "#ef4444", color: "white" }}
                            >
                              عرض
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                    <CardHeader>
                      <CardTitle style={{ color: "var(--ma3k-beige)" }}>المهام الأخيرة</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {tasks.length === 0 ? (
                        <p className="text-center py-8" style={{ color: "var(--ma3k-beige-dark)" }}>
                          لا توجد مهام حالياً
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {tasks.slice(0, 5).map((task) => (
                            <div 
                              key={task.id}
                              className="p-4 rounded-xl flex items-center justify-between"
                              style={{ background: "var(--ma3k-darker)" }}
                            >
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => updateTaskMutation.mutate({ id: task.id, isCompleted: !task.isCompleted })}
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                    task.isCompleted ? "" : ""
                                  }`}
                                  style={{
                                    borderColor: task.isCompleted ? "var(--ma3k-green)" : "var(--ma3k-border)",
                                    background: task.isCompleted ? "var(--ma3k-green)" : "transparent"
                                  }}
                                >
                                  {task.isCompleted && <CheckCircle className="w-4 h-4 text-white" />}
                                </button>
                                <div>
                                  <p className={task.isCompleted ? "line-through" : ""} style={{ color: "var(--ma3k-beige)" }}>
                                    {task.projectName || `مهمة #${task.id.slice(0, 8)}`}
                                  </p>
                                  {task.notes && (
                                    <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>{task.notes}</p>
                                  )}
                                </div>
                              </div>
                              {task.hoursRemaining && (
                                <Badge style={{ background: "var(--ma3k-darker)", color: "var(--ma3k-beige-dark)" }}>
                                  {task.hoursRemaining}س
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                    <CardHeader>
                      <CardTitle style={{ color: "var(--ma3k-beige)" }}>أحدث المشاريع</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {projects.length === 0 ? (
                        <p className="text-center py-8" style={{ color: "var(--ma3k-beige-dark)" }}>
                          لا توجد مشاريع حالياً
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {projects.slice(0, 5).map((project) => {
                            const statusInfo = statusConfig[project.status];
                            return (
                              <div 
                                key={project.id}
                                className="p-4 rounded-xl"
                                style={{ background: "var(--ma3k-darker)" }}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-bold" style={{ color: "var(--ma3k-beige)" }}>{project.projectName}</h4>
                                  <Badge style={{ background: statusInfo.bgColor, color: statusInfo.color }}>
                                    {statusInfo.label}
                                  </Badge>
                                </div>
                                <Progress value={statusInfo.progress} className="h-2" />
                              </div>
                            );
                          })}
                        </div>
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
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold" style={{ color: "var(--ma3k-beige)" }}>المشاريع</h1>
                    <p style={{ color: "var(--ma3k-beige-dark)" }}>إدارة ومتابعة جميع المشاريع</p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--ma3k-beige-dark)" }} />
                    <Input
                      placeholder="بحث عن مشروع..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-12"
                      style={{ 
                        background: "var(--ma3k-dark)", 
                        borderColor: "var(--ma3k-border)",
                        color: "var(--ma3k-beige)"
                      }}
                      data-testid="input-search-projects"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger 
                      className="w-48"
                      style={{ 
                        background: "var(--ma3k-dark)", 
                        borderColor: "var(--ma3k-border)",
                        color: "var(--ma3k-beige)"
                      }}
                    >
                      <SelectValue placeholder="تصفية حسب الحالة" />
                    </SelectTrigger>
                    <SelectContent style={{ background: "var(--ma3k-dark)", borderColor: "var(--ma3k-border)" }}>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="analysis">التحليل</SelectItem>
                      <SelectItem value="design">التصميم</SelectItem>
                      <SelectItem value="backend">البرمجة</SelectItem>
                      <SelectItem value="deployment">النشر</SelectItem>
                      <SelectItem value="completed">مكتمل</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {filteredProjects.length === 0 ? (
                  <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                    <CardContent className="text-center py-16">
                      <Briefcase className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--ma3k-beige-dark)" }} />
                      <h3 className="text-xl font-bold mb-2" style={{ color: "var(--ma3k-beige)" }}>
                        لا توجد مشاريع
                      </h3>
                      <p style={{ color: "var(--ma3k-beige-dark)" }}>
                        لم يتم العثور على مشاريع تطابق البحث
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProjects.map((project) => {
                      const statusInfo = statusConfig[project.status];
                      const StatusIcon = statusInfo.icon;

                      return (
                        <Card 
                          key={project.id}
                          className="hover-elevate cursor-pointer"
                          style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                                  style={{ background: statusInfo.bgColor }}
                                >
                                  <StatusIcon className="w-5 h-5" style={{ color: statusInfo.color }} />
                                </div>
                                <div>
                                  <CardTitle className="text-base" style={{ color: "var(--ma3k-beige)" }}>
                                    {project.projectName}
                                  </CardTitle>
                                  <Badge className="text-xs" style={{ background: statusInfo.bgColor, color: statusInfo.color }}>
                                    {statusInfo.label}
                                  </Badge>
                                </div>
                              </div>
                              <Button
                                size="icon"
                                variant="ghost"
                                style={{ color: "var(--ma3k-beige-dark)" }}
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm mb-4 line-clamp-2" style={{ color: "var(--ma3k-beige-dark)" }}>
                              {project.websiteIdea}
                            </p>
                            
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs" style={{ color: "var(--ma3k-beige-dark)" }}>التقدم</span>
                                <span className="text-xs font-bold" style={{ color: statusInfo.color }}>{statusInfo.progress}%</span>
                              </div>
                              <Progress value={statusInfo.progress} className="h-2" />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" style={{ color: getDaysColor(project.daysRemaining) }} />
                                <span className="text-sm font-bold" style={{ color: getDaysColor(project.daysRemaining) }}>
                                  {project.daysRemaining} يوم
                                </span>
                              </div>

                              <Select 
                                value={project.status}
                                onValueChange={(value) => updateProjectMutation.mutate({ id: project.id, status: value })}
                              >
                                <SelectTrigger className="w-28 h-8" style={{ background: "var(--ma3k-darker)", borderColor: "var(--ma3k-border)" }}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent style={{ background: "var(--ma3k-dark)", borderColor: "var(--ma3k-border)" }}>
                                  <SelectItem value="analysis">التحليل</SelectItem>
                                  <SelectItem value="design">التصميم</SelectItem>
                                  <SelectItem value="backend">البرمجة</SelectItem>
                                  <SelectItem value="deployment">النشر</SelectItem>
                                  <SelectItem value="completed">مكتمل</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
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
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold" style={{ color: "var(--ma3k-beige)" }}>مهامي</h1>
                    <p style={{ color: "var(--ma3k-beige-dark)" }}>إدارة ومتابعة مهامك اليومية</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                    <CardContent className="p-6 text-center">
                      <p className="text-4xl font-bold" style={{ color: "var(--ma3k-teal)" }}>{tasks.length}</p>
                      <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>إجمالي المهام</p>
                    </CardContent>
                  </Card>
                  <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                    <CardContent className="p-6 text-center">
                      <p className="text-4xl font-bold" style={{ color: "#eab308" }}>{pendingTasks.length}</p>
                      <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>قيد التنفيذ</p>
                    </CardContent>
                  </Card>
                  <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                    <CardContent className="p-6 text-center">
                      <p className="text-4xl font-bold" style={{ color: "var(--ma3k-green)" }}>{completedTasks.length}</p>
                      <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>مكتملة</p>
                    </CardContent>
                  </Card>
                </div>

                {tasks.length === 0 ? (
                  <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                    <CardContent className="text-center py-16">
                      <Target className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--ma3k-beige-dark)" }} />
                      <h3 className="text-xl font-bold mb-2" style={{ color: "var(--ma3k-beige)" }}>
                        لا توجد مهام
                      </h3>
                      <p style={{ color: "var(--ma3k-beige-dark)" }}>
                        لم يتم تعيين أي مهام لك حتى الآن
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {tasks.map((task) => (
                      <Card 
                        key={task.id}
                        style={{ 
                          background: "var(--ma3k-dark)", 
                          border: `1px solid ${task.isCompleted ? "var(--ma3k-green)" : "var(--ma3k-border)"}`,
                          opacity: task.isCompleted ? 0.7 : 1
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => updateTaskMutation.mutate({ id: task.id, isCompleted: !task.isCompleted })}
                              className="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0"
                              style={{
                                borderColor: task.isCompleted ? "var(--ma3k-green)" : "var(--ma3k-border)",
                                background: task.isCompleted ? "var(--ma3k-green)" : "transparent"
                              }}
                            >
                              {task.isCompleted && <CheckCircle className="w-5 h-5 text-white" />}
                            </button>
                            
                            <div className="flex-1">
                              <h4 
                                className={`font-bold ${task.isCompleted ? "line-through" : ""}`}
                                style={{ color: "var(--ma3k-beige)" }}
                              >
                                {task.projectName || `مهمة #${task.id.slice(0, 8)}`}
                              </h4>
                              {task.notes && (
                                <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>{task.notes}</p>
                              )}
                            </div>

                            <div className="flex items-center gap-4">
                              {task.hoursRemaining && (
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4" style={{ color: "var(--ma3k-beige-dark)" }} />
                                  <span style={{ color: "var(--ma3k-beige-dark)" }}>{task.hoursRemaining} ساعة</span>
                                </div>
                              )}
                              <Badge style={{ 
                                background: task.isCompleted ? "rgba(76, 175, 80, 0.2)" : "rgba(234, 179, 8, 0.2)",
                                color: task.isCompleted ? "var(--ma3k-green)" : "#eab308"
                              }}>
                                {task.isCompleted ? "مكتمل" : "قيد التنفيذ"}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "team" && (
              <motion.div
                key="team"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-3xl font-bold" style={{ color: "var(--ma3k-beige)" }}>فريق العمل</h1>
                  <p style={{ color: "var(--ma3k-beige-dark)" }}>عرض جميع أعضاء الفريق</p>
                </div>

                {employees.length === 0 ? (
                  <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                    <CardContent className="text-center py-16">
                      <Users className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--ma3k-beige-dark)" }} />
                      <h3 className="text-xl font-bold mb-2" style={{ color: "var(--ma3k-beige)" }}>
                        لا يوجد موظفون
                      </h3>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {employees.map((employee) => (
                      <Card key={employee.id} style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                        <CardContent className="p-6 text-center">
                          <Avatar className="w-16 h-16 mx-auto mb-4">
                            <AvatarFallback style={{ background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))", color: "white", fontSize: "1.5rem" }}>
                              {employee.fullName?.charAt(0) || "E"}
                            </AvatarFallback>
                          </Avatar>
                          <h4 className="font-bold mb-1" style={{ color: "var(--ma3k-beige)" }}>{employee.fullName}</h4>
                          <p className="text-sm mb-2" style={{ color: "var(--ma3k-beige-dark)" }}>{employee.jobTitle}</p>
                          <Badge style={{ background: "rgba(0, 128, 128, 0.2)", color: "var(--ma3k-teal)" }}>
                            {employee.position}
                          </Badge>
                          {employee.isAdmin && (
                            <Badge className="mr-2" style={{ background: "rgba(168, 85, 247, 0.2)", color: "#a855f7" }}>
                              مدير
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
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
                  <p style={{ color: "var(--ma3k-beige-dark)" }}>قائمة جميع العملاء</p>
                </div>

                {clients.length === 0 ? (
                  <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                    <CardContent className="text-center py-16">
                      <Users className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--ma3k-beige-dark)" }} />
                      <h3 className="text-xl font-bold mb-2" style={{ color: "var(--ma3k-beige)" }}>
                        لا يوجد عملاء
                      </h3>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {clients.map((client) => (
                      <Card key={client.id} style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4 mb-4">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)", color: "white" }}>
                                {client.fullName?.charAt(0) || "C"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-bold" style={{ color: "var(--ma3k-beige)" }}>{client.fullName}</h4>
                              <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>{client.email}</p>
                            </div>
                          </div>
                          {client.phone && (
                            <div className="flex items-center gap-2 text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>
                              <MessageCircle className="w-4 h-4" />
                              {client.phone}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
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
                <div>
                  <h1 className="text-3xl font-bold" style={{ color: "var(--ma3k-beige)" }}>التقارير</h1>
                  <p style={{ color: "var(--ma3k-beige-dark)" }}>إحصائيات وتقارير الأداء</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                    <CardHeader>
                      <CardTitle style={{ color: "var(--ma3k-beige)" }}>توزيع المشاريع حسب الحالة</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(statusConfig).map(([status, info]) => {
                          const count = projects.filter(p => p.status === status).length;
                          const percentage = projects.length > 0 ? (count / projects.length) * 100 : 0;
                          return (
                            <div key={status}>
                              <div className="flex items-center justify-between mb-2">
                                <span style={{ color: info.color }}>{info.label}</span>
                                <span style={{ color: "var(--ma3k-beige)" }}>{count}</span>
                              </div>
                              <Progress value={percentage} className="h-2" />
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card style={{ background: "var(--ma3k-dark)", border: "1px solid var(--ma3k-border)" }}>
                    <CardHeader>
                      <CardTitle style={{ color: "var(--ma3k-beige)" }}>الإنتاجية</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="text-center p-6 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                          <p className="text-5xl font-bold" style={{ color: "var(--ma3k-green)" }}>
                            {completedProjects.length}
                          </p>
                          <p style={{ color: "var(--ma3k-beige-dark)" }}>مشاريع مكتملة</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                            <p className="text-2xl font-bold" style={{ color: "var(--ma3k-teal)" }}>
                              {completedTasks.length}
                            </p>
                            <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>مهام مكتملة</p>
                          </div>
                          <div className="text-center p-4 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                            <p className="text-2xl font-bold" style={{ color: "#a855f7" }}>
                              {clients.length}
                            </p>
                            <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>عملاء</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
                        <p className="font-bold" style={{ color: "var(--ma3k-beige)" }}>{user?.fullName}</p>
                      </div>
                      <div className="p-4 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                        <p className="text-sm mb-1" style={{ color: "var(--ma3k-beige-dark)" }}>البريد الإلكتروني</p>
                        <p className="font-bold" style={{ color: "var(--ma3k-beige)" }}>{user?.email}</p>
                      </div>
                      <div className="p-4 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                        <p className="text-sm mb-1" style={{ color: "var(--ma3k-beige-dark)" }}>المسمى الوظيفي</p>
                        <p className="font-bold" style={{ color: "var(--ma3k-beige)" }}>{(user as any)?.jobTitle || "موظف"}</p>
                      </div>
                      <div className="p-4 rounded-xl" style={{ background: "var(--ma3k-darker)" }}>
                        <p className="text-sm mb-1" style={{ color: "var(--ma3k-beige-dark)" }}>القسم</p>
                        <p className="font-bold" style={{ color: "var(--ma3k-beige)" }}>{(user as any)?.position || "غير محدد"}</p>
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
  );
}
