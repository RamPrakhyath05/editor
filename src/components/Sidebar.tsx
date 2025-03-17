import React from 'react'

const Sidebar = () => {
  const array = ["File1", "File2", "File3"]

  return (
    <div className="m-5">
      <h1 className="text-4xl">Chronicle</h1>
      {array.map((key, index) => (
        <div key={index} className="bg-[#1e1e1e] w-[60%] my-10 p-2 rounded-xl text-white">
          <h6>{key}</h6>
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
