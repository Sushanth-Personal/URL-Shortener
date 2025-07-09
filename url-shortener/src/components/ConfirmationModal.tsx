"use client";

import { useUserContext } from "@/contexts/UserContext";
import { ReactNode } from "react";

// Define props interface for the wrapped component
interface ModalContentProps {
  [key: string]: any; // Allow any additional props to be passed to WrappedComponent
}

// Define the HOC type
interface ConfirmationModalProps {
  WrappedComponent: React.ComponentType<{ children: ReactNode } & ModalContentProps>;
}

const ConfirmationModal = ({ WrappedComponent }: ConfirmationModalProps) => {
  const ModalContent: React.FC<ModalContentProps> = ({ ...props }) => {
    const { setDeleteAccount, modalType, setConfirmDeleteUrl, setShowConfirmationModal } = useUserContext();

    let content: ReactNode = null;

    if (modalType === "deleteAccount") {
      content = (
        <div className="w-full flex flex-col items-center justify-center gap-10 px-14">
          <h1 className="text-2xl font-semibold">Are you sure you want to delete your account?</h1>
          <div className="w-full flex items-center justify-between gap-7">
            <button
              onClick={() => setDeleteAccount(false)}
              className="w-[179px] h-[34px] flex items-center justify-center rounded bg-gray-200 text-black font-semibold text-[1.8rem] hover:brightness-75 hover:scale-[1.02] transition-all"
            >
              No
            </button>
            <button
              onClick={() => setDeleteAccount(true)}
              className="w-[179px] h-[34px] flex items-center justify-center rounded bg-blue-700 text-white font-semibold text-[1.8rem] hover:brightness-125 hover:scale-[1.02] transition-all"
            >
              Yes
            </button>
          </div>
        </div>
      );
    } else if (modalType === "deleteUrl") {
      content = (
        <div className="w-full flex flex-col items-center justify-center gap-10 px-14">
          <h1 className="text-2xl font-semibold">Are you sure, you want to remove it?</h1>
          <div className="w-full flex items-center justify-between gap-7">
            <button
              onClick={() => setShowConfirmationModal(false)}
              className="w-[179px] h-[34px] flex items-center justify-center rounded bg-gray-200 text-black font-semibold text-[1.8rem] hover:brightness-75 hover:scale-[1.02] transition-all"
            >
              No
            </button>
            <button
              onClick={() => setConfirmDeleteUrl(true)}
              className="w-[179px] h-[34px] flex items-center justify-center rounded bg-blue-700 text-white font-semibold text-[1.8rem] hover:brightness-125 hover:scale-[1.02] transition-all"
            >
              Yes
            </button>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props}>{content}</WrappedComponent>;
  };

  return ModalContent;
};

export default ConfirmationModal;