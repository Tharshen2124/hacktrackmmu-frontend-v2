import { create } from "zustand";
import Cookies from "js-cookie";

interface useAuthStoreProps {
  token: string;
  isAdmin: string;
  validUntil: string;

  setToken: (token: string) => void;
  setAdmin: (isAdmin: string) => void;
  setValidUntil: (validUntil: string) => void;

  clearToken: () => void;
  clearAdmin: () => void;
  clearValidUntil: () => void;
}

const useAuthStore = create<useAuthStoreProps>((set) => {
  // Read initial values from cookies (if they exist)
  const storedToken = Cookies.get("token") || "0";
  const storedIsAdmin = Cookies.get("isAdmin") || "false";
  const storedValidUntil = Cookies.get("validUntil") || "0";

  return {
    token: storedToken,
    isAdmin: storedIsAdmin,
    validUntil: storedValidUntil,

    setToken: (token: string) => {
      set({ token });
      Cookies.set("token", token, { expires: 7 });
    },

    setAdmin: (isAdmin: string) => {
      set({ isAdmin });
      Cookies.set("isAdmin", isAdmin, { expires: 7 });
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
      set({ isAdmin: "false" });
      Cookies.remove("isAdmin");
    },

    clearValidUntil: () => {
      set({ validUntil: "0" });
      Cookies.remove("validUntil");
    },
  };
});

export default useAuthStore;

// tokens given from api last for an hour 
// to check from frontend, making requests ot the backend to verify token can be expensive
// store the validUntil and check it from there. 
// 