import axiosClient from "./axiosClient";

const authApi = {
    login: async(email: string, password: string) => {
        return axiosClient.post('/auth/login', { email, password });
    },
    signup: (data: { email: string; password: string; name: string }) =>{
        return axiosClient.post('/auth/signup', data);
    },
};

export default authApi;