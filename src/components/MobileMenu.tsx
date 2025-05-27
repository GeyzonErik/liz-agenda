
import { useState } from 'react';
import { Menu, X, Calendar, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useInternalAuth } from '@/hooks/useInternalAuth';

export const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { logout } = useInternalAuth();

  const handleLogout = async () => {
    logout();
    await signOut();
    setIsOpen(false);
  };

  return (
    <>
      {/* Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="md:hidden text-agenda-primary hover:bg-agenda-accent"
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-agenda-primary">
              Agenda-Liz 🌸
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-agenda-primary hover:bg-agenda-accent"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-agenda-primary rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <p className="font-medium text-agenda-primary">
                  {user?.user_metadata?.full_name || user?.email || 'Usuário'}
                </p>
                <p className="text-sm text-agenda-primary/70">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-4">
            <nav className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-agenda-primary hover:bg-agenda-accent"
                onClick={() => setIsOpen(false)}
              >
                <Calendar className="w-5 h-5 mr-3" />
                Agenda
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start text-agenda-primary hover:bg-agenda-accent"
                onClick={() => setIsOpen(false)}
              >
                <Users className="w-5 h-5 mr-3" />
                Profissionais
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start text-agenda-primary hover:bg-agenda-accent"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="w-5 h-5 mr-3" />
                Configurações
              </Button>
            </nav>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full border-agenda-primary text-agenda-primary hover:bg-agenda-primary hover:text-white"
            >
              Sair
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
