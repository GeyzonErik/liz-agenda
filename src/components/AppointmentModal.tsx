<<<<<<< HEAD
=======

>>>>>>> upstream/main
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Appointment } from '@/types/appointment';
import { useProfiles } from '@/hooks/useProfiles';
<<<<<<< HEAD
=======
import { useProcedures } from '@/hooks/useProcedures';
>>>>>>> upstream/main

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
<<<<<<< HEAD
  const [formData, setFormData] = useState({
    client_name: '',
    therapist_id: '',
=======
  const { procedures } = useProcedures();
  const [formData, setFormData] = useState({
    client_name: '',
    therapist_id: '',
    procedure_id: '',
>>>>>>> upstream/main
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
      
      setFormData({
        client_name: appointment.client_name,
        therapist_id: therapist?.id || '',
<<<<<<< HEAD
=======
        procedure_id: '', // Será implementado quando tivermos o campo no appointment
>>>>>>> upstream/main
        date: startDate.toISOString().slice(0, 10),
        start_time: startDate.toTimeString().slice(0, 5),
        end_time: endDate.toTimeString().slice(0, 5),
        status: appointment.status
      });
    } else {
      const now = new Date();
      setFormData({
        client_name: '',
        therapist_id: '',
<<<<<<< HEAD
=======
        procedure_id: '',
>>>>>>> upstream/main
        date: now.toISOString().slice(0, 10),
        start_time: '09:00',
        end_time: '10:00',
        status: 'pendente'
      });
    }
  }, [appointment, isOpen, profiles]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.client_name || !formData.therapist_id || !formData.date || !formData.start_time || !formData.end_time) {
      return;
    }

    const startDateTime = new Date(`${formData.date}T${formData.start_time}`);
    const endDateTime = new Date(`${formData.date}T${formData.end_time}`);

    const therapist = profiles.find(p => p.id === formData.therapist_id);

    onSave({
      client_name: formData.client_name,
      therapist_id: formData.therapist_id,
<<<<<<< HEAD
=======
      procedure_id: formData.procedure_id || null,
>>>>>>> upstream/main
      therapist_name: therapist?.full_name || '',
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      status: formData.status
    });
    onClose();
  };

  const handleDelete = () => {
    if (appointment && onDelete) {
      onDelete(appointment.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
<<<<<<< HEAD
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-agendei-teal">
=======
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-agendei-teal">
>>>>>>> upstream/main
            {appointment ? 'Editar Agendamento' : 'Novo Agendamento'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
<<<<<<< HEAD
            className="hover:bg-gray-100"
=======
            className="hover:bg-gray-100 p-1"
>>>>>>> upstream/main
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

<<<<<<< HEAD
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="client_name" className="text-agendei-teal">Nome do Paciente</Label>
=======
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div>
            <Label htmlFor="client_name" className="text-agendei-teal text-sm font-medium">
              Nome do Paciente
            </Label>
>>>>>>> upstream/main
            <Input
              id="client_name"
              value={formData.client_name}
              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
              placeholder="Digite o nome do paciente"
<<<<<<< HEAD
              className="text-agendei-teal"
=======
              className="mt-1 text-agendei-teal"
>>>>>>> upstream/main
              required
            />
          </div>

          <div>
<<<<<<< HEAD
            <Label htmlFor="therapist_id" className="text-agendei-teal">Profissional</Label>
            <Select value={formData.therapist_id} onValueChange={(value) => setFormData({ ...formData, therapist_id: value })}>
              <SelectTrigger className="text-agendei-teal">
=======
            <Label htmlFor="therapist_id" className="text-agendei-teal text-sm font-medium">
              Profissional
            </Label>
            <Select value={formData.therapist_id} onValueChange={(value) => setFormData({ ...formData, therapist_id: value })}>
              <SelectTrigger className="mt-1 text-agendei-teal">
>>>>>>> upstream/main
                <SelectValue placeholder="Selecione o profissional" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                {profiles.map((profile) => (
<<<<<<< HEAD
                  <SelectItem key={profile.id} value={profile.id}>
=======
                  <SelectItem key={profile.id} value={profile.id} className="text-agendei-teal">
>>>>>>> upstream/main
                    {profile.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
<<<<<<< HEAD
            <Label htmlFor="date" className="text-agendei-teal">Data</Label>
=======
            <Label htmlFor="procedure_id" className="text-agendei-teal text-sm font-medium">
              Procedimento
            </Label>
            <Select value={formData.procedure_id} onValueChange={(value) => setFormData({ ...formData, procedure_id: value })}>
              <SelectTrigger className="mt-1 text-agendei-teal">
                <SelectValue placeholder="Selecione o procedimento" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                {procedures.map((procedure) => (
                  <SelectItem key={procedure.id} value={procedure.id} className="text-agendei-teal">
                    {procedure.name}
                    {procedure.duration && ` (${procedure.duration}min)`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="date" className="text-agendei-teal text-sm font-medium">
              Data
            </Label>
>>>>>>> upstream/main
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
<<<<<<< HEAD
              className="text-agendei-teal"
=======
              className="mt-1 text-agendei-teal"
>>>>>>> upstream/main
              required
            />
          </div>

<<<<<<< HEAD
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_time" className="text-agendei-teal">Hora Inicial</Label>
=======
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_time" className="text-agendei-teal text-sm font-medium">
                Hora Inicial
              </Label>
>>>>>>> upstream/main
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
<<<<<<< HEAD
                className="text-agendei-teal"
=======
                className="mt-1 text-agendei-teal"
>>>>>>> upstream/main
                required
              />
            </div>

            <div>
<<<<<<< HEAD
              <Label htmlFor="end_time" className="text-agendei-teal">Hora Final</Label>
=======
              <Label htmlFor="end_time" className="text-agendei-teal text-sm font-medium">
                Hora Final
              </Label>
>>>>>>> upstream/main
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
<<<<<<< HEAD
                className="text-agendei-teal"
=======
                className="mt-1 text-agendei-teal"
>>>>>>> upstream/main
                required
              />
            </div>
          </div>

          {appointment && (
            <div>
<<<<<<< HEAD
              <Label htmlFor="status" className="text-agendei-teal">Status</Label>
              <Select value={formData.status} onValueChange={(value: 'confirmado' | 'cancelado' | 'pendente') => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="text-agendei-teal">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
=======
              <Label htmlFor="status" className="text-agendei-teal text-sm font-medium">
                Status
              </Label>
              <Select value={formData.status} onValueChange={(value: 'confirmado' | 'cancelado' | 'pendente') => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="mt-1 text-agendei-teal">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  <SelectItem value="pendente" className="text-agendei-teal">Pendente</SelectItem>
                  <SelectItem value="confirmado" className="text-agendei-teal">Confirmado</SelectItem>
                  <SelectItem value="cancelado" className="text-agendei-teal">Cancelado</SelectItem>
>>>>>>> upstream/main
                </SelectContent>
              </Select>
            </div>
          )}

<<<<<<< HEAD
          <div className="flex space-x-3 pt-4">
=======
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
>>>>>>> upstream/main
            <Button
              type="submit"
              className="flex-1 bg-agendei-teal hover:bg-agendei-teal/90 text-white"
            >
              {appointment ? 'Atualizar' : 'Criar'} Agendamento
            </Button>
            
            {appointment && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
<<<<<<< HEAD
                className="px-6"
=======
                className="w-full sm:w-auto px-6"
>>>>>>> upstream/main
              >
                Excluir
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
