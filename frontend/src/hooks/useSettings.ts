import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

export const useSettings = () => {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => (await api.get("/v1/settings")).data,
  });
};
