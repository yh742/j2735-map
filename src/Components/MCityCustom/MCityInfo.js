import { CoordinateDistance } from '../Helper/Utility';

// static lookup table for MCity for intersections and spat signals
export const MCityIntersections = {
    "2576": {
        streets: [ "Main", "Pontiac Trail" ],
        coords: [                    
            -83.699093,
            42.300945,
        ],
    },
    "2573": {
        streets: [ "Main", "State" ],
        coords: [
            -83.698650,
            42.3009419,
        ],
    },
    "2572": {
        streets: [ "Main", "Wolverine" ],
        coords: [
            -83.697923,
            42.300914,
        ]
    }, 
    "2571": {
        streets: [ "Liberty", "Wolverine" ],
        coords: [
            -83.697928,
            42.300375,
        ]
    },
    "2577": {
        streets: [ "Liberty", "Pontiac Trail" ],
        coords: [
            -83.699173,
            42.300395,
        ]
    },
    "2570": {
        streets: [ "Liberty", "State" ],
        coords: [
            -83.698637,
            42.300383,
        ]
    }
};

export function FindClosestIntersection(lat, long, radius) {
    let min = {distance: radius};
    Object.keys(MCityIntersections).forEach((key) => {
        let dist = CoordinateDistance(lat, long, MCityIntersections[key].coords[1], MCityIntersections[key].coords[0]);
        if (dist < radius && dist < min.distance) {
            min = {
                streets: MCityIntersections[key].streets,
                distance: dist
            }
        }
    });
    return min;
}

export function DistanceFromIntersection(intersectionId, long, lat) {
    return CoordinateDistance(
        lat, 
        long, 
        MCityIntersections[intersectionId].coords[1], 
        MCityIntersections[intersectionId].coords[0]);
}