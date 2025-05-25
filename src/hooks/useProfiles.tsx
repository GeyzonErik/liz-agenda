
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
}

export const useProfiles = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfiles = async () => {
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

      setProfiles(mappedProfiles);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return { profiles, loading, refetch: fetchProfiles };
};
