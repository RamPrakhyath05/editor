'use client'

import React, { useEffect } from 'react'
import { nanoid } from 'nanoid'
import { useDocStore } from '@/store/docStore'
import { HiOutlinePlusCircle } from 'react-icons/hi'
import { FiX } from 'react-icons/fi'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const TopBar = ({ username }: { username: string | null }) => {
  const router = useRouter()
  const { docList, docName, setDocName, addToDocList, setDocList } = useDocStore()

  // Load docList from localStorage
  useEffect(() => {
    const local = localStorage.getItem('docList')
    const parsed = local ? JSON.parse(local) : []
    if (Array.isArray(parsed)) setDocList(parsed)
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

      if (docName === name) {
        setDocName(updatedList.length ? updatedList[0] : null)
        localStorage.setItem('last-used-doc', updatedList[0] || '')
      }
    } catch (err) {
      console.error('Error deleting file:', err)
    }
  }

  
  return (
    <div className="w-full bg-[#1e1e1e] flex items-center px-3 h-[5%] border-b border-[#333]">
      {/* Logo */}
      <button
        className="flex items-center -translate-y-9 space-x-2 flex-shrink-0 cursor-pointer"
        onClick={() => router.push('/')}
      >
        <img
            src="/logo.svg"   // <- your SVG in the public folder
            alt="Mditor Logo"
            width={120}
            height={20}       // adjust height as needed
            className="object-contain"
          /> 
      </button>

      {/* Tabs */}
      <div className="ml-10 flex items-center gap-2 flex-1 min-w-0 overflow-x-auto scrollbar-hide">
        {docList.map((file, index) => (
          <div
            key={index}
            className={`flex items-center gap-1 px-6 rounded-xl cursor-pointer text-m transition-all py-2
              ${
                docName === file
                  ? 'bg-[#2d2d2d] text-white border-2 border-[#008800]'
                  : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]'
              }`}
            onClick={() => {
              setDocName(file)
              localStorage.setItem('last-used-doc', file)
              router.replace(`/?doc=${file}`, undefined, { shallow: true })
            }}
          >
            <span className="truncate max-w-[100px]">{file}</span>
            <button
              className="text-gray-400 hover:text-red-500 transition"
              onClick={(e) => {
                e.stopPropagation()
                handleDelete(file)
              }}
            >
              <FiX size={12} />
            </button>
          </div>
        ))}

        {/* Add New Tab */}
        <button
          onClick={handleCreateNewFile}
          className="ml-1 flex items-center gap-1 text-gray-300 hover:text-green-400 transition"
          title="New File"
        >
          <HiOutlinePlusCircle size={16} />
        </button>
      </div>
      <div className="...">
        <span className="text-white ml-auto">{username || 'Anonymous'}</span>
      </div>
      <button
        onClick={() => {
          if (docName) {
            const shareURL = `${window.location.origin}/?doc=${docName}`;
            navigator.clipboard.writeText(shareURL);
            alert('URL copied! Share it with your friend 🎉');
          }
        }}
        className="ml-2 text-gray-300 hover:text-green-400 transition px-2 py-1 border border-gray-600 rounded"
        title="Share this document"
      >
        Share
      </button>
    </div>
  )

}

export default TopBar
