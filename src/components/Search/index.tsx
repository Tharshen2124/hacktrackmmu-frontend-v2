import { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "@/utils/env";
import { Member } from "@/types/types";
import { SearchIcon, X } from "lucide-react";

interface SearchComponentProps {
  token: string;
  onSearchResults: (results: Member[], isSearching: boolean) => void;
  onSearchError: (error: any) => void;
}

const SearchComponent = ({
  token,
  onSearchResults,
  onSearchError,
}: SearchComponentProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const searchMembers = async (searchQuery: string, page = 1) => {
    try {
      setIsSearching(true);
      const response = await axios.get(`${apiUrl}/api/v1/members/search`, {
        params: {
          query: searchQuery,
          page: page,
        },
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Search results:", response.data);
      return response.data;
    } catch (error) {
      console.error("Search error:", error);
      throw error;
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (!searchTerm.trim()) {
        onSearchResults([], false);
        return;
      }

      try {
        const results = await searchMembers(searchTerm);
        onSearchResults(results.data || results, true);
      } catch (error) {
        onSearchError(error);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, token]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <div className="search-container relative w-svw rounded-2xl ">
      <SearchIcon className="absolute left-3 top-2 text-gray-500" />
      <input
        type="text"
        placeholder="Search members..."
        value={searchTerm}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="w-full px-12 p-2 border border-gray-300 rounded-md bg-transparent"
      />
      {isSearching && (
        <div className="absolute right-2 top-2">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      )}
      {!isSearching && searchTerm && (
        <X
          className="absolute right-2 top-[9px] text-gray-500 hover:text-blue-500 cursor-pointer"
          onClick={() => {
            setSearchTerm("");
          }}
        />
      )}
    </div>
  );
};

export default SearchComponent;
