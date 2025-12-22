import { create } from "zustand";
import Cookies from "js-cookie";
import axios from "axios";
import { apiUrl } from "@/utils/env";

interface useAuthStoreProps {
  token: string;
  isAdmin: boolean; // Changed from "true" | "false" to boolean
  validUntil: string;
  isValidToken: boolean;
  isCheckingToken: boolean;

  setToken: (token: string) => void;
  setAdmin: (isAdmin: boolean) => void; // Changed parameter type to boolean
  setValidUntil: (validUntil: string) => void;

  clearToken: () => void;
  clearAdmin: () => void;
  clearValidUntil: () => void;

  setIsValidToken: (isValid: boolean) => void;
  checkToken: () => Promise<void>;
  setIsCheckingToken: (checking: boolean) => void;
}

const useAuthStore = create<useAuthStoreProps>((set, get) => {
  // Read initial values from cookies (if they exist)
  const storedToken = Cookies.get("token") || "0";
  const storedIsAdmin = Cookies.get("isAdmin") === "true";
  const storedValidUntil = Cookies.get("validUntil") || "0";

  return {
    token: storedToken,
    isAdmin: storedIsAdmin,
    validUntil: storedValidUntil,
    isValidToken: true,
    isCheckingToken: false,

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

    setIsValidToken: (isValid: boolean) => set({ isValidToken: isValid }),
    setIsCheckingToken: (checking: boolean) =>
      set({ isCheckingToken: checking }),

    async checkToken() {
      set({ isCheckingToken: true });
      const token = get().token;
      try {
        const res = await axios.get(`${apiUrl}/api/v1/dashboard/members`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        set({ isValidToken: res.status === 200 });
      } catch {
        set({ isValidToken: false });
      } finally {
        set({ isCheckingToken: false });
      }
    },
  };
});

export default useAuthStore;
