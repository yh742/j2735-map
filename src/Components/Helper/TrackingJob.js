import { SwitchDecoderTopic } from './ExternalCalls';

// this can probably be refactored for different types of interval jobs
class TrackingJob {
    constructor(dispatcher, topic, sourceType) { 
        console.log(topic);
        this.dispatcher = dispatcher;
        this.topic = topic;
        this.sourceType = sourceType;
        this.intervalJob = null;
    }

    async run() {        
        // if the source is from a vehicle subscribe to VZMODE
        if (this.sourceType.toLowerCase() === "vehicle") {
            let splits = this.topic.replace('IN','OUT').split('/');
            if (splits.length < 7) {
                this.dispatcher.errorCb(`The topic format "${this.topic}" doesn't look right...`);
                return false;
            }
            let newTopic = splits.slice(0,7).join('/') + "/#";
            let [inRes, outRes] = await SwitchDecoderTopic(newTopic, "json", this.topic, "json");
            if (inRes.status !== 200 || outRes.status !== 200) {
                this.dispatcher.errorCb(`Received ${inRes.status}, ${outRes.status} from http server!`);
                console.log(inRes, outRes);
                return false;
            }
        }
        this.intervalJob = setInterval(this.dispatcher.intervalCb, window.production.animate); 
        return true;
    }

    async stop() {
        if (this.sourceType.toLowerCase() === "vehicle") {
            let [inRes, outRes] = await SwitchDecoderTopic('VZCV2X/1/IN/#', 'json', 'NA', 'json');
            if (inRes.status !== 200 || outRes.status !== 200) {
                this.dispatcher.errorCb(`Received ${inRes.status}, ${outRes.status} from http server!`);
                console.log(inRes, outRes);
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