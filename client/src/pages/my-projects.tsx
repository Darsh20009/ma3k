import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
  MessageSquare,
  Lightbulb,
  RefreshCw
} from "lucide-react";

// Mock client ID - في التطبيق الحقيقي سيكون من session
const CURRENT_CLIENT_ID = "client-1";

interface Project {
  id: string;
  clientId: string;
  serviceName: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  idea: string | null;
  specifications: any;
  createdAt: string;
}

export default function MyProjects() {
  const { toast } = useToast();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newIdea, setNewIdea] = useState("");
  const [showIdeaDialog, setShowIdeaDialog] = useState(false);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects/client", CURRENT_CLIENT_ID],
  });

  const updateIdeaMutation = useMutation({
    mutationFn: async ({ projectId, idea }: { projectId: string; idea: string }) => {
      return await apiRequest(`/api/projects/${projectId}/idea`, "PUT", { idea });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects/client", CURRENT_CLIENT_ID] });
      setShowIdeaDialog(false);
      setNewIdea("");
      toast({
        title: "تم تحديث الفكرة! 💡",
        description: "سيراجع الفريق الفكرة الجديدة",
      });
    },
  });

  const getStatusConfig = (status: Project["status"]) => {
    const configs = {
      pending: {
        label: "قيد الانتظار",
        icon: Clock,
        color: "bg-yellow-500/20 text-yellow-300 border-yellow-300/30",
        gradient: "from-yellow-500/20 to-orange-500/20"
      },
      "in-progress": {
        label: "قيد العمل",
        icon: RefreshCw,
        color: "bg-blue-500/20 text-blue-300 border-blue-300/30",
        gradient: "from-blue-500/20 to-purple-500/20"
      },
      completed: {
        label: "مكتمل",
        icon: CheckCircle,
        color: "bg-green-500/20 text-green-300 border-green-300/30",
        gradient: "from-green-500/20 to-emerald-500/20"
      },
      cancelled: {
        label: "ملغي",
        icon: XCircle,
        color: "bg-red-500/20 text-red-300 border-red-300/30",
        gradient: "from-red-500/20 to-pink-500/20"
      }
    };
    return configs[status];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-12 h-12 text-purple-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-black opacity-90" />
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            إدارة مشاريعي
          </h1>
          <p className="text-xl text-white/80 flex items-center justify-center gap-2">
            <Briefcase className="w-5 h-5" />
            تابع تقدم مشاريعك
          </p>
        </motion.div>

        {projects.length === 0 ? (
          <Card className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-12 text-center">
              <Briefcase className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <p className="text-white/70 text-lg mb-4">لا توجد مشاريع حالياً</p>
              <Button 
                className="bg-gradient-to-r from-purple-600 to-blue-600"
                onClick={() => window.location.href = "/services"}
                data-testid="button-browse-services"
              >
                تصفح الخدمات
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
            {projects.map((project) => {
              const statusConfig = getStatusConfig(project.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card 
                    className={`bg-gradient-to-br ${statusConfig.gradient} backdrop-blur-lg border-white/20`}
                    data-testid={`card-project-${project.id}`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl text-white mb-2">
                            {project.serviceName}
                          </CardTitle>
                          <CardDescription className="text-white/70 text-sm">
                            تاريخ الإنشاء: {new Date(project.createdAt).toLocaleDateString('ar-SA')}
                          </CardDescription>
                        </div>
                        <Badge className={statusConfig.color}>
                          <StatusIcon className="w-3 h-3 ml-1" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {project.idea && (
                        <div className="bg-white/10 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Lightbulb className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-semibold text-white">الفكرة المقترحة</span>
                          </div>
                          <p className="text-white/90 text-sm">{project.idea}</p>
                        </div>
                      )}

                      {project.specifications && (
                        <div className="space-y-2">
                          <Separator className="bg-white/20" />
                          <div className="space-y-2">
                            {Object.entries(project.specifications).slice(0, 3).map(([key, value]) => (
                              <div key={key} className="flex justify-between text-sm">
                                <span className="text-white/70">{key}:</span>
                                <span className="text-white font-medium">{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {project.status === "in-progress" && (
                        <div className="flex gap-2">
                          <Button
                            className="flex-1 bg-purple-600 hover:bg-purple-700"
                            onClick={() => {
                              setSelectedProject(project);
                              setNewIdea(project.idea || "");
                              setShowIdeaDialog(true);
                            }}
                            data-testid={`button-update-idea-${project.id}`}
                          >
                            <Lightbulb className="w-4 h-4 ml-2" />
                            تحديث الفكرة
                          </Button>
                          <Button
                            variant="outline"
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                            data-testid={`button-contact-${project.id}`}
                          >
                            <MessageSquare className="w-4 h-4 ml-2" />
                            تواصل
                          </Button>
                        </div>
                      )}

                      {project.status === "pending" && (
                        <div className="bg-yellow-500/20 border border-yellow-500/30 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-yellow-400" />
                            <p className="text-sm text-white">
                              سيتم مراجعة طلبك قريباً
                            </p>
                          </div>
                        </div>
                      )}

                      {project.status === "completed" && (
                        <Button
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
                          data-testid={`button-download-${project.id}`}
                        >
                          <CheckCircle className="w-4 h-4 ml-2" />
                          تحميل المشروع
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Update Idea Dialog */}
      <Dialog open={showIdeaDialog} onOpenChange={setShowIdeaDialog}>
        <DialogContent className="bg-gradient-to-br from-purple-900 to-blue-900 text-white border-white/20">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-yellow-400" />
              تحديث الفكرة
            </DialogTitle>
            <DialogDescription className="text-white/70">
              شارك أفكارك الجديدة مع الفريق
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="idea" className="text-white">الفكرة</Label>
              <Textarea
                id="idea"
                value={newIdea}
                onChange={(e) => setNewIdea(e.target.value)}
                className="bg-white/10 border-white/20 text-white min-h-[150px]"
                placeholder="اكتب فكرتك هنا..."
                data-testid="textarea-idea"
              />
            </div>
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
              onClick={() => {
                if (selectedProject && newIdea.trim()) {
                  updateIdeaMutation.mutate({
                    projectId: selectedProject.id,
                    idea: newIdea
                  });
                }
              }}
              disabled={updateIdeaMutation.isPending || !newIdea.trim()}
              data-testid="button-save-idea"
            >
              <Sparkles className="w-4 h-4 ml-2" />
              حفظ التحديثات
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
