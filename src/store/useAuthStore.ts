import { create } from "zustand";
import Cookies from "js-cookie";

interface useAuthStoreProps {
  token: string;
  isAdmin: boolean; // Changed from "true" | "false" to boolean
  validUntil: string;

  setToken: (token: string) => void;
  setAdmin: (isAdmin: boolean) => void; // Changed parameter type to boolean
  setValidUntil: (validUntil: string) => void;

  clearToken: () => void;
  clearAdmin: () => void;
  clearValidUntil: () => void;
}

const useAuthStore = create<useAuthStoreProps>((set) => {
  // Read initial values from cookies (if they exist)
  const storedToken = Cookies.get("token") || "0";
  const storedIsAdmin = Cookies.get("isAdmin") === "true";
  const storedValidUntil = Cookies.get("validUntil") || "0";

  return {
    token: storedToken,
    isAdmin: storedIsAdmin,
    validUntil: storedValidUntil,

    setToken: (token: string) => {
      set({ token });
      Cookies.set("token", token, { expires: 7 });
    },

    setAdmin: (isAdmin: boolean) => {
      set({ isAdmin });
      Cookies.set("isAdmin", isAdmin.toString(), { expires: 7 });
    },

    setValidUntil: (validUntil: string) => {
      set({ validUntil });
      Cookies.set("validUntil", validUntil, { expires: 7 });
    },

    clearToken: () => {
      set({ token: "0" });
      Cookies.remove("token");
    },

    clearAdmin: () => {
      set({ isAdmin: false });
      Cookies.remove("isAdmin");
    },

    clearValidUntil: () => {
      set({ validUntil: "0" });
      Cookies.remove("validUntil");
    },
  };
});

export default useAuthStore;