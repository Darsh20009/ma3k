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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                <Video className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-white">Ma3k Meet</h1>
            </div>
            <p className="text-xl text-gray-300 mb-2">منصة الاجتماعات الافتراضية المتقدمة</p>
            <p className="text-gray-400">تعاون، تواصل، وأبدع مع فريقك في بيئة تفاعلية متطورة</p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">اجتماعات عالية الجودة</h3>
              <p className="text-gray-300 text-sm">فيديو وصوت بجودة 4K مع تقنيات ذكية لتحسين الاتصال</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
            >
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">التعاون في البرمجة</h3>
              <p className="text-gray-300 text-sm">شارك وحرر الكود مع فريقك في الوقت الفعلي</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
            >
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">ذكاء اصطناعي</h3>
              <p className="text-gray-300 text-sm">ملخصات تلقائية وترجمة فورية ومساعد ذكي</p>
            </motion.div>
          </div>

          {/* Meeting Setup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/30 rounded-2xl p-8 text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-6">ابدأ اجتماعك الآن</h2>
            
            <div className="flex items-center justify-center gap-4 mb-8">
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                رقم الاجتماع: {meetingId}
              </Badge>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                {participants.filter(p => p.isOnline).length} مشارك متصل
              </Badge>
            </div>
            
            {/* Pre-meeting controls */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setMicEnabled(!micEnabled)}
                className={micEnabled ? "border-green-500 text-green-500" : "border-red-500 text-red-500"}
              >
                {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCameraEnabled(!cameraEnabled)}
                className={cameraEnabled ? "border-green-500 text-green-500" : "border-red-500 text-red-500"}
              >
                {cameraEnabled ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className="border-gray-500 text-gray-400"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
            
            <Button
              onClick={startMeeting}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-full text-lg"
            >
              <Video className="w-6 h-6 mr-3" />
              بدء الاجتماع
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Meeting Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400 font-medium">مباشر</span>
            </div>
            <div className="text-white font-bold">اجتماع {meetingId}</div>
            <div className="text-gray-400 text-sm">{formatDuration(meetingDuration)}</div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
              {participants.filter(p => p.isOnline).length} مشارك
            </Badge>
            {isRecording && (
              <Badge variant="secondary" className="bg-red-500/20 text-red-400">
                يتم التسجيل
              </Badge>
            )}
          </div>
        </div>
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