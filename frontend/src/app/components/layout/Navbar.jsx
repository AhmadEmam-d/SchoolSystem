import React, { useState } from 'react';
import { Bell, Search, User, Settings, LogOut, Sun, Moon, ChevronDown, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

export function Navbar() {
  const { user, logout } = useAuth();
  const { toggleSidebar } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);
  const isRTL = i18n.language === 'ar';

  const handleProfileClick = () => {
    navigate(`/${user?.role}/profile`);
    setShowDropdown(false);
  };

  const handleSettingsClick = () => {
    navigate(`/${user?.role}/settings`);
    setShowDropdown(false);
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  const handleNotificationsClick = () => {
    navigate(`/${user?.role}/notifications`);
  };

  // Localized role label
  const getRoleLabel = () => {
    switch(user?.role) {
      case 'admin': return t('admin');
      case 'teacher': return t('teacher');
      case 'student': return t('student');
      case 'parent': return t('parent');
      default: return user?.role || '';
    }
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 transition-colors w-full">
      <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-md">
        {/* Hamburger Menu Button */}
        <button
          onClick={toggleSidebar}
          className="p-2 text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg transition-colors"
          aria-label="Toggle Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative w-full">
          {isRTL ? (
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          ) : (
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          )}
          <input
            type="text"
            placeholder={t('search')}
            className={`w-full py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-input-background text-foreground placeholder-muted-foreground transition-colors ${
              isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4'
            }`}
          />
        </div>
      </div>

      <div className={`flex items-center ${isRTL ? 'gap-1 sm:gap-4' : 'gap-2 sm:gap-4'}`}>
        <button 
          onClick={toggleTheme}
          className="p-2 text-muted-foreground hover:bg-accent hover:text-foreground rounded-full transition-colors"
          title={theme === 'light' ? t('switchToDarkMode') : t('switchToLightMode')}
          aria-label={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>
        
        <button
          onClick={handleNotificationsClick}
          className="relative p-2 text-muted-foreground hover:bg-accent hover:text-foreground rounded-full transition-colors"
          aria-label={t('notifications')}
        >
          <Bell className="h-5 w-5" />
          <span className={`absolute top-1.5 h-2 w-2 bg-destructive rounded-full border-2 border-card ${isRTL ? 'left-1.5' : 'right-1.5'}`}></span>
        </button>
        
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className={`flex items-center gap-2 sm:gap-3 hover:bg-accent rounded-lg transition-colors py-1.5 ${ 
              isRTL 
                ? 'pl-1 sm:pl-2 pr-2 sm:pr-4 flex-row-reverse border-r border-border' 
                : 'pr-1 sm:pr-2 pl-2 sm:pl-4 border-l border-border'
            }`}
          >
            <div className="hidden sm:block">
              <p className={`text-sm font-medium text-foreground ${isRTL ? 'text-right' : 'text-left'}`}>{user?.name}</p>
              <p className={`text-xs text-muted-foreground capitalize ${isRTL ? 'text-right' : 'text-left'}`}>{getRoleLabel()}</p>
            </div>
            <div className="h-9 w-9 sm:h-10 sm:w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold border-2 border-primary/20 text-sm sm:text-base">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform hidden sm:block ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <>
              <div 
                className="fixed inset-0 z-10"
                onClick={() => setShowDropdown(false)}
              />
              <div className={`absolute mt-2 w-56 bg-popover rounded-lg shadow-lg border border-border py-1 z-20 ${isRTL ? 'left-0' : 'right-0'}`}>
                <button
                  onClick={handleProfileClick}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-popover-foreground hover:bg-accent transition-colors ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                >
                  <User className="h-4 w-4 shrink-0" />
                  {t('profile')}
                </button>
                <button
                  onClick={handleSettingsClick}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-popover-foreground hover:bg-accent transition-colors ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                >
                  <Settings className="h-4 w-4 shrink-0" />
                  {t('settings')}
                </button>
                <div className="border-t border-border my-1" />
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  {t('logout')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}