import { createFileRoute } from "@tanstack/react-router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { URL_ORIGIN } from "../constants";
import toast from "react-hot-toast";

export const Route = createFileRoute("/dashboard/")({
  component: () => <Dashboard/>,
});
interface blog{
  blog_id:number,
  blog_name:string,
  about_blog:string,
  user_id:number
}

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [blog,setBlog] = useState<blog>();
  // const [posts,setPosts] = useState([]);
  console.log(user?.id);
  useEffect(()=>{



    const fetchDataOnLoad = async()=>{
      if(user?.id)
        {
      try{
      const resBlog = await axios(`${URL_ORIGIN}/blog/getBlog/${user?.id}`,{withCredentials:true});
      // const resPost = await axios(`{${URL_ORIGIN}/blog/getPosts/${user?.id}`,{withCredentials:true});
      console.log(resBlog);
      setBlog(resBlog.data);
      localStorage.setItem('blog_id',resBlog.data.blog_id);
    }
      catch(err){
        console.log(err);
        toast.error(`${err}`);
      }
      // setPosts(resPost.data);
    }}
    fetchDataOnLoad();
  },[user?.id]);

  return (
    <div className="flex justify-center text-text-light dark:text-text-dark">
      <div className="w-2/3 py-10 px-6">
        <h1 className="text-3xl">
          {blog && blog.blog_name}
        </h1>
        <p className="text-lg">
          {blog && blog.about_blog}
        </p>
        <div className="flex ">
            <div>
            <button className="">Published</button>
            <button className="">Drafts</button>
            </div>
            <button>Create new article</button>

        </div>
      </div>
    </div>
  );
}