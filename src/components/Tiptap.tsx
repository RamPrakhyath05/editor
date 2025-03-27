"use client"
import React, { useEffect, useMemo } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { IndexeddbPersistence } from 'y-indexeddb'
import Collaboration from '@tiptap/extension-collaboration'

const Editor = () => {
  // Create a stable Yjs document
  const ydoc = useMemo(() => new Y.Doc(), [])

  // Create WebRTC and IndexedDB providers
  useEffect(() => {
    const webrtcProvider = new WebrtcProvider('collaborative-room', ydoc)
    const indexeddbProvider = new IndexeddbPersistence('my-document', ydoc)

    // Optional: Log sync events
    webrtcProvider.on('synced', (isSynced) => {
      console.log('WebRTC synced:', isSynced)
    })

    indexeddbProvider.on('synced', () => {
      console.log('IndexedDB sync complete')
    })

    // Cleanup providers on unmount
    return () => {
      webrtcProvider.destroy()
      indexeddbProvider.destroy()
    }
  }, [ydoc])

  // Create Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: false }),
      Collaboration.configure({
        document: ydoc
      }),
    Paragraph.configure({
        HTMLAttributes: {
          class: 'my-custom-paragraph',
        },
      }),
      Text,
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      Strike,
      Blockquote.configure({
        HTMLAttributes: {
          class: 'blockquote',
        },
      }),
      Bold,
      Italic,
      Code,
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'code-block',
        },
      }),
      HorizontalRule,
      BulletList,
      OrderedList,
      ListItem,
      Link.configure({
        openOnClick: true,
      }),
      HardBreak,
      Highlight.configure({
        HTMLAttributes: {
          class: 'highlighted-text',
        },
      }),
    ],
    content: '<p>Start collaborating...</p>'
  })

  return (
    <div className="p-4">
      <EditorContent editor={editor} />
    </div>
  )
}

export default Editor
