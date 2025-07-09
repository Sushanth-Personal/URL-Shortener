'use client';
import { createContext, useState, useContext, useMemo, ReactNode } from "react";

// Define the shape of the URL data (consistent with ResultTable.tsx)
interface UrlData {
  _id: string;
  url: string;
  shortUrl: string;
  remarks?: string;
  clicks: number;
  expiry: string | null;
}

// Define the shape of user data (adjust as needed based on your API)
interface UserData {
  [key: string]: any; // Flexible type for user data; refine if you know the structure
}

// Define the context shape
interface UserContextType {
  userId: string | null;
  setUserId: (userId: string | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  userData: UserData;
  setUserData: (userData: UserData) => void;
  editLinkClicked: number;
  setEditLinkClicked: (editLinkClicked: number) => void;
  pageUrlData: UrlData[];
  setPageUrlData: (pageUrlData: UrlData[]) => void;
  closeModal: boolean;
  setCloseModal: (closeModal: boolean) => void;
  refreshData: boolean;
  setRefreshData: (refreshData: boolean) => void;
  deleteAccount: boolean;
  setDeleteAccount: (deleteAccount: boolean) => void;
  showConfirmationModal: boolean;
  setShowConfirmationModal: (showConfirmationModal: boolean) => void;
  confirmDeleteUrl: boolean;
  setConfirmDeleteUrl: (confirmDeleteUrl: boolean) => void;
  modalType: string | null;
  setModalType: (modalType: string | null) => void;
  expirySwitch: boolean;
  setExpirySwitch: (expirySwitch: boolean) => void;
  clearModal: boolean;
  setClearModal: (clearModal: boolean) => void;
  linkData: UrlData[];
  setLinkData: (linkData: UrlData[]) => void;
}

// Create the context with an undefined default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Define props for the provider
interface UserProviderProps {
  children: ReactNode;
}

// Create a provider component
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData>({});
  const [editLinkClicked, setEditLinkClicked] = useState<number>(0);
  const [pageUrlData, setPageUrlData] = useState<UrlData[]>([]);
  const [closeModal, setCloseModal] = useState<boolean>(false);
  const [refreshData, setRefreshData] = useState<boolean>(false);
  const [deleteAccount, setDeleteAccount] = useState<boolean>(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
  const [confirmDeleteUrl, setConfirmDeleteUrl] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string | null>(null);
  const [expirySwitch, setExpirySwitch] = useState<boolean>(true);
  const [clearModal, setClearModal] = useState<boolean>(false);
  const [linkData, setLinkData] = useState<UrlData[]>([]);

  const value = useMemo(
    () => ({
      userId,
      setUserId,
      isLoggedIn,
      setIsLoggedIn,
      userData,
      setUserData,
      editLinkClicked,
      setEditLinkClicked,
      pageUrlData,
      setPageUrlData,
      closeModal,
      setCloseModal,
      refreshData,
      setRefreshData,
      deleteAccount,
      setDeleteAccount,
      showConfirmationModal,
      setShowConfirmationModal,
      confirmDeleteUrl,
      setConfirmDeleteUrl,
      modalType,
      setModalType,
      expirySwitch,
      setExpirySwitch,
      clearModal,
      setClearModal,
      linkData,
      setLinkData,
    }),
    [
      userId,
      isLoggedIn,
      userData,
      editLinkClicked,
      pageUrlData,
      closeModal,
      refreshData,
      deleteAccount,
      showConfirmationModal,
      confirmDeleteUrl,
      modalType,
      expirySwitch,
      clearModal,
      linkData,
    ]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use the context
export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

// Set a display name for debugging
UserContext.displayName = "UserContext";

export default UserContext;