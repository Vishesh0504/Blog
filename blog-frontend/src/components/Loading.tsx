import Lottie from "lottie-react";
import animationData from '../Animations/Animation - loading.json';

const Loading = ({show}:{show?:boolean}) => {
  return (
    <div className={`transition ${show ?? true?'opacity-1 duration-500':'opacity-0'}`}>

        <Lottie animationData={animationData}/>
    </div>
  )
}

export default Loading