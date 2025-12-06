import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useWebSocket } from "@/hooks/use-websocket";
import { 
  MessagesSquare, 
  Send, 
  User, 
  Clock,
  CheckCheck,
  Circle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type ChatConversation = {
  id: string;
  projectId?: string;
  clientId?: string;
  employeeId?: string;
  type: string;
  status: string;
  lastMessageAt?: string;
  createdAt?: string;
};

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: string;
  senderName: string;
  content: string;
  messageType: string;
  fileUrl?: string;
  fileName?: string;
  isRead: boolean;
  createdAt: string;
};

type UnifiedChatProps = {
  userId: string;
  userType: "client" | "employee" | "admin";
  userName: string;
  projectId?: string;
  projectName?: string;
  clientName?: string;
  className?: string;
  showConversationsList?: boolean;
  onConversationSelect?: (conversation: ChatConversation) => void;
  getContactName?: (conversation: ChatConversation) => string;
};

export function UnifiedChat({
  userId,
  userType,
  userName,
  projectId,
  projectName,
  clientName,
  className = "",
  showConversationsList = true,
  onConversationSelect,
  getContactName
}: UnifiedChatProps) {
  const { toast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversationsQueryKey = userType === "client" 
    ? ["/api/chat/conversations/client", userId]
    : userType === "employee"
    ? ["/api/chat/conversations/employee", userId]
    : ["/api/chat/conversations/admin", userId];

  const { data: conversations = [], refetch: refetchConversations } = useQuery<ChatConversation[]>({
    queryKey: conversationsQueryKey,
    enabled: !!userId,
  });

  const { data: messages = [], refetch: refetchMessages } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat/conversations", selectedConversation?.id, "messages"],
    queryFn: async () => {
      if (!selectedConversation?.id) return [];
      const res = await fetch(`/api/chat/conversations/${selectedConversation.id}/messages`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!selectedConversation?.id,
    refetchInterval: 5000,
  });

  const handleWebSocketMessage = useCallback((message: any) => {
    if (message.type === "chat_message") {
      refetchMessages();
      refetchConversations();
    }
  }, [refetchMessages, refetchConversations]);

  useWebSocket({
    userId,
    userType,
    onMessage: handleWebSocketMessage
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { conversationId: string; content: string }) => {
      return await apiRequest("POST", "/api/chat/messages", {
        conversationId: data.conversationId,
        senderId: userId,
        senderType: userType,
        senderName: userName,
        content: data.content,
        messageType: "text"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/conversations", selectedConversation?.id, "messages"] });
      setNewMessage("");
    },
    onError: () => {
      toast({
        title: "خطأ في إرسال الرسالة",
        variant: "destructive"
      });
    }
  });

  const createConversationMutation = useMutation({
    mutationFn: async (data: { projectId: string; clientId?: string; employeeId?: string }) => {
      return await apiRequest("POST", "/api/chat/conversations", {
        ...data,
        type: "project"
      });
    },
    onSuccess: () => {
      refetchConversations();
    }
  });

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    if (!selectedConversation && projectId) {
      try {
        const response = await apiRequest("POST", "/api/chat/conversations", {
          projectId,
          clientId: userType === "client" ? userId : undefined,
          employeeId: userType === "employee" ? userId : undefined,
          type: "project"
        });
        const newConv = await response.json() as ChatConversation;
        setSelectedConversation(newConv);
        refetchConversations();
        
        await sendMessageMutation.mutateAsync({
          conversationId: newConv.id,
          content: newMessage
        });
        return;
      } catch (error) {
        toast({ title: "خطأ في إنشاء المحادثة", variant: "destructive" });
        return;
      }
    }

    if (selectedConversation) {
      sendMessageMutation.mutate({
        conversationId: selectedConversation.id,
        content: newMessage
      });
    }
  };

  const handleConversationClick = (conv: ChatConversation) => {
    setSelectedConversation(conv);
    onConversationSelect?.(conv);
    
    apiRequest("PUT", `/api/chat/conversations/${conv.id}/read`, {
      userId,
      userType
    }).catch(() => {});
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (projectId && conversations.length > 0) {
      const projectConv = conversations.find(c => c.projectId === projectId);
      if (projectConv && !selectedConversation) {
        setSelectedConversation(projectConv);
      }
    }
  }, [projectId, conversations, selectedConversation]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });
    } else if (days === 1) {
      return "أمس";
    } else if (days < 7) {
      return `${days} أيام`;
    } else {
      return date.toLocaleDateString("ar-SA");
    }
  };

  const getDefaultContactName = (conv: ChatConversation) => {
    if (getContactName) return getContactName(conv);
    if (userType === "client") return "فريق الدعم";
    return clientName || "عميل";
  };

  return (
    <div className={`flex gap-4 h-full ${className}`}>
      {showConversationsList && (
        <Card className="w-80 flex flex-col" style={{ background: "var(--ma3k-dark)", borderColor: "var(--ma3k-border)" }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2" style={{ color: "var(--ma3k-beige)" }}>
              <MessagesSquare className="w-5 h-5" style={{ color: "var(--ma3k-teal)" }} />
              المحادثات
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full">
              {conversations.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <MessagesSquare className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--ma3k-beige-dark)" }} />
                  <p style={{ color: "var(--ma3k-beige-dark)" }}>لا توجد محادثات</p>
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {conversations.map((conv) => (
                    <motion.button
                      key={conv.id}
                      onClick={() => handleConversationClick(conv)}
                      className="w-full p-3 rounded-xl text-right transition-all hover-elevate"
                      style={{
                        background: selectedConversation?.id === conv.id
                          ? "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))"
                          : "var(--ma3k-darker)",
                        color: selectedConversation?.id === conv.id ? "white" : "var(--ma3k-beige)"
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      data-testid={`chat-conversation-${conv.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback style={{ background: "var(--ma3k-teal)", color: "white" }}>
                            <User className="w-5 h-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{getDefaultContactName(conv)}</p>
                          <p className="text-xs truncate opacity-70">
                            {conv.lastMessageAt && formatTime(conv.lastMessageAt)}
                          </p>
                        </div>
                        {conv.status === "active" && (
                          <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <Card className="flex-1 flex flex-col" style={{ background: "var(--ma3k-dark)", borderColor: "var(--ma3k-border)" }}>
        {selectedConversation || projectId ? (
          <>
            <CardHeader className="pb-3 border-b" style={{ borderColor: "var(--ma3k-border)" }}>
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback style={{ background: "var(--ma3k-teal)", color: "white" }}>
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle style={{ color: "var(--ma3k-beige)" }}>
                    {selectedConversation ? getDefaultContactName(selectedConversation) : "محادثة جديدة"}
                  </CardTitle>
                  {projectName && (
                    <p className="text-sm" style={{ color: "var(--ma3k-beige-dark)" }}>
                      {projectName}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
            <ScrollArea className="flex-1 p-4">
              <AnimatePresence>
                {messages.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <MessagesSquare className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--ma3k-beige-dark)" }} />
                    <p style={{ color: "var(--ma3k-beige-dark)" }}>لا توجد رسائل بعد. ابدأ المحادثة!</p>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, index) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex ${msg.senderType === userType ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className="max-w-[70%] rounded-2xl p-3"
                          style={{
                            background: msg.senderType === userType
                              ? "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))"
                              : "var(--ma3k-darker)",
                            color: msg.senderType === userType ? "white" : "var(--ma3k-beige)"
                          }}
                        >
                          {msg.senderType !== userType && (
                            <p className="text-xs font-medium mb-1" style={{ color: "var(--ma3k-teal)" }}>
                              {msg.senderName}
                            </p>
                          )}
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <span className="text-xs opacity-70">
                              {formatTime(msg.createdAt)}
                            </span>
                            {msg.senderType === userType && msg.isRead && (
                              <CheckCheck className="w-3 h-3 opacity-70" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </AnimatePresence>
            </ScrollArea>
            <div className="p-4 border-t" style={{ borderColor: "var(--ma3k-border)" }}>
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="اكتب رسالتك..."
                  className="flex-1"
                  style={{ 
                    background: "var(--ma3k-darker)", 
                    borderColor: "var(--ma3k-border)", 
                    color: "var(--ma3k-beige)" 
                  }}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  data-testid="input-chat-message"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sendMessageMutation.isPending}
                  style={{ background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))" }}
                  data-testid="button-send-message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessagesSquare className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--ma3k-beige-dark)" }} />
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--ma3k-beige)" }}>
                اختر محادثة
              </h3>
              <p style={{ color: "var(--ma3k-beige-dark)" }}>
                اختر محادثة من القائمة لبدء المراسلة
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export function ChatWidget({
  userId,
  userType,
  userName,
  projectId,
  projectName,
  className = ""
}: Omit<UnifiedChatProps, "showConversationsList">) {
  return (
    <UnifiedChat
      userId={userId}
      userType={userType}
      userName={userName}
      projectId={projectId}
      projectName={projectName}
      showConversationsList={false}
      className={className}
    />
  );
}
