"use client";

import { useState } from 'react';
import classes from '@/app/admin/_styles/AdminEdit.module.scss';
import { PostForm } from '@/app/admin/_components/PostForm';
import { useParams, useRouter } from 'next/navigation';
import { useGetPost, useUpdatePost, useDeletePost } from '@/app/admin/_hooks';
import { PostMutationPayload } from '@/app/_types';

export default function AdminEditPage() {
  // 画面表示用フック
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  // 記事情報操作用フック
  const { post, fetched: postFetched, error: postError, mutate } = useGetPost(id);
  const { updatePost, isUpdating } = useUpdatePost(id);
  const { deletePost } = useDeletePost(id);

  // 更新処理
  const handleUpdate = async (data: PostMutationPayload) => {
    if (!window.confirm("この記事を更新してもよろしいですか？")) return;
    const result = await updatePost(data);
    if (result.success) {
      setToastMessage('記事を更新しました');
      setShowToast(true);
      router.refresh();
      mutate();
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } else {
      alert(`更新に失敗しました: ${result.error}`);
    }
  };

  // 削除処理
  const handleDelete = async () => {
    if (!window.confirm("この記事を削除してもよろしいですか？\nこの操作は取り消せません。")) return;
    const result = await deletePost();
    if (result.success) {
      setToastMessage('記事を削除しました');
      setShowToast(true);
      setTimeout(() => {
        router.push('/admin/posts');
      }, 1500);
    } else {
      alert(`削除に失敗しました: ${result.error}`);
    }
  };

  if (!postFetched) return <div>読み込み中...</div>;
  if (postError) return <div>Error: {postError}</div>;
  if (!post) return <div>記事が見つかりません</div>;

  return (
    <div className={classes.adminContainer}>
      {showToast && (
        <div className={classes.toast}>
          {toastMessage}
        </div>
      )}
      <header className={classes.header}>
        <h1 className={classes.title}>記事編集</h1>
      </header>

      <PostForm
        mode="edit"
        defaultValues={{
          title: post.title,
          content: post.content,
          thumbnailImageKey: post.thumbnailImageKey,
          categoryIds: post.postCategories.map((pc) => pc.category.id),
        }}
        onSubmit={handleUpdate}
        onDelete={handleDelete}
        isLoading={isUpdating}
      />
    </div>
  );
}