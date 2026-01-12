let propertyMap = null;
let mapMarkers = [];

const propertiesData = [
  {
    id: 1,
    name: 'Villa Moderne Zone 1',
    lat: 12.3737,
    lng: -1.5197,
    type: 'Villa',
    price: 750000,
    rooms: 5,
    surface: 185,
    city: 'Ouagadougou'
  },
  {
    id: 2,
    name: 'Appartement Centre-ville',
    lat: 12.3656,
    lng: -1.5197,
    type: 'Appartement',
    price: 450000,
    rooms: 3,
    surface: 95,
    city: 'Ouagadougou'
  },
  {
    id: 3,
    name: 'Studio Moderne Zone 2',
    lat: 12.3800,
    lng: -1.5150,
    type: 'Studio',
    price: 250000,
    rooms: 1,
    surface: 45,
    city: 'Ouagadougou'
  },
  {
    id: 4,
    name: 'Maison 4 chambres',
    lat: 12.3650,
    lng: -1.5300,
    type: 'Maison',
    price: 650000,
    rooms: 4,
    surface: 150,
    city: 'Ouagadougou'
  },
  {
    id: 5,
    name: 'Villa Luxe Secteur 16',
    lat: 12.3720,
    lng: -1.5100,
    type: 'Villa',
    price: 1200000,
    rooms: 6,
    surface: 250,
    city: 'Ouagadougou'
  }
];

function initMap() {
  if (!document.getElementById('propertyMap')) return;

  propertyMap = L.map('propertyMap').setView([12.3737, -1.5197], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(propertyMap);

  addPropertyMarkers();
  propertyMap.invalidateSize();
}

function addPropertyMarkers() {
  clearMapMarkers();

  propertiesData.forEach(property => {
    const marker = L.marker([property.lat, property.lng], {
      className: 'property-marker'
    }).addTo(propertyMap);

    const popupContent = createPopupContent(property);
    marker.bindPopup(popupContent, { 
      maxWidth: 300,
      className: 'property-popup'
    });

    marker.on('mouseover', () => marker.openPopup());
    marker.on('mouseout', () => marker.closePopup());

    mapMarkers.push(marker);
  });
}

function createPopupContent(property) {
  return `
    <div class="property-popup">
      <h4>${property.name}</h4>
      <p><strong>Type:</strong> ${property.type}</p>
      <p><strong>Localisation:</strong> ${property.city}</p>
      <div class="popup-features">
        <span><i class="fas fa-ruler-combined"></i> ${property.surface}m²</span>
        <span><i class="fas fa-bed"></i> ${property.rooms} pièce(s)</span>
      </div>
      <div class="popup-price">${property.price.toLocaleString()} FCFA/mois</div>
      <button class="btn btn-primary btn-small" style="width: 100%; margin-top: 0.75rem;" onclick="viewProperty(${property.id})">
        <i class="fas fa-eye"></i> Voir détails
      </button>
    </div>
  `;
}

function clearMapMarkers() {
  mapMarkers.forEach(marker => {
    propertyMap.removeLayer(marker);
  });
  mapMarkers = [];
}

function filterMapByLocation(location) {
  clearMapMarkers();

  const filtered = location 
    ? propertiesData.filter(p => p.city.toLowerCase() === location.toLowerCase())
    : propertiesData;

  filtered.forEach(property => {
    const marker = L.marker([property.lat, property.lng], {
      className: 'property-marker'
    }).addTo(propertyMap);

    const popupContent = createPopupContent(property);
    marker.bindPopup(popupContent, { 
      maxWidth: 300,
      className: 'property-popup'
    });

    marker.on('mouseover', () => marker.openPopup());
    marker.on('mouseout', () => marker.closePopup());

    mapMarkers.push(marker);
  });

  if (filtered.length > 0) {
    const bounds = L.latLngBounds(filtered.map(p => [p.lat, p.lng]));
    propertyMap.fitBounds(bounds, { padding: [50, 50] });
  }
}

function centerMapOnProperty(lat, lng) {
  if (propertyMap) {
    propertyMap.setView([lat, lng], 15);
  }
}

function viewProperty(id) {
  alert(`Affichage des détails de la propriété ${id}`);
}

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    initMap();

    const locationSelect = document.getElementById('location');
    if (locationSelect) {
      locationSelect.addEventListener('change', function() {
        filterMapByLocation(this.value);
      });
    }

    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
      searchButton.addEventListener('click', function() {
        const location = document.getElementById('location')?.value || '';
        filterMapByLocation(location);
      });
    }
  }, 500);
});

// Debounce utility to avoid calling expensive functions too often on resize
function debounce(fn, wait) {
  let t = null;
  return function(...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

// Ensure the map resizes correctly when the window changes size.
// This fixes cases where Leaflet tiles/controls are mispositioned after layout shifts.
const handleResize = debounce(function() {
  if (!propertyMap) return;
  try {
    propertyMap.invalidateSize();

    // If there are markers, refit bounds to keep them visible after resize
    if (mapMarkers && mapMarkers.length > 0) {
      const latLngs = mapMarkers.map(m => m.getLatLng());
      if (latLngs.length > 0) {
        const bounds = L.latLngBounds(latLngs);
        propertyMap.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  } catch (err) {
    // swallow errors silently; this is a best-effort resize handler
    console.warn('Map resize error:', err);
  }
}, 200);

window.addEventListener('resize', handleResize);
