// src/influxdb/influxdb.service.ts
import { Injectable } from '@nestjs/common';
import { InfluxDB, Point } from '@influxdata/influxdb-client';

interface InfluxRow {
  _time: string;
  _field: string;
  _value: number;
  [key: string]: any;
}

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

    async writeSensorData(homeId: string, temp: number, humidity: number): Promise<void> {
        // Tạo một Point (Điểm dữ liệu)
        const point = new Point('sensor_data')
            .tag('home_id', homeId) // Tag: Dùng để lọc và nhóm (indexing)
            .tag('type', 'T&H')
            .floatField('temperature', temp) // Field: Giá trị đo lường
            .floatField('humidity', humidity)
            .timestamp(new Date()); // Timestamp tự động thêm nếu không chỉ định

        this.writeApi.writePoint(point);
        
        try {
            await this.writeApi.flush(); // Bắt buộc flush để đảm bảo dữ liệu được gửi đi
            console.log(`Dữ liệu cảm biến đã được ghi cho Home: ${homeId}`);
        } catch (error) {
            console.error('Lỗi khi ghi vào InfluxDB:', error);
        }
    }
    // tam thoi bo deviceId
     async getSensorHistory(durationMinutes: number, aggregateSeconds: number, homeId: string): Promise<any[]> {
      const fluxQuery = `
        from(bucket: "${bucket}")
          |> range(start: -${durationMinutes}m)
          |> filter(fn: (r) => r._measurement == "sensor_data")
          |> filter(fn: (r) => r.home_id == "${homeId}")
          |> filter(fn: (r) => r._field == "temperature" or r._field == "humidity")
          |> aggregateWindow(every: ${aggregateSeconds}s, fn: mean)
          |> yield()
      `;

      const queryApi = this.influxDB.getQueryApi(org);
      const rows = await queryApi.collectRows(fluxQuery);
      //console.log(`Rows: ${JSON.stringify(rows)}`);

      //  group các dòng theo _time
      const grouped: Record<string, any> = {};

      rows.forEach((row: InfluxRow) => {
        const time = row._time;
        const field = row._field;
        const value = row._value;

        if (!grouped[time]) grouped[time] = { time };
        grouped[time][field] = value;
      });

      // chuyển object → array
      return Object.values(grouped);
    }
}