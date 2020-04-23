export default {
    displaySettings: {
        intNotification: true,
        vehPopup: true,
        stNames: true,
        trajectories: false,
        sigDebug: false,
        metric: false
    },
    messageSettings: {
        enableBSM: true,
        enablePSM: true,
        enableSPaT: true,
    },
    animateIcons: true,
    history: [],
    spat: {},
    markers: {},
    mapView: {
        latitude: 49,
        longitude: -123,
        zoom: 9,
        bearing: 0,
        pitch: 0
    },
    notification: {
        newMessages: 0,
        listen: true,
    },
    mapMode: {
        worldView: true,
        targetId: null,
    },
    error: {
        message: "",
        queue: [],
    },
    signals: {
        greens:[],
        reds:[],
        yellows:[]
    },
};