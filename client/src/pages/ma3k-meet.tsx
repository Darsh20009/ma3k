import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, 
  VideoOff,
  Mic, 
  MicOff, 
  Camera, 
  CameraOff, 
  Share, 
  MessageSquare, 
  Users, 
  Settings, 
  MoreVertical,
  Phone,
  PhoneOff,
  Monitor,
  Play,
  Save,
  Code2,
  Eye,
  Coffee,
  Clock,
  Calendar,
  FileText,
  Download,
  Upload,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Grid3X3,
  User,
  Crown,
  Star,
  Zap,
  Heart,
  ThumbsUp,
  Send,
  Smile,
  Paperclip,
  RotateCcw,
  Presentation,
  Palette,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Participant {
  id: string;
  name: string;
  avatar: string;
  role: 'host' | 'developer' | 'designer' | 'manager' | 'guest';
  isOnline: boolean;
  isSpeaking: boolean;
  micEnabled: boolean;
  cameraEnabled: boolean;
  handRaised: boolean;
  reactions: string[];
}

interface Message {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'code' | 'file' | 'reaction' | 'system';
  reactions?: string[];
}

interface CodeFile {
  id: string;
  name: string;
  language: string;
  content: string;
  author: string;
  lastModified: Date;
}

export default function Ma3kMeet() {
  const { toast } = useToast();
  
  // Meeting state
  const [isInMeeting, setIsInMeeting] = useState(false);
  const [meetingId] = useState(`MA3K-${Date.now().toString().slice(-6)}`);
  const [meetingDuration, setMeetingDuration] = useState(0);
  const [isHost] = useState(true);
  const [meetingMode, setMeetingMode] = useState<'productivity' | 'creative' | 'gaming' | 'presentation'>('productivity');
  
  // User settings
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [volume, setVolume] = useState(100);
  const [viewMode, setViewMode] = useState<'grid' | 'speaker' | 'presentation'>('grid');
  
  // Chat and messaging
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      userId: 'system',
      content: 'مرحباً بكم في اجتماع معك التفاعلي!',
      timestamp: new Date(Date.now() - 300000),
      type: 'system'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(true);
  
  // Participants
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: 'host',
      name: 'أنت (المضيف)',
      avatar: 'ME',
      role: 'host',
      isOnline: true,
      isSpeaking: false,
      micEnabled: true,
      cameraEnabled: true,
      handRaised: false,
      reactions: []
    },
    {
      id: '1',
      name: 'أحمد محمد',
      avatar: 'AM',
      role: 'developer',
      isOnline: true,
      isSpeaking: false,
      micEnabled: true,
      cameraEnabled: true,
      handRaised: false,
      reactions: ['👍']
    },
    {
      id: '2',
      name: 'فاطمة علي',
      avatar: 'FA',
      role: 'designer',
      isOnline: true,
      isSpeaking: true,
      micEnabled: true,
      cameraEnabled: true,
      handRaised: false,
      reactions: ['❤️']
    },
    {
      id: '3',
      name: 'سعد الأحمد',
      avatar: 'SA',
      role: 'manager',
      isOnline: true,
      isSpeaking: false,
      micEnabled: true,
      cameraEnabled: false,
      handRaised: true,
      reactions: []
    },
    {
      id: '4',
      name: 'نورا خالد',
      avatar: 'NK',
      role: 'developer',
      isOnline: true,
      isSpeaking: false,
      micEnabled: false,
      cameraEnabled: true,
      handRaised: false,
      reactions: ['⭐']
    },
    {
      id: '5',
      name: 'محمد عبدالله',
      avatar: 'MA',
      role: 'guest',
      isOnline: false,
      isSpeaking: false,
      micEnabled: true,
      cameraEnabled: true,
      handRaised: false,
      reactions: []
    }
  ]);
  
  // Code collaboration
  const [codeFiles, setCodeFiles] = useState<CodeFile[]>([
    {
      id: '1',
      name: 'app.js',
      language: 'javascript',
      content: `// مشروع معك - الاجتماع التفاعلي
function startMeeting(options) {
    console.log('بدء الاجتماع مع الخيارات:', options);
    
    const meeting = {
        id: generateMeetingId(),
        participants: [],
        features: {
            videoCall: true,
            screenShare: true,
            codeCollaboration: true,
            fileSharing: true,
            recording: true,
            breakoutRooms: true
        },
        
        addParticipant(user) {
            this.participants.push(user);
            console.log(\`انضم \${user.name} إلى الاجتماع\`);
        },
        
        shareScreen() {
            console.log('بدء مشاركة الشاشة');
            return this.features.screenShare;
        }
    };
    
    return meeting;
}

// تشغيل الاجتماع
const currentMeeting = startMeeting({
    title: 'مراجعة المشروع',
    duration: '60 دقيقة',
    features: ['video', 'code', 'recording']
});`,
      author: 'أحمد محمد',
      lastModified: new Date()
    }
  ]);
  const [activeCodeFile, setActiveCodeFile] = useState<string>('1');
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  
  // Meeting summary and AI
  const [meetingSummary, setMeetingSummary] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([
    'إضافة ميزة التسجيل التلقائي للاجتماعات',
    'تحسين جودة الصوت باستخدام AI',
    'إنشاء ملخص تلقائي للنقاط المهمة',
    'تفعيل الترجمة الفورية للمحادثات'
  ]);
  
  // Effects
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInMeeting) {
      interval = setInterval(() => {
        setMeetingDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInMeeting]);
  
  // Functions
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'host': return <Crown className="w-3 h-3 text-yellow-400" />;
      case 'developer': return <Code2 className="w-3 h-3 text-blue-400" />;
      case 'designer': return <Palette className="w-3 h-3 text-purple-400" />;
      case 'manager': return <Star className="w-3 h-3 text-green-400" />;
      default: return <User className="w-3 h-3 text-gray-400" />;
    }
  };
  
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'host': return 'from-yellow-500 to-orange-500';
      case 'developer': return 'from-blue-500 to-cyan-500';
      case 'designer': return 'from-purple-500 to-pink-500';
      case 'manager': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };
  
  const startMeeting = () => {
    setIsInMeeting(true);
    setMeetingDuration(0);
    toast({ 
      title: "بدأ الاجتماع", 
      description: `رقم الاجتماع: ${meetingId}` 
    });
    
    // Simulate participants joining
    setTimeout(() => {
      addSystemMessage('انضم أحمد محمد إلى الاجتماع');
    }, 2000);
    setTimeout(() => {
      addSystemMessage('انضمت فاطمة علي إلى الاجتماع');
    }, 4000);
  };
  
  const endMeeting = () => {
    setIsInMeeting(false);
    toast({ 
      title: "انتهى الاجتماع", 
      description: `المدة: ${formatDuration(meetingDuration)}` 
    });
  };
  
  const addSystemMessage = (content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      userId: 'system',
      content,
      timestamp: new Date(),
      type: 'system'
    };
    setMessages(prev => [...prev, message]);
  };
  
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      userId: 'host',
      content: newMessage,
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Simulate responses
    setTimeout(() => {
      const responses = [
        'موافق تماماً!',
        'فكرة ممتازة',
        'سأعمل على هذا',
        'هل يمكننا مناقشة هذا أكثر؟',
        'رائع! متى نبدأ؟'
      ];
      
      const response: Message = {
        id: (Date.now() + 1).toString(),
        userId: Math.random() > 0.5 ? '1' : '2',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, response]);
    }, 1000 + Math.random() * 2000);
  };
  
  const addReaction = (emoji: string) => {
    toast({ title: "تفاعل", description: `أضفت ${emoji}` });
    
    setTimeout(() => {
      addSystemMessage(`أضاف أحمد محمد ${emoji}`);
    }, 500);
  };
  
  const generateAISummary = () => {
    const summary = `ملخص الاجتماع - ${new Date().toLocaleDateString('ar-SA')}

النقاط الرئيسية:
• تم مناقشة تطوير ميزات جديدة للمنصة
• اتفق الفريق على إضافة أدوات التعاون المباشر
• تم تحديد الجدول الزمني للمراحل القادمة
• مراجعة الكود المكتوب بشكل تعاوني

المهام المطلوبة:
• أحمد: تطوير واجهة المستخدم الجديدة
• فاطمة: تصميم الأيقونات والعناصر البصرية
• سعد: إدارة المشروع ومتابعة التقدم

الاجتماع التالي: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ar-SA')}`;
    
    setMeetingSummary(summary);
    toast({ title: "تم إنشاء الملخص", description: "تم إنشاء ملخص تلقائي بواسطة الذكاء الاصطناعي" });
  };

  if (!isInMeeting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative z-10 p-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <div className="flex items-center justify-center mb-8">
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-6 shadow-2xl"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Video className="w-10 h-10 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                    Ma3k Meet
                  </h1>
                  <p className="text-2xl text-white/80 font-light mt-2">مستقبل الاجتماعات الرقمية</p>
                </div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="max-w-4xl mx-auto"
              >
                <p className="text-2xl text-gray-200 mb-4 font-light">
                  🚀 تجربة اجتماعات ثورية بتقنيات الذكاء الاصطناعي
                </p>
                <p className="text-lg text-blue-200">
                  الآن مع الواقع المختلط، الترجمة الفورية، التعاون المباشر في البرمجة، والتحليل الذكي للاجتماعات
                </p>
              </motion.div>
            </motion.div>

            {/* Revolutionary Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-500 transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                    <Video className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">🎥 فيديو 8K مع AR</h3>
                  <p className="text-cyan-200 text-sm leading-relaxed">فيديو بدقة 8K مع الواقع المعزز والهولوجرام ثلاثي الأبعاد</p>
                  <div className="mt-4 flex items-center text-cyan-400 text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    <span>مدعوم بالذكاء الاصطناعي</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                    <Code2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">💻 برمجة تعاونية</h3>
                  <p className="text-purple-200 text-sm leading-relaxed">محرر كود متقدم مع الذكاء الاصطناعي وأدوات التطوير المدمجة</p>
                  <div className="mt-4 flex items-center text-purple-400 text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    <span>تحليل الكود الذكي</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-xl rounded-3xl p-8 border border-green-500/30 hover:border-green-400/60 transition-all duration-500 transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">🤖 مساعد ذكي</h3>
                  <p className="text-green-200 text-sm leading-relaxed">ترجمة فورية لـ 150 لغة، ملخصات ذكية، وتحليل المشاعر</p>
                  <div className="mt-4 flex items-center text-green-400 text-xs">
                    <Heart className="w-3 h-3 mr-1" />
                    <span>تحليل المشاعر المتقدم</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-orange-500/20 to-red-600/20 backdrop-blur-xl rounded-3xl p-8 border border-orange-500/30 hover:border-orange-400/60 transition-all duration-500 transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                    <Layers className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">🎮 عوالم ثلاثية</h3>
                  <p className="text-orange-200 text-sm leading-relaxed">اجتماعات في عوالم ثلاثية الأبعاد مع إمكانيات التخصيص الكاملة</p>
                  <div className="mt-4 flex items-center text-orange-400 text-xs">
                    <Coffee className="w-3 h-3 mr-1" />
                    <span>مساحات افتراضية مخصصة</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Meeting Modes */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-center text-white mb-8">اختر نمط اجتماعك</h2>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { 
                    id: 'productivity', 
                    name: 'الإنتاجية', 
                    icon: '💼', 
                    color: 'from-blue-500 to-cyan-500',
                    description: 'للاجتماعات المهنية والعروض التقديمية'
                  },
                  { 
                    id: 'creative', 
                    name: 'الإبداع', 
                    icon: '🎨', 
                    color: 'from-purple-500 to-pink-500',
                    description: 'للعصف الذهني والأفكار الإبداعية'
                  },
                  { 
                    id: 'gaming', 
                    name: 'الألعاب', 
                    icon: '🎮', 
                    color: 'from-green-500 to-emerald-500',
                    description: 'للاجتماعات التفاعلية والألعاب الجماعية'
                  },
                  { 
                    id: 'presentation', 
                    name: 'العرض', 
                    icon: '📊', 
                    color: 'from-orange-500 to-red-500',
                    description: 'للعروض التقديمية المتقدمة'
                  }
                ].map((mode) => (
                  <motion.div
                    key={mode.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 ${
                      meetingMode === mode.id 
                        ? 'border-white bg-white/10' 
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                    onClick={() => setMeetingMode(mode.id as any)}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">{mode.icon}</div>
                      <h3 className="text-xl font-bold text-white mb-2">{mode.name}</h3>
                      <p className="text-gray-300 text-sm">{mode.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Advanced Meeting Setup */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-2xl rounded-3xl p-12 border border-white/10 shadow-2xl"
            >
              <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-white mb-4">🚀 ابدأ تجربة مستقبلية</h2>
                <p className="text-xl text-gray-300">اجتماع {meetingMode === 'productivity' ? 'مهني متقدم' : meetingMode === 'creative' ? 'إبداعي تفاعلي' : meetingMode === 'gaming' ? 'ترفيهي تفاعلي' : 'عرض تقديمي ثلاثي الأبعاد'}</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 mb-10">
                <div className="text-center">
                  <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-lg px-4 py-2 mb-3">
                    🆔 {meetingId}
                  </Badge>
                  <p className="text-gray-400 text-sm">رقم الاجتماع</p>
                </div>
                
                <div className="text-center">
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-lg px-4 py-2 mb-3">
                    👥 {participants.filter(p => p.isOnline).length} متصل
                  </Badge>
                  <p className="text-gray-400 text-sm">المشاركون الحاليون</p>
                </div>
                
                <div className="text-center">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg px-4 py-2 mb-3">
                    🌐 عالمي
                  </Badge>
                  <p className="text-gray-400 text-sm">التوفر</p>
                </div>
              </div>
              
              {/* Enhanced Pre-meeting controls */}
              <div className="flex items-center justify-center gap-6 mb-10">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setMicEnabled(!micEnabled)}
                    className={`${micEnabled 
                      ? "border-green-400 text-green-400 bg-green-400/10 hover:bg-green-400/20" 
                      : "border-red-400 text-red-400 bg-red-400/10 hover:bg-red-400/20"
                    } transition-all duration-300 rounded-2xl px-6 py-4`}
                  >
                    {micEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setCameraEnabled(!cameraEnabled)}
                    className={`${cameraEnabled 
                      ? "border-green-400 text-green-400 bg-green-400/10 hover:bg-green-400/20" 
                      : "border-red-400 text-red-400 bg-red-400/10 hover:bg-red-400/20"
                    } transition-all duration-300 rounded-2xl px-6 py-4`}
                  >
                    {cameraEnabled ? <Camera className="w-6 h-6" /> : <CameraOff className="w-6 h-6" />}
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-blue-400 text-blue-400 bg-blue-400/10 hover:bg-blue-400/20 transition-all duration-300 rounded-2xl px-6 py-4"
                  >
                    <Settings className="w-6 h-6" />
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-purple-400 text-purple-400 bg-purple-400/10 hover:bg-purple-400/20 transition-all duration-300 rounded-2xl px-6 py-4"
                  >
                    <Zap className="w-6 h-6" />
                  </Button>
                </motion.div>
              </div>
              
              {/* Revolutionary Start Button */}
              <div className="text-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={startMeeting}
                    size="lg"
                    className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-700 text-white font-bold py-6 px-16 rounded-3xl text-2xl shadow-2xl transform transition-all duration-300"
                  >
                    <Video className="w-8 h-8 mr-4" />
                    🚀 انطلق للمستقبل
                    <Zap className="w-8 h-8 ml-4" />
                  </Button>
                </motion.div>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-gray-400 mt-4"
                >
                  ⚡ مدعوم بتقنيات الذكاء الاصطناعي المتقدمة
                </motion.p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute w-full h-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Futuristic Meeting Header */}
      <div className="relative z-10 bg-gradient-to-r from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-xl border-b border-cyan-500/30 px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse shadow-lg"></div>
                <div className="absolute inset-0 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
              </div>
              <span className="text-red-400 font-bold text-lg">🔴 LIVE</span>
            </motion.div>
            
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-black text-2xl">
              Ma3k Meet • {meetingId}
            </div>
            
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 text-lg">
              ⏱️ {formatDuration(meetingDuration)}
            </Badge>
            
            <Badge className={`px-4 py-2 text-lg ${
              meetingMode === 'productivity' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
              meetingMode === 'creative' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
              meetingMode === 'gaming' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
              'bg-gradient-to-r from-orange-500 to-red-500'
            }`}>
              {meetingMode === 'productivity' ? '💼 إنتاجي' :
               meetingMode === 'creative' ? '🎨 إبداعي' :
               meetingMode === 'gaming' ? '🎮 تفاعلي' : '📊 عرض'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 text-lg">
              👥 {participants.filter(p => p.isOnline).length} مشارك نشط
            </Badge>
            {isRecording && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 text-lg">
                  🎥 يتم التسجيل
                </Badge>
              </motion.div>
            )}
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 text-lg">
              🤖 AI نشط
            </Badge>
          </div>
        </div>
        
        {/* Live Stats Bar */}
        <motion.div 
          className="mt-4 flex items-center justify-center gap-8 text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 text-cyan-400">
            <Zap className="w-4 h-4" />
            <span>جودة 8K</span>
          </div>
          <div className="flex items-center gap-2 text-green-400">
            <Heart className="w-4 h-4" />
            <span>مراقبة المشاعر</span>
          </div>
          <div className="flex items-center gap-2 text-purple-400">
            <Star className="w-4 h-4" />
            <span>ترجمة فورية</span>
          </div>
          <div className="flex items-center gap-2 text-orange-400">
            <Coffee className="w-4 h-4" />
            <span>مساحة افتراضية</span>
          </div>
        </motion.div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Video Area */}
        <div className="flex-1 relative">
          {/* Video Grid */}
          <div className={`p-4 h-full ${
            viewMode === 'grid' ? 'grid grid-cols-3 gap-4' : 
            viewMode === 'speaker' ? 'flex flex-col' : 'grid grid-cols-1'
          }`}>
            {viewMode === 'speaker' && (
              <div className="flex-1 bg-black rounded-lg p-4 mb-4">
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-4xl">FA</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">فاطمة علي</h3>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-red-400">تتحدث</span>
                      {getRoleIcon('designer')}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Participants Grid */}
            <div className={viewMode === 'speaker' ? 'flex gap-4 overflow-x-auto' : 'contents'}>
              {participants.filter(p => p.isOnline).map((participant) => (
                <motion.div
                  key={participant.id}
                  layout
                  className={`bg-gray-800 rounded-lg relative overflow-hidden ${
                    viewMode === 'speaker' ? 'w-32 h-24 flex-shrink-0' : ''
                  }`}
                >
                  <div className="w-full h-full flex items-center justify-center p-4">
                    {participant.cameraEnabled ? (
                      <div className="text-center">
                        <div className={`w-16 h-16 bg-gradient-to-r ${getRoleColor(participant.role)} rounded-full flex items-center justify-center mx-auto mb-2`}>
                          <span className="text-white font-bold text-lg">{participant.avatar}</span>
                        </div>
                        <p className="text-white text-sm font-medium">{participant.name}</p>
                        {participant.role !== 'guest' && (
                          <div className="flex items-center justify-center mt-1">
                            {getRoleIcon(participant.role)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <CameraOff className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-400 text-sm">{participant.name}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Participant status indicators */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    {!participant.micEnabled && (
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <MicOff className="w-3 h-3 text-white" />
                      </div>
                    )}
                    {participant.handRaised && (
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-xs">✋</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Speaking indicator */}
                  {participant.isSpeaking && (
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="bg-green-500 h-1 rounded-full animate-pulse"></div>
                    </div>
                  )}
                  
                  {/* Reactions */}
                  {participant.reactions.length > 0 && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-black/60 rounded-full px-2 py-1 text-xs">
                        {participant.reactions.join('')}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Meeting Controls */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-full px-6 py-4 flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMicEnabled(!micEnabled)}
                className={micEnabled ? "text-white hover:bg-gray-700" : "text-red-400 bg-red-500/20 hover:bg-red-500/30"}
              >
                {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCameraEnabled(!cameraEnabled)}
                className={cameraEnabled ? "text-white hover:bg-gray-700" : "text-red-400 bg-red-500/20 hover:bg-red-500/30"}
              >
                {cameraEnabled ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setScreenSharing(!screenSharing)}
                className={screenSharing ? "text-blue-400 bg-blue-500/20" : "text-white hover:bg-gray-700"}
              >
                <Share className="w-5 h-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsRecording(!isRecording)}
                className={isRecording ? "text-red-400 bg-red-500/20" : "text-white hover:bg-gray-700"}
              >
                <div className="w-2 h-2 bg-current rounded-full"></div>
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCodeEditor(!showCodeEditor)}
                className={showCodeEditor ? "text-green-400 bg-green-500/20" : "text-white hover:bg-gray-700"}
              >
                <Code2 className="w-5 h-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-gray-700"
              >
                <MoreVertical className="w-5 h-5" />
              </Button>
              
              <Button
                onClick={endMeeting}
                className="bg-red-600 hover:bg-red-700 text-white px-6"
              >
                <PhoneOff className="w-4 h-4 mr-2" />
                إنهاء
              </Button>
            </div>
          </div>
          
          {/* View Mode Selector */}
          <div className="absolute top-4 right-4">
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-2 flex gap-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'speaker' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('speaker')}
              >
                <User className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'presentation' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('presentation')}
              >
                <Presentation className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Reactions */}
          <div className="absolute bottom-24 right-4">
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-2 flex flex-col gap-2">
              {['👍', '❤️', '😂', '🎉', '👏', '🔥'].map((emoji) => (
                <Button
                  key={emoji}
                  variant="ghost"
                  size="sm"
                  onClick={() => addReaction(emoji)}
                  className="text-2xl hover:bg-gray-700"
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          {/* Sidebar Tabs */}
          <div className="flex border-b border-gray-700">
            <Button
              variant={showChat ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setShowChat(true)}
              className="flex-1 rounded-none"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              الدردشة
            </Button>
            <Button
              variant={!showChat ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setShowChat(false)}
              className="flex-1 rounded-none"
            >
              <Users className="w-4 h-4 mr-2" />
              المشاركون
            </Button>
          </div>

          {showChat ? (
            /* Chat Section */
            <div className="flex-1 flex flex-col">
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((message) => {
                  const sender = participants.find(p => p.id === message.userId);
                  return (
                    <div key={message.id} className={`flex ${message.userId === 'host' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs rounded-lg p-3 ${
                        message.type === 'system' 
                          ? 'bg-blue-500/20 text-blue-400 text-center w-full text-sm'
                          : message.userId === 'host'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-white'
                      }`}>
                        {message.type !== 'system' && (
                          <p className="text-xs opacity-75 mb-1">
                            {sender?.name || 'مجهول'}
                          </p>
                        )}
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-50 mt-1">
                          {message.timestamp.toLocaleTimeString('ar-SA', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="p-4 border-t border-gray-700">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="اكتب رسالة..."
                    className="bg-gray-700 border-gray-600 text-white"
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button
                    onClick={sendMessage}
                    size="icon"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* Participants Section */
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/50">
                  <div className="relative">
                    <div className={`w-10 h-10 bg-gradient-to-r ${getRoleColor(participant.role)} rounded-full flex items-center justify-center`}>
                      <span className="text-white font-bold text-sm">{participant.avatar}</span>
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${
                      participant.isOnline ? 'bg-green-500' : 'bg-gray-500'
                    }`}></div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-medium text-sm">{participant.name}</p>
                      {getRoleIcon(participant.role)}
                    </div>
                    <p className="text-gray-400 text-xs capitalize">{
                      participant.role === 'host' ? 'مضيف' :
                      participant.role === 'developer' ? 'مطور' :
                      participant.role === 'designer' ? 'مصمم' :
                      participant.role === 'manager' ? 'مدير' : 'ضيف'
                    }</p>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {!participant.micEnabled && (
                      <MicOff className="w-4 h-4 text-red-400" />
                    )}
                    {!participant.cameraEnabled && (
                      <CameraOff className="w-4 h-4 text-red-400" />
                    )}
                    {participant.handRaised && (
                      <span className="text-yellow-400">✋</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Code Editor Modal */}
      <AnimatePresence>
        {showCodeEditor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gray-800 rounded-xl w-full max-w-4xl h-3/4 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h3 className="text-lg font-bold text-white">معك كود - التعاون المباشر</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCodeEditor(false)}
                >
                  ×
                </Button>
              </div>
              
              <div className="flex-1 p-4">
                <div className="bg-gray-900 rounded-lg h-full p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300">app.js</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-400 text-xs">3 مطورين متصلين</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-green-500 text-green-500">
                        <Play className="w-3 h-3 mr-1" />
                        تشغيل
                      </Button>
                      <Button size="sm" variant="outline" className="border-blue-500 text-blue-500">
                        <Share className="w-3 h-3 mr-1" />
                        مشاركة
                      </Button>
                    </div>
                  </div>
                  
                  <textarea
                    className="w-full h-full bg-transparent text-green-400 font-mono text-sm resize-none"
                    value={codeFiles[0]?.content}
                    onChange={(e) => {
                      const updatedFiles = [...codeFiles];
                      updatedFiles[0].content = e.target.value;
                      setCodeFiles(updatedFiles);
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Assistant Panel */}
      <div className="fixed bottom-4 left-4 max-w-sm">
        <Card className="bg-gray-800/90 backdrop-blur-sm border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              مساعد الذكاء الاصطناعي
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              size="sm"
              variant="outline"
              onClick={generateAISummary}
              className="w-full text-xs border-blue-500 text-blue-400"
            >
              إنشاء ملخص الاجتماع
            </Button>
            <div className="text-xs text-gray-400">
              <p>اقتراحات ذكية:</p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                {aiSuggestions.slice(0, 2).map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Meeting Summary Modal */}
      <AnimatePresence>
        {meetingSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gray-800 rounded-xl w-full max-w-2xl max-h-3/4 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">ملخص الاجتماع</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMeetingSummary('')}
                  >
                    ×
                  </Button>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4 mb-4">
                  <pre className="text-gray-300 text-sm whitespace-pre-wrap">{meetingSummary}</pre>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      const blob = new Blob([meetingSummary], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `meeting-summary-${Date.now()}.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    تحميل الملخص
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(meetingSummary);
                      toast({ title: "تم النسخ", description: "تم نسخ الملخص إلى الحافظة" });
                    }}
                    className="border-gray-600 text-gray-300"
                  >
                    نسخ للحافظة
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}