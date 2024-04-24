import {
  TableOfContentData,
  TableOfContentDataItem,
} from "@tiptap-pro/extension-table-of-contents";
import { TextSelection } from "@tiptap/pm/state";
import { Editor } from "@tiptap/react";
import { MouseEvent } from "react";

export const ToCEmptyState = () => {
  return (
    <div className=" text-slate-300 dark:text-slate-700">
      <p className="dark:text-primary-dark text-primary-light text-xl font-semibold ">
        Table Of Contents
      </p>
      <p className="text-base">
        Start editing your document to see the outline.
      </p>
    </div>
  );
};

interface ToCItemProps {
  item: TableOfContentDataItem;
  onItemClick: (e: MouseEvent, id: string) => void;
  index: string;
}
export const ToCItem = ({ item, onItemClick }: ToCItemProps) => {
  return (
    <div className={`toc--item toc--item--level_${item.level}`}>
      <a
        className={`block ml-${item.level * 2}
        ${item.level === 3 ? " text-base font-light" : ""}
        ${item.level === 2 ? "text-lg font-normal" : ""}
        ${item.level === 1 ? "text-xl font-medium" : ""}
        dark:text-slate-400 text-slate-500 cursor-pointer`}
         href={`#${item.id}`}
        onClick={(e) => onItemClick(e, item.id)}
      >
        {item.itemIndex}.{item.textContent}
      </a>
    </div>
  );
};
interface TableOfContentsProps {
  items: TableOfContentData;
  editor: Editor;
}

export const TableOfContent = ({
  items = [],
  editor,
}: TableOfContentsProps) => {
  const onItemClick = (e: MouseEvent, id: string) => {
    e.preventDefault();
    if (editor) {
      const element = editor.view.dom.querySelector(`[data-toc-id="${id}"`);
      const pos = editor.view.posAtDOM(element!, 0);

      // set focus
      const tr = editor.view.state.tr;

      tr.setSelection(new TextSelection(tr.doc.resolve(pos)));

      editor.view.dispatch(tr);

      editor.view.focus();

      if (history.pushState) {
        // eslint-disable-line
        history.pushState(null, "", `#${id}`); // eslint-disable-line
      }

      window.scrollTo({
        top: element!.getBoundingClientRect().top + window.scrollY,
        behavior: "smooth",
      });
    }
  };

  if (items.length === 0) {
    return <ToCEmptyState />;
  }
  return (
    <div className="toc--list">
      <p className="dark:text-primary-dark text-primary-light text-xl font-semibold ">
        Table Of Contents
      </p>
      <div className="flex flex-col gap-1">
        {items.map((item, i) => (
          <ToCItem
            onItemClick={onItemClick}
            key={item.id}
            item={item}
            index={i + 1 + ""}
          />
        ))}
      </div>
    </div>
  );
};
