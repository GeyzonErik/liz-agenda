
import { Clock, User } from 'lucide-react';
import { Appointment } from '@/types/appointment';

interface AppointmentCardProps {
  appointment: Appointment;
  onClick: (appointment: Appointment) => void;
}

export const AppointmentCard = ({ appointment, onClick }: AppointmentCardProps) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'appointment-confirmed text-green-800';
      case 'pendente':
        return 'appointment-pending text-yellow-800';
      case 'cancelado':
        return 'appointment-cancelled text-gray-600';
      default:
        return 'appointment-pending text-yellow-800';
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
      className={`appointment-card ${getStatusStyle(appointment.status)} animate-fade-in`}
      onClick={() => onClick(appointment)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <User className="w-3 h-3 flex-shrink-0" />
            <p className="text-sm font-medium truncate">
              {appointment.client_name}
            </p>
          </div>
          
          <p className="text-xs text-gray-600 mb-1 truncate">
            Terapeuta: {appointment.therapist_name}
          </p>
          
          <div className="flex items-center space-x-1 text-xs">
            <Clock className="w-3 h-3" />
            <span>
              {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
            </span>
          </div>
        </div>
        
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          appointment.status === 'confirmado' ? 'bg-green-100 text-green-800' :
          appointment.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-600'
        }`}>
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </div>
      </div>
      
      {appointment.status === 'cancelado' && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center">
          <span className="text-gray-500 text-sm font-medium line-through">
            Cancelado
          </span>
        </div>
      )}
    </div>
  );
};
