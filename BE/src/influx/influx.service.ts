// src/influxdb/influxdb.service.ts
import { Injectable } from '@nestjs/common';
import { InfluxDB, Point } from '@influxdata/influxdb-client';

// Cấu hình InfluxDB
const token = 'Nj1FwSpe-M78EI8sfx6lat5FeUiMB_od3GAgEPnvnCiAs-Vnfzzzc8sWyH2jDzhNQ-SeazWmQd_g8lg361xXLw=='; 
const org = 'iot-org';
const bucket = 'projectIII'; 
const url = 'http://localhost:8086'; 

@Injectable()
export class InfluxdbService {
    private influxDB: InfluxDB;
    private writeApi: any;

    constructor() {
        this.influxDB = new InfluxDB({ url, token });
        // Khởi tạo Write API
        this.writeApi = this.influxDB.getWriteApi(org, bucket, 'ns'); // 'ns' là precision (nanoseconds)
    }

    async writeSensorData(roomId: string, temp: number, humidity: number): Promise<void> {
        // Tạo một Point (Điểm dữ liệu)
        const point = new Point('sensor_data')
            .tag('room_id', roomId) // Tag: Dùng để lọc và nhóm (indexing)
            .tag('type', 'T&H')
            .floatField('temperature', temp) // Field: Giá trị đo lường
            .floatField('humidity', humidity)
            .timestamp(new Date()); // Timestamp tự động thêm nếu không chỉ định

        this.writeApi.writePoint(point);
        
        try {
            await this.writeApi.flush(); // Bắt buộc flush để đảm bảo dữ liệu được gửi đi
            console.log(`Dữ liệu cảm biến đã được ghi cho Room: ${roomId}`);
        } catch (error) {
            console.error('Lỗi khi ghi vào InfluxDB:', error);
        }
    }

    async getSensorHistory(roomId: string, minutes = 60) {
    const queryApi = this.influxDB.getQueryApi(org);
    const query = `
      from(bucket: "${bucket}")
        |> range(start: -${minutes}m)
        |> filter(fn: (r) => r._measurement == "sensor_data")
        |> filter(fn: (r) => r.room_id == "${roomId}")
        |> filter(fn: (r) => r._field == "temperature" or r._field == "humidity")
        |> aggregateWindow(every: 1m, fn: mean, createEmpty: false)
        |> yield(name: "mean")
    `;

    const data: Array<{ time: any; field: any; value: any }> = [];

    return new Promise((resolve, reject) => {
      queryApi.queryRows(query, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          data.push({
            time: o._time,
            field: o._field,
            value: o._value,
          });
        },
        error(err) {
          reject(err);
        },
        complete() {
          // Gom nhóm lại theo field
          const temperature = data.filter((d) => d.field === 'temperature');
          const humidity = data.filter((d) => d.field === 'humidity');
          resolve({ temperature, humidity });
        },
      });
    });
  }
}