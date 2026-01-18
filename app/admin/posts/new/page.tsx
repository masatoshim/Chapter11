"use client";

import { useState } from 'react';
import classes from '@/app/admin/_styles/AdminEdit.module.scss';
import { PostForm } from '@/app/admin/_components/PostForm';
import { useRouter } from 'next/navigation';
import { useCreatePost } from '@/app/admin/_hooks';

export default function AdminCreatePage() {
  // 画面表示用フック
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  // 記事情報操作用フック
  const { createPost, isCreating } = useCreatePost();

  // 登録処理
  const handleCreate = async (data: {
    title: string;
    content: string;
    thumbnailImageKey: string;
    categoryIds: number[];
  }) => {
    if (!window.confirm("この記事を公開してもよろしいですか？")) return;
    const result = await createPost(data);
    if (result.success) {
      setToastMessage('記事を作成しました');
      setShowToast(true);
      setTimeout(() => {
        router.push('/admin/posts');
      }, 1500);
    } else {
      alert(`作成に失敗しました: ${result.error}`);
    }
  };

  return (
    <div className={classes.adminContainer}>
      {showToast && <div className={classes.toast}>{toastMessage}</div>}
      
      <header className={classes.header}>
        <h1 className={classes.title}>記事新規作成</h1>
      </header>

      <PostForm
        mode="create"
        defaultValues={{
          title: '',
          content: '',
          thumbnailImageKey: '',
          categoryIds: []
        }}
        onSubmit={handleCreate}
        isLoading={isCreating}
      />
    </div>
  );
}