import mqtt from 'mqtt';
import { ParseLocation, ParseHeading, ParseSpeed } from '../Helper/Conversion';


export default class BufferedMQTTClient {

    constructor(errorCallback, timerCallback, timerInterval = window.production.animate) {
        this.localBuffer = {};
        this.client = mqtt.connect(window.production.server, {
            port: window.production.port,
            host: window.production.server,
            clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
        }).on("connect", () => {
            console.log("connected to mqtt", this.client);
            this.client.subscribe(window.production.topic, (err) => {
                if (err) {
                    console.log("couldn't subscribe to mqtt server")
                    errorCallback("Couldn't subscribe to MQTT server!")
                    return;
                }
                this.client.on("message", this.handleMqttMessages);
            });
        });
        this.interval = setInterval(() => timerCallback(this.localBuffer), timerInterval);
    }

    clearBuffer() {
        this.localBuffer = {};
    }

    disconnect() {
        if (this.client) {
            this.client.end()
            this.client = null;
        }
    }

    handleMqttMessages = (topic, message) => {
        let jsonString = new TextDecoder('utf-8').decode(message);
        let jsonObj;
        
        try {
          jsonObj = JSON.parse(jsonString);
        } catch (e) {
          console.log("couldn't convert " + jsonString + " to json object");
          return;
        }
        if ("BasicSafetyMessage" in jsonObj.MessageFrame.value) {
          this.convertMessages(
            jsonObj.MessageFrame.value.BasicSafetyMessage.coreData,
            jsonObj.MessageFrame.source? jsonObj.MessageFrame.source: topic,
            "BSM"
            );
        } else if ("PersonalSafetyMessage" in jsonObj.MessageFrame.value){
          this.convertMessages(
            {
                ...jsonObj.MessageFrame.value.PersonalSafetyMessage,
                ...jsonObj.MessageFrame.value.PersonalSafetyMessage.position
            },
            jsonObj.MessageFrame.source? jsonObj.MessageFrame.source: topic,
            "PSM"
          );
        }
    }

    convertMessages = (msgObj, topic, msgType) => {
        const { heading, id, long, lat, speed } = msgObj;
        this.localBuffer = {
            ...this.localBuffer,
            [id]: {
                topic: topic,
                msgType: msgType,
                long: ParseLocation(long),
                lat: ParseLocation(lat),
                speed: ParseSpeed(speed),
                heading: ParseHeading(heading),
                ttl: window.production.ttl,
            }
        };   
    }

    render() {
        return null;
    }
}