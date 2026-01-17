import { prisma } from '@/app/_libs/prisma'
import { supabase } from '@/app/_libs/supabase'
import { NextResponse } from 'next/server'
import { CategoryIndexResponse, CategoryMutationPayload } from '@/app/_types'

// カテゴリー取得
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = request.headers.get('Authorization') ?? ''
  const { error } = await supabase.auth.getUser(token)
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })

  try {
    const { id: idStr } = await params;
    const id = Number(idStr);
    const category = await prisma.category.findUnique({
      where: { id },
    })
    if (!category) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 })
    }
    return NextResponse.json<CategoryIndexResponse>({ category }, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
  }
}

// カテゴリー更新
export const PUT = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const token = request.headers.get('Authorization') ?? ''
  const { error } = await supabase.auth.getUser(token)
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })

  try {
    const { id: idStr } = await params;
    const id = Number(idStr);
    const body = await request.json()
    const { name }: CategoryMutationPayload = body
    if (!name) {
      return NextResponse.json({ message: "カテゴリー名は必須です" }, { status: 400 })
    }
    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
      },
    })
    return NextResponse.json({ message: "OK", category }, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
  }
}

// カテゴリー削除
export const DELETE = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const token = request.headers.get('Authorization') ?? ''
  const { error } = await supabase.auth.getUser(token)
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })

  try {
    const { id: idStr } = await params;
    const id = Number(idStr);
    // カテゴリーの削除を実行
    // ※ onDelete: Cascade により、PostCategory の紐付けレコードも自動削除される
    const category = await prisma.category.delete({
      where: { id },
    })
    return NextResponse.json({ message: "OK", category }, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
  }
}