
import { createLazyFileRoute } from "@tanstack/react-router";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { motion } from "framer-motion";
import AnimatedButton, {
  ButtonBorder,
  ButtonFill,
} from "../components/AnimatedButton";
export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const { theme,bool} = useContext(ThemeContext);

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.5,
        duration: 1.3,
        ease: "easeInOut",
      }}
      className={`flex flex-col text-center items-center gap-6 p-24 px-96 max-xl:px-64 max-lg:px-48 dark:text-text-dark text-text-light`}
    >
      <div className="flex flex-col text-[4em] font-heading max-xl:text-4xl max-lg:text-2xl ">
        <p>
          Make your{" "}
          <span
            className={`font-[500] text-transparent bg-clip-text bg-gradient-to-r ${bool ? "from-accent-light to-primary-light" : "from-accent-dark to-primary-dark"}`}
          >
            Blog
          </span>
        </p>
        <p>
          Truly{" "}
          <span
            className={`font-[500] text-transparent bg-clip-text bg-gradient-to-r ${bool ? "from-accent-light to-primary-light" : "from-accent-dark to-primary-dark"}`}
          >
            Yours
          </span>
        </p>
      </div>
      <div className="text-center my-6 font-content text-2xl max-xl:text-xl max-lg:text-base w-[22rem] leading-7">
        Escape the platform prison customize without limits and own your online
        presence
      </div>
      <div className="flex gap-6 max-xl:text-xl max-lg:text-base">
        <AnimatedButton>
          <ButtonBorder >
            <img src={`/assets/discover-${theme}.png`} className="size-5" />
            <p>Discover</p>
          </ButtonBorder>
        </AnimatedButton>
        <AnimatedButton to={'/login'}>
          <ButtonFill >
            <img src={`/assets/edit-${theme}.png`} className="size-5" />
            <p>Write</p>
          </ButtonFill>
        </AnimatedButton>
      </div>
    </motion.div>
  );
}
