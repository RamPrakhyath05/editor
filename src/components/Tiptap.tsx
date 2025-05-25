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
import { GoDownload } from "react-icons/go";
import { format } from 'date-fns';
import Placeholder from '@tiptap/extension-placeholder'


const Editor = () => {
  const ydoc = useMemo(() => new Y.Doc(), [])

  useEffect(() => {
    const webrtcProvider = new WebrtcProvider('collaborative-room', ydoc, { signaling: ['ws://localhost:4444'] })
    const indexeddbProvider = new IndexeddbPersistence('my-document', ydoc)
    
    webrtcProvider.on('synced', (isSynced) => {
      console.log('WebRTC synced:', isSynced)
    })

    indexeddbProvider.on('synced', () => {
      console.log('IndexedDB sync complete')
    })

    return () => {
      webrtcProvider.destroy()
      indexeddbProvider.destroy()
    }
  }, [ydoc])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: false }),
      Placeholder.configure({
          placeholder: 'Start typing...',
          emptyEditorClass: 'is-editor-empty',
          showOnlyWhenEditable: true,
          showOnlyCurrent: false,
      }),
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

    const json = editor.getJSON()
    const convertToMarkdown = (json) => {
      const convertNode = (node) => {
        switch (node.type) {
          case 'paragraph':
            return (node.content?.map(convertNode).join('') || '') + '\n\n'
          case 'text': {
            let text = node.text || ''  
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
            const level = '#'.repeat(node.attrs.level || 1)  
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
    const date = new Date();
    a.download = `${format(date,'dd-mm-yyyy')}.md`
    a.click()

    URL.revokeObjectURL(url)
  }
  return (
    <div className="p-4 relative h-full">
      <div className="h-full overflow-y-auto rounded-lg bg-[#2b2b2b] p-6 tiptap">
        <EditorContent editor={editor} />
      </div>
      <button 
        type="button"
        className="absolute bottom-6 right-8 cursor-pointer rounded-lg bg-indigo-500 w-12 h-10 text-white hover:bg-indigo-400 transition duration-300 text-center hover:scale-105 flex items-center justify-center gap-2"
        title="Save as Markdown File"
        onClick={saveToPC}
      >
        <GoDownload className="text-lg" />
      </button>
    </div>
  );
}

export default Editor
