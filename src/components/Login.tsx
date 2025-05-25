
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Calendar } from 'lucide-react';

export const Login = () => {
  const { signInWithGoogle, loading } = useAuth();

  return (
    <div className="min-h-screen bg-agendei-lightbg flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-agendei-teal to-agendei-darkgreen rounded-lg flex items-center justify-center">
              <Calendar className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-agendei-teal to-agendei-darkgreen bg-clip-text text-transparent mb-2">
            Agendei
          </h1>
          <p className="text-gray-600">
            Sistema de agendamento para centro terapêutico
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full bg-agendei-teal hover:bg-agendei-teal/90 text-white py-3"
          >
            {loading ? 'Carregando...' : 'Entrar com Google'}
          </Button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Faça login para acessar o sistema de agendamentos</p>
        </div>
      </div>
    </div>
  );
};
