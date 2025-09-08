"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Post = { id: string; title: string };

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/api/post")
      .then((res) => res.json())
      .then(setPosts);
  }, []);

  return (
    <div>
      <div className="mb-4">
        <Link href="/posts/new">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">글 추가</button>
        </Link>
      </div>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/posts/${post.id}`} className="text-blue-600 underline">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}