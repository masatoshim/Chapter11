"use client";

import { useState, useEffect } from 'react';
import classes from '@/app/admin/_styles/AdminEdit.module.scss';
import { CategoryForm } from '@/app/admin/_components/CategoryForm';
import { useParams, useRouter } from 'next/navigation';
import { useGetCategory, useUpdateCategory, useDeleteCategory } from '@/app/admin/_hooks';

export default function CategoryEditPage() {
  // 画面表示用フック
  const router = useRouter();
  const [name, setName] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  // カテゴリー情報操作用フック
  const { id } = useParams<{ id: string }>();
  const { category, fetched } = useGetCategory(id);
  const { updateCategory, isUpdating } = useUpdateCategory(id);
  const { deleteCategory } = useDeleteCategory(id);

  // 初期値セット
  useEffect(() => {
    if (category) setName(category.name);
  }, [category]);

  // 更新処理
  const handleUpdate = async () => {
    if (!name.trim()) return alert("カテゴリー名を入力してください");
    if (!window.confirm("このカテゴリー名を変更してもよろしいですか？")) return;
    const result = await updateCategory({ name });
    if (result.success) {
      setToastMessage('カテゴリーを更新しました');
      setShowToast(true);
      router.refresh();
      setTimeout(() => setShowToast(false), 3000);
    } else {
      alert(`エラー: ${result.error}`);
    }
  };

  // 削除処理
  const handleDelete = async () => {
    if (!window.confirm("このカテゴリーを削除してもよろしいですか？\nこの操作は取り消せません。")) {
      return;
    }
    const result = await deleteCategory();
    if (result.success) {
      setToastMessage('カテゴリーを削除しました');
      setShowToast(true);
      setTimeout(() => {
        router.push('/admin/categories');
      }, 1500);
    } else {
      alert(`削除に失敗しました: ${result.error}`);
    }
  };

  if (!fetched) return <div>読み込み中...</div>;

  return (
    <div className={classes.adminContainer}>
      {showToast && <div className={classes.toast}>
        {toastMessage}
      </div>}
      
      <header className={classes.header}>
        <h1 className={classes.title}>カテゴリー編集</h1>
      </header>

      <CategoryForm 
        mode="edit"
        defaultValues={{ name: name }}
        onSubmit={handleUpdate}
        onDelete={handleDelete}
        isLoading={isUpdating}
      />
    </div>
  );
}