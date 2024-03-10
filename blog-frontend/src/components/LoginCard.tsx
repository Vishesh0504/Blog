import { ReactNode, useContext, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { URL_ORIGIN } from "../constants";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";

const LoginCard = () => {
  const handleClickOauth = (method: string) => {
    return (window.location.href = `${URL_ORIGIN}/auth/login/${method}`);
  };
  interface EmailProps {
    email: string;
  }
  const navigate = useNavigate({ from: "/login" });
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid Email")
      .required("This field is required"),
  });

  const mutation = useMutation({
    mutationFn: (values: EmailProps) => {
      return axios.post(`${URL_ORIGIN}/auth/local/generateOTP`, values);
    },
  });

  useEffect(() => {
    if (mutation.isPending) {
      toast.loading("Sending OTP ...");
    } else if (mutation.isError) {
      toast.error(`${mutation.error.message}`);
    } else if (mutation.isSuccess) {
      toast.success(`${mutation.data.data.message}`);
      setTimeout(() => {
        navigate({ to: "/login/enterOTP" });
      }, 1000);
    }
    return () => toast.dismiss();
  }, [mutation, navigate]);

  const { theme } = useContext(ThemeContext);
  return (
    <div className="flex flex-col box-content gap-4 rounded-md py-10 px-14 border-[1px] border-gray-300 dark:border-gray-700 transition ease-in-out duration-300 hover:shadow-login backdrop-blur-md justify-center items-center ">
      <div className="font-heading text-2xl mb-2">Log In or Sign Up</div>
      <div className="flex flex-col gap-4 max-lg:flex-row">
        <button
          onClick={() => handleClickOauth("google")}
          className="flex gap-2 border-[1px] dark:border-gray-600 border-gray-300 px-12 py-4 rounded-full max-lg:px-8"
        >
          <img src="/assets/google.png" className="size-6" />
          <p className="max-lg:hidden">Continue with Google</p>
        </button>
        <button
          onClick={() => handleClickOauth("github")}
          className="flex gap-2 border-[1px] dark:border-gray-600 border-gray-300 px-12 py-4 rounded-full max-lg:px-8"
        >
          <img src={`/assets/github-${theme}.png`} className="size-6" />
          <p className="max-lg:hidden">Continue with Github</p>
        </button>
      </div>

      <div className="flex-1 flex justify-center items-center gap-2 dark:text-gray-400 text-gray-500 ">
        <hr className="w-28 dark:border-gray-600 border-gray-300"></hr>
        or
        <hr className="w-28 dark:border-gray-600 border-gray-300"></hr>
      </div>

      <Formik
        initialValues={{ email: "" }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          // console.log(values);
          localStorage.setItem("email", values.email);
          mutation.mutate(values);
        }}
      >
        {({ errors, touched }: FormikProps<EmailProps>) => (
          <Form className="flex-1 flex flex-col gap-3">
            <div>
              <Field
                name="email"
                placeholder="Enter your Email"
                className={` w-fit outline-none border-[1px] rounded-lg px-5 py-3 bg-transparent caret-accent-light ${errors.email ? "border-red-400" : "dark:border-gray-600 border-gray-300"}`}
              />
              <div className="text-red-400 text-sm ml-6 mt-2">
                {errors.email && touched.email ? (
                  <ErrorMessage name="email" />
                ) : null}
              </div>
            </div>
            <button
              type="submit"
              className="flex-1 rounded-lg px-20 py-3 dark:bg-accent-dark bg-accent-light text-lg bg-opacity-65 transition hover:scale-105"
            >
              Send OTP
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginCard;

export const Card = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col box-content gap-4 rounded-md py-10 px-14 border-[1px] border-gray-300 dark:border-gray-700 transition ease-in-out duration-300 hover:shadow-login backdrop-blur-md justify-center items-center">
      {children}
    </div>
  );
};
