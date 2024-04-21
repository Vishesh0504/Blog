import React, { useEffect, useRef} from "react";
interface ModalProps {
  isOpen: boolean;
  setIsOpen:(isOpen:boolean)=>void;
  children: React.ReactNode;

}

const Modal: React.FC<ModalProps> = ({ isOpen, setIsOpen, children}) => {
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
    {isOpen && <div className="fixed h-screen w-full backdrop-opacity-25" onClick={handleCloseModal}></div>}
    <dialog ref={modalRef} onKeyDown={handleKeyDown} className="flex flex-col gap-3 px-8 py-6 rounded-md bg-inherit border-2 border-slate-300 dark:border-slate-700 ">
      <button className="modal-close-btn" onClick={handleCloseModal}>
        <img src="/assets/close.png" className="size-5 dark:invert opacity-50 flex ml-auto"/>
      </button>
      {children}
    </dialog>
    </>
  );
};

export default Modal;
