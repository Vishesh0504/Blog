import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
interface props {
  children: ReactNode;
  to?: string;
  onClick?: () => void;
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

export const ButtonFill = ({ children, onClick }: props) => {
  return (
    <button
      onClick={onClick}
      className={`font-medium rounded-lg px-4 py-2 flex gap-2 items-center justify-center bg-secondary-light dark:bg-secondary-dark}`}
    >
      {children}
    </button>
  );
};

export const ButtonBorder = ({ children }: props) => {
  return (
    <button
      className={`rounded-lg px-4 py-2 border-2 flex gap-2 items-center justify-center border-secondary-light dark:border-secondary-dark }`}
    >
      {children}
    </button>
  );
};

export default AnimatedButton;
