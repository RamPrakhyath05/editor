import React from 'react'
import { useRouter } from 'next/navigation';
const Sidebar = () => {
  const files = ["File 1", "File 2", "File 3"]
  const router = useRouter();
  return (
    <div className="h-screen flex justify-start items-start">
      <div className="flex flex-col w-52 h-[90vh] mt-[5.5rem] ml-2 justify-start items-start bg-[#2d2d2d] rounded-lg shadow-lg p-3">  
        <h1 className="text-3xl mt-5 text-white font-semibold">Files</h1>  
        <div className="flex flex-col w-full gap-4 mt-6">  
          {files.map((file, index) => (
            <div 
              key={index} 
              className="bg-[#1e1e1e] w-[80%] p-3 rounded-xl text-white hover:bg-[#3a3a3a] transition duration-300 text-center cursor-pointer"
            >
              <h6>{file}</h6>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
