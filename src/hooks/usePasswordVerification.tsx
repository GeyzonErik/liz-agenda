import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import bcrypt from 'bcryptjs';

export function usePasswordVerification() {
  const { user } = useAuth();

  const verifyPassword = async (password: string): Promise<boolean> => {
    if (!user) {
      console.error('No user found');
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('internal_passwords')
        .select('password_hash')
        .filter('profile_id', 'eq', user.id)
        .limit(1)
        .then(result => ({
          data: result.data?.[0]?.password_hash ?? null,
          error: result.error
        }));

      if (error || !data) {
        console.error('Error fetching password hash:', error);
        return false;
      }

      const isValid = await bcrypt.compare(password, data);
      return isValid;
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  };

  return { verifyPassword };
} 