"use client";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const { user, isSignedIn } = useUser();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("일반");
  const router = useRouter();

  if (!isSignedIn) {
    router.push("/sign-in");
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    
    await fetch("/api/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        imageUrl,
        category,
        userId: user.id, // Clerk의 user.id를 user_tb의 clerkId와 매칭해야 함
      }),
    });
    router.push("/posts");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block">제목</label>
        <input
          className="border px-2 py-1 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block">카테고리</label>
        <select
          className="border px-2 py-1 w-full"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="일반">일반</option>
          <option value="기술">기술</option>
          <option value="일상">일상</option>
          <option value="여행">여행</option>
          <option value="음식">음식</option>
          <option value="스포츠">스포츠</option>
        </select>
      </div>
      <div>
        <label className="block">내용</label>
        <textarea
          className="border px-2 py-1 w-full"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block">이미지 URL</label>
        <input
          className="border px-2 py-1 w-full"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
        추가
      </button>
    </form>
  );
}
