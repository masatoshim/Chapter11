import { Category } from './category';

/**
 * 記事に関連するカテゴリーの紐付け構造
 */
export interface PostCategoryRelation {
  category: Category;
}

/**
 * 記事の基本データ構造（単体・一覧共通）
 */
export interface Post {
  id: number;
  title: string;
  content: string;
  thumbnailImageKey: string;
  createdAt: Date;
  updatedAt: Date;
  postCategories: PostCategoryRelation[];
}

/**
 * APIレスポンス用
 */
// 一覧取得
export interface PostsIndexResponse {
  posts: Post[];
}

// 詳細取得
export interface PostIndexResponse {
  post: Post | null;
}

// 作成成功時
export interface CreatePostResponse {
  id: number;
}

// 更新成功時
export interface PostUpdateResponse {
  message: string;
  post: Post;
}

/**
 * APIリクエスト(Body)用
 */
// 作成・更新で共通の入力データ構造
export interface PostMutationPayload {
  title: string;
  content: string;
  thumbnailImageKey: string;
  categoryIds: number[];
}