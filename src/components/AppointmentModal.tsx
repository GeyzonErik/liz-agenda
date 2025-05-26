
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Appointment } from '@/types/appointment';
import { useProfiles } from '@/hooks/useProfiles';
import { useProcedures } from '@/hooks/useProcedures';
import { AppointmentFormStep1 } from './AppointmentFormStep1';
import { AppointmentFormStep2 } from './AppointmentFormStep2';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: any) => void;
  onDelete?: (id: string) => void;
  appointment?: Appointment | null;
}

export const AppointmentModal = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  appointment
}: AppointmentModalProps) => {
  const { profiles } = useProfiles();
  const { procedures } = useProcedures();
  const [currentStep, setCurrentStep] = useState(1);

  const [clientData, setClientData] = useState({
    client_name: '',
    client_phone: '',
    notes: ''
  });

  const [appointmentData, setAppointmentData] = useState({
    procedure_id: '',
    therapist_id: '',
    date: '',
    start_time: '',
    end_time: '',
    status: 'pendente' as 'confirmado' | 'cancelado' | 'pendente'
  });

  useEffect(() => {
    if (appointment) {
      const startDate = new Date(appointment.start_time);
      const endDate = new Date(appointment.end_time);

      // Find therapist ID from profiles
      const therapist = profiles.find(p => p.full_name === appointment.therapist_name);

      setClientData({
        client_name: appointment.client_name,
        client_phone: (appointment as any).client_phone || '',
        notes: (appointment as any).notes || ''
      });

      setAppointmentData({
        procedure_id: (appointment as any).procedure_id || '',
        therapist_id: therapist?.id || '',
        date: startDate.toISOString().slice(0, 10),
        start_time: startDate.toTimeString().slice(0, 5),
        end_time: endDate.toTimeString().slice(0, 5),
        status: appointment.status
      });
    } else {
      const now = new Date();
      setClientData({
        client_name: '',
        client_phone: '',
        notes: ''
      });
      setAppointmentData({
        procedure_id: '',
        therapist_id: '',
        date: now.toISOString().slice(0, 10),
        start_time: '09:00',
        end_time: '10:00',
        status: 'pendente'
      });
    }
    setCurrentStep(1);
  }, [appointment, isOpen, profiles]);

  const handleSave = () => {
    const startDateTime = new Date(`${appointmentData.date}T${appointmentData.start_time}`);
    const endDateTime = new Date(`${appointmentData.date}T${appointmentData.end_time}`);

    const therapist = profiles.find(p => p.id === appointmentData.therapist_id);

    onSave({
      client_name: clientData.client_name,
      client_phone: clientData.client_phone,
      notes: clientData.notes,
      therapist_id: appointmentData.therapist_id,
      procedure_id: appointmentData.procedure_id || null,
      therapist_name: therapist?.full_name || '',
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      status: appointmentData.status
    });
    onClose();
  };

  const handleDelete = () => {
    if (appointment && onDelete) {
      onDelete(appointment.id);
      onClose();
    }
  };

  const handleCancel = () => {
    setCurrentStep(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-agenda-primary">
            {appointment ? 'Editar Agendamento' : 'Novo Agendamento'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="hover:bg-gray-100 p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 sm:p-6">
          {currentStep === 1 ? (
            <AppointmentFormStep1
              formData={clientData}
              onFormDataChange={setClientData}
              onNext={() => setCurrentStep(2)}
              onCancel={handleCancel}
            />
          ) : (
            <AppointmentFormStep2
              clientData={clientData}
              appointmentData={appointmentData}
              onAppointmentDataChange={setAppointmentData}
              onBack={() => setCurrentStep(1)}
              onSave={handleSave}
              onCancel={handleCancel}
              appointment={appointment}
            />
          )}

          {appointment && onDelete && currentStep === 2 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="w-full sm:w-auto"
              >
                Excluir Agendamento
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
