import useSWR from 'swr';
import { PostsIndexResponse } from '@/app/_types';
import { fetchAdminPosts } from "@/app/admin/_libs/admin-post-api";
import { useSupabaseSession } from '@/app/_hooks';

export const useGetPosts = () => {
  const { token } = useSupabaseSession();

  const { data, error, isLoading } = useSWR<PostsIndexResponse>(
    token ? [token] : null,
    ([token]: [string]) => fetchAdminPosts(token)
  );

  return {
    posts: data?.posts ?? [],
    fetched: !isLoading,
    error: error?.message ?? '',
  };
};