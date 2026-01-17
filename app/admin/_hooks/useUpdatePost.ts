import { useState } from 'react';
import { PostMutationPayload } from '@/app/_types'
import { updateAdminPost } from '@/app/admin/_libs/admin-post-api';
import { useSupabaseSession } from '@/app/_hooks';

export const useUpdatePost = (id: string) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useSupabaseSession();
  
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