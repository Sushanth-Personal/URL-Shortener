"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useUserContext } from "@/contexts/UserContext";
import Image from "next/image"; // Import Image component

// Define props interface
interface CustomDatePickerProps {
  handleDateSelection: (date: Date) => void;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ handleDateSelection }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { expirySwitch } = useUserContext();

  const handleChange = (date: Date) => {
    setSelectedDate(date);
    // Call the function passed as a prop with the date
    if (handleDateSelection) {
      handleDateSelection(date);
    }
  };

  return (
    <div className="relative flex items-center justify-center w-5 h-5">
      <Image
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 pointer-events-none w-5 h-5"
        src="https://res.cloudinary.com/dtu64orvo/image/upload/v1737710322/Icons_1_jorrgy.png"
        alt="calendar icon"
        width={20} // Matches w-5 (assuming 1rem = 16px, so 5 * 4 = 20px)
        height={20} // Matches h-5
      />
      {expirySwitch ? (
        <DatePicker
          selected={selectedDate}
          onChange={handleChange}
          showTimeSelect
          timeFormat="hh:mm a"
          timeIntervals={15}
          dateFormat="MMM dd, yyyy, hh:mm a"
          disabledKeyboardNavigation
          className="relative pl-7 pr-2.5 py-2.5 bg-transparent border border-black rounded text-base w-full text-left"
        />
      ) : (
        <DatePicker
          disabled
          disabledKeyboardNavigation
          className="relative pl-7 pr-2.5 py-2.5 bg-transparent border border-black rounded text-base w-full text-left"
        />
      )}
    </div>
  );
};

export default CustomDatePicker;