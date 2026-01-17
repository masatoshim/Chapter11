import { prisma } from '@/app/_libs/prisma'
import { supabase } from '@/app/_libs/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { CategoriesIndexResponse, CategoryMutationPayload, CreateCategoryResponse } from '@/app/_types'

// カテゴリー一覧取得
export const GET = async (request: NextRequest) => {
  const token = request.headers.get('Authorization') ?? ''
  const { error } = await supabase.auth.getUser(token)
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })

  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json<CategoriesIndexResponse>({ categories }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

// カテゴリー登録
export const POST = async (request: Request) => {
  const token = request.headers.get('Authorization') ?? ''
  const { error } = await supabase.auth.getUser(token)
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })

  try {
    const body: CategoryMutationPayload = await request.json()
    const { name } = body
    if (!name) {
      return NextResponse.json({ message: "カテゴリー名は必須です" }, { status: 400 })
    }
    const category = await prisma.category.create({
      data: {
        name,
      },
    })
    return NextResponse.json<CreateCategoryResponse>({
      id: category.id,
    })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
  }
}