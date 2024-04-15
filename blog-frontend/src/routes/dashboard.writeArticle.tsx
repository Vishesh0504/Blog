import { createFileRoute } from "@tanstack/react-router";
// import { useEffect, useRef, useState } from 'react';
import Tiptap from "../components/tiptap";
export const Route = createFileRoute("/dashboard/writeArticle")({
  component: () => <WriteArticle />,
});

const WriteArticle = () => {
  return (
    <div className="text-text-light dark:text-text-dark flex justify-center">
      <div className="w-1/2 border-x border-slate-400 dark:border-slate-700 dark:text-slate-300 text-slate-700 px-8 py-6 ">
        <div>
          <button className="rounded-3xl bg-transparent hover:bg-slate-800 px-2 py-0.5 text-sm"> Add Cover</button>
        </div>
        <div className="py-4">
          <input type="text" placeholder="Article Title..." className="w-full text-3xl font-bold bg-transparent outline-none" />
        </div>
        <Tiptap />
      </div>

    </div>
  );
};
