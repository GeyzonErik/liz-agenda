
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInternalAuth } from '@/hooks/useInternalAuth';
import { Eye, EyeOff, Lock } from 'lucide-react';

export const InternalAuth = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { verifyInternalPassword } = useInternalAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const isValid = await verifyInternalPassword(password);
    
    if (!isValid) {
      setError('Senha incorreta. Tente novamente.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-agenda-lightbg flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-agenda-primary to-agenda-secondary rounded-lg flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-agenda-primary to-agenda-secondary bg-clip-text text-transparent mb-2">
            Agenda-Liz
          </h1>
          <p className="text-agenda-primary">
            Digite a senha de acesso ao sistema
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="password" className="text-agenda-primary text-sm font-medium">
              Senha de Acesso
            </Label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="pr-10 text-agenda-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-agenda-primary hover:text-agenda-secondary"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-agenda-primary hover:bg-agenda-primary/90 text-white py-3"
          >
            {loading ? 'Verificando...' : 'Acessar Sistema'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-agenda-primary/70">
          <p>Sistema de agendamento para centro terapêutico</p>
        </div>
      </div>
    </div>
  );
};
