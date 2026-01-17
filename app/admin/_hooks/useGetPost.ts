import { useState, useEffect } from 'react';
import { PostIndexResponse } from '@/app/_types'
import { fetchAdminPost } from "@/app/admin/_libs/admin-post-api";
import { useSupabaseSession } from '@/app/_hooks';

export const useGetPost = (id: string) => {
  const [post, setPost] = useState<PostIndexResponse['post'] | null>(null);
  const [fetched, setFetched] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { token } = useSupabaseSession();
  
  useEffect(() => {
    if (!token) return
    setFetched(false);
    fetchAdminPost(id, token)
      .then(result => setPost(result.post))
      .catch(err => setError(err.message))
      .finally(() => setFetched(true));
  }, [id, token]);
  return { post, fetched, error };
}