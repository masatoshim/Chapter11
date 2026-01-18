"use client";

import classes from '@/app/admin/_styles/Admin.module.scss'
import Link from "next/link";
import { usePathname } from 'next/navigation'
import { useRouteGuard } from '@/app/_hooks'
import { LayoutProps } from '@/app/_types'

export default function RootLayout({ children }: LayoutProps) {
  useRouteGuard()

  const pathname = usePathname()
  const isSelected = (href: string) => {
    return pathname.includes(href)
  }
  return (
    <div className={classes.adminWrapper}>
      <div className={classes.sidebar}>
        <nav className={classes.nav}>
          <ul>
            <li><Link href="/admin/posts" className={isSelected('/admin/posts') ? classes.active : ''}>記事一覧</Link></li>
            <li><Link href="/admin/categories" className={isSelected('/admin/categories') ? classes.active : ''}>カテゴリー一覧</Link></li>
          </ul>
        </nav>
      </div>
      <div className={classes.mainContent}>
        {children}
      </div>
    </div>
  );
}