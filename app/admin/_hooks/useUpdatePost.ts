import { useState } from 'react';
import { PostMutationPayload } from '@/app/_types'
import { updateAdminPost } from '@/app/admin/_libs/admin-post-api';
import { useSupabaseSession } from '@/app/_hooks';
import { useSWRConfig } from 'swr';

export const useUpdatePost = (id: string) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useSupabaseSession();
  const { mutate } = useSWRConfig();

  const updatePost = async (payload: PostMutationPayload) => {
    if (!token) {
      const message = 'Authentication failed.';
      setError(message);
      return { success: false, error: message }; 
    }
    setIsUpdating(true);
    setError(null);
    try {
      await updateAdminPost(id, payload, token);
      // 一覧のキャッシュを更新
      mutate([token]); 
      // 詳細のキャッシュを更新
      mutate([id, token]); 
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'NG';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsUpdating(false);
    }
  };
  return { updatePost, isUpdating, error };
};