import { useState, useEffect } from 'react';
import { supabase } from '@/app/_libs/supabase';

export const useGetThumbnailImageUrl = (thumbnailImageKey?: string) => {

  // Imageタグのsrcにセットする画像URLを持たせるstate
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(null)
  useEffect(() => {
    if (!thumbnailImageKey) return
    // アップロード時に取得した、thumbnailImageKeyを用いて画像のURLを取得
    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from('post_thumbnail')
        .getPublicUrl(thumbnailImageKey)
      setThumbnailImageUrl(publicUrl)
    }
    fetcher()
  }, [thumbnailImageKey])

  return { thumbnailImageUrl };
}