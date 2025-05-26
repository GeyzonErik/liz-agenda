
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
        return 'bg-green-500 text-white';
      case 'pendente':
        return 'bg-yellow-500 text-white';
      case 'cancelado':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div
      className={`appointment-card ${getStatusStyle(appointment.status)} ${isDragging ? 'opacity-50' : ''} animate-fade-in relative h-full`}
      onClick={() => onClick(appointment)}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('appointment', JSON.stringify(appointment));
      }}
    >
      <div className="flex items-start justify-between h-full">
        <div className="flex-1 min-w-0 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <User className="w-3 h-3 flex-shrink-0" />
              <p className={`text-sm font-medium truncate ${appointment.status === 'cancelado' ? 'line-through' : ''}`}>
                {appointment.client_name}
              </p>
            </div>
            
            <p className={`text-xs mb-1 truncate ${appointment.status === 'cancelado' ? 'line-through' : ''}`}>
              Profissional: {appointment.therapist_name}
            </p>
          </div>
          
          <div className="flex items-center space-x-1 text-xs">
            <Clock className="w-3 h-3" />
            <span className={appointment.status === 'cancelado' ? 'line-through' : ''}>
              {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
            </span>
          </div>
        </div>
        
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(appointment.status)}`}>
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </div>
      </div>
    </div>
  );
};
