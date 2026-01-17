import { useState, useEffect } from 'react';
import { CategoriesIndexResponse } from '@/app/_types'
import { fetchAdminCategories } from "@/app/admin/_libs/admin-category-api";
import { useSupabaseSession } from '@/app/_hooks';

export const useGetCategories = () => {
  const [categories, setCategories] = useState<CategoriesIndexResponse['categories']>([]);;
  const [fetched, setFetched] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { token } = useSupabaseSession();
  
  useEffect(() => {
    if (!token) return;

    setFetched(false);
    fetchAdminCategories(token)
      .then(result => setCategories(result.categories))
      .catch(err => setError(err.message))
      .finally(() => setFetched(true));
  }, [token]);
  return { categories, fetched, error }
}