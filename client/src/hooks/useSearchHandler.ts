//client\src\hooks\useSearchHandler.ts
import { useCallback, useState } from "react";
import { SetURLSearchParams } from "react-router-dom";
import { useDebounce } from "./useDebounce";

type SearchHandlerTypes = {
  setSearchParams: SetURLSearchParams;
};

const useSearchHandler = ({ setSearchParams }: SearchHandlerTypes) => {
  const [search, setSearch] = useState<string>("");

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSearchTerm = e.target.value;
      setSearch(newSearchTerm);
      setSearchParams(prev => {
        const updatedParams = new URLSearchParams(prev);
        if (newSearchTerm) {
          updatedParams.set("q", newSearchTerm);
        } else {
          updatedParams.delete("q");
        }
        updatedParams.set("page", "1");
        return updatedParams;
      });
    },
    [setSearchParams]
  );

  const debounceSearchTerm: string = useDebounce(search, 300);

  return {
    search,
    debounceSearchTerm,
    handleSearch
  };
};

export default useSearchHandler;
