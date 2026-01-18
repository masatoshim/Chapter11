"use client";

import { useRef, useState, useEffect, ChangeEvent } from 'react';
import Image from 'next/image';
import classes from '@/app/admin/_styles/AdminEdit.module.scss';
import { useRouter } from 'next/navigation';
import { useGetCategories } from '@/app/admin/_hooks';
import { useGetThumbnailImageUrl } from '@/app/_hooks';
import { supabase } from '@/app/_libs/supabase'; 
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { PostSchemaType } from '@/app/_types';

const schema: z.ZodObject<PostSchemaType> = z.object({
  title: z.string().min(1, "タイトルは必須です").max(100, "タイトルは100文字以内で入力してください"),
  content: z.string(),
  thumbnailImageKey: z.string(),
  categoryIds: z.array(z.number()),
});

interface PostFormProps {
  mode: 'create' | 'edit';
  defaultValues?: z.infer<typeof schema>;
  onSubmit: (data: z.infer<typeof schema>) => void;
  onDelete?: () => void;
  isLoading: boolean;
}

export const PostForm = (props: PostFormProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { categories, fetched: catFetched } = useGetCategories();

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<z.infer<typeof schema>>({
    defaultValues: props.defaultValues,
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (props.defaultValues) {
      reset(props.defaultValues);
    }
  }, [props.defaultValues, reset]);

  const watchThumbnailKey = watch("thumbnailImageKey");
  const watchCategoryIds = watch("categoryIds");

  const toggleCategory = (id: number) => {
    const currentIds = watchCategoryIds;
    const newIds = currentIds.includes(id)
      ? currentIds.filter(prevId => prevId !== id)
      : [...currentIds, id];
    setValue("categoryIds", newIds, { shouldValidate: true });
  };

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
    .filter((c) => watchCategoryIds.includes(c.id))
    .map((c) => c.name)
    .join(', ');

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    const filePath = `private/${uuidv4()}`;

    const { data, error } = await supabase.storage
      .from('post_thumbnail')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (error) {
      alert(error.message);
      return;
    }
    setValue("thumbnailImageKey", data.path, { shouldValidate: true });
  };

  const { thumbnailImageUrl } = useGetThumbnailImageUrl(watchThumbnailKey);

  return (
    <form className={classes.form} onSubmit={handleSubmit(props.onSubmit)}>
      <fieldset disabled={props.isLoading} className={classes.fieldset}>
        
        <div className={classes.field}>
          <label>タイトル</label>
          <input 
            type="text" 
            placeholder="記事のタイトルを入力"
            {...register("title")} 
          />
          {errors.title && <span className={classes.error}>{errors.title.message}</span>}
        </div>

        <div className={classes.field}>
          <label>サムネイルURL</label>
          <input type="file" onChange={handleImageChange} accept="image/*" />
          {errors.thumbnailImageKey && <span className={classes.error}>{errors.thumbnailImageKey.message}</span>}
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
            {...register("content")} 
          />
          {errors.content && <span className={classes.error}>{errors.content.message}</span>}
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
                  const isChecked = watchCategoryIds.includes(category.id);
                  return (
                    <li 
                      key={category.id} 
                      className={`${classes.optionItem} ${isChecked ? classes.selected : ''}`}
                      onClick={() => toggleCategory(category.id)}
                    >
                      <input type="checkbox" checked={isChecked} readOnly />
                      <span className={classes.optionName}>{category.name}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          {errors.categoryIds && <span className={classes.error}>{errors.categoryIds.message}</span>}
        </div>

        <div className={classes.actionButtons}>
          <button type="submit" className={classes.primaryBtn}>
            {props.isLoading ? "送信中..." : props.mode === 'create' ? "作成" : "更新"}
          </button>
          
          {props.mode === 'edit' ? (
            <button type="button" className={classes.secondaryBtn} onClick={props.onDelete}>削除</button>
          ) : (
            <button type="button" className={classes.secondaryBtn} onClick={() => router.back()}>キャンセル</button>
          )}
        </div>
      </fieldset>
    </form>
  );
};