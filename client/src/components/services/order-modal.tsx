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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            طلب الخدمة
          </DialogTitle>
        </DialogHeader>

        <div className="mb-6 p-4 bg-primary-50 rounded-lg">
          <h3 className="font-bold text-lg text-primary-700">{service.name}</h3>
          <p className="text-primary-600 mt-1">{service.description}</p>
          <p className="text-2xl font-bold text-primary-600 mt-2">
            {service.price} ر.س
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="customerName">الاسم الكامل</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => handleInputChange("customerName", e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="customerEmail">البريد الإلكتروني</Label>
            <Input
              id="customerEmail"
              type="email"
              value={formData.customerEmail}
              onChange={(e) => handleInputChange("customerEmail", e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="customerPhone">رقم الهاتف / واتساب</Label>
            <Input
              id="customerPhone"
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => handleInputChange("customerPhone", e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">وصف مختصر للمشروع</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="اكتب وصفاً مختصراً لما تريده..."
              rows={4}
              className="mt-1"
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={createOrderMutation.isPending}
              className="flex-1 bg-primary-500 hover:bg-primary-600"
            >
              {createOrderMutation.isPending ? "جاري الإرسال..." : "إرسال الطلب"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
