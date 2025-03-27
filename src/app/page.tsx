import Editor from '../components/Tiptap'
import Sidebar from '../components/Sidebar.tsx'

export default function Home() {
  return( 
    <div className="flex flex-row h-screen"> 
        <Sidebar />
      <div className="flex-1 flex flex-col">
        <Editor />
      </div>
    </div>
  );
}
