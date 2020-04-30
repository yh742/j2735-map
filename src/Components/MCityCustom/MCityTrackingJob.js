import { SwitchDecoderTopic } from '../Helper/ExternalCalls';
import { FindClosestIntersection } from './MCityInfo';

// this can probably be refactored for different types of interval jobs
class MCityTrackingJob {
    constructor(dispatcher, target, markers, sourceType) { 
        this.dispatcher = dispatcher;
        this.markers = markers; 
        this.target = target;
        this.sourceType = sourceType;
        this.intervalJob = null;
    }

    async run() {
        // configure map viewport here subsequent call will only update location
        this.dispatcher.intervalCb({
            longitude: this.markers[this.target].long, 
            latitude: this.markers[this.target].lat,
            bearing: 0,
            transitionDuration: 0,
            // zoom: this.props.zoom > 18.5? this.props.zoom: 18.5
        });
        
        // if source is from vehicle subscribe to VZMODE
        if (this.sourceType.toLowerCase() === "vehicle") {
            let splits = this.markers[this.target].topic.replace('IN','OUT').split('/');
            if (splits.length < 7) {
                this.dispatcher.errorCb(`The topic format "${this.props.markers[this.target].topic}" doesn't look right...`);
                return false;
            }
            let newTopic = splits.slice(0,7).join('/') + "/#";
            let res = await SwitchDecoderTopic(newTopic, "json");
            if (res.status !== 200) {
                this.dispatcher.errorCb(`Received code ${res.status} from http server!`);
                return false;
            }
        }
        this.intervalJob = setInterval(this.intervalJob, window.production.animate); 
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

    intervalJob() {
        // make sure the target is still in markers
        if (this.target in this.markers) {
            const {long, lat } = this.markers[this.target];
            let min = FindClosestIntersection(lat, long, 0.04);
            if (min.streets) {
                this.setState({closestIntersection: min});
            } else if(Object.keys(this.state.closestIntersection).length !== 0) {
                this.setState({closestIntersection: {}});
            }
            this.props.setMapView({
                longitude: long,
                latitude: lat,
                transitionDuration: window.production.animate,
            });
            return;
        }
    }
}

export default MCityTrackingJob;