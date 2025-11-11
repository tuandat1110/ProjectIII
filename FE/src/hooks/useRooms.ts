import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Room } from "../types/room";
import houseApi from "../api/houseApi";
import { houseKeys } from "../queryKeys";
import { roomApi } from "../api/roomApi";

export const useGetRooms = (houseId: string | number) => {
    return useQuery<Room[]>({
        queryKey: houseKeys.rooms(houseId),

        queryFn: async () => {
            const response = await houseApi.getRoom(houseId);
            return response.data;
        },

        staleTime: 1000*60*5,
        //enabled: !!houseId   // Chỉ chạy query khi có houseId
    })
}

export const useAddRoom = (houseId: string | number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ houseId, roomData } : { houseId: string | number, roomData: Room }) => {
            return roomApi.createHouse(houseId, roomData)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: houseKeys.rooms(houseId) });
        },
        onError: (error) => {
            console.error("Lỗi khi thêm phòng:", error);
        }
    })
}