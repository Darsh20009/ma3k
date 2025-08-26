import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function EmployeeDashboard() {
  const { toast } = useToast();
  const [currentEmployee, setCurrentEmployee] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
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
                  { id: "meeting", label: "Ma3k Meet", icon: Video },
                  { id: "employees", label: "إدارة الموظفين", icon: Users },
                  { id: "tools", label: "أدوات المطور", icon: Code2 },
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
                      
                      <Button
                        onClick={startMeeting}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full"
                      >
                        <Video className="w-5 h-5 mr-2" />
                        بدء اجتماع جديد
                      </Button>
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
                        
                        {/* Video Area */}
                        <div className="bg-black rounded-lg h-64 mb-4 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-2">
                              <span className="text-black font-bold text-xl">{currentEmployee.name.charAt(0)}</span>
                            </div>
                            <p className="text-white">{currentEmployee.name}</p>
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
                      
                      {/* Ma3k Code Tool */}
                      <div className="bg-gray-800/50 rounded-xl p-6">
                        <h4 className="text-lg font-bold text-white mb-4">معك كود - أداة الترميز التعاونية</h4>
                        <div className="bg-gray-900 rounded-lg p-4 mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-300 text-sm">ملف جديد</span>
                            <span className="text-gray-400 text-xs">JavaScript</span>
                          </div>
                          <textarea
                            className="w-full bg-transparent text-green-400 font-mono text-sm resize-none"
                            rows={8}
                            placeholder="// اكتب الكود هنا...
function welcome() {
  console.log('مرحباً بك في معك كود!');
}"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-green-500 text-green-500">
                            تشغيل الكود
                          </Button>
                          <Button size="sm" variant="outline" className="border-blue-500 text-blue-500">
                            مشاركة
                          </Button>
                          <Button size="sm" variant="outline" className="border-amber-500 text-amber-500">
                            حفظ
                          </Button>
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