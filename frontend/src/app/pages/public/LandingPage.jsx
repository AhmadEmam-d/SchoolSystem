import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Shield, 
  BarChart3,
  MessageSquare,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback.tsx';
import { useTranslation } from 'react-i18next';

export function LandingPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const features = [
    {
      icon: GraduationCap,
      title: isRTL ? 'أدوات المعلم' : 'Teacher Tools',
      description: isRTL
        ? 'إدارة الصفوف وتتبع الحضور وتعيين الدروس والواجبات والتواصل مع أولياء الأمور والطلاب بسلاسة.'
        : 'Manage classes, track attendance, assign lessons and homework, contact parents, and communicate with students seamlessly.',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
    }
  ];

  const capabilities = [
    {
      icon: Calendar,
      title: isRTL ? 'تتبع الحضور الذكي' : 'Smart Attendance Tracking',
      description: isRTL
        ? 'مراقبة الحضور في الوقت الفعلي مع تقارير شهرية وإشعارات آلية لأولياء الأمور.'
        : 'Real-time gate-attendance monitoring with monthly reports and automated notifications to parents.',
      color: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: BarChart3,
      title: isRTL ? 'إدارة الدرجات' : 'Grade Management',
      description: isRTL
        ? 'تتبع شامل للدرجات ونتائج الاختبارات وتقارير الأداء التفصيلية لكل مادة.'
        : 'Comprehensive grade tracking, exam results, and detailed performance reports for every subject.',
      color: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: MessageSquare,
      title: isRTL ? 'التواصل المتكامل' : 'Integrated Communication',
      description: isRTL
        ? 'نظام مراسلة مدمج للتواصل السلس بين جميع أصحاب المصلحة.'
        : 'Built-in messaging system for seamless communication between all stakeholders.',
      color: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400'
    },
    {
      icon: CreditCard,
      title: isRTL ? 'نظام الدفع الآمن' : 'Secure Payment System',
      description: isRTL
        ? 'معالجة آمنة ومريحة للمدفوعات الإلكترونية للرسوم الدراسية وامصاريف.'
        : 'Safe and convenient online payment processing for tuition and school expenses.',
      color: 'bg-orange-100 dark:bg-orange-900/30',
      iconColor: 'text-orange-600 dark:text-orange-400'
    }
  ];

  const stats = [
    { number: '500+', label: isRTL ? 'مدرسة' : 'Schools' },
    { number: '50K+', label: isRTL ? 'طالب' : 'Students' },
    { number: '99%', label: isRTL ? 'رضا العملاء' : 'Satisfaction' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className={`flex items-center justify-between px-6 lg:px-12 py-5 border-b border-border sticky top-0 bg-background/95 backdrop-blur-md z-50 shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-foreground">Edu Smart</span>
        </div>
        <div className={`hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
          <a href="#features" className="hover:text-primary transition-colors">{isRTL ? 'الميزات' : 'Features'}</a>
          <a href="#about" className="hover:text-primary transition-colors">{isRTL ? 'حول' : 'About'}</a>
          <a href="#contact" className="hover:text-primary transition-colors">{isRTL ? 'تواصل' : 'Contact'}</a>
        </div>
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button variant="ghost" onClick={() => navigate('/login')} className="hidden sm:inline-flex">
            {t('signInBtn')}
          </Button>
          <Button onClick={() => navigate('/login')} className="bg-blue-600 hover:bg-blue-700 text-white">
            {isRTL ? 'ابدأ الآن' : 'Get Started'}
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 lg:px-12 pt-16 pb-20 lg:pt-24 lg:pb-32 bg-gradient-to-b from-blue-50/50 dark:from-blue-900/10 to-background overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className={`grid lg:grid-cols-2 gap-12 items-center ${isRTL ? 'lg:grid-cols-2' : ''}`}>
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className={isRTL ? 'text-right order-2 lg:order-1' : ''}
            >
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-6 leading-tight">
                {isRTL 
                  ? <>إدارة مدرسية حديثة{' '}<span className="text-blue-600">بكل سهولة</span></>
                  : <>Modern School Management Made{' '}<span className="text-blue-600">Simple</span></>
                }
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
                {isRTL
                  ? 'قم بتبسيط مؤسستك التعليمية بنظام إدارة شامل. تتبع الحضور وإدارة الدرجات والتواصل بسلاسة وتمكين كل مشارك في رحلة التعليم.'
                  : 'Streamline your educational institution with our comprehensive management system. Track attendance, manage grades, communicate seamlessly, and empower every stakeholder in the education journey.'
                }
              </p>
              <div className={`flex flex-col sm:flex-row gap-4 mb-12 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                <Button 
                  size="lg"
                  onClick={() => navigate('/login')}
                  className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {isRTL ? 'ابدأ الآن' : 'Get Started'}
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 h-12 px-8 text-base font-semibold"
                >
                  {isRTL ? 'اعرف المزيد' : 'Learn More'}
                </Button>
              </div>

              {/* Stats */}
              <div className={`flex flex-wrap gap-8 ${isRTL ? 'justify-end' : ''}`}>
                {stats.map((stat, index) => (
                  <div key={index} className={isRTL ? 'text-right' : ''}>
                    <div className="text-3xl lg:text-4xl font-bold text-foreground mb-1">{stat.number}</div>
                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`relative ${isRTL ? 'order-1 lg:order-2' : ''}`}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1759752394755-1241472b589d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBkYXNoYm9hcmQlMjBhbmFseXRpY3MlMjBzY3JlZW58ZW58MXx8fHwxNzcyMjk2NzE4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt={isRTL ? "لوحة تحكم إديو سمارت" : "Edu Smart Dashboard"}
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-28 px-6 lg:px-12 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-bold text-foreground mb-4"
            >
              {isRTL ? 'ميزات قوية للجميع' : 'Powerful Features for Everyone'}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground max-w-3xl mx-auto"
            >
              {isRTL
                ? 'أدوات شاملة مصممة للمديرين والمعلمين والطلاب وأولياء الأمور للتعاون الفعّال.'
                : 'Comprehensive tools designed for administrators, teachers, students, and parents to collaborate effectively.'
              }
            </motion.p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className={`bg-card rounded-2xl border-2 border-border p-6 hover:shadow-xl transition-all duration-300 ${isRTL ? 'text-right' : ''}`}
              >
                <div className={`${feature.bgColor} rounded-xl p-4 w-fit mb-5 ${isRTL ? 'mr-auto' : ''}`}>
                  <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-20 lg:py-28 px-6 lg:px-12 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className={`grid lg:grid-cols-2 gap-12 items-center`}>
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={isRTL ? 'text-right order-2' : ''}
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                {isRTL ? 'كل ما تحتاجه في مكان واحد' : 'Everything You Need in One Place'}
              </h2>
              <div className="space-y-6">
                {capabilities.map((capability, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex gap-4 ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                  >
                    <div className={`${capability.color} rounded-lg p-3 h-fit flex-shrink-0`}>
                      <capability.icon className={`h-6 w-6 ${capability.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-2">{capability.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{capability.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`relative ${isRTL ? 'order-1' : ''}`}
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHRlYWNoZXIlMjBjbGFzc3Jvb20lMjBsZWFybmluZyUyMHRvZ2V0aGVyfGVufDF8fHx8MTc3MjI5NjU0Mnww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt={isRTL ? "الطلاب يتعلمون معاً" : "Students learning together"}
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 lg:py-28 px-6 lg:px-12 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1768796370577-c6e8b708b980?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwbWVldGluZyUyMGVkdWNhdGlvbiUyMGNvbGxhYm9yYXRpb258ZW58MXx8fHwxNzcyMjk2NzI0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt={isRTL ? "تعاون الفريق" : "Team collaboration"}
                  className="w-full h-auto"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`order-1 lg:order-2 ${isRTL ? 'text-right' : ''}`}
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                {isRTL ? 'مبني للتعليم الحديث' : 'Built for Modern Education'}
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {isRTL
                  ? 'إديو سمارت هو نظام إدارة مدرسي شامل مصمم لتبسيط ��لمهام الإدارية وتحسين التواصل ورفع المخرجات التعليمية.'
                  : 'Edu Smart is a comprehensive school management system designed to streamline administrative tasks, enhance communication, and improve educational outcomes.'
                }
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border-2 border-blue-100 dark:border-blue-800">
                  <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
                  <div className="text-sm font-medium text-foreground">{isRTL ? 'دعم متاح' : 'Support Available'}</div>
                </div>
                <div className="bg-primary/5 rounded-xl p-6 border-2 border-primary/20">
                  <div className="text-4xl font-bold text-primary mb-2">100%</div>
                  <div className="text-sm font-medium text-foreground">{isRTL ? 'سحابي' : 'Cloud-Based'}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 px-6 lg:px-12 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              {isRTL ? 'هل أنت مستعد لتحويل مدرستك؟' : 'Ready to Transform Your School?'}
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              {isRTL
                ? 'انضم إلى مئات المدارس التي تستخدم إديو سمارت لتبسيط العمليات وتحسين المخرجات التعليمية.'
                : 'Join hundreds of schools already using Edu Smart to streamline operations and improve educational outcomes.'
              }
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/login')}
              className="bg-white text-blue-600 hover:bg-blue-50 h-14 px-10 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
            >
              {isRTL ? 'ابدأ اليوم' : 'Get Started Today'}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 lg:py-28 px-6 lg:px-12 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {isRTL ? 'تواصل معنا' : 'Get in Touch'}
            </h2>
            <p className="text-lg text-muted-foreground">
              {isRTL ? 'هل لديك أسئلة؟ نحن هنا لمساعدتك في البدء مع إديو سمارت.' : "Have questions? We're here to help you get started with Edu Smart."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Mail, color: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600 dark:text-blue-400', title: isRTL ? 'راسلنا' : 'Email Us', info: 'support@edusmart.com' },
              { icon: Phone, color: 'bg-primary/10', iconColor: 'text-primary', title: isRTL ? 'اتصل بنا' : 'Call Us', info: '+20 123 456 7890' },
              { icon: MapPin, color: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-600 dark:text-purple-400', title: isRTL ? 'زورنا' : 'Visit Us', info: isRTL ? '123 شارع التعليم، القاهرة' : '123 Education St, Cairo' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`${item.color} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                  <item.icon className={`h-8 w-8 ${item.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.info}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-gray-400 py-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className={`grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12 ${isRTL ? 'text-right' : ''}`}>
            <div>
              <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">Edu Smart</span>
              </div>
              <p className="text-sm leading-relaxed">
                {isRTL ? 'إدارة مدرسية حديثة بكل بساطة وكفاءة.' : 'Modern school management made simple and efficient.'}
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 text-sm">{isRTL ? 'المنتج' : 'Product'}</h4>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-white transition-colors cursor-pointer">{isRTL ? 'الميزات' : 'Features'}</li>
                <li className="hover:text-white transition-colors cursor-pointer">{isRTL ? 'الأسعار' : 'Pricing'}</li>
                <li className="hover:text-white transition-colors cursor-pointer">{isRTL ? 'الأمان' : 'Security'}</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 text-sm">{isRTL ? 'الشركة' : 'Company'}</h4>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-white transition-colors cursor-pointer">{isRTL ? 'حول' : 'About'}</li>
                <li className="hover:text-white transition-colors cursor-pointer">{isRTL ? 'المدونة' : 'Blog'}</li>
                <li className="hover:text-white transition-colors cursor-pointer">{isRTL ? 'تواصل' : 'Contact'}</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 text-sm">{isRTL ? 'قانوني' : 'Legal'}</h4>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-white transition-colors cursor-pointer">{isRTL ? 'الخصوصية' : 'Privacy'}</li>
                <li className="hover:text-white transition-colors cursor-pointer">{isRTL ? 'الشروط' : 'Terms'}</li>
                <li className="hover:text-white transition-colors cursor-pointer">{isRTL ? 'سياسة الكوكيز' : 'Cookie Policy'}</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 text-sm text-center">
            © {new Date().getFullYear()} Edu Smart. {isRTL ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </div>
        </div>
      </footer>
    </div>
  );
}