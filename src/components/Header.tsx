
import { Calendar, ChevronLeft, ChevronRight, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ViewMode } from '@/types/appointment';
import { useAuth } from '@/hooks/useAuth';

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

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-agendei-teal to-agendei-darkgreen rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-agendei-teal to-agendei-darkgreen bg-clip-text text-transparent">
              Agendei
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
                <h2 className="text-lg font-semibold text-gray-900 capitalize">
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
                      ? 'bg-agendei-teal text-white hover:bg-agendei-teal/90' 
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
            <div className="flex items-center space-x-4 text-sm text-gray-600 border-l border-gray-200 pl-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{userName}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
