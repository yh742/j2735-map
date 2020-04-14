const RoadLabels = {
    id: "road-label-navigations",
    type: "symbol",
    source: "composite",
    'source-layer': "road",
    minzoom: 13,
    filter: [
        "step",
        ["zoom"],
        [
            "match",
            ["get", "class"],
            ["motorway", "trunk", "primary", "secondary", "tertiary"],
            true,
            false
        ],
        15.25,
        [
            "match",
            ["get", "class"],
            [
                "motorway",
                "trunk",
                "primary",
                "secondary",
                "tertiary",
                "street"
            ],
            true,
            false
        ],
        16,
        [
            "match",
            ["get", "class"],
            [
                "motorway",
                "trunk",
                "primary",
                "secondary",
                "tertiary",
                "street",
                "street_limited"
            ],
            true,
            false
        ],
        16.5,
        [
            "match",
            ["get", "class"],
            ["pedestrian", "golf", "ferry", "aerialway", "path"],
            false,
            true
        ]
    ],
    layout: {
        'text-size': [
            "interpolate",
            ["linear"],
            ["zoom"],
            10,
            [
                "match",
                ["get", "class"],
                [
                    "motorway",
                    "trunk",
                    "primary",
                    "secondary",
                    "tertiary"
                ],
                11,
                [
                    "motorway_link",
                    "trunk_link",
                    "primary_link",
                    "secondary_link",
                    "tertiary_link",
                    "street",
                    "street_limited"
                ],
                8.8,
                7.15
            ],
            18,
            [
                "match",
                ["get", "class"],
                [
                    "motorway",
                    "trunk",
                    "primary",
                    "secondary",
                    "tertiary"
                ],
                17.6,
                [
                    "motorway_link",
                    "trunk_link",
                    "primary_link",
                    "secondary_link",
                    "tertiary_link",
                    "street",
                    "street_limited"
                ],
                15.400000000000002,
                14.3
            ],
            22,
            [
                "match",
                ["get", "class"],
                [
                    "motorway",
                    "trunk",
                    "primary",
                    "secondary",
                    "tertiary"
                ],
                55.00000000000001,
                [
                    "motorway_link",
                    "trunk_link",
                    "primary_link",
                    "secondary_link",
                    "tertiary_link",
                    "street",
                    "street_limited"
                ],
                44,
                33
            ]
        ],
        "text-max-angle": 30,
        "symbol-spacing": [
            "interpolate",
            ["linear"],
            ["zoom"],
            10,
            150,
            18,
            450,
            22,
            1500
        ],
        "text-font": [
            "Neue Haas Grotesk Display Std Regular",
            "Arial Unicode MS Regular"
        ],
        "symbol-placement": "line",
        "text-padding": 1,
        "text-rotation-alignment": "map",
        "text-pitch-alignment": "viewport",
        "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]],
        "text-letter-spacing": 0.01,
        "visibility": "visible",
    },
    paint: {
        "text-color": "hsl(0, 0%, 95%)",
        "text-halo-color": [
            "match",
            ["get", "class"],
            ["motorway", "trunk"],
            "hsla(214, 24%, 30%, 0.75)",
            "hsl(213, 9%, 19%)"
        ],
        "text-halo-width": 1,
        "text-halo-blur": 1
    }
}

export default RoadLabels;