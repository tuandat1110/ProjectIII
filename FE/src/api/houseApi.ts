import axiosClient from "./axiosClient";

const houseApi = {
    // Thêm nhà: POST accounts/{id}/houses
    createHouse: async (userId: string | number, data: any) => {
        return axiosClient.post(`accounts/${userId}/houses`, data);
    },
    // Sửa nhà: PATCH accounts/{id}/houses/{houseId}
    updateHouse: async (userId: string | number, houseId: string | number, data: any) => {
        return axiosClient.patch(`accounts/${userId}/houses/${houseId}`, data);
    },
    // Xóa nhà: DELETE accounts/{id}/houses/{houseId}
    deleteHouse: async (userId: string | number, houseId: string | number) => {
        return axiosClient.delete(`accounts/${userId}/houses/${houseId}`);
    },
};

export default houseApi;