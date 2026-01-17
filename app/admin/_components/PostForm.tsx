"use client";

import { useRef, useState, useEffect, ChangeEvent } from 'react';
import Image from 'next/image';
import classes from '@/app/admin/_styles/AdminEdit.module.scss';
import { useRouter } from 'next/navigation';
import { useGetCategories } from '@/app/admin/_hooks';
import { useGetThumbnailImageUrl } from '@/app/_hooks';
import { supabase } from '@/app/_libs/supabase'; 
import { v4 as uuidv4 } from 'uuid';

interface PostFormProps {
  mode: 'create' | 'edit';
  title: string;
  setTitle: (v: string) => void;
  content: string;
  setContent: (v: string) => void;
  thumbnailImageKey: string;
  setThumbnailImageKey: (v: string) => void;
  selectedCategoryIds: number[];
  toggleCategory: (id: number) => void;
  onSubmit: () => void;
  onDelete?: () => void;
  isLoading: boolean;
}

export const PostForm = (props: PostFormProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { categories, fetched: catFetched } = useGetCategories();
  
  // ドロップダウン外クリック制御
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectedCategoryNames = categories
    .filter((c) => props.selectedCategoryIds.includes(c.id))
    .map((c) => c.name)
    .join(', ');
  
  //const [thumbnailImageKey, setThumbnailImageKey] = useState('');
  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (!event.target.files || event.target.files.length == 0) {
      // 画像が選択されていないのでreturn
      return
    }
    const file = event.target.files[0] // 選択された画像を取得
    const filePath = `private/${uuidv4()}` // ファイルパスを指定
    // Supabaseに画像をアップロード
    const { data, error } = await supabase.storage
      .from('post_thumbnail') // ここでバケット名を指定
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })
    // アップロードに失敗したらエラーを表示して終了
    if (error) {
      alert(error.message)
      return
    }
    // data.pathに、画像固有のkeyが入っているので、thumbnailImageKeyに格納する
    props.setThumbnailImageKey(data.path)
  }

  const { thumbnailImageUrl } = useGetThumbnailImageUrl(props.thumbnailImageKey);

  return (
    <form className={classes.form} onSubmit={(e) => e.preventDefault()}>
      <fieldset disabled={props.isLoading} className={classes.fieldset}>
        <div className={classes.field}>
          <label>タイトル</label>
          <input 
            type="text" 
            placeholder="記事のタイトルを入力"
            value={props.title} 
            onChange={(e) => props.setTitle(e.target.value)} 
          />
        </div>

        <div className={classes.field}>
          <label>サムネイルURL</label>
          <input type="file" id="thumbnailImageKey" onChange={handleImageChange} accept="image/*" />
          {thumbnailImageUrl && (
            <div className="mt-2">
              <Image src={thumbnailImageUrl} alt="thumbnail" width={400} height={400} />
            </div>
          )}
        </div>

        <div className={classes.field}>
          <label>内容</label>
          <textarea 
            rows={10} 
            placeholder="本文を入力してください"
            value={props.content} 
            onChange={(e) => props.setContent(e.target.value)} 
          />
        </div>

        <div className={classes.field}>
          <label>カテゴリー</label>
          <div className={classes.customSelect} ref={dropdownRef}>
            <div className={classes.selectDisplay} onClick={() => setIsOpen(!isOpen)}>
              {catFetched ? selectedCategoryNames || "カテゴリーを選択してください" : "読み込み中..."}
              <span className={classes.arrow}>{isOpen ? '▲' : '▼'}</span>
            </div>

            {isOpen && (
              <ul className={classes.optionsList}>
                {categories.map((category) => {
                  const isChecked = props.selectedCategoryIds.includes(category.id);
                  return (
                    <li 
                      key={category.id} 
                      className={`${classes.optionItem} ${isChecked ? classes.selected : ''}`}
                      onClick={() => props.toggleCategory(category.id)}
                    >
                      <input type="checkbox" checked={isChecked} readOnly />
                      <span className={classes.optionName}>{category.name}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <div className={classes.actionButtons}>
          <button 
            type="button" 
            className={classes.updateBtn}
            onClick={props.onSubmit}
          >
            {props.isLoading ? "送信中..." : props.mode === 'create' ? "作成" : "更新"}
          </button>
          
          {props.mode === 'edit' ? (
            <button 
              type="button" 
              className={classes.deleteBtn}
              onClick={props.onDelete}
            >
              削除
            </button>
          ) : (
            <button 
              type="button" 
              className={classes.deleteBtn}
              onClick={() => router.back()}
            >
              キャンセル
            </button>
          )}
        </div>
      </fieldset>
    </form>
  );
};