import { createFileRoute } from "@tanstack/react-router";
import Tiptap from "../components/tiptap";
import { useEffect, useState,memo} from "react";
import { Editor } from "@tiptap/react";
import Modal from "../components/Modal";
import { handleSupabase } from "../utils/supabase";
import toast from "react-hot-toast";
import { TableOfContentData } from "@tiptap-pro/extension-table-of-contents";
import { TableOfContent } from "../components/TableOfContent";
export const Route = createFileRoute("/dashboard/writeArticle/$postId")({
  component: () => <WriteArticle />,
});
const MemorizedToC = memo(TableOfContent);
const WriteArticle = () => {

  const [coverPicture, setCoverPicture] = useState<string>("");
  const [inputUrl,setInputUrl] = useState<string>("");
  const [img,setImg] = useState<File>();
  const [preview, setPreview] = useState("");
  const [showModal, setShowModal] = useState(false);


  const [editor, setEditor] = useState<Editor>();
  const [characterCount, setCharacterCount] = useState(0);
  const [items, setItems] = useState<TableOfContentData>([]);


  const postId = Route.useParams().postId;
  useEffect(() => {
    editor?.on("update", () => {
      setCharacterCount(editor?.storage.characterCount.words());
    });
  }, [editor]);
  return (
    <>
      {showModal && (
        <Modal isOpen={showModal} setIsOpen={setShowModal}>
          <div className="flex flex-col w-[40vw] gap-4">
            <div className="flex justify-between">
              <h2 className="font-semibold text-lg">Upload Image</h2>
              <button>
                <img
                  onClick={()=>{
                    setPreview("");
                    setShowModal(false)
                  }}
                  src="/assets/close.png"
                  className="size-4 opacity-50 dark:invert"
                />
              </button>
            </div>
            {!preview?
            <>
              <div className="flex justify-center">
              <label className="border border-dashed rounded-md border-slate-600 dark:border-slate-400 w-full flex justify-center cursor-pointer p-6 flex-col items-center font-medium">
                <img
                  src="/assets/image_upload.png"
                  className="size-12 opacity-40 dark:invert"
                />
                Recommended dimension is 1600 x 840
                <input
                  className="hidden"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                        setImg(e.target.files[0]);
                        setPreview(URL.createObjectURL(e.target.files[0]));
                      }
                    }
                  }
                />
              </label>
            </div>
            <div className="flex items-center text-slate-500 gap-4">
                <hr className="dark:border-gray-600 border-gray-300 w-full px-2">
                </hr>
                or
                <hr className="dark:border-gray-600 border-gray-300 w-full px-2">
                </hr>
            </div>
            <div>
              <input
                type="text"
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Enter Image URL"
                className="w-full px-3 py-1 caret-slate-500 bg-inherit outline-none border border-slate-300 dark:border-slate-700 rounded"
              />
            </div>
            </>

            :
            <div className="flex justify-center">
              <img src={preview} className="w-[400px] h-[210px]"/>
            </div>

            }
            <div className="flex justify-end gap-4">
                {!preview?
                <button
                onClick={
                  ()=>{
                    if(!inputUrl && !img)
                      {
                        return toast.error("Please select an image or enter an image URL");
                      }
                    setPreview(img?URL.createObjectURL(img):inputUrl)}}
                className="px-3 py-1 font-medium border-2 border-slate-300 dark:border-slate-700 rounded-lg dark:text-accent-dark text-accent-light">
                  Preview
                </button>
                :
                <button
                onClick={()=>{
                  setInputUrl("");
                  setImg(undefined);
                  setPreview("")}}
                className="px-3 py-1 font-medium border-2 border-slate-300 dark:border-slate-700 rounded-lg dark:text-accent-dark text-accent-light"
                >
                  Close Preview
                </button>
                }
                <button
                onClick={
                  ()=>{
                    const toastId = toast.loading("Uploading Image...");
                    if(img || inputUrl)
                      {
                        if(img)
                          {
                            handleSupabase(img,postId).then((url)=>{
                            setCoverPicture(url!);
                            toast.dismiss(toastId);
                            toast.success("Image Uploaded");
                            }).catch((err)=>{
                              toast.dismiss(toastId);
                              toast.error(`${err}`);
                            })
                          }
                          else if(inputUrl)
                          {
                            toast.dismiss(toastId);
                            toast.success("Image Uploaded");
                            setCoverPicture(inputUrl);
                          }
                          setShowModal(false);
                      }
                      else{
                        return toast.error("Please select an image or enter an image URL");
                      }
                  }
                }
                className="px-3 py-1 font-medium bg-accent-light dark:bg-accent-dark rounded-lg
                text-text-light dark:text-text-dark
                ">
                  Upload Image
                </button>
            </div>
          </div>
        </Modal>
      )}
      <div className="flex justify-center">
      <div className="text-slate-700 dark:text-slate-300 flex w-[80vw]">
        <div className="flex flex-col gap-4 h-fit sticky top-10">
          <div>Category</div>
          <div>Tags</div>
          <div className="flex flex-col gap-3">
            Excerpt
            <textarea
              className="px-3 py-1 caret-slate-500 bg-inherit outline-none border border-slate-300 dark:border-slate-700 rounded-sm"
              maxLength={200}
            ></textarea>
            <button className="rounded-3xl px-3 py-1 dark:bg-primary-light bg-primary-dark  ">
              Generate with AI
            </button>
          </div>
        </div>
        <div className=" dark:text-slate-300 text-slate-700 px-8 py-6 ">
          <div className="flex justify-between text-sm font-semibold dark:text-slate-300 text-slate-700
          items-baseline">
            {
            !coverPicture?
            <button
              onClick={() => setShowModal(true)}
              className="rounded-3xl bg-transparent dark:hover:bg-slate-800 hover:bg-slate-200 px-2 py-0.5 flex gap-2 items-center"
            >
              <img
                src="/assets/image.png"
                className="size-4 dark:invert opacity-75"
              />
              Add Cover
            </button>
            :
            <div className="flex flex-col relative">

              <img src={coverPicture} className="w-[750px] h-fit object-cover rounded-md peer"/>
              <button
                onClick={() => setCoverPicture("")}
                className="rounded-3xl bg-transparent px-2 py-0.5 items-center w-fit  text-slate-800 opacity-0 peer-hover:opacity-100 absolute top-2 right-2 hover:opacity-100 hover:text-red-600"
              >
                Remove Cover
              </button>
            </div>
            }

          </div>
          <div className="py-4">
            <input
              type="text"
              placeholder="Article Title..."
              className="w-full text-3xl font-bold bg-transparent outline-none"
            />
          </div>
          <Tiptap setEditor={setEditor} setItems={setItems} />
        </div>
        <div className="flex flex-col sticky h-fit top-10 my-10 gap-5">
        <div className="flex gap-2 items-center text-sm font-medium">
              <p >
                <span className="dark:text-primary-dark text-primary-light">
                  {characterCount}
                </span>{" "}
                Words
              </p>
              <button
                className="rounded-3xl border-2 border-slate-300 dark:border-slate-700
          dark:text-primary-dark text-primary-light px-2 py-1 "
              >
                Save Draft
              </button>
              <button className="rounded-3xl dark:bg-primary-light bg-primary-dark px-2 py-1 ">
                Publish
              </button>
            </div>
            <MemorizedToC items={items} editor={editor!}/>
        </div>
      </div>
      </div>
    </>
  );
};
