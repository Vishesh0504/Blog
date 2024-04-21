import { EditorContent, useEditor, BubbleMenu, Editor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import "./tiptap.css";
import { useState, memo, useEffect } from "react";
import {
  TableOfContentData,
  TableOfContents,
  getHierarchicalIndexes,
} from "@tiptap-pro/extension-table-of-contents";
import { TableOfContent } from "./TableOfContent";

const MemorizedToC = memo(TableOfContent);
const Tiptap = ({setEditor}:{setEditor:(editor:Editor)=>void}) => {
  const colors = ["#FB7185", "#FDBA74", "#A5F3FC", "#A5B4FC"];
  const [highlightColor, setHighlightColor] = useState(colors[0]);
  const [items, setItems] = useState<TableOfContentData>([]);
  const [currentColor, setCurrentColor] = useState(0);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight.configure({
        multicolor: true,
      }),
      Placeholder.configure({
        showOnlyWhenEditable: true,
        placeholder: "Write something amazing...",
      }),
      TableOfContents.configure({
        getIndex: getHierarchicalIndexes,
        onUpdate(content) {
          setItems(content);
        },
      }),
      CharacterCount
    ],
    content: "",
  });

  useEffect(()=>{
    editor && editor.on("update",()=>{
      setEditor(editor);
    })

  },[editor,setEditor]);
  if (!editor) {
    return null;
  }
  return (
    <div className="flex-1 w-full text-lg flex justify-between gap-10">
      <div className=" caret-slate-400 font-content dark:text-slate-300 text-slate-700 min-h-screen flex-1 w-4/5">
        <EditorContent editor={editor}>
          {editor && (
            <BubbleMenu editor={editor!}>
              <div className="flex px-3 py-1 rounded-md gap-2 font-normal items-center font-heading border border-slate-200 dark:border-slate-800 dark:bg-bg-dark bg-bg-light shadow-md">
                <button
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`${editor.isActive("bold") ? "is-active bg-neutral-200 dark:bg-neutral-800  rounded-md" : ""} font-extrabold px-2 `}
                >
                  B
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`${editor.isActive("italic") ? "is-active bg-neutral-200 dark:bg-neutral-800 rounded-md" : ""} italic px-2`}
                >
                  I
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  className={`${editor.isActive("strike") ? "is-active bg-neutral-200 dark:bg-neutral-800  rounded-md" : ""} line-through font-extrabold px-2`}
                >
                  S
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleCode().run()}
                  className={`${editor.isActive("code") ? "is-active bg-neutral-200 dark:bg-neutral-800  rounded-md" : ""} font-extrabold px-2`}
                >
                  {"</>"}
                </button>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleHighlight({ color: highlightColor })
                      .run()
                  }
                  className={`
                  px-3 py-1
                  ${editor.isActive("highlight") ? "is-active bg-neutral-200 dark:bg-neutral-800  rounded-md" : ""} font-extrabold px-2`}
                >
                  <img
                    src="/assets/marker.png"
                    className="size-4 dark:invert"
                    alt="highlight"
                  />
                </button>
                {editor.isActive("highlight") && (
                  <div className="flex gap-2">
                    {
                      colors.map((color, i) => {
                          return (
                            <button
                              style={{ backgroundColor: color }}
                              onClick={() => {
                                setCurrentColor(i);
                                setHighlightColor(color);
                                editor
                                  .chain()
                                  .focus()
                                  .toggleHighlight({ color: color })
                                  .run();
                              }}
                              className={`rounded-full  border-2  ${
                                currentColor === i
                                  ? "opacity-100 border-black"
                                  : "opacity-40"
                              } border-slate-200 dark:border-slate-800 size-6`}
                            ></button>
                          );
                        })}
                  </div>
                )}
              </div>
            </BubbleMenu>
          )}
        </EditorContent>
      </div>
      <div className="w-1/5 text-pretty">
      <MemorizedToC items={items} editor={editor} />

      </div>
    </div>
  );
};

export default Tiptap;
