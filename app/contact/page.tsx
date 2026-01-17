"use client";

import classes from '@/app/contact/_styles/Contact.module.scss'
import { useForm, UseFormReturn  } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ContactUserSchemaType, Contact } from '@/app/contact/_types';

export default function ContactPage() {

  const schema: z.ZodObject<ContactUserSchemaType> = z.object({
    name: z.string().nonempty("お名前は必須です").max(30, "名前は30文字以内にしてください。"),
    email: z.string().nonempty("メールアドレスは必須です。").email("メールアドレスの形式が正しくありません。"),
    message: z.string().nonempty("本文は必須です。").max(500, "本文は500文字以内にしてください。"),
  });

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset}: UseFormReturn<z.infer<typeof schema>> = useForm({
    resolver: zodResolver(schema),
  });

  const onsubmit: (data: Contact) => Promise<void> = async (data) => {
    try {
      const response: Response = await fetch('https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          message: data.message,
        }),
      });
      if (!response.ok) {
        throw new Error('送信に失敗しました');
      }
      window.alert('送信しました');
      reset();
    } catch (error) {
      console.error('送信エラー:', error);
    }
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>問合わせフォーム</h1>
      <form onSubmit={handleSubmit(onsubmit)} noValidate>
        <fieldset disabled={isSubmitting}>
          <div className={classes.parameter}>
            <label htmlFor="name" className={classes.parameterTitle}>お名前</label>
            <div className={classes.wFull}>
              <input id="name" type="text" className={classes.inputTypeText}
                {...register('name')}
                />
              <div className={classes.errorText}>{errors.name?.message}</div>
            </div>
          </div>
          <div className={classes.parameter}>
            <label htmlFor="email" className={classes.parameterTitle}>メールアドレス</label>
            <div className={classes.wFull}>
              <input id="email" type="email" className={classes.inputTypeText}
                {...register('email')} />
              <div className={classes.errorText}>{errors.email?.message}</div>
            </div>
          </div>
          <div className={classes.parameter}>
            <label htmlFor="message" className={classes.parameterTitle}>本文</label>
            <div className={classes.wFull}>
              <textarea id="message" rows={8} className={classes.inputTypeTextArea}
                {...register('message')} />
              <div className={classes.errorText}>{errors.message?.message}</div>
            </div>
          </div>
          <div className={classes.centerRow}>
            <button type="submit" className={classes.submitButton}>
              送信
            </button>
            <button type="button" onClick={() => reset()} className={classes.clearButton}>
              クリア
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}