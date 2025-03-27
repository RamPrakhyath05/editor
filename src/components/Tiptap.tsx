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
import { TiptapCollabProvider } from '@hocuspocus/provider'
import * as Y from 'yjs';
import { useEffect } from 'react';
import { IndexeddbPersistence } from "y-indexeddb"
import { nanoid } from 'nanoid' 

const fileID = nanoid(7);
const doc = new Y.Doc();

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
      Collaboration.configure({
        document: doc,
      }),
      StarterKit.configure({
        history:false,
      }),
    ],
    // content: `
    //   <h1>Heading 1</h1>
    //   <h2>Heading 2</h2>
    //   <p>Hello World!</p>
    //   <p><strong>Bold text</strong> and <em>italic text</em></p>
    //   <p><s>Strikethrough text</s></p>
    //   <blockquote>Blockquote text</blockquote>
    //   <ul>
    //     <li>Bullet list item</li>
    //     <li>Another item</li>
    //   </ul>
    //   <ol>
    //     <li>Ordered list item</li>
    //     <li>Another item</li>
    //   </ol>
    //   <pre><code>Code block</code></pre>
    //   <hr />
    //   <a href="https://example.com">Link example</a>
    // `,
    editorProps: {
      attributes: {
        class: 'tiptap',
      },
    },
    immediatelyRender: false,
  })
  
  // useEffect(() => {
  //   const provider = new TiptapCollabProvider({
  //     name: 'ashish', // Unique document identifier for syncing. This is your document name.
  //     appId: '7j9y6m10', // Your Cloud Dashboard AppID or baseURL for on-premises
  //     //token: 'notoken', // Your JWT token
  //     document: doc,
  //
  //     onSynced() {
  //       if (!doc.getMap('config').get('initialContentLoaded') && editor) {
  //         doc.getMap('config').set('initialContentLoaded', true)
  //
  //         editor.commands.setContent(`
  //         <p>This is a radically reduced version of Tiptap. It has support for a document, with paragraphs and text. That’s it. It’s probably too much for real minimalists though.</p>
  //         <p>The paragraph extension is not really required, but you need at least one node. Sure, that node can be something different.</p>
  //         `)
  //       }
  //     },
  //   })
  // }, [])

  if (!editor) return null

  return (
  <div className="p-8 rounded-xl ">
    <EditorContent editor={editor} className="focus:outline-none" />
  </div>

  )
}

export default Tiptap
