"use client";
import { useUser } from "@clerk/nextjs";
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

export default function MyPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editData, setEditData] = useState({ title: "", content: "", category: "" });

  useEffect(() => {
    if (isSignedIn && isLoaded) {
      fetchUserPosts();
    }
  }, [isSignedIn, isLoaded]);

  const fetchUserPosts = async () => {
    try {
      const response = await fetch("/api/post/user");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch user posts:", err);
      setError("글 목록을 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`/api/post/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("삭제에 실패했습니다.");
      }

      // 목록에서 제거
      setPosts(posts.filter((post) => post.id !== postId));
      alert("글이 삭제되었습니다.");
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("글 삭제에 실패했습니다.");
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post.id);
    setEditData({
      title: post.title,
      content: post.content,
      category: post.category,
    });
  };

  const handleSaveEdit = async (postId: string) => {
    try {
      const response = await fetch(`/api/post/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error("수정에 실패했습니다.");
      }

      // 목록 업데이트
      const updatedPost = await response.json();
      setPosts(
        posts.map((post) => (post.id === postId ? { ...updatedPost, user: post.user } : post))
      );
      setEditingPost(null);
      alert("글이 수정되었습니다.");
    } catch (err) {
      console.error("Failed to update post:", err);
      alert("글 수정에 실패했습니다.");
    }
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setEditData({ title: "", content: "", category: "" });
  };

  if (!isLoaded) return <div>로딩 중...</div>;
  if (!isSignedIn) return <div>로그인이 필요합니다.</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">마이페이지</h2>
      
      <div className="mb-6 p-4 border rounded">
        <h3 className="text-lg font-semibold mb-2">프로필 정보</h3>
        <p>이메일: {user.emailAddresses[0]?.emailAddress}</p>
        <p>이름: {user.firstName} {user.lastName}</p>
        <p>핸드폰: {user.phoneNumbers[0]?.phoneNumber ?? "없음"}</p>
        <img src={user.imageUrl} alt="프로필 이미지" width={80} className="mt-2" />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">내가 쓴 글 ({posts.length})</h3>
        
        {loading ? (
          <div>로딩 중...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : posts.length === 0 ? (
          <div className="text-gray-500">작성한 글이 없습니다.</div>
        ) : (
          <ul>
            {posts.map((post) => (
              <li key={post.id} className="mb-4 p-4 border rounded">
                {editingPost === post.id ? (
                  <div>
                    <input
                      type="text"
                      value={editData.title}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      className="w-full p-2 mb-2 border rounded"
                      placeholder="제목"
                    />
                    <textarea
                      value={editData.content}
                      onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                      className="w-full p-2 mb-2 border rounded"
                      rows={4}
                      placeholder="내용"
                    />
                    <input
                      type="text"
                      value={editData.category}
                      onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                      className="w-full p-2 mb-2 border rounded"
                      placeholder="카테고리"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(post.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                      >
                        저장
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Link href={`/posts/${post.id}`} className="text-blue-600 underline hover:text-blue-800">
                      {post.title}
                    </Link>
                    <p className="text-sm text-gray-700 mt-2">{post.content}</p>
                    <div className="text-xs text-gray-500 mt-2">
                      카테고리: {post.category} | 작성일: {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}