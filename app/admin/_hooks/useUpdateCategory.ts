import { useState } from 'react';
import { CategoryMutationPayload } from '@/app/_types'
import { updateAdminCategory } from "@/app/admin/_libs/admin-category-api";
import { useSupabaseSession } from '@/app/_hooks';
import { useSWRConfig } from 'swr';

export const useUpdateCategory = (id: string) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useSupabaseSession();
  const { mutate } = useSWRConfig();

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
      // 一覧のキャッシュを更新
      mutate(['admin-categories', token]); 
      // 詳細のキャッシュを更新
      mutate(['admin-category', id, token]); 
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