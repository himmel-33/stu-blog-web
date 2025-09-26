import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-red-300">
      <Image src ="/windbg.png" width={400} height={400} alt="바람사진"/>
      메인 블로그 페이지
    </div>
  );
}
