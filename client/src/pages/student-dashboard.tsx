import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Award,
  Code,
  Play,
  Lock,
  Trophy,
  LogOut,
  GraduationCap,
  FileText,
  Download,
  Calendar,
  Target,
  Sparkles,
  ChevronRight,
  Video,
  File,
  Star,
  User,
  TrendingUp,
  Layers,
  BookMarked,
  ArrowLeft
} from "lucide-react";
import { useLocation } from "wouter";

type Enrollment = {
  id: string;
  courseId: string;
  courseName: string;
  language: string;
  progress: number;
  status: string;
  quizScores?: number[];
  finalExamScore?: number;
  enrolledAt?: string;
  completedAt?: string;
};

type Certificate = {
  id: string;
  certificateNumber: string;
  studentId: string;
  courseId: string;
  studentName: string;
  courseName: string;
  finalScore: number;
  status: string;
  issuedAt: string;
  approvedAt?: string;
};

type Lesson = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  videoUrl?: string;
  content?: string;
  materials?: string[];
  duration?: number;
  isActive: boolean;
};

type LessonProgress = {
  lessonId: string;
  isCompleted: boolean;
  completedAt?: string;
};

export default function StudentDashboard() {
  const [, setLocation] = useLocation();
  const [selectedCourse, setSelectedCourse] = useState<Enrollment | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const { user, isAuthenticated, isLoading, isStudent, logout } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isLoading) return;
    
    if (!isAuthenticated || !isStudent()) {
      toast({
        title: "يجب تسجيل الدخول",
        description: "يرجى تسجيل الدخول كطالب للوصول إلى هذه الصفحة",
        variant: "destructive"
      });
      setLocation("/login");
    }
  }, [isAuthenticated, isStudent, isLoading]);

  const { data: enrollments = [], isError: enrollmentsError, isLoading: enrollmentsLoading } = useQuery<Enrollment[]>({
    queryKey: [`/api/enrollments/student/${user?.id}`],
    enabled: !!user?.id && isStudent(),
  });

  const { data: certificates = [], isError: certificatesError, isLoading: certificatesLoading } = useQuery<Certificate[]>({
    queryKey: [`/api/certificates/student/${user?.id}`],
    enabled: !!user?.id && isStudent(),
  });

  const { data: courseLessons = [], isError: lessonsError, isLoading: lessonsLoading } = useQuery<Lesson[]>({
    queryKey: [`/api/courses/${selectedCourse?.courseId}/lessons`],
    enabled: !!selectedCourse?.courseId,
  });

  const { data: lessonProgress = [], isError: progressError, isLoading: progressLoading } = useQuery<LessonProgress[]>({
    queryKey: [`/api/enrollments/${selectedCourse?.id}/progress`],
    enabled: !!selectedCourse?.id,
  });

  useEffect(() => {
    if (enrollmentsError) {
      toast({
        title: "خطأ في تحميل الدورات",
        description: "حدث خطأ أثناء تحميل بيانات الدورات. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    }
    if (certificatesError) {
      toast({
        title: "خطأ في تحميل الشهادات",
        description: "حدث خطأ أثناء تحميل بيانات الشهادات. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    }
  }, [enrollmentsError, certificatesError]);

  const activeCourses = enrollments.filter(e => e.status === "active");
  const completedCourses = enrollments.filter(e => e.status === "completed");
  const freeCoursesTaken = enrollments.filter(e => e.status !== "dropped").length;
  const totalProgress = activeCourses.reduce((acc, c) => acc + c.progress, 0) / (activeCourses.length || 1);
  const approvedCertificates = certificates.filter(c => c.status === "approved");

  const completedLessons = lessonProgress.filter(lp => lp.isCompleted).length;
  const totalLessons = courseLessons.length;

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  const downloadCertificate = async (certificate: Certificate) => {
    try {
      toast({
        title: "جاري تحميل الشهادة",
        description: `سيتم تحميل الشهادة رقم ${certificate.certificateNumber}`,
      });

      const certificateContent = `
╔══════════════════════════════════════════════════════════════════╗
║                                                                    ║
║                     شهادة إتمام دورة تدريبية                       ║
║                      Certificate of Completion                      ║
║                                                                    ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║   تشهد منصة معك للخدمات الرقمية والتدريب                          ║
║   بأن الطالب/ة:                                                   ║
║                                                                    ║
║   ${certificate.studentName.padStart(35).padEnd(50)}              ║
║                                                                    ║
║   قد أتم/ت بنجاح دورة:                                           ║
║                                                                    ║
║   ${certificate.courseName.padStart(35).padEnd(50)}               ║
║                                                                    ║
║   بنتيجة: ${certificate.finalScore}%                              ║
║                                                                    ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║   رقم الشهادة: ${certificate.certificateNumber}                   ║
║   تاريخ الإصدار: ${new Date(certificate.issuedAt).toLocaleDateString('ar-SA')}                             ║
║                                                                    ║
║   للتحقق من الشهادة: /cert-search                                 ║
║                                                                    ║
╚══════════════════════════════════════════════════════════════════╝
      `;

      const blob = new Blob([certificateContent], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${certificate.certificateNumber}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "تم تحميل الشهادة بنجاح",
        description: "تم حفظ الشهادة على جهازك",
      });
    } catch (error) {
      toast({
        title: "خطأ في تحميل الشهادة",
        description: "حدث خطأ أثناء تحميل الشهادة. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen royal-gradient flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4"
          >
            <Sparkles className="w-full h-full text-green-400" />
          </motion.div>
          <p className="text-gray-300 text-lg">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen royal-gradient pt-24 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center green-glow">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-green-400 mb-1">
                  مرحباً {user?.fullName || "عزيزي الطالب"}
                </h1>
                <p className="text-gray-400">
                  لوحة تحكم الطالب - متابعة تقدمك التعليمي
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-red-500 text-red-400"
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 ml-2" />
              تسجيل الخروج
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="glass-card border-green-500/20">
              <CardContent className="pt-6 text-center">
                <BookOpen className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-green-400">{activeCourses.length}</p>
                <p className="text-sm text-gray-400">دورات نشطة</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="glass-card border-emerald-500/20">
              <CardContent className="pt-6 text-center">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-emerald-400">{completedCourses.length}</p>
                <p className="text-sm text-gray-400">دورات مكتملة</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="glass-card border-yellow-500/20">
              <CardContent className="pt-6 text-center">
                <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-yellow-400">{approvedCertificates.length}</p>
                <p className="text-sm text-gray-400">شهادات معتمدة</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="glass-card border-blue-500/20">
              <CardContent className="pt-6 text-center">
                <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-blue-400">{Math.round(totalProgress)}%</p>
                <p className="text-sm text-gray-400">متوسط التقدم</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-4 bg-gray-800/50">
            <TabsTrigger value="overview" data-testid="tab-overview">
              <Layers className="w-4 h-4 ml-1" />
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="courses" data-testid="tab-courses">
              <BookOpen className="w-4 h-4 ml-1" />
              الدورات
            </TabsTrigger>
            <TabsTrigger value="certificates" data-testid="tab-certificates">
              <Award className="w-4 h-4 ml-1" />
              الشهادات
            </TabsTrigger>
            <TabsTrigger value="materials" data-testid="tab-materials">
              <FileText className="w-4 h-4 ml-1" />
              المواد
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    أهداف التعلم
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                    <p className="text-gray-300 mb-2">التقدم الكلي في الدورات النشطة</p>
                    <div className="flex items-center gap-4">
                      <Progress value={totalProgress} className="flex-1 h-3" />
                      <span className="text-green-400 font-bold">{Math.round(totalProgress)}%</span>
                    </div>
                  </div>
                  {activeCourses.slice(0, 3).map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
                      <div className="flex items-center gap-3">
                        <Code className="w-5 h-5 text-green-400" />
                        <span className="text-gray-300">{course.courseName}</span>
                      </div>
                      <Badge variant={course.progress >= 80 ? "default" : "secondary"}>
                        {course.progress}%
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-yellow-400 flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    الإنجازات الأخيرة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {completedCourses.length > 0 ? (
                    completedCourses.slice(0, 3).map((course) => (
                      <div key={course.id} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/20">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                        <div className="flex-1">
                          <p className="text-gray-200">{course.courseName}</p>
                          <p className="text-sm text-gray-400">
                            النتيجة النهائية: {course.finalExamScore || 0}%
                          </p>
                        </div>
                        <Star className="w-5 h-5 text-yellow-400" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Trophy className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                      <p className="text-gray-400">لم تكمل أي دورات بعد</p>
                      <p className="text-sm text-gray-500">أكمل دوراتك للحصول على الشهادات</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {freeCoursesTaken < 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-2 border-yellow-500/30 text-center"
              >
                <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-yellow-400 mb-2">
                  لديك {2 - freeCoursesTaken} دورة مجانية متبقية!
                </h3>
                <p className="text-gray-300 mb-4">
                  استفد من فرصة التعلم المجاني قبل أن تصبح الدورات مدفوعة
                </p>
                <Button
                  onClick={() => setLocation("/courses")}
                  className="bg-gradient-to-r from-yellow-500 to-amber-600"
                >
                  استعرض الدورات المتاحة
                </Button>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            {selectedCourse ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Button
                  variant="ghost"
                  onClick={() => setSelectedCourse(null)}
                  className="text-gray-400 mb-4"
                  data-testid="button-back-to-courses"
                >
                  <ArrowLeft className="w-4 h-4 ml-2" />
                  العودة لقائمة الدورات
                </Button>

                <Card className="glass-card border-2 border-green-500/30">
                  <CardHeader>
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div>
                        <CardTitle className="text-2xl text-green-400 flex items-center gap-2">
                          <Code className="w-6 h-6" />
                          {selectedCourse.courseName}
                        </CardTitle>
                        <CardDescription className="text-lg text-gray-300 mt-2">
                          لغة البرمجة: {selectedCourse.language}
                        </CardDescription>
                      </div>
                      <Badge className={selectedCourse.status === "completed" ? "bg-emerald-500/20 text-emerald-400" : "bg-green-500/20 text-green-400"}>
                        {selectedCourse.status === "completed" ? (
                          <>
                            <CheckCircle className="w-4 h-4 ml-1" />
                            مكتمل
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4 ml-1" />
                            نشط
                          </>
                        )}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 rounded-lg bg-gray-800/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400">التقدم في الدورة</span>
                        <span className="text-green-400 font-bold">{selectedCourse.progress}%</span>
                      </div>
                      <Progress value={selectedCourse.progress} className="h-4" />
                      <p className="text-sm text-gray-500 mt-2">
                        أكملت {completedLessons} من {totalLessons} درس
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                        <BookMarked className="w-5 h-5 text-green-400" />
                        محتوى الدورة
                      </h4>
                      <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-3">
                          {courseLessons.length > 0 ? (
                            courseLessons.map((lesson, idx) => {
                              const isCompleted = lessonProgress.find(lp => lp.lessonId === lesson.id)?.isCompleted;
                              return (
                                <motion.div
                                  key={lesson.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.05 }}
                                  className={`p-4 rounded-lg border transition-all ${
                                    isCompleted
                                      ? "bg-emerald-500/10 border-emerald-500/30"
                                      : "bg-gray-800/30 border-gray-700/30"
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        isCompleted ? "bg-emerald-500/20" : "bg-gray-700/50"
                                      }`}>
                                        {isCompleted ? (
                                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                                        ) : (
                                          <span className="text-sm text-gray-400">{idx + 1}</span>
                                        )}
                                      </div>
                                      <div>
                                        <h5 className={`font-medium ${isCompleted ? "text-emerald-400" : "text-gray-200"}`}>
                                          {lesson.title}
                                        </h5>
                                        {lesson.description && (
                                          <p className="text-sm text-gray-400 mt-1">{lesson.description}</p>
                                        )}
                                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                          {lesson.videoUrl && (
                                            <span className="flex items-center gap-1">
                                              <Video className="w-3 h-3" />
                                              فيديو
                                            </span>
                                          )}
                                          {lesson.materials && lesson.materials.length > 0 && (
                                            <span className="flex items-center gap-1">
                                              <File className="w-3 h-3" />
                                              {lesson.materials.length} مرفقات
                                            </span>
                                          )}
                                          {lesson.duration && (
                                            <span className="flex items-center gap-1">
                                              <Clock className="w-3 h-3" />
                                              {lesson.duration} دقيقة
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant={isCompleted ? "outline" : "default"}
                                      className={isCompleted ? "border-emerald-500/50 text-emerald-400" : "bg-green-600"}
                                      data-testid={`button-lesson-${lesson.id}`}
                                    >
                                      {isCompleted ? "مراجعة" : "ابدأ"}
                                      <ChevronRight className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </motion.div>
                              );
                            })
                          ) : (
                            <div className="text-center py-12">
                              <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                              <p className="text-gray-400">لا توجد دروس متاحة حالياً</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </div>

                    {selectedCourse.quizScores && selectedCourse.quizScores.length > 0 && (
                      <div className="p-4 rounded-lg bg-gray-800/50">
                        <h5 className="text-gray-300 mb-3 flex items-center gap-2">
                          <Target className="w-4 h-4 text-blue-400" />
                          نتائج الاختبارات
                        </h5>
                        <div className="flex gap-2 flex-wrap">
                          {selectedCourse.quizScores.map((score, i) => (
                            <Badge 
                              key={i} 
                              variant={score >= 80 ? "default" : score >= 60 ? "secondary" : "destructive"}
                            >
                              الاختبار {i + 1}: {score}%
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedCourse.finalExamScore !== undefined && selectedCourse.finalExamScore !== null && (
                      <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30">
                        <h5 className="text-gray-300 mb-2">نتيجة الاختبار النهائي</h5>
                        <div className="flex items-center gap-4">
                          <p className="text-4xl font-bold text-emerald-400">
                            {selectedCourse.finalExamScore}%
                          </p>
                          {selectedCourse.finalExamScore >= 80 && (
                            <Badge className="bg-yellow-500/20 text-yellow-400">
                              <Trophy className="w-4 h-4 ml-1" />
                              مؤهل للشهادة
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="gap-3 flex-wrap">
                    <Button
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 green-glow"
                      data-testid="button-continue-learning"
                    >
                      <Play className="w-4 h-4 ml-2" />
                      متابعة الدراسة
                    </Button>
                    {selectedCourse.status === "completed" && selectedCourse.finalExamScore && selectedCourse.finalExamScore >= 80 && (
                      <Button
                        variant="outline"
                        className="border-yellow-500 text-yellow-400"
                        onClick={() => setActiveTab("certificates")}
                        data-testid="button-view-certificate"
                      >
                        <Award className="w-4 h-4 ml-2" />
                        عرض الشهادة
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <h3 className="text-xl font-semibold text-gray-200">دوراتي التعليمية</h3>
                  <Button
                    onClick={() => setLocation("/courses")}
                    className="bg-gradient-to-r from-green-500 to-emerald-600"
                    data-testid="button-browse-courses"
                  >
                    تصفح المزيد من الدورات
                  </Button>
                </div>

                {enrollments.length === 0 ? (
                  <Card className="glass-card">
                    <CardContent className="text-center py-12">
                      <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                      <p className="text-xl text-gray-400 mb-4">
                        لم تلتحق بأي دورات بعد
                      </p>
                      <Button
                        onClick={() => setLocation("/courses")}
                        className="bg-gradient-to-r from-green-500 to-emerald-600"
                      >
                        تصفح الدورات
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {enrollments.map((course, idx) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <Card 
                          className={`glass-card border-2 transition-all cursor-pointer ${
                            course.status === "completed"
                              ? "border-emerald-500/30"
                              : "border-green-500/20 hover:border-green-500/40"
                          }`}
                          onClick={() => setSelectedCourse(course)}
                          data-testid={`card-course-${course.id}`}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <CardTitle className={`text-lg ${course.status === "completed" ? "text-emerald-400" : "text-green-400"}`}>
                                  {course.courseName}
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                  {course.language}
                                </CardDescription>
                              </div>
                              <Badge className={course.status === "completed" ? "bg-emerald-500/20 text-emerald-400" : "bg-green-500/20 text-green-400"}>
                                {course.status === "completed" ? "مكتمل" : "نشط"}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">التقدم</span>
                                <span className="text-green-400 font-bold">{course.progress}%</span>
                              </div>
                              <Progress value={course.progress} className="h-2" />
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button
                              variant="ghost"
                              className="w-full text-gray-400"
                            >
                              عرض التفاصيل
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="certificates" className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h3 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-400" />
                شهاداتي
              </h3>
              <Button
                variant="outline"
                onClick={() => setLocation("/cert-search")}
                className="border-yellow-500 text-yellow-400"
                data-testid="button-verify-certificate"
              >
                التحقق من شهادة
              </Button>
            </div>

            {certificates.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="text-center py-12">
                  <Award className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-xl text-gray-400 mb-2">
                    لا توجد شهادات بعد
                  </p>
                  <p className="text-gray-500">
                    أكمل الدورات بنجاح للحصول على الشهادات المعتمدة
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {certificates.map((cert, idx) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className={`glass-card border-2 ${
                      cert.status === "approved"
                        ? "border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-amber-500/5"
                        : cert.status === "pending"
                        ? "border-blue-500/30"
                        : "border-red-500/30"
                    }`}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              cert.status === "approved"
                                ? "bg-yellow-500/20"
                                : cert.status === "pending"
                                ? "bg-blue-500/20"
                                : "bg-red-500/20"
                            }`}>
                              <Award className={`w-6 h-6 ${
                                cert.status === "approved"
                                  ? "text-yellow-400"
                                  : cert.status === "pending"
                                  ? "text-blue-400"
                                  : "text-red-400"
                              }`} />
                            </div>
                            <div>
                              <CardTitle className="text-lg text-gray-200">
                                {cert.courseName}
                              </CardTitle>
                              <CardDescription className="text-gray-400">
                                رقم الشهادة: {cert.certificateNumber}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className={
                            cert.status === "approved"
                              ? "bg-green-500/20 text-green-400"
                              : cert.status === "pending"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-red-500/20 text-red-400"
                          }>
                            {cert.status === "approved" ? "معتمدة" : cert.status === "pending" ? "قيد المراجعة" : "مرفوضة"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="p-3 rounded-lg bg-gray-800/30">
                            <p className="text-gray-500 mb-1">النتيجة</p>
                            <p className="text-xl font-bold text-emerald-400">{cert.finalScore}%</p>
                          </div>
                          <div className="p-3 rounded-lg bg-gray-800/30">
                            <p className="text-gray-500 mb-1">تاريخ الإصدار</p>
                            <p className="text-gray-300">
                              {new Date(cert.issuedAt).toLocaleDateString('ar-SA')}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="gap-2">
                        {cert.status === "approved" && (
                          <>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="flex-1 border-yellow-500/50 text-yellow-400"
                                  data-testid={`button-view-cert-${cert.id}`}
                                >
                                  <FileText className="w-4 h-4 ml-2" />
                                  عرض الشهادة
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl bg-gray-900 border-gray-700">
                                <DialogHeader>
                                  <DialogTitle className="text-center text-2xl text-yellow-400">
                                    شهادة إتمام الدورة
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="p-8 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-lg border-2 border-yellow-500/30 text-center">
                                  <Award className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
                                  <h3 className="text-3xl font-bold text-white mb-2">شهادة إتمام</h3>
                                  <p className="text-gray-400 mb-6">هذه الشهادة تُمنح إلى</p>
                                  <p className="text-2xl font-bold text-green-400 mb-6">{cert.studentName}</p>
                                  <p className="text-gray-400 mb-2">لإتمامه بنجاح دورة</p>
                                  <p className="text-xl font-semibold text-white mb-6">{cert.courseName}</p>
                                  <div className="flex justify-center gap-8 text-sm text-gray-400 mb-6">
                                    <div>
                                      <p className="text-gray-500">النتيجة</p>
                                      <p className="text-lg font-bold text-emerald-400">{cert.finalScore}%</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500">رقم الشهادة</p>
                                      <p className="text-lg font-mono text-gray-300">{cert.certificateNumber}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500">التاريخ</p>
                                      <p className="text-lg text-gray-300">
                                        {new Date(cert.issuedAt).toLocaleDateString('ar-SA')}
                                      </p>
                                    </div>
                                  </div>
                                  <Separator className="bg-yellow-500/30 my-6" />
                                  <p className="text-sm text-gray-500">
                                    منصة معك للخدمات الرقمية والتدريب
                                  </p>
                                </div>
                                <div className="flex justify-center mt-4">
                                  <Button
                                    onClick={() => downloadCertificate(cert)}
                                    className="bg-gradient-to-r from-yellow-500 to-amber-600"
                                    data-testid={`button-download-cert-${cert.id}`}
                                  >
                                    <Download className="w-4 h-4 ml-2" />
                                    تحميل الشهادة PDF
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              onClick={() => downloadCertificate(cert)}
                              className="bg-gradient-to-r from-yellow-500 to-amber-600"
                              data-testid={`button-download-${cert.id}`}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        {cert.status === "pending" && (
                          <div className="w-full text-center p-3 bg-blue-500/10 rounded-lg">
                            <p className="text-blue-400 text-sm">
                              الشهادة قيد المراجعة والاعتماد
                            </p>
                          </div>
                        )}
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="materials" className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-400" />
              المواد التعليمية
            </h3>

            {activeCourses.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-xl text-gray-400 mb-2">
                    لا توجد مواد تعليمية متاحة
                  </p>
                  <p className="text-gray-500">
                    سجل في الدورات للوصول إلى المواد التعليمية
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {enrollments.map((course) => (
                  <Card key={course.id} className="glass-card border-blue-500/20">
                    <CardHeader>
                      <CardTitle className="text-lg text-blue-400 flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        {course.courseName}
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        مواد الدورة التعليمية
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700/30 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <Video className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-gray-200 font-medium">فيديوهات الدورة</p>
                            <p className="text-sm text-gray-500">محاضرات مسجلة</p>
                          </div>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700/30 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <p className="text-gray-200 font-medium">ملفات PDF</p>
                            <p className="text-sm text-gray-500">مذكرات ومراجع</p>
                          </div>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700/30 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                            <Code className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-gray-200 font-medium">أكواد المشاريع</p>
                            <p className="text-sm text-gray-500">أمثلة عملية</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full border-blue-500/50 text-blue-400"
                        onClick={() => {
                          setSelectedCourse(course);
                          setActiveTab("courses");
                        }}
                        data-testid={`button-view-materials-${course.id}`}
                      >
                        عرض محتوى الدورة
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
