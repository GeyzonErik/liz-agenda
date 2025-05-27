
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
}

export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfessionals = async () => {
    try {
      // Buscar da tabela professionals em vez de profiles
      const { data, error } = await supabase
        .from('professionals')
        .select('id, name, email')
        .order('name');

      if (error) {
        console.error('Error fetching professionals:', error);
        return;
      }

      // Mapear para o formato esperado pelos componentes existentes
      const mappedProfiles = data?.map(prof => ({
        id: prof.id,
        full_name: prof.name,
        email: prof.email || '',
        avatar_url: undefined
      })) || [];

      setProfessionals(mappedProfiles);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, []);

  return { professionals, loading, refetch: fetchProfessionals };
};
