export function ParseLocation(position) {
    return parseFloat(position) / 10e6;
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