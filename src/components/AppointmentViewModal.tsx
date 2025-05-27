
import { useState } from 'react';
import { X, Edit, MessageCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Appointment } from '@/types/appointment';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface AppointmentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: 'confirmado' | 'cancelado' | 'pendente') => void;
}

export const AppointmentViewModal = ({
  isOpen,
  onClose,
  appointment,
  onEdit,
  onDelete,
  onStatusChange
}: AppointmentViewModalProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  if (!isOpen) return null;

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-agenda-confirmed text-white';
      case 'pendente':
        return 'bg-agenda-primary text-white';
      case 'cancelado':
        return 'bg-agenda-cancelled text-white';
      default:
        return 'bg-agenda-primary text-white';
    }
  };

  const handleWhatsApp = () => {
    const phone = appointment.client_phone?.replace(/\D/g, '');
    if (!phone) {
      toast({
        title: "Erro",
        description: "Número de telefone não encontrado",
        variant: "destructive"
      });
      return;
    }

    const message = `Olá ${appointment.client_name}! Lembrete do seu agendamento:
📅 Data: ${formatDateTime(appointment.start_time)}
👨‍⚕️ Profissional: ${appointment.therapist_name}
⏰ Horário: ${formatTime(appointment.start_time)} - ${formatTime(appointment.end_time)}

Aguardamos você!`;

    const whatsappUrl = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleDeleteConfirm = async () => {
    if (!password) {
      toast({
        title: "Erro",
        description: "Digite a senha para confirmar a exclusão",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    
    // Verificar senha usando bcrypt via Supabase
    try {
      const response = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        onDelete();
        setShowDeleteConfirm(false);
        setPassword('');
        toast({
          title: "Sucesso",
          description: "Agendamento excluído com sucesso"
        });
      } else {
        toast({
          title: "Erro",
          description: "Senha incorreta",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao verificar senha",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  if (showDeleteConfirm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-agenda-primary mb-4">
              Confirmar Exclusão
            </h3>
            <p className="text-agenda-primary mb-4">
              Digite a senha para confirmar a exclusão do agendamento:
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-agenda-primary"
              placeholder="Digite a senha"
            />
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setPassword('');
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={isVerifying}
                className="flex-1"
              >
                {isVerifying ? 'Verificando...' : 'Excluir'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-agenda-primary">
            Detalhes do Agendamento
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-gray-100 p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-agenda-primary">
              {appointment.client_name}
            </h3>
            <Badge className={getStatusBadgeStyle(appointment.status)}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-agenda-primary mb-2">
                Profissional
              </label>
              <p className="text-agenda-primary text-lg">
                {appointment.therapist_name}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-agenda-primary mb-2">
                Data e Hora
              </label>
              <p className="text-agenda-primary">
                {formatDateTime(appointment.start_time)}
              </p>
              <p className="text-agenda-primary/70 text-sm">
                {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
              </p>
            </div>

            {appointment.client_phone && (
              <div>
                <label className="block text-sm font-medium text-agenda-primary mb-2">
                  Telefone
                </label>
                <p className="text-agenda-primary">
                  {appointment.client_phone}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-agenda-primary mb-2">
                Status
              </label>
              <Select
                value={appointment.status}
                onValueChange={(value: 'confirmado' | 'cancelado' | 'pendente') => 
                  onStatusChange(value)
                }
              >
                <SelectTrigger className="w-full border-agenda-primary/20 focus:border-agenda-primary focus:ring-agenda-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-agenda-primary/20">
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {appointment.notes && (
            <div>
              <label className="block text-sm font-medium text-agenda-primary mb-2">
                Observações
              </label>
              <p className="text-agenda-primary bg-agenda-accent p-3 rounded-md">
                {appointment.notes}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <Button
              onClick={onEdit}
              className="flex-1 bg-agenda-primary hover:bg-agenda-primary/90 text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            
            <Button
              onClick={handleWhatsApp}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Lembrete WhatsApp
            </Button>
            
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              variant="destructive"
              className="flex-1"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
