// utils/fetcher.ts
import axios from "axios";

export const fetcherWithToken = async (url: string, token: string) => {
  const response = await axios.get(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
