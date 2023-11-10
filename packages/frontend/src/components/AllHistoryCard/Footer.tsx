import { useState } from "react";
import FooterExpanded from "./FooterExpanded";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

export default function Footer() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="">
      {isExpanded && <FooterExpanded />}

      <div className="flex items-center justify-center p-2">
        <button
          className="text-[#1fc7d4] font-semibold inline-flex items-center gap-3 p-3 hover:brightness-110"
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? "Hide" : "Details"}{" "}
          {isExpanded ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
        </button>
      </div>
    </div>
  );
}
