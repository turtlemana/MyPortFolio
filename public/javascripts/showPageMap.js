mapboxgl.accessToken =mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [126.99440380763143, 37.58962158482022], // starting position [lng, lat]
    zoom: 15 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat([126.99440380763143, 37.58962158482022])
    .addTo(map)

