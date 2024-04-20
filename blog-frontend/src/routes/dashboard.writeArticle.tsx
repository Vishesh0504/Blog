import { createFileRoute } from "@tanstack/react-router";
// import { useEffect, useRef, useState } from 'react';
import Tiptap from "../components/tiptap";
export const Route = createFileRoute("/dashboard/writeArticle")({
  component: () => <WriteArticle />,
});

const WriteArticle = () => {
  return (
    <div className="text-slate-700 dark:text-slate-300 flex justify-center gap-10">
      <div className="flex flex-col gap-4">
        <div >
            Category
        </div>
        <div>
            Tags
        </div>
        <div className="flex flex-col gap-3">
            Excerpt
            <textarea
            className="px-3 py-1caret-slate-500 bg-inherit outline-none border border-slate-300 dark:border-slate-700 rounded-sm"
            maxLength={200}
            ></textarea>
            <button className="rounded-3xl px-3 py-1 dark:bg-primary-light bg-primary-dark  ">Generate with AI</button>
        </div>
      </div>
      <div className="w-1/2 border-x border-slate-400 dark:border-slate-700 dark:text-slate-300 text-slate-700 px-8 py-6 ">
        <div className="flex justify-between text-sm font-semibold dark:text-slate-300 text-slate-600">
          <button className="rounded-3xl bg-transparent dark:hover:bg-slate-800 hover:bg-slate-200 px-2 py-0.5 flex gap-2 items-center">
          <img src="/assets/image.png" className="size-4 dark:invert opacity-75"/>
          Add Cover</button>
          <button className="rounded-3xl dark:bg-primary-light bg-primary-dark  px-2 py-1 ">
            Publish
          </button>
        </div>
        <div className="py-4">
          <input type="text" placeholder="Article Title..." className="w-full text-3xl font-bold bg-transparent outline-none" />
        </div>
        <Tiptap />
      </div>

    </div>
  );
};
