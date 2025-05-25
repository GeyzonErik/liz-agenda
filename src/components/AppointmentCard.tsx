
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
        return 'appointment-confirmed text-agendei-teal border-l-green-500';
      case 'pendente':
        return 'appointment-pending text-agendei-teal border-l-agendei-teal';
      case 'cancelado':
        return 'appointment-cancelled text-agendei-teal border-l-red-400 bg-red-50';
      default:
        return 'appointment-pending text-agendei-teal border-l-agendei-teal';
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
            
            <p className={`text-xs text-agendei-teal mb-1 truncate ${appointment.status === 'cancelado' ? 'line-through' : ''}`}>
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
        
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          appointment.status === 'confirmado' ? 'bg-green-100 text-green-800' :
          appointment.status === 'pendente' ? 'bg-agendei-teal text-white' :
          'bg-red-100 text-red-800'
        }`}>
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </div>
      </div>
    </div>
  );
};
