window.production = {
    mbToken: "",        // token assigned to you from MapBox
    mbStyle: "",        // mapbox style to apply to the map
    server: "",         // MQTT broker to connect to 
    port: "",           // MQTT broker port
    topic: "",          // MQTT broker topic to subscribe to
    radius: 50,         // radius in meters
    ttl: 8,             // time to live
    animate: 300,       // time in between to animate icons
    httpIn: "",         // http endpoint for changing subscription
    httpAuth: {
        username: "",   // username for http server access
        password: "",   // password for http server access
    }
};