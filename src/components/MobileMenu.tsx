
import { useState } from 'react';
import { Menu, X, Calendar, Users, Settings, User } from 'lucide-react';
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
        className="md:hidden text-white hover:bg-white/20 rounded-xl"
      >
        <Menu className="w-6 h-6" />
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 mobile-menu-overlay z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 mobile-menu-sidebar shadow-2xl z-50 transform transition-all duration-300 ease-out md:hidden ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-agenda-primary/10 bg-gradient-to-r from-agenda-primary to-agenda-secondary">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <path
                    d="M16 4C12 4 8 8 8 12C8 16 12 20 16 20C20 20 24 16 24 12C24 8 20 4 16 4Z"
                    fill="currentColor"
                    opacity="0.8"
                  />
                  <path
                    d="M16 10C14 10 12 12 12 14C12 16 14 18 16 18C18 18 20 16 20 14C20 12 18 10 16 10Z"
                    fill="white"
                  />
                  <path
                    d="M16 18L16 28"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 24C12 24 14 22 16 22C18 22 20 24 20 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">
                Agenda-Liz
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-xl"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-agenda-primary/10">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-agenda-primary to-agenda-secondary rounded-full flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-agenda-primary text-lg">
                  {user?.user_metadata?.full_name || 'Usuário'}
                </p>
                <p className="text-sm text-agenda-primary/70">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-6">
            <nav className="space-y-3">
              <Button
                variant="ghost"
                className="w-full justify-start text-agenda-primary hover:bg-agenda-accent/50 rounded-xl h-12 text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                <Calendar className="w-5 h-5 mr-4" />
                Agenda
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start text-agenda-primary hover:bg-agenda-accent/50 rounded-xl h-12 text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                <Users className="w-5 h-5 mr-4" />
                Profissionais
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start text-agenda-primary hover:bg-agenda-accent/50 rounded-xl h-12 text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="w-5 h-5 mr-4" />
                Configurações
              </Button>
            </nav>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-agenda-primary/10 bg-gradient-to-r from-gray-50 to-agenda-accent/30">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full border-2 border-agenda-primary text-agenda-primary hover:bg-agenda-primary hover:text-white rounded-xl h-12 font-medium transition-all duration-200"
            >
              Sair
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
