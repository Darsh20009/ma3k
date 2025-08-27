import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Play, Copy, Download, User, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  role: 'developer' | 'designer' | 'manager';
}

interface Message {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'code' | 'action';
}

export default function CodeTool() {
  const { toast } = useToast();
  
  // Code editor states
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  const [fullCode, setFullCode] = useState('');
  const [resultCode, setResultCode] = useState('');
  const [activeTab, setActiveTab] = useState<'merged' | 'preview'>('merged');
  
  // Interactive users states
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'أحمد محمد',
      avatar: 'AM',
      isOnline: true,
      role: 'developer'
    },
    {
      id: '2', 
      name: 'فاطمة علي',
      avatar: 'FA',
      isOnline: true,
      role: 'designer'
    },
    {
      id: '3',
      name: 'سعد الأحمد',
      avatar: 'SA',
      isOnline: false,
      role: 'manager'
    }
  ]);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      userId: '1',
      content: 'مرحباً! هل يمكننا مراجعة الكود المكتوب؟',
      timestamp: new Date(Date.now() - 300000),
      type: 'text'
    },
    {
      id: '2',
      userId: '2',
      content: 'بالطبع، سأضيف بعض التحسينات على CSS',
      timestamp: new Date(Date.now() - 120000),
      type: 'text'
    }
  ]);
  
  const [meetingSummary, setMeetingSummary] = useState('');
  const [newMessage, setNewMessage] = useState('');

  // Code tool functions
  const mergeCodes = () => {
    const merged = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>النتيجة المدمجة</title>
${cssCode ? `    <style>
${cssCode.split('\n').map(line => `        ${line}`).join('\n')}
    </style>` : ''}
</head>
<body>

${htmlCode.split('\n').map(line => `    ${line}`).join('\n')}

${jsCode ? `    <script>
${jsCode.split('\n').map(line => `        ${line}`).join('\n')}
    </script>` : ''}

</body>
</html>`;

    setResultCode(merged);
    setFullCode(merged);
    toast({ title: "تم دمج الكود بنجاح", description: "يمكنك الآن معاينة النتيجة" });
  };

  const splitCode = () => {
    if (!fullCode.trim()) {
      toast({ title: "تنبيه", description: "الرجاء إدخال الكود الكامل أولاً" });
      return;
    }

    let html = fullCode;
    let css = '';
    let js = '';

    // Extract CSS
    const cssMatch = fullCode.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    if (cssMatch && cssMatch[1]) {
      css = cssMatch[1].trim();
      html = html.replace(cssMatch[0], '');
    }

    // Extract JS
    const jsMatch = fullCode.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
    if (jsMatch && jsMatch[1]) {
      js = jsMatch[1].trim();
      html = html.replace(jsMatch[0], '');
    }

    // Extract body content
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch && bodyMatch[1]) {
      html = bodyMatch[1].trim();
    }

    setHtmlCode(html);
    setCssCode(css);
    setJsCode(js);
    
    toast({ title: "تم تفكيك الكود بنجاح", description: "تم توزيع الكود على الأقسام المختلفة" });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: "تم النسخ", description: `تم نسخ ${label} إلى الحافظة` });
    });
  };

  const downloadCode = () => {
    if (!resultCode) {
      toast({ title: "تنبيه", description: "لا يوجد كود لتحميله" });
      return;
    }
    
    const blob = new Blob([resultCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: "تم التحميل", description: "تم تحميل الملف بنجاح" });
  };

  // Interactive users functions
  const generateMeetingInteraction = () => {
    if (!meetingSummary.trim()) {
      toast({ title: "تنبيه", description: "الرجاء كتابة ملخص الاجتماع أولاً" });
      return;
    }

    const responses = [
      'ممتاز! سأبدأ في تطبيق النقاط المذكورة',
      'أعتقد أننا نحتاج إلى مراجعة هذا الجزء مرة أخرى',
      'هل يمكننا إضافة بعض التحسينات على الواجهة؟',
      'الكود يبدو جيداً، لكن نحتاج لاختباره أكثر',
      'سأقوم بتحديث التصميم وفقاً لملاحظاتكم',
      'ما رأيكم في إضافة هذه الميزة الجديدة؟'
    ];

    const newInteractions: Message[] = users
      .filter(user => user.isOnline)
      .map((user, index) => ({
        id: `meeting-${Date.now()}-${index}`,
        userId: user.id,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(Date.now() + index * 2000),
        type: 'text' as const
      }));

    setMessages(prev => [...prev, ...newInteractions]);
    setMeetingSummary('');
    
    toast({ 
      title: "تم تفعيل التفاعل", 
      description: `${newInteractions.length} مشاركين يتفاعلون مع ملخص الاجتماع` 
    });
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: `user-${Date.now()}`,
      userId: 'current-user',
      content: newMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'developer': return 'text-blue-400';
      case 'designer': return 'text-purple-400';
      case 'manager': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">معك كود - ملعب البرمجة التفاعلي</h1>
          <p className="text-gray-300 text-lg">أداة متقدمة لدمج وتفكيك الأكواد مع تفاعل فريق العمل</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Code Editor Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Full Code Input */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">الكود الكامل المدمج</CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(fullCode, 'الكود الكامل')}
                  className="border-gray-600 text-gray-300"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  نسخ
                </Button>
              </CardHeader>
              <CardContent>
                <textarea
                  value={fullCode}
                  onChange={(e) => setFullCode(e.target.value)}
                  placeholder="ألصق الكود الكامل هنا لتفكيكه، أو سيظهر الكود المدمج هنا..."
                  className="w-full h-32 bg-gray-900 text-gray-100 p-4 rounded-lg border border-gray-600 font-mono text-sm resize-none"
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button 
                onClick={splitCode}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                تفكيك الكود إلى أجزاء
              </Button>
              <Button 
                onClick={mergeCodes}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                دمج الأكواد من الأجزاء
              </Button>
            </div>

            {/* Code Sections Grid */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* HTML */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between py-3">
                  <CardTitle className="text-white text-sm">HTML</CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(htmlCode, 'HTML')}
                    className="border-gray-600 text-gray-300 px-2 py-1 text-xs"
                  >
                    نسخ
                  </Button>
                </CardHeader>
                <CardContent className="pt-0">
                  <textarea
                    value={htmlCode}
                    onChange={(e) => setHtmlCode(e.target.value)}
                    placeholder="سيتم عرض كود HTML هنا..."
                    className="w-full h-40 bg-gray-900 text-gray-100 p-3 rounded border border-gray-600 font-mono text-xs resize-none"
                  />
                </CardContent>
              </Card>

              {/* CSS */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between py-3">
                  <CardTitle className="text-white text-sm">CSS</CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(cssCode, 'CSS')}
                    className="border-gray-600 text-gray-300 px-2 py-1 text-xs"
                  >
                    نسخ
                  </Button>
                </CardHeader>
                <CardContent className="pt-0">
                  <textarea
                    value={cssCode}
                    onChange={(e) => setCssCode(e.target.value)}
                    placeholder="سيتم عرض كود CSS هنا..."
                    className="w-full h-40 bg-gray-900 text-gray-100 p-3 rounded border border-gray-600 font-mono text-xs resize-none"
                  />
                </CardContent>
              </Card>

              {/* JavaScript */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between py-3">
                  <CardTitle className="text-white text-sm">JavaScript</CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(jsCode, 'JavaScript')}
                    className="border-gray-600 text-gray-300 px-2 py-1 text-xs"
                  >
                    نسخ
                  </Button>
                </CardHeader>
                <CardContent className="pt-0">
                  <textarea
                    value={jsCode}
                    onChange={(e) => setJsCode(e.target.value)}
                    placeholder="سيتم عرض كود JavaScript هنا..."
                    className="w-full h-40 bg-gray-900 text-gray-100 p-3 rounded border border-gray-600 font-mono text-xs resize-none"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Result Section */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setActiveTab('merged')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === 'merged'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      الكود المدمج
                    </button>
                    <button
                      onClick={() => setActiveTab('preview')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === 'preview'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      معاينة النتيجة
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(resultCode, 'النتيجة النهائية')}
                      className="border-gray-600 text-gray-300"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      نسخ
                    </Button>
                    <Button
                      size="sm"
                      onClick={downloadCode}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      تحميل
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {activeTab === 'merged' ? (
                  <textarea
                    value={resultCode}
                    readOnly
                    placeholder="سيظهر الكود المدمج هنا بعد الضغط على زر الدمج..."
                    className="w-full h-64 bg-gray-900 text-gray-100 p-4 rounded border border-gray-600 font-mono text-sm resize-none"
                  />
                ) : (
                  <div className="h-64 bg-white rounded border border-gray-600">
                    <iframe
                      srcDoc={resultCode}
                      className="w-full h-full rounded"
                      title="معاينة الكود"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Interactive Users Section */}
          <div className="space-y-6">
            {/* Team Members */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  فريق العمل
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center space-x-3 space-x-reverse">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {user.avatar}
                      </div>
                      {user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{user.name}</p>
                      <p className={`text-xs ${getRoleColor(user.role)}`}>
                        {user.role === 'developer' ? 'مطور' : 
                         user.role === 'designer' ? 'مصمم' : 'مدير مشروع'}
                      </p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Meeting Summary */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">ملخص الاجتماع</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  value={meetingSummary}
                  onChange={(e) => setMeetingSummary(e.target.value)}
                  placeholder="اكتب ملخص الاجتماع هنا وسيتفاعل أعضاء الفريق معه..."
                  className="w-full h-24 bg-gray-900 text-gray-100 p-3 rounded border border-gray-600 text-sm resize-none"
                />
                <Button
                  onClick={generateMeetingInteraction}
                  className="w-full bg-amber-600 hover:bg-amber-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  تفعيل التفاعل
                </Button>
              </CardContent>
            </Card>

            {/* Messages */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  الرسائل التفاعلية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                  {messages.map((message) => {
                    const user = users.find(u => u.id === message.userId);
                    return (
                      <div key={message.id} className="flex space-x-3 space-x-reverse">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {user?.avatar || 'ME'}
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-700 rounded-lg p-3">
                            <p className="text-gray-300 text-sm">{message.content}</p>
                            <p className="text-gray-500 text-xs mt-1">
                              {message.timestamp.toLocaleTimeString('ar-SA', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex space-x-2 space-x-reverse">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="اكتب رسالة..."
                    className="bg-gray-900 border-gray-600 text-white"
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button
                    onClick={sendMessage}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    إرسال
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}