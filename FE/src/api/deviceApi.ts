import { Device } from "../types/device";
import { Room } from "../types/room";
import axiosClient from "./axiosClient";

export const deviceApi = {
    createDevice: async (roomId: string | number, data: Device) => {
        const body = {
            roomId: roomId,
            ...data,
        }
        return axiosClient.post(`/devices`, JSON.stringify(body));
    },

    controlDevice: async (devideId: string | number, data: any) => {
        console.log(`/devices/${devideId}/command`);
        return axiosClient.patch(`/devices/${devideId}/command`, JSON.stringify(data));
    },
    getHistoryData: async (durationMinutes: number,aggregateSeconds: number) => {
        return axiosClient.get(`/influx/history?durationMinutes=${durationMinutes}&aggregateSeconds=${aggregateSeconds}`);
    }
}