import React from 'react';
import { Layer } from "react-map-gl";
import { connect } from 'react-redux';

import Compare from '../../Helper/Compare';
import { GreenSignal, YellowSignal, RedSignal } from '../Assets/Layers/LaneSignals';
import { GreenTrajectory, YellowTrajectory} from '../Assets/Layers/LaneTrajectories';

// only re-render if the signals change change color
function signalPropsEqual(prevProps, nextProps) {
    return Compare(prevProps.greens, nextProps.greens) &&
        Compare(prevProps.yellows, nextProps.yellows) && 
        Compare(prevProps.reds, nextProps.reds)
}

const SpatLayer = React.memo(({ greens, yellows, reds }) => {
    return (
        <>
            <Layer {...GreenSignal} filter={["all", ["in", "group", ...greens ]]} />
            <Layer {...YellowSignal} filter={["all", ["in", "group", ...yellows ]]} />
            <Layer {...RedSignal} filter={["all", ["in", "group", ...reds ]]} />
            <Layer {...GreenTrajectory} filter={["all", ["in", "group", ...greens ]]} />
            <Layer {...YellowTrajectory} filter={["all", ["in", "group", ...yellows ]]} />
        </>
    );
}, signalPropsEqual);

const mapStateToProps = state => {
    return {
        reds: state.signals.reds,
        greens: state.signals.greens,
        yellows: state.signals.yellows
    };
}

export default connect(mapStateToProps, null)(SpatLayer);