import React, { useEffect, useRef } from "react";
import {motion} from 'framer-motion';
interface ModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, setIsOpen, children }) => {
  const modalRef = useRef<HTMLDialogElement | null>(null);
  useEffect(() => {
    const modalElement = modalRef.current;
    if (modalElement) {
      if (isOpen) {
        modalElement.showModal();
      } else {
        modalElement.close();
      }
    }
  }, [isOpen]);
  const variants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: "-100vh" },
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "Escape") {
      handleCloseModal();
    }
  };
  return (
    <>
      {isOpen && (
        <motion.div
          initial='closed'
          animate='open'
          exit='closed'
          variants={variants}
          transition={{ duration: 1 }}
          className="fixed h-screen w-full backdrop-opacity-25"
          onClick={handleCloseModal}
        ></motion.div>
      )}
      <dialog
        ref={modalRef}
        onKeyDown={handleKeyDown}
        className="dark:text-slate-300 text-slate-700 px-6 py-4 rounded-md bg-inherit border-2 border-slate-300 dark:border-slate-700 "
      >
        {children}
      </dialog>
    </>
  );
};

export default Modal;
