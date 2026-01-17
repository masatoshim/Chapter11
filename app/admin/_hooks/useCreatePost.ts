import { useState } from 'react';
import { PostMutationPayload } from '@/app/_types'
import { createAdminPost } from '@/app/admin/_libs/admin-post-api';
import { useSupabaseSession } from '@/app/_hooks';
import { useSWRConfig } from 'swr';

export const useCreatePost = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useSupabaseSession();
  const { mutate } = useSWRConfig();

  const createPost = async (payload: PostMutationPayload) => {
    if (!token) {
      const message = 'Authentication failed.';
      setError(message);
      return { success: false, error: message }; 
    }
    setIsCreating(true);
    setError(null);
    try {
      await createAdminPost(payload, token);
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
  return { createPost, isCreating, error };
};