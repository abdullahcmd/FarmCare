import { useState, useEffect, useCallback, useRef } from "react";

export const useApiData = (apiCall, dependencies = [], options = {}) => {
  const { immediate = true, onSuccess, onError, transform } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(
    async (...args) => {
      if (!mountedRef.current) return;

      setLoading(true);
      setError(null);

      try {
        const response = await apiCall(...args);

        if (!mountedRef.current) return;

        let result = response.data;
        if (transform) {
          result = transform(result);
        }

        setData(result);
        setLastFetch(new Date());

        if (onSuccess) {
          onSuccess(result, response);
        }

        return result;
      } catch (err) {
        if (!mountedRef.current) return;

        console.error("API data fetch error:", err);
        setError(err.message || "Failed to fetch data");

        if (onError) {
          onError(err);
        }

        throw err;
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [apiCall, transform, onSuccess, onError]
  );

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  const mutate = useCallback((newData) => {
    if (typeof newData === "function") {
      setData((prevData) => newData(prevData));
    } else {
      setData(newData);
    }
  }, []);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    data,
    loading,
    error,
    lastFetch,
    refetch,
    mutate,
    fetch: fetchData,
  };
};

// Hook for paginated data
export const usePaginatedData = (apiCall, dependencies = [], options = {}) => {
  const { pageSize = 10, immediate = true, ...restOptions } = options;

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const paginatedApiCall = useCallback(async () => {
    const response = await apiCall({ page, pageSize });

    // Extract pagination info from response
    const { data, total, pages } = response.data;
    setTotalItems(total || data?.length || 0);
    setTotalPages(pages || Math.ceil((total || data?.length || 0) / pageSize));

    return { data };
  }, [apiCall, page, pageSize]);

  const result = useApiData(paginatedApiCall, [...dependencies, page], {
    immediate,
    ...restOptions,
  });

  const nextPage = useCallback(() => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  }, [page, totalPages]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  }, [page]);

  const goToPage = useCallback(
    (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setPage(newPage);
      }
    },
    [totalPages]
  );

  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  return {
    ...result,
    page,
    totalPages,
    totalItems,
    pageSize,
    nextPage,
    prevPage,
    goToPage,
    resetPage,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

// Hook for infinite scroll data
export const useInfiniteData = (apiCall, dependencies = [], options = {}) => {
  const { pageSize = 10, immediate = true, ...restOptions } = options;

  const [allData, setAllData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const infiniteApiCall = useCallback(async () => {
    const response = await apiCall({ page, pageSize });
    const newData = response.data.data || response.data;

    if (page === 1) {
      setAllData(newData);
    } else {
      setAllData((prev) => [...prev, ...newData]);
    }

    setHasMore(newData.length === pageSize);

    return { data: newData };
  }, [apiCall, page, pageSize]);

  const result = useApiData(infiniteApiCall, [...dependencies, page], {
    immediate,
    ...restOptions,
  });

  const loadMore = useCallback(() => {
    if (hasMore && !result.loading) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, result.loading]);

  const reset = useCallback(() => {
    setPage(1);
    setAllData([]);
    setHasMore(true);
  }, []);

  return {
    ...result,
    data: allData,
    loadMore,
    hasMore,
    reset,
    isLoadingMore: result.loading && page > 1,
  };
};

export default useApiData;
