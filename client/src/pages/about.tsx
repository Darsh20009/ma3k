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
  Download,
  CheckCircle,
  Code,
  Database,
  Palette,
  Shield
} from "lucide-react";

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
      avatar: "🎯"
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
      avatar: "👑"
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
      avatar: "⚡"
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
      avatar: "💻"
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
      avatar: "🔗"
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
      avatar: "⚙️"
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
      avatar: "🎨"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-amber-400 to-purple-400 bg-clip-text text-transparent">
                من نحن
              </span>
            </h1>
            <p className="text-2xl text-purple-200 max-w-4xl mx-auto leading-relaxed">
              نحن فريق من الخبراء المبدعين نسعى لتحويل أفكارك الرقمية إلى حقيقة مذهلة
            </p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-8 flex justify-center space-x-4"
            >
              {['💎', '🚀', '✨', '🌟'].map((emoji, index) => (
                <motion.div
                  key={index}
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    delay: index * 0.2, 
                    duration: 2, 
                    repeat: Infinity 
                  }}
                  className="text-4xl"
                >
                  {emoji}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-8">قصة نجاحنا</h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              بدأت رحلتنا برؤية واضحة: تمكين الشركات والأفراد من النجاح في العالم الرقمي. 
              اليوم، نحن فخورون بكوننا الشريك الموثوق لمئات العملاء في رحلة التحول الرقمي.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-amber-400 mb-2">500+</div>
              <div className="text-gray-300">مشروع مكتمل</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-purple-400 mb-2">300+</div>
              <div className="text-gray-300">عميل سعيد</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-blue-400 mb-2">5+</div>
              <div className="text-gray-300">سنوات خبرة</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-green-400 mb-2">7</div>
              <div className="text-gray-300">خبراء متخصصين</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center text-white mb-16"
          >
            قيمنا ومبادئنا
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyValues.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20"
              >
                <div className="text-amber-400 mb-4 flex justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">فريق الخبراء</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              تعرف على الخبراء الذين يقفون وراء نجاح مشاريعك
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-white/20 h-full">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="text-6xl">{member.avatar}</div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                        <p className="text-amber-400 font-semibold mb-3">{member.position}</p>
                        <p className="text-gray-300 leading-relaxed">{member.description}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white font-semibold mb-2 flex items-center">
                          <Code className="w-4 h-4 ml-2 text-purple-400" />
                          المهارات
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {member.skills.map((skill, skillIndex) => (
                            <Badge 
                              key={skillIndex}
                              variant="secondary"
                              className="bg-purple-500/20 text-purple-300 border-purple-400/30"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-semibold mb-2 flex items-center">
                          <Award className="w-4 h-4 ml-2 text-amber-400" />
                          الشهادات
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {member.certifications.map((cert, certIndex) => (
                            <Badge 
                              key={certIndex}
                              variant="outline"
                              className="border-amber-400/50 text-amber-300"
                            >
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-gray-300">{member.experience}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-amber-400" />
                          <span className="text-gray-300">{member.projects}</span>
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
                            className="border-blue-400/50 text-blue-300 hover:bg-blue-400/20"
                          >
                            <ExternalLink className="w-4 h-4 ml-2" />
                            عرض الأعمال
                          </Button>
                        </a>
                      )}

                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-gray-400/50 text-gray-300 hover:bg-gray-400/20"
                      >
                        <Download className="w-4 h-4 ml-2" />
                        تحميل السيرة الذاتية
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              مستعدون لبدء مشروعك؟
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              تواصل معنا اليوم ودعنا نحول أفكارك إلى حقيقة رقمية مذهلة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.me/966532441566" target="_blank" rel="noopener noreferrer">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-4 px-8 rounded-full text-lg shadow-xl"
                >
                  <MessageCircle className="w-6 h-6 ml-2" />
                  تواصل معنا عبر واتساب
                </Button>
              </a>
              <a href="/services">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white py-4 px-8 rounded-full text-lg font-bold"
                >
                  <Globe className="w-6 h-6 ml-2" />
                  استكشف خدماتنا
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}