export const PAYMENT_METHODS = {
  PAYPAL: "paypal",
  BANK_TRANSFER: "bank_transfer",
  STC_PAY: "stc_pay",
  UR_PAY: "ur_pay",
  ALINMA_PAY: "alinma_pay",
} as const;

export const BANK_DETAILS = {
  BANK_NAME: "بنك الراجحي",
  IBAN: "SA78 8000 0539 6080 1942 4738",
  ACCOUNT_NAME: "منصة معك للخدمات الرقمية",
};

export const WALLET_DETAILS = {
  STC_PAY: "966532441566",
  UR_PAY: "966532441566", 
  ALINMA_PAY: "966532441566",
};

export const CONTACT_INFO = {
  EMAIL: "ma3k.2025@gmail.com",
  WHATSAPP: "+966 532 441 566",
  WHATSAPP_API: "966532441566",
};

export const WHATSAPP_MESSAGE_TEMPLATE = (orderId: string, name: string, amount: number, method: string) => 
  `مرحبًا، أنا ${name}
- رقم الطلب: ${orderId}
- المبلغ: ${amount} ر.س
- طريقة الدفع: ${method}
- إرفق صورة سند التحويل هنا.
الرجاء إصدار الفاتورة وإرسالها لي.`;

export const WHATSAPP_URL = (message: string) => 
  `https://api.whatsapp.com/send/?phone=${CONTACT_INFO.WHATSAPP_API}&text=${encodeURIComponent(message)}`;

export const SERVICE_CATEGORIES = [
  "مواقع وتطبيقات",
  "هويات وتصميم", 
  "متابعة ودعم",
  "تجارب تفاعلية وحلول مبتكرة",
  "مدفوعات ورصيد",
] as const;

export const ORDER_STATUS = {
  PENDING: "pending",
  PAID: "paid", 
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed", 
  FAILED: "failed",
} as const;
