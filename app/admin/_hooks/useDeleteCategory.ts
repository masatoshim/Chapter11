import { useState } from 'react';
import { deleteAdminCategory } from '@/app/admin/_libs/admin-category-api';
import { useSupabaseSession } from '@/app/_hooks';
import { useSWRConfig } from 'swr';

export const useDeleteCategory = (id: string) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useSupabaseSession();
  const { mutate } = useSWRConfig();

  const deleteCategory = async () => {
    if (!token) {
      const message = 'Authentication failed.';
      setError(message);
      return { success: false, error: message }; 
    }
    setIsDeleting(true);
    setError(null);
    try {
      await deleteAdminCategory(id, token);
      // キャッシュを再取得
      mutate([token]); 
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'NG';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsDeleting(false);
    }
  };
  return { deleteCategory, isDeleting, error };
};