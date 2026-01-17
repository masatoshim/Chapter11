import { prisma } from '@/app/_libs/prisma'
import { supabase } from '@/app/_libs/supabase'
import { NextResponse } from 'next/server'
import { PostIndexResponse, PostMutationPayload, PostUpdateResponse } from '@/app/_types'

// 記事取得
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
    const post = await prisma.post.findUnique({
      where: { id: id },
      include: {
        postCategories: {
          include: {
            category: {
              select: { id: true, name: true, createdAt: true, updatedAt: true },
            },
          },
        },
      },
    });
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    return NextResponse.json<PostIndexResponse>({ post }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

// 記事更新
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
    const { title, content, thumbnailUrl, categoryIds }: PostMutationPayload = body
    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        thumbnailUrl,
        postCategories: {
          // 既存の関連を一度すべて削除して作り直す
          deleteMany: {}, 
          create: categoryIds.map((id: number) => ({
            categoryId: id,
          })),
        },
      },
      include: {
        postCategories: {
          include: {
            category: true,
          },
        },
      },
    })
    return NextResponse.json<PostUpdateResponse>({ message: "OK", post }, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
  }
}

// 記事削除
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
    // データベースから削除を実行
    // ※ onDelete: Cascade の設定により、紐づく PostCategory も自動削除
    const post = await prisma.post.delete({
      where: { id },
    })
    return NextResponse.json({ message: "OK", post }, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
  }
}