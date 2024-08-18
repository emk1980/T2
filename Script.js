const map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

map.on('click', function(e) {
    const latitude = e.latlng.lat;
    const longitude = e.latlng.lng;

    L.marker([latitude, longitude]).addTo(map)
        .bindPopup(`Latitude: ${latitude}, Longitude: ${longitude}`)
        .openPopup();

    // ارسال مختصات به سرور
    fetch('/add-location', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude, longitude }),
    }).then(response => response.json())
      .then(data => console.log('Location saved with ID:', data.id));
});
