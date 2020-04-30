import { SwitchDecoderTopic } from './ExternalCalls';

// this can probably be refactored for different types of interval jobs
class TrackingJob {
    constructor(dispatcher, topic, sourceType) { 
        this.dispatcher = dispatcher;
        this.topic = topic;
        this.sourceType = sourceType;
        this.intervalJob = null;
    }

    async run() {        
        // if source is from vehicle subscribe to VZMODE
        if (this.sourceType.toLowerCase() === "vehicle") {
            let splits = this.topic.replace('IN','OUT').split('/');
            if (splits.length < 7) {
                this.dispatcher.errorCb(`The topic format "${this.topic}" doesn't look right...`);
                return false;
            }
            let newTopic = splits.slice(0,7).join('/') + "/#";
            let res = await SwitchDecoderTopic(newTopic, "json");
            if (res.status !== 200) {
                this.dispatcher.errorCb(`Received code ${res.status} from http server!`);
                return false;
            }
        }
        this.intervalJob = setInterval(this.dispatcher.intervalCb, window.production.animate); 
        return true;
    }

    async stop() {
        if (this.sourceType.toLowerCase() === "vehicle") {
            let res = await SwitchDecoderTopic('VZCV2X/1/IN/#', 'json');
            if (res.status !== 200) {
                this.dispatcher.errorCb(`Received code ${res.status} from http server!`);
                return false;
            }
        }
        if (this.intervalJob) {
            clearInterval(this.intervalJob);
        }
        return true;
    }
}

export default TrackingJob;