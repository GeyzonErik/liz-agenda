
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
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
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Menu Mobile */}
          <div className="flex items-center space-x-4">
            <MobileMenu />
            <div className="flex items-center space-x-6">
              <h1 className="text-xl sm:text-2xl font-bold text-agenda-primary">
                Agenda-Liz 🌸
              </h1>
              
              {/* View Mode Buttons - Desktop */}
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  variant={viewMode === 'day' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onViewModeChange('day')}
                  className={viewMode === 'day' 
                    ? 'bg-agenda-primary text-white hover:bg-agenda-primary/90' 
                    : 'border-agenda-primary text-agenda-primary hover:bg-agenda-accent'
                  }
                >
                  Dia
                </Button>
                <Button
                  variant={viewMode === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onViewModeChange('week')}
                  className={viewMode === 'week' 
                    ? 'bg-agenda-primary text-white hover:bg-agenda-primary/90' 
                    : 'border-agenda-primary text-agenda-primary hover:bg-agenda-accent'
                  }
                >
                  Semana
                </Button>
                <Button
                  variant={viewMode === 'month' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onViewModeChange('month')}
                  className={viewMode === 'month' 
                    ? 'bg-agenda-primary text-white hover:bg-agenda-primary/90' 
                    : 'border-agenda-primary text-agenda-primary hover:bg-agenda-accent'
                  }
                >
                  Mês
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate('prev')}
                className="border-agenda-primary text-agenda-primary hover:bg-agenda-accent"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="hidden sm:block min-w-0">
                <h2 className="text-sm sm:text-lg font-semibold text-agenda-primary text-center whitespace-nowrap">
                  {formatDateDisplay()}
                </h2>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate('next')}
                className="border-agenda-primary text-agenda-primary hover:bg-agenda-accent"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button
                onClick={onCreateAppointment}
                size="sm"
                className="hidden sm:flex bg-agenda-primary hover:bg-agenda-primary/90 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo
              </Button>
              
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-sm text-agenda-primary">
                  {userName}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="border-agenda-primary text-agenda-primary hover:bg-agenda-accent"
                >
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* View Mode Buttons - Mobile */}
        <div className="flex md:hidden items-center justify-center space-x-2 pb-3">
          <Button
            variant={viewMode === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('day')}
            className={viewMode === 'day' 
              ? 'bg-agenda-primary text-white hover:bg-agenda-primary/90' 
              : 'border-agenda-primary text-agenda-primary hover:bg-agenda-accent'
            }
          >
            Dia
          </Button>
          <Button
            variant={viewMode === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('week')}
            className={viewMode === 'week' 
              ? 'bg-agenda-primary text-white hover:bg-agenda-primary/90' 
              : 'border-agenda-primary text-agenda-primary hover:bg-agenda-accent'
            }
          >
            Semana
          </Button>
          <Button
            variant={viewMode === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('month')}
            className={viewMode === 'month' 
              ? 'bg-agenda-primary text-white hover:bg-agenda-primary/90' 
              : 'border-agenda-primary text-agenda-primary hover:bg-agenda-accent'
            }
          >
            Mês
          </Button>
        </div>

        {/* Date Display - Mobile */}
        <div className="block sm:hidden text-center pb-3">
          <h2 className="text-lg font-semibold text-agenda-primary">
            {formatDateDisplay()}
          </h2>
        </div>
      </div>
    </header>
  );
};
