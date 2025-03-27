import React from 'react'

const Sidebar = () => {
  const files = ["File 1", "File 2", "File 3"]

  return (
    <div className="h-screen flex justify-start items-center"> 
      <div className="flex flex-col w-52 h-[90%] justify-start items-center bg-[#2d2d2d] rounded-lg shadow-lg">  
        <h1 className="text-4xl mt-5 text-center text-white">Files</h1>  
        <div className="flex flex-col items-center w-full gap-4 mt-6">  
          {files.map((file, index) => (
            <div 
              key={index} 
              className="bg-[#1e1e1e] w-[80%] p-3 rounded-xl text-white hover:bg-[#3a3a3a] transition duration-300 text-center"
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
