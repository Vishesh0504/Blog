import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios, { AxiosError } from "axios";
import { URL_ORIGIN } from "../constants";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
export const Route = createFileRoute("/dashboard/")({
  component: () => <Dashboard />,
});
interface blog {
  blog_id: number;
  blog_name: string;
  about_blog: string;
  user_id: number;
}

function Dashboard() {
  const navigate = useNavigate({ from: "/dashboard/" });
  const postMutation = useMutation({
    mutationFn: async () => {
      const toast_id = toast.loading("Creating New Article...");
      try {
        const res = await axios.post(
          `${URL_ORIGIN}/post/createPost`,
          { blog_id: localStorage.getItem("blog_id") },
          { withCredentials: true },
        );
        toast.dismiss(toast_id);
        toast.success(`${res.data.message}`);
        const postId: string = res.data.post_id;
        navigate({ to: `/dashboard/writeArticle/${postId}` as string });
      } catch (err) {
        toast.dismiss(toast_id);
        if (err instanceof AxiosError) {
          toast.error(`${err.response?.data.error}`);
        } else {
          toast.error(`${err}`);
        }
      }
    },
  });

  const { user } = useContext(AuthContext);
  const [blog, setBlog] = useState<blog>();
  const [view, setView] = useState("published");
  // const [posts,setPosts] = useState([]);
  useEffect(() => {
    const fetchDataOnLoad = async () => {
      if (user?.id) {
        try {
          const resBlog = await axios(
            `${URL_ORIGIN}/blog/getBlog/${user?.id}`,
            { withCredentials: true },
          );
          // const resPost = await axios(`{${URL_ORIGIN}/blog/getPosts/${user?.id}`,{withCredentials:true});
          console.log(resBlog);
          setBlog(resBlog.data);
          localStorage.setItem("blog_id", resBlog.data.blog_id);
        } catch (err) {
          console.log(err);
          toast.error(`${err}`);
        }
        // setPosts(resPost.data);
      }
    };
    fetchDataOnLoad();
  }, [user?.id]);
  return (
    <div className="flex justify-center text-text-light dark:text-text-dark">
      <div className="w-2/3 py-10 px-6">
        <h1 className="text-4xl">{blog && blog.blog_name}</h1>
        <div className="flex flex-col gap-1 ml-4 mt-4">
          <h2 className="font-semibold dark:text-secondary-light text-secondary-dark">
            About Blog :
          </h2>
          <p className="">{blog && blog.about_blog}</p>
        </div>
        {/* <hr className="w-full m-4 border border-slate-200 dark:border-slate-500"></hr> */}
        <div className="flex justify-between m-4 mb-2 border-b-2 dark:border-slate-700 border-slate-200 py-3">
          <div className="gap-2 flex font-medium ">
            <button
              onClick={() => setView("published")}
              className={`${view === "published" ? "dark:bg-slate-800 bg-slate-200 dark:text-primary-dark text-primary-light" : ""} rounded-md px-4 py-2`}
            >
              Published
            </button>
            <button
              onClick={() => setView("drafts")}
              className={`${view !== "published" ? "dark:bg-slate-800 bg-slate-200 dark:text-primary-dark text-primary-light" : ""} rounded-md px-4 py-2`}
            >
              Drafts
            </button>
          </div>
          <button
            onClick={async () => {
              await postMutation.mutate();
            }}
            className="bg-secondary-light dark:bg-secondary-dark rounded-lg px-3 py-1 flex gap-2 font-medium items-center h-fit"
          >
            <span className="size-4 text-2xl flex justify-center items-center h-fit">
              +
            </span>
            <p>New article</p>
          </button>
        </div>
      </div>
    </div>
  );
}
