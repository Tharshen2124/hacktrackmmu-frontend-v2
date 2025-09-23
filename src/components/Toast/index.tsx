import { useEffect } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {

  const TIMEOUT_PERIOD = 3000;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, TIMEOUT_PERIOD);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-600";
      case "error":
        return "bg-red-600";
      case "info":
        return "bg-blue-600";
      default:
        return "bg-gray-600";
    }
  };

  const getProgressBarColor = () => {
    switch (type) {
      case "success":
        return "bg-green-900";
      case "error":
        return "bg-red-900";
      case "info":
        return "bg-blue-900";
      default:
        return "bg-gray-900";
    }
  };

  return (
    <div
      data-toast
      className={`fixed z-50 bottom-8 right-8 px-8 py-4 rounded-md text-white font-semibold ${getTypeStyles()} shadow-lg transition duration-500 ease-in-out overflow-hidden`}
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }} 
          className="ml-4 focus:outline-none border-2 border-transparent hover:border-white rounded-lg"
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black bg-opacity-20">
        <motion.div
          className={`h-full ${getProgressBarColor()}`}
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ 
            duration: TIMEOUT_PERIOD / 1000, 
            ease: "linear" 
          }}
        />
      </div>
    </div>
  );
};

export default Toast;