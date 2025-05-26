
import { Calendar, ChevronLeft, ChevronRight, User, LogOut, Menu, X, Flower2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ViewMode } from '@/types/appointment';
import { useAuth } from '@/hooks/useAuth';
import { useInternalAuth } from '@/hooks/useInternalAuth';
import { useState } from 'react';

interface HeaderProps {
  currentDate: Date;
  viewMode: ViewMode;
  onDateChange: (date: Date) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onCreateAppointment: () => void;
  userName?: string;
}

export const Header = ({
  currentDate,
  viewMode,
  onDateChange,
  onViewModeChange,
  userName = "Usuário"
}: HeaderProps) => {
  const { signOut } = useAuth();
  const { logout } = useInternalAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      ...(viewMode === 'day' && { day: 'numeric' })
    };
    return currentDate.toLocaleDateString('pt-BR', options);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    switch (viewMode) {
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    onDateChange(newDate);
  };

  const handleLogout = () => {
    logout();
    signOut();
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="desktop-header bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-agenda-primary to-agenda-secondary rounded-lg flex items-center justify-center">
                <Flower2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-agenda-primary to-agenda-secondary bg-clip-text text-transparent">
                Agenda-Liz
              </h1>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate('prev')}
                  className="hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="min-w-48 text-center">
                  <h2 className="text-lg font-semibold text-agenda-primary capitalize">
                    {formatDate()}
                  </h2>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate('next')}
                  className="hover:bg-gray-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* View Mode Buttons */}
              <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                {(['day', 'week', 'month'] as const).map((mode) => (
                  <Button
                    key={mode}
                    variant={viewMode === mode ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onViewModeChange(mode)}
                    className={`rounded-none border-0 px-4 ${
                      viewMode === mode 
                        ? 'bg-agenda-primary text-white hover:bg-agenda-primary/90' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {mode === 'day' && 'Dia'}
                    {mode === 'week' && 'Semana'}
                    {mode === 'month' && 'Mês'}
                  </Button>
                ))}
              </div>

              {/* User Info */}
              <div className="flex items-center space-x-4 text-sm text-agenda-primary border-l border-gray-200 pl-4">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{userName}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-agenda-primary hover:text-agenda-secondary"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="mobile-header bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            {/* Logo Mobile */}
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-gradient-to-br from-agenda-primary to-agenda-secondary rounded-lg flex items-center justify-center">
                <Flower2 className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-agenda-primary to-agenda-secondary bg-clip-text text-transparent">
                Agenda-Liz
              </h1>
            </div>

            {/* Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-agenda-primary"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Date Navigation Mobile */}
          <div className="flex items-center justify-center space-x-2 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate('prev')}
              className="p-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex-1 text-center">
              <h2 className="text-base font-semibold text-agenda-primary capitalize">
                {formatDate()}
              </h2>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate('next')}
              className="p-2"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="border-t border-gray-200 pt-3 space-y-3">
              {/* View Mode Buttons Mobile */}
              <div className="mobile-nav">
                {(['day', 'week', 'month'] as const).map((mode) => (
                  <Button
                    key={mode}
                    variant={viewMode === mode ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      onViewModeChange(mode);
                      setMobileMenuOpen(false);
                    }}
                    className={`mobile-nav-button ${
                      viewMode === mode 
                        ? 'bg-agenda-primary text-white' 
                        : 'text-agenda-primary'
                    }`}
                  >
                    {mode === 'day' && 'Dia'}
                    {mode === 'week' && 'Semana'}
                    {mode === 'month' && 'Mês'}
                  </Button>
                ))}
              </div>

              {/* User Info Mobile */}
              <div className="flex items-center justify-between text-sm text-agenda-primary border-t border-gray-200 pt-3">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{userName}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-agenda-primary hover:text-agenda-secondary"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};
