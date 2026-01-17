import { prisma } from '@/app/_libs/prisma'
import { supabase } from '@/app/_libs/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { PostsIndexResponse, PostMutationPayload, CreatePostResponse } from '@/app/_types'

// 記事一覧取得
export const GET = async (request: NextRequest) => {
  const token = request.headers.get('Authorization') ?? ''
  const { error } = await supabase.auth.getUser(token)
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })

  try {
    const posts = await prisma.post.findMany({
      include: {
        postCategories: {
          include: {
            category: {
              select: { id: true, name: true, createdAt: true, updatedAt: true },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json<PostsIndexResponse>({ posts }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

// 記事登録
export const POST = async (request: Request) => {
  const token = request.headers.get('Authorization') ?? ''
  const { error } = await supabase.auth.getUser(token)
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })

  try {
    const body: PostMutationPayload  = await request.json()
    const { title, content, thumbnailUrl, categoryIds } = body
    const post = await prisma.post.create({
      data: {
        title,
        content,
        thumbnailUrl,
        postCategories: {
          create: categoryIds.map((id: number) => ({
            categoryId: id,
          })),
        },
      },
    })
    return NextResponse.json<CreatePostResponse>({
      id: post.id,
    })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
  }
}