import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Award, 
  Search, 
  CheckCircle, 
  Sparkles, 
  Download,
  Calendar,
  User,
  BookOpen,
  Trophy
} from "lucide-react";

interface Certificate {
  id: string;
  studentId: string;
  enrollmentId: string;
  certificateNumber: string;
  issueDate: string;
  studentName?: string;
  courseName?: string;
}

export default function CertSearch() {
  const { toast } = useToast();
  const [certificateNumber, setCertificateNumber] = useState("");
  const [certificate, setCertificate] = useState<Certificate | null>(null);

  const searchMutation = useMutation({
    mutationFn: async (certNumber: string) => {
      const response = await fetch(`/api/certificates/number/${certNumber}`);
      if (!response.ok) {
        throw new Error("الشهادة غير موجودة");
      }
      return await response.json();
    },
    onSuccess: (data) => {
      setCertificate(data);
      toast({
        title: "تم العثور على الشهادة! ✨",
        description: "الشهادة صالحة ومعتمدة",
      });
    },
    onError: () => {
      setCertificate(null);
      toast({
        title: "لم يتم العثور على الشهادة",
        description: "تأكد من رقم الشهادة وحاول مرة أخرى",
        variant: "destructive",
      });
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (certificateNumber.trim()) {
      searchMutation.mutate(certificateNumber.trim());
    }
  };

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
          <div className="flex items-center justify-center gap-3 mb-4">
            <Award className="w-12 h-12 text-yellow-400" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              CERT-SER
            </h1>
          </div>
          <p className="text-xl text-white/80 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            التحقق من صحة الشهادات
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl text-white text-center">
                  البحث عن شهادة
                </CardTitle>
                <CardDescription className="text-white/70 text-center">
                  أدخل رقم الشهادة للتحقق من صحتها
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="certNumber" className="text-white">رقم الشهادة</Label>
                    <div className="flex gap-2">
                      <Input
                        id="certNumber"
                        value={certificateNumber}
                        onChange={(e) => setCertificateNumber(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 flex-1"
                        placeholder="CERT-XXXX-XXXX-XXXX"
                        data-testid="input-certificate-number"
                      />
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        disabled={searchMutation.isPending || !certificateNumber.trim()}
                        data-testid="button-search"
                      >
                        {searchMutation.isPending ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles className="w-5 h-5" />
                          </motion.div>
                        ) : (
                          <>
                            <Search className="w-5 h-5 ml-2" />
                            بحث
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Certificate Result */}
          <AnimatePresence mode="wait">
            {certificate && (
              <motion.div
                key="certificate-found"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-lg border-green-300/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl text-white flex items-center gap-2">
                        <CheckCircle className="w-8 h-8 text-green-400" />
                        شهادة صالحة
                      </CardTitle>
                      <Badge className="bg-green-500/30 text-green-200 border-green-300/50 text-lg px-4 py-2">
                        معتمدة ✓
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4">
                      <div className="bg-white/10 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-5 h-5 text-purple-400" />
                          <span className="text-sm text-white/70">اسم الطالب</span>
                        </div>
                        <p className="text-xl text-white font-semibold">
                          {certificate.studentName || "غير متوفر"}
                        </p>
                      </div>

                      <div className="bg-white/10 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="w-5 h-5 text-blue-400" />
                          <span className="text-sm text-white/70">اسم الدورة</span>
                        </div>
                        <p className="text-xl text-white font-semibold">
                          {certificate.courseName || "غير متوفر"}
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white/10 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Trophy className="w-5 h-5 text-yellow-400" />
                            <span className="text-sm text-white/70">رقم الشهادة</span>
                          </div>
                          <p className="text-lg text-white font-mono">
                            {certificate.certificateNumber}
                          </p>
                        </div>

                        <div className="bg-white/10 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-5 h-5 text-pink-400" />
                            <span className="text-sm text-white/70">تاريخ الإصدار</span>
                          </div>
                          <p className="text-lg text-white">
                            {new Date(certificate.issueDate).toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-white/20" />

                    <div className="flex gap-3">
                      <Button 
                        className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                        data-testid="button-download-certificate"
                      >
                        <Download className="w-5 h-5 ml-2" />
                        تحميل الشهادة
                      </Button>
                      <Button
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        onClick={() => {
                          setCertificate(null);
                          setCertificateNumber("");
                        }}
                        data-testid="button-search-another"
                      >
                        بحث عن شهادة أخرى
                      </Button>
                    </div>

                    <div className="bg-blue-500/20 border border-blue-500/30 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                        <div>
                          <p className="text-white font-semibold mb-1">تم التحقق بنجاح</p>
                          <p className="text-sm text-white/70">
                            هذه الشهادة صادرة من منصة معك وهي صالحة ومعتمدة رسمياً
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info Card */}
          {!certificate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Award className="w-6 h-6 text-yellow-400 mt-1" />
                    <div>
                      <h3 className="text-white font-semibold mb-2">كيفية استخدام نظام التحقق</h3>
                      <ul className="space-y-2 text-sm text-white/70">
                        <li>• أدخل رقم الشهادة الموجود على الشهادة الأصلية</li>
                        <li>• اضغط على زر "بحث" للتحقق من صحة الشهادة</li>
                        <li>• سيتم عرض جميع معلومات الشهادة إذا كانت صالحة</li>
                        <li>• يمكنك تحميل نسخة رقمية من الشهادة</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
