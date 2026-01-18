import { useState } from 'react';
import { deleteAdminPost } from '@/app/admin/_libs/admin-post-api';
import { useSupabaseSession } from '@/app/_hooks';
import { useSWRConfig } from 'swr';

export const useDeletePost = (id: string) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useSupabaseSession();
  const { mutate } = useSWRConfig();

  const deletePost = async () => {
    if (!token) {
      const message = 'Authentication failed.';
      setError(message);
      return { success: false, error: message }; 
    }
    setIsDeleting(true);
    setError(null);
    try {
      await deleteAdminPost(id, token);
      // キャッシュを再取得
      mutate(['admin-posts', token]); 
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'NG';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsDeleting(false);
    }
  };
  return { deletePost, isDeleting, error };
};