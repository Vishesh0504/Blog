import Lottie from "lottie-react";
import animationData from "./Animation - login.json";

const LoadingAnimation = () => {
  return (
    <div>
      <Lottie animationData={animationData} />
    </div>
  );
};

export default LoadingAnimation;
