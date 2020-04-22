import { Layer } from "react-map-gl"
import React from 'react'
import { GreenSignal, YellowSignal, RedSignal } from '../Assets/Layers/LaneSignals';
import { GreenTrajectory, YellowTrajectory, RedTrajectory } from '../Assets/Layers/LaneTrajectories';

function compare(a,b) {
    var primitive=['string','number','boolean'];
    if(primitive.indexOf(typeof a)!==-1 && primitive.indexOf(typeof a)===primitive.indexOf(typeof b))return a===b;
    if(typeof a!==typeof b || a.length!==b.length)return false;
    for(let i in a){
         if(!compare(a[i],b[i]))return false;
    }
    return true;
}

function signalPropsEqual(prevProps, nextProps) {
    return compare(prevProps.greens, nextProps.greens) &&
        compare(prevProps.yellows, nextProps.yellows) && 
        (prevProps.reds, nextProps.reds)
}

export default React.memo(({ greens, yellows, reds }) => {
    console.log(greens, yellows, reds);
    return (
        <>
            <Layer {...GreenSignal} filter={["all", ["in", "group", ...greens ]]} />
            <Layer {...YellowSignal} filter={["all", ["in", "group", ...yellows ]]} />
            <Layer {...RedSignal} filter={["all", ["in", "group", ...reds ]]} />
            <Layer {...GreenTrajectory} filter={["all", ["in", "group", ...greens ]]} />
            <Layer {...YellowTrajectory} filter={["all", ["in", "group", ...yellows ]]} />
            {/* <Layer {...RedTrajectory} filter={["all", ["in", "group", ...reds ]]} /> */}
        </>
    );
}, signalPropsEqual);
