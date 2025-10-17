'use client'

import React, { useState, useEffect } from 'react'

interface UsernameDialogProps {
  onSave: (username: string) => void
}

// Helper functions for IndexedDB
const openDB = () =>
  new Promise<IDBDatabase>((resolve) => {
    const request = indexedDB.open('userPrefs', 1)
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains('prefs')) {
        db.createObjectStore('prefs')
      }
    }
    request.onsuccess = (event: any) => resolve(event.target.result)
  })

const getUsernameFromDB = async (): Promise<string | null> => {
  const db = await openDB()
  return new Promise((resolve) => {
    const tx = db.transaction('prefs', 'readonly')
    const store = tx.objectStore('prefs')
    const req = store.get('username')
    req.onsuccess = () => resolve(req.result || null)
    req.onerror = () => resolve(null)
  })
}

const saveUsernameToDB = async (username: string) => {
  const db = await openDB()
  const tx = db.transaction('prefs', 'readwrite')
  const store = tx.objectStore('prefs')
  store.put(username, 'username')
  tx.oncomplete = () => db.close()
}

const UsernameDialog: React.FC<UsernameDialogProps> = ({ onSave }) => {
  const [username, setUsername] = useState('')

  useEffect(() => {
    getUsernameFromDB().then((name) => {
      if (name) {
        setUsername(name)
        onSave(name)
      }
    })
  }, [onSave])

  const handleSave = async () => {
    if (username.trim()) {
      await saveUsernameToDB(username.trim())
      onSave(username.trim())
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#1e1e1e] p-6 rounded-lg w-80 shadow-lg text-white">
        <h2 className="text-lg font-semibold mb-4">Enter Your Username</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 rounded bg-[#2a2a2a] border border-gray-600 mb-4 text-white outline-none"
          placeholder="Your name..."
        />
        <button
          onClick={handleSave}
          className="w-full bg-green-500 hover:bg-green-400 p-2 rounded transition"
        >
          Save
        </button>
      </div>
    </div>
  )
}

export default UsernameDialog
