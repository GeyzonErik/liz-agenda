
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Professional {
  id: string;
  name: string;
  specialty?: string;
  email?: string;
  phone?: string;
}

export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfessionals = async () => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching professionals:', error);
        return;
      }

      setProfessionals(data || []);
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
