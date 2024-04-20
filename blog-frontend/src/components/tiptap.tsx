import { EditorContent, useEditor, BubbleMenu} from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

import "./tiptap.css";
import {  useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";

// interface TOCItem {
//   content: string;
//   children: TOCItem[];
// }

// type TOC = TOCItem[];

const Tiptap = () => {
  // const [toc,setToc] = useState<TOC>([]);
  const colors = ['#FFF59D', '#FFABAB', '#DCEDC8', '#E1BEE7'];
  const colorsDark=['#FFAB00','#AD1457','#00BFA5','#6200EA']
  const {bool} = useContext(ThemeContext);
  const [highlightColor, setHighlightColor] = useState(!bool?colorsDark[0]:colors[0]);
  const [currentColor,setCurrentColor] = useState(0);
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
    ],
    content: "",
  });

  return (
    <div className=" w-full text-lg ">
      <div className=" caret-slate-400 font-content dark:text-slate-300 text-slate-700 min-h-screen ">
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
                  onClick={() => editor.chain().focus().toggleHighlight({color:highlightColor}).run()}
                  className={`${editor.isActive("code") ? "is-active bg-neutral-200 dark:bg-neutral-800  rounded-md" : ""} font-extrabold px-2`}
                >
                  {"</>"}
                </button>
                {editor.isActive("highlight") && <div className="flex gap-2">{bool?colors:colorsDark.map((color,i)=>{
                  return(<button
                  style={{backgroundColor:color}}
                  onClick={()=>
                    {
                      setCurrentColor(i);
                      setHighlightColor(color)
                      editor.chain().focus().toggleHighlight({color:color}).run()
                  }}
                  className={`rounded-full  border opacity-20 ${currentColor===i?'opacity-100 border-black':''
                  } border-slate-200 dark:border-slate-800 size-5`}></button>)})}</div>}
              </div>
            </BubbleMenu>
          )}
        </EditorContent>
      </div>
    </div>
  );
}


export default Tiptap;
