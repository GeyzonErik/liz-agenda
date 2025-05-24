
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { CalendarView } from '@/components/CalendarView';
import { AppointmentModal } from '@/components/AppointmentModal';
import { ViewMode, Appointment } from '@/types/appointment';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock data for demonstration - in a real app this would come from Supabase
const mockAppointments: Appointment[] = [
  {
    id: '1',
    client_name: 'Maria Silva',
    therapist_name: 'Dr. João Santos',
    start_time: new Date(2024, 4, 24, 9, 0).toISOString(),
    end_time: new Date(2024, 4, 24, 10, 0).toISOString(),
    status: 'confirmado',
    created_by: 'user1'
  },
  {
    id: '2',
    client_name: 'Pedro Oliveira',
    therapist_name: 'Dra. Ana Costa',
    start_time: new Date(2024, 4, 24, 14, 30).toISOString(),
    end_time: new Date(2024, 4, 24, 15, 30).toISOString(),
    status: 'pendente',
    created_by: 'user1'
  },
  {
    id: '3',
    client_name: 'Carla Mendes',
    therapist_name: 'Dr. Roberto Lima',
    start_time: new Date(2024, 4, 25, 11, 0).toISOString(),
    end_time: new Date(2024, 4, 25, 12, 0).toISOString(),
    status: 'cancelado',
    created_by: 'user1'
  },
  {
    id: '4',
    client_name: 'Lucas Ferreira',
    therapist_name: 'Dra. Beatriz Rocha',
    start_time: new Date(2024, 4, 26, 16, 0).toISOString(),
    end_time: new Date(2024, 4, 26, 17, 0).toISOString(),
    status: 'confirmado',
    created_by: 'user1'
  }
];

const Index = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleCreateAppointment = () => {
    setSelectedAppointment(null);
    setIsModalOpen(true);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleSaveAppointment = (appointmentData: Omit<Appointment, 'id' | 'created_by'>) => {
    if (selectedAppointment) {
      // Update existing appointment
      setAppointments(prev => prev.map(apt => 
        apt.id === selectedAppointment.id 
          ? { ...apt, ...appointmentData }
          : apt
      ));
    } else {
      // Create new appointment
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        created_by: 'current-user-id',
        ...appointmentData
      };
      setAppointments(prev => [...prev, newAppointment]);
    }
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
  };

  return (
    <div className="min-h-screen bg-agendei-lightbg">
      <Header
        currentDate={currentDate}
        viewMode={viewMode}
        onDateChange={setCurrentDate}
        onViewModeChange={setViewMode}
        onCreateAppointment={handleCreateAppointment}
        userName="Usuário Logado"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <CalendarView
          viewMode={viewMode}
          currentDate={currentDate}
          appointments={appointments}
          onAppointmentClick={handleAppointmentClick}
        />
      </main>

      {/* Floating Action Button */}
      <div className={`fixed bottom-6 right-6 transition-all duration-300 ${
        showFab ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
      }`}>
        <Button
          onClick={handleCreateAppointment}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-agendei-teal to-agendei-darkgreen hover:from-agendei-teal/90 hover:to-agendei-darkgreen/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      {/* Welcome Message */}
      {appointments.length === 0 && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md pointer-events-auto animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Bem-vindo ao Agendei! 🎉
            </h2>
            <p className="text-gray-600 mb-6">
              Comece criando seu primeiro agendamento para organizar as sessões do centro terapêutico.
            </p>
            <Button
              onClick={handleCreateAppointment}
              className="bg-agendei-teal hover:bg-agendei-teal/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Agendamento
            </Button>
          </div>
        </div>
      )}

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAppointment}
        onDelete={handleDeleteAppointment}
        appointment={selectedAppointment}
      />
    </div>
  );
};

export default Index;
