import styles from "./createnewmodal.module.css";
import Switch from "./Switch";
import DatePicker from "@/components/CustomDatePicker";
import { useState, useEffect } from "react";
import { postUrl, updateUrl } from "@/api/api";
import { useUserContext } from "@/contexts/UserContext";
import { format, parseISO } from "date-fns";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const CreateNewModal = (WrappedComponent) => {
  return function ModalContent({ modalType, ...props }) {
    const [expiry, setExpiry] = useState("Select Expiry Date and Time");
    const [remarks, setRemarks] = useState("");
    const [url, setUrl] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [errors, setErrors] = useState({});

    const {
      pageUrlData,
      editLinkClicked,
      setCloseModal,
      setRefreshData,
      setExpirySwitch,
      expirySwitch,
    } = useUserContext();

    const [data, setData] = useState(pageUrlData[editLinkClicked]);

    useEffect(() => {
      if (data && data.expiry && modalType === "edit") {
        const formattedExpiry = format(parseISO(data.expiry), "MMM dd, yyyy, hh:mm a");
        setExpiry(formattedExpiry);
      }
      if (data && modalType === "edit") {
        setUrl(data.url);
        setShortUrl(data.shortUrl);
        setRemarks(data.remarks);
      }
    }, [data]);

    useEffect(() => {
      if (!expirySwitch) {
        setExpiry("Select Expiry Date and Time");
      }
    }, [expirySwitch]);

    const validateForm = () => {
      const newErrors = {};
      if (!url.trim()) newErrors.url = "Destination URL is required!";
      if (!remarks.trim()) newErrors.remarks = "Remarks are required!";
      if (expirySwitch && expiry === "Select Expiry Date and Time") {
        newErrors.expiry = "Expiry date is required!";
      }
      console.log("newError",newErrors);
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
      if (!validateForm()) return;
      console.log('shortUrl', shortUrl);
      try {
        const response = await updateUrl(shortUrl,url, remarks, expiry);
        if(response.message ==="Shortened URL updated successfully."){
          toast.success("Update Successful ...", {
                  position: "top-right",
                  autoClose: 3000, // Closes toast after 3 seconds
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
        }
        setData(response.data);
        setCloseModal(true);
        setRefreshData(true);
        setRemarks("");
        setExpiry("Select Expiry Date and Time");
        setUrl("");
        
      } catch (error) {
        console.log(error);
      }
    };

    const handleCreateNew = async () => {
      if (!validateForm()) return; // Prevent submission if validation fails
    
      try {
        const response = await postUrl(url, remarks, expiry);
        setUrl("");
        setRemarks("");
        setExpiry("Select Expiry Date and Time");
        setExpirySwitch(true);
        setCloseModal(true);
        setRefreshData(true);
      } catch (error) {
        console.error("Error creating link:", error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          general: "Failed to create link. Please try again.",
        }));
      }
    };
    
    const handleSwitchChange = (state) => {
      setExpirySwitch(state);
    };

    const handleDateSelection = (date) => {
      const formattedDate = format(date, "MMM dd, yyyy, hh:mm a");
      setExpiry(formattedDate);
    };

    let content = (
      <>
        <div className={styles.top}>
  <div className={styles.destinationUrlContainer}>
    <span>
      Destination Url <p>*</p>
    </span>
    <input
      type="url"
      placeholder="Enter URL to be shortened"
      value={url}
      onChange={(e) => setUrl(e.target.value)}
    />
    {errors.url && <p className={styles.error}>{errors.url}</p>}
  </div>
  <div className={`${styles.destinationUrlContainer} ${styles.remarksContainer}`}>
    <span>
      Remarks <p>*</p>
    </span>
    <textarea
      placeholder="Add remarks"
      value={remarks}
      onChange={(e) => setRemarks(e.target.value)}
    />
    {errors.remarks && <p className={styles.error}>{errors.remarks}</p>}
  </div>
  <div className={styles.linkExpiry}>
    <span>Link Expiration</span>
    <Switch initialChecked={expirySwitch} onChange={handleSwitchChange} />
  </div>
  <div className={styles.datePicker}>
    <div className={styles.displayField}>{expiry}</div>
    <div className={styles.datePickerContainer}>
      <DatePicker handleDateSelection={handleDateSelection} />
    </div>
   

  </div>
  {errors.expiry && <p className={`${styles.error} ${styles.expiryError}`}>{errors.expiry}</p>}
  {errors.general && <p className={styles.error}>{errors.general}</p>} {/* General error message */}
</div>

        <div className={styles.actionBar}>
          <button
            className={styles.clearButton}
            onClick={() => {
              setUrl("");
              setRemarks("");
              setExpiry("Select Expiry Date and Time");
              setExpirySwitch(true);
              setErrors({});
            }}
          >
            Clear
          </button>
          <button
            onClick={modalType === "createNew" ? handleCreateNew : handleSave}
            className={styles.createButton}
          >
            {modalType === "createNew" ? "Create new" : "Save"}
          </button>
        </div>
      </>
    );

    return <WrappedComponent {...props}>{content}</WrappedComponent>;
  };
};

export default CreateNewModal;
