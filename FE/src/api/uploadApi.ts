import axios from "axios";

export const uploadAvatarApi = async (
  file: {
    uri: string;
    type: string;
    name: string;
  },
  token: string | null
) => {
    const formData = new FormData();
    console.log(`formData: ${JSON.stringify(formData)}`);

    formData.append("file", {
        uri: file.uri,
        type: file.type,
        name: file.name,
    } as any);

    const res = await axios.post(
        "http://192.168.0.102:3000/upload/avatar",
        formData,
        {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        },
        }
    );
    return res.data; 
};
