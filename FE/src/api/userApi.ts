import axiosClient from "./axiosClient";

const userApi = {
    getHome:  async(id: string | number) => {
        return axiosClient.get(`accounts/${id}/houses`);
    }
};

export default userApi;