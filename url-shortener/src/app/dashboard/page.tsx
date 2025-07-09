"use client";

import { useReducer, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/contexts/UserContext";
import useScreenSize from "@/hooks/useScreenSize";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { logoutUser } from "@/api/api";
import ResultTable from "@/components/ResultTable";
import AnalyticsTable from "@/components/AnalyticsTable";
import BarChart from "@/components/BarChart";
import CreateNewModal from "@/components/CreateNewModal";
import ConfirmationModal from "@/components/ConfirmationModal";
import Modal from "@/components/Modal";
import Image from "next/image"; // Import Image component
// Import ProfileData and BottomUpMenu (uncomment if they exist)
// import ProfileData from "@/components/ProfileData";
// import BottomUpMenu from "@/components/BottomUpMenu";

// Define interface for state
interface DashboardState {
  dashboardActive: boolean;
  linkActive: boolean;
  analyticsActive: boolean;
  settingsActive: boolean;
}

// Define reducer action types
type DashboardAction =
  | { type: "SET_DASHBOARD_ACTIVE" }
  | { type: "SET_LINK_ACTIVE" }
  | { type: "SET_ANALYTICS_ACTIVE" }
  | { type: "SET_SETTINGS_ACTIVE" };

// Initial state
const initialState: DashboardState = {
  dashboardActive: true,
  linkActive: false,
  analyticsActive: false,
  settingsActive: false,
};

// Reducer function
const reducer = (state: DashboardState, action: DashboardAction): DashboardState => {
  switch (action.type) {
    case "SET_DASHBOARD_ACTIVE":
      return {
        dashboardActive: true,
        linkActive: false,
        analyticsActive: false,
        settingsActive: false,
      };
    case "SET_LINK_ACTIVE":
      return {
        dashboardActive: false,
        linkActive: true,
        analyticsActive: false,
        settingsActive: false,
      };
    case "SET_ANALYTICS_ACTIVE":
      return {
        dashboardActive: false,
        linkActive: false,
        analyticsActive: true,
        settingsActive: false,
      };
    case "SET_SETTINGS_ACTIVE":
      return {
        dashboardActive: false,
        linkActive: false,
        analyticsActive: false,
        settingsActive: true,
      };
    default:
      return state;
  }
};

const Dashboard: React.FC = () => {
  const {
    userData,
    setUserData,
    setEditLinkClicked,
    setCloseModal,
    closeModal,
    showConfirmationModal,
    setShowConfirmationModal,
    modalType,
    setModalType,
    setIsLoggedIn,
  } = useUserContext();
  const router = useRouter();
  const tabletSize = useScreenSize(900);
  const mobileHorizontalSize = useScreenSize(600);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const menuButtonRef = useRef<HTMLDivElement>(null);

  const handleCreateNew = () => {
    console.log("Opening CreateNewModal, showModal:", true, "modalType:", "createNew");
    setModalType("createNew");
    setShowModal(true);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsLoggedIn(false);
      setUserData(null);
      toast.success("Logged out!", {
        position: "top-right",
        autoClose: 3000,
      });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleQuery = (query: string) => {
    if (!state.linkActive) dispatch({ type: "SET_LINK_ACTIVE" });
    setQuery(query);
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const getShortForm = (username: string): string => {
    const words = username.trim().split(" ");
    return words.length === 1
      ? words[0][0].toUpperCase()
      : (words[0][0] + words[1][0]).toUpperCase();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowConfirmationModal(false);
    setModalType(null);
  };

  // const handleDeleteAccount = () => {
  //   setShowConfirmationModal(true);
  //   setModalType("deleteAccount");
  // };

  const handleEditLinkClick = (rowId: string) => {
    setModalType("edit");
    setShowModal(true);
    setEditLinkClicked(rowId);
  };

  useEffect(() => {
    const userDataLocal = localStorage.getItem("userData");
    if (userDataLocal) {
      setUserData(JSON.parse(userDataLocal));
    } else {
      router.push("/login");
    }
  }, [router, setUserData]);

  useEffect(() => {
    if (closeModal) {
      setShowModal(false);
      setModalType(null);
      setCloseModal(false);
    }
  }, [closeModal, setCloseModal, setModalType]);

  // Wrap modals with Modal component
  const WrappedCreateNewModal = CreateNewModal(Modal);
  const WrappedConfirmationModal = ConfirmationModal(Modal);

  return (
    <section className="w-screen h-screen bg-white flex">
      {!tabletSize && !mobileHorizontalSize && (
        <div className="flex flex-col items-center w-64 bg-gray-50 h-full">
          <div className="flex items-center justify-center w-full h-12 bg-gray-50 rounded-t-lg">
            <h1 className="font-weight-700 text-2xl font-bold">URL Shortener</h1>
          </div>
          <div className="flex flex-col p-3 pb-4 w-full">
            <button
              onClick={() => dispatch({ type: "SET_DASHBOARD_ACTIVE" })}
              className={`flex items-center p-2.5 text-lg font-semibold text-gray-600 gap-2 hover:text-blue-600 hover:bg-blue-50 rounded-lg ${
                state.dashboardActive ? "text-blue-600 bg-blue-50" : ""
              }`}
            >
              <Image
                src="https://res.cloudinary.com/dtu64orvo/image/upload/v1737624518/Icons_zqiriu.png"
                alt="dashboard"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              Dashboard
            </button>
            <button
              onClick={() => dispatch({ type: "SET_LINK_ACTIVE" })}
              className={`flex items-center p-2.5 text-lg font-semibold text-gray-600 gap-2 hover:text-blue-600 hover:bg-blue-50 rounded-lg ${
                state.linkActive ? "text-blue-600 bg-blue-50" : ""
              }`}
            >
              <Image
                src="https://res.cloudinary.com/dtu64orvo/image/upload/v1737624522/Icon_rahplm.png"
                alt="link"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              Link
            </button>
            <button
              onClick={() => dispatch({ type: "SET_ANALYTICS_ACTIVE" })}
              className={`flex items-center p-2.5 text-lg font-semibold text-gray-600 gap-2 hover:text-blue-600 hover:bg-blue-50 rounded-lg ${
                state.analyticsActive ? "text-blue-600 bg-blue-50" : ""
              }`}
            >
              <Image
                src="https://res.cloudinary.com/dtu64orvo/image/upload/v1737624528/Icon_1_g710hl.png"
                alt="analytics"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              Analytics
            </button>
          </div>
          <div className="p-3 w-full border-t border-b border-gray-200">
            <div
              className={`flex items-center p-3.5 text-lg font-semibold text-gray-600 gap-2 hover:text-blue-600 hover:bg-blue-50 rounded-lg ${
                state.settingsActive ? "text-blue-600 bg-blue-50" : ""
              }`}
            >
              <Image
                src="https://res.cloudinary.com/dtu64orvo/image/upload/v1737624533/Frame_vnitbr.png"
                alt="settings"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              Settings
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col flex-1 h-screen">
        <nav className="w-full h-[72px] flex items-center justify-between px-5 bg-white shadow">
          <div className="flex items-center gap-4">
            {tabletSize && (
              <Image
                src="https://res.cloudinary.com/dtu64orvo/image/upload/v1738152167/download_1_dbcvdx.svg"
                alt="logo"
                width={40}
                height={40}
                className="w-10"
              />
            )}
            {!tabletSize && !mobileHorizontalSize && (
              <div className="flex items-center gap-2">
                <Image
                  src="https://res.cloudinary.com/dtu64orvo/image/upload/v1737634206/%EF%B8%8F_mhduvo.png"
                  alt="goodmorning"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <p className="text-lg">
                  Good morning, {userData?.username || "User"}
                  <span className="block text-sm text-gray-500">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!mobileHorizontalSize && (
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                <Image
                  src="https://res.cloudinary.com/dtu64orvo/image/upload/v1737634367/Frame_1_rq3xx8.png"
                  alt="add"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                Create new
              </button>
            )}
            <div className="relative flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-1">
              <Image
                src="https://res.cloudinary.com/dtu64orvo/image/upload/v1737634977/Frame_2_cs2ror.png"
                alt="search"
                width={20}
                height={20}
                className="w-5 h-5"
              />
              <input
                type="text"
                placeholder="Search by remarks"
                value={query}
                onChange={(e) => handleQuery(e.target.value)}
                className="outline-none"
              />
            </div>
            <div
              ref={menuButtonRef}
              onClick={toggleMenu}
              className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full cursor-pointer"
            >
              {userData?.username ? getShortForm(userData.username) : "SM"}
            </div>
            <button
              onClick={handleLogout}
              className={`px-4 py-2 rounded ${
                isMenuOpen && !tabletSize ? "bg-red-600 text-white" : "text-gray-600"
              }`}
            >
              Logout
            </button>
          </div>
        </nav>
        <div
          className={`flex-1 border-t p-5 bg-gray-50 ${
            state.dashboardActive || state.settingsActive ? "bg-white" : ""
          }`}
        >
          {state.linkActive && (
            <ResultTable handleEditLinkClick={handleEditLinkClick} query={query} />
          )}
          {state.analyticsActive && <AnalyticsTable handleEditLinkClick={handleEditLinkClick} />}
          {state.dashboardActive && <BarChart />}
          {/* Comment out or replace ProfileData until implemented */}
          {/* {state.settingsActive && <ProfileData handleDeleteAccount={handleDeleteAccount} />} */}
          {state.settingsActive && <div>Settings Placeholder</div>} {/* Temporary placeholder */}
        </div>
      </div>
      {showModal && (
        <WrappedCreateNewModal
          show={showModal}
          onClose={handleCloseModal}
          title={modalType === "createNew" ? "New Link" : "Edit Link"}
          modalType={modalType}
        />
      )}
      {showConfirmationModal && (
        <WrappedConfirmationModal
          show={showConfirmationModal}
          onClose={handleCloseModal}
          modalType={modalType}
          headerStyle={{
            backgroundColor: "transparent",
            padding: "20px",
          }}
          closeButtonStyle={{ color: "black" }}
          windowStyle={{
            backgroundColor: "white",
            width: "496px",
            height: "222px",
            borderRadius: "4px",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          }}
        />
      )}
      {mobileHorizontalSize && (
        <button
          onClick={handleCreateNew}
          className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full"
        >
          <Image
            src="https://res.cloudinary.com/dtu64orvo/image/upload/v1737634367/Frame_1_rq3xx8.png"
            alt="add"
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </button>
      )}
      {/* Comment out or replace BottomUpMenu until implemented */}
      {/* {tabletSize && (
        <BottomUpMenu
          options={["Dashboard", "Link", "Analytics", "Settings", "Logout"]}
          dispatch={dispatch}
          isOpen={isMenuOpen}
          setIsOpen={setIsMenuOpen}
          buttonRef={menuButtonRef}
          handles={["", "", "", "", handleLogout]}
        />
      )} */}
      {tabletSize && <div>Menu Placeholder</div>} {/* Temporary placeholder */}
    </section>
  );
};

export default Dashboard;