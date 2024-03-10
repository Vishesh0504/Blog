import { Link } from "@tanstack/react-router";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { motion } from "framer-motion";
import AnimatedButton, { ButtonBorder, ButtonFill } from "./AnimatedButton";
import { AuthContext } from "../context/AuthContext";
const Navbar = () => {
  const variants = {
    light: {
      opacity: 0.7,
    },
    dark: {
      opacity: 0.9,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  const { isAuthenticated } = useContext(AuthContext);
  const { setTheme, bool } = useContext(ThemeContext);
  return (
    <div
      className={`flex gap-6 py-4 px-10 backdrop-blur-sm font-content items-center dark:text-text-dark text-text-light}`}
    >
      <div className={`font-[500] text-2xl flex-1 px-12 font-G`}>
        <Link className="font-heading flex gap-2 items-center" to="/">
          <img src="/assets/blog.png" className=" size-10" />
          <p>TheCodeConundrum.tech</p>
        </Link>
      </div>
      <motion.div variants={variants} animate={bool ? "light" : "dark"} layout>
        <button
          className={`size-5 p-3 box-content border-[1px]  rounded-full  border-gray-400  dark:border-gray-700`}
          onClick={() => setTheme(`${bool ? "dark" : "light"}`)}
        >
          {bool ? (
            <img src="/assets/dark.png" />
          ) : (
            <img src="/assets/light.png" />
          )}
        </button>
      </motion.div>
      {isAuthenticated ? (
        <AnimatedButton>
          <ButtonFill>Log Out</ButtonFill>
        </AnimatedButton>
      ) : (
        <>
          <AnimatedButton to={"/login"}>
            <ButtonBorder>Log In</ButtonBorder>
          </AnimatedButton>

          <AnimatedButton to={"/login"}>
            <ButtonFill>Sign Up</ButtonFill>
          </AnimatedButton>
        </>
      )}
    </div>
  );
};

export default Navbar;
