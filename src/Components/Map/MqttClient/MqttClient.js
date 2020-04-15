import mqtt from 'mqtt';

export default class MqttClient {
    constructor(batchCallBack, timer=1000) {
        // TODO: handle error conditions as well
        this.client = mqtt.connect(window.production.server, {
            port: window.production.port,
            host: window.production.server,
            clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
        }).on("connect", () => {
            this.client.subscribe(window.production.topic, (err) => {
                if (err) {
                    // TODO: need to make notification for errors
                    console.log("couldn't subscribe to mqtt server")
                    return;
                }
                this.client.on("message", this.handleMqttMessages);
            });
        });
        this.localMarkerCache = {}
        this.interval = setInterval(() => {
            batchCallBack(this.localMarkerCache);
            this.localMarkerCache = {};
        }, timer);
    }

    parseLocation(position) {
        return parseFloat(position) / 10e6;
    }
    
    parseHeading(heading) {
        return parseFloat(heading) * 0.0125;
    }
    
    parseSpeed(speed) {
        return parseFloat(speed) * 0.072;
    }

    handleMqttMessages = (topic, message) => {
        let jsonString = new TextDecoder('utf-8').decode(message)
        let jsonObj;
        try {
          jsonObj = JSON.parse(jsonString);
        } catch (e) {
          console.log("couldn't convert " + jsonString + " to json object");
          return;
        }
        if ("BasicSafetyMessage" in jsonObj.MessageFrame.value) {
          // handle BSM messages here
          this.convertMessages(
            jsonObj.MessageFrame.value.BasicSafetyMessage.coreData,
            topic,
            "BSM"
            );
        } else if ("PersonalSafetyMessage" in jsonObj.MessageFrame.value){
          this.convertMessages(
            jsonObj.MessageFrame.value.PersonalSafetyMessage,
            topic, 
            "PSM"
          );
        }
    }

    // TODO: parse partII of the BSM messages
    convertMessages = (msgObj, topic, msgType) => {
        const {
            heading, id, long, lat, speed
        } = msgObj;
        this.localMarkerCache = {
            ...this.localMarkerCache,
            [id]: {
            topic: topic,
            msgType: msgType,
            long: this.parseLocation(long),
            lat: this.parseLocation(lat),
            speed: this.parseSpeed(speed),
            heading: this.parseHeading(heading),
        }
    }
    }

    close() {
        if (this.client) this.client.end();
        if (this.interval) clearInterval(this.interval);
    }
}

    
  


