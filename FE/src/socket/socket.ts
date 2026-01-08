import { io } from "socket.io-client";

const socket = io("http://192.168.0.104:3000", {
    transports: ["websocket"], // bắt buộc cho RN
});

export default socket;