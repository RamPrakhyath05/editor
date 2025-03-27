import React from 'react'

const Sidebar = () => {
  const array = ["File 1", "File 2", "File 3"]

  return (
    <div className="h-screen flex justify-start items-center"> 
      <div className="flex flex-col w-52 h-[90%] justify-between items-center bg-[#2d2d2d] rounded-lg shadow-lg">  
        <h1 className="text-4xl mt-5 text-center">Editor</h1>  
        <div className="flex flex-col items-center w-full gap-6 mt-10">  
          {array.map((key, index) => (
            <div 
              key={index} 
              className="bg-[#1e1e1e] w-[80%] p-2 rounded-xl text-white hover:bg-[#3a3a3a] transition duration-300 text-center hover:scale-110"
            >
              <h6>{key}</h6>
            </div>
          ))}
        </div>
        <button className="cursor-pointer rounded-lg bg-indigo-500 w-[80%] mt-auto mb-5 h-10 text-white hover:bg-indigo-400 transition duration-300 text-center hover:scale-110">Save as .md file</button>
      </div>
    </div>
  );
}

export default Sidebar;
