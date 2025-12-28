import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      q: "ما هي المدة المستغرقة لتنفيذ الموقع؟",
      a: "تعتمد المدة على حجم المشروع ومتطلباته، ولكن غالباً ما تستغرق المواقع التعريفية من 7 إلى 14 يوم عمل، بينما المتاجر والأنظمة الكبرى قد تستغرق شهراً أو أكثر."
    },
    {
      q: "هل توفرون استضافة ونطاق (Domain)؟",
      a: "نعم، نقدم باقات متكاملة تشمل الاستضافة السحابية الآمنة وحجز النطاق، بالإضافة إلى خدمات الصيانة الدورية."
    },
    {
      q: "كيف يتم سداد قيمة المشروع؟",
      a: "نقبل وسائل دفع متعددة تشمل البطاقات الائتمانية، مدى، Apple Pay، والتحويل البنكي، ونوفر خيارات تقسيط لبعض الباقات."
    },
    {
      q: "هل أستطيع التعديل على الموقع بعد استلامه؟",
      a: "بالتأكيد، ستحصل على لوحة تحكم سهلة تمكنك من إدارة المحتوى، كما نوفر دعماً فنياً مستمراً لأي تعديلات برمجية مستقبلية."
    },
    {
      q: "ماذا لو لم يعجبني التصميم؟",
      a: "نعمل معك خطوة بخطوة، حيث يتم اعتماد النماذج الأولية قبل البدء في البرمجة لضمان توافق النتيجة النهائية مع رؤيتك تماماً."
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 bg-background">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-primary">الأسئلة الشائعة</h1>
          <p className="text-xl text-muted-foreground">كل ما تريد معرفته عن خدماتنا وعملية التنفيذ</p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="luxury-card border px-6">
              <AccordionTrigger className="text-lg font-bold hover:no-underline hover:text-primary transition-colors text-right">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-lg leading-relaxed pt-2 pb-6">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-20 text-center space-y-6 p-10 rounded-3xl bg-slate-50 dark:bg-slate-900 border">
          <h3 className="text-2xl font-bold">لم تجد إجابة لاستفسارك؟</h3>
          <p className="text-muted-foreground">نحن متواجدون للرد على كافة أسئلتك عبر الواتساب أو الإيميل</p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => window.location.href='/contact'}>تواصل معنا</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
