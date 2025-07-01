'use client'

import React, { useEffect } from 'react'
import { nanoid } from 'nanoid'
import { useDocStore } from '@/store/docStore'
import { HiOutlinePlusCircle } from 'react-icons/hi'
import { FiTrash2 } from 'react-icons/fi'

const Sidebar = () => {
  const { docList, docName, setDocName, addToDocList, setDocList } = useDocStore()

  // Load docList from localStorage
  useEffect(() => {
    const local = localStorage.getItem('docList')
    const parsed = local ? JSON.parse(local) : []
    if (Array.isArray(parsed)) {
      setDocList(parsed)
    }
  }, [setDocList])

  const handleCreateNewFile = () => {
    const newDocName = `doc-${nanoid(7)}`
    setDocName(newDocName)
    localStorage.setItem('last-used-doc', newDocName)

    const existingList = JSON.parse(localStorage.getItem('docList') || '[]')
    const updatedList = [...new Set([...existingList, newDocName])]
    localStorage.setItem('docList', JSON.stringify(updatedList))

    addToDocList(newDocName)
  }

  const handleDelete = async (name: string) => {
    try {
      await indexedDB.deleteDatabase(name)

      const existingList = JSON.parse(localStorage.getItem('docList') || '[]')
      const updatedList = existingList.filter((item: string) => item !== name)
      localStorage.setItem('docList', JSON.stringify(updatedList))
      setDocList(updatedList)

      const lastUsed = localStorage.getItem('last-used-doc')
      if (lastUsed === name) {
        localStorage.removeItem('last-used-doc')
        setDocName(null)
      }

      if (docName === name) {
        setDocName(null)
      }
    } catch (err) {
      console.error('Error deleting file:', err)
    }
  }

  return (
    <div className="h-screen flex justify-start items-start">
      <div className="flex flex-col w-52 h-[90vh] mt-[5.5rem] ml-2 justify-start items-start bg-[#2d2d2d] rounded-lg shadow-lg p-3">
        <h1 className="text-3xl mt-5 text-white font-semibold">Files</h1>

        <button
          onClick={handleCreateNewFile}
          className="mt-4 mb-6 w-[80%] bg-green-600 text-white p-2 rounded-lg hover:bg-green-500 transition flex items-center justify-center gap-2"
        >
          <HiOutlinePlusCircle className="text-xl" />
          <span className="text-sm">New File</span>
        </button>

        <div className="flex flex-col w-full gap-4">
          {docList.map((file, index) => (
            <div key={index} className="relative group w-full">
              <div
                className="bg-[#1e1e1e] w-[80%] p-3 rounded-xl text-white hover:bg-[#3a3a3a] transition duration-300 text-center cursor-pointer"
                onClick={() => {
                  setDocName(file)
                  localStorage.setItem('last-used-doc', file)
                }}
              >
                <h6 className="truncate">{file}</h6>
              </div>

              <button
                className="absolute right-0 top-1.5 text-red-400 hover:text-red-600 text-base hidden group-hover:block"
                title="Delete File"
                onClick={() => handleDelete(file)}
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
