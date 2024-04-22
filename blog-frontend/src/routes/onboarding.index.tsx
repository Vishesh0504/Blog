import { useContext, useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Formik, Form, Field } from "formik";
import { AuthContext } from "../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { URL_ORIGIN } from "../constants";
import axios, { AxiosError } from "axios";
import { createClient } from "@supabase/supabase-js";
import toast from "react-hot-toast";

export const Route = createFileRoute("/onboarding/")({
  component: () => <Onboarding />,
});
const Onboarding = () => {
  const supabaseUrl = import.meta.env.VITE_supabase_url;
  const supabaseKey = import.meta.env.VITE_supabase_public;
  interface data {
    name?: string;
    imgURL?: string;
  }
  const [picture, setPicture] = useState("");
  const [custom, setCustom] = useState(false);
  const [imgURL, setImgURL] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const mutationUpload = useMutation({
    mutationFn: (values: data) => {
      return axios.post(`${URL_ORIGIN}/auth/updateProfile`, values, {
        withCredentials: true,
      });
    },
  });
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCustom(true);
    if (event.target.files) {
      const file = event.target?.files[0];
      await handleSupabase(file);
    }
  };

  const retrievePublicURL = async (fullPath: string) => {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data } = await supabase.storage
      .from("ProfilePicturesBlog")
      .getPublicUrl(fullPath);
    setImgURL(data.publicUrl);
  };
  const handleSupabase = async (file: File) => {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const id = user?.id;
    const extension = file.type.split("/")[1];
    const toastId = toast.loading("Uploading Image");
    try {
      const { data, error } = await supabase.storage
        .from("ProfilePicturesBlog")
        .upload(`${id}.${extension}`, file, { upsert: true });

      if (error) {
        throw error;
      } else {
        // console.log(data);
        setPicture(URL.createObjectURL(file));
        toast.dismiss(toastId);
        toast.success("Image Uploaded successfully");
        retrievePublicURL(data.path);
      }
    } catch (err: unknown) {
      console.log(err);
      if (err instanceof Error) {
        console.log(err);
        toast.dismiss(toastId);
        toast.error(`We are facing some error,Please try again`);
      }
    }
  };

  useEffect(() => {
    if (user && user.picture && !custom) {
      setPicture(user.picture);
    }
  }, [user, picture, custom]);

  useEffect(() => {
    if (mutationUpload.isPending) {
      toast.loading("Updating user");
    } else if (mutationUpload.isError) {
      if (mutationUpload.error instanceof AxiosError) {
        if (mutationUpload.error.response) {
          toast.error(mutationUpload.error.response.data.message);
        }
      } else {
        toast.error(mutationUpload.error.message);
      }
    } else if (mutationUpload.isSuccess) {
      toast.success(mutationUpload.data?.data.message);
      setTimeout(() => {
        navigate({ to: "/onboarding/role" });
      }, 1000);
    }

    return () => toast.dismiss();
  }, [mutationUpload, navigate]);

  return (
    <div className="py-8 text-text-light dark:text-text-dark flex justify-center">
      <div className="w-fit flex flex-col gap-10 px-16 py-12">
        <div className="flex flex-col gap-2">
          <p className="dark:text-neutral-400 text-neutral-600 font-semibold ">
            Step 1: Create your account
          </p>
          <h1 className="font-heading text-3xl font-semibold mb-2">
            User Onboarding
          </h1>
          <div className="flex gap-2">
            <hr className="w-2/3 border-4 rounded-md border-accent-dark opacity-75"></hr>
            <hr className="w-1/3 border-4 rounded-md dark:border-gray-600 border-gray-300"></hr>
          </div>
        </div>
        <Formik
          initialValues={{
            name: user?.name,
          }}
          onSubmit={async (values) => {
            let data: data;
            if (custom || values) {
              if (values.name && values.name?.length > 0) {
                data = { name: values.name };
              } else {
                toast.error("name is required");
                return;
              }
              if (custom && imgURL) {
                data = { ...data, imgURL: imgURL };
              }
              mutationUpload.mutate(data);
            } else {
              navigate({ to: "/onboarding/role" });
            }
          }}
        >
          <Form>
            <div className="flex flex-1 flex-col gap-6 border-y-2 py-8 font-content border-gray-300 dark:border-gray-500 ">
              <div className="flex flex-col gap-2">
                <h1 className="font-heading text-3xl font-semibold">
                  Create your account
                </h1>
                <p className="ml-2"> Let's git init your journey</p>
              </div>

              <div className="flex flex-1 gap-40 text-gray-800 dark:text-gray-300 font-semibold mx-5">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className=" ">
                      Full Name <span className="text-red-600">*</span> :
                    </label>
                    <Field
                      name="name"
                      placeholder="Enter your name"
                      className=" w-fit outline-none border-[1px] rounded-lg px-4 py-2 text-text-light dark:text-text-dark bg-transparent caret-accent-light dark:border-gray-600 border-gray-300"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="">
                      Email Address <span className="text-red-600">*</span>:
                    </label>
                    <input
                      disabled
                      value={user?.email || ""}
                      className=" w-fit outline-none border-[1px] rounded-lg px-4 py-2 bg-transparent dark:border-gray-600 border-gray-300 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-6 -mt-10">
                  <p className="flex-1 "> Profile Picture :</p>
                  <div className="relative border-10 dark:border-gray-600 border-gray-300 rounded-full ml-10">
                    {picture ? (
                      <img className="rounded-full size-40" src={picture} />
                    ) : (
                      <img
                        className="rounded-full size-40"
                        src="/assets/profilePictureStock.webp"
                      />
                    )}
                    <label className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50rounded-full opacity-0 transition-opacity duration-300 cursor-pointer hover:opacity-70 rounded-full">
                      <img
                        src="/assets/image_upload.png"
                        className="size-16 invert"
                      />
                      Upload Image
                      <input
                        className="hidden"
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          handleImageUpload(event);
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={mutationUpload.isPending}
                className="mt-4 w-fit rounded-xl dark:bg-secondary-dark bg-secondary-light px-4 py-3 ml-auto disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};
