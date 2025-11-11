import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { userKeys } from "../queryKeys"
import userApi from "../api/userApi";
import { House } from "../types/house";
import houseApi from "../api/houseApi";

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

export const useAddHouse = (userId: string | number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, houseData } : { userId: string | number, houseData: House }) => {
            return houseApi.createHouse(userId, houseData)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.houses(userId) });
        },
        onError: (error) => {
            console.error("Lỗi khi thêm nhà:", error);
        }
    })
}