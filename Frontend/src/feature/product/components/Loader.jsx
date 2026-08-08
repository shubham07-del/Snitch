import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center py-24">
          <svg
            className="w-7 h-7 animate-spin text-muted"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
        </div>
  )
}

export default Loader