"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// Generate a deterministic color based on the company name
const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Use HSL to ensure the color is readable (pastel/vibrant but not too dark/light)
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 70%, 45%)`;
};

interface CompanyLogoProps {
  company: string;
  className?: string;
  fallbackClassName?: string;
}

export const CompanyLogo = ({ company, className, fallbackClassName }: CompanyLogoProps) => {
  const [error, setError] = useState(false);
  const companyName = company || "Company";
  const initial = companyName.charAt(0).toUpperCase();

  // Predict the standard path it would take
  const imagePath = `/icons/${initial}${companyName.slice(1).replace(/\s+/g, '')}.png`;

  if (error) {
    // Render the beautiful fallback Avatar
    return (
      <div
        className={cn("flex items-center justify-center rounded-md shrink-0 shadow-sm", className, fallbackClassName)}
        style={{ backgroundColor: stringToColor(companyName) }}
      >
        <span className="text-white font-bold leading-none text-opacity-90">
          {initial}
        </span>
      </div>
    );
  }

  return (
    <img
      src={imagePath}
      alt={`${companyName} Logo`}
      className={cn("object-contain shrink-0", className)}
      onError={() => setError(true)}
    />
  );
};
