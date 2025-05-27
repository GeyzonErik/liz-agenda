
import { Clock, User } from 'lucide-react';
import { Appointment } from '@/types/appointment';

interface AppointmentCardProps {
  appointment: Appointment;
  onClick: (appointment: Appointment) => void;
  isDragging?: boolean;
}

export const AppointmentCard = ({ appointment, onClick, isDragging = false }: AppointmentCardProps) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'appointment-confirmed';
      case 'pendente':
        return 'appointment-pending';
      case 'cancelado':
        return 'appointment-cancelled';
      default:
        return 'appointment-pending';
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-agenda-confirmed text-white';
      case 'pendente':
        return 'bg-agenda-primary text-white';
      case 'cancelado':
        return 'bg-agenda-cancelled text-white';
      default:
        return 'bg-agenda-primary text-white';
    }
  };

  return (
    <div
      className={`appointment-card ${getStatusStyle(appointment.status)} ${isDragging ? 'opacity-50' : ''} animate-fade-in h-full cursor-pointer overflow-hidden`}
      onClick={() => onClick(appointment)}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('appointment', JSON.stringify(appointment));
      }}
    >
      <div className="flex flex-col h-full relative">
        {/* Header com nome do cliente - sem padding right excessivo */}
        <div className="flex items-start space-x-2 mb-2">
          <User className="w-3 h-3 flex-shrink-0 text-agenda-primary mt-0.5" />
          <p className={`client-name text-sm font-medium text-agenda-primary flex-1 ${appointment.status === 'cancelado' ? 'line-through' : ''}`}>
            {appointment.client_name}
          </p>
        </div>
        
        {/* Profissional */}
        <p className={`therapist-name text-xs mb-2 text-agenda-primary/80 ${appointment.status === 'cancelado' ? 'line-through' : ''}`}>
          {appointment.therapist_name}
        </p>
        
        {/* Horário */}
        <div className="flex items-center space-x-1 text-xs text-agenda-primary/70 mt-auto mb-8 sm:mb-2">
          <Clock className="w-3 h-3 text-agenda-primary" />
          <span className={`time-display ${appointment.status === 'cancelado' ? 'line-through' : ''}`}>
            {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
          </span>
        </div>
        
        {/* Badge de status posicionado no bottom direito */}
        <div className={`status-badge absolute bottom-2 right-2 sm:top-2 sm:bottom-auto px-2 py-1 rounded-full text-xs font-medium z-10 ${getStatusBadgeStyle(appointment.status)}`}>
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </div>
      </div>
    </div>
  );
};
