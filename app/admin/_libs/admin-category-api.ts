import { CategoriesIndexResponse, CategoryIndexResponse, CategoryMutationPayload, CategoryUpdateResponse, CreateCategoryResponse } from '@/app/_types'


// カテゴリーリストを取得する関数
export const fetchAdminCategories = async (token: string): Promise<CategoriesIndexResponse> => {
  const res: Response = await fetch('/api/admin/categories', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  })
  if (!res.ok) throw new Error(res.statusText);
  return await res.json() as CategoriesIndexResponse;
};

// カテゴリーを取得する関数
export const fetchAdminCategory = async (id: string, token: string): Promise<CategoryIndexResponse> => {
  const res = await fetch(`/api/admin/categories/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  });
  if (!res.ok) throw new Error(res.statusText);
  return await res.json() as CategoryIndexResponse;
};

/** カテゴリー名を更新する関数 */
export const updateAdminCategory = async (id: string, payload: CategoryMutationPayload, token: string): Promise<CategoryUpdateResponse> => {
  const res = await fetch(`/api/admin/categories/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'NG');
  return data as CategoryUpdateResponse;
};

// カテゴリーを削除する関数
export const deleteAdminCategory = async (id: string | number, token: string): Promise<void> => {
  const res = await fetch(`/api/admin/categories/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'NG');
};

/** カテゴリーを新規作成する関数 */
export const createAdminCategory = async (payload: CategoryMutationPayload, token: string): Promise<CreateCategoryResponse> => {
  const res = await fetch(`/api/admin/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'NG');
  return data as CreateCategoryResponse;
};