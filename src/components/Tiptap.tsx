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
import * as Y from 'yjs'
import React, { useEffect, useMemo } from 'react'
import { WebrtcProvider } from 'y-webrtc'
import { IndexeddbPersistence } from 'y-indexeddb'

const Editor = () => {
  const ydoc = useMemo(() => new Y.Doc(), [])

  useEffect(() => {
    const webrtcProvider = new WebrtcProvider('collaborative-room', ydoc, { signaling: ['ws://localhost:4444'] })
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

  // ✅ Create Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: false }),
      Collaboration.configure({ document: ydoc }),
      Paragraph.configure({ HTMLAttributes: { class: 'my-custom-paragraph' } }),
      Text,
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      Strike,
      Blockquote.configure({ HTMLAttributes: { class: 'blockquote' } }),
      Bold,
      Italic,
      Code,
      CodeBlock.configure({ HTMLAttributes: { class: 'code-block' } }),
      HorizontalRule,
      BulletList,
      OrderedList,
      ListItem,
      Link.configure({ openOnClick: true }),
      HardBreak,
      Highlight.configure({ HTMLAttributes: { class: 'highlighted-text' } }),
    ],
    immediatelyRender: false,
  })

  const saveToPC = () => {
    if (!editor) return

    // Extract Y.Doc content as Markdown
    const json = editor.getJSON()

    // Improved JSON to Markdown converter
    const convertToMarkdown = (json) => {
      const convertNode = (node) => {
        switch (node.type) {
          case 'paragraph':
            return (node.content?.map(convertNode).join('') || '') + '\n\n'
          case 'text': {
            let text = node.text || ''  // Fallback to empty string
            if (node.marks) {
              node.marks.forEach((mark) => {
                if (mark.type === 'bold') text = `**${text}**`
                if (mark.type === 'italic') text = `*${text}*`
                if (mark.type === 'strike') text = `~~${text}~~`
                if (mark.type === 'code') text = `\`${text}\``
              })
            }
            return text
          }
          case 'heading': {
            const level = '#'.repeat(node.attrs.level || 1)  // Fallback to level 1
            return `${level} ${(node.content?.map(convertNode).join('') || '')}\n\n`
          }
          case 'bulletList':
            return (node.content?.map(item => `- ${item.content?.map(convertNode).join('') || ''}`).join('\n') || '') + '\n\n'
          case 'orderedList':
            return (node.content?.map((item, index) => `${index + 1}. ${item.content?.map(convertNode).join('') || ''}`).join('\n') || '') + '\n\n'
          case 'blockquote':
            return `> ${(node.content?.map(convertNode).join('') || '')}\n\n`
          case 'codeBlock':
            return `\`\`\`\n${(node.content?.map(convertNode).join('') || '')}\n\`\`\`\n\n`
          case 'horizontalRule':
            return `---\n\n`
          default:
            return node.content?.map(convertNode).join('') || ''
        }
      }

      return json.content?.map(convertNode).join('') || ''
    }

    const markdown = convertToMarkdown(json)

    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'document.md'
    a.click()

    URL.revokeObjectURL(url)
  }
  return (
    <div className="p-4 relative h-full">
      <EditorContent editor={editor} />
      <button 
        className="absolute bottom-4 right-4 cursor-pointer rounded-lg bg-indigo-500 w-48 h-10 text-white hover:bg-indigo-400 transition duration-300 text-center hover:scale-105"
        onClick={saveToPC}
      >
        Save as .md file
      </button>
    </div>
  )
}

export default Editor
