import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Trophy, 
  Award,
  FileText,
  Play,
  Lock,
  Sparkles,
  GraduationCap
} from "lucide-react";

// Mock student ID - في التطبيق الحقيقي سيكون من session
const CURRENT_STUDENT_ID = "student-1";

interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrollmentDate: string;
  progress: number;
  examScore: number | null;
  isCompleted: boolean;
  certificateNumber: string | null;
}

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  examMinScore: number;
  content: string[];
}

export default function MyCourses() {
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState<{ enrollment: Enrollment; course: Course } | null>(null);
  const [examScore, setExamScore] = useState("");
  const [showExamDialog, setShowExamDialog] = useState(false);

  const { data: enrollments = [], isLoading: loadingEnrollments } = useQuery<Enrollment[]>({
    queryKey: ["/api/enrollments/student", CURRENT_STUDENT_ID],
  });

  const { data: courses = [], isLoading: loadingCourses } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const updateProgressMutation = useMutation({
    mutationFn: async ({ enrollmentId, progress }: { enrollmentId: string; progress: number }) => {
      return await apiRequest(`/api/enrollments/${enrollmentId}/progress`, "PUT", { progress });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/enrollments/student", CURRENT_STUDENT_ID] });
      toast({
        title: "تم تحديث التقدم! 📚",
        description: "استمر في التعلم",
      });
    },
  });

  const submitExamMutation = useMutation({
    mutationFn: async ({ enrollmentId, score }: { enrollmentId: string; score: number }) => {
      await apiRequest(`/api/enrollments/${enrollmentId}/exam-score`, "PUT", { score });
      
      // إذا كانت الدرجة أكبر من الحد الأدنى، قم بإكمال التسجيل
      if (selectedCourse && score >= selectedCourse.course.examMinScore) {
        await apiRequest(`/api/enrollments/${enrollmentId}/complete`, "PUT", {});
      }
      
      return score;
    },
    onSuccess: (score) => {
      queryClient.invalidateQueries({ queryKey: ["/api/enrollments/student", CURRENT_STUDENT_ID] });
      setShowExamDialog(false);
      setExamScore("");
      
      if (selectedCourse && score >= selectedCourse.course.examMinScore) {
        toast({
          title: "مبروك! 🎉",
          description: "لقد اجتزت الاختبار بنجاح! سيتم إصدار شهادتك قريباً",
        });
      } else {
        toast({
          title: "للأسف لم تجتز الاختبار 😔",
          description: "يمكنك المحاولة مرة أخرى",
          variant: "destructive",
        });
      }
    },
  });

  const getEnrolledCourses = () => {
    return enrollments.map(enrollment => {
      const course = courses.find(c => c.id === enrollment.courseId);
      return course ? { enrollment, course } : null;
    }).filter(Boolean) as { enrollment: Enrollment; course: Course }[];
  };

  const activeCourses = getEnrolledCourses().filter(ec => !ec.enrollment.isCompleted);
  const completedCourses = getEnrolledCourses().filter(ec => ec.enrollment.isCompleted);

  if (loadingEnrollments || loadingCourses) {
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
            دوراتي
          </h1>
          <p className="text-xl text-white/80 flex items-center justify-center gap-2">
            <GraduationCap className="w-5 h-5" />
            تابع تقدمك في التعلم
          </p>
        </motion.div>

        <Tabs defaultValue="active" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/10 backdrop-blur-lg">
            <TabsTrigger value="active" className="text-white" data-testid="tab-active">
              <BookOpen className="w-4 h-4 ml-2" />
              الدورات النشطة ({activeCourses.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-white" data-testid="tab-completed">
              <Trophy className="w-4 h-4 ml-2" />
              الدورات المكتملة ({completedCourses.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {activeCourses.length === 0 ? (
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardContent className="p-12 text-center">
                  <BookOpen className="w-16 h-16 text-white/50 mx-auto mb-4" />
                  <p className="text-white/70 text-lg">لا توجد دورات نشطة حالياً</p>
                  <Button 
                    className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600"
                    onClick={() => window.location.href = "/courses"}
                    data-testid="button-browse-courses"
                  >
                    تصفح الدورات
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {activeCourses.map(({ enrollment, course }) => (
                  <motion.div
                    key={enrollment.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="bg-white/10 backdrop-blur-lg border-white/20 h-full" data-testid={`card-course-${course.id}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <CardTitle className="text-xl text-white mb-2">{course.title}</CardTitle>
                            <CardDescription className="text-white/70">{course.description}</CardDescription>
                          </div>
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-300/30">
                            {course.level}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm text-white/70 mb-2">
                            <span>التقدم</span>
                            <span>{enrollment.progress}%</span>
                          </div>
                          <Progress value={enrollment.progress} className="h-2" />
                        </div>

                        <div className="flex items-center gap-2 text-white/70">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{course.duration}</span>
                        </div>

                        <Separator className="bg-white/20" />

                        <div className="space-y-2">
                          {course.content.map((item, index) => {
                            const isUnlocked = (index / course.content.length) * 100 <= enrollment.progress;
                            return (
                              <div 
                                key={index}
                                className={`flex items-center gap-3 p-3 rounded-lg ${
                                  isUnlocked ? "bg-white/10" : "bg-white/5"
                                }`}
                              >
                                {isUnlocked ? (
                                  <Play className="w-4 h-4 text-green-400" />
                                ) : (
                                  <Lock className="w-4 h-4 text-white/30" />
                                )}
                                <span className={`text-sm ${isUnlocked ? "text-white" : "text-white/50"}`}>
                                  {item}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex gap-2">
                          {enrollment.progress < 100 && (
                            <Button
                              className="flex-1 bg-purple-600 hover:bg-purple-700"
                              onClick={() => {
                                const newProgress = Math.min(enrollment.progress + 10, 100);
                                updateProgressMutation.mutate({ 
                                  enrollmentId: enrollment.id, 
                                  progress: newProgress 
                                });
                              }}
                              disabled={updateProgressMutation.isPending}
                              data-testid={`button-continue-${course.id}`}
                            >
                              <Play className="w-4 h-4 ml-2" />
                              متابعة التعلم
                            </Button>
                          )}
                          
                          {enrollment.progress >= 100 && !enrollment.examScore && (
                            <Button
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              onClick={() => {
                                setSelectedCourse({ enrollment, course });
                                setShowExamDialog(true);
                              }}
                              data-testid={`button-exam-${course.id}`}
                            >
                              <FileText className="w-4 h-4 ml-2" />
                              إجراء الاختبار
                            </Button>
                          )}
                        </div>

                        {enrollment.examScore !== null && (
                          <div className={`p-3 rounded-lg ${
                            enrollment.examScore >= course.examMinScore
                              ? "bg-green-500/20 border border-green-500/30"
                              : "bg-red-500/20 border border-red-500/30"
                          }`}>
                            <p className="text-sm text-white">
                              درجة الاختبار: {enrollment.examScore}% 
                              (المطلوب: {course.examMinScore}%)
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {completedCourses.length === 0 ? (
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardContent className="p-12 text-center">
                  <Trophy className="w-16 h-16 text-white/50 mx-auto mb-4" />
                  <p className="text-white/70 text-lg">لم تكمل أي دورة بعد</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {completedCourses.map(({ enrollment, course }) => (
                  <motion.div
                    key={enrollment.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card className="bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-lg border-green-300/30">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl text-white">{course.title}</CardTitle>
                          <CheckCircle className="w-8 h-8 text-green-400" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 text-white">
                          <Award className="w-5 h-5 text-yellow-400" />
                          <div>
                            <p className="text-sm text-white/70">درجة الاختبار</p>
                            <p className="text-lg font-bold">{enrollment.examScore}%</p>
                          </div>
                        </div>
                        
                        {enrollment.certificateNumber && (
                          <div className="p-4 bg-white/10 rounded-lg">
                            <p className="text-sm text-white/70 mb-1">رقم الشهادة</p>
                            <p className="text-white font-mono">{enrollment.certificateNumber}</p>
                          </div>
                        )}
                        
                        <Button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600">
                          <Trophy className="w-4 h-4 ml-2" />
                          تحميل الشهادة
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Exam Dialog */}
      <Dialog open={showExamDialog} onOpenChange={setShowExamDialog}>
        <DialogContent className="bg-gradient-to-br from-purple-900 to-blue-900 text-white border-white/20">
          <DialogHeader>
            <DialogTitle className="text-2xl">إجراء الاختبار النهائي</DialogTitle>
            <DialogDescription className="text-white/70">
              {selectedCourse && `الدرجة المطلوبة للنجاح: ${selectedCourse.course.examMinScore}%`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="examScore" className="text-white">أدخل درجة الاختبار</Label>
              <Input
                id="examScore"
                type="number"
                min="0"
                max="100"
                value={examScore}
                onChange={(e) => setExamScore(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                placeholder="0-100"
                data-testid="input-exam-score"
              />
            </div>
            <Button
              className="w-full bg-gradient-to-r from-green-600 to-blue-600"
              onClick={() => {
                if (selectedCourse && examScore) {
                  submitExamMutation.mutate({
                    enrollmentId: selectedCourse.enrollment.id,
                    score: parseInt(examScore)
                  });
                }
              }}
              disabled={submitExamMutation.isPending || !examScore}
              data-testid="button-submit-exam"
            >
              تقديم الدرجة
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
