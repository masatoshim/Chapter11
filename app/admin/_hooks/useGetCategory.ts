import { useState, useEffect } from 'react';
import { CategoryIndexResponse } from '@/app/_types'
import { fetchAdminCategory } from "@/app/admin/_libs/admin-category-api";
import { useSupabaseSession } from '@/app/_hooks';

export const useGetCategory = (id: string) => {
  const [category, setCategory] = useState<CategoryIndexResponse['category'] | null>(null);
  const [fetched, setFetched] = useState(false);
  const [error, setError] = useState<string>('');
  const { token } = useSupabaseSession();
  
  useEffect(() => {
    if (!token) return
    setFetched(false);
    fetchAdminCategory(id, token)
      .then(result => setCategory(result.category))
      .catch(err => setError(err.message))
      .finally(() => setFetched(true));
  }, [id, token]);
  return { category, fetched, error };
};