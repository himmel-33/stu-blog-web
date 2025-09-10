"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); //SPA 처럼 동작하기 위해 페이지 새로고침 막기위해 호출
    await fetch("/api/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
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
        <label className="block">내용</label>
        <textarea
          className="border px-2 py-1 w-full"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
        추가
      </button>
    </form>
  );
}