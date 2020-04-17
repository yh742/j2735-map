import { Component } from 'react';
import { ParseLocation, ParseHeading, ParseSpeed } from '../Helper/Conversion';
import mqtt from 'mqtt';
import { SettingContext, SettingActions } from '../Store';

export class MqttContextProvider extends Component {

    constructor(props) {
        super(props);
        this.state = {
            localBuffer: {}
        }
    }

    componentDidMount() {
        console.log("mqtt client mounting");
        this.client = mqtt.connect(window.production.server, {
            port: window.production.port,
            host: window.production.server,
            keepalive: 0,
            clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
        }).on("connect", () => {
            console.log("connected to mqtt", this.client);
            this.client.subscribe(window.production.topic, (err) => {
                if (err) {
                    // TODO: need to make notification for errors
                    console.log("couldn't subscribe to mqtt server")
                    return;
                }
                this.client.on("message", this.handleMqttMessages);
            });
        });
        this.interval = setInterval(this.timerCallback, window.production.animate);
    }

    timerCallback = () => {
        const [, dispatch] = this.context;
        dispatch({
            type: SettingActions.updateMarker,
            payload: {
                ...this.state.localBuffer,
            }
        });
        this.setState({
            localBuffer: {},
        });
    }

    componentWillUnmount() {
        console.log("mqtt client unmounting");
        if (this.client) this.client.end();
        if (this.interval) clearInterval(this.interval);
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
        this.setState(prevState => ({localBuffer: {
            ...prevState.localBuffer,
            [id]: {
                topic: topic,
                msgType: msgType,
                long: ParseLocation(long),
                lat: ParseLocation(lat),
                speed: ParseSpeed(speed),
                heading: ParseHeading(heading),
                ttl: window.production.ttl,
            }
        }}));   
    }

    render() {
        return null;
    }
} 
MqttContextProvider.contextType = SettingContext;
  


