"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useEffect } from "react";

export default function TiptapEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (json: object, text: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: { openOnClick: false },
      }),
      Image,
    ],
    content: content ? safeParse(content) : "",
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON(), editor.getText());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral max-w-none min-h-[300px] focus:outline-none px-4 py-3",
      },
    },
  });

  useEffect(() => {
    return () => editor?.destroy();
  }, [editor]);

  const addImage = () => {
    const url = window.prompt("이미지 URL을 입력하세요");
    if (url) editor?.chain().focus().setImage({ src: url }).run();
  };

  const addLink = () => {
    const url = window.prompt("링크 URL을 입력하세요");
    if (url) editor?.chain().focus().setLink({ href: url }).run();
  };

  if (!editor) return null;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white">
      <div className="flex flex-wrap gap-1 border-b border-neutral-200 p-2 text-sm">
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          굵게
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          기울임
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          제목
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          목록
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          인용
        </ToolbarButton>
        <ToolbarButton onClick={addLink}>링크</ToolbarButton>
        <ToolbarButton onClick={addImage}>이미지</ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-2 py-1 transition ${
        active
          ? "bg-neutral-900 text-white"
          : "text-neutral-600 hover:bg-neutral-100"
      }`}
    >
      {children}
    </button>
  );
}

function safeParse(content: string) {
  try {
    return JSON.parse(content);
  } catch {
    return content;
  }
}
