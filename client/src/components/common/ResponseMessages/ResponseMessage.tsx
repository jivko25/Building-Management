import { useEffect, useState } from "react";
import { ResponseMessageType } from "@/types/response-message/responseMessageTypes";

const ResponseMessage = ({ type, message, duration = 2000, onHide }: ResponseMessageType & { duration?: number; onHide?: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onHide?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, message, onHide]); // Reset timer when message or onHide changes

  if (!isVisible) return null;

  return <div className={`font-medium mt-2 ${type === "success" ? "text-green-600" : "text-red-600"}`}>{message}</div>;
};

export default ResponseMessage;
