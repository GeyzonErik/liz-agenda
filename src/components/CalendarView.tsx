
import { useState } from 'react';
import { ViewMode, Appointment, CalendarDay } from '@/types/appointment';
import { AppointmentCard } from './AppointmentCard';

interface CalendarViewProps {
  viewMode: ViewMode;
  currentDate: Date;
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
}

export const CalendarView = ({
  viewMode,
  currentDate,
  appointments,
  onAppointmentClick
}: CalendarViewProps) => {
  const [draggedAppointment, setDraggedAppointment] = useState<Appointment | null>(null);

  const getDaysInMonth = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: CalendarDay[] = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dayAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.start_time);
        return aptDate.toDateString() === currentDate.toDateString();
      });
      
      days.push({
        date: new Date(currentDate),
        isCurrentMonth: currentDate.getMonth() === month,
        appointments: dayAppointments
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const getWeekDays = (date: Date): CalendarDay[] => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    const days: CalendarDay[] = [];
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      
      const dayAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.start_time);
        return aptDate.toDateString() === currentDate.toDateString();
      });
      
      days.push({
        date: currentDate,
        isCurrentMonth: true,
        appointments: dayAppointments
      });
    }
    
    return days;
  };

  const getDayAppointments = (date: Date): Appointment[] => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.start_time);
      return aptDate.toDateString() === date.toDateString();
    }).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  };

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  if (viewMode === 'month') {
    const days = getDaysInMonth(currentDate);
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-7 border-b border-gray-200">
          {weekDays.map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-600 bg-gray-50">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7">
          {days.map((day, index) => (
            <div
              key={index}
              className={`min-h-32 p-2 border-r border-b border-gray-100 ${
                !day.isCurrentMonth ? 'bg-gray-50' : ''
              }`}
            >
              <div className={`text-sm mb-2 ${
                day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
              } ${
                day.date.toDateString() === new Date().toDateString() 
                  ? 'font-bold text-agendei-teal' 
                  : ''
              }`}>
                {day.date.getDate()}
              </div>
              
              <div className="space-y-1">
                {day.appointments.slice(0, 3).map(appointment => (
                  <div
                    key={appointment.id}
                    className={`text-xs p-1 rounded text-white cursor-pointer ${
                      appointment.status === 'confirmado' ? 'bg-green-500' :
                      appointment.status === 'pendente' ? 'bg-yellow-500' :
                      'bg-gray-400'
                    }`}
                    onClick={() => onAppointmentClick(appointment)}
                  >
                    {appointment.client_name}
                  </div>
                ))}
                {day.appointments.length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{day.appointments.length - 3} mais
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (viewMode === 'week') {
    const days = getWeekDays(currentDate);
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-7 border-b border-gray-200">
          {days.map((day, index) => (
            <div key={index} className="p-4 text-center border-r border-gray-200 last:border-r-0">
              <div className="text-sm text-gray-600">{weekDays[index]}</div>
              <div className={`text-lg font-semibold mt-1 ${
                day.date.toDateString() === new Date().toDateString() 
                  ? 'text-agendei-teal' 
                  : 'text-gray-900'
              }`}>
                {day.date.getDate()}
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 min-h-96">
          {days.map((day, index) => (
            <div
              key={index}
              className="p-3 border-r border-gray-100 last:border-r-0"
            >
              <div className="space-y-2">
                {day.appointments.map(appointment => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onClick={onAppointmentClick}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Day view
  const dayAppointments = getDayAppointments(currentDate);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          {currentDate.toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </h3>
      </div>
      
      <div className="p-4">
        {dayAppointments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhum agendamento para hoje
          </div>
        ) : (
          <div className="space-y-3">
            {dayAppointments.map(appointment => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onClick={onAppointmentClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
