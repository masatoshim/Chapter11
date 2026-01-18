import useSWR from 'swr';
import { CategoriesIndexResponse } from '@/app/_types';
import { fetchAdminCategories } from "@/app/admin/_libs/admin-category-api";
import { useSupabaseSession } from '@/app/_hooks';

export const useGetCategories = () => {
  const { token } = useSupabaseSession();

  const { data, error, isLoading, mutate } = useSWR<CategoriesIndexResponse>(
    token ? ['admin-categories', token] : null, 
    ([_, token]:[string, string]) => fetchAdminCategories(token) 
  );

  return {
    categories: data?.categories ?? [],
    fetched: !isLoading,
    error: (error?.message as string) ?? '',
    mutate,
  };
};