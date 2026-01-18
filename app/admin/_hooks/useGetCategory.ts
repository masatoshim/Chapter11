import useSWR from 'swr';
import { CategoryIndexResponse } from '@/app/_types';
import { fetchAdminCategory } from "@/app/admin/_libs/admin-category-api";
import { useSupabaseSession } from '@/app/_hooks';

export const useGetCategory = (id: string) => {
  const { token } = useSupabaseSession();

  const { data, error, isLoading, mutate } = useSWR<CategoryIndexResponse>(
    token && id ? ['admin-category', id, token] : null,
    ([_, id, token]: [string, string, string]) => fetchAdminCategory(id, token)
  );

  return {
    category: data?.category ?? null,
    fetched: !isLoading,
    error: (error?.message as string) ?? '',
    mutate,
  };
};