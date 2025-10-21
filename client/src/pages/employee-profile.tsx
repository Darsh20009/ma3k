import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  User,
  Briefcase,
  CheckCircle,
  Clock,
  ListTodo,
  Sparkles,
  Download,
  Award,
  TrendingUp
} from "lucide-react";

// Mock employee ID - في التطبيق الحقيقي سيكون من session
const CURRENT_EMPLOYEE_ID = "employee-1";

interface EmployeeTask {
  id: string;
  employeeId: string;
  taskName: string;
  estimatedHours: number;
  hoursRemaining: number | null;
  isCompleted: boolean;
  assignedDate: string;
}

interface Employee {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  employeeId: string;
}

export default function EmployeeProfile() {
  const { toast } = useToast();
  const [showCardDialog, setShowCardDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<EmployeeTask | null>(null);
  const [hoursRemaining, setHoursRemaining] = useState("");

  const { data: employee } = useQuery<Employee>({
    queryKey: ["/api/employees", CURRENT_EMPLOYEE_ID],
  });

  const { data: tasks = [], isLoading } = useQuery<EmployeeTask[]>({
    queryKey: ["/api/employee-tasks/employee", CURRENT_EMPLOYEE_ID],
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, isCompleted, hours }: { taskId: string; isCompleted: boolean; hours?: number }) => {
      return await apiRequest(`/api/employee-tasks/${taskId}`, "PUT", { 
        isCompleted, 
        hoursRemaining: hours 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employee-tasks/employee", CURRENT_EMPLOYEE_ID] });
      setSelectedTask(null);
      setHoursRemaining("");
      toast({
        title: "تم تحديث المهمة! ✅",
        description: "استمر في العمل الرائع",
      });
    },
  });

  const activeTasks = tasks.filter(t => !t.isCompleted);
  const completedTasks = tasks.filter(t => t.isCompleted);
  const totalHours = tasks.reduce((sum, t) => sum + t.estimatedHours, 0);
  const completedHours = completedTasks.reduce((sum, t) => sum + t.estimatedHours, 0);
  const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

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
            لوحة الموظف
          </h1>
          <p className="text-xl text-white/80 flex items-center justify-center gap-2">
            <User className="w-5 h-5" />
            {employee?.fullName || "الموظف"}
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-lg border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/70 mb-1">إجمالي المهام</p>
                    <p className="text-3xl font-bold text-white">{tasks.length}</p>
                  </div>
                  <ListTodo className="w-10 h-10 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/70 mb-1">المهام المكتملة</p>
                    <p className="text-3xl font-bold text-white">{completedTasks.length}</p>
                  </div>
                  <CheckCircle className="w-10 h-10 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-lg border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/70 mb-1">الساعات المقدرة</p>
                    <p className="text-3xl font-bold text-white">{totalHours}</p>
                  </div>
                  <Clock className="w-10 h-10 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/70 mb-1">معدل الإنجاز</p>
                    <p className="text-3xl font-bold text-white">{completionRate.toFixed(0)}%</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Employee Card */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl text-white">بطاقة العمل</CardTitle>
                <Button
                  className="bg-gradient-to-r from-yellow-600 to-orange-600"
                  onClick={() => setShowCardDialog(true)}
                  data-testid="button-view-card"
                >
                  <Award className="w-4 h-4 ml-2" />
                  عرض البطاقة
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Active Tasks */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-2xl text-white">المهام النشطة</CardTitle>
              <CardDescription className="text-white/70">
                المهام التي تعمل عليها حالياً ({activeTasks.length})
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeTasks.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-white/50 mx-auto mb-3" />
                  <p className="text-white/70">لا توجد مهام نشطة! 🎉</p>
                </div>
              ) : (
                activeTasks.map((task) => (
                  <Card 
                    key={task.id} 
                    className="bg-white/5 border-white/10"
                    data-testid={`card-task-${task.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="text-white font-semibold mb-2">{task.taskName}</h4>
                          <div className="flex items-center gap-4 text-sm text-white/70">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {task.estimatedHours}h مقدرة
                            </span>
                            {task.hoursRemaining !== null && (
                              <span className="flex items-center gap-1">
                                ⏱️ {task.hoursRemaining}h متبقية
                              </span>
                            )}
                          </div>
                          {task.hoursRemaining !== null && (
                            <div className="mt-3">
                              <Progress 
                                value={((task.estimatedHours - task.hoursRemaining) / task.estimatedHours) * 100} 
                                className="h-2"
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => {
                              setSelectedTask(task);
                              setHoursRemaining(task.hoursRemaining?.toString() || "");
                            }}
                            data-testid={`button-update-${task.id}`}
                          >
                            تحديث
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => updateTaskMutation.mutate({ taskId: task.id, isCompleted: true })}
                            disabled={updateTaskMutation.isPending}
                            data-testid={`button-complete-${task.id}`}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  المهام المكتملة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {completedTasks.map((task) => (
                  <div 
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-white">{task.taskName}</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-300 border-green-300/30">
                      {task.estimatedHours}h
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Update Hours Dialog */}
      <Dialog open={selectedTask !== null} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <DialogContent className="bg-gradient-to-br from-purple-900 to-blue-900 text-white border-white/20">
          <DialogHeader>
            <DialogTitle className="text-2xl">تحديث المهمة</DialogTitle>
            <DialogDescription className="text-white/70">
              {selectedTask?.taskName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hoursRemaining" className="text-white">الساعات المتبقية</Label>
              <Input
                id="hoursRemaining"
                type="number"
                min="0"
                value={hoursRemaining}
                onChange={(e) => setHoursRemaining(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                placeholder="0"
                data-testid="input-hours-remaining"
              />
            </div>
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
              onClick={() => {
                if (selectedTask) {
                  updateTaskMutation.mutate({
                    taskId: selectedTask.id,
                    isCompleted: false,
                    hours: hoursRemaining ? parseFloat(hoursRemaining) : undefined
                  });
                }
              }}
              disabled={updateTaskMutation.isPending}
              data-testid="button-save-hours"
            >
              حفظ التحديث
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Employee Card Dialog */}
      <Dialog open={showCardDialog} onOpenChange={setShowCardDialog}>
        <DialogContent className="bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white border-2 border-yellow-400/50 max-w-md">
          <div className="text-center space-y-6 p-4">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black py-3 px-6 rounded-lg">
              <h2 className="text-2xl font-bold">معك - MA3K</h2>
            </div>
            
            <div className="space-y-4">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{employee?.fullName}</h3>
                <p className="text-white/70">{employee?.employeeId}</p>
              </div>
              
              <Separator className="bg-white/20" />
              
              <div className="space-y-2 text-right">
                <div className="flex justify-between">
                  <span className="text-white/70">البريد:</span>
                  <span className="text-white">{employee?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">الهاتف:</span>
                  <span className="text-white">{employee?.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">المهام المكتملة:</span>
                  <span className="text-white">{completedTasks.length} / {tasks.length}</span>
                </div>
              </div>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-yellow-600 to-orange-600"
              onClick={() => window.print()}
              data-testid="button-print-card"
            >
              <Download className="w-4 h-4 ml-2" />
              طباعة البطاقة
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
