import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import AnimatedButton from "./AnimatedButton";
const LoginCard = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <div className="flex flex-col box-content gap-4 rounded-md py-10 px-14 border-[1px] border-gray-300 dark:border-gray-700 shadow-login backdrop-blur-md justify-center items-center ">
      <div className="font-heading text-2xl mb-2">Log In or Sign Up</div>
      <div className="flex flex-col gap-4 max-lg:flex-row">
        <AnimatedButton>
          <button className="flex gap-2 border-[1px] dark:border-gray-600 border-gray-300 px-12 py-4 rounded-full max-lg:px-8">
            <img src="/assets/google.png" className="size-6" />
            <p className="max-lg:hidden">Continue with Google</p>
          </button>
        </AnimatedButton>
        <AnimatedButton>
          <button className="flex gap-2 border-[1px] dark:border-gray-600 border-gray-300 px-12 py-4 rounded-full max-lg:px-8">
            <img src={`/assets/github-${theme}.png`} className="size-6" />
            <p className="max-lg:hidden">Continue with Github</p>
          </button>
        </AnimatedButton>
      </div>

      <div className="flex justify-center items-center gap-2 dark:text-gray-400 text-gray-500 ">
        <hr className="w-28 dark:border-gray-600 border-gray-300"></hr>
        or
        <hr className="w-28 dark:border-gray-600 border-gray-300"></hr>
      </div>
      <div className="">
        <input
          placeholder="Enter your Email"
          className="outline-none border-[1px] dark:border-gray-600 border-gray-300 rounded-lg px-5 py-3 bg-transparent caret-accent-light"
        />
      </div>
      <AnimatedButton>
        <button className="rounded-lg px-20 py-3 dark:bg-accent-dark bg-accent-light text-lg bg-opacity-65">
          Send OTP
        </button>
      </AnimatedButton>
    </div>
  );
};

export default LoginCard;
