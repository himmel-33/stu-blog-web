import { notFound } from "next/navigation";
import Link from "next/link";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

async function getPost(id: string) {
  const res = await fetch(`${baseUrl}/api/post/${id}`, {
    cache: 'no-store' // 실시간 데이터를 위해 캐시 비활성화
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function PostDetail({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  if (!post) return notFound();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-4">
        <Link href="/posts" className="text-blue-600 hover:underline">
          ← 글 목록으로 돌아가기
        </Link>
      </div>
      
      <article className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <span className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
            {post.category}
          </span>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        
        <div className="mb-6 text-gray-600 text-sm">
          <span>작성자: {post.user?.name || "익명"}</span>
          <span className="ml-4">
            작성일: {new Date(post.createdAt).toLocaleDateString('ko-KR')}
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
    </div>
  );
}