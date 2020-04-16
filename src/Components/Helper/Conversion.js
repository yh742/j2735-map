export function ParseLocation(position) {
    return parseFloat(position) / 10e6;
}

export function ParseHeading(heading) {
    return parseFloat(heading) * 0.0125;
}

export function ParseSpeed(speed) {
    return parseFloat(speed) * 0.072;
}