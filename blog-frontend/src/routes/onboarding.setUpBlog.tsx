import { useState, useEffect, useContext } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Formik, Form, Field } from "formik";
import { useMutation } from "@tanstack/react-query";
import { URL_ORIGIN } from "../constants";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { ThemeContext } from "../context/ThemeContext";

export const Route = createFileRoute("/onboarding/setUpBlog")({
  component: () => <SetUpBlog />,
});

interface data {
  blogName: string;
  aboutBlog: string;
  aboutAuthor: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  github: string;
}

function SetUpBlog() {
  const mutation = useMutation({
    mutationFn: (values: data) => {
      return axios.post(`${URL_ORIGIN}/blog/createBlog`, values, {
        withCredentials: true,
      });
    },
  });
  const [aboutAuthor, setAboutAuthor] = useState("");
  const [aboutBlog, setAboutBlog] = useState("");
  const { bool } = useContext(ThemeContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (mutation.isPending) {
      toast.loading("Creating Blog");
    } else if (mutation.isError) {
      if (mutation.error instanceof AxiosError) {
        if (mutation.error.response) {
          toast.error(mutation.error.response.data.message);
        }
      } else {
        toast.error(mutation.error.message);
      }
    } else if (mutation.isSuccess) {
      toast.success(mutation.data?.data.message);
      setTimeout(() => {
        navigate({ to: "/dashboard" });
      }, 1000);
    }

    return () => toast.dismiss();
  }, [mutation, navigate]);

  return (
    <div className="py-16 text-text-light dark:text-text-dark flex justify-center">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl font-semibold">Create Blog</h1>
        </div>
        <Formik
          initialValues={{
            blogName: "",
            aboutBlog: "",
            aboutAuthor: "",
            twitter: "",
            instagram: "",
            linkedin: "",
            github: "",
          }}
          onSubmit={async (values) => {
            values = { ...values, aboutAuthor, aboutBlog };

            mutation.mutate(values);
          }}
        >
          <Form>
            <div className="flex divide-x-2 border-y-2 py-8 font-content border-gray-300 dark:border-gray-500 text-gray-800 dark:text-gray-300 font-semibold dark:divide-gray-600 divide-gray-300">
              <div className="flex flex-col gap-6 mx-5">
                <div className="flex flex-col gap-2">
                  <label className=" ">
                    Blog Name <span className="text-red-600">*</span> :
                  </label>
                  <Field
                    name="blogName"
                    placeholder="Enter name of the blog"
                    className=" w-fit outline-none border-[1px] rounded-lg px-4 py-2 text-text-light dark:text-text-dark bg-transparent caret-accent-light dark:border-gray-600 border-gray-300"
                  />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label className="">
                    About Blog<span className="text-red-600">*</span>:
                  </label>
                  <textarea
                    name="aboutBlog"
                    placeholder="Enter about your blog"
                    value={aboutBlog}
                    onChange={(e) => {
                      setAboutBlog(e.target.value);
                    }}
                    className=" h-full outline-none border-[1px] rounded-lg px-4 py-2 bg-transparent dark:border-gray-600 border-gray-300 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="flex flex-col px-10 gap-4">
                <div className="flex flex-col gap-2">
                  <label className=" text-lg">
                    About Author<span className="text-red-600">*</span>:
                  </label>
                  <textarea
                    name="aboutAuthor"
                    placeholder="About Author"
                    value={aboutAuthor}
                    onChange={(e) => {
                      setAboutAuthor(e.target.value);
                    }}
                    className=" w-full outline-none border-[1px] rounded-lg px-4 py-2 bg-transparent dark:border-gray-600 border-gray-300 disabled:cursor-not-allowed"
                  />
                </div>
                <h2 className="text-lg">Enter Socials</h2>
                <div className="flex gap-4">
                  <div className="flex flex-col gap-2">
                    <div className=" w-fit outline-none border-[1px] rounded-lg px-4 py-2 text-text-light dark:text-text-dark bg-transparent caret-accent-light dark:border-gray-600 border-gray-300 divide-x-0 flex gap-2 items-center">
                      <img
                        src="/assets/twitter.png"
                        alt="twitter"
                        className="size-6"
                      />
                      <Field
                        name="twitter"
                        placeholder="X profile"
                        className=" outline-none bg-transparent caret-accent-light "
                      />
                    </div>
                    <div className=" w-fit border-[1px] rounded-lg px-4 py-2 text-text-light dark:text-text-dark  dark:border-gray-600 border-gray-300 divide-x-0 flex gap-2 items-center">
                      <img
                        src="/assets/instagram.png"
                        alt="instagram"
                        className="size-6"
                      />
                      <Field
                        name="instagram"
                        placeholder="Instagram profile"
                        className=" outline-none bg-transparent caret-accent-light "
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className=" w-fit outline-none border-[1px] rounded-lg px-4 py-2 text-text-light dark:text-text-dark bg-transparent caret-accent-light dark:border-gray-600 border-gray-300 divide-x-0 flex gap-2 items-center">
                      <img
                        src="/assets/linkedin.png"
                        alt="twitter"
                        className="size-6"
                      />
                      <Field
                        name="linkedin"
                        placeholder="linkedin profile"
                        className=" outline-none bg-transparent caret-accent-light "
                      />
                    </div>
                    <div
                      className=" w-fit border-[1px] rounded-lg px-4 py-2 text-text-light dark:text-text-dark  dark:border-gray-600 border-gray-300 divide-x-0 flex gap-2
                    items-center"
                    >
                      <img
                        src={
                          !bool
                            ? "/assets/github-dark.png"
                            : "/assets/github-light.png"
                        }
                        alt="instagram"
                        className="size-6"
                      />
                      <Field
                        name="github"
                        placeholder="Github profile"
                        className=" outline-none bg-transparent caret-accent-light "
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="mt-4 flex rounded-xl dark:bg-secondary-dark bg-secondary-light px-4 py-3 ml-auto disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
