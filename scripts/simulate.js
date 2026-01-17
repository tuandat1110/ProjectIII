const mqtt = require('mqtt');
const argv = require('minimist')(process.argv.slice(2));

const broker = argv.broker || process.env.MQTT_BROKER || 'mqtt://localhost:1883';
const topic = argv.topic || 'sensor/demo/home1/room1/esp32-01/telemetry';

const client = mqtt.connect(broker);

client.on('connect', () => {
  console.log('Connected to MQTT broker', broker);

  setInterval(() => {
    const payload = JSON.stringify({
      deviceId: 'esp32-01',
      temperature: (20 + Math.random() * 10).toFixed(1),
      humidity: (40 + Math.random() * 20).toFixed(1),
      light: Math.floor(Math.random() * 500),
      timestamp: new Date().toISOString()
    });

    client.publish(topic, payload, { qos: 0 }, err => {
      if (err) console.error('Publish error', err);
      else console.log('Published to', topic, payload);
    });
  }, 5000);
});

client.on('error', (err) => { console.error('MQTT error', err); process.exit(1); });

// Usage: node scripts/simulate.js --broker mqtt://localhost:1883 --topic sensor/... 
