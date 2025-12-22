import axiosClient from "./axiosClient";

const profileApi = {
    updateAvatar: async(id: number, avatarUrl: string) => {
        return axiosClient.patch(`/accounts/${id}`, { avatarUrl });
    },
    
};

export default profileApi;