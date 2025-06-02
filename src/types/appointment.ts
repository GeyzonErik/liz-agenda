export interface Appointment {
  id: string;
  client_name: string;
  client_phone?: string;
  therapist_name: string;
  start_time: string;
  end_time: string;
  status: 'confirmado' | 'cancelado' | 'pendente';
  created_by: string;
  notes?: string;
  procedure_id?: string;
  procedure_name?: string;
}

export type ViewMode = 'day' | 'week' | 'month';

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  appointments: Appointment[];
}
