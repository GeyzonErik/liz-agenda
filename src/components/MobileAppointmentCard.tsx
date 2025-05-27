import { Clock, User } from 'lucide-react';
import { Appointment } from '@/types/appointment';

interface MobileAppointmentCardProps {
  appointment: Appointment;
  onClick: (appointment: Appointment) => void;
  isDragging?: boolean;
}

export const MobileAppointmentCard = ({ appointment, onClick, isDragging = false }: MobileAppointmentCardProps) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-agenda-confirmed/10 border-agenda-confirmed/20';
      case 'pendente':
        return 'bg-agenda-primary/10 border-agenda-primary/20';
      case 'cancelado':
        return 'bg-agenda-cancelled/10 border-agenda-cancelled/20';
      default:
        return 'bg-agenda-primary/10 border-agenda-primary/20';
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
      case 'cancelado':
        return 'bg-agenda-cancelled text-white';
      default:
        return 'hidden';
    }
  };

  return (
    <div
      className={`mobile-appointment-card rounded-lg border p-2 ${getStatusStyle(appointment.status)} ${
        isDragging ? 'opacity-50' : ''
      } animate-fade-in h-full cursor-pointer`}
      onClick={() => onClick(appointment)}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('appointment', JSON.stringify(appointment));
      }}
    >
      <div className="flex flex-col h-full relative">
        {/* Status Badge */}
        <div className={`absolute top-1 right-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${getStatusBadgeStyle(appointment.status)}`}>
          {appointment.status.charAt(0).toUpperCase()}
        </div>

        {/* Client Name */}
        <div className="flex items-start gap-1.5 mb-1">
          <User className="w-3 h-3 flex-shrink-0 text-agenda-primary mt-0.5" />
          <p className={`font-medium text-agenda-primary text-[11px] leading-tight line-clamp-2 ${
            appointment.status === 'cancelado' ? 'line-through' : ''
          }`}>
            {appointment.client_name}
          </p>
        </div>

        {/* Therapist Name */}
        <p className={`text-[10px] text-agenda-primary/70 mb-auto ${
          appointment.status === 'cancelado' ? 'line-through' : ''
        }`}>
          {appointment.therapist_name}
        </p>

        {/* Time */}
        <div className="flex items-center gap-1 mt-1">
          <Clock className="w-3 h-3 text-agenda-primary/60" />
          <span className={`text-[10px] text-agenda-primary/60 ${
            appointment.status === 'cancelado' ? 'line-through' : ''
          }`}>
            {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
          </span>
        </div>
      </div>
    </div>
  );
}; 