"use client";

import { useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import classes from '@/app/admin/_styles/AdminEdit.module.scss';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { CategorySchemaType } from '@/app/_types';

const schema: z.ZodObject<CategorySchemaType> = z.object({
  name: z.string().min(1, "カテゴリー名は必須です").max(20, "カテゴリー名は20文字以内で入力してください"),
});

interface CategoryFormProps {
  mode: 'create' | 'edit';
  defaultValues?: { name: string }; 
  onSubmit: (data: z.infer<typeof schema>) => void;
  onDelete?: () => void;
  isLoading: boolean;
}

export const CategoryForm = (props: CategoryFormProps) => {
  const router = useRouter();

  const { register, handleSubmit, reset, formState: { errors } }: UseFormReturn<z.infer<typeof schema>> = useForm({
    defaultValues: props.defaultValues,
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (props.defaultValues) {
      reset(props.defaultValues);
    }
  }, [props.defaultValues, reset]);

  return (
    <form className={classes.form} onSubmit={handleSubmit(props.onSubmit)}>
      <fieldset disabled={props.isLoading} className={classes.fieldset}>
        
        <div className={classes.field}>
          <label>カテゴリー名</label>
          <input
            type="text"
            placeholder={props.mode === 'create' ? "例: プログラミング, 日記など" : ""}
            {...register("name")}
          />
          {errors.name && <span className={classes.error}>{errors.name.message}</span>}
        </div>

        <div className={classes.actionButtons}>
          <button type="submit" className={classes.primaryBtn}>
            {props.isLoading ? "処理中..." : (props.mode === 'create' ? "作成" : "更新")}
          </button>

          {props.mode === 'edit' ? (
            <button type="button" className={classes.secondaryBtn} onClick={props.onDelete}>
              削除
            </button>
          ) : (
            <button type="button" className={classes.secondaryBtn} onClick={() => router.back()}>
              キャンセル
            </button>
          )}
        </div>
      </fieldset>
    </form>
  );
};