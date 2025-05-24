
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Appointment } from '@/types/appointment';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Omit<Appointment, 'id' | 'created_by'>) => void;
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
  const [formData, setFormData] = useState({
    client_name: '',
    therapist_name: '',
    date: '',
    start_time: '',
    end_time: '',
    status: 'pendente' as 'confirmado' | 'cancelado' | 'pendente'
  });

  const profissionais = [
    'Dr. João Santos',
    'Dra. Ana Costa',
    'Dr. Roberto Lima',
    'Dra. Beatriz Rocha',
    'Dra. Maria Silva',
    'Dr. Carlos Oliveira'
  ];

  useEffect(() => {
    if (appointment) {
      const startDate = new Date(appointment.start_time);
      const endDate = new Date(appointment.end_time);
      
      setFormData({
        client_name: appointment.client_name,
        therapist_name: appointment.therapist_name,
        date: startDate.toISOString().slice(0, 10),
        start_time: startDate.toTimeString().slice(0, 5),
        end_time: endDate.toTimeString().slice(0, 5),
        status: appointment.status
      });
    } else {
      const now = new Date();
      setFormData({
        client_name: '',
        therapist_name: '',
        date: now.toISOString().slice(0, 10),
        start_time: '09:00',
        end_time: '10:00',
        status: 'pendente'
      });
    }
  }, [appointment, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.client_name || !formData.therapist_name || !formData.date || !formData.start_time || !formData.end_time) {
      return;
    }

    const startDateTime = new Date(`${formData.date}T${formData.start_time}`);
    const endDateTime = new Date(`${formData.date}T${formData.end_time}`);

    onSave({
      client_name: formData.client_name,
      therapist_name: formData.therapist_name,
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
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-agendei-teal">
            {appointment ? 'Editar Agendamento' : 'Novo Agendamento'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="client_name" className="text-agendei-teal">Nome do Paciente</Label>
            <Input
              id="client_name"
              value={formData.client_name}
              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
              placeholder="Digite o nome do paciente"
              className="text-agendei-teal"
              required
            />
          </div>

          <div>
            <Label htmlFor="therapist_name" className="text-agendei-teal">Profissional</Label>
            <Select value={formData.therapist_name} onValueChange={(value) => setFormData({ ...formData, therapist_name: value })}>
              <SelectTrigger className="text-agendei-teal">
                <SelectValue placeholder="Selecione o profissional" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                {profissionais.map((profissional) => (
                  <SelectItem key={profissional} value={profissional}>
                    {profissional}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="date" className="text-agendei-teal">Data</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="text-agendei-teal"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_time" className="text-agendei-teal">Hora Inicial</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="text-agendei-teal"
                required
              />
            </div>

            <div>
              <Label htmlFor="end_time" className="text-agendei-teal">Hora Final</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                className="text-agendei-teal"
                required
              />
            </div>
          </div>

          {appointment && (
            <div>
              <Label htmlFor="status" className="text-agendei-teal">Status</Label>
              <Select value={formData.status} onValueChange={(value: 'confirmado' | 'cancelado' | 'pendente') => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="text-agendei-teal">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
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
                className="px-6"
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
