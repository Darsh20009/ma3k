import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Award, 
  Users, 
  Target, 
  Zap, 
  Globe, 
  MessageCircle,
  ExternalLink,
  CheckCircle,
  Code,
  Briefcase,
  Crown,
  Bolt,
  Laptop,
  Link2,
  Settings,
  Palette
} from "lucide-react";
import { Link } from "wouter";

export default function About() {
  const teamMembers = [
    {
      id: 1,
      name: "مستر مارك",
      position: "المدير التنفيذي للمواقع والمشاكل",
      description: "خبير في حل المشاكل التقنية المعقدة وإدارة مشاريع المواقع الكبيرة مع أكثر من 10 سنوات من الخبرة",
      skills: ["إدارة المشاريع", "حل المشاكل التقنية", "استشارات تقنية", "قيادة الفرق"],
      certifications: ["PMP", "AWS Solutions Architect", "Scrum Master"],
      experience: "10+ سنوات",
      projects: "200+ مشروع",
      icon: Target
    },
    {
      id: 2,
      name: "مستر جون",
      position: "المدير التنفيذي للشركة (CEO)",
      description: "قائد رؤيوي يدير استراتيجية الشركة والنمو مع التركيز على الابتكار والتميز في الخدمات الرقمية",
      skills: ["القيادة الاستراتيجية", "تطوير الأعمال", "إدارة الشركات", "الابتكار"],
      certifications: ["Executive MBA", "Digital Leadership", "Business Strategy"],
      experience: "15+ سنة",
      projects: "مؤسس الشركة",
      icon: Crown
    },
    {
      id: 3,
      name: "يوسف درويش",
      position: "مدير فرق إنشاء المواقع والتنفيذي للمواقع الكبيرة",
      description: "خبير في تطوير المواقع الكبيرة والمعقدة مع تخصص في Oracle APEX وحلول قواعد البيانات المتقدمة",
      skills: ["Oracle APEX", "Full Stack Development", "إدارة الفرق", "حلول المؤسسات"],
      certifications: ["Oracle APEX Certified", "Oracle Database", "Project Management"],
      experience: "8+ سنوات",
      projects: "150+ موقع كبير",
      portfolio: "https://youssef.ma3k.online/",
      icon: Bolt
    },
    {
      id: 4,
      name: "فاطمة",
      position: "مبرمجة متقدمة",
      description: "مطورة ماهرة متخصصة في تطوير التطبيقات الحديثة والواجهات التفاعلية باستخدام أحدث التقنيات",
      skills: ["React/Next.js", "TypeScript", "Node.js", "UI/UX Development"],
      certifications: ["React Professional", "JavaScript Expert", "Web Development"],
      experience: "5+ سنوات",
      projects: "80+ تطبيق",
      icon: Laptop
    },
    {
      id: 5,
      name: "نورة",
      position: "مبرمجة APIs متخصصة",
      description: "خبيرة في تصميم وتطوير واجهات برمجة التطبيقات المتقدمة والتكامل مع الأنظمة المختلفة",
      skills: ["REST APIs", "GraphQL", "Microservices", "API Security"],
      certifications: ["API Design Expert", "Cloud Integration", "Security Professional"],
      experience: "6+ سنوات",
      projects: "100+ API",
      icon: Link2
    },
    {
      id: 6,
      name: "محمود",
      position: "مدير الباك اند",
      description: "خبير في إدارة وتطوير الأنظمة الخلفية المعقدة وقواعد البيانات الكبيرة مع ضمان الأمان والأداء",
      skills: ["Database Management", "Server Architecture", "DevOps", "System Security"],
      certifications: ["AWS Certified", "Database Administrator", "DevOps Professional"],
      experience: "7+ سنوات",
      projects: "120+ نظام خلفي",
      icon: Settings
    },
    {
      id: 7,
      name: "خالد",
      position: "مطور الواجهات الأمامية",
      description: "مصمم ومطور إبداعي متخصص في إنشاء تجارب مستخدم استثنائية وواجهات تفاعلية جذابة",
      skills: ["Vue.js", "Angular", "CSS Animation", "Responsive Design"],
      certifications: ["Frontend Expert", "UX/UI Design", "Animation Specialist"],
      experience: "4+ سنوات",
      projects: "90+ واجهة",
      icon: Palette
    }
  ];

  const companyValues = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "الإبداع والابتكار",
      description: "نؤمن بأن الإبداع هو مفتاح النجاح في العصر الرقمي"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "التميز في الجودة",
      description: "نسعى لتقديم أعلى معايير الجودة في كل مشروع"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "العمل الجماعي",
      description: "فريق متكامل من الخبراء يعمل بروح واحدة"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "الرؤية المستقبلية",
      description: "نواكب أحدث التطورات التقنية والاتجاهات العالمية"
    }
  ];

  const stats = [
    { value: "500+", label: "مشروع مكتمل", color: "var(--ma3k-green)" },
    { value: "300+", label: "عميل سعيد", color: "var(--ma3k-teal)" },
    { value: "5+", label: "سنوات خبرة", color: "var(--ma3k-beige)" },
    { value: "7", label: "خبراء متخصصين", color: "var(--ma3k-green)" }
  ];

  return (
    <div className="min-h-screen py-24" style={{ background: "var(--ma3k-darker)" }}>
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge 
              className="mb-6 px-4 py-2"
              style={{ 
                background: "var(--glass-bg)", 
                border: "1px solid var(--ma3k-green)", 
                color: "var(--ma3k-green)" 
              }}
              data-testid="badge-about"
            >
              <Users className="w-4 h-4 ml-2" />
              تعرف علينا
            </Badge>
            <h1 
              className="text-4xl md:text-6xl font-black mb-6"
              style={{ color: "var(--ma3k-beige)" }}
            >
              من <span style={{ color: "var(--ma3k-green)" }}>نحن</span>
            </h1>
            <p 
              className="text-xl leading-relaxed"
              style={{ color: "var(--ma3k-beige-dark)" }}
            >
              نحن فريق من الخبراء المبدعين نسعى لتحويل أفكارك الرقمية إلى حقيقة مذهلة
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{ color: "var(--ma3k-beige)" }}
            >
              قصة نجاحنا
            </h2>
            <p 
              className="text-lg leading-relaxed"
              style={{ color: "var(--ma3k-beige-dark)" }}
            >
              بدأت رحلتنا برؤية واضحة: تمكين الشركات والأفراد من النجاح في العالم الرقمي. 
              اليوم، نحن فخورون بكوننا الشريك الموثوق لمئات العملاء في رحلة التحول الرقمي.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl"
                style={{ 
                  background: "var(--glass-bg)",
                  border: "1px solid var(--glass-border)"
                }}
                data-testid={`stat-${index}`}
              >
                <div 
                  className="text-3xl md:text-4xl font-black mb-2"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>
                <div style={{ color: "var(--ma3k-beige-dark)" }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            style={{ color: "var(--ma3k-beige)" }}
          >
            قيمنا ومبادئنا
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyValues.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 rounded-2xl hover-elevate"
                style={{ 
                  background: "var(--glass-bg)",
                  border: "1px solid var(--glass-border)"
                }}
                data-testid={`value-${index}`}
              >
                <div 
                  className="mb-4 flex justify-center"
                  style={{ color: "var(--ma3k-green)" }}
                >
                  {value.icon}
                </div>
                <h3 
                  className="text-xl font-bold mb-3"
                  style={{ color: "var(--ma3k-beige)" }}
                >
                  {value.title}
                </h3>
                <p style={{ color: "var(--ma3k-beige-dark)" }}>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "var(--ma3k-beige)" }}
            >
              فريق الخبراء
            </h2>
            <p 
              className="text-lg max-w-2xl mx-auto"
              style={{ color: "var(--ma3k-beige-dark)" }}
            >
              تعرف على الخبراء الذين يقفون وراء نجاح مشاريعك
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                data-testid={`team-member-${member.id}`}
              >
                <Card 
                  className="h-full border-0"
                  style={{ 
                    background: "var(--glass-bg)",
                    border: "1px solid var(--glass-border)"
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div 
                        className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ 
                          background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))"
                        }}
                      >
                        <member.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 
                          className="text-xl font-bold mb-1"
                          style={{ color: "var(--ma3k-beige)" }}
                        >
                          {member.name}
                        </h3>
                        <p 
                          className="font-medium mb-2"
                          style={{ color: "var(--ma3k-green)" }}
                        >
                          {member.position}
                        </p>
                        <p 
                          className="text-sm leading-relaxed"
                          style={{ color: "var(--ma3k-beige-dark)" }}
                        >
                          {member.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 
                          className="text-sm font-semibold mb-2 flex items-center"
                          style={{ color: "var(--ma3k-beige)" }}
                        >
                          <Code className="w-4 h-4 ml-2" style={{ color: "var(--ma3k-teal)" }} />
                          المهارات
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {member.skills.map((skill, skillIndex) => (
                            <Badge 
                              key={skillIndex}
                              variant="secondary"
                              className="text-xs"
                              style={{ 
                                background: "rgba(0, 168, 150, 0.15)", 
                                color: "var(--ma3k-teal)",
                                border: "1px solid rgba(0, 168, 150, 0.3)"
                              }}
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 
                          className="text-sm font-semibold mb-2 flex items-center"
                          style={{ color: "var(--ma3k-beige)" }}
                        >
                          <Award className="w-4 h-4 ml-2" style={{ color: "var(--ma3k-green)" }} />
                          الشهادات
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {member.certifications.map((cert, certIndex) => (
                            <Badge 
                              key={certIndex}
                              variant="outline"
                              className="text-xs"
                              style={{ 
                                borderColor: "rgba(122, 201, 67, 0.4)", 
                                color: "var(--ma3k-green)"
                              }}
                            >
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-6 pt-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" style={{ color: "var(--ma3k-green)" }} />
                          <span style={{ color: "var(--ma3k-beige-dark)" }}>{member.experience}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4" style={{ color: "var(--ma3k-green)" }} />
                          <span style={{ color: "var(--ma3k-beige-dark)" }}>{member.projects}</span>
                        </div>
                      </div>

                      {member.portfolio && (
                        <a 
                          href={member.portfolio} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block"
                        >
                          <Button 
                            variant="outline" 
                            size="sm"
                            style={{ 
                              borderColor: "var(--ma3k-teal)",
                              color: "var(--ma3k-teal)"
                            }}
                            data-testid={`button-portfolio-${member.id}`}
                          >
                            <ExternalLink className="w-4 h-4 ml-2" />
                            عرض الأعمال
                          </Button>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto p-8 md:p-12 rounded-3xl"
            style={{ 
              background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))"
            }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              مستعدون لبدء مشروعك؟
            </h2>
            <p className="text-lg text-white/80 mb-8">
              تواصل معنا اليوم ودعنا نحول أفكارك إلى حقيقة رقمية مذهلة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.me/966532441566" target="_blank" rel="noopener noreferrer">
                <Button 
                  size="lg"
                  className="w-full sm:w-auto"
                  style={{ 
                    background: "white",
                    color: "var(--ma3k-darker)"
                  }}
                  data-testid="button-whatsapp-cta"
                >
                  <MessageCircle className="w-5 h-5 ml-2" />
                  تواصل معنا عبر واتساب
                </Button>
              </a>
              <Link href="/services">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full sm:w-auto border-2"
                  style={{ 
                    borderColor: "white",
                    color: "white",
                    background: "transparent"
                  }}
                  data-testid="button-services-cta"
                >
                  <Briefcase className="w-5 h-5 ml-2" />
                  استكشف خدماتنا
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
