"use client";

import classes from '@/app/admin/_styles/AdminList.module.scss'
import Link from "next/link";
import { useGetCategories } from '@/app/admin/_hooks';

export default function CategoryListPage() {
  // カテゴリー情報操作用フック
  const { categories, fetched, error } = useGetCategories();

  if (!fetched) return <div>読み込み中...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <header className={classes.header}>
        <h1  className={classes.title}>
          カテゴリー一覧
        </h1>
        <Link href="/admin/categories/new" className={classes.createBtn}>
          新規作成
        </Link>
      </header>

      {categories.length === 0 ? (
        <div>カテゴリーが見つかりません</div>
      ) : (
        <div>
          <ul className={classes.contentList}>
            {categories.map((category) => (
              <li key={category.id}>
                <Link href={`/admin/categories/${category.id}`} className={classes.link}>
                  <div className={classes.content}>
                    <span className={classes.contentTitle}>{category.name}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}