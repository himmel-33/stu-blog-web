import { notFound } from "next/navigation";

async function getPost(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/post/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export default async function PostDetail({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  if (!post) return notFound();

  return (
    <article>
      <h2 className="text-xl font-bold mb-2">{post.title}</h2>
      <div>{post.content}</div>
    </article>
  );
}