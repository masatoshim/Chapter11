import { useState } from 'react';
import { CategoryMutationPayload } from '@/app/_types'
import { createAdminCategory } from '@/app/admin/_libs/admin-category-api';
import { useSupabaseSession } from '@/app/_hooks';
import { useSWRConfig } from 'swr';

export const useCreateCategory = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useSupabaseSession();
  const { mutate } = useSWRConfig();

  const createCategory = async (payload: CategoryMutationPayload) => {
    if (!token) {
      const message = 'Authentication failed.';
      setError(message);
      return { success: false, error: message }; 
    }
    setIsCreating(true);
    setError(null);
    try {
      await createAdminCategory(payload, token);
      // キャッシュを再取得
      mutate([token]); 
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'NG';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsCreating(false);
    }
  };
  return { createCategory, isCreating, error };
};