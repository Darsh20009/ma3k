import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Users, 
  Video, 
  Code2, 
  Settings, 
  LogOut, 
  UserPlus, 
  Key,
  Monitor,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Share,
  MessageSquare,
  Coffee,
  Clock,
  Calendar,
  Database,
  Globe,
  FileText,
  Award,
  FileCheck,
  Calculator,
  Download,
  Copy,
  Eye,
  Plus,
  Trash2,
  Save,
  Play,
  Zap,
  X,
  Heart,
  Star,
  RotateCcw,
  Badge as BadgeIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Employee {
  id: string;
  name: string;
  password: string;
  role: string;
  active: boolean;
}

interface Meeting {
  id: string;
  title: string;
  participants: string[];
  startTime: Date;
  isActive: boolean;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
}

interface Contract {
  id: string;
  clientName: string;
  serviceType: string;
  price: number;
  duration: string;
  startDate: string;
  terms: string;
}

export default function EmployeeDashboard() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading, isEmployee, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");
  
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
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([
    { id: "1", name: "أحمد محمد", password: "emp123", role: "مطور", active: true },
    { id: "2", name: "فاطمة علي", password: "emp456", role: "مصممة", active: true },
    { id: "3", name: "محمد سالم", password: "emp789", role: "مدير مشاريع", active: false },
  ]);
  const [newEmployee, setNewEmployee] = useState({ name: "", role: "", password: "" });
  const [currentMeeting, setCurrentMeeting] = useState<Meeting | null>(null);
  const [meetingSettings, setMeetingSettings] = useState({
    micEnabled: true,
    cameraEnabled: true,
    screenSharing: false
  });
  
  // Menu Builder State
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [newMenuItem, setNewMenuItem] = useState({ name: "", price: 0, category: "", description: "" });
  
  // Website Generator State
  const [websiteData, setWebsiteData] = useState({
    name: "",
    bio: "",
    skills: "",
    contact: "",
    color: "#3b82f6"
  });
  
  // Contract Generator State
  const [contractData, setContractData] = useState<Contract>({
    id: `CON-${Date.now()}`,
    clientName: "",
    serviceType: "",
    price: 0,
    duration: "",
    startDate: new Date().toISOString().split('T')[0],
    terms: ""
  });

  // Invoice Generator State
  const [invoiceData, setInvoiceData] = useState({
    clientName: "",
    invoiceNumber: `INV-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    items: [{ description: '', quantity: 1, price: 0 }]
  });

  // Form Generator State  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fields: [{ label: '', type: 'text', required: false, options: [] }]
  });
  
  // Pricing Calculator State
  const [pricingData, setPricingData] = useState({
    serviceType: "",
    complexity: "basic",
    features: [] as string[],
    timeframe: "1-2 weeks",
    basePrice: 0,
    finalPrice: 0
  });

  useEffect(() => {
    // التحقق من تسجيل الدخول
    const employee = localStorage.getItem("employee");
    if (!employee) {
      window.location.href = "/employee-login";
      return;
    }
    setCurrentEmployee(JSON.parse(employee));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("employee");
    toast({
      title: "تم تسجيل الخروج",
      description: "شكراً لك، أراك قريباً",
    });
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  const addEmployee = () => {
    if (newEmployee.name && newEmployee.role && newEmployee.password) {
      const employee: Employee = {
        id: Date.now().toString(),
        name: newEmployee.name,
        password: newEmployee.password,
        role: newEmployee.role,
        active: true
      };
      setEmployees([...employees, employee]);
      setNewEmployee({ name: "", role: "", password: "" });
      
      toast({
        title: "تم إضافة الموظف",
        description: `تم إضافة ${employee.name} بنجاح`,
      });
    }
  };

  const startMeeting = () => {
    const meeting: Meeting = {
      id: Date.now().toString(),
      title: `اجتماع ${new Date().toLocaleTimeString('ar-SA')}`,
      participants: [currentEmployee?.name || "المشرف"],
      startTime: new Date(),
      isActive: true
    };
    setCurrentMeeting(meeting);
    
    toast({
      title: "تم بدء الاجتماع",
      description: "مرحباً بك في Ma3k Meet",
    });
  };

  const endMeeting = () => {
    setCurrentMeeting(null);
    toast({
      title: "تم إنهاء الاجتماع",
      description: "شكراً لمشاركتك",
    });
  };

  const toggleEmployeeStatus = (id: string) => {
    setEmployees(employees.map(emp => 
      emp.id === id ? { ...emp, active: !emp.active } : emp
    ));
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewEmployee({ ...newEmployee, password });
  };

  if (!currentEmployee) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-white">جاري التحميل...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800/90 backdrop-blur border-b border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                <span className="text-black font-bold">{currentEmployee.name.charAt(0)}</span>
              </div>
              <div>
                <h1 className="text-white font-bold">لوحة تحكم الموظفين</h1>
                <p className="text-gray-400 text-sm">مرحباً، {currentEmployee.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-gray-300 text-sm">
                <Clock className="w-4 h-4 inline mr-2" />
                {new Date().toLocaleTimeString('ar-SA')}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-6">
              <nav className="space-y-2">
                {[
                  { id: "dashboard", label: "الرئيسية", icon: Monitor },
                  { id: "menu-builder", label: "مولد المنيو", icon: Coffee },
                  { id: "website-generator", label: "مولد المواقع", icon: Globe },
                  { id: "invoice-generator", label: "مولد الفواتير", icon: FileText },
                  { id: "forms-system", label: "نظام الاستمارات", icon: MessageSquare },
                  { id: "portfolio", label: "معرض الأعمال", icon: Award },
                  { id: "code-playground", label: "معك كود", icon: Code2 },
                  { id: "meeting", label: "Ma3k Meet", icon: Video },
                  { id: "contract-generator", label: "مولد العقود", icon: FileCheck },
                  { id: "price-calculator", label: "حاسبة الأسعار", icon: Calculator },
                  { id: "employees", label: "إدارة الموظفين", icon: Users },
                  { id: "settings", label: "الإعدادات", icon: Settings },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === item.id
                        ? "bg-amber-500 text-black"
                        : "text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "dashboard" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">لوحة التحكم الرئيسية</h2>
                  
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-900/20 rounded-xl p-4 border border-blue-500/30">
                      <Users className="w-8 h-8 text-blue-400 mb-2" />
                      <div className="text-2xl font-bold text-white">{employees.length}</div>
                      <div className="text-gray-300 text-sm">إجمالي الموظفين</div>
                    </div>
                    
                    <div className="bg-green-900/20 rounded-xl p-4 border border-green-500/30">
                      <Video className="w-8 h-8 text-green-400 mb-2" />
                      <div className="text-2xl font-bold text-white">{currentMeeting ? "1" : "0"}</div>
                      <div className="text-gray-300 text-sm">اجتماعات نشطة</div>
                    </div>
                    
                    <div className="bg-amber-900/20 rounded-xl p-4 border border-amber-500/30">
                      <Clock className="w-8 h-8 text-amber-400 mb-2" />
                      <div className="text-2xl font-bold text-white">24/7</div>
                      <div className="text-gray-300 text-sm">متاح للعمل</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-800/50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-white mb-4">الوصول السريع</h3>
                      <div className="space-y-3">
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={startMeeting}
                        >
                          <Video className="w-4 h-4 mr-2" />
                          بدء اجتماع فوري
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-gray-600 text-gray-300"
                          onClick={() => setActiveTab("employees")}
                        >
                          <Users className="w-4 h-4 mr-2" />
                          إدارة الموظفين
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-gray-600 text-gray-300"
                          onClick={() => setActiveTab("tools")}
                        >
                          <Code2 className="w-4 h-4 mr-2" />
                          أدوات التطوير
                        </Button>
                      </div>
                    </div>

                    <div className="bg-gray-800/50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-white mb-4">النشاط الأخير</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-300">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          تم تسجيل الدخول بنجاح
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          تم تحديث بيانات الموظفين
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                          تم إنشاء كلمات مرور جديدة
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "meeting" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Ma3k Meet - الاجتماعات الافتراضية</h2>
                  
                  {!currentMeeting ? (
                    <div className="text-center py-12">
                      <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">لا يوجد اجتماع نشط</h3>
                      <p className="text-gray-300 mb-6">ابدأ اجتماعاً جديداً للتواصل مع فريقك</p>
                      
                      <div className="space-y-4">
                        <Button
                          onClick={startMeeting}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full"
                        >
                          <Video className="w-5 h-5 mr-2" />
                          بدء اجتماع سريع
                        </Button>
                        <Button
                          onClick={() => window.open('/ma3k-meet', '_blank')}
                          variant="outline"
                          className="border-blue-500 text-blue-400 font-bold py-3 px-8 rounded-full"
                        >
                          <Video className="w-5 h-5 mr-2" />
                          فتح Ma3k Meet الكامل
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {/* Meeting Interface */}
                      <div className="bg-gray-900 rounded-xl p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-white">{currentMeeting.title}</h3>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-red-400 text-sm">مباشر</span>
                          </div>
                        </div>
                        
                        {/* Video Area - Enhanced with Virtual Participants */}
                        <div className="bg-black rounded-lg h-64 mb-4 p-4">
                          <div className="grid grid-cols-2 gap-4 h-full">
                            {/* Main Speaker */}
                            <div className="flex items-center justify-center">
                              <div className="text-center">
                                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                  <span className="text-black font-bold text-xl">{currentEmployee.name.charAt(0)}</span>
                                </div>
                                <p className="text-white text-sm">{currentEmployee.name}</p>
                                <div className="flex items-center justify-center gap-1 mt-1">
                                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                  <span className="text-red-400 text-xs">يتحدث</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Virtual Participants */}
                            <div className="grid grid-cols-2 gap-2">
                              <div className="bg-gray-800 rounded-lg p-2 flex flex-col items-center justify-center">
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mb-1">
                                  <span className="text-white font-bold text-sm">AM</span>
                                </div>
                                <p className="text-white text-xs">أحمد محمد</p>
                                <div className="w-1 h-1 bg-green-500 rounded-full mt-1"></div>
                              </div>
                              
                              <div className="bg-gray-800 rounded-lg p-2 flex flex-col items-center justify-center">
                                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mb-1">
                                  <span className="text-white font-bold text-sm">FA</span>
                                </div>
                                <p className="text-white text-xs">فاطمة علي</p>
                                <div className="w-1 h-1 bg-green-500 rounded-full mt-1"></div>
                              </div>
                              
                              <div className="bg-gray-800 rounded-lg p-2 flex flex-col items-center justify-center">
                                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mb-1">
                                  <span className="text-white font-bold text-sm">SA</span>
                                </div>
                                <p className="text-white text-xs">سعد الأحمد</p>
                                <div className="w-1 h-1 bg-yellow-500 rounded-full mt-1"></div>
                              </div>
                              
                              <div className="bg-gray-800 rounded-lg p-2 flex flex-col items-center justify-center">
                                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center mb-1">
                                  <Users className="w-5 h-5 text-gray-400" />
                                </div>
                                <p className="text-gray-400 text-xs">+2 آخرين</p>
                                <div className="w-1 h-1 bg-gray-500 rounded-full mt-1"></div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Live Chat Overlay */}
                          <div className="absolute bottom-2 left-2 bg-gray-900/80 rounded-lg p-2 max-w-48">
                            <div className="text-xs space-y-1">
                              <div className="text-blue-400">أحمد: فكرة ممتازة! 👍</div>
                              <div className="text-purple-400">فاطمة: سأعمل على التصميم</div>
                              <div className="text-green-400">سعد: متى نبدأ التطوير؟</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Meeting Controls */}
                        <div className="flex items-center justify-center gap-4">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setMeetingSettings({...meetingSettings, micEnabled: !meetingSettings.micEnabled})}
                            className={meetingSettings.micEnabled ? "border-green-500 text-green-500" : "border-red-500 text-red-500"}
                          >
                            {meetingSettings.micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setMeetingSettings({...meetingSettings, cameraEnabled: !meetingSettings.cameraEnabled})}
                            className={meetingSettings.cameraEnabled ? "border-green-500 text-green-500" : "border-red-500 text-red-500"}
                          >
                            {meetingSettings.cameraEnabled ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setMeetingSettings({...meetingSettings, screenSharing: !meetingSettings.screenSharing})}
                            className={meetingSettings.screenSharing ? "border-blue-500 text-blue-500" : "border-gray-500 text-gray-500"}
                          >
                            <Share className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-gray-500 text-gray-500"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            onClick={endMeeting}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            إنهاء الاجتماع
                          </Button>
                        </div>
                      </div>
                      
                      {/* Ma3k Code Tool - Enhanced */}
                      <div className="bg-gray-800/50 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-bold text-white">معك كود - أداة الترميز التعاونية</h4>
                          <Button
                            size="sm"
                            onClick={() => window.open('/code-tool', '_blank')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            فتح الأداة الكاملة
                          </Button>
                        </div>
                        
                        {/* Live Coding Area */}
                        <div className="bg-gray-900 rounded-lg p-4 mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="text-gray-300 text-sm ml-2">ملف جديد</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 text-xs">JavaScript</span>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-green-400 text-xs">3 مطورين متصلين</span>
                              </div>
                            </div>
                          </div>
                          <textarea
                            className="w-full bg-transparent text-green-400 font-mono text-sm resize-none"
                            rows={10}
                            defaultValue={`// مرحباً بكم في معك كود التعاوني!
// يمكن لعدة مطورين العمل معاً هنا

function createWebsite(name, type) {
    console.log(\`إنشاء موقع \${name} من نوع \${type}\`);
    return {
        name: name,
        type: type,
        features: ['responsive', 'dark-mode', 'rtl'],
        generateHTML: function() {
            return \`<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <title>\${this.name}</title>
</head>
<body>
    <h1>مرحباً بكم في \${this.name}</h1>
</body>
</html>\`;
        }
    };
}

// تشغيل المثال
const myWebsite = createWebsite('موقعي الجديد', 'شخصي');
console.log(myWebsite.generateHTML());`}
                          />
                        </div>
                        
                        {/* Interactive Features */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-gray-700/50 rounded-lg p-3">
                            <h5 className="text-white text-sm font-bold mb-2">المطورين المتصلين</h5>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                                  AM
                                </div>
                                <span className="text-gray-300 text-xs">أحمد محمد</span>
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">
                                  FA
                                </div>
                                <span className="text-gray-300 text-xs">فاطمة علي</span>
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                                  SA
                                </div>
                                <span className="text-gray-300 text-xs">سعد الأحمد</span>
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-700/50 rounded-lg p-3">
                            <h5 className="text-white text-sm font-bold mb-2">الدردشة المباشرة</h5>
                            <div className="space-y-2 max-h-20 overflow-y-auto">
                              <div className="text-xs">
                                <span className="text-blue-400">أحمد:</span>
                                <span className="text-gray-300"> ممتاز! الكود يعمل بشكل رائع</span>
                              </div>
                              <div className="text-xs">
                                <span className="text-purple-400">فاطمة:</span>
                                <span className="text-gray-300"> سأضيف التصميم CSS</span>
                              </div>
                              <div className="text-xs">
                                <span className="text-green-400">سعد:</span>
                                <span className="text-gray-300"> هل يمكننا إضافة قاعدة بيانات؟</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Enhanced Action Buttons */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-green-500 text-green-500"
                            onClick={() => toast({ title: "تم تشغيل الكود", description: "النتيجة تظهر في وحدة التحكم" })}
                          >
                            <Play className="w-3 h-3 mr-1" />
                            تشغيل
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-blue-500 text-blue-500"
                            onClick={() => toast({ title: "تم المشاركة", description: "تم مشاركة الكود مع الفريق" })}
                          >
                            <Share className="w-3 h-3 mr-1" />
                            مشاركة
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-amber-500 text-amber-500"
                            onClick={() => toast({ title: "تم الحفظ", description: "تم حفظ الكود بنجاح" })}
                          >
                            <Save className="w-3 h-3 mr-1" />
                            حفظ
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-purple-500 text-purple-500"
                            onClick={() => toast({ title: "دمج الكود", description: "سيتم دمج HTML, CSS, JS" })}
                          >
                            <Code2 className="w-3 h-3 mr-1" />
                            دمج
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-gray-500 text-gray-300"
                            onClick={() => window.open('/code-tool', '_blank')}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            معاينة
                          </Button>
                        </div>
                        
                        {/* Meeting Summary Integration */}
                        <div className="mt-4 p-3 bg-amber-900/20 border border-amber-500/30 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h6 className="text-amber-400 font-bold text-sm">ملخص الاجتماع التفاعلي</h6>
                            <Button size="sm" variant="outline" className="border-amber-500 text-amber-400 text-xs px-2 py-1">
                              إضافة ملخص
                            </Button>
                          </div>
                          <textarea
                            placeholder="اكتب ملخص الاجتماع هنا وسيتفاعل أعضاء الفريق معه تلقائياً..."
                            className="w-full bg-gray-800/50 text-gray-300 p-2 rounded text-xs resize-none"
                            rows={3}
                            onChange={(e) => {
                              if (e.target.value.length > 10) {
                                setTimeout(() => {
                                  toast({ 
                                    title: "تفاعل الفريق", 
                                    description: "أعضاء الفريق يتفاعلون مع ملخص الاجتماع" 
                                  });
                                }, 2000);
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "employees" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">إدارة الموظفين</h2>
                  
                  {/* Add Employee Form */}
                  <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-bold text-white mb-4">إضافة موظف جديد</h3>
                    <div className="grid md:grid-cols-4 gap-4">
                      <Input
                        placeholder="اسم الموظف"
                        value={newEmployee.name}
                        onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                      <Input
                        placeholder="المنصب"
                        value={newEmployee.role}
                        onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                      <div className="flex gap-2">
                        <Input
                          placeholder="كلمة المرور"
                          value={newEmployee.password}
                          onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                        <Button
                          type="button"
                          size="icon"
                          onClick={generatePassword}
                          className="bg-amber-500 hover:bg-amber-600"
                        >
                          <Key className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button onClick={addEmployee} className="bg-green-600 hover:bg-green-700">
                        <UserPlus className="w-4 h-4 mr-2" />
                        إضافة
                      </Button>
                    </div>
                  </div>
                  
                  {/* Employees List */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">قائمة الموظفين</h3>
                    {employees.map((employee) => (
                      <div key={employee.id} className="bg-gray-800/50 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">{employee.name.charAt(0)}</span>
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{employee.name}</h4>
                            <p className="text-gray-400 text-sm">{employee.role}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-sm">
                            <span className="text-gray-300">كلمة المرور: </span>
                            <span className="text-amber-400 font-mono">{employee.password}</span>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs ${
                            employee.active 
                              ? "bg-green-900/50 text-green-400 border border-green-500/50" 
                              : "bg-red-900/50 text-red-400 border border-red-500/50"
                          }`}>
                            {employee.active ? "نشط" : "غير نشط"}
                          </div>
                          <Button
                            size="sm"
                            onClick={() => toggleEmployeeStatus(employee.id)}
                            className={employee.active ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                          >
                            {employee.active ? "إلغاء تفعيل" : "تفعيل"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Password List for Admin */}
                  <div className="mt-8 bg-amber-900/20 border border-amber-500/30 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-amber-400 mb-4">كلمات المرور للإرسال للموظفين</h3>
                    <div className="space-y-2">
                      {employees.map((employee) => (
                        <div key={employee.id} className="flex justify-between items-center py-2 px-4 bg-gray-800/30 rounded-lg">
                          <span className="text-gray-300">{employee.name}</span>
                          <span className="text-amber-400 font-mono">{employee.password}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Revolutionary Menu Builder */}
            {activeTab === "menu-builder" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="glass-card rounded-2xl p-8 bg-gradient-to-br from-orange-900/20 via-red-900/20 to-yellow-900/20 border border-orange-500/30">
                  <div className="text-center mb-8">
                    <motion.div
                      className="inline-flex items-center gap-4 mb-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl">
                        <span className="text-3xl">🍽️</span>
                      </div>
                      <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500">
                        مولد المنيو الذكي AI
                      </h2>
                      <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl">
                        <span className="text-3xl">🤖</span>
                      </div>
                    </motion.div>
                    <p className="text-xl text-orange-200">إنشاء منيوهات احترافية بالذكاء الاصطناعي والتصميم التفاعلي</p>
                  </div>
                  
                  {/* Smart Menu Categories */}
                  <div className="grid md:grid-cols-4 gap-6 mb-8">
                    {[
                      { name: "مقبلات", icon: "🥗", color: "from-green-500 to-emerald-500", items: 0 },
                      { name: "الطبق الرئيسي", icon: "🍖", color: "from-red-500 to-orange-500", items: 0 },
                      { name: "حلويات", icon: "🍰", color: "from-pink-500 to-purple-500", items: 0 },
                      { name: "مشروبات", icon: "🥤", color: "from-blue-500 to-cyan-500", items: 0 }
                    ].map((category) => (
                      <motion.div
                        key={category.name}
                        whileHover={{ scale: 1.05 }}
                        className={`bg-gradient-to-br ${category.color}/20 backdrop-blur-xl rounded-2xl p-6 border border-white/20 cursor-pointer`}
                        onClick={() => setNewMenuItem({...newMenuItem, category: category.name})}
                      >
                        <div className="text-center">
                          <div className="text-4xl mb-3">{category.icon}</div>
                          <h3 className="text-lg font-bold text-white mb-2">{category.name}</h3>
                          <p className="text-gray-300 text-sm">{menuItems.filter(item => item.category === category.name).length} صنف</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Advanced Menu Item Creator */}
                  <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-8 mb-6 border border-orange-500/20">
                    <div className="flex items-center gap-3 mb-6">
                      <Zap className="w-6 h-6 text-orange-400" />
                      <h3 className="text-2xl font-bold text-white">إنشاء صنف ذكي</h3>
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">AI مدعوم</Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                      <div className="space-y-2">
                        <label className="text-orange-300 font-medium">اسم الصنف</label>
                        <Input
                          placeholder="مثال: برجر اللحم المشوي"
                          value={newMenuItem.name}
                          onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
                          className="bg-gray-700/50 border-orange-500/30 text-white focus:border-orange-400 rounded-xl"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-orange-300 font-medium">السعر (ريال)</label>
                        <Input
                          type="number"
                          placeholder="49.99"
                          value={newMenuItem.price}
                          onChange={(e) => setNewMenuItem({...newMenuItem, price: parseFloat(e.target.value) || 0})}
                          className="bg-gray-700/50 border-orange-500/30 text-white focus:border-orange-400 rounded-xl"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-orange-300 font-medium">الفئة</label>
                        <select
                          value={newMenuItem.category}
                          onChange={(e) => setNewMenuItem({...newMenuItem, category: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-orange-500/30 rounded-xl text-white focus:border-orange-400"
                        >
                          <option value="">اختر الفئة</option>
                          <option value="مقبلات">🥗 مقبلات</option>
                          <option value="الطبق الرئيسي">🍖 الطبق الرئيسي</option>
                          <option value="حلويات">🍰 حلويات</option>
                          <option value="مشروبات">🥤 مشروبات</option>
                          <option value="سلطات">🥙 سلطات</option>
                          <option value="شوربات">🍲 شوربات</option>
                          <option value="مأكولات بحرية">🦐 مأكولات بحرية</option>
                          <option value="أطباق نباتية">🌱 أطباق نباتية</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <label className="text-orange-300 font-medium">وصف الصنف والمكونات</label>
                      <textarea
                        placeholder="اكتب وصفاً شهياً ومكونات الطبق..."
                        value={newMenuItem.description}
                        onChange={(e) => setNewMenuItem({...newMenuItem, description: e.target.value})}
                        className="w-full h-24 px-4 py-3 bg-gray-700/50 border border-orange-500/30 rounded-xl text-white focus:border-orange-400 resize-none"
                      />
                    </div>

                    {/* AI Suggestions */}
                    <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-4 mb-6">
                      <h4 className="text-orange-400 font-bold mb-3 flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        اقتراحات الذكاء الاصطناعي
                      </h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {[
                          "برجر اللحم المشوي مع صوص الباربكيو الخاص",
                          "سلطة القيصر مع الدجاج المتبل والجبن البارميزان",
                          "بيتزا الخضار المشكلة مع الجبن الموتزاريلا",
                          "شوربة العدس الأحمر مع الخضار المقطعة"
                        ].map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const [name, description] = suggestion.split(' مع ');
                              setNewMenuItem({...newMenuItem, name, description: description || suggestion});
                              toast({ title: "تم التطبيق", description: "تم تطبيق الاقتراح الذكي" });
                            }}
                            className="border-orange-500/30 text-orange-300 hover:bg-orange-500/10 text-xs justify-start"
                          >
                            <Zap className="w-3 h-3 mr-1" />
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        onClick={() => {
                          if (newMenuItem.name && newMenuItem.price && newMenuItem.category) {
                            const newItem = { 
                              ...newMenuItem, 
                              id: Date.now().toString(),
                              calories: Math.floor(Math.random() * 800) + 200,
                              prepTime: Math.floor(Math.random() * 25) + 5,
                              isPopular: Math.random() > 0.7,
                              isNew: Math.random() > 0.8
                            };
                            setMenuItems([...menuItems, newItem]);
                            setNewMenuItem({ name: "", price: 0, category: "", description: "" });
                            toast({ 
                              title: "🎉 تم إضافة الصنف", 
                              description: "تم إضافة الصنف بنجاح مع المعلومات الذكية" 
                            });
                          }
                        }}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-xl font-bold"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        إضافة صنف ذكي
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => {
                          // Auto-generate random menu item
                          const randomItems = [
                            { name: "برجر الدجاج الحار", price: 35, category: "الطبق الرئيسي", description: "دجاج مقرمش حار مع الخس والطماطم وصوص الثوم" },
                            { name: "سلطة الروكا والجوز", price: 28, category: "مقبلات", description: "أوراق الروكا الطازجة مع الجوز وجبن الماعز" },
                            { name: "تشيز كيك الفراولة", price: 22, category: "حلويات", description: "تشيز كيك كريمي مع قطع الفراولة الطازجة" },
                            { name: "عصير المانجو الطازج", price: 15, category: "مشروبات", description: "عصير مانجو طبيعي 100% مع النعناع" }
                          ];
                          const randomItem = randomItems[Math.floor(Math.random() * randomItems.length)];
                          setNewMenuItem(randomItem);
                          toast({ title: "🎲 تم التوليد", description: "تم إنشاء صنف عشوائي ذكي" });
                        }}
                        className="border-orange-500/30 text-orange-300 hover:bg-orange-500/10 px-6 py-3 rounded-xl"
                      >
                        <RotateCcw className="w-5 h-5 mr-2" />
                        توليد عشوائي
                      </Button>
                    </div>
                  </div>
                  
                  {/* Enhanced Menu Items Display */}
                  <div className="space-y-6 mb-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="text-3xl">📋</span>
                        قائمة الأصناف المحفوظة
                      </h3>
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2">
                        {menuItems.length} صنف
                      </Badge>
                    </div>
                    
                    {menuItems.length === 0 ? (
                      <motion.div 
                        className="text-center py-12 bg-orange-900/10 rounded-2xl border border-orange-500/20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div className="text-6xl mb-4">🍽️</div>
                        <h3 className="text-xl font-bold text-orange-300 mb-2">لا توجد أصناف بعد</h3>
                        <p className="text-orange-200">ابدأ بإضافة أصناف لذيذة لمنيوك!</p>
                      </motion.div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-6">
                        {menuItems.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/20 hover:border-orange-400/40 transition-all duration-300"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="text-2xl">
                                    {item.category === 'مقبلات' ? '🥗' :
                                     item.category === 'الطبق الرئيسي' ? '🍖' :
                                     item.category === 'حلويات' ? '🍰' :
                                     item.category === 'مشروبات' ? '🥤' :
                                     item.category === 'سلطات' ? '🥙' :
                                     item.category === 'شوربات' ? '🍲' :
                                     item.category === 'مأكولات بحرية' ? '🦐' :
                                     item.category === 'أطباق نباتية' ? '🌱' : '🍽️'}
                                  </span>
                                  <h4 className="text-lg font-bold text-white">{item.name}</h4>
                                  {item.isNew && (
                                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1">
                                      جديد
                                    </Badge>
                                  )}
                                  {item.isPopular && (
                                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-2 py-1">
                                      ⭐ شائع
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-4 mb-3">
                                  <Badge variant="outline" className="border-orange-500/30 text-orange-300 text-sm">
                                    {item.category}
                                  </Badge>
                                  <div className="text-2xl font-bold text-orange-400">
                                    {item.price} ر.س
                                  </div>
                                </div>
                                
                                {item.description && (
                                  <p className="text-gray-300 text-sm mb-3 leading-relaxed">{item.description}</p>
                                )}
                                
                                <div className="flex items-center gap-4 text-xs text-gray-400">
                                  {item.calories && (
                                    <div className="flex items-center gap-1">
                                      <Zap className="w-3 h-3" />
                                      <span>{item.calories} سعرة</span>
                                    </div>
                                  )}
                                  {item.prepTime && (
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      <span>{item.prepTime} دقيقة</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  setMenuItems(menuItems.filter(i => i.id !== item.id));
                                  toast({ title: "تم الحذف", description: "تم حذف الصنف بنجاح" });
                                }}
                                className="bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Revolutionary Export Options */}
                  <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                        <span className="text-3xl">🚀</span>
                        تصدير المنيو بأشكال متقدمة
                        <span className="text-3xl">✨</span>
                      </h3>
                      <p className="text-purple-200">اختر من بين أفضل التصاميم والأنماط</p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                      <Button
                        onClick={() => {
                          const modernMenuHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>منيو المطعم الفاخر</title>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Tajawal', sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; 
            min-height: 100vh;
            padding: 20px;
        }
        .menu-container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(20px);
            border-radius: 30px;
            padding: 40px;
            box-shadow: 0 25px 50px rgba(0,0,0,0.3);
        }
        .header { 
            text-align: center; 
            margin-bottom: 50px;
            border-bottom: 2px solid rgba(255,255,255,0.2);
            padding-bottom: 30px;
        }
        .header h1 { 
            font-size: 3.5em; 
            font-weight: 900;
            background: linear-gradient(45deg, #ffd700, #ff6b6b);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        .header p { 
            font-size: 1.2em; 
            opacity: 0.8;
            font-weight: 300;
        }
        .category { 
            margin-bottom: 50px;
            background: rgba(255,255,255,0.05);
            border-radius: 20px;
            padding: 30px;
        }
        .category-header {
            display: flex;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .category-icon { font-size: 2.5em; margin-left: 15px; }
        .category h2 { 
            font-size: 2.2em; 
            font-weight: 700;
            color: #ffd700;
        }
        .items-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 20px;
        }
        .item { 
            background: rgba(255,255,255,0.1);
            padding: 25px; 
            border-radius: 15px;
            transition: all 0.3s ease;
            border: 1px solid rgba(255,255,255,0.1);
        }
        .item:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.2);
            background: rgba(255,255,255,0.15);
        }
        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 15px;
        }
        .item h3 { 
            font-size: 1.4em; 
            font-weight: 600;
            margin-bottom: 5px;
        }
        .item-badges {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }
        .badge {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: 500;
        }
        .badge.new { background: linear-gradient(45deg, #4facfe, #00f2fe); }
        .badge.popular { background: linear-gradient(45deg, #fa709a, #fee140); }
        .price { 
            color: #ffd700; 
            font-weight: 900;
            font-size: 1.8em;
            text-shadow: 0 2px 10px rgba(255,215,0,0.3);
        }
        .description { 
            color: rgba(255,255,255,0.8); 
            font-size: 0.95em; 
            line-height: 1.6;
            margin-bottom: 15px;
        }
        .item-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.85em;
            color: rgba(255,255,255,0.6);
        }
        .footer {
            text-align: center;
            margin-top: 50px;
            padding-top: 30px;
            border-top: 1px solid rgba(255,255,255,0.1);
            font-size: 0.9em;
            opacity: 0.7;
        }
    </style>
</head>
<body>
    <div class="menu-container">
        <div class="header">
            <h1>🍽️ منيو المطعم الفاخر 🍽️</h1>
            <p>تجربة طعام استثنائية تنتظركم</p>
        </div>
        
        ${["مقبلات", "الطبق الرئيسي", "حلويات", "مشروبات", "سلطات", "شوربات", "مأكولات بحرية", "أطباق نباتية"].map(category => {
          const items = menuItems.filter(item => item.category === category);
          if (items.length === 0) return '';
          
          const categoryIcons = {
            "مقبلات": "🥗", "الطبق الرئيسي": "🍖", "حلويات": "🍰", 
            "مشروبات": "🥤", "سلطات": "🥙", "شوربات": "🍲", 
            "مأكولات بحرية": "🦐", "أطباق نباتية": "🌱"
          };
          
          return `
        <div class="category">
            <div class="category-header">
                <span class="category-icon">${categoryIcons[category] || '🍽️'}</span>
                <h2>${category}</h2>
            </div>
            <div class="items-grid">
                ${items.map(item => `
                <div class="item">
                    <div class="item-header">
                        <div>
                            <h3>${item.name}</h3>
                            <div class="item-badges">
                                ${item.isNew ? '<span class="badge new">جديد ✨</span>' : ''}
                                ${item.isPopular ? '<span class="badge popular">شائع ⭐</span>' : ''}
                            </div>
                        </div>
                        <div class="price">${item.price} ر.س</div>
                    </div>
                    ${item.description ? `<div class="description">${item.description}</div>` : ''}
                    <div class="item-footer">
                        <div>
                            ${item.calories ? `⚡ ${item.calories} سعرة` : ''}
                        </div>
                        <div>
                            ${item.prepTime ? `🕐 ${item.prepTime} دقيقة` : ''}
                        </div>
                    </div>
                </div>`).join('')}
            </div>
        </div>`;
        }).join('')}
        
        <div class="footer">
            <p>تم إنشاؤه بواسطة مولد المنيو الذكي - Ma3k Platform</p>
            <p>جميع الحقوق محفوظة © ${new Date().getFullYear()}</p>
        </div>
    </div>
</body>
</html>`;
                          const blob = new Blob([modernMenuHTML], { type: 'text/html' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `luxury-menu-${Date.now()}.html`;
                          a.click();
                          toast({ 
                            title: "🎨 تم التحميل!", 
                            description: "تم تحميل المنيو الفاخر بنجاح" 
                          });
                        }}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-4 rounded-xl font-bold"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        منيو فاخر
                      </Button>
                      
                      <Button
                        onClick={() => {
                          // Create minimalist menu style
                          const minimalMenuHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>منيو بسيط</title>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Tajawal', sans-serif; 
            background: #f8fafc;
            color: #334155; 
            padding: 40px 20px;
            line-height: 1.6;
        }
        .container { 
            max-width: 800px; 
            margin: 0 auto; 
            background: white;
            border-radius: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header { 
            background: linear-gradient(135deg, #2dd4bf, #06b6d4);
            color: white;
            text-align: center; 
            padding: 40px 20px;
        }
        .header h1 { 
            font-size: 2.5rem; 
            font-weight: 700;
            margin-bottom: 10px;
        }
        .content { padding: 40px; }
        .category { 
            margin-bottom: 40px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 30px;
        }
        .category:last-child { border-bottom: none; }
        .category h2 { 
            font-size: 1.8rem; 
            font-weight: 600;
            color: #0f766e;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .item { 
            display: flex;
            justify-content: space-between;
            align-items: start;
            padding: 15px 0;
            border-bottom: 1px solid #f1f5f9;
        }
        .item:last-child { border-bottom: none; }
        .item-info h3 { 
            font-size: 1.1rem; 
            font-weight: 500;
            margin-bottom: 5px;
        }
        .item-info p { 
            color: #64748b; 
            font-size: 0.9rem;
        }
        .price { 
            color: #0f766e; 
            font-weight: 700;
            font-size: 1.2rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌿 منيو بسيط وأنيق</h1>
            <p>قائمة طعام نظيفة وواضحة</p>
        </div>
        <div class="content">
            ${["مقبلات", "الطبق الرئيسي", "حلويات", "مشروبات"].map(category => {
              const items = menuItems.filter(item => item.category === category);
              if (items.length === 0) return '';
              const categoryIcons = {
                "مقبلات": "🥗", "الطبق الرئيسي": "🍖", 
                "حلويات": "🍰", "مشروبات": "🥤"
              };
              return `
            <div class="category">
                <h2>${categoryIcons[category] || '🍽️'} ${category}</h2>
                ${items.map(item => `
                <div class="item">
                    <div class="item-info">
                        <h3>${item.name}</h3>
                        ${item.description ? `<p>${item.description}</p>` : ''}
                    </div>
                    <div class="price">${item.price} ر.س</div>
                </div>`).join('')}
            </div>`;
            }).join('')}
        </div>
    </div>
</body>
</html>`;
                          const blob = new Blob([minimalMenuHTML], { type: 'text/html' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `minimal-menu-${Date.now()}.html`;
                          a.click();
                          toast({ 
                            title: "🌿 تم التحميل!", 
                            description: "تم تحميل المنيو البسيط بنجاح" 
                          });
                        }}
                        className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6 py-4 rounded-xl font-bold"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        منيو بسيط
                      </Button>
                      
                      <Button
                        onClick={() => {
                          // Create dark elegant menu
                          const darkMenuHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>منيو داكن أنيق</title>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Tajawal', sans-serif; 
            background: #0f172a;
            color: #e2e8f0; 
            padding: 20px;
        }
        .container { 
            max-width: 1000px; 
            margin: 0 auto; 
            background: #1e293b;
            border-radius: 20px;
            border: 1px solid #334155;
            overflow: hidden;
        }
        .header { 
            background: linear-gradient(135deg, #7c3aed, #c026d3);
            text-align: center; 
            padding: 50px 20px;
        }
        .header h1 { 
            font-size: 3rem; 
            font-weight: 900;
            margin-bottom: 10px;
            text-shadow: 0 4px 20px rgba(124, 58, 237, 0.5);
        }
        .content { padding: 40px; }
        .category { 
            margin-bottom: 50px;
            background: #334155;
            border-radius: 15px;
            padding: 30px;
            border: 1px solid #475569;
        }
        .category h2 { 
            font-size: 2rem; 
            font-weight: 700;
            color: #c026d3;
            margin-bottom: 25px;
            text-align: center;
        }
        .items { 
            display: grid;
            gap: 20px;
        }
        .item { 
            background: #475569;
            padding: 25px;
            border-radius: 12px;
            border: 1px solid #64748b;
            transition: all 0.3s ease;
        }
        .item:hover {
            background: #64748b;
            transform: translateY(-2px);
        }
        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 10px;
        }
        .item h3 { 
            font-size: 1.3rem; 
            font-weight: 600;
            color: #f1f5f9;
        }
        .price { 
            color: #fbbf24; 
            font-weight: 900;
            font-size: 1.4rem;
        }
        .description { 
            color: #cbd5e1; 
            font-size: 0.95rem;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚫ منيو داكن أنيق</h1>
            <p>تجربة فاخرة في الظلام</p>
        </div>
        <div class="content">
            ${["مقبلات", "الطبق الرئيسي", "حلويات", "مشروبات"].map(category => {
              const items = menuItems.filter(item => item.category === category);
              if (items.length === 0) return '';
              return `
            <div class="category">
                <h2>${category}</h2>
                <div class="items">
                    ${items.map(item => `
                    <div class="item">
                        <div class="item-header">
                            <h3>${item.name}</h3>
                            <div class="price">${item.price} ر.س</div>
                        </div>
                        ${item.description ? `<div class="description">${item.description}</div>` : ''}
                    </div>`).join('')}
                </div>
            </div>`;
            }).join('')}
        </div>
    </div>
</body>
</html>`;
                          const blob = new Blob([darkMenuHTML], { type: 'text/html' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `dark-menu-${Date.now()}.html`;
                          a.click();
                          toast({ 
                            title: "⚫ تم التحميل!", 
                            description: "تم تحميل المنيو الداكن بنجاح" 
                          });
                        }}
                        className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white px-6 py-4 rounded-xl font-bold"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        منيو داكن
                      </Button>
                    </div>

                    <div className="text-center">
                      <p className="text-purple-200 text-sm">
                        💡 كل تصميم محسن للهواتف والأجهزة اللوحية وأجهزة الكمبيوتر
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Revolutionary Invoice Generator */}
            {activeTab === "invoice-generator" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="glass-card rounded-2xl p-8 bg-gradient-to-br from-emerald-900/20 via-teal-900/20 to-cyan-900/20 border border-emerald-500/30">
                  <div className="text-center mb-8">
                    <motion.div
                      className="inline-flex items-center gap-4 mb-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl">
                        <span className="text-3xl">📄</span>
                      </div>
                      <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500">
                        مولد الفواتير الذكي AI
                      </h2>
                      <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                        <span className="text-3xl">💰</span>
                      </div>
                    </motion.div>
                    <p className="text-xl text-emerald-200">إنشاء فواتير احترافية بالذكاء الاصطناعي والتصميم المتقدم</p>
                  </div>

                  {/* Smart Invoice Creator */}
                  <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-8 mb-6 border border-emerald-500/20">
                    <div className="flex items-center gap-3 mb-6">
                      <FileText className="w-6 h-6 text-emerald-400" />
                      <h3 className="text-2xl font-bold text-white">إنشاء فاتورة ذكية</h3>
                      <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">AI مدعوم</Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                      <div className="space-y-2">
                        <label className="text-emerald-300 font-medium">اسم العميل</label>
                        <Input
                          placeholder="محمد أحمد العلي"
                          value={invoiceData.clientName}
                          onChange={(e) => setInvoiceData({...invoiceData, clientName: e.target.value})}
                          className="bg-gray-700/50 border-emerald-500/30 text-white focus:border-emerald-400 rounded-xl"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-emerald-300 font-medium">رقم الفاتورة</label>
                        <Input
                          placeholder="INV-2025-001"
                          value={invoiceData.invoiceNumber}
                          onChange={(e) => setInvoiceData({...invoiceData, invoiceNumber: e.target.value})}
                          className="bg-gray-700/50 border-emerald-500/30 text-white focus:border-emerald-400 rounded-xl"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-emerald-300 font-medium">تاريخ الفاتورة</label>
                        <Input
                          type="date"
                          value={invoiceData.date}
                          onChange={(e) => setInvoiceData({...invoiceData, date: e.target.value})}
                          className="bg-gray-700/50 border-emerald-500/30 text-white focus:border-emerald-400 rounded-xl"
                        />
                      </div>
                    </div>

                    {/* Invoice Items */}
                    <div className="mb-6">
                      <h4 className="text-emerald-300 font-bold mb-4 flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        البنود والخدمات
                      </h4>
                      
                      <div className="space-y-4">
                        {invoiceData.items.map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="grid md:grid-cols-5 gap-4 p-4 bg-emerald-900/20 border border-emerald-500/20 rounded-xl"
                          >
                            <Input
                              placeholder="وصف الخدمة"
                              value={item.description}
                              onChange={(e) => {
                                const newItems = [...invoiceData.items];
                                newItems[index].description = e.target.value;
                                setInvoiceData({...invoiceData, items: newItems});
                              }}
                              className="bg-gray-700/50 border-emerald-500/30 text-white rounded-xl"
                            />
                            <Input
                              type="number"
                              placeholder="الكمية"
                              value={item.quantity}
                              onChange={(e) => {
                                const newItems = [...invoiceData.items];
                                newItems[index].quantity = parseInt(e.target.value) || 0;
                                setInvoiceData({...invoiceData, items: newItems});
                              }}
                              className="bg-gray-700/50 border-emerald-500/30 text-white rounded-xl"
                            />
                            <Input
                              type="number"
                              placeholder="السعر"
                              value={item.price}
                              onChange={(e) => {
                                const newItems = [...invoiceData.items];
                                newItems[index].price = parseFloat(e.target.value) || 0;
                                setInvoiceData({...invoiceData, items: newItems});
                              }}
                              className="bg-gray-700/50 border-emerald-500/30 text-white rounded-xl"
                            />
                            <div className="text-emerald-400 font-bold text-lg flex items-center">
                              {(item.quantity * item.price).toFixed(2)} ر.س
                            </div>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                const newItems = invoiceData.items.filter((_, i) => i !== index);
                                setInvoiceData({...invoiceData, items: newItems});
                              }}
                              className="bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                      
                      <Button
                        onClick={() => {
                          setInvoiceData({
                            ...invoiceData,
                            items: [...invoiceData.items, { description: '', quantity: 1, price: 0 }]
                          });
                        }}
                        className="mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        إضافة بند جديد
                      </Button>
                    </div>

                    {/* Total Calculation */}
                    <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-6 mb-6">
                      <div className="flex justify-between items-center text-2xl font-bold">
                        <span className="text-emerald-300">المجموع الكلي:</span>
                        <span className="text-emerald-400">
                          {invoiceData.items.reduce((total, item) => total + (item.quantity * item.price), 0).toFixed(2)} ر.س
                        </span>
                      </div>
                    </div>

                    {/* Export Invoice Options */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <Button
                        onClick={() => {
                          const invoiceHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>فاتورة رقم ${invoiceData.invoiceNumber}</title>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Tajawal', sans-serif; 
            background: linear-gradient(135deg, #064e3b, #065f46);
            color: #f0fdf4; 
            padding: 40px 20px;
        }
        .invoice-container { 
            max-width: 800px; 
            margin: 0 auto; 
            background: rgba(255,255,255,0.05);
            backdrop-filter: blur(20px);
            border-radius: 25px;
            padding: 40px;
            border: 1px solid rgba(16, 185, 129, 0.3);
            box-shadow: 0 25px 50px rgba(0,0,0,0.3);
        }
        .header { 
            text-align: center; 
            margin-bottom: 40px;
            padding-bottom: 30px;
            border-bottom: 2px solid rgba(16, 185, 129, 0.3);
        }
        .header h1 { 
            font-size: 3rem; 
            font-weight: 900;
            background: linear-gradient(45deg, #10b981, #06d6a0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        .invoice-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 40px;
        }
        .info-section {
            background: rgba(16, 185, 129, 0.1);
            padding: 20px;
            border-radius: 15px;
            border: 1px solid rgba(16, 185, 129, 0.2);
        }
        .info-section h3 {
            color: #10b981;
            font-size: 1.2rem;
            margin-bottom: 10px;
            font-weight: 700;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            background: rgba(255,255,255,0.05);
            border-radius: 15px;
            overflow: hidden;
        }
        .items-table th {
            background: linear-gradient(135deg, #10b981, #059669);
            padding: 15px;
            text-align: center;
            font-weight: 700;
            color: white;
        }
        .items-table td {
            padding: 15px;
            text-align: center;
            border-bottom: 1px solid rgba(16, 185, 129, 0.2);
        }
        .items-table tr:hover {
            background: rgba(16, 185, 129, 0.1);
        }
        .total-section {
            background: linear-gradient(135deg, #059669, #047857);
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            margin-bottom: 30px;
        }
        .total-amount {
            font-size: 2.5rem;
            font-weight: 900;
            color: #dcfce7;
            text-shadow: 0 2px 10px rgba(5, 150, 105, 0.5);
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid rgba(16, 185, 129, 0.3);
            font-size: 0.9rem;
            opacity: 0.8;
        }
        @media print {
            body { background: white; color: black; }
            .invoice-container { 
                background: white; 
                border: 1px solid #ccc;
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <h1>📄 فاتورة ضريبية</h1>
            <p>شركة Ma3k للخدمات الرقمية</p>
        </div>
        
        <div class="invoice-info">
            <div class="info-section">
                <h3>📋 معلومات الفاتورة</h3>
                <p><strong>رقم الفاتورة:</strong> ${invoiceData.invoiceNumber}</p>
                <p><strong>التاريخ:</strong> ${invoiceData.date}</p>
                <p><strong>حالة الدفع:</strong> في الانتظار</p>
            </div>
            <div class="info-section">
                <h3>👤 معلومات العميل</h3>
                <p><strong>اسم العميل:</strong> ${invoiceData.clientName}</p>
                <p><strong>تاريخ الإصدار:</strong> ${new Date().toLocaleDateString('ar-SA')}</p>
            </div>
        </div>
        
        <table class="items-table">
            <thead>
                <tr>
                    <th>الوصف</th>
                    <th>الكمية</th>
                    <th>السعر الوحدة</th>
                    <th>المجموع</th>
                </tr>
            </thead>
            <tbody>
                ${invoiceData.items.map(item => `
                <tr>
                    <td>${item.description}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price.toFixed(2)} ر.س</td>
                    <td>${(item.quantity * item.price).toFixed(2)} ر.س</td>
                </tr>`).join('')}
            </tbody>
        </table>
        
        <div class="total-section">
            <h3 style="margin-bottom: 10px;">💰 إجمالي الفاتورة</h3>
            <div class="total-amount">
                ${invoiceData.items.reduce((total, item) => total + (item.quantity * item.price), 0).toFixed(2)} ر.س
            </div>
            <p style="margin-top: 10px; opacity: 0.9;">شامل ضريبة القيمة المضافة</p>
        </div>
        
        <div class="footer">
            <p>شكراً لتعاملكم معنا | Ma3k Platform</p>
            <p>جميع الحقوق محفوظة © ${new Date().getFullYear()}</p>
        </div>
    </div>
</body>
</html>`;
                          const blob = new Blob([invoiceHTML], { type: 'text/html' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `invoice-${invoiceData.invoiceNumber}-${Date.now()}.html`;
                          a.click();
                          URL.revokeObjectURL(url);
                          toast({ 
                            title: "💰 تم إنشاء الفاتورة!", 
                            description: "تم تحميل الفاتورة الاحترافية بنجاح" 
                          });
                        }}
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-4 rounded-xl font-bold"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        تحميل فاتورة HTML
                      </Button>
                      
                      <Button
                        onClick={() => {
                          // Generate PDF-ready version
                          const pdfInvoiceHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>فاتورة ${invoiceData.invoiceNumber}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: Arial, sans-serif; 
            color: #333; 
            padding: 20px;
            background: white;
        }
        .header { 
            text-align: center; 
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #10b981;
        }
        .header h1 { 
            font-size: 2.5rem; 
            color: #10b981;
            margin-bottom: 10px;
        }
        .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        .invoice-info, .client-info {
            background: #f0fdf4;
            padding: 20px;
            border-radius: 10px;
            width: 48%;
            border: 1px solid #10b981;
        }
        .invoice-info h3, .client-info h3 {
            color: #065f46;
            margin-bottom: 15px;
            font-size: 1.2rem;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .items-table th {
            background: #10b981;
            color: white;
            padding: 12px;
            text-align: center;
        }
        .items-table td {
            padding: 12px;
            text-align: center;
            border: 1px solid #d1fae5;
        }
        .total-row {
            background: #ecfdf5;
            font-weight: bold;
            font-size: 1.2rem;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #10b981;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>فاتورة ضريبية</h1>
        <p>شركة Ma3k للخدمات الرقمية</p>
    </div>
    
    <div class="invoice-details">
        <div class="invoice-info">
            <h3>معلومات الفاتورة</h3>
            <p><strong>رقم الفاتورة:</strong> ${invoiceData.invoiceNumber}</p>
            <p><strong>تاريخ الإصدار:</strong> ${invoiceData.date}</p>
            <p><strong>تاريخ الاستحقاق:</strong> ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('ar-SA')}</p>
        </div>
        <div class="client-info">
            <h3>بيانات العميل</h3>
            <p><strong>اسم العميل:</strong> ${invoiceData.clientName}</p>
            <p><strong>رقم العميل:</strong> ${Math.random().toString(36).substr(2, 8).toUpperCase()}</p>
        </div>
    </div>
    
    <table class="items-table">
        <thead>
            <tr>
                <th style="width: 50%;">وصف الخدمة/المنتج</th>
                <th style="width: 15%;">الكمية</th>
                <th style="width: 20%;">السعر الوحدة</th>
                <th style="width: 15%;">المجموع</th>
            </tr>
        </thead>
        <tbody>
            ${invoiceData.items.map(item => `
            <tr>
                <td style="text-align: right;">${item.description}</td>
                <td>${item.quantity}</td>
                <td>${item.price.toFixed(2)} ر.س</td>
                <td>${(item.quantity * item.price).toFixed(2)} ر.س</td>
            </tr>`).join('')}
            <tr class="total-row">
                <td colspan="3" style="text-align: right;">المجموع الإجمالي</td>
                <td>${invoiceData.items.reduce((total, item) => total + (item.quantity * item.price), 0).toFixed(2)} ر.س</td>
            </tr>
        </tbody>
    </table>
    
    <div class="footer">
        <p>شكراً لثقتكم بنا وتعاملكم معنا</p>
        <p>شركة Ma3k للخدمات الرقمية | جميع الحقوق محفوظة © ${new Date().getFullYear()}</p>
    </div>
</body>
</html>`;
                          const blob = new Blob([pdfInvoiceHTML], { type: 'text/html' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `invoice-print-${invoiceData.invoiceNumber}.html`;
                          a.click();
                          URL.revokeObjectURL(url);
                          toast({ 
                            title: "🖨️ تم التحميل!", 
                            description: "فاتورة جاهزة للطباعة" 
                          });
                        }}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-xl font-bold"
                      >
                        <FileText className="w-5 h-5 mr-2" />
                        نسخة للطباعة
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Revolutionary Form Generator */}
            {activeTab === "form-generator" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="glass-card rounded-2xl p-8 bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-blue-900/20 border border-purple-500/30">
                  <div className="text-center mb-8">
                    <motion.div
                      className="inline-flex items-center gap-4 mb-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl">
                        <span className="text-3xl">📝</span>
                      </div>
                      <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-500">
                        مولد الاستمارات الذكي AI
                      </h2>
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl">
                        <span className="text-3xl">⚡</span>
                      </div>
                    </motion.div>
                    <p className="text-xl text-purple-200">إنشاء استمارات تفاعلية متقدمة بالذكاء الاصطناعي</p>
                  </div>

                  {/* Form Builder */}
                  <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-8 mb-6 border border-purple-500/20">
                    <div className="flex items-center gap-3 mb-6">
                      <FileText className="w-6 h-6 text-purple-400" />
                      <h3 className="text-2xl font-bold text-white">بناء الاستمارة الذكية</h3>
                      <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">AI مدعوم</Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <label className="text-purple-300 font-medium">عنوان الاستمارة</label>
                        <Input
                          placeholder="استمارة طلب خدمة"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          className="bg-gray-700/50 border-purple-500/30 text-white focus:border-purple-400 rounded-xl"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-purple-300 font-medium">وصف الاستمارة</label>
                        <Input
                          placeholder="يرجى ملء البيانات المطلوبة"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          className="bg-gray-700/50 border-purple-500/30 text-white focus:border-purple-400 rounded-xl"
                        />
                      </div>
                    </div>

                    {/* Simple Export Button */}
                    <Button
                      onClick={() => {
                        const simpleFormHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>${formData.title || 'استمارة جديدة'}</title>
    <style>
        body { font-family: 'Tajawal', Arial, sans-serif; padding: 20px; background: #f5f5f5; }
        .form { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .form h1 { color: #333; text-align: center; margin-bottom: 20px; }
        .field { margin-bottom: 15px; }
        .field label { display: block; font-weight: bold; margin-bottom: 5px; color: #555; }
        .field input, .field select, .field textarea { width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px; }
        .submit { background: #667eea; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; width: 100%; font-size: 16px; }
    </style>
</head>
<body>
    <div class="form">
        <h1>${formData.title || 'استمارة جديدة'}</h1>
        <p>${formData.description || 'يرجى ملء البيانات التالية'}</p>
        <form>
            <div class="field">
                <label>الاسم الكامل *</label>
                <input type="text" required placeholder="أدخل اسمك الكامل">
            </div>
            <div class="field">
                <label>البريد الإلكتروني *</label>
                <input type="email" required placeholder="example@domain.com">
            </div>
            <div class="field">
                <label>رقم الهاتف</label>
                <input type="tel" placeholder="05xxxxxxxx">
            </div>
            <div class="field">
                <label>الرسالة</label>
                <textarea rows="5" placeholder="اكتب رسالتك هنا..."></textarea>
            </div>
            <button type="submit" class="submit">إرسال</button>
        </form>
    </div>
</body>
</html>`;
                        const blob = new Blob([simpleFormHTML], { type: 'text/html' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `form-${Date.now()}.html`;
                        a.click();
                        URL.revokeObjectURL(url);
                        toast({ 
                          title: "📝 تم إنشاء الاستمارة!", 
                          description: "تم تحميل الاستمارة بنجاح" 
                        });
                      }}
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-8 py-4 rounded-xl font-bold"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      إنشاء استمارة HTML
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Revolutionary Contract Generator */}
            {activeTab === "contract-generator" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="glass-card rounded-2xl p-8 bg-gradient-to-br from-red-900/20 via-pink-900/20 to-rose-900/20 border border-red-500/30">
                  <div className="text-center mb-8">
                    <motion.div
                      className="inline-flex items-center gap-4 mb-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
                        <span className="text-3xl">📋</span>
                      </div>
                      <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-500 to-rose-500">
                        مولد العقود الذكي AI
                      </h2>
                      <div className="w-16 h-16 bg-gradient-to-r from-rose-500 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl">
                        <span className="text-3xl">⚖️</span>
                      </div>
                    </motion.div>
                    <p className="text-xl text-red-200">إنشاء عقود قانونية احترافية بالذكاء الاصطناعي</p>
                  </div>

                  {/* Contract Builder */}
                  <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-8 mb-6 border border-red-500/20">
                    <div className="flex items-center gap-3 mb-6">
                      <FileCheck className="w-6 h-6 text-red-400" />
                      <h3 className="text-2xl font-bold text-white">إنشاء عقد ذكي</h3>
                      <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white">AI مدعوم</Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <label className="text-red-300 font-medium">اسم العميل</label>
                        <Input
                          placeholder="شركة التقنية المتقدمة"
                          value={contractData.clientName}
                          onChange={(e) => setContractData({...contractData, clientName: e.target.value})}
                          className="bg-gray-700/50 border-red-500/30 text-white focus:border-red-400 rounded-xl"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-red-300 font-medium">قيمة العقد (ريال)</label>
                        <Input
                          type="number"
                          placeholder="50000"
                          value={contractData.price}
                          onChange={(e) => setContractData({...contractData, price: parseFloat(e.target.value) || 0})}
                          className="bg-gray-700/50 border-red-500/30 text-white focus:border-red-400 rounded-xl"
                        />
                      </div>
                    </div>

                    {/* Simple Export Button */}
                    <Button
                      onClick={() => {
                        const contractHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>عقد تقديم خدمات - ${contractData.clientName || 'العميل'}</title>
    <style>
        body { font-family: 'Tajawal', Arial, sans-serif; padding: 40px 20px; background: white; color: #333; line-height: 1.8; }
        .contract { max-width: 800px; margin: 0 auto; border: 2px solid #dc2626; border-radius: 15px; padding: 50px; }
        .header { text-align: center; margin-bottom: 40px; padding-bottom: 30px; border-bottom: 3px solid #dc2626; }
        .header h1 { font-size: 2.5rem; color: #dc2626; margin-bottom: 10px; }
        .section { margin-bottom: 30px; background: #f9fafb; padding: 25px; border-radius: 10px; }
        .section h3 { color: #991b1b; font-size: 1.4rem; margin-bottom: 15px; }
        .amount { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 10px; font-size: 1.3rem; font-weight: 700; margin: 20px 0; }
        .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 50px; margin-top: 60px; text-align: center; }
        .signature-line { border-bottom: 2px solid #374151; width: 200px; margin: 30px auto 10px; }
    </style>
</head>
<body>
    <div class="contract">
        <div class="header">
            <h1>📋 عقد تقديم خدمات</h1>
            <p>عقد ملزم قانونياً بين الطرفين</p>
        </div>
        
        <div class="section">
            <h3>أطراف العقد</h3>
            <p><strong>الطرف الأول:</strong> شركة Ma3k للخدمات الرقمية</p>
            <p><strong>الطرف الثاني:</strong> ${contractData.clientName || 'العميل'}</p>
            <p><strong>تاريخ العقد:</strong> ${new Date().toLocaleDateString('ar-SA')}</p>
        </div>
        
        <div class="amount">
            💰 قيمة العقد: ${(contractData.price || 0).toLocaleString()} ريال سعودي
        </div>
        
        <div class="section">
            <h3>التزامات الطرف الأول</h3>
            <ul>
                <li>تقديم الخدمة وفقاً للمواصفات المتفق عليها</li>
                <li>الالتزام بالجودة العالية والمعايير المهنية</li>
                <li>تقديم الدعم الفني بعد التسليم</li>
            </ul>
        </div>
        
        <div class="section">
            <h3>التزامات الطرف الثاني</h3>
            <ul>
                <li>توفير جميع البيانات والمعلومات المطلوبة</li>
                <li>الدفع في المواعيد المحددة</li>
                <li>التعاون مع فريق العمل</li>
            </ul>
        </div>
        
        <div class="signatures">
            <div>
                <h4>الطرف الأول</h4>
                <p>شركة Ma3k للخدمات الرقمية</p>
                <div class="signature-line"></div>
                <p>التوقيع والختم</p>
            </div>
            <div>
                <h4>الطرف الثاني</h4>
                <p>${contractData.clientName || 'العميل'}</p>
                <div class="signature-line"></div>
                <p>التوقيع والختم</p>
            </div>
        </div>
    </div>
</body>
</html>`;
                        const blob = new Blob([contractHTML], { type: 'text/html' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `contract-${Date.now()}.html`;
                        a.click();
                        URL.revokeObjectURL(url);
                        toast({ 
                          title: "📋 تم إنشاء العقد!", 
                          description: "تم تحميل العقد القانوني بنجاح" 
                        });
                      }}
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-bold"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      إنشاء عقد HTML
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Personal Website Generator */}
            {activeTab === "website-generator" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">مولد المواقع الشخصية</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Input Form */}
                    <div className="space-y-4">
                      <Input
                        placeholder="اسمك"
                        value={websiteData.name}
                        onChange={(e) => setWebsiteData({...websiteData, name: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                      <textarea
                        placeholder="نبذة عنك"
                        value={websiteData.bio}
                        onChange={(e) => setWebsiteData({...websiteData, bio: e.target.value})}
                        className="w-full bg-gray-700 border border-gray-600 text-white p-3 rounded-md min-h-[100px]"
                      />
                      <Input
                        placeholder="مهاراتك (مفصولة بفاصلة)"
                        value={websiteData.skills}
                        onChange={(e) => setWebsiteData({...websiteData, skills: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                      <Input
                        placeholder="معلومات التواصل"
                        value={websiteData.contact}
                        onChange={(e) => setWebsiteData({...websiteData, contact: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                      <div className="flex items-center gap-2">
                        <label className="text-white">اللون الأساسي:</label>
                        <input
                          type="color"
                          value={websiteData.color}
                          onChange={(e) => setWebsiteData({...websiteData, color: e.target.value})}
                          className="w-12 h-10 rounded border border-gray-600"
                        />
                      </div>
                      
                      <Button
                        onClick={() => {
                          const websiteHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${websiteData.name} - الموقع الشخصي</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Tajawal', sans-serif; background: linear-gradient(135deg, #1e293b, #334155); color: white; }
        .container { max-width: 1000px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 60px 20px; background: linear-gradient(135deg, ${websiteData.color}, #64748b); border-radius: 20px; margin-bottom: 30px; }
        .avatar { width: 150px; height: 150px; border-radius: 50%; background: white; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 4rem; color: ${websiteData.color}; }
        .name { font-size: 3rem; margin-bottom: 10px; }
        .section { background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; margin-bottom: 20px; }
        .skills { display: flex; flex-wrap: gap: 10px; }
        .skill { background: ${websiteData.color}; padding: 8px 16px; border-radius: 20px; font-size: 0.9rem; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="avatar">${websiteData.name.charAt(0)}</div>
            <h1 class="name">${websiteData.name}</h1>
            <p>مرحباً بكم في موقعي الشخصي</p>
        </div>
        
        <div class="section">
            <h2 style="color: ${websiteData.color}; margin-bottom: 15px;">نبذة عني</h2>
            <p>${websiteData.bio}</p>
        </div>
        
        <div class="section">
            <h2 style="color: ${websiteData.color}; margin-bottom: 15px;">مهاراتي</h2>
            <div class="skills">
                ${websiteData.skills.split(',').map(skill => `<span class="skill">${skill.trim()}</span>`).join('')}
            </div>
        </div>
        
        <div class="section">
            <h2 style="color: ${websiteData.color}; margin-bottom: 15px;">تواصل معي</h2>
            <p>${websiteData.contact}</p>
        </div>
        
        <div class="section" style="text-align: center;">
            <p style="color: #94a3b8;">تم إنشاؤه بواسطة معك - منصتك الرقمية المتكاملة</p>
        </div>
    </div>
</body>
</html>`;
                          const blob = new Blob([websiteHTML], { type: 'text/html' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${websiteData.name}-website.html`;
                          a.click();
                          URL.revokeObjectURL(url);
                          toast({ title: "تم إنشاء الموقع", description: "تم تحميل الموقع الشخصي" });
                        }}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        إنشاء وتحميل الموقع
                      </Button>
                    </div>
                    
                    {/* Preview */}
                    <div className="bg-gray-800/50 rounded-xl p-4">
                      <h3 className="text-white mb-4">معاينة الموقع</h3>
                      <div className="bg-white rounded-lg p-4 text-black min-h-[300px]">
                        <div className="text-center mb-4">
                          <div 
                            className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center text-white"
                            style={{ backgroundColor: websiteData.color }}
                          >
                            {websiteData.name.charAt(0) || '؟'}
                          </div>
                          <h3 className="text-xl font-bold">{websiteData.name || 'اسمك هنا'}</h3>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p className="mb-2"><strong>نبذة:</strong> {websiteData.bio || 'اكتب نبذة عنك'}</p>
                          <p className="mb-2"><strong>المهارات:</strong> {websiteData.skills || 'أدخل مهاراتك'}</p>
                          <p><strong>التواصل:</strong> {websiteData.contact || 'معلومات التواصل'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Invoice Generator */}
            {activeTab === "invoice-generator" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">مولد الفواتير الاحترافي</h2>
                  <div className="text-center py-8">
                    <FileText className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-4">أداة متطورة لإنشاء الفواتير</h3>
                    <p className="text-gray-300 mb-6">إنشاء فواتير احترافية بتصاميم متنوعة</p>
                    <Button
                      onClick={() => window.open('/invoices', '_blank')}
                      className="bg-amber-600 hover:bg-amber-700 text-black font-bold"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      فتح مولد الفواتير
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Forms System */}
            {activeTab === "forms-system" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">نظام الاستمارات المتقدم</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-800/50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-white mb-4">نماذج متاحة</h3>
                      <div className="space-y-3">
                        <Button
                          onClick={() => window.open('/website-form', '_blank')}
                          variant="outline"
                          className="w-full border-blue-500 text-blue-400"
                        >
                          <Globe className="w-4 h-4 mr-2" />
                          استمارة طلب موقع
                        </Button>
                        <Button
                          onClick={() => window.open('/contact', '_blank')}
                          variant="outline"
                          className="w-full border-green-500 text-green-400"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          استمارة التواصل
                        </Button>
                      </div>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-white mb-4">إحصائيات الاستمارات</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-300">طلبات المواقع:</span>
                          <span className="text-green-400 font-bold">24</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">رسائل التواصل:</span>
                          <span className="text-blue-400 font-bold">18</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">طلبات الخدمات:</span>
                          <span className="text-amber-400 font-bold">12</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Portfolio Showcase */}
            {activeTab === "portfolio" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">معرض الأعمال</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { name: "منصة قدرات", type: "منصة تعليمية", status: "مكتمل", color: "green" },
                      { name: "بستان الأعمال", type: "موقع شركة", status: "قيد التطوير", color: "yellow" },
                      { name: "ProCourse", type: "منصة دورات", status: "مكتمل", color: "green" },
                      { name: "معك للخدمات", type: "موقع خدمات", status: "مكتمل", color: "green" },
                      { name: "متجر الكتروني", type: "تجارة الكترونية", status: "قيد التطوير", color: "yellow" },
                      { name: "تطبيق موبايل", type: "تطبيق جوال", status: "تخطيط", color: "blue" }
                    ].map((project, index) => (
                      <div key={index} className="bg-gray-800/50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-bold">{project.name}</h3>
                          <div className={`w-3 h-3 rounded-full ${
                            project.color === 'green' ? 'bg-green-500' :
                            project.color === 'yellow' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}></div>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{project.type}</p>
                        <p className="text-gray-300 text-xs">{project.status}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center mt-8">
                    <Button
                      onClick={() => window.open('/portfolio', '_blank')}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Award className="w-4 h-4 mr-2" />
                      عرض المعرض الكامل
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Code Playground */}
            {activeTab === "code-playground" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">معك كود - ملعب البرمجة التفاعلي</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Main Tool */}
                    <div className="bg-gray-800/50 rounded-xl p-6">
                      <div className="text-center mb-6">
                        <Code2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-white mb-2">أداة دمج وتفكيك الأكواد</h3>
                        <p className="text-gray-300 text-sm">أداة متقدمة لدمج HTML, CSS, JS في ملف واحد أو تفكيكها</p>
                      </div>
                      
                      <div className="space-y-4">
                        <Button
                          onClick={() => window.open('/code-tool', '_blank')}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          <Code2 className="w-4 h-4 mr-2" />
                          فتح الأداة في صفحة منفصلة
                        </Button>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-gray-700/50 rounded-lg p-3 text-center">
                            <p className="text-gray-300 text-xs">دمج الأكواد</p>
                            <p className="text-white font-bold text-sm">HTML + CSS + JS</p>
                          </div>
                          <div className="bg-gray-700/50 rounded-lg p-3 text-center">
                            <p className="text-gray-300 text-xs">تفكيك الكود</p>
                            <p className="text-white font-bold text-sm">ملف واحد → أجزاء</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Interactive Features */}
                    <div className="bg-gray-800/50 rounded-xl p-6">
                      <div className="text-center mb-6">
                        <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-white mb-2">فريق العمل التفاعلي</h3>
                        <p className="text-gray-300 text-sm">تفاعل مع أعضاء الفريق الافتراضيين</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            AM
                          </div>
                          <div>
                            <p className="text-white text-sm">أحمد محمد</p>
                            <p className="text-blue-400 text-xs">مطور</p>
                          </div>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            FA
                          </div>
                          <div>
                            <p className="text-white text-sm">فاطمة علي</p>
                            <p className="text-purple-400 text-xs">مصممة</p>
                          </div>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            SA
                          </div>
                          <div>
                            <p className="text-white text-sm">سعد الأحمد</p>
                            <p className="text-green-400 text-xs">مدير مشروع</p>
                          </div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-gray-700/50 rounded-lg">
                        <p className="text-gray-300 text-xs">💡 اكتب ملخص اجتماع وشاهد تفاعل الفريق معه</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Access Tools */}
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button
                      variant="outline"
                      className="h-16 flex-col border-gray-600 text-gray-300"
                      onClick={() => window.open('/code-tool', '_blank')}
                    >
                      <Code2 className="w-6 h-6 mb-1" />
                      <span className="text-xs">محرر الأكواد</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="h-16 flex-col border-gray-600 text-gray-300"
                      onClick={() => toast({ title: "قريباً", description: "هذه الميزة قيد التطوير" })}
                    >
                      <Users className="w-6 h-6 mb-1" />
                      <span className="text-xs">غرفة الدردشة</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="h-16 flex-col border-gray-600 text-gray-300"
                      onClick={() => toast({ title: "قريباً", description: "هذه الميزة قيد التطوير" })}
                    >
                      <Download className="w-6 h-6 mb-1" />
                      <span className="text-xs">مكتبة القوالب</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="h-16 flex-col border-gray-600 text-gray-300"
                      onClick={() => toast({ title: "قريباً", description: "هذه الميزة قيد التطوير" })}
                    >
                      <Play className="w-6 h-6 mb-1" />
                      <span className="text-xs">تشغيل سريع</span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Contract Generator */}
            {activeTab === "contract-generator" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">مولد العقود الرسمية</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Contract Form */}
                    <div className="space-y-4">
                      <Input
                        placeholder="اسم العميل"
                        value={contractData.clientName}
                        onChange={(e) => setContractData({...contractData, clientName: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                      <select
                        value={contractData.serviceType}
                        onChange={(e) => setContractData({...contractData, serviceType: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      >
                        <option value="">نوع الخدمة</option>
                        <option value="تطوير موقع">تطوير موقع</option>
                        <option value="تطبيق موبايل">تطبيق موبايل</option>
                        <option value="متجر الكتروني">متجر الكتروني</option>
                        <option value="هوية بصرية">هوية بصرية</option>
                      </select>
                      <Input
                        type="number"
                        placeholder="قيمة العقد"
                        value={contractData.price}
                        onChange={(e) => setContractData({...contractData, price: parseFloat(e.target.value) || 0})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                      <Input
                        placeholder="مدة التنفيذ"
                        value={contractData.duration}
                        onChange={(e) => setContractData({...contractData, duration: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                      <Input
                        type="date"
                        value={contractData.startDate}
                        onChange={(e) => setContractData({...contractData, startDate: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                      <textarea
                        placeholder="الشروط والأحكام"
                        value={contractData.terms}
                        onChange={(e) => setContractData({...contractData, terms: e.target.value})}
                        className="w-full bg-gray-700 border border-gray-600 text-white p-3 rounded-md min-h-[100px]"
                      />
                      
                      <Button
                        onClick={() => {
                          const contractHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>عقد خدمات - ${contractData.id}</title>
    <style>
        body { font-family: 'Tajawal', sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.8; }
        .header { text-align: center; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin: 20px 0; padding: 15px; background: #f8fafc; border-right: 4px solid #3b82f6; }
        .signature { margin-top: 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 50px; }
        .sign-box { border-top: 2px solid #000; padding-top: 10px; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h1>عقد تقديم خدمات رقمية</h1>
        <p>رقم العقد: ${contractData.id}</p>
        <p>التاريخ: ${new Date().toLocaleDateString('ar-SA')}</p>
    </div>
    
    <div class="section">
        <h3>أطراف العقد</h3>
        <p><strong>الطرف الأول (مقدم الخدمة):</strong> معك للخدمات الرقمية</p>
        <p><strong>الطرف الثاني (العميل):</strong> ${contractData.clientName}</p>
    </div>
    
    <div class="section">
        <h3>تفاصيل الخدمة</h3>
        <p><strong>نوع الخدمة:</strong> ${contractData.serviceType}</p>
        <p><strong>قيمة العقد:</strong> ${contractData.price} ريال سعودي</p>
        <p><strong>مدة التنفيذ:</strong> ${contractData.duration}</p>
        <p><strong>تاريخ البدء:</strong> ${contractData.startDate}</p>
    </div>
    
    <div class="section">
        <h3>الشروط والأحكام</h3>
        <p>${contractData.terms || 'سيتم تنفيذ الخدمة وفقاً للمواصفات المتفق عليها'}</p>
    </div>
    
    <div class="section">
        <h3>بنود إضافية</h3>
        <p>• يحق للعميل طلب تعديلات لا تزيد عن 3 مرات</p>
        <p>• الدفع على دفعتين: 50% مقدم و50% عند التسليم</p>
        <p>• فترة الضمان: 3 أشهر من تاريخ التسليم</p>
    </div>
    
    <div class="signature">
        <div class="sign-box">
            <p>توقيع مقدم الخدمة</p>
            <p>معك للخدمات الرقمية</p>
        </div>
        <div class="sign-box">
            <p>توقيع العميل</p>
            <p>${contractData.clientName}</p>
        </div>
    </div>
</body>
</html>`;
                          const blob = new Blob([contractHTML], { type: 'text/html' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `contract-${contractData.id}.html`;
                          a.click();
                          URL.revokeObjectURL(url);
                          toast({ title: "تم إنشاء العقد", description: "تم تحميل العقد بصيغة HTML" });
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <FileCheck className="w-4 h-4 mr-2" />
                        إنشاء وتحميل العقد
                      </Button>
                    </div>
                    
                    {/* Contract Preview */}
                    <div className="bg-gray-800/50 rounded-xl p-4">
                      <h3 className="text-white mb-4">معاينة العقد</h3>
                      <div className="bg-white rounded-lg p-4 text-black text-sm min-h-[400px]">
                        <div className="text-center border-b pb-4 mb-4">
                          <h3 className="font-bold text-lg">عقد تقديم خدمات رقمية</h3>
                          <p>رقم العقد: {contractData.id}</p>
                        </div>
                        <div className="space-y-3">
                          <p><strong>العميل:</strong> {contractData.clientName || 'اسم العميل'}</p>
                          <p><strong>الخدمة:</strong> {contractData.serviceType || 'نوع الخدمة'}</p>
                          <p><strong>القيمة:</strong> {contractData.price || 0} ريال</p>
                          <p><strong>المدة:</strong> {contractData.duration || 'مدة التنفيذ'}</p>
                          <p><strong>البدء:</strong> {contractData.startDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Pricing Calculator */}
            {activeTab === "price-calculator" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">حاسبة أسعار المشاريع</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Calculator Form */}
                    <div className="space-y-4">
                      <select
                        value={pricingData.serviceType}
                        onChange={(e) => {
                          const basePrice = {
                            'website': 2500,
                            'ecommerce': 5000,
                            'mobile': 8000,
                            'branding': 1500
                          }[e.target.value] || 0;
                          setPricingData({...pricingData, serviceType: e.target.value, basePrice});
                        }}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      >
                        <option value="">اختر نوع المشروع</option>
                        <option value="website">موقع ويب</option>
                        <option value="ecommerce">متجر الكتروني</option>
                        <option value="mobile">تطبيق موبايل</option>
                        <option value="branding">هوية بصرية</option>
                      </select>
                      
                      <select
                        value={pricingData.complexity}
                        onChange={(e) => setPricingData({...pricingData, complexity: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      >
                        <option value="basic">بسيط (+0%)</option>
                        <option value="intermediate">متوسط (+50%)</option>
                        <option value="advanced">متقدم (+100%)</option>
                        <option value="enterprise">مؤسسي (+200%)</option>
                      </select>
                      
                      <div className="space-y-2">
                        <label className="text-white font-semibold">المميزات الإضافية:</label>
                        {[
                          { id: 'cms', name: 'نظام إدارة المحتوى', price: 800 },
                          { id: 'seo', name: 'تحسين محركات البحث', price: 500 },
                          { id: 'analytics', name: 'تحليلات متقدمة', price: 300 },
                          { id: 'support', name: 'دعم فني شامل', price: 600 }
                        ].map(feature => (
                          <label key={feature.id} className="flex items-center text-white">
                            <input
                              type="checkbox"
                              checked={pricingData.features.includes(feature.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setPricingData({...pricingData, features: [...pricingData.features, feature.id]});
                                } else {
                                  setPricingData({...pricingData, features: pricingData.features.filter(f => f !== feature.id)});
                                }
                              }}
                              className="mr-2"
                            />
                            {feature.name} (+{feature.price} ر.س)
                          </label>
                        ))}
                      </div>
                      
                      <select
                        value={pricingData.timeframe}
                        onChange={(e) => setPricingData({...pricingData, timeframe: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      >
                        <option value="1-2 weeks">1-2 أسابيع (عادي)</option>
                        <option value="urgent">عاجل أقل من أسبوع (+30%)</option>
                        <option value="flexible">مرن أكثر من شهر (-10%)</option>
                      </select>
                      
                      <Button
                        onClick={() => {
                          let price = pricingData.basePrice;
                          
                          // Complexity multiplier
                          const complexityMultiplier = {
                            'basic': 1,
                            'intermediate': 1.5,
                            'advanced': 2,
                            'enterprise': 3
                          }[pricingData.complexity] || 1;
                          
                          price *= complexityMultiplier;
                          
                          // Features
                          const featurePrices = {
                            'cms': 800,
                            'seo': 500,
                            'analytics': 300,
                            'support': 600
                          };
                          
                          pricingData.features.forEach(feature => {
                            price += featurePrices[feature as keyof typeof featurePrices] || 0;
                          });
                          
                          // Timeframe modifier
                          if (pricingData.timeframe === 'urgent') price *= 1.3;
                          if (pricingData.timeframe === 'flexible') price *= 0.9;
                          
                          setPricingData({...pricingData, finalPrice: Math.round(price)});
                          
                          toast({
                            title: "تم حساب السعر",
                            description: `السعر النهائي: ${Math.round(price)} ريال سعودي`
                          });
                        }}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <Calculator className="w-4 h-4 mr-2" />
                        احسب السعر
                      </Button>
                    </div>
                    
                    {/* Price Breakdown */}
                    <div className="bg-gray-800/50 rounded-xl p-4">
                      <h3 className="text-white mb-4">تفاصيل التسعير</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-300">السعر الأساسي:</span>
                          <span className="text-white">{pricingData.basePrice} ر.س</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">مستوى التعقيد:</span>
                          <span className="text-white">{{
                            'basic': 'بسيط',
                            'intermediate': 'متوسط',
                            'advanced': 'متقدم',
                            'enterprise': 'مؤسسي'
                          }[pricingData.complexity] || 'غير محدد'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">المميزات المضافة:</span>
                          <span className="text-white">{pricingData.features.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">الإطار الزمني:</span>
                          <span className="text-white">{pricingData.timeframe}</span>
                        </div>
                        <hr className="border-gray-600" />
                        <div className="flex justify-between text-lg font-bold">
                          <span className="text-amber-400">السعر النهائي:</span>
                          <span className="text-amber-400">{pricingData.finalPrice} ر.س</span>
                        </div>
                      </div>
                      
                      {pricingData.finalPrice > 0 && (
                        <Button
                          onClick={() => {
                            const quotePDF = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"><title>عرض سعر</title></head>
<body style="font-family: Arial; padding: 20px;">
<h1>عرض سعر من معك</h1>
<p>نوع المشروع: ${pricingData.serviceType}</p>
<p>مستوى التعقيد: ${pricingData.complexity}</p>
<p>الإطار الزمني: ${pricingData.timeframe}</p>
<h2>السعر النهائي: ${pricingData.finalPrice} ريال سعودي</h2>
</body></html>`;
                            const blob = new Blob([quotePDF], { type: 'text/html' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `quote-${Date.now()}.html`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          تحميل عرض السعر
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "tools" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">أدوات المطور</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-800/50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-white mb-4">معك كود</h3>
                      <p className="text-gray-300 mb-4">محرر أكواد تعاوني مع إمكانيات متقدمة</p>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <Code2 className="w-4 h-4 mr-2" />
                        فتح محرر الأكواد
                      </Button>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-white mb-4">أدوات التصميم</h3>
                      <p className="text-gray-300 mb-4">أدوات تصميم متقدمة للواجهات</p>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        <Settings className="w-4 h-4 mr-2" />
                        أدوات التصميم
                      </Button>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-white mb-4">قاعدة البيانات</h3>
                      <p className="text-gray-300 mb-4">إدارة قواعد البيانات والاستعلامات</p>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <Database className="w-4 h-4 mr-2" />
                        إدارة البيانات
                      </Button>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-white mb-4">تحليل الأداء</h3>
                      <p className="text-gray-300 mb-4">مراقبة وتحليل أداء التطبيقات</p>
                      <Button className="w-full bg-amber-600 hover:bg-amber-700">
                        <Monitor className="w-4 h-4 mr-2" />
                        مراقبة الأداء
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">الإعدادات</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-800/50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-white mb-4">معلومات الحساب</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-300 mb-2">اسم الموظف</label>
                          <Input 
                            value={currentEmployee.name} 
                            disabled 
                            className="bg-gray-700 border-gray-600 text-gray-400"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-2">رقم الموظف</label>
                          <Input 
                            value={currentEmployee.id} 
                            disabled 
                            className="bg-gray-700 border-gray-600 text-gray-400"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-2">الصلاحية</label>
                          <Input 
                            value={currentEmployee.role} 
                            disabled 
                            className="bg-gray-700 border-gray-600 text-gray-400"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-white mb-4">إعدادات النظام</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">الإشعارات</span>
                          <Button size="sm" variant="outline" className="border-green-500 text-green-500">
                            مفعل
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">الوضع الليلي</span>
                          <Button size="sm" variant="outline" className="border-blue-500 text-blue-500">
                            مفعل
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">التحديثات التلقائية</span>
                          <Button size="sm" variant="outline" className="border-amber-500 text-amber-500">
                            مفعل
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}