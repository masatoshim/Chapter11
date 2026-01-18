import { PostsIndexResponse, PostIndexResponse, PostMutationPayload, PostUpdateResponse, CreatePostResponse } from '@/app/_types'

// 記事リストを取得する関数（管理者用）
export const fetchAdminPosts = async (token: string): Promise<PostsIndexResponse> => {
  const res: Response = await fetch('/api/admin/posts', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  })
  if (!res.ok) throw new Error(res.statusText);
  return await res.json() as PostsIndexResponse;
};

// 記事を取得する関数（管理者用）
export const fetchAdminPost = async (id: string, token: string): Promise<PostIndexResponse> => {
  if (!id) throw new Error("Post ID is required");
  const res: Response = await fetch(`/api/admin/posts/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  })
  if (!res.ok) throw new Error(res.statusText);
  return await res.json() as PostIndexResponse;
};

// 記事を更新する関数
export const updateAdminPost = async (id: string | number, payload: PostMutationPayload, token: string): Promise<PostUpdateResponse> => {
  const res = await fetch(`/api/admin/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'NG');
  return data as PostUpdateResponse;
};

// 記事を削除する関数
export const deleteAdminPost = async (id: string | number, token: string): Promise<void> => {
  const res = await fetch(`/api/admin/posts/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'NG');
};

/** 記事を新規作成する関数 */
export const createAdminPost = async (payload: PostMutationPayload, token: string): Promise<CreatePostResponse> => {
  const res = await fetch(`/api/admin/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'NG');
  return data as CreatePostResponse;
};