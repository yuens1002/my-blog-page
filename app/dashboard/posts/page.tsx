'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import PageHeading from '@/components/PageHeading';
import Link from 'next/link';
import PostTable from './_components/PostTable';
import { Post } from '@prisma/client';
import FullPageLoader from '@/components/FullPageLoader';
import Pagination from '@/components/Pagination';
import { getPosts } from '@/app/dashboard/_actions/managePosts';
import { TableCell, TableRow } from '@/components/ui/table';
import PostStatusIcon from './_components/StatusIcon';
import PostTableActions from './_components/PostTableActions';

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [count, setCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPosts = async () => {
    setIsLoading(true);
    const result = await getPosts({
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
    });
    if (result.status === 'error') {
      throw new Error(
        result.message.toString() ||
          'Error occurred while getting posts'
      );
    }
    if ('data' in result) {
      setPosts(result.data);
      setTotalPages(Math.ceil(result.count / itemsPerPage));
      setCount(result.count);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [itemsPerPage, currentPage]);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };
  const onItemsPerPageChange = (itemsPerPage: number) => {
    setItemsPerPage(itemsPerPage);
  };

  return (
    <div className="lg:container">
      <header className="flex justify-between items-center gap-4 mb-12">
        <PageHeading>Posts</PageHeading>
        <Button asChild>
          <Link href="/dashboard/posts/new">New Post</Link>
        </Button>
      </header>
      <Pagination
        count={count}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        onItemsPerPageChange={onItemsPerPageChange}
      />
      {isLoading || !posts ? (
        <FullPageLoader />
      ) : posts.length === 0 ? (
        <TableRow>
          <TableCell colSpan={4}>
            'No posts found, create a new post/draft to get started'
          </TableCell>
        </TableRow>
      ) : (
        <PostTable>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>
                <PostStatusIcon
                  status={post.status}
                  isActive={post.isActive}
                />
              </TableCell>
              <TableCell>{post.title}</TableCell>
              <TableCell>
                {new Date(post.updatedAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <PostTableActions
                  authorId={post.authorId}
                  postId={post.id}
                  status={post.status}
                  isActive={post.isActive ?? false}
                  fetchPosts={fetchPosts}
                />
              </TableCell>
            </TableRow>
          ))}
        </PostTable>
      )}
    </div>
  );
}
