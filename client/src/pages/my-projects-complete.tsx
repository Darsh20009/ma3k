import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  Rocket
} from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";

type Project = {
  id: string;
  projectName: string;
  websiteIdea: string;
  status: "analysis" | "design" | "backend" | "deployment" | "completed";
  daysRemaining: number;
  domain?: string;
  email?: string;
  toolsUsed?: string[];
};

const statusConfig = {
  analysis: { label: "تحليل", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: Briefcase },
  design: { label: "تصميم", color: "bg-purple-500/20 text-purple-400 border-purple-500/30", icon: Edit },
  backend: { label: "باك-إند", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: Wrench },
  deployment: { label: "نشر", color: "bg-orange-500/20 text-orange-400 border-orange-500/30", icon: Rocket },
  completed: { label: "منتهٍ", color: "bg-green-500/20 text-green-400 border-green-500/30", icon: CheckCircle }
};

export default function MyProjectsComplete() {
  const [editingIdea, setEditingIdea] = useState<string | null>(null);
  const [newIdea, setNewIdea] = useState("");
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // التحقق من تسجيل الدخول
  const userId = localStorage.getItem("ma3k_user_id");
  const userType = localStorage.getItem("ma3k_user_type");

  // إذا لم يكن المستخدم مسجل دخول أو ليس عميل، توجيهه لصفحة تسجيل الدخول
  if (!userId || userType !== "client") {
    setLocation("/login");
    return null;
  }

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: [`/api/clients/${userId}/projects`],
  });

  const updateIdeaMutation = useMutation({
    mutationFn: async ({ id, websiteIdea }: { id: string; websiteIdea: string }) => {
      return await apiRequest("PATCH", `/api/projects/${id}`, { websiteIdea });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "تم التحديث! ✨",
        description: "تم إرسال التعديل للمدير التنفيذي",
      });
      setEditingIdea(null);
    }
  });

  const handleUpdateIdea = (project: Project) => {
    if (!newIdea.trim()) return;

    updateIdeaMutation.mutate({
      id: project.id,
      websiteIdea: newIdea
    });

    const message = `
🔄 تحديث فكرة المشروع

المشروع: ${project.projectName}
الفكرة الجديدة: ${newIdea}

العميل: ${localStorage.getItem("ma3k_client_name") || "غير محدد"}
    `.trim();

    const whatsappUrl = `https://wa.me/+201155201921?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const getDaysRemainingColor = (days: number) => {
    if (days <= 2) return "text-red-400";
    if (days <= 5) return "text-yellow-400";
    return "text-green-400";
  };

  return (
    <div className="min-h-screen royal-gradient pt-24 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              onClick={() => {
                localStorage.clear();
                setLocation("/login");
              }}
              className="border-red-500 text-red-400 hover:bg-red-500/10"
            >
              تسجيل الخروج
            </Button>
          </div>
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl mx-auto mb-4 flex items-center justify-center green-glow">
            <Briefcase className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-green-400 mb-4">
            مشاريعي ومواقعي
          </h1>
          <p className="text-xl text-gray-300">
            مرحباً {localStorage.getItem("ma3k_user_name") || "عزيزي العميل"}
          </p>
          <p className="text-lg text-gray-400">
            تابع حالة مشاريعك وتقدم التطوير
          </p>
        </motion.div>

        {projects.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-xl text-gray-400 mb-4">
                لا توجد مشاريع حالياً
              </p>
              <Button
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                <Rocket className="ml-2" />
                ابدأ مشروعاً جديداً
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, idx) => {
              const statusInfo = statusConfig[project.status];
              const StatusIcon = statusInfo.icon;

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="glass-card border-2 border-green-500/20 hover:border-green-500/40 transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-2xl text-green-400">
                          {project.projectName}
                        </CardTitle>
                        <Badge className={`${statusInfo.color} border`}>
                          <StatusIcon className="w-4 h-4 ml-1" />
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <CardDescription className="text-gray-300 text-base">
                        {project.websiteIdea}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-gray-800/50">
                          <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">الأيام المتبقية</span>
                          </div>
                          <p className={`text-2xl font-bold ${getDaysRemainingColor(project.daysRemaining)}`}>
                            {project.daysRemaining} يوم
                          </p>
                        </div>

                        {project.status === "completed" && project.domain && (
                          <div className="p-3 rounded-lg bg-gray-800/50">
                            <div className="flex items-center gap-2 text-gray-400 mb-1">
                              <Globe className="w-4 h-4" />
                              <span className="text-sm">الدومين</span>
                            </div>
                            <p className="text-sm font-medium text-green-400 truncate">
                              {project.domain}
                            </p>
                          </div>
                        )}
                      </div>

                      {project.email && (
                        <div className="p-3 rounded-lg bg-gray-800/50">
                          <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <Mail className="w-4 h-4" />
                            <span className="text-sm">البريد المستخدم</span>
                          </div>
                          <p className="text-sm text-white">{project.email}</p>
                        </div>
                      )}

                      {project.toolsUsed && project.toolsUsed.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                            <Wrench className="w-4 h-4" />
                            الأدوات المستخدمة:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {project.toolsUsed.map((tool, i) => (
                              <Badge key={i} variant="outline" className="text-gray-300 border-gray-600">
                                {tool}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full border-green-500 text-green-400 hover:bg-green-500/10"
                            onClick={() => {
                              setEditingIdea(project.id);
                              setNewIdea(project.websiteIdea);
                            }}
                            data-testid={`button-edit-idea-${project.id}`}
                          >
                            <Edit className="ml-2 w-4 h-4" />
                            تعديل فكرة المشروع
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-card border-2 border-green-500/20">
                          <DialogHeader>
                            <DialogTitle className="text-green-400">
                              تعديل فكرة المشروع
                            </DialogTitle>
                            <DialogDescription className="text-gray-300">
                              سيتم إرسال التعديل فوراً للمدير التنفيذي عبر واتساب
                            </DialogDescription>
                          </DialogHeader>
                          <Textarea
                            value={newIdea}
                            onChange={(e) => setNewIdea(e.target.value)}
                            className="min-h-[150px] bg-gray-800/50 border-gray-600 text-white"
                            placeholder="اشرح الفكرة الجديدة..."
                            data-testid="input-new-idea"
                          />
                          <DialogFooter>
                            <Button
                              onClick={() => handleUpdateIdea(project)}
                              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                              data-testid="button-submit-idea"
                            >
                              <MessageCircle className="ml-2 w-4 h-4" />
                              إرسال التعديل
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-2 border-blue-500/30 text-center"
        >
          <MessageCircle className="w-12 h-12 text-blue-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-blue-400 mb-2">
            هل لديك استفسار؟
          </h3>
          <p className="text-gray-300 mb-4">
            تواصل مع فريق الدعم الفني للحصول على المساعدة
          </p>
          <Button
            onClick={() => window.open("https://wa.me/+201155201921", "_blank")}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
          >
            <MessageCircle className="ml-2" />
            تواصل معنا
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
