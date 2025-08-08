import InvoiceGenerator from "@/components/invoice/invoice-generator";

export default function Invoices() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="gradient-bg text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in-down">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              مولد الفواتير الإبداعي
            </span>
          </h1>
          <p className="text-xl opacity-90 animate-fade-in-up">
            أنشئ فواتير HTML احترافية وإبداعية بتصاميم متنوعة ومتقدمة
          </p>
        </div>
      </section>

      {/* Invoice Generator */}
      <section className="py-20">
        <InvoiceGenerator />
      </section>
    </div>
  );
}