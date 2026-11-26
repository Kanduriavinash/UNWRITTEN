import React from 'react';

interface VerifiedBadgeProps {
  size?: number;
  className?: string;
  showLabel?: boolean;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  size = 14,
  className = '',
  showLabel = false
}) => {
  return (
    <span
      className={`verified-id-pill ${className}`}
      title="Verified Amrita Student ID Card ✓"
      aria-label="Verified Amrita Student ID Card"
    >
      <span
        className="white-tick-black-circle"
        style={{ width: `${size + 4}px`, height: `${size + 4}px` }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 12.5L9.5 17L19 7"
            stroke="#ffffff"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {showLabel && <span className="verified-text">ID Verified</span>}
    </span>
  );
};
