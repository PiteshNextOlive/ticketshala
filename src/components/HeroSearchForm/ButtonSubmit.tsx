import React from "react";
import { FC } from "react";

export interface ButtonSubmitProps {
  onClick: () => void;
  page?: any;
}

const ButtonSubmit: FC<ButtonSubmitProps> = ({ onClick, page }) => {
  return (
    <button
      onClick={() => onClick && onClick()}
      className="lg:h-14 h-10 md:h-16 rounded-full search-btn bg-red-700 hover:bg-red-500 flex items-center justify-center focus:outline-none"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <span className="mr-3 ml-1 md text-xl">{(page && page === 'page2') ? 'Modify Search' : 'Search'}</span>

    </button>
  );
};

export default ButtonSubmit;
