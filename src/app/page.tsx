'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import TopBar from '../components/Topbar';
import Editor from '../components/Tiptap';
import UsernameDialog from '../components/usernameDiag';
import { useDocStore } from '@/store/docStore';

// ---------------- Username IndexedDB helpers ----------------
const getUsernameFromDB = async (): Promise<string | null> => {
  return new Promise((resolve) => {
    const request = indexedDB.open('userPrefs', 1);
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('prefs')) db.createObjectStore('prefs');
    };
    request.onsuccess = (event: any) => {
      const db = event.target.result;
      const tx = db.transaction('prefs', 'readonly');
      const store = tx.objectStore('prefs');
      const getReq = store.get('username');
      getReq.onsuccess = () => resolve(getReq.result || null);
      getReq.onerror = () => resolve(null);
    };
  });
};

const saveUsernameToDB = async (username: string) => {
  const dbRequest = indexedDB.open('userPrefs', 1);
  dbRequest.onsuccess = (event: any) => {
    const db = event.target.result;
    const tx = db.transaction('prefs', 'readwrite');
    tx.objectStore('prefs').put(username, 'username');
  };
};

// ---------------- Home Component ----------------
export default function Home() {
  const { docName, setDocName, docList, setDocList } = useDocStore();
  const [username, setUsername] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const searchParams = useSearchParams();

  // Load username from IndexedDB
  useEffect(() => {
    getUsernameFromDB().then((name) => {
      if (name) setUsername(name);
      else setShowDialog(true);
    });
  }, []);

  const handleSaveUsername = (name: string) => {
    setUsername(name);
    setShowDialog(false);
    saveUsernameToDB(name);
  };

  // Load doc from URL query param
  useEffect(() => {
    const docFromURL = searchParams.get('doc');
    if (docFromURL) {
      setDocName(docFromURL);

      // Add to docList if missing
      const existingList: string[] = JSON.parse(localStorage.getItem('docList') || '[]');
      if (!existingList.includes(docFromURL)) {
        const updatedList = [...existingList, docFromURL];
        setDocList(updatedList);
        localStorage.setItem('docList', JSON.stringify(updatedList));
      }

      localStorage.setItem('last-used-doc', docFromURL);
    }
  }, [searchParams, setDocName, setDocList]);

  return (
    <div className="relative h-screen flex flex-col overflow-hidden bg-[#121212]">
      {showDialog && <UsernameDialog onSave={handleSaveUsername} />}
      <TopBar username={username} />
      <div className="flex-1 overflow-hidden relative">
        <Editor username={username} />
      </div>
    </div>
  );
}
