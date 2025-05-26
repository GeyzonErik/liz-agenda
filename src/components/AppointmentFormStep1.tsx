
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronRight } from 'lucide-react';

interface FormData {
  client_name: string;
  client_phone: string;
  notes: string;
}

interface AppointmentFormStep1Props {
  formData: FormData;
  onFormDataChange: (data: FormData) => void;
  onNext: () => void;
  onCancel: () => void;
}

export const AppointmentFormStep1 = ({
  formData,
  onFormDataChange,
  onNext,
  onCancel
}: AppointmentFormStep1Props) => {
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.client_name.trim()) {
      newErrors.client_name = 'Nome da cliente é obrigatório';
    }
    
    if (!formData.client_phone.trim()) {
      newErrors.client_phone = 'Telefone é obrigatório';
    } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.client_phone) && !/^\d{10,11}$/.test(formData.client_phone.replace(/\D/g, ''))) {
      newErrors.client_phone = 'Telefone deve ter formato válido';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    onFormDataChange({ ...formData, client_phone: formatted });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-agenda-primary mb-2">
          Dados da Cliente
        </h3>
        <div className="flex items-center justify-center space-x-2 text-sm text-agenda-primary/70">
          <div className="w-8 h-8 bg-agenda-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
            1
          </div>
          <span>Informações da Cliente</span>
          <ChevronRight className="w-4 h-4" />
          <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-xs">
            2
          </div>
          <span className="text-gray-400">Detalhes do Atendimento</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="client_name" className="text-agenda-primary text-sm font-medium">
            Nome da Cliente *
          </Label>
          <Input
            id="client_name"
            value={formData.client_name}
            onChange={(e) => onFormDataChange({ ...formData, client_name: e.target.value })}
            placeholder="Digite o nome completo da cliente"
            className={`mt-1 text-agenda-primary ${errors.client_name ? 'border-red-500' : ''}`}
          />
          {errors.client_name && (
            <p className="text-red-500 text-xs mt-1">{errors.client_name}</p>
          )}
        </div>

        <div>
          <Label htmlFor="client_phone" className="text-agenda-primary text-sm font-medium">
            Telefone/WhatsApp *
          </Label>
          <Input
            id="client_phone"
            value={formData.client_phone}
            onChange={handlePhoneChange}
            placeholder="(11) 99999-9999"
            className={`mt-1 text-agenda-primary ${errors.client_phone ? 'border-red-500' : ''}`}
            maxLength={15}
          />
          {errors.client_phone && (
            <p className="text-red-500 text-xs mt-1">{errors.client_phone}</p>
          )}
          <p className="text-xs text-agenda-primary/60 mt-1">
            Será usado para enviar lembretes via WhatsApp
          </p>
        </div>

        <div>
          <Label htmlFor="notes" className="text-agenda-primary text-sm font-medium">
            Observações Gerais
          </Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => onFormDataChange({ ...formData, notes: e.target.value })}
            placeholder="Informações adicionais sobre a cliente ou atendimento..."
            className="mt-1 text-agenda-primary min-h-20"
            rows={3}
          />
        </div>

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 border-agenda-primary text-agenda-primary hover:bg-agenda-primary/10"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-agenda-primary hover:bg-agenda-primary/90 text-white"
          >
            Próximo
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </form>
    </div>
  );
};
