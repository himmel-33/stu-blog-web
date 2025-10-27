"use client";
import { useEffect, useState, use, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

type Post = {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  imageUrl: string | null;
  user: { name: string | null } | null;
};

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string | null;
    clerkId: string;
  };
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

export default function PostDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user: currentUser } = useUser();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchPost = useCallback(async () => {
    try {
      const res = await fetch(`/api/post/${id}`);
      if (!res.ok) return;
      const data = await res.json();
      setPost(data);
    } catch (error) {
      console.error("Failed to fetch post:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/post/${id}/comment`);
      if (!res.ok) return;
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [fetchPost, fetchComments]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/post/${id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });

      if (!res.ok) throw new Error("댓글 작성 실패");

      const data = await res.json();
      setComments([...comments, data]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to submit comment:", error);
      alert("댓글 작성에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`/api/comment/${commentId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("댓글 삭제 실패");

      setComments(comments.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment:", error);
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  if (loading) return <div className="p-6">로딩 중...</div>;
  if (!post) return <div className="p-6">글을 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-4">
        <Link href="/posts" className="text-blue-600 hover:underline">
          ← 글 목록으로 돌아가기
        </Link>
      </div>

      <article className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4">
          <span className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
            {post.category}
          </span>
        </div>

        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

        <div className="mb-6 text-gray-600 text-sm">
          <span>작성자: {post.user?.name || "익명"}</span>
          <span className="ml-4">
            {getTimeAgo(post.createdAt)}
          </span>
        </div>

        {post.imageUrl && (
          <div className="mb-6">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full max-w-2xl mx-auto rounded-lg shadow-sm"
            />
          </div>
        )}

        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {post.content}
          </div>
        </div>
      </article>

      {/* 댓글 섹션 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">댓글 ({comments.length})</h2>

        {/* 댓글 작성 폼 */}
        {currentUser && (
          <div className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요..."
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <button
              onClick={handleSubmitComment}
              disabled={submitting || !newComment.trim()}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
            >
              {submitting ? "작성 중..." : "댓글 작성"}
            </button>
          </div>
        )}

        {/* 댓글 목록 */}
        {comments.length === 0 ? (
          <div className="text-gray-500 text-center py-4">아직 댓글이 없습니다.</div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-semibold">
                      {comment.user.name || "익명"}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      {getTimeAgo(comment.createdAt)}
                    </span>
                  </div>
                  {currentUser?.id === comment.user.clerkId && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-500 text-sm hover:text-red-700"
                    >
                      삭제
                    </button>
                  )}
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}