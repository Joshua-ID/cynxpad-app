/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

interface CynxpadEditorProps {
  content: any;
  onChange: (json: any) => void;
}

export default function CynxpadEditor({
  content,
  onChange,
}: CynxpadEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write something legendary...",
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-orange max-w-none focus:outline-none min-h-[500px] reading-text",
      },
    },
  });

  return <EditorContent editor={editor} />;
}
