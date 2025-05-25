
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Procedure {
  id: string;
  name: string;
  description?: string;
  duration?: number;
  price?: number;
}

export const useProcedures = () => {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProcedures = async () => {
    try {
      const { data, error } = await supabase
        .from('procedures')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching procedures:', error);
        return;
      }

      setProcedures(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcedures();
  }, []);

  return { procedures, loading, refetch: fetchProcedures };
};
