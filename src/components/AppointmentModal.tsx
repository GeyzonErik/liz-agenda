
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
    start_time: '',
    end_time: '',
    status: 'pendente' as const
  });

  useEffect(() => {
    if (appointment) {
      const startDate = new Date(appointment.start_time);
      const endDate = new Date(appointment.end_time);
      
      setFormData({
        client_name: appointment.client_name,
        therapist_name: appointment.therapist_name,
        start_time: startDate.toISOString().slice(0, 16),
        end_time: endDate.toISOString().slice(0, 16),
        status: appointment.status
      });
    } else {
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      
      setFormData({
        client_name: '',
        therapist_name: '',
        start_time: now.toISOString().slice(0, 16),
        end_time: oneHourLater.toISOString().slice(0, 16),
        status: 'pendente'
      });
    }
  }, [appointment, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.client_name || !formData.therapist_name || !formData.start_time || !formData.end_time) {
      return;
    }

    onSave(formData);
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
          <h2 className="text-xl font-semibold text-gray-900">
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
            <Label htmlFor="client_name">Nome do Paciente</Label>
            <Input
              id="client_name"
              value={formData.client_name}
              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
              placeholder="Digite o nome do paciente"
              required
            />
          </div>

          <div>
            <Label htmlFor="therapist_name">Nome do Terapeuta</Label>
            <Input
              id="therapist_name"
              value={formData.therapist_name}
              onChange={(e) => setFormData({ ...formData, therapist_name: e.target.value })}
              placeholder="Digite o nome do terapeuta"
              required
            />
          </div>

          <div>
            <Label htmlFor="start_time">Data e Hora de Início</Label>
            <Input
              id="start_time"
              type="datetime-local"
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="end_time">Data e Hora de Término</Label>
            <Input
              id="end_time"
              type="datetime-local"
              value={formData.end_time}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
