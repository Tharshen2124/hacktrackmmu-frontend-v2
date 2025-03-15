import { useEffect } from "react";
import { X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

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

  return (
    <div
      className={`fixed bottom-8 right-8 px-8 py-4 rounded-md text-white font-semibold flex items-center justify-between ${getTypeStyles()} shadow-lg transition duration-500 ease-in-out`}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 focus:outline-none border-2 border-transparent hover:border-white rounded-lg"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default Toast;
