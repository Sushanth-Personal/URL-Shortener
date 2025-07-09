"use client";

import { ReactNode, ComponentType } from "react";
import { useUserContext } from "@/contexts/UserContext";

// Define props interface for the wrapped component
interface ModalContentProps {
  show: boolean;
  onClose: () => void;
  title: string;
  modalType: "deleteAccount" | "deleteUrl" | "createNew" | "edit" | null; // Aligned with ModalProps
  children: ReactNode;
  headerStyle?: React.CSSProperties;
  closeButtonStyle?: React.CSSProperties;
  windowStyle?: React.CSSProperties;
}

// Define the HOC props
interface ConfirmationModalProps {
  WrappedComponent: ComponentType<ModalContentProps>;
}

const ConfirmationModal = ({ WrappedComponent }: ConfirmationModalProps) => {
  const ModalContent: React.FC<ModalContentProps> = ({ show, onClose, title, modalType, ...props }) => {
    const { setDeleteAccount, setConfirmDeleteUrl, setShowConfirmationModal } = useUserContext();

    let content: ReactNode = null;

    if (modalType === "deleteAccount") {
      content = (
        <div className="w-full flex flex-col items-center justify-center gap-10 px-14">
          <h1 className="text-2xl font-semibold">Are you sure you want to delete your account?</h1>
          <div className="w-full flex items-center justify-between gap-7">
            <button
              onClick={() => {
                setShowConfirmationModal(false);
                onClose();
              }}
              className="w-[179px] h-[34px] flex items-center justify-center rounded bg-gray-200 text-black font-semibold text-[1.8rem] hover:brightness-75 hover:scale-[1.02] transition-all"
            >
              No
            </button>
            <button
              onClick={() => {
                setDeleteAccount(true);
                setShowConfirmationModal(false);
                onClose();
              }}
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
              onClick={() => {
                setShowConfirmationModal(false);
                onClose();
              }}
              className="w-[179px] h-[34px] flex items-center justify-center rounded bg-gray-200 text-black font-semibold text-[1.8rem] hover:brightness-75 hover:scale-[1.02] transition-all"
            >
              No
            </button>
            <button
              onClick={() => {
                setConfirmDeleteUrl(true);
                setShowConfirmationModal(false);
                onClose();
              }}
              className="w-[179px] h-[34px] flex items-center justify-center rounded bg-blue-700 text-white font-semibold text-[1.8rem] hover:brightness-125 hover:scale-[1.02] transition-all"
            >
              Yes
            </button>
          </div>
        </div>
      );
    }

    return <WrappedComponent show={show} onClose={onClose} title={title} modalType={modalType} {...props}>{content}</WrappedComponent>;
  };

  return ModalContent;
};

export default ConfirmationModal;