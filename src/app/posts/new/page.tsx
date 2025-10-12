import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import NewPostForm from "@/components/posts/NewPostForm";

export default async function NewPostPage() {
  const { userId } = await auth();              

  if (!userId) {
    redirect("/sign-in");
  }

  return <NewPostForm />;
}
