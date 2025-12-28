import { motion } from "framer-motion";
import { ExternalLink, Globe, Star, Eye, Loader2, Award, Zap, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import { Card } from "@/components/ui/card";

export default function Portfolio() {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  return (
    <div className="min-h-screen pt-32 pb-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-20">
          <h1 className="text-4xl lg:text-5xl font-bold text-primary">أعمالنا المتميزة</h1>
          <p className="text-xl text-muted-foreground">مجموعة من قصص النجاح التي نفخر بكوننا جزءاً منها</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Real Projects */}
            {projects?.filter(p => p.status === 'completed').map((project, i) => (
              <Card key={project.id} className="luxury-card overflow-hidden group">
                <div className="aspect-video bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                  <Layout className="w-12 h-12 text-muted-foreground opacity-20" />
                </div>
                <div className="p-8 space-y-4">
                  <h3 className="text-xl font-bold">{project.projectName}</h3>
                  <p className="text-muted-foreground line-clamp-2">{project.websiteIdea}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <span className="text-sm font-medium text-primary">مشروع مكتمل</span>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Eye className="w-4 h-4" />
                      عرض التفاصيل
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {/* Static Examples if no real projects */}
            {!projects?.length && [1, 2, 3].map((item) => (
              <Card key={item} className="luxury-card overflow-hidden group">
                <div className="aspect-video bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Globe className="w-12 h-12 text-muted-foreground opacity-20" />
                </div>
                <div className="p-8 space-y-4">
                  <h3 className="text-xl font-bold">مشروع نموذجي {item}</h3>
                  <p className="text-muted-foreground">مثال لمشروع متكامل تم تنفيذه بأعلى معايير الجودة والاحترافية.</p>
                  <Button variant="outline" className="w-full">اكتشف المشروع</Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Portfolio Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-32">
          {[
            { label: "جودة التصميم", value: "100%", icon: Zap },
            { label: "رضا العملاء", value: "99%", icon: Award },
            { label: "دعم فني", value: "24/7", icon: Globe },
          ].map((stat, i) => (
            <div key={i} className="text-center luxury-card p-8 space-y-2">
              <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
