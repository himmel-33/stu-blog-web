"use client";
import { useUser } from "@clerk/nextjs";

export default function MyPage() {
  const { user, isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>로딩 중...</div>;
  }

  if (!isSignedIn) {
    return <div>로그인이 필요합니다.</div>;
  }

  return (
    <div>
      <h2>마이페이지</h2>
      <p>이메일: {user.emailAddresses[0]?.emailAddress}</p>
      <p>이름: {user.firstName} {user.lastName}</p>
      <img src={user.imageUrl} alt="프로필 이미지" width={80} />
      {/* 필요하다면 더 많은 정보 출력 */}
    </div>
  );
}