import { useQuery } from "react-query";

const useFetch = (key, fetcher, options = {}) => {
  return useQuery(key, fetcher, {
    staleTime: 1000 * 60,
    ...options
  });
};

export default useFetch;
