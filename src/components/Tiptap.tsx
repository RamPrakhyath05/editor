'use client'

import React, { useEffect, useState } from 'react'
import { EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Collaboration from '@tiptap/extension-collaboration'
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
import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { GoDownload } from 'react-icons/go'
import { format } from 'date-fns'
import { useDocStore } from '@/store/docStore'

const EditorComponent = () => {
  const { docName, setDocName } = useDocStore()
  const [editor, setEditor] = useState<Editor | null>(null)

  // Load last-used-doc only if docName is not set
  useEffect(() => {
    if (!docName) {
      const saved = localStorage.getItem('last-used-doc')
      if (saved) setDocName(saved)
    }
  }, [docName, setDocName])

  // Set up editor if docName exists
  useEffect(() => {
    if (!docName) return

    const ydoc = new Y.Doc()
    const provider = new IndexeddbPersistence(docName, ydoc)

    provider.on('synced', () => {
      localStorage.setItem('last-used-doc', docName)
      const existing = JSON.parse(localStorage.getItem('docList') || '[]')
      if (!existing.includes(docName)) {
        localStorage.setItem('docList', JSON.stringify([...existing, docName]))
      }
    })

    const newEditor = new Editor({
      extensions: [
        StarterKit.configure({ history: false }),
        Placeholder.configure({
          placeholder: 'Start typing...',
          emptyEditorClass: 'is-editor-empty',
        }),
        Collaboration.configure({ document: ydoc }),
        Paragraph,
        Text,
        Heading,
        Strike,
        Blockquote,
        Bold,
        Italic,
        Code,
        CodeBlock,
        HorizontalRule,
        BulletList,
        OrderedList,
        ListItem,
        Link,
        HardBreak,
        Highlight,
      ],
      editorProps: {
        attributes: {
          class: 'outline-none',
        },
      },
      autofocus: true,
      content: '',
    })

    setEditor(newEditor)

    return () => {
      provider.destroy()
      newEditor.destroy()
    }
  }, [docName])

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
          case 'heading':
            return `${'#'.repeat(node.attrs.level)} ${node.content?.map(convertNode).join('')}\n\n`
          case 'bulletList':
            return node.content?.map(item => `- ${item.content?.map(convertNode).join('')}`).join('\n') + '\n\n'
          case 'orderedList':
            return node.content?.map((item, i) => `${i + 1}. ${item.content?.map(convertNode).join('')}`).join('\n') + '\n\n'
          case 'blockquote':
            return `> ${node.content?.map(convertNode).join('')}\n\n`
          case 'codeBlock':
            return `\`\`\`\n${node.content?.map(convertNode).join('')}\n\`\`\`\n\n`
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
    a.download = `${format(new Date(), 'dd-MM-yyyy')}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ➤ No document selected
  if (!docName) {
    return (
      <div className="p-4 text-gray-400 h-full flex items-center justify-center bg-[#2b2b2b] rounded-lg">
        Create a new file to get started, or select a file from the sidebar.
      </div>
    )
  }

  // ➤ Document selected, but editor not ready
  if (!editor) {
    return (
      <div className="p-4 text-gray-300">Loading your document...</div>
    )
  }

  // ➤ Editor is ready
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
  )
}

export default EditorComponent
