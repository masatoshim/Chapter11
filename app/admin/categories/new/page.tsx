"use client";

import { useState } from 'react';
import classes from '@/app/admin/_styles/AdminEdit.module.scss';
import { CategoryForm } from '@/app/admin/_components/CategoryForm';
import { useRouter } from 'next/navigation';
import { useCreateCategory } from '@/app/admin/_hooks';

export default function CategoryCreatePage() {
  // 画面表示用フック
  const router = useRouter();
  const [name, setName] = useState('');
  const [showToast, setShowToast] = useState(false);
  // カテゴリー操作用フック
  const { createCategory, isCreating } = useCreateCategory();

  // 登録処理
  const handleCreate = async () => {
    if (!name.trim()) return alert("カテゴリー名を入力してください");
    const result = await createCategory({ name });
    if (result.success) {
      setShowToast(true);
      setTimeout(() => {
        router.push('/admin/categories');
        router.refresh();
      }, 1500);
    } else {
      alert(`エラー: ${result.error}`);
    }
  };

  return (
    <div className={classes.adminContainer}>
      {showToast && <div className={classes.toast}>カテゴリーを作成しました</div>}
      
      <header className={classes.header}>
        <h1 className={classes.title}>カテゴリー新規作成</h1>
      </header>

      <CategoryForm 
        mode="create"
        defaultValues={{ name: name }}
        onSubmit={handleCreate}
        isLoading={isCreating}
      />
    </div>
  );
}