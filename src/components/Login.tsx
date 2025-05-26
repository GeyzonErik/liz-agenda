
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Flower2 } from 'lucide-react';

export const Login = () => {
  const { signInWithGoogle, loading } = useAuth();

  return (
    <div className="min-h-screen bg-agenda-lightbg flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-agenda-primary rounded-lg flex items-center justify-center">
              <Flower2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-agenda-primary mb-2">
            Agenda-Liz
          </h1>
          <p className="text-agenda-primary/80">
            Sistema de agendamento para centro terapêutico
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full bg-agenda-primary hover:bg-agenda-primary/90 text-white py-3"
          >
            {loading ? 'Carregando...' : 'Entrar com Google'}
          </Button>
        </div>

        <div className="mt-6 text-center text-sm text-agenda-primary/70">
          <p>Faça login para acessar o sistema de agendamentos</p>
          <p className="mt-2 text-xs">🌸 Cuidando com carinho e profissionalismo</p>
        </div>
      </div>
    </div>
  );
};
