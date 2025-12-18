"use client";

import Button from "@mui/material/Button";

export const AppButton = ({
  children,
  variant = "contained",
  color = "primary",
  className = "",
  ...props
}) => {
  // Base classes for all buttons
  let baseClasses = "flex items-center gap-1 px-4 py-2 rounded font-medium transition-all duration-200";

  // Variant styles
  let variantClasses = "";
  if (variant === "contained") variantClasses = "bg-blue-600 text-white hover:bg-blue-700";
  else if (variant === "outlined") variantClasses = "border border-blue-600 text-blue-600 hover:bg-blue-50";
  else if (variant === "text") variantClasses = "text-blue-600 hover:underline";

  // Color overrides
  if (color === "error") variantClasses = "bg-red-500 text-white hover:bg-red-600";
  if (color === "success") variantClasses = "bg-green-500 text-white hover:bg-green-600";

  return (
    <Button {...props} className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </Button>
  );
};
