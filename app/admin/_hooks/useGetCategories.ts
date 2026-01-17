import useSWR from 'swr';
import { CategoriesIndexResponse } from '@/app/_types';
import { fetchAdminCategories } from "@/app/admin/_libs/admin-category-api";
import { useSupabaseSession } from '@/app/_hooks';

export const useGetCategories = () => {
  const { token } = useSupabaseSession();

  const { data, error, isLoading } = useSWR<CategoriesIndexResponse>(
    token ? [token] : null,
    ([token]) => fetchAdminCategories(token)
  );

  return {
    categories: data?.categories ?? [],
    fetched: !isLoading,
    error: (error?.message as string) ?? '',
  };
};