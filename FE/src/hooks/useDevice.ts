import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { roomKeys, userKeys } from "../queryKeys"
import { Device } from "../types/device";
import { roomApi } from "../api/roomApi";
import { deviceApi } from "../api/deviceApi";

interface ControlPayload {
    deviceId: number | string;
    status: string; 
    pin: number;
    mac: string | null | undefined;
    roomId: number | string;
}

export const useGetDevices = (roomId: string | number) => {
    return useQuery<Device[]>({ 
        queryKey: roomKeys.devices(roomId), 
        queryFn: async () => {
            const response = await roomApi.getDevices(roomId); 
            return response.data;
        },
        staleTime: 1000 * 60 * 5,
        enabled: !!roomId 
    })
}

export const useAddDevice = (roomId: string | number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (deviceData: Device) => { 
            return deviceApi.createDevice(roomId, deviceData); 
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: roomKeys.devices(roomId) }); 
        },
        onError: (error) => {
            console.error("Lỗi khi thêm thiết bị:", error); // Thay đổi thông báo lỗi
        }
    })
}

export const useControlDevice = () => {
    // 1. Lấy Query Client để thao tác với cache
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: ControlPayload) => {
            return deviceApi.controlDevice(
                payload.deviceId,
                {
                    status: payload.status,
                    pin: payload.pin,
                    mac: payload.mac,
                    roomId: payload.roomId
                }
            );
        },
        
        //  2. CẬP NHẬT LẠC QUAN: Chạy ngay lập tức khi mutate được gọi
        onMutate: async (newPayload) => {
            const { deviceId, status, roomId } = newPayload;
            // Chuyển đổi trạng thái gửi đi ("ON"/"OFF") thành boolean
            const newStatusBool = status === "ON";
            
            const queryKey = roomKeys.devices(roomId); // Key để lấy danh sách thiết bị

            // Hủy bỏ bất kỳ refetch nào đang chạy để tránh ghi đè dữ liệu lạc quan
            await queryClient.cancelQueries({ queryKey }); 

            // Lưu trữ dữ liệu cũ (context) để có thể rollback
            const previousDevices = queryClient.getQueryData(queryKey) as Device[] | undefined;
            
            // CẬP NHẬT CACHE: Ghi đè dữ liệu trong cache ngay lập tức
            queryClient.setQueryData(queryKey, (oldDevices: Device[] | undefined) => {
                if (oldDevices) {
                    return oldDevices.map(d => 
                        d.id === deviceId 
                            ? { ...d, status: newStatusBool } // Thay đổi trạng thái
                            : d
                    );
                }
                return oldDevices; // Giữ nguyên nếu không có dữ liệu cũ
            });

            // Trả về context để dùng trong onError
            return { previousDevices, queryKey };
        },
        
        // 3. XỬ LÝ LỖI: Rollback lại trạng thái cũ
        onError: (error, newPayload, context: { previousDevices: Device[] | undefined, queryKey: any[] }) => {
            if (context.previousDevices) {
                // Rollback lại trạng thái đã lưu
                queryClient.setQueryData(context.queryKey, context.previousDevices);
                console.error("Lệnh thất bại, đã rollback giao diện.", error);
            }
        },
        
        // 4. Bổ sung cho luồng WebSocket
        // onSettled không cần thiết phải invalidateQueries nếu bạn dùng WebSocket + setQueryData
        onSettled: () => {
             console.log("Hoàn tất thao tác điều khiển");
        }
    });
};