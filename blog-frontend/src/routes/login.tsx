import { createFileRoute } from "@tanstack/react-router";
import Lottie from 'lottie-react';
import animationData from "../Animations/Animation - login.json";
import LoginCard from "../components/LoginCard";
export const Route = createFileRoute("/login")({
  component: Login
});


function Login() {
  return(
  <div className={`py-24 px-48 flex gap-12 dark:text-text-dark text-text-light divide-x dark:divide-gray-600 divide-gray-300 items-center`}>
    <div className="w-1/2">
        <Lottie animationData={animationData}/>
    </div>
    <div>
      <LoginCard/>
    </div>

  </div>
  );
}
