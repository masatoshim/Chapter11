"use client";

import classes from '@/app/_styles/Detail.module.scss'
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { usePost, useGetThumbnailImageUrl } from '@/app/_hooks';

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const { post, fetched, error } = usePost(id);
  const { thumbnailImageUrl } = useGetThumbnailImageUrl(post?.thumbnailImageKey);

  if (!fetched) return <div>読み込み中...</div>;
  if (!post) return <div>記事が見つかりません</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={classes.container}>
      <div className={classes.post}>
        <div className={classes.postImage}>{ thumbnailImageUrl && (<Image src={ thumbnailImageUrl } alt="" fill />)}</div>
        <div className={classes.postContent}>
          <div className={classes.postInfo}>
            <div className={classes.postDate}>{ new Date(post.createdAt).toLocaleDateString('ja-JP') }</div>
            <div className={classes.postCategories}>
              { post.postCategories.map((category, index) => <div className={classes.postCategory} key={`${post.id}-${index}`}>{category.category.name}</div>) }
            </div>
          </div>
          <h1 className={classes.postTitle}>{ post.title }</h1>
          <div className={classes.postBody} dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>
    </div>
  );
}