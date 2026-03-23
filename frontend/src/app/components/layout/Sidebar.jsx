import React from 'react';
import { NavLink, useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Briefcase, 
  User, 
  CreditCard, 
  Bell, 
  Bot, 
  HelpCircle,
  FileBarChart,
  Megaphone,
  Clock,
  ClipboardList,
  ChevronDown,
  UserCircle,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function Sidebar() {
  const { role, logout } = useAuth();
  const { isOpen, closeSidebar } = useSidebar();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [openMenus, setOpenMenus] = React.useState([]);
  const isRTL = i18n.language === 'ar';

  // Auto-open menus based on current path
  React.useEffect(() => {
    const allLinks = role === 'admin' ? adminLinks : role === 'teacher' ? teacherLinks : role === 'student' ? studentLinks : parentLinks;
    allLinks.forEach(link => {
      if ('subItems' in link && link.subItems) {
        const isCurrentPathInSubItems = link.subItems.some(sub => location.pathname === sub.path);
        if (isCurrentPathInSubItems && !openMenus.includes(link.id)) {
          setOpenMenus(prev => [...prev, link.id]);
        }
      }
    });
  }, [location.pathname, role]);

  const toggleMenu = (menuId) => {
    setOpenMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const adminLinks = [
    { 
      icon: LayoutDashboard, 
      label: t('dashboard'), 
      id: 'dashboard',
      subItems: [
        { label: t('overview'), path: '/admin/dashboard' },
        { label: t('recentActivity'), path: '/admin/dashboard/activity' },
        { label: t('aiUsageAnalytics'), path: '/admin/dashboard/ai-analytics' },
      ]
    },
    { 
      icon: Users, 
      label: t('students'), 
      id: 'students',
      subItems: [
        { label: t('studentList'), path: '/admin/students' },
        { label: t('addStudent'), path: '/admin/students/add' },
      ]
    },
    { 
      icon: Briefcase, 
      label: t('teachers'), 
      id: 'teachers',
      subItems: [
        { label: t('teacherList'), path: '/admin/teachers' },
        { label: t('addTeacher'), path: '/admin/teachers/add' },
      ]
    },
    { 
      icon: User, 
      label: t('parents'), 
      id: 'parents',
      subItems: [
        { label: t('parentList'), path: '/admin/parents' },
        { label: t('addParent'), path: '/admin/parents/add' },
      ]
    },
    { 
      icon: BookOpen, 
      label: t('classes'), 
      id: 'classes',
      subItems: [
        { label: t('classList'), path: '/admin/classes' },
        { label: t('addClass'), path: '/admin/classes/add' },
      ]
    },
    { 
      icon: FileText, 
      label: t('subjects'), 
      id: 'subjects',
      subItems: [
        { label: t('subjectList'), path: '/admin/subjects' },
        { label: t('addSubject'), path: '/admin/subjects/add' },
      ]
    },
    { 
      icon: Calendar, 
      label: t('timetable'), 
      id: 'timetable',
      subItems: [
        { label: t('byClass'), path: '/admin/timetable' },
        { label: t('byTeacher'), path: '/admin/timetable/by-teacher' },
      ]
    },
    { 
      icon: Clock, 
      label: t('attendance'), 
      id: 'attendance',
      subItems: [
        { label: t('todayAttendance'), path: '/admin/attendance' },
        { label: t('monthlyReport'), path: '/admin/attendance/monthly' },
      ]
    },
    { 
      icon: FileBarChart, 
      label: t('exams'), 
      id: 'exams',
      subItems: [
        { label: t('examList'), path: '/admin/exams' },
        { label: t('resultsOverview'), path: '/admin/exams/results' },
      ]
    },
    { 
      icon: Megaphone, 
      label: t('announcements'), 
      id: 'announcements',
      subItems: [
        { label: t('viewAll'), path: '/admin/announcements' },
        { label: t('createAnnouncement'), path: '/admin/announcements/add' },
      ]
    },
    { 
      icon: MessageSquare, 
      label: t('messages'), 
      id: 'messages',
      subItems: [
        { label: t('inbox'), path: '/admin/messages' },
        { label: t('sent'), path: '/admin/messages/sent' },
      ]
    },
    { 
      icon: FileBarChart, 
      label: t('reports'), 
      id: 'reports',
      subItems: [
        { label: t('attendanceReport'), path: '/admin/reports' },
        { label: t('studentsSummary'), path: '/admin/reports/students' },
        { label: t('gradesReport'), path: '/admin/reports/grades' },
      ]
    },
    { 
      icon: Bell, 
      label: t('notifications'), 
      id: 'notifications',
      subItems: [
        { label: t('allNotifications'), path: '/admin/notifications' },
      ]
    },
    { 
      icon: Settings, 
      label: t('settings'), 
      id: 'settings',
      subItems: [
        { label: t('generalSettings'), path: '/admin/settings' },
        { label: t('schoolInformation'), path: '/admin/settings/school-info' },
      ]
    },
    { icon: UserCircle, label: t('profile'), path: '/admin/profile' },
  ];

  const teacherLinks = [
    { icon: LayoutDashboard, label: t('dashboard'), path: '/teacher/dashboard' },
    { icon: BookOpen, label: t('myClasses'), path: '/teacher/classes' },
    { 
      icon: FileText, 
      label: t('lessons'), 
      id: 'lessons',
      subItems: [
        { label: t('viewAllLessons'), path: '/teacher/lessons' },
        { label: t('addNewLesson'), path: '/teacher/lessons/add' },
      ]
    },
    { icon: ClipboardList, label: t('homework'), path: '/teacher/homework' },
    { icon: FileText, label: t('exams'), path: '/teacher/exams' },
    { icon: MessageSquare, label: t('messages'), path: '/teacher/messages' },
    { icon: Bot, label: t('smartTutor'), path: '/teacher/ai' },
    { icon: HelpCircle, label: t('support'), path: '/teacher/support' },
    { icon: UserCircle, label: t('profile'), path: '/teacher/profile' },
    { icon: Settings, label: t('settings'), path: '/teacher/settings' },
  ];

  const studentLinks = [
    { icon: LayoutDashboard, label: t('dashboard'), path: '/student/dashboard' },
    { icon: Calendar, label: t('schedule'), path: '/student/schedule' },
    { icon: BookOpen, label: t('mySubjects'), path: '/student/subjects' },
    { icon: ClipboardList, label: t('homework'), path: '/student/homework' },
    { icon: GraduationCap, label: t('grades'), path: '/student/grades' },
    { icon: MessageSquare, label: t('messages'), path: '/student/messages' },
    { icon: Bot, label: t('smartTutor'), path: '/student/ai' },
    { icon: HelpCircle, label: t('support'), path: '/student/support' },
    { icon: UserCircle, label: t('profile'), path: '/student/profile' },
    { icon: Settings, label: t('settings'), path: '/student/settings' },
  ];

  const parentLinks = [
    { icon: LayoutDashboard, label: t('dashboard'), path: '/parent/dashboard' },
    { icon: Users, label: t('children'), path: '/parent/children' },
    { icon: Clock, label: t('attendance'), path: '/parent/attendance' },
    { icon: GraduationCap, label: t('grades'), path: '/parent/grades' },
    { icon: ClipboardList, label: t('homework'), path: '/parent/homework' },
    { icon: MessageSquare, label: t('messages'), path: '/parent/messages' },
    { icon: CreditCard, label: t('payments'), path: '/parent/payments' },
    { icon: Bell, label: t('notifications'), path: '/parent/notifications' },
    { icon: HelpCircle, label: t('support'), path: '/parent/support' },
    { icon: UserCircle, label: t('profile'), path: '/parent/profile' },
    { icon: Settings, label: t('settings'), path: '/parent/settings' },
  ];

  let links = [];
  if (role === 'admin') links = adminLinks;
  else if (role === 'teacher') links = teacherLinks;
  else if (role === 'student') links = studentLinks;
  else if (role === 'parent') links = parentLinks;

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          "w-64 h-screen bg-card flex flex-col fixed top-0 overflow-y-auto transition-all duration-300 z-50",
          isRTL 
            ? "border-l border-border right-0 rtl:right-0" 
            : "border-r border-border left-0",
          isOpen 
            ? (isRTL ? "translate-x-0" : "translate-x-0")
            : (isRTL ? "translate-x-full" : "-translate-x-full")
        )}
      >
        {/* Header with close button */}
        <div className="p-6 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Edu Smart</span>
          </div>
          <button
            onClick={closeSidebar}
            className="lg:hidden p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => {
            // If link has subItems, render collapsible menu
            if ('subItems' in link && link.subItems) {
              const isActive = link.subItems.some((sub) => location.pathname === sub.path);
              return (
                <div key={link.id}>
                  <button
                    className={cn(
                      "flex w-full items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                    onClick={() => toggleMenu(link.id)}
                  >
                    <div className="flex items-center gap-3">
                      <link.icon className="h-5 w-5 shrink-0" />
                      {link.label}
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 transition-transform",
                        openMenus.includes(link.id) && "rotate-180"
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {openMenus.includes(link.id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-1 space-y-1"
                      >
                        {link.subItems.map((subItem) => (
                          <NavLink
                            key={subItem.path}
                            to={subItem.path}
                            onClick={() => window.innerWidth < 1024 && closeSidebar()}
                            className={({ isActive }) =>
                              cn(
                                "flex items-center gap-3 py-2.5 rounded-lg text-sm transition-colors",
                                isRTL ? "pr-12 pl-4" : "pl-12 pr-4",
                                isActive
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
                              )
                            }
                          >
                            {subItem.label}
                          </NavLink>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }
            
            // Regular link without subItems
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => window.innerWidth < 1024 && closeSidebar()}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )
                }
              >
                <link.icon className="h-5 w-5 shrink-0" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {t('logout')}
          </button>
        </div>
      </div>
    </>
  );
}