import React from 'react';
import { useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import { User, Shield, GraduationCap, BookOpen, Users, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { useTranslation } from 'react-i18next';

export function SelectRole() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const roles = [
    { 
      id: 'admin', 
      label: t('adminRoleLabel'), 
      icon: Shield, 
      desc: t('adminRoleDesc'),
      color: 'bg-blue-600',
      iconBg: 'bg-blue-600',
      hoverBg: 'hover:bg-blue-50',
      borderColor: 'border-blue-200',
      link: '/admin-login',
      signupLink: '/admin-signup'
    },
    { 
      id: 'teacher', 
      label: t('teacherRoleLabel'), 
      icon: GraduationCap, 
      desc: t('teacherRoleDesc'),
      color: 'bg-blue-600',
      iconBg: 'bg-blue-600',
      hoverBg: 'hover:bg-blue-50',
      borderColor: 'border-blue-200',
      link: '/teacher-login'
    },
    { 
      id: 'student', 
      label: t('studentRoleLabel'), 
      icon: BookOpen, 
      desc: t('studentRoleDesc'),
      color: 'bg-blue-600',
      iconBg: 'bg-blue-600',
      hoverBg: 'hover:bg-blue-50',
      borderColor: 'border-blue-200',
      link: '/student-login'
    },
    { 
      id: 'parent', 
      label: t('parentRoleLabel'), 
      icon: Users, 
      desc: t('parentRoleDesc'),
      color: 'bg-blue-600',
      iconBg: 'bg-blue-600',
      hoverBg: 'hover:bg-blue-50',
      borderColor: 'border-blue-200',
      link: '/parent-login'
    },
  ];

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-5xl">
        <Link to="/" className="flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <BackIcon className="h-4 w-4" />
          <span className="text-sm font-medium">{t('backToHome')}</span>
        </Link>
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="text-center text-4xl font-bold text-foreground mb-3">
          {t('selectYourRole')}
        </h2>
        <p className="text-center text-base text-muted-foreground mb-12">
          {t('chooseRoleDesc')}
        </p>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {roles.map((role) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`bg-card rounded-2xl border-2 ${role.borderColor} p-6 shadow-sm ${role.hoverBg} transition-all hover:shadow-lg`}
            >
              <div className={`flex items-start gap-4 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`${role.iconBg} rounded-xl p-3 flex items-center justify-center flex-shrink-0 shadow-md`}>
                  <role.icon className="h-7 w-7 text-white" />
                </div>
                <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                  <h3 className="text-xl font-bold text-foreground mb-2">{role.label}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{role.desc}</p>
                </div>
              </div>
              
              <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Link to={role.link} className="flex-1">
                  <Button 
                    className={`w-full ${role.color} hover:opacity-90 text-white shadow-sm`}
                  >{t('loginBtn')}</Button>
                </Link>
                {role.signupLink && (
                  <Link to={role.signupLink} className="flex-1">
                    <Button 
                      variant="outline"
                      className="w-full"
                    >
                      {t('signUpBtn')}
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Help Center Link */}
        <div className="text-center">
          <Link 
            to="/help" 
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            {t('needHelp')}
          </Link>
        </div>
      </div>
    </div>
  );
}