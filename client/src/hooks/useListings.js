import { useQuery } from "@tanstack/react-query";
import { listingApi } from "../api/services";
import { getOfflineListings } from "../utils/offlineStore";

const useListings = (params) =>
  useQuery({
    queryKey: ["listings", params],
    queryFn: async () => {
      try {
        return (await listingApi.getAll(params)).data.data;
      } catch {
        const all = getOfflineListings();
        const filtered = all.filter((item) => {
          const matchesCategory = !params?.category || item.category === params.category;
          const matchesSearch = !params?.search || item.title.toLowerCase().includes(params.search.toLowerCase());
          return matchesCategory && matchesSearch;
        });
        return { items: filtered, total: filtered.length, page: 1 };
      }
    }
  });

export default useListings;
