
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Appointment } from '@/types/appointment';
import { useAuth } from './useAuth';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchAppointments = async () => {
    if (!user) {
      console.log('No user found, skipping appointments fetch');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching appointments for user:', user.id);
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          therapist:professionals!therapist_id(id, name)
        `)
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error);
        return;
      }

      console.log('Raw appointments data:', data);

      const formattedAppointments: Appointment[] = data.map(apt => ({
        id: apt.id,
        client_name: apt.client_name,
        client_phone: apt.client_phone,
        therapist_name: apt.therapist?.name || 'Profissional não encontrado',
        start_time: apt.start_time,
        end_time: apt.end_time,
        status: apt.status as 'confirmado' | 'cancelado' | 'pendente',
        created_by: apt.created_by,
        notes: apt.notes,
        procedure_id: apt.procedure_id
      }));

      console.log('Formatted appointments:', formattedAppointments);
      setAppointments(formattedAppointments);
    } catch (error) {
      console.error('Error in fetchAppointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'created_by'> & { therapist_id: string }) => {
    if (!user) {
      console.error('No user found, cannot create appointment');
      return;
    }

    try {
      console.log('Creating appointment with data:', appointmentData);
      
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          client_name: appointmentData.client_name,
          client_phone: appointmentData.client_phone,
          therapist_id: appointmentData.therapist_id,
          start_time: appointmentData.start_time,
          end_time: appointmentData.end_time,
          status: appointmentData.status,
          notes: appointmentData.notes,
          procedure_id: appointmentData.procedure_id,
          created_by: user.id
        })
        .select();

      if (error) {
        console.error('Error creating appointment:', error);
        throw error;
      }

      console.log('Appointment created successfully:', data);
      await fetchAppointments();
    } catch (error) {
      console.error('Error in createAppointment:', error);
      throw error;
    }
  };

  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    try {
      console.log('Updating appointment:', id, updates);
      
      const { error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating appointment:', error);
        throw error;
      }

      console.log('Appointment updated successfully');
      await fetchAppointments();
    } catch (error) {
      console.error('Error in updateAppointment:', error);
      throw error;
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      console.log('Deleting appointment:', id);
      
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting appointment:', error);
        throw error;
      }

      console.log('Appointment deleted successfully');
      await fetchAppointments();
    } catch (error) {
      console.error('Error in deleteAppointment:', error);
      throw error;
    }
  };

  useEffect(() => {
    console.log('useAppointments effect triggered, user:', user?.id);
    fetchAppointments();
  }, [user]);

  return {
    appointments,
    loading,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    refetch: fetchAppointments
  };
};
