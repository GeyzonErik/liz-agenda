import { useState } from 'react';
import { X, Edit, MessageCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Appointment } from '@/types/appointment';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { usePasswordVerification } from '@/hooks/usePasswordVerification';

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
  const { verifyPassword } = usePasswordVerification();

  if (!isOpen) return null;

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const weekday = date.toLocaleDateString('pt-BR', {
      weekday: 'long'
    });

    const formattedDate = date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    return `${weekday}, ${formattedDate}`;
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
        return 'text-agenda-primary';
      case 'pendente':
        return 'text-agenda-primary';
      case 'cancelado':
        return 'text-agenda-primary';
      default:
        return 'text-agenda-primary';
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

    const whatsappUrl = `https://api.whatsapp.com/send/?phone=55${phone}&text=${encodeURIComponent(message)}`;
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

    try {
      const isValid = await verifyPassword(password);

      if (isValid) {
        onDelete();
        setShowDeleteConfirm(false);
        setPassword('');
        toast({
          title: "Sucesso",
          description: "Agendamento excluído com sucesso",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Erro",
          description: "Senha incorreta",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      toast({
        title: "Erro",
        description: "Erro ao verificar a senha",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        {showDeleteConfirm ? (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-agenda-primary mb-4">
              Confirmar Exclusão
            </h2>
            <p className="text-agenda-primary mb-4">
              Digite sua senha para confirmar a exclusão do agendamento.
            </p>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-agenda-primary"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleDeleteConfirm}
                  disabled={isVerifying}
                  variant="destructive"
                  className="flex-1 bg-red-700 hover:bg-red-800 text-white"
                >
                  {isVerifying ? 'Verificando...' : 'Confirmar Exclusão'}
                </Button>
                <Button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setPassword('');
                  }}
                  variant="outline"
                  className="flex-1 bg-agenda-primary hover:bg-agenda-primary/90 text-white"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <h2 className="text-lg sm:text-xl font-semibold text-agenda-primary">
                  {appointment.client_name}
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="hover:bg-gray-100 p-1"
              >
                <X className="w-4 h-4 text-agenda-primary" />
              </Button>
            </div>

            <div className="p-4 sm:p-6">
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
                    onValueChange={onStatusChange}
                  >
                    <SelectTrigger className={`w-full ${getStatusBadgeStyle(appointment.status)}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem className="text-agenda-primary data-[highlighted]:text-agenda-primary/80 cursor-pointer data-[state=checked]:text-agenda-primary/80" value="confirmado">Confirmado</SelectItem>
                      <SelectItem className="text-agenda-primary data-[highlighted]:text-agenda-primary/80 cursor-pointer data-[state=checked]:text-agenda-primary/80" value="pendente">Pendente</SelectItem>
                      <SelectItem className="text-agenda-primary data-[highlighted]:text-agenda-primary/80 cursor-pointer data-[state=checked]:text-agenda-primary/80" value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {appointment.notes && (
                  <div className="col-span-full">
                    <label className="block text-sm font-medium text-agenda-primary mb-2">
                      Observações
                    </label>
                    <p className="text-agenda-primary whitespace-pre-wrap">
                      {appointment.notes}
                    </p>
                  </div>
                )}
              </div>

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
                  className="flex-1 bg-red-700 hover:bg-red-800 text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
