import { createFileRoute } from '@tanstack/react-router'
import OtpInput from 'react-otp-input';
import {useEffect, useState} from 'react';
import {useMutation} from '@tanstack/react-query';
import { URL_ORIGIN } from '../constants';
import axios from 'axios';
import toast from 'react-hot-toast';

export const Route = createFileRoute('/login/enterOTP')({
  component: () => <EnterOTP/>
})

  const EnterOTP = () =>{
  const [otp, setOtp] = useState('');
    const mutation = useMutation({
      mutationFn:(data)=>{
        return axios.post(`${URL_ORIGIN}/auth/local/verifyOTP`,data)
      },
      onError:(error)=>{

      }
    })

    useEffect(()=>{

    if(mutation.isPending){
      toast.loading('Verifying OTP...');
    }else if(mutation.isError)
    {
      console.log(mutation.data);
      // toast.error();
      toast.error(mutation.error.response.data.message);
      // const errorMessage =Error.response.data.message;
      // toast.error(errorMessage)
    }else if(mutation.isSuccess)
    {
      toast.success("OTP verified");
    }
    return ()=>toast.dismiss();
    },[mutation])
  return(
    <div className='flex flex-col box-content gap-6 rounded-md py-10 px-14 border-[1px] border-gray-300 dark:border-gray-700 transition ease-in-out duration-300 hover:shadow-login backdrop-blur-md justify-center'>
      <p className='font-heading text-xl'>Enter OTP:</p>
      <OtpInput
      shouldAutoFocus={true}
      inputStyle=' dark:text-text-dark text-text-light bg-transparent border-b-[1px] border-gray-300 dark:border-gray-700  outline-none box-content px-4 py-2 focus:border-b-2 focus:bg-opacity-90'
      containerStyle='flex gap-4'
      value={otp}
      onChange={setOtp}
      inputType='tel'
      numInputs={6}
      renderInput={(props) => <input {...props} />}
    />
    <button
    onClick={()=>{
      console.log('hello')
      mutation.mutate({email:localStorage.getItem('email'), otp:otp })}}
    className="rounded-lg px-20 py-3 dark:bg-accent-dark bg-accent-light text-lg bg-opacity-65 transition hover:scale-105">
      Submit OTP
    </button>
    </div>
  )
}