//client\src\hooks\useSearchParamsHook.ts
import { useSearchParams } from "react-router-dom";

type UseSearchParamsReturn = {
  setSearchParams: ReturnType<typeof useSearchParams>[1];
  page: number;
  itemsLimit: number;
  searchParam: string;
};

const useSearchParamsHook = (): UseSearchParamsReturn => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = searchParams.get("page");
  const page = pageParam && !Number.isNaN(Number(pageParam)) ? parseInt(pageParam, 10) : 1;
  const itemsLimit: number = 12;
  const searchParam = searchParams.get("q") || "";

  return {
    setSearchParams,
    page,
    itemsLimit,
    searchParam
  };
};

export default useSearchParamsHook;
