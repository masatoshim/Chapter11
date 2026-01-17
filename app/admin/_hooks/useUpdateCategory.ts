import { useState } from 'react';
import { CategoryMutationPayload } from '@/app/_types'
import { updateAdminCategory } from "@/app/admin/_libs/admin-category-api";
import { useSupabaseSession } from '@/app/_hooks';

export const useUpdateCategory = (id: string) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useSupabaseSession();
  
  const updateCategory = async (payload: CategoryMutationPayload) => {
    if (!token) {
      const message = 'Authentication failed.';
      setError(message);
      return { success: false, error: message }; 
    }
    setIsUpdating(true);
    setError(null);
    try {
      await updateAdminCategory(id, payload, token);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'NG';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsUpdating(false);
    }
  };
  return { updateCategory, isUpdating, error };
};