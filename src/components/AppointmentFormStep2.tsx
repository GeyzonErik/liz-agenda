import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, MessageCircle, Calendar as CalendarIcon } from 'lucide-react';
import { useProfessionals } from '@/hooks/useProfiles';
import { useProcedures } from '@/hooks/useProcedures';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface FormData {
  client_name: string;
  client_phone: string;
  notes: string;
}

interface AppointmentData {
  procedure_id: string;
  therapist_id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: 'confirmado' | 'cancelado' | 'pendente';
}

interface AppointmentFormStep2Props {
  clientData: FormData;
  appointmentData: AppointmentData;
  onAppointmentDataChange: (data: AppointmentData) => void;
  onBack: () => void;
  onSave: () => void;
  onCancel: () => void;
  appointment?: any;
}

export const AppointmentFormStep2 = ({
  clientData,
  appointmentData,
  onAppointmentDataChange,
  onBack,
  onSave,
  onCancel,
  appointment
}: AppointmentFormStep2Props) => {
  const { professionals: profiles } = useProfessionals();
  const { procedures } = useProcedures();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    if (!appointmentData.procedure_id) {
      newErrors.procedure_id = 'Selecione um procedimento';
    }

    if (!appointmentData.therapist_id) {
      newErrors.therapist_id = 'Selecione um profissional';
    }

    if (!appointmentData.date) {
      newErrors.date = 'Data é obrigatória';
    }

    if (!appointmentData.start_time) {
      newErrors.start_time = 'Hora de início é obrigatória';
    }

    if (!appointmentData.end_time) {
      newErrors.end_time = 'Hora de fim é obrigatória';
    }

    if (appointmentData.start_time && appointmentData.end_time && appointmentData.start_time >= appointmentData.end_time) {
      newErrors.end_time = 'Hora de fim deve ser posterior ao início';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-agenda-primary mb-2">
          Detalhes do Atendimento
        </h3>
        <div className="flex items-center justify-center space-x-2 text-sm text-agenda-primary/70">
          <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
            ✓
          </div>
          <span className="text-green-600">Informações da Cliente</span>
          <ChevronRight className="w-4 h-4" />
          <div className="w-8 h-8 bg-agenda-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
            2
          </div>
          <span>Detalhes do Atendimento</span>
        </div>
      </div>

      {/* Resumo da Cliente */}
      <div className="bg-agenda-lightbg p-4 rounded-lg border">
        <h4 className="font-medium text-agenda-primary mb-2">Resumo da Cliente:</h4>
        <p className="text-sm text-agenda-primary"><strong>Nome:</strong> {clientData.client_name}</p>
        <p className="text-sm text-agenda-primary"><strong>Telefone:</strong> {clientData.client_phone}</p>
        {clientData.notes && (
          <p className="text-sm text-agenda-primary"><strong>Observações:</strong> {clientData.notes}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="procedure_id" className="text-agenda-primary text-sm font-medium">
            Procedimento *
          </Label>
          <Select
            value={appointmentData.procedure_id}
            onValueChange={(value) => onAppointmentDataChange({ ...appointmentData, procedure_id: value })}
          >
            <SelectTrigger className={`mt-1 text-agenda-primary ${errors.procedure_id ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Selecione o procedimento" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50 text-agenda-primary">
              {procedures.map((procedure) => (
                <SelectItem key={procedure.id} value={procedure.id} className="cursor-pointer data-[highlighted]:text-agenda-primary/80  text-agenda-primary">
                  {procedure.name}
                  {procedure.duration && ` (${procedure.duration}min)`}
                  {procedure.price && ` - R$ ${procedure.price.toFixed(2)}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.procedure_id && (
            <p className="text-red-500 text-xs mt-1">{errors.procedure_id}</p>
          )}
        </div>

        <div>
          <Label htmlFor="therapist_id" className="text-agenda-primary text-sm font-medium">
            Profissional *
          </Label>
          <Select
            value={appointmentData.therapist_id}
            onValueChange={(value) => onAppointmentDataChange({ ...appointmentData, therapist_id: value })}
          >
            <SelectTrigger className={`mt-1 text-agenda-primary ${errors.therapist_id ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Selecione o profissional" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50 text-agenda-primary">
              {profiles.map((profile) => (
                <SelectItem key={profile.id} value={profile.id} className="cursor-pointer data-[highlighted]:text-agenda-primary/80 text-agenda-primary">
                  {profile.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.therapist_id && (
            <p className="text-red-500 text-xs mt-1">{errors.therapist_id}</p>
          )}
        </div>

        <div>
          <Label htmlFor="date" className="text-agenda-primary text-sm font-medium">
            Data *
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full mt-1 justify-start text-left font-normal',
                  !appointmentData.date && 'text-muted-foreground',
                  errors.date && 'border-red-500'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {appointmentData.date ? (
                  format(new Date(appointmentData.date), 'PPP', { locale: ptBR })
                ) : (
                  <span>Selecione uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={appointmentData.date ? new Date(appointmentData.date + 'T00:00:00') : undefined}
                onSelect={(date) => onAppointmentDataChange({
                  ...appointmentData,
                  date: date ? date.toISOString().split('T')[0] : ''
                })}
                initialFocus
                locale={ptBR}
                className="text-agenda-primary"
              />
            </PopoverContent>
          </Popover>
          {errors.date && (
            <p className="text-red-500 text-xs mt-1">{errors.date}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start_time" className="text-agenda-primary text-sm font-medium">
              Hora Inicial *
            </Label>
            <Input
              id="start_time"
              type="time"
              value={appointmentData.start_time}
              onChange={(e) => onAppointmentDataChange({ ...appointmentData, start_time: e.target.value })}
              className={`mt-1 text-agenda-primary ${errors.start_time ? 'border-red-500' : ''}`}
            />
            {errors.start_time && (
              <p className="text-red-500 text-xs mt-1">{errors.start_time}</p>
            )}
          </div>

          <div>
            <Label htmlFor="end_time" className="text-agenda-primary text-sm font-medium">
              Hora Final *
            </Label>
            <Input
              id="end_time"
              type="time"
              value={appointmentData.end_time}
              onChange={(e) => onAppointmentDataChange({ ...appointmentData, end_time: e.target.value })}
              className={`mt-1 text-agenda-primary ${errors.end_time ? 'border-red-500' : ''}`}
            />
            {errors.end_time && (
              <p className="text-red-500 text-xs mt-1">{errors.end_time}</p>
            )}
          </div>
        </div>

        {appointment && (
          <div>
            <Label htmlFor="status" className="text-agenda-primary text-sm font-medium">
              Status
            </Label>
            <Select
              value={appointmentData.status}
              onValueChange={(value: 'confirmado' | 'cancelado' | 'pendente') =>
                onAppointmentDataChange({ ...appointmentData, status: value })
              }
            >
              <SelectTrigger className="mt-1 text-agenda-primary">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                <SelectItem value="pendente" className="text-agenda-primary">Pendente</SelectItem>
                <SelectItem value="confirmado" className="text-agenda-primary">Confirmado</SelectItem>
                <SelectItem value="cancelado" className="text-agenda-primary">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1 border-agenda-primary text-agenda-primary hover:bg-agenda-primary/10"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="sm:w-auto px-6 border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-agenda-primary hover:bg-agenda-primary/90 text-white"
          >
            {appointment ? 'Atualizar' : 'Criar'} Agendamento
          </Button>
        </div>
      </form>
    </div>
  );
};
