import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const useURLParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearchState] = useState(searchParams.get("search") || "");
  const [page, setPageState] = useState(
    parseInt(searchParams.get("page")) || 1,
  );

  // Update URL when search or page changes
  const updateURL = (newSearch, newPage) => {
    const params = new URLSearchParams();

    if (newSearch) {
      params.set("search", newSearch);
    }

    if (newPage && newPage > 1) {
      params.set("page", newPage.toString());
    }

    setSearchParams(params);
  };

  // Custom setters that also update URL
  const setSearch = (value) => {
    setSearchState(value);
    setPageState(1); // Reset to page 1 on new search
    updateURL(value, 1);
  };

  const setPage = (value) => {
    setPageState(value);
    updateURL(search, value);
  };

  // Read URL params on mount
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    const urlPage = parseInt(searchParams.get("page")) || 1;

    setSearchState(urlSearch);
    setPageState(urlPage);
  }, [searchParams]);

  return {
    search,
    setSearch,
    page,
    setPage,
    updateURL,
  };
};

export default useURLParams;
