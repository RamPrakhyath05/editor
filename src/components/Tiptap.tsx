"use client"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Heading from '@tiptap/extension-heading'
import Strike from '@tiptap/extension-strike'
import Blockquote from '@tiptap/extension-blockquote'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Code from '@tiptap/extension-code'
import CodeBlock from '@tiptap/extension-code-block'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import Link from '@tiptap/extension-link'
import HardBreak from '@tiptap/extension-hard-break'
import Highlight from '@tiptap/extension-highlight'
import Collaboration from '@tiptap/extension-collaboration'
// import { TiptapCollabProvider } from '@hocuspocus/provider'
import * as Y from 'yjs';
import React, { useEffect, useMemo, useState } from 'react'
import { WebrtcProvider } from 'y-webrtc'
import { IndexeddbPersistence } from 'y-indexeddb'


const Editor = () => {
  // Create a stable Yjs document
  const ydoc = useMemo(() => new Y.Doc(), [])

  // Create WebRTC and IndexedDB providersParagraph.configure({
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
