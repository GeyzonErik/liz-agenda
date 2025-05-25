
import { useState } from 'react';
import { ViewMode, Appointment, CalendarDay } from '@/types/appointment';
import { AppointmentCard } from './AppointmentCard';

interface CalendarViewProps {
  viewMode: ViewMode;
  currentDate: Date;
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
  onAppointmentMove?: (appointmentId: string, newDate: Date, newStartTime: string, newEndTime: string) => void;
}

export const CalendarView = ({
  viewMode,
  currentDate,
  appointments,
  onAppointmentClick,
  onAppointmentMove
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

  const checkConflict = (targetDate: Date, startTime: string, endTime: string, therapistName: string, excludeId?: string): boolean => {
    const targetDateStr = targetDate.toDateString();
    const newStart = new Date(`${targetDate.toISOString().slice(0, 10)}T${startTime}`);
    const newEnd = new Date(`${targetDate.toISOString().slice(0, 10)}T${endTime}`);

    return appointments.some(apt => {
      if (excludeId && apt.id === excludeId) return false;
      if (apt.therapist_name !== therapistName) return false;
      
      const aptDate = new Date(apt.start_time);
      if (aptDate.toDateString() !== targetDateStr) return false;
      
      const aptStart = new Date(apt.start_time);
      const aptEnd = new Date(apt.end_time);
      
      return (newStart < aptEnd && newEnd > aptStart);
    });
  };

  const handleDrop = (e: React.DragEvent, targetDate: Date, timeSlot?: string) => {
    e.preventDefault();
    const appointmentData = e.dataTransfer.getData('appointment');
    if (!appointmentData || !onAppointmentMove) return;

    const appointment: Appointment = JSON.parse(appointmentData);
    const originalStart = new Date(appointment.start_time);
    const originalEnd = new Date(appointment.end_time);
    const duration = originalEnd.getTime() - originalStart.getTime();

    let newStartTime: string;
    let newEndTime: string;

    if (timeSlot) {
      const [hours, minutes] = timeSlot.split(':').map(Number);
      const newStart = new Date(targetDate);
      newStart.setHours(hours, minutes, 0, 0);
      const newEnd = new Date(newStart.getTime() + duration);
      
      newStartTime = newStart.toTimeString().slice(0, 5);
      newEndTime = newEnd.toTimeString().slice(0, 5);
    } else {
      newStartTime = originalStart.toTimeString().slice(0, 5);
      newEndTime = originalEnd.toTimeString().slice(0, 5);
    }

    // Check for conflicts
    if (checkConflict(targetDate, newStartTime, newEndTime, appointment.therapist_name, appointment.id)) {
      alert('Conflito de horário! Já existe um agendamento para este profissional neste horário.');
      setDraggedAppointment(null);
      return;
    }

    onAppointmentMove(appointment.id, targetDate, newStartTime, newEndTime);
    setDraggedAppointment(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (appointment: Appointment) => {
    setDraggedAppointment(appointment);
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 7; hour <= 20; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const getAppointmentsByTimeSlot = (appointments: Appointment[], timeSlot: string) => {
    return appointments.filter(apt => {
      const startTime = new Date(apt.start_time);
      const slotTime = `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}`;
      return slotTime === timeSlot;
    });
  };

  const calculateCardHeight = (appointment: Appointment) => {
    const startTime = new Date(appointment.start_time);
    const endTime = new Date(appointment.end_time);
    const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    const slotsSpanned = Math.max(1, durationMinutes / 30); // Each slot is 30 minutes
    return `${slotsSpanned * 4}rem`; // 4rem per slot
  };

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const timeSlots = generateTimeSlots();

  if (viewMode === 'month') {
    const days = getDaysInMonth(currentDate);
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[calc(100vh-12rem)] flex flex-col">
        <div className="grid grid-cols-7 border-b border-gray-200 shrink-0">
          {weekDays.map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-agendei-teal bg-gray-50">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 flex-1 overflow-auto">
          {days.map((day, index) => (
            <div
              key={index}
              className={`min-h-32 p-2 border-r border-b border-gray-100 ${
                !day.isCurrentMonth ? 'bg-gray-50' : ''
              }`}
              onDrop={(e) => handleDrop(e, day.date)}
              onDragOver={handleDragOver}
            >
              <div className={`text-sm mb-2 ${
                day.isCurrentMonth ? 'text-agendei-teal' : 'text-gray-400'
              } ${
                day.date.toDateString() === new Date().toDateString() 
                  ? 'font-bold' 
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
                      appointment.status === 'pendente' ? 'bg-agendei-teal' :
                      'bg-red-400'
                    }`}
                    onClick={() => onAppointmentClick(appointment)}
                    draggable
                    onDragStart={() => handleDragStart(appointment)}
                  >
                    {appointment.client_name}
                  </div>
                ))}
                {day.appointments.length > 3 && (
                  <div className="text-xs text-agendei-teal">
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[calc(100vh-12rem)] flex flex-col">
        <div className="grid grid-cols-8 border-b border-gray-200 shrink-0">
          <div className="p-4 text-center text-sm font-medium text-agendei-teal bg-gray-50">
            Horário
          </div>
          {days.map((day, index) => (
            <div key={index} className="p-4 text-center border-r border-gray-200 last:border-r-0 bg-gray-50">
              <div className="text-sm text-agendei-teal">{weekDays[index]}</div>
              <div className={`text-lg font-semibold mt-1 ${
                day.date.toDateString() === new Date().toDateString() 
                  ? 'text-agendei-teal font-bold' 
                  : 'text-agendei-teal'
              }`}>
                {day.date.getDate()}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {timeSlots.map(timeSlot => (
            <div key={timeSlot} className="grid grid-cols-8 border-b border-gray-100 relative" style={{ minHeight: '4rem' }}>
              <div className="p-2 text-xs text-agendei-teal bg-gray-50 border-r border-gray-200 flex items-center justify-center">
                {timeSlot}
              </div>
              {days.map((day, dayIndex) => (
                <div
                  key={`${timeSlot}-${dayIndex}`}
                  className="p-1 border-r border-gray-100 last:border-r-0 relative"
                  onDrop={(e) => handleDrop(e, day.date, timeSlot)}
                  onDragOver={handleDragOver}
                >
                  {getAppointmentsByTimeSlot(day.appointments, timeSlot).map(appointment => (
                    <div
                      key={appointment.id}
                      className="absolute inset-x-1 z-10"
                      style={{ 
                        height: calculateCardHeight(appointment),
                        top: '0.25rem'
                      }}
                    >
                      <AppointmentCard
                        appointment={appointment}
                        onClick={onAppointmentClick}
                        isDragging={draggedAppointment?.id === appointment.id}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Day view
  const dayAppointments = getDayAppointments(currentDate);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[calc(100vh-12rem)] flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-gray-50 shrink-0">
        <h3 className="text-lg font-semibold text-agendei-teal">
          {currentDate.toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {timeSlots.map(timeSlot => (
          <div key={timeSlot} className="grid grid-cols-4 border-b border-gray-100 relative" style={{ minHeight: '4rem' }}>
            <div className="p-2 text-sm text-agendei-teal bg-gray-50 border-r border-gray-200 flex items-center justify-center">
              {timeSlot}
            </div>
            <div
              className="col-span-3 p-2 relative"
              onDrop={(e) => handleDrop(e, currentDate, timeSlot)}
              onDragOver={handleDragOver}
            >
              {getAppointmentsByTimeSlot(dayAppointments, timeSlot).map(appointment => (
                <div
                  key={appointment.id}
                  className="absolute inset-x-2 z-10"
                  style={{ 
                    height: calculateCardHeight(appointment),
                    top: '0.5rem'
                  }}
                >
                  <AppointmentCard
                    appointment={appointment}
                    onClick={onAppointmentClick}
                    isDragging={draggedAppointment?.id === appointment.id}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
