import { useState, useEffect } from 'react';
import { PostsIndexResponse } from '@/app/_types'
import { fetchAdminPosts } from "@/app/admin/_libs/admin-post-api";
import { useSupabaseSession } from '@/app/_hooks';

export const useGetPosts = () => {
  const [posts, setPosts] = useState<PostsIndexResponse['posts']>([]);;
  const [fetched, setFetched] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { token } = useSupabaseSession();
  
  useEffect(() => {
    if (!token) return
    setFetched(false);
    fetchAdminPosts(token)
      .then(result => setPosts(result.posts))
      .catch(err => setError(err.message))
      .finally(() => setFetched(true));
  }, [token]);
  return { posts, fetched, error }
}