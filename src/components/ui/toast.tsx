import React, { useEffect } from "react";
import useToastStore from "@/store/toast/toastSlice";

const Toast: React.FC = () => {
  const { message, type, isVisible, hideToast } = useToastStore();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        hideToast();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, hideToast]);

  if (!isVisible) return null;

  const toastStyle = {
    position: "fixed" as "fixed",
    top: "20px",
    right: "20px",
    padding: "10px",
    borderRadius: "5px",
    color: "white",
    zIndex: 1000,
    backgroundColor: type === "success" ? "green" : "red",
  };

  return (
    <div style={toastStyle}>
      <p>{message}</p>
    </div>
  );
};

export default Toast;
