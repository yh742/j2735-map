export function ParseLocation(position) {
    let loc = parseFloat(position) / 10e6;
    return Math.floor(loc * 1e5) / 1e5
}

export function ParseHeading(heading) {
    return parseFloat(heading) * 0.0125;
}

export function ParseSpeed(speed) {
    return parseFloat(speed) * 0.072;
}

export function Rotate(heading, mapHeading) {
    let rotation = heading - mapHeading;
    if (rotation === 360) {
        return 0;
    }
    return rotation;
}

export function ScaleMarker(lat, zoom, msgType) {
    const earthCircumference = 40075017;
    let latitudeRadians = lat * (Math.PI/180);
    let mPP  = earthCircumference * Math.cos(latitudeRadians) / Math.pow(2, zoom + 8);
    let size = msgType === "BSM"? 6.6: 5.5;
    return (size/mPP);
}

export function DecodeTopicType(topic) {
    let cleanTopic = topic.toUpperCase().replace("VZCV2X/1/IN/", "");
    let splits = cleanTopic.split('/');
    if (splits.length === 0) return "Not Available";
    switch (splits[0]) {
        case "VEH":
            return "Vehicle";
        case "VRU":
            return "VRU";
        case "CAM":
            return "Camera";
        case "TRAFLT":
            return "Traffic Light";
        case "RSU":
            return "RSU";
        default:
            return "Not Available";
    }
}

export function Compare(a,b) {
    var primitive=['string','number','boolean'];
    if(primitive.indexOf(typeof a)!==-1 && primitive.indexOf(typeof a)===primitive.indexOf(typeof b)) return a===b;
    if(typeof a!==typeof b || a.length!==b.length) return false;
    for(let i in a){
         if(!Compare(a[i],b[i])) return false;
    }
    return true;
}
