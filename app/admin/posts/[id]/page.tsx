"use client";

import { useState, useEffect } from 'react';
import classes from '@/app/admin/_styles/AdminEdit.module.scss';
import { PostForm } from '@/app/admin/_components/PostForm';
import { useParams, useRouter } from 'next/navigation';
import { useGetPost, useUpdatePost, useDeletePost } from '@/app/admin/_hooks';

export default function AdminEditPage() {
  // 画面表示用フック
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  // 入力値管理用フック
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailImageKey, setThumbnailImageKey] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  // 記事情報操作用フック
  const { post, fetched: postFetched, error: postError } = useGetPost(id);
  const { updatePost, isUpdating } = useUpdatePost(id);
  const { deletePost } = useDeletePost(id);

  // 初期値セット
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setThumbnailImageKey(post.thumbnailImageKey);
      setSelectedCategoryIds(post.postCategories.map((pc) => pc.category.id));
    }
  }, [post]);

  // カテゴリーのトグル処理
  const toggleCategory = (categoryId: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // 更新処理
  const handleUpdate = async () => {
    if (!title.trim()) return alert("タイトルを入力してください");
    if (!window.confirm("この記事を更新してもよろしいですか？")) {
      return;
    }
    const result = await updatePost({
      title,
      content,
      thumbnailImageKey,
      categoryIds: selectedCategoryIds,
    });
    if (result.success) {
      setToastMessage('記事を更新しました');
      setShowToast(true);
      router.refresh(); 
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } else {
      alert(`更新に失敗しました: ${result.error}`);
    }
  };

  // 削除処理
  const handleDelete = async () => {
    if (!window.confirm("この記事を削除してもよろしいですか？\nこの操作は取り消せません。")) {
      return;
    }
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
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        thumbnailImageKey={thumbnailImageKey}
        setThumbnailImageKey={setThumbnailImageKey}
        selectedCategoryIds={selectedCategoryIds}
        toggleCategory={toggleCategory}
        onSubmit={handleUpdate}
        onDelete={handleDelete}
        isLoading={isUpdating}
      />
    </div>
  );
}