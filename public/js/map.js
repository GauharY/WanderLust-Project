// const map = new maplibregl.Map({
//     container: 'map',
//     style:
//         'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL',
//     center: [77.209, 28.6139],
//     zoom: 8
// });

// const marker = new maplibregl.Marker()
//     .setLngLat([12.550343, 55.665957])
//     .addTo(map);


const map = new maplibregl.Map({
        container: 'map',
        // Use a minimalist raster style
        style: {
            'version': 8,
            'name': 'Blank',
            'center': [0, 0],
            'zoom': 0,
            'sources': {
                'raster-tiles': {
                    'type': 'raster',
                    'tiles': ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                    'tileSize': 256,
                    'minzoom': 0,
                    'maxzoom': 19
                }
            },
            'layers': [
                {
                    'id': 'background',
                    'type': 'background',
                    'paint': {
                        'background-color': '#e0dfdf'
                    }
                },
                {
                    'id': 'simple-tiles',
                    'type': 'raster',
                    'source': 'raster-tiles'
                }
            ],
            'id': 'blank'
        },
        center: [77.209, 28.6139],
        zoom: 15.99,
        pitch: 40,
        bearing: 20,
        canvasContextAttributes: {antialias: true}
    });

    const geocoderApi = {
        forwardGeocode: async (config) => {
            const features = [];
            try {
                const request =
            `https://nominatim.openstreetmap.org/search?q=${
                config.query
            }&format=geojson&polygon_geojson=1&addressdetails=1`;
                const response = await fetch(request);
                const geojson = await response.json();
                for (const feature of geojson.features) {
                    const center = [
                        feature.bbox[0] +
                    (feature.bbox[2] - feature.bbox[0]) / 2,
                        feature.bbox[1] +
                    (feature.bbox[3] - feature.bbox[1]) / 2
                    ];
                    const point = {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: center
                        },
                        place_name: feature.properties.display_name,
                        properties: feature.properties,
                        text: feature.properties.display_name,
                        place_type: ['place'],
                        center
                    };
                    features.push(point);
                }
            } catch (e) {
                console.error(`Failed to forwardGeocode with error: ${e}`);
            }

            return {
                features
            };
        }
    };
    map.addControl(
        new MaplibreGeocoder(geocoderApi, {
            maplibregl
        })
    );