"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconStrikethrough,
  IconHighlight,
  IconCode,
  IconClearFormatting,
  IconH4,
  IconBlockquote,
  IconSeparator,
  IconList,
  IconListNumbers,
  IconSubscript,
  IconSuperscript,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconAlignJustified,
  IconArrowBack,
  IconArrowForward,
} from "@tabler/icons-react";

/* ── Toolbar button ── */
const ToolBtn = ({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title?: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    title={title}
    onMouseDown={(e) => {
      e.preventDefault(); // keep editor focus
      onClick();
    }}
    className={cn(
      "p-1.5 rounded-md transition-all duration-150 text-muted-foreground hover:text-foreground",
      active
        ? "bg-primary/20 text-primary"
        : "hover:bg-muted/40"
    )}
  >
    {children}
  </button>
);

const Separator = () => (
  <div className="w-px h-5 bg-border/60 mx-1 self-center" />
);

const RichTextEditor = (props: any) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: props.data,
    onUpdate({ editor }) {
      props.form.setFieldValue
        ? props.form.setFieldValue("description", editor.getHTML())
        : props.form.getInputProps?.("description")?.onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[200px] px-5 py-4 focus:outline-none text-foreground text-sm leading-relaxed prose prose-invert max-w-none " +
          "prose-headings:text-foreground prose-headings:my-2 prose-p:text-muted-foreground prose-p:my-1 " +
          "prose-strong:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground " +
          "prose-blockquote:border-primary/50 prose-blockquote:text-muted-foreground " +
          "prose-code:bg-muted/40 prose-code:text-primary prose-code:rounded prose-code:px-1",
      },
    },
  });

  useEffect(() => {
    if (editor && props.data && editor.getHTML() !== props.data) {
      editor.commands.setContent(props.data);
    }
  }, [props.data, editor]);

  if (!editor) return null;

  return (
    <div className="rounded-xl border border-border/40 bg-input/10 overflow-hidden focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all duration-200">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-border/40 bg-muted/20 sticky top-0 z-10 backdrop-blur-sm">

        {/* Text formatting */}
        <ToolBtn title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
          <IconBold size={15} />
        </ToolBtn>
        <ToolBtn title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
          <IconItalic size={15} />
        </ToolBtn>
        <ToolBtn title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")}>
          <IconUnderline size={15} />
        </ToolBtn>
        <ToolBtn title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")}>
          <IconStrikethrough size={15} />
        </ToolBtn>
        <ToolBtn title="Highlight" onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive("highlight")}>
          <IconHighlight size={15} />
        </ToolBtn>
        <ToolBtn title="Inline code" onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")}>
          <IconCode size={15} />
        </ToolBtn>
        <ToolBtn title="Clear formatting" onClick={() => editor.chain().focus().unsetAllMarks().run()}>
          <IconClearFormatting size={15} />
        </ToolBtn>

        <Separator />

        {/* Heading */}
        <ToolBtn title="Heading 4" onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} active={editor.isActive("heading", { level: 4 })}>
          <IconH4 size={15} />
        </ToolBtn>

        <Separator />

        {/* Blocks */}
        <ToolBtn title="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>
          <IconBlockquote size={15} />
        </ToolBtn>
        <ToolBtn title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <IconSeparator size={15} />
        </ToolBtn>
        <ToolBtn title="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
          <IconList size={15} />
        </ToolBtn>
        <ToolBtn title="Ordered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>
          <IconListNumbers size={15} />
        </ToolBtn>
        <ToolBtn title="Subscript" onClick={() => editor.chain().focus().toggleSubscript().run()} active={editor.isActive("subscript")}>
          <IconSubscript size={15} />
        </ToolBtn>
        <ToolBtn title="Superscript" onClick={() => editor.chain().focus().toggleSuperscript().run()} active={editor.isActive("superscript")}>
          <IconSuperscript size={15} />
        </ToolBtn>

        <Separator />

        {/* Alignment */}
        <ToolBtn title="Align left" onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })}>
          <IconAlignLeft size={15} />
        </ToolBtn>
        <ToolBtn title="Align center" onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })}>
          <IconAlignCenter size={15} />
        </ToolBtn>
        <ToolBtn title="Align justify" onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })}>
          <IconAlignJustified size={15} />
        </ToolBtn>
        <ToolBtn title="Align right" onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })}>
          <IconAlignRight size={15} />
        </ToolBtn>

        <Separator />

        {/* History */}
        <ToolBtn title="Undo" onClick={() => editor.chain().focus().undo().run()}>
          <IconArrowBack size={15} />
        </ToolBtn>
        <ToolBtn title="Redo" onClick={() => editor.chain().focus().redo().run()}>
          <IconArrowForward size={15} />
        </ToolBtn>
      </div>

      {/* ── Editor content ── */}
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;