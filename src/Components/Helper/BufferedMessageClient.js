import mqtt from 'mqtt';
import { ParseLocation, ParseHeading, ParseSpeed } from './Utility';

export default class BufferedMessageClient {
    constructor(displayErrors) {
        this.msgBuffer = {};
        this.spatLightsBuffer = {};
        // make sure keepalive here is less than 60 seconds
        this.client = mqtt.connect(window.production.server, {
            port: window.production.port,
            host: window.production.server,
            keepalive: 30,
            clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8) + 32,
        }).on("connect", (connack) => {
            console.log("connected to mqtt", connack, this.client);
            this.client.subscribe(window.production.topic, (err) => {
                if (err) {
                    console.log("couldn't subscribe to mqtt server");
                    displayErrors("Couldn't subscribe to MQTT server!");
                    return;
                }
                this.client.on("message", this.handleMqttMessages);
            });
            this.client.on("disconnect", () => {
                console.log("mqtt broker is disconnecting");
                displayErrors("Disconnecting from MQTT server!");
            });
        });
    }

    dispatchMessages(dispatchers) {
        dispatchers.updateNotification(Object.keys(this.msgBuffer));
        dispatchers.updateMarker(this.msgBuffer);
        this.msgBuffer = {};
    }

    dispatchSignals(dispatchers) {
        dispatchers.updateSignals(this.spatLightsBuffer);
        this.spatLightsBuffer = {};
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
            jsonObj.MessageFrame.source? jsonObj.MessageFrame.source: null,
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
                jsonObj.MessageFrame.value.SPAT.intersections.IntersectionState.id.id,
                jsonObj.MessageFrame.value.SPAT.intersections.IntersectionState.states.MovementState,
            );
        } else {
            console.log("can't convert: ", jsonObj)
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

    convertSpatMessages = (id, movementStates) => {
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
        this.spatLightsBuffer[id] = {
            greens: greens,
            yellows: yellows,
            reds: reds,
            ttl: window.production.spatTTL,
        };
    }

    convertMessages = (msgObj, topic, msgType) => {
        const { heading, id, long, lat, speed } = msgObj;
        let cleanId = id.replace(/[^a-z0-9]|\s+|\r?\n|\r/gmi, "");
        this.msgBuffer[cleanId] = {
            topic: topic,
            msgType: msgType,
            long: ParseLocation(long), 
            lat: ParseLocation(lat),
            speed: ParseSpeed(speed),
            heading: ParseHeading(heading),
            ttl: window.production.ttl,
        };   
    }
}