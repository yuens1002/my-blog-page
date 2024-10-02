import React from 'react';
import PageHeading from './PageHeading';
import { Separator } from './ui/separator';
import UnsplashPhotoComp from './UnsplashPhoto';
import { type BlogByUniquePropResponse } from '@/DAL/blog';
import Image from 'next/image';
import { calculateReadingTime, cn } from '@/lib/utils';
import Link from 'next/link';
import { badgeVariants } from './ui/badge';

type BlogPostProps = {
  post: BlogByUniquePropResponse;
};

export default function BlogPost({
  post: {
    title,
    author,
    unsplashPhotoId,
    publishedAt,
    imageURL,
    content,
    tags,
  },
}: BlogPostProps) {
  const authorName = author.firstName + ' ' + author.lastName;

  return (
    <article className="w-screen">
      <div className="container px-4 py-4 md:py-8">
        <PageHeading>{title}</PageHeading>
        <h6 className="flex flex-col gap-y-1 border-l-8 border-l-primary/10 mt-4 pl-4 md:border-l-0 md:flex-row md:gap-4 md:pl-0 text-muted-foreground">
          <span>
            Written by:{' '}
            <Link
              href={`/author/${author.id}`}
              className="font-semibold hover:underline hover:underline-offset-4"
            >{`${authorName}`}</Link>
          </span>
          <span>
            <Separator orientation="vertical" />
          </span>
          {publishedAt ? (
            <span>{`Published on:  ${new Date(
              publishedAt
            ).toLocaleDateString()}`}</span>
          ) : (
            'TBD'
          )}
          <span>
            <Separator orientation="vertical" />
          </span>
          <span>
            Tags:{' '}
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/tag/${tag}`}
                className={cn(
                  badgeVariants({
                    variant: 'outline',
                  }),
                  'mr-2'
                )}
              >{`#${tag}`}</Link>
            ))}
          </span>
          <span>
            <Separator orientation="vertical" />
          </span>
          {content ? (
            <span>{calculateReadingTime(content)} min read</span>
          ) : null}
        </h6>
      </div>
      <div>
        {unsplashPhotoId ? (
          <UnsplashPhotoComp
            photoId={unsplashPhotoId}
            paddingOnCreditPlacement={true}
          />
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
      </div>
      <div className="p-4 md:container md:py-12 md:columns-2 lg:columns-3 md:gap-6 lg:gap-8">
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
