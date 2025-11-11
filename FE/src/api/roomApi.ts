import { Room } from "../types/room";
import axiosClient from "./axiosClient";

export const roomApi = {
    createHouse: async (houseId: string | number, data: Room) => {
        const body = {
            houseId: houseId,
            ...data,
        }
        return axiosClient.post(`/rooms`, JSON.stringify(body));
    },
}