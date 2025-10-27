"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Post = { 
  id: string; 
  title: string; 
  content: string;
  category: string;
  createdAt: string;
  user: { name: string | null } | null;
};

// 상대 시간 변환 함수
function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}초 전`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }

  // 1일 이상 지난 경우 절대 날짜로 표시
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/post")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(setPosts)
      .catch((err) => {
        console.error("Failed to fetch posts:", err);
        setError("글 목록을 불러올 수 없습니다.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <div className="mb-4">
        <Link href="/posts/new">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">글 추가</button>
        </Link>
      </div>
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="mb-2 p-2 border rounded">
            <Link href={`/posts/${post.id}`} className="text-blue-600 underline">
              {post.title}
            </Link>
            <div className="text-sm text-gray-500">
              {post.user?.name && <span>by {post.user.name}</span>}
              <span className="ml-2">카테고리: {post.category}</span>
              <span className="ml-2">· {getTimeAgo(post.createdAt)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}