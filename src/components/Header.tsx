
import { ChevronLeft, ChevronRight, Plus, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ViewMode } from '@/types/appointment';
import { addDays, addMonths, addWeeks, format, subDays, subMonths, subWeeks } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/hooks/useAuth';
import { useInternalAuth } from '@/hooks/useInternalAuth';
import { MobileMenu } from './MobileMenu';

interface HeaderProps {
  currentDate: Date;
  viewMode: ViewMode;
  onDateChange: (date: Date) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onCreateAppointment: () => void;
  userName: string;
}

// Componente de ícone de orquídea estilizado
const OrchidIcon = () => (
  <div className="orchid-logo">
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-white"
    >
      <path
        d="M16 4C12 4 8 8 8 12C8 16 12 20 16 20C20 20 24 16 24 12C24 8 20 4 16 4Z"
        fill="currentColor"
        opacity="0.8"
      />
      <path
        d="M16 10C14 10 12 12 12 14C12 16 14 18 16 18C18 18 20 16 20 14C20 12 18 10 16 10Z"
        fill="white"
      />
      <path
        d="M16 18L16 28"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 24C12 24 14 22 16 22C18 22 20 24 20 24"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

export const Header = ({
  currentDate,
  viewMode,
  onDateChange,
  onViewModeChange,
  onCreateAppointment,
  userName
}: HeaderProps) => {
  const { signOut } = useAuth();
  const { logout } = useInternalAuth();

  const handleLogout = async () => {
    logout();
    await signOut();
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    let newDate: Date;
    
    if (direction === 'prev') {
      switch (viewMode) {
        case 'day':
          newDate = subDays(currentDate, 1);
          break;
        case 'week':
          newDate = subWeeks(currentDate, 1);
          break;
        case 'month':
          newDate = subMonths(currentDate, 1);
          break;
        default:
          newDate = currentDate;
      }
    } else {
      switch (viewMode) {
        case 'day':
          newDate = addDays(currentDate, 1);
          break;
        case 'week':
          newDate = addWeeks(currentDate, 1);
          break;
        case 'month':
          newDate = addMonths(currentDate, 1);
          break;
        default:
          newDate = currentDate;
      }
    }
    
    onDateChange(newDate);
  };

  const formatDateDisplay = () => {
    switch (viewMode) {
      case 'day':
        return format(currentDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
      case 'week':
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return `${format(weekStart, 'd MMM', { locale: ptBR })} - ${format(weekEnd, 'd MMM yyyy', { locale: ptBR })}`;
      case 'month':
        return format(currentDate, "MMMM 'de' yyyy", { locale: ptBR });
      default:
        return '';
    }
  };

  return (
    <header className="bg-gradient-to-r from-agenda-primary via-agenda-secondary to-agenda-primary shadow-lg border-b border-white/20">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        {/* Desktop Header */}
        <div className="desktop-header items-center justify-between h-20 hidden md:flex">
          {/* Logo e Título */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-white/10 rounded-2xl px-4 py-2 backdrop-blur-sm">
              <OrchidIcon />
              <h1 className="text-2xl font-bold text-white">
                Agenda-Liz
              </h1>
            </div>
            
            {/* View Mode Buttons */}
            <div className="flex items-center space-x-2 bg-white/10 rounded-xl p-1 backdrop-blur-sm">
              <Button
                variant={viewMode === 'day' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('day')}
                className={viewMode === 'day' 
                  ? 'bg-white text-agenda-primary hover:bg-white/90 rounded-lg' 
                  : 'text-white hover:bg-white/20 rounded-lg'
                }
              >
                Dia
              </Button>
              <Button
                variant={viewMode === 'week' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('week')}
                className={viewMode === 'week' 
                  ? 'bg-white text-agenda-primary hover:bg-white/90 rounded-lg' 
                  : 'text-white hover:bg-white/20 rounded-lg'
                }
              >
                Semana
              </Button>
              <Button
                variant={viewMode === 'month' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('month')}
                className={viewMode === 'month' 
                  ? 'bg-white text-agenda-primary hover:bg-white/90 rounded-lg' 
                  : 'text-white hover:bg-white/20 rounded-lg'
                }
              >
                Mês
              </Button>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/10 rounded-xl p-2 backdrop-blur-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateDate('prev')}
                className="text-white hover:bg-white/20 rounded-lg"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="min-w-0 px-4">
                <h2 className="text-lg font-semibold text-white text-center whitespace-nowrap">
                  {formatDateDisplay()}
                </h2>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateDate('next')}
                className="text-white hover:bg-white/20 rounded-lg"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <Button
                onClick={onCreateAppointment}
                size="sm"
                className="bg-white text-agenda-primary hover:bg-white/90 rounded-xl px-4 py-2 font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Agendamento
              </Button>
              
              <div className="flex items-center space-x-3 bg-white/10 rounded-xl px-4 py-2 backdrop-blur-sm">
                <span className="text-sm text-white font-medium">
                  {userName}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-white hover:bg-white/20 rounded-lg"
                >
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="mobile-header md:hidden">
          <div className="flex items-center justify-between h-16">
            <MobileMenu />
            
            <div className="flex items-center space-x-3">
              <OrchidIcon />
              <h1 className="text-xl font-bold text-white">
                Agenda-Liz
              </h1>
            </div>

            <Button
              onClick={onCreateAppointment}
              size="sm"
              className="bg-white/20 text-white hover:bg-white/30 rounded-xl backdrop-blur-sm"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          {/* View Mode Buttons - Mobile */}
          <div className="flex items-center justify-center space-x-2 pb-3">
            <div className="flex items-center space-x-1 bg-white/10 rounded-xl p-1 backdrop-blur-sm">
              <Button
                variant={viewMode === 'day' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('day')}
                className={viewMode === 'day' 
                  ? 'bg-white text-agenda-primary hover:bg-white/90 rounded-lg text-xs' 
                  : 'text-white hover:bg-white/20 rounded-lg text-xs'
                }
              >
                Dia
              </Button>
              <Button
                variant={viewMode === 'week' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('week')}
                className={viewMode === 'week' 
                  ? 'bg-white text-agenda-primary hover:bg-white/90 rounded-lg text-xs' 
                  : 'text-white hover:bg-white/20 rounded-lg text-xs'
                }
              >
                Semana
              </Button>
              <Button
                variant={viewMode === 'month' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('month')}
                className={viewMode === 'month' 
                  ? 'bg-white text-agenda-primary hover:bg-white/90 rounded-lg text-xs' 
                  : 'text-white hover:bg-white/20 rounded-lg text-xs'
                }
              >
                Mês
              </Button>
            </div>
          </div>

          {/* Date Display - Mobile */}
          <div className="text-center pb-3">
            <h2 className="text-lg font-semibold text-white">
              {formatDateDisplay()}
            </h2>
          </div>

          {/* Navigation - Mobile */}
          <div className="flex items-center justify-center space-x-4 pb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateDate('prev')}
              className="text-white hover:bg-white/20 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateDate('next')}
              className="text-white hover:bg-white/20 rounded-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
