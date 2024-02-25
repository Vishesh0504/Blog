import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
interface props {
  children: ReactNode;
  to?: string;
  bool?: boolean;
}

const AnimatedButton = ({ children, to }: props) => {
  return (
    <Link to={to}>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        {children}
      </motion.div>
    </Link>
  );
};

export const ButtonFill = ({ children, bool }: props) => {
  return (
    <button
      className={`rounded-lg px-4 py-2 flex gap-2 items-center justify-center ${bool ? "bg-secondary-light" : "bg-secondary-dark"}`}
    >
      {children}
    </button>
  );
};

export const ButtonBorder = ({ children, bool }: props) => {
  return (
    <button
      className={`rounded-lg px-4 py-2 border-2 flex gap-2 items-center justify-center ${bool ? "border-secondary-light" : "border-secondary-dark"}`}
    >
      {children}
    </button>
  );
};

export default AnimatedButton;
