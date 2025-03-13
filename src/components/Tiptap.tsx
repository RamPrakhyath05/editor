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
      StarterKit,
    ],
    content: `
      <h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <p>Hello World!</p>
      <p><strong>Bold text</strong> and <em>italic text</em></p>
      <p><s>Strikethrough text</s></p>
      <blockquote>Blockquote text</blockquote>
      <ul>
        <li>Bullet list item</li>
        <li>Another item</li>
      </ul>
      <ol>
        <li>Ordered list item</li>
        <li>Another item</li>
      </ol>
      <pre><code>Code block</code></pre>
      <hr />
      <a href="https://example.com">Link example</a>
    `,
    editorProps: {
      attributes: {
        class: 'tiptap',
      },
    },
    immediatelyRender: false,
  })

  if (!editor) return null

  return (
    <div className="border border-black p-4 rounded-lg shadow-md">
      <EditorContent editor={editor} className="focus:outline-none"/>
    </div>
  )
}

export default Tiptap
