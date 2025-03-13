"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Heading from '@tiptap/extension-heading'
import StarterKit from '@tiptap/starter-kit'
import Strike from '@tiptap/extension-strike'

const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      Document,
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
      StarterKit,
    ],
    content: '<h1>Heading 1</h1><h2>Heading 2</h2><p>Hello World!</p>',
    editorProps: {
      attributes: {
        class: 'tiptap', // Ensure the class is applied
      },
    },
    immediatelyRender: false, // Fix SSR hydration issue
  })

  if (!editor) return null

  return (
    <div className="border border-black p-4 rounded-lg shadow-md">
      <EditorContent editor={editor} className="focus:outline-none"/>
    </div>
  )
}

export default Tiptap
