import useSWR from 'swr';
import { PostIndexResponse } from '@/app/_types';
import { fetchAdminPost } from "@/app/admin/_libs/admin-post-api";
import { useSupabaseSession } from '@/app/_hooks';

export const useGetPost = (id: string) => {
  const { token } = useSupabaseSession();

  const { data, error, isLoading } = useSWR<PostIndexResponse>(
    token && id ? [id, token] : null,
    ([id, token]: [string, string]) => fetchAdminPost(id, token)
  );

  return {
    post: data?.post ?? null,
    fetched: !isLoading,
    error: error?.message ?? '',
  };
};