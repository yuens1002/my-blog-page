import React from 'react';
import PageHeading from './PageHeading';
import { Separator } from './ui/separator';
import UnsplashPhotoComp from './UnsplashPhotoComp';
import { type BlogByUniquePropResponse } from '@/DAL/blogPage';
import Image from 'next/image';

type BlogPostProps = {
  post: BlogByUniquePropResponse;
};

export default function BlogPost({
  post: { title, author, unsplashPhotoId, createdAt, imageURL },
}: BlogPostProps) {
  console.log('🚀 ~ author:', author);
  const authorName = author.firstName + ' ' + author.lastName;
  const localDateString = new Date(createdAt).toLocaleDateString();
  return (
    <article>
      <div className="px-4 py-4 md:container md:py-8">
        <PageHeading>{title}</PageHeading>
        <h6 className="flex gap-4 pt-4 text-muted-foreground">
          <span>{authorName}</span>
          <span>
            <Separator orientation="vertical" />
          </span>
          <span>{`6 min read`}</span>
          <span>
            <Separator orientation="vertical" />
          </span>
          <span>{`written - ${localDateString}`}</span>
        </h6>
      </div>
      {unsplashPhotoId ? (
        <UnsplashPhotoComp photoId={unsplashPhotoId} />
      ) : null}
      {imageURL ? (
        <div className="relative aspect-video">
          <Image
            src={imageURL}
            alt={'cover'}
            fill
            className="object-cover w-full"
          />
        </div>
      ) : null}
      <div className="px-4 md:container md:py-8 md:columns-2 lg:columns-3 md:gap-6 lg:gap-8 py-12">
        <p className="prose first-letter:font-extrabold first-letter:text-8xl pb-4">{`His mother had always taught him not to ever think of himself as better than others. 
          He'd tried to live by this motto. He never looked down on those who were less 
          fortunate or who had less money than him. But the stupidity of the 
          group of people he was talking to made him change his mind.`}</p>
        <p className="prose pb-4">{`His mother had always taught him not to ever think of himself as better than others. 
          He'd tried to live by this motto. He never looked down on those who were less 
          fortunate or who had less money than him. But the stupidity of the 
          group of people he was talking to made him change his mind.`}</p>
        <p className="prose pb-4">{`His mother had always taught him not to ever think of himself as better than others. 
          He'd tried to live by this motto. He never looked`}</p>
      </div>
    </article>
  );
}
