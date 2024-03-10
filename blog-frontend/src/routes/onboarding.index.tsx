import { useContext, useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Formik, Form, Field } from "formik";
import { AuthContext } from "../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { URL_ORIGIN } from "../constants";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import toast from "react-hot-toast";

export const Route = createFileRoute("/onboarding/")({
  component: () => <Onboarding />,
});
const Onboarding = () => {
  interface data{
    name?:string;
    url?:string;
  }
  const supabaseUrl = import.meta.env.VITE_supabase_url;
  const supabaseKey = import.meta.env.VITE_supabase_public;
  const [uploadedImage, setUploadedimage] = useState<Blob | string>("");
  const navigate = useNavigate();
  const {user} = useContext(AuthContext);
  const id = user?.id;
  const mutationUpload = useMutation({
    mutationFn: (values: data) => {
      console.log(values);
      return axios.post(`${URL_ORIGIN}/auth/updateProfile`, values, {
        withCredentials: true,
      });
    },
  });
  const [custom, setCustom] = useState(false);
  const [type,setType] = useState("");
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustom(true);
    const file = event.target?.files[0];
    setPicture(URL.createObjectURL(file));
    setUploadedimage(file);
    setType(file.type.split('/')[1]);
  };
  const handleSupabase = async () => {
    const supabase = createClient(supabaseUrl, supabaseKey);
    try {
      const { data, error } = await supabase.storage
        .from("ProfilePicturesBlog")
        .upload(`${id}.${type}`, uploadedImage);
      if (error) {
        throw error;
      } else {
        console.log(data);
        return data.path
      }
    } catch (err) {
      console.log(err);
      toast.error(`error:${err.message},Please try again`);
      return
    }
  };
  const [picture, setPicture] = useState("");
  useEffect(() => {
    if (user && user.picture && !custom) {
      setPicture(user.picture);
    }
  }, [user, picture, custom]);

  return (
    <div className="py-28 text-text-light dark:text-text-dark flex justify-center">
      <Formik
        initialValues={{
          name: user?.name,
        }}
        onSubmit={async (values) => {
          let data:data;
          if (custom || values) {
            if (values.name && values.name?.length > 0) {
              data = {name:values.name};
            }
            else{
              toast.error("name is required");
              return
            }
            if (custom) {
              data = {...data,url:await handleSupabase()};
            }
            mutationUpload.mutate(data);
          } else {
            navigate({ to: "/onboarding/role" });
          }
        }}
      >
        <Form>
          <div className="flex flex-1 flex-col gap-6  border font-content rounded-md border-gray-300 dark:border-gray-700 px-16 py-12">
            <div className="flex flex-col gap-2">
              <h1 className="font-heading text-3xl font-semibold">
                Create your account
              </h1>
              <p className="ml-2"> Let's git init your journey</p>
            </div>

            <div className="flex flex-1 gap-40 text-gray-600 dark:text-gray-400 font-semibold mx-5">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className=" ">Full Name* :</label>
                  <Field
                    name="name"
                    placeholder="Enter your name"
                    className=" w-fit outline-none border-[1px] rounded-lg px-4 py-2 text-text-light dark:text-text-dark bg-transparent caret-accent-light dark:border-gray-600 border-gray-300"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="">Your Email Address* :</label>
                  <input
                    disabled
                    value={user?.email || ""}
                    className=" w-fit outline-none border-[1px] rounded-lg px-4 py-2 bg-transparent dark:border-gray-600 border-gray-300 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <p className="flex-1 "> Profile Picture :</p>
                <div className="relative border-10 dark:border-gray-600 border-gray-300 rounded-full ml-10">
                  {picture ? (
                    <img className="rounded-full size-40" src={picture} />
                  ) : (
                    <img
                      className="rounded-full size-48"
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
              className="mt-4 w-fit rounded-xl dark:bg-secondary-dark bg-secondary-light px-4 py-3 ml-auto"
            >
              Next
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};
