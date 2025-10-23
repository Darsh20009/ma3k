import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Award,
  Code,
  Play,
  Lock,
  Trophy,
  LogOut
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
};

export default function MyCoursesComplete() {
  const [, setLocation] = useLocation();
  const [selectedCourse, setSelectedCourse] = useState<Enrollment | null>(null);
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

  const { data: enrollments = [] } = useQuery<Enrollment[]>({
    queryKey: [`/api/enrollments/student/${user?.id}`],
    enabled: !!user?.id && isStudent(),
  });

  const activeCourses = enrollments.filter(e => e.status === "active");
  const completedCourses = enrollments.filter(e => e.status === "completed");
  const freeCoursesTaken = enrollments.filter(e => e.status !== "dropped").length;

  const handleStartCourse = (course: Enrollment) => {
    setLocation(`/course/${course.courseId}`);
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
                logout();
                setLocation("/login");
              }}
              className="border-red-500 text-red-400 hover:bg-red-500/10"
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              تسجيل الخروج
            </Button>
          </div>
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl mx-auto mb-4 flex items-center justify-center green-glow">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-green-400 mb-4">
            دوراتي التعليمية
          </h1>
          <p className="text-xl text-gray-300">
            مرحباً {user?.fullName || "عزيزي الطالب"}
          </p>
          <p className="text-lg text-gray-400">
            تابع تقدمك في رحلة تعلم البرمجة
          </p>
        </motion.div>

        <div className="mb-6 p-6 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/30">
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-gray-400 mb-1">الدورات النشطة</p>
              <p className="text-3xl font-bold text-green-400">{activeCourses.length}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">الدورات المكتملة</p>
              <p className="text-3xl font-bold text-emerald-400">{completedCourses.length}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">الدورات المجانية المستخدمة</p>
              <p className="text-3xl font-bold text-yellow-400">{freeCoursesTaken} / 2</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-2 bg-gray-800/50">
            <TabsTrigger value="active" data-testid="tab-active-courses">
              الدورات النشطة
            </TabsTrigger>
            <TabsTrigger value="completed" data-testid="tab-completed-courses">
              الدورات المكتملة
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeCourses.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-xl text-gray-400">
                    لم تلتحق بأي دورات بعد
                  </p>
                  <Button
                    onClick={() => setLocation("/courses")}
                    className="mt-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    تصفح الدورات
                  </Button>
                </CardContent>
              </Card>
            ) : (
              activeCourses.map((course, idx) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="glass-card border-2 border-green-500/20 hover:border-green-500/40 transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-2xl text-green-400">
                            {course.courseName}
                          </CardTitle>
                          <CardDescription className="text-lg text-gray-300 mt-2">
                            لغة البرمجة: {course.language}
                          </CardDescription>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400">
                          <Clock className="w-4 h-4 ml-1" />
                          نشط
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400">التقدم</span>
                          <span className="text-green-400 font-bold">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-3" />
                      </div>
                      
                      {course.quizScores && course.quizScores.length > 0 && (
                        <div className="p-3 rounded-lg bg-gray-800/50">
                          <p className="text-sm text-gray-400 mb-2">نتائج الاختبارات القصيرة:</p>
                          <div className="flex gap-2 flex-wrap">
                            {course.quizScores.map((score, i) => (
                              <Badge key={i} variant={score >= 80 ? "default" : "destructive"}>
                                الاختبار {i + 1}: {score}%
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={() => handleStartCourse(course)}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 green-glow"
                        data-testid={`button-continue-course-${course.id}`}
                      >
                        <Play className="ml-2" />
                        متابعة الدراسة
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedCourses.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="text-center py-12">
                  <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-xl text-gray-400">
                    لم تكمل أي دورات بعد
                  </p>
                </CardContent>
              </Card>
            ) : (
              completedCourses.map((course, idx) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="glass-card border-2 border-emerald-500/20">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-2xl text-emerald-400 flex items-center gap-2">
                            {course.courseName}
                            <CheckCircle className="w-6 h-6" />
                          </CardTitle>
                          <CardDescription className="text-lg text-gray-300 mt-2">
                            لغة البرمجة: {course.language}
                          </CardDescription>
                        </div>
                        <Badge className="bg-emerald-500/20 text-emerald-400">
                          <Award className="w-4 h-4 ml-1" />
                          مكتمل
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {course.finalExamScore !== undefined && (
                        <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30">
                          <p className="text-gray-300 mb-2">نتيجة الاختبار النهائي:</p>
                          <p className="text-4xl font-bold text-emerald-400">
                            {course.finalExamScore}%
                          </p>
                          {course.finalExamScore >= 80 && (
                            <p className="text-sm text-green-400 mt-2 flex items-center gap-1">
                              <Trophy className="w-4 h-4" />
                              مؤهل للحصول على الشهادة
                            </p>
                          )}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={() => setLocation(`/certificates?course=${course.courseId}`)}
                        variant="outline"
                        className="w-full border-emerald-500 text-emerald-400 hover:bg-emerald-500/10"
                        data-testid={`button-view-certificate-${course.id}`}
                      >
                        <Award className="ml-2" />
                        عرض الشهادة
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>
        </Tabs>

        {freeCoursesTaken < 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-2 border-yellow-500/30 text-center"
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
              className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700"
            >
              استعرض الدورات المتاحة
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
