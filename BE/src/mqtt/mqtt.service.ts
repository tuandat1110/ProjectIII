import { Injectable } from "@nestjs/common";
import { connect, MqttClient } from "mqtt";
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class MqttService {
    private client: MqttClient;

    constructor(private wsGateway: WebsocketGateway) {
        this.connectBroker();
    }

    connectBroker() {
        this.client = connect("http://localhost")
        this.client.on('connect', () => {
            console.log("MQTT connected");  
            this.client.subscribe("topic"); //subcribe topic
        });

        this.client.on('message', (topic, message) => {
            const data = JSON.parse(message.toString());
            console.log(`Du lieu nhan duoc tu topic ${topic}: `, data);

            this.wsGateway.sendSensorData(data);
        })

    }
}