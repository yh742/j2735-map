import mqtt from 'mqtt';

export default function CreateMqttClient(callback) {
    let client = mqtt.connect(window.production.server, {
        port: window.production.port,
        host: window.production.server,
        clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    }).on("connect", () => {
        client.subscribe(window.production.topic, (err, granted) => {
            if (err) {
                // display error stuff here
                console.log("couldn't connect to mqtt server");
                return;
            }
            console.log("connected to mqtt server");
            client.on("message", callback);
        });
    });
    return client;
}

export function CloseMqtt(client) {
    client.end();
}