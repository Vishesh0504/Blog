import { UseMutationResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useToastForMutation = (
  mutation: UseMutationResult<AxiosResponse<any, any>, Error, void, unknown>,
  flag: number,
) => {
  const toastDisplayed = useRef(false);

  useEffect(() => {
    if (!toastDisplayed.current) {
      if (mutation.isPending) {
        if (!flag) {
          toast.loading("Verifying OTP...");
        } else {
          toast.loading("Sending OTP...");
        }
      } else if (mutation.isError) {
        if (mutation.error.response) {
          toast.error(mutation.error.response.data.message);
        } else {
          toast.error(mutation.error.message);
        }
      } else if (mutation.isSuccess) {
        toast.success(mutation.data.data.message);
      }
      toastDisplayed.current = true;
    }
    return () => {
      toastDisplayed.current = false;
      toast.dismiss();
    };
  }, [mutation, flag]);
};
export default useToastForMutation;
