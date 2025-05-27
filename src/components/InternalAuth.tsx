import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useInternalAuth } from '@/hooks/useInternalAuth';
import { usePasswordVerification } from '@/hooks/usePasswordVerification';
import { useToast } from '@/hooks/use-toast';

export function InternalAuth() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useInternalAuth();
  const { verifyPassword } = usePasswordVerification();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isValid = await verifyPassword(password);

      if (isValid) {
        login();
        toast({
          title: "Sucesso",
          description: "Autenticação interna realizada com sucesso",
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
      console.error('Error during internal authentication:', error);
      toast({
        title: "Erro",
        description: "Erro ao verificar a senha",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-agenda-lightbg flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-agenda-primary mb-2">
            Verificação Interna
          </h1>
          <p className="text-agenda-primary/80">
            Digite a senha interna para acessar o sistema
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Digite a senha interna"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-agenda-primary"
              required
              autoFocus
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-agenda-primary hover:bg-agenda-primary/90 text-white"
          >
            {loading ? 'Verificando...' : 'Entrar'}
          </Button>
        </form>
      </div>
    </div>
  );
}
