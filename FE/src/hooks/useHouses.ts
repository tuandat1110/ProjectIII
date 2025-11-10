import { useQuery } from "@tanstack/react-query"
import { userKeys } from "../queryKeys"
import userApi from "../api/userApi";

interface House {
    id: number,
    home_id: string,
    name: string,
    address: string,
    description: string,
}

export const useGetHouses = (userId: string | number) => {
    return useQuery<House[]>({
        queryKey: userKeys.houses(userId),

        queryFn: async () => {
            const response = await userApi.getHome(userId);
            return response.data;
        },

        staleTime: 1000*60*5,
        enabled: !!userId   // Chỉ chạy query khi có userId
    })
}