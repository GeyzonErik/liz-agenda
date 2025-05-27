
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { CalendarView } from '@/components/CalendarView';
import { AppointmentModal } from '@/components/AppointmentModal';
import { AppointmentViewModal } from '@/components/AppointmentViewModal';
import { Login } from '@/components/Login';
import { InternalAuth } from '@/components/InternalAuth';
import { ViewMode, Appointment } from '@/types/appointment';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useInternalAuth } from '@/hooks/useInternalAuth';
import { useAppointments } from '@/hooks/useAppointments';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { isInternallyAuthenticated } = useInternalAuth();
  const { appointments, loading: appointmentsLoading, createAppointment, updateAppointment, deleteAppointment } = useAppointments();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [showFab, setShowFab] = useState(true);

  // Show/hide FAB based on scroll
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowFab(currentScrollY < lastScrollY || currentScrollY < 100);
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-agenda-lightbg flex items-center justify-center">
        <div className="text-agenda-primary">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  if (!isInternallyAuthenticated) {
    return <InternalAuth />;
  }

  const handleCreateAppointment = () => {
    setSelectedAppointment(null);
    setIsModalOpen(true);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsViewModalOpen(true);
  };

  const handleEditAppointment = () => {
    setIsViewModalOpen(false);
    setIsModalOpen(true);
  };

  const handleSaveAppointment = async (appointmentData: any) => {
    if (selectedAppointment) {
      // Update existing appointment
      await updateAppointment(selectedAppointment.id, appointmentData);
    } else {
      // Create new appointment
      await createAppointment(appointmentData);
    }
  };

  const handleDeleteAppointment = async () => {
    if (selectedAppointment) {
      await deleteAppointment(selectedAppointment.id);
    }
  };

  const handleStatusChange = async (status: 'confirmado' | 'cancelado' | 'pendente') => {
    if (selectedAppointment) {
      await updateAppointment(selectedAppointment.id, { status });
      // Update local state to reflect the change immediately
      setSelectedAppointment({ ...selectedAppointment, status });
    }
  };

  const handleAppointmentMove = async (appointmentId: string, newDate: Date, newStartTime: string, newEndTime: string) => {
    const startDateTime = new Date(`${newDate.toISOString().slice(0, 10)}T${newStartTime}`);
    const endDateTime = new Date(`${newDate.toISOString().slice(0, 10)}T${newEndTime}`);
    
    await updateAppointment(appointmentId, {
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString()
    });
  };

  return (
    <div className="min-h-screen bg-agenda-lightbg">
      <Header
        currentDate={currentDate}
        viewMode={viewMode}
        onDateChange={setCurrentDate}
        onViewModeChange={setViewMode}
        onCreateAppointment={handleCreateAppointment}
        userName={user?.user_metadata?.full_name || user?.email || "Usuário"}
      />

      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-3 sm:py-6">
        {appointmentsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-agenda-primary">Carregando agendamentos...</div>
          </div>
        ) : (
          <CalendarView
            viewMode={viewMode}
            currentDate={currentDate}
            appointments={appointments}
            onAppointmentClick={handleAppointmentClick}
            onAppointmentMove={handleAppointmentMove}
          />
        )}
      </main>

      {/* Floating Action Button */}
      <div className={`fixed bottom-4 sm:bottom-6 right-4 sm:right-6 transition-all duration-300 ${
        showFab ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
      }`}>
        <Button
          onClick={handleCreateAppointment}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-agenda-primary to-agenda-secondary hover:from-agenda-primary/90 hover:to-agenda-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
      </div>

      {/* Welcome Message */}
      {appointments.length === 0 && !appointmentsLoading && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none p-4">
          <div className="text-center p-6 sm:p-8 bg-white rounded-lg shadow-lg max-w-sm sm:max-w-md pointer-events-auto animate-fade-in">
            <h2 className="text-xl sm:text-2xl font-bold text-agenda-primary mb-4">
              Bem-vinda ao Agenda-Liz! 🌸
            </h2>
            <p className="text-agenda-primary mb-6 text-sm sm:text-base">
              Comece criando seu primeiro agendamento para organizar as sessões do centro terapêutico.
            </p>
            <Button
              onClick={handleCreateAppointment}
              className="bg-agenda-primary hover:bg-agenda-primary/90 text-white text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Agendamento
            </Button>
          </div>
        </div>
      )}

      {/* View Modal */}
      {selectedAppointment && (
        <AppointmentViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          appointment={selectedAppointment}
          onEdit={handleEditAppointment}
          onDelete={handleDeleteAppointment}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Edit/Create Modal */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAppointment}
        appointment={selectedAppointment}
      />
    </div>
  );
};

export default Index;
