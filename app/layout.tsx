import { LayoutProps } from '@/app/_types'
import { Header } from './_components/Header';

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="ja">
      <head />
      <body>
        <Header />
        <div>
          {children}
        </div>
      </body>
    </html>
  );
}