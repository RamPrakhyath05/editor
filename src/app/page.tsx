"use client"
import Editor from '../components/Tiptap';
import Sidebar from '../components/Sidebar';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <div className="relative h-screen overflow-hidden">
      <button className="absolute top-3 left-2 z-10 flex items-center space-x-2 overflow-hidden w-[200px] h-[70px] rounded-xl border-1 border-[#1A1110] cursor-pointer" onClick={()=>{router.push('/')}}>
        <Image
          src="/logo.png"
          alt="Mditor Logo"
          width={300}
          height={80}
          className="object-cover object-left-top"
        />
      </button>
      <div className="flex flex-row h-full">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Editor />
        </div>
      </div>
    </div>
  );
}
