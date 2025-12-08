import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { WHATSAPP_MESSAGE_TEMPLATE, WHATSAPP_URL } from "@/lib/constants";
import type { Service } from "@shared/schema";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
}

export default function OrderModal({ isOpen, onClose, service }: OrderModalProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    description: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: (order) => {
      toast({
        title: "تم إرسال طلبك بنجاح!",
        description: `رقم الطلب: ${order.orderNumber}`,
      });

      // Generate WhatsApp message
      const message = WHATSAPP_MESSAGE_TEMPLATE(
        order.orderNumber,
        formData.customerName,
        service?.price || 0,
        "حسب الاختيار"
      );

      // Open WhatsApp
      window.open(WHATSAPP_URL(message), "_blank");

      onClose();
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        description: "",
      });

      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
    },
    onError: () => {
      toast({
        title: "خطأ في إرسال الطلب",
        description: "حدث خطأ أثناء إرسال طلبك. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;

    createOrderMutation.mutate({
      ...formData,
      serviceId: service.id,
      serviceName: service.name,
      price: service.price,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!service) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl glass-morphism border-2 border-blue-200 backdrop-blur-lg">
        <DialogHeader className="text-center pb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white mb-4 mx-auto animate-glow-pulse">
            <i className="fas fa-shopping-cart text-2xl"></i>
          </div>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🛒 طلب الخدمة
          </DialogTitle>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mt-2"></div>
        </DialogHeader>

        <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl border-2 border-blue-200 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-purple-100/20"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white mr-4">
                <i className="fas fa-star"></i>
              </div>
              <h3 className="font-bold text-xl text-gray-800">{service.name}</h3>
            </div>
            <p className="text-gray-700 mb-4 leading-relaxed">{service.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  💰 {service.price} ر.س
                </span>
              </div>
              <div className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                ✅ جاهز للطلب
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="customerName" className="text-lg font-semibold text-gray-700 flex items-center">
                <i className="fas fa-user text-blue-500 ml-2"></i>
                الاسم الكامل
              </Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => handleInputChange("customerName", e.target.value)}
                required
                className="mt-2 h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-all duration-300"
                placeholder="أدخل اسمك الكامل"
              />
            </div>

            <div>
              <Label htmlFor="customerEmail" className="text-lg font-semibold text-gray-700 flex items-center">
                <i className="fas fa-envelope text-purple-500 ml-2"></i>
                البريد الإلكتروني
              </Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                required
                className="mt-2 h-12 rounded-xl border-2 border-gray-200 focus:border-purple-500 transition-all duration-300"
                placeholder="example@email.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="customerPhone" className="text-lg font-semibold text-gray-700 flex items-center">
              <i className="fab fa-whatsapp text-green-500 ml-2"></i>
              رقم الهاتف / واتساب
            </Label>
            <Input
              id="customerPhone"
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => handleInputChange("customerPhone", e.target.value)}
              required
              className="mt-2 h-12 rounded-xl border-2 border-gray-200 focus:border-green-500 transition-all duration-300"
              placeholder="05xxxxxxxx"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-lg font-semibold text-gray-700 flex items-center">
              <i className="fas fa-file-alt text-orange-500 ml-2"></i>
              وصف مختصر للمشروع
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="اكتب وصفاً مفصلاً لما تريده... كلما كان الوصف أوضح، كانت النتيجة أفضل! 🎯"
              rows={4}
              className="mt-2 rounded-xl border-2 border-gray-200 focus:border-orange-500 transition-all duration-300 resize-none"
            />
          </div>

          <div className="border-t border-gray-200 pt-6 mt-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-14 rounded-xl border-2 border-gray-300 hover:border-gray-400 font-semibold text-lg transition-all duration-300"
              >
                ❌ إلغاء
              </Button>
              <Button
                type="submit"
                disabled={createOrderMutation.isPending}
                className="flex-1 h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-lg rounded-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {createOrderMutation.isPending ? (
                    <>
                      <i className="fas fa-spinner animate-spin ml-2"></i>
                      ⏳ جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane ml-2"></i>
                      🚀 إرسال الطلب
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-center text-blue-800 font-medium">
                💡 بعد إرسال الطلب سيتم فتح واتساب تلقائياً لإكمال التواصل
              </p>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}