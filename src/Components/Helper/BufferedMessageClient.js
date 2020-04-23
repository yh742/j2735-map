import mqtt from 'mqtt';
import { ParseLocation, ParseHeading, ParseSpeed } from './Utility';

export default class BufferedMessageClient {
    constructor(dispatchers, timerInterval=window.production.animate) {
        this.msgBuffer = {};
        this.spatLightsBuffer = {};
        this.spatMessagesBuffer = {};
        this.client = mqtt.connect(window.production.server, {
            port: window.production.port,
            host: window.production.server,
            clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
        }).on("connect", () => {
            console.log("connected to mqtt", this.client);
            this.client.subscribe(window.production.topic, (err) => {
                if (err) {
                    console.log("couldn't subscribe to mqtt server");
                    dispatchers.addError("Couldn't subscribe to MQTT server!");
                    return;
                }
                this.client.on("message", this.handleMqttMessages);
            });
        });
        this.interval = setInterval(() => this.intervalJob(dispatchers), timerInterval);
    }

    intervalJob(dispatchers) {
        dispatchers.updateMarker(this.msgBuffer);
        dispatchers.updateSPAT(this.spatMessagesBuffer);
        dispatchers.updateSignals(this.spatLightsBuffer);
        dispatchers.updateNotification(Object.keys(this.msgBuffer));
        this.clearBuffer()
    }

    clearBuffer() {
        this.msgBuffer = {};
        this.spatLightsBuffer = {};
        this.spatMessagesBuffer = {};
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
            jsonObj.MessageFrame.source? jsonObj.MessageFrame.source: null,
            "PSM"
          );
        } else if ("SPAT" in jsonObj.MessageFrame.value) {
            this.convertSpatMessages(
                jsonObj.MessageFrame.value.SPAT.intersections.IntersectionState.states.MovementState,
            )
        }
    }

    spatStatusDecoder = (status) => {
        switch(status.toLowerCase()) {
            case "stop-and-remain":
            case "stop-then-proceed":
                return "red";
            case "permissive-movement-allowed":
            case "pre-movement":
            case "protected-movement-allowed":
                return "green";
            case "permissive-clearance":
            case "protected-clearance":
            case "caution-conflicting-traffic":
                return "yellow";
            default:
                return "";
        }
    }

    convertSpatMessages = (movementStates) => {
        let pubObj = {};
        let greens = [];
        let yellows =[];
        let reds = []; 
        movementStates.forEach((mState) => {
            const { 
                signalGroup, 
                "state-time-speed": {
                  "MovementEvent": {
                    "eventState": state
                  }
                } 
            } = mState; 
            let status = this.spatStatusDecoder(Object.keys(state)[0]);
            let sg = parseInt(signalGroup);
            switch(status) {
                case "red":
                    reds.push(sg);
                    break;
                case "yellow":
                    yellows.push(sg);
                    break;
                case "green":
                    greens.push(sg);
                    break
                default:
                    break;
            }
            pubObj[signalGroup] = {
                status: Object.keys(state)[0],
                maxEndTime: mState["state-time-speed"].MovementEvent.timing? mState["state-time-speed"].MovementEvent.timing.maxEndTime/10: -1,
                minEndTime: mState["state-time-speed"].MovementEvent.timing? mState["state-time-speed"].MovementEvent.timing.minEndTime/10: -1,
            };
        }); 
        this.spatMessagesBuffer = {
            ...this.spatMessagesBuffer,
            ...pubObj,
        };
        this.spatLightsBuffer = {
            greens: greens,
            yellows: yellows,
            reds: reds,
        };
    }

    convertMessages = (msgObj, topic, msgType) => {
        const { heading, id, long, lat, speed } = msgObj;
        this.msgBuffer = {
            ...this.msgBuffer,
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