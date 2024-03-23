import { createFileRoute,useNavigate} from "@tanstack/react-router";
import { useState } from "react";
import { ButtonFill } from "../components/AnimatedButton";
import axios from "axios";
import { URL_ORIGIN } from "../constants";
import toast from "react-hot-toast";

export const Route = createFileRoute("/onboarding/role")({
  component: () => <OnboardingRole />,
});

const OnboardingRole = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const handleNext =async()=>{
    try{
      const res =await axios.post(`${URL_ORIGIN}/auth/updateProfile/setRole`, {role}, {
      withCredentials: true,
      });
    toast.success(`${res.data.message}`);
    // navigate("/write");
    }catch(err)
    {
      toast.error("Something went wrong");
    }


  }
  return (
    <div className="flex justify-center text-text-light dark:text-text-dark">
      <div className="flex flex-col gap-10 w-fit px-16 py-12">
      <div className="flex flex-col gap-2 ">
          <p className="dark:text-neutral-400 text-neutral-600 font-semibold ">Step 2: Choose your role</p>
          <h1 className="font-heading text-3xl font-semibold mb-2">User Onboarding</h1>
          <div className="flex gap-2"><hr className="w-1/3 border-4 rounded-md dark:border-gray-600 border-gray-300"></hr>
            <hr className="w-2/3 border-4 rounded-md border-accent-dark opacity-75"></hr>

          </div>
      </div>
      <div className="flex flex-col gap-4 py-8 border-y-2 border-gray-400 dark:border-gray-500">
        <div className="flex flex-col gap-2 font-medium">
          <h1 className="font-heading text-3xl">What bring's you here</h1>
          <p className="font-content text-neutral-600 dark:text-neutral-400">We will personalize your experience accordingly</p>
        </div>
        <div className="flex flex-col gap-4">
          <button className={`px-8 py-4 rounded-md flex gap-4 items-center border
          ${role === "Writer" ? "border-accent-dark dark:border-accent-dark" : "border-gray-400 dark:border-gray-500"}
   `} onClick={()=>setRole("Writer")}>
            <img src='/assets/write.png' alt="write" className="size-10 dark:invert "/>
            <div className="flex flex-col">
              <h1 className=" text-2xl justify-start">I am a writer</h1>
              <p className="font-content text-neutral-600 dark:text-neutral-400">
                I am here to start a blog and share my knowledge</p>
            </div>
          </button>
          <button className={`px-8 py-4 rounded-md flex gap-4 items-center border ${role ==="Reader" ?"border-accent-dark dark:border-accent-dark" : "border-gray-400 dark:border-gray-500"}`} onClick={()=>setRole("Reader")}>
            <img src='/assets/read.png' alt="write" className="size-10 dark:invert "/>
            <div className="flex flex-col">
              <h1 className=" text-2xl justify-start">I am here to browse and read</h1>
              <p className="font-content text-neutral-600 dark:text-neutral-400">
                I am here to read article and be a part of the community</p>
                <p className="font-content text-neutral-600 dark:text-neutral-400">
                (You can always start your blog later)</p>
            </div>
          </button>
        </div>
        <div className="flex justify-end">
            <ButtonFill onClick={handleNext}>
              Next
            </ButtonFill>
        </div>
      </div>
      </div>
    </div>
  )
  };
