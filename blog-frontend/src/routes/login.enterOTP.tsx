import { createFileRoute,useNavigate} from "@tanstack/react-router";
import OtpInput from "react-otp-input";
import {  useEffect, useState,useRef } from "react";
import { useMutation} from "@tanstack/react-query";
import { URL_ORIGIN } from "../constants";
import axios from "axios";
import toast from "react-hot-toast";

export const Route = createFileRoute("/login/enterOTP")({
  component: () => <EnterOTP />,
});
interface TimerProps{
  total:number;
  disabled:boolean;
  setTotal:(totalVal:number)=>void;
  setDisabled:(disabledVal:boolean)=>void;
}
const Timer = ({total,setTotal,setDisabled,disabled}:TimerProps) => {
  const sec = total % 60;
  const min = (total - sec) / 60;

  useEffect(() => {
    console.log(total);
    if (total === 0) {
      setDisabled(false)
    }else{
      const intervalId = setInterval(() => {
      setTotal(total - 1);
    }, 1000);
    return () => clearInterval(intervalId);
    }

  },[setTotal,total,setDisabled]);
  return (
    <>
      {disabled ? (
        <div className="flex gap-1 text-sm">
          <p className="dark:text-accent-dark text-accent-light">
            Valid till :
          </p>
          <p>
            {min}:{sec}
          </p>
        </div>
      ) : null}
    </>
  );
};


const EnterOTP = () => {
  const navigate = useNavigate({from:"/login/enterOTP"});
  const [disabled, setDisabled] = useState(true );
  const [otp, setOtp] = useState("");
  const [fetchedTTL, setFetchedTTL] = useState(false);
  const mutation = useMutation({
    mutationFn: (data) => {
      return axios.post(`${URL_ORIGIN}/auth/local/verifyOTP`, data);
    },
  });
  const [total, setTotal] = useState(0);
  const toastDisplayed = useRef(false);
  const toastDisplayedResend = useRef(false);
  useEffect(()=>{
    const fetchTTL =async ()=>{
    try{
      const res = await axios.post(`${URL_ORIGIN}/auth/fetchTTL`,{email:localStorage.getItem("email")});
      setTotal(res.data.ttl);
      setFetchedTTL(true);
    }catch(err)
    {
      // console.log(err);
      setDisabled(false);
    }
    }
    fetchTTL();
  })
  console.log(total);
  useEffect(()=>
  {
    console.log("disabled after the useEffect:",disabled);

  },[disabled]);
  useEffect(() => {
    if (!toastDisplayed.current) {
      if (mutation.isPending) {
        toast.loading("Verifying OTP...");
      } else if (mutation.isError) {
        if (mutation.error.response) {
          toast.error(mutation.error.response.data.message);
        } else {
          toast.error(mutation.error.message);
        }
      } else if (mutation.isSuccess) {
        toast.success("OTP verified");
      }
      toastDisplayed.current = true;
    }
    return () => {
      toastDisplayed.current = false;
      toast.dismiss();
    };
  }, [mutation]);

  const mutationResendOTP = useMutation({
    mutationFn: () => {
      const email = localStorage.getItem('email');
      return axios.post(`${URL_ORIGIN}/auth/local/generateOTP`, {email:email});
    },
  });

  useEffect(() => {
    if (!toastDisplayedResend.current) {
      if (mutationResendOTP.isPending) {
        toast.loading("Resending OTP ...");
      } else if (mutationResendOTP.isError) {
        toast.error(`${mutationResendOTP.error.message}`);
      } else if (mutationResendOTP.isSuccess) {
        toast.success(`${mutationResendOTP.data.data.OTP}`);
      }
      toastDisplayedResend.current = true;
    }
    return () => {
      toastDisplayedResend.current = false;
      toast.dismiss();
    };
  }, [mutationResendOTP]);

  return (
    <div className="flex flex-col box-content gap-6 rounded-md py-10 px-12 border-[1px] border-gray-300 dark:border-gray-700 transition ease-in-out duration-300 hover:shadow-login backdrop-blur-md ">
      <button
        onClick={()=>{navigate({to:'/login'})}}
        className="
      border-gray-300 dark:border-gray-700
      rounded-full  px-4 py-2 w-fit border-[1.5px]
       opacity-90 -ml-3 -mt-1"
      >
        <img src={`/assets/left.png`} className="size-6 " />
      </button>
      <p className="font-heading text-xl">Enter OTP:</p>
      <OtpInput
        shouldAutoFocus={true}
        inputStyle=" dark:text-text-dark text-text-light bg-transparent border-b-[1px] border-gray-300 dark:border-gray-700  outline-none box-content px-4 py-2 focus:border-b-2 focus:bg-opacity-90"
        containerStyle="flex gap-4"
        value={otp}
        onChange={setOtp}
        inputType="tel"
        numInputs={6}
        renderInput={(props) => <input {...props} />}
      />
      <div className="flex justify-end">
        <div className="flex-1">
          {fetchedTTL?<Timer total={total} setTotal={setTotal} setDisabled={setDisabled} disabled={disabled}/>:null}
        </div>

        <button
          onClick={()=>{mutationResendOTP.mutate()
          setDisabled(true)
          }}
          disabled={disabled}
          className=" dark:text-accent-dark text-accent-light text-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          Resend OTP
        </button>
      </div>
      <button
        onClick={() => {
          mutation.mutate({ email: localStorage.getItem("email"), otp: otp });
        }}
        className="rounded-lg px-20 py-3 dark:bg-accent-dark bg-accent-light text-lg bg-opacity-65 transition hover:scale-105"
      >
        Submit OTP
      </button>
    </div>
  );
};
