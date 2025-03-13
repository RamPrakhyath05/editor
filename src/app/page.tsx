import Tiptap from '../components/Tiptap'
import Sidebar from '../components/Sidebar.tsx'

export default function Home() {
  return( 
    <div className="bg-black flex flex-row h-screen"> 
      <div className="bg-[#333333] w-[10%]">
        <Sidebar />
      </div>
      <div className="bg-[#222222] flex-1 flex flex-col py-10">
        <Tiptap />
      </div>
    </div>
  );
}
