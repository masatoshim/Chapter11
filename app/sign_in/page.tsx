"use client";

import { useForm, UseFormReturn } from "react-hook-form";
import { supabase } from "@/app/_libs/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SignUserSchemaType } from '@/app/_types';

const schema: z.ZodObject<SignUserSchemaType> = z.object({
  email: z.string().nonempty("メールアドレスは必須です。").email("メールアドレスの形式が正しくありません。"),
  password: z.string().nonempty("パスワードは必須です。").min(6, "パスワードは6文字以上で入力してください。"),
});

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } }: UseFormReturn<z.infer<typeof schema>> = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
      alert("ログインに失敗しました");
    } else {
      router.replace("/admin/posts");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex justify-center pt-60">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-100">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">メールアドレス</label>
          <input
            {...register("email")}
            type="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">パスワード</label>
          <input
            {...register("password")}
            type="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          />
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={isLoading} className="w-full text-white bg-blue-700 p-2.5 rounded-lg">
          {isLoading ? "ログイン中..." : "ログイン"}
        </button>
      </form>
    </div>
  );
}