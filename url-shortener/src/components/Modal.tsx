"use client";

import { createPortal } from "react-dom";
import { CSSProperties, ReactNode, useEffect, useState } from "react";

// Define props interface
interface ModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  modalType: "deleteAccount" | "deleteUrl" | "createNew" | "edit" | null; // Added modalType
  children: ReactNode;
  headerStyle?: CSSProperties;
  closeButtonStyle?: CSSProperties;
  windowStyle?: CSSProperties;
}

const Modal: React.FC<ModalProps> = ({
  show,
  onClose,
  title,
  children,
  headerStyle,
  closeButtonStyle,
  windowStyle,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  // Ensure the component only renders on the client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Return null if not mounted or not shown
  if (!isMounted || !show) return null;

  // Find the modal-root element
  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) {
    console.error("Modal root element not found. Please add <div id='modal-root'></div> to your root layout.");
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-[1000]">
      <div
        className="bg-white w-[540px] max-w-[80%] max-h-[80%] shadow-lg flex flex-col items-center justify-start rounded-tl-[12px] rounded-bl-[12px]"
        style={windowStyle}
      >
        <div
          className="flex justify-between items-center bg-[#3B3C51] w-full h-[55px]"
          style={headerStyle}
        >
          <h2 className="text-white text-[1.8rem] font-bold ml-5 sm:text-[1.4rem]">{title}</h2>
          <button
            className="bg-transparent border-none text-white text-2xl cursor-pointer mr-5 hover:scale-110 hover:brightness-125 transition-transform sm:text-[1.4rem]"
            style={closeButtonStyle}
            onClick={onClose}
          >
            X
          </button>
        </div>
        <div className="w-full h-[600px] p-5 pt-0 flex flex-col items-start justify-between">
          {children}
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;