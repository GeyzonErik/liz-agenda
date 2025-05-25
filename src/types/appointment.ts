
export interface Appointment {
  id: string;
  client_name: string;
  therapist_name: string;
  start_time: string;
  end_time: string;
  status: 'confirmado' | 'cancelado' | 'pendente';
  created_by: string;
}

export type ViewMode = 'day' | 'week' | 'month';

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  appointments: Appointment[];
}
