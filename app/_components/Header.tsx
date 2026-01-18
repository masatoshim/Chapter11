'use client'

import '@/app/App.css';
import Link from 'next/link'
import React from 'react'
import { useSupabaseSession } from '@/app/_hooks'
import { supabase } from '../_libs/supabase'
import { useRouter, usePathname } from 'next/navigation'


export const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut()
    await router.replace('/sign_in')
  }

  const { session, isLoading } = useSupabaseSession()

  return (
    <header className="header">
      <Link href="/" className="header-link">
        Blog
      </Link>
      {!isLoading && (
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/admin/posts" className="header-link">
                管理画面
              </Link>
              <button onClick={handleLogout}>ログアウト</button>
            </>
          ) : (
            <>
              <Link href="/contact" className="header-link">
                お問い合わせ
              </Link>
              {pathname !== "/sign_in" && (
                <Link href="/sign_in" className="header-link">
                  ログイン
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </header>
  )
}