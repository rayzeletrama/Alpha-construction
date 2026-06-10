import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  image_url?: string;
}

export const useProducts = (category?: string) => {
  return useQuery({
    queryKey: ["products", category],
    queryFn: async () => {
      const { data } = await api.get<Product[]>("/products", {
        params: { category },
      });
      return data;
    },
  });
};
