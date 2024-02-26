import { createFileRoute } from "@tanstack/react-router";
import Lottie from "lottie-react";
import animationData from "../Animations/Animation - login.json";
import LoginCard from "../components/LoginCard";
export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  return (
    <div
      className={`py-24 px-32 flex gap-12 dark:text-text-dark text-text-light  dark:divide-gray-600 divide-gray-300 items-center justify-between max-xl:px-32 max-lg:px-24 max-lg:py-16 max-md:p-12`}
    >
      <div className="w-1/2 ">
        <Lottie animationData={animationData} className="max-sm:hidden" />
      </div>

      <div className="">
        <LoginCard />
      </div>
    </div>
  );
}
