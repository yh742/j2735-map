import React from 'react';
import { Layer } from "react-map-gl";
import { connect } from 'react-redux';

import { Compare } from '../../Helper/Utility'
import { GreenSignal, YellowSignal, RedSignal } from '../Assets/Layers/LaneSignals';
import { GreenTrajectory, YellowTrajectory} from '../Assets/Layers/LaneTrajectories';

// only re-render if the signals change change color
function signalPropsEqual(prevProps, nextProps) {
    return Compare(prevProps.greens, nextProps.greens) &&
        Compare(prevProps.yellows, nextProps.yellows) && 
        Compare(prevProps.reds, nextProps.reds)
}

const SpatLayer = React.memo(({ id, greens, yellows, reds }) => {
    return (
        <>
            <Layer {...GreenSignal} key={id + "green"} filter={["all", ["==", "intId", id], ["in", "group", ...greens ]]} />
            <Layer {...YellowSignal} key={id + "yellow"} filter={["all", ["==", "intId", id], ["in", "group", ...yellows ]]} />
            <Layer {...RedSignal} key={id + "red"} filter={["all", ["==", "intId", id], ["in", "group", ...reds ]]} />
            <Layer {...GreenTrajectory} key={id + "green-traj"} filter={["all", ["==", "intId", id], ["in", "group", ...greens ]]} />
            <Layer {...YellowTrajectory} key={id + "yellow-traj"} filter={["all", ["==", "intId", id], ["in", "group", ...yellows ]]} />
        </>
    );
}, signalPropsEqual);

const mapStateToProps = (state, ownProps) => {
    const { id } = ownProps;
    if (id in state.signals) {
        return {
            reds: state.signals[id].reds,
            greens: state.signals[id].greens,
            yellows: state.signals[id].yellows
        };
    } else {
        return {
            reds: [],
            greens: [],
            yellows: []
        };
    }

}

export default connect(mapStateToProps, null)(SpatLayer);