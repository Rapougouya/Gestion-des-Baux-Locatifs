// locataire-dashboard.js
// Sample data and logic to support the properties table, filtering and detail modal with Leaflet map

(function(){
    const sampleProperties = [
        {
            id: 'p1', name: 'Villa Koulouba', city: 'Ouagadougou', neighborhood: 'Zone 1', rent: 750000,
            address: 'Rue des Baobabs, Zone 1, Ouagadougou', lat: 12.365, lng: -1.527, size: '185m²', rooms: 5,
            features: ['Piscine','Garage','Jardin'], description: 'Belle villa moderne, proche du centre.', images: [
                'https://picsum.photos/id/1018/1200/800',
                'https://picsum.photos/id/1015/1200/800',
                'https://picsum.photos/id/1016/1200/800'
            ]
        },
        {
            id: 'p2', name: 'Appartement S 12', city: 'Ouagadougou', neighborhood: 'Almadies', rent: 450000,
            address: 'Almadies, Rue A, Ouagadougou', lat: 12.371, lng: -1.534, size: '85m²', rooms: 3,
            features: ['Ascenseur','Balcon'], description: 'Appartement lumineux dans résidence sécurisée.', images: [
                'https://picsum.photos/id/1025/1200/800',
                'https://picsum.photos/id/1027/1200/800'
            ]
        },
        {
            id: 'p3', name: 'Maison Tenkodogo', city: 'Tenkodogo', neighborhood: 'Centre', rent: 320000,
            address: 'Rue Principale, Tenkodogo', lat: 11.783, lng: -0.363, size: '120m²', rooms: 4,
            features: ['Parking'], description: 'Maison familiale proche des commodités.', images: [
                'https://picsum.photos/id/1035/1200/800',
                'https://picsum.photos/id/1033/1200/800',
                'https://picsum.photos/id/1031/1200/800'
            ]
        }
    ];

    let properties = sampleProperties.slice();
    let mapInstance = null;
    let marker = null;

    function q(sel){ return document.querySelector(sel); }
    function qAll(sel){ return Array.from(document.querySelectorAll(sel)); }

    function formatCurrency(n){ return new Intl.NumberFormat('fr-FR').format(n); }

    function populateCityNeighborhood(){
        const citySelect = q('#citySelect');
        const neighborhoodSelect = q('#neighborhoodSelect');
        const cities = Array.from(new Set(properties.map(p => p.city))).sort();
        citySelect.innerHTML = '<option value="">Toutes les villes</option>' + cities.map(c=>`<option value="${c}">${c}</option>`).join('');
        neighborhoodSelect.innerHTML = '<option value="">Tous les quartiers</option>';
    }

    function renderTable(list){
        const tbody = q('#propertiesTable tbody');
        if(!tbody) return;
        tbody.innerHTML = list.map(p=>`
            <tr data-id="${p.id}">
                <td><img src="${p.images && p.images[0] ? p.images[0] : 'https://picsum.photos/seed/${p.id}/240/160'}" alt="${p.name}" style="width:120px;height:80px;object-fit:cover;border-radius:8px;" class="table-thumb"/></td>
                <td>${p.name}<div style="color:var(--text-secondary); font-size:0.9rem">${p.address}</div></td>
                <td>${formatCurrency(p.rent)} FCFA</td>
                <td>${p.city}</td>
                <td>${p.neighborhood}</td>
                <td><button class="btn btn-outline btn-sm view-btn" data-id="${p.id}"><i class="fas fa-eye"></i> Voir</button></td>
            </tr>
        `).join('');

        qAll('.view-btn').forEach(btn=> btn.addEventListener('click', (e)=>{ openPropertyModal(btn.dataset.id); }));
    }

    function applyFilters(){
        const city = q('#citySelect').value;
        const neighborhood = q('#neighborhoodSelect').value;
        const term = q('#searchInput').value.trim().toLowerCase();
        let result = properties.slice();
        if(city) result = result.filter(p => p.city === city);
        if(neighborhood) result = result.filter(p => p.neighborhood === neighborhood);
        if(term) result = result.filter(p => (p.name + ' ' + p.address).toLowerCase().includes(term));
        renderTable(result);
    }

    function openPropertyModal(id){
        const p = properties.find(x=>x.id===id);
        if(!p) return;
        q('#modalTitle').textContent = p.name;
        q('#modalName').textContent = p.name;
        q('#modalAddress').textContent = p.address;
        q('#modalRent').textContent = formatCurrency(p.rent);
        q('#modalSize').textContent = p.size || '-';
        q('#modalRooms').textContent = p.rooms || '-';
        q('#modalFeatures').textContent = (p.features || []).join(', ');
        q('#modalDescription').textContent = p.description || '';
        q('#propertyImages').innerHTML = '';

        // Build image gallery
        const images = p.images && p.images.length ? p.images : ['https://picsum.photos/1200/800?random=1'];
        let current = 0;
        const galleryHtml = document.createElement('div');
        galleryHtml.className = 'property-gallery';
        galleryHtml.innerHTML = `
            <div class="gallery-main"><img src="${images[0]}" alt="${p.name} - 0"/></div>
            <div class="gallery-controls">
                <div>
                    <button class="gallery-btn" data-action="prev">◀</button>
                    <button class="gallery-btn" data-action="next">▶</button>
                </div>
                <div style="color:var(--text-secondary); font-size:0.9rem">${images.length} photo(s)</div>
            </div>
            <div class="gallery-thumbs">
                ${images.map((img, i)=>`<div class="gallery-thumb ${i===0? 'active':''}" data-index="${i}"><img src="${img}" alt="thumb-${i}"/></div>`).join('')}
            </div>
        `;
        q('#propertyImages').appendChild(galleryHtml);

        const mainImg = galleryHtml.querySelector('.gallery-main img');
        const thumbs = Array.from(galleryHtml.querySelectorAll('.gallery-thumb'));

        function showIndex(i){
            if(i < 0) i = images.length - 1;
            if(i >= images.length) i = 0;
            current = i;
            mainImg.src = images[current];
            thumbs.forEach(t=> t.classList.remove('active'));
            const active = thumbs.find(t=> Number(t.dataset.index) === current);
            if(active) active.classList.add('active');
            // ensure visible
            if(active && active.scrollIntoView) active.scrollIntoView({behavior:'smooth', inline:'center'});
        }

        galleryHtml.querySelectorAll('[data-action="prev"]').forEach(b=> b.addEventListener('click', ()=> showIndex(current-1)));
        galleryHtml.querySelectorAll('[data-action="next"]').forEach(b=> b.addEventListener('click', ()=> showIndex(current+1)));
        thumbs.forEach(t=> t.addEventListener('click', ()=> showIndex(Number(t.dataset.index))));

        // show modal
        q('#propertyModal').style.display = 'flex';

        // init map
        setTimeout(()=>{
            initMap(p.lat, p.lng);
        }, 50);
    }

    function closeModal(){
        q('#propertyModal').style.display = 'none';
        if(mapInstance){
            try{ mapInstance.remove(); }catch(e){}
            mapInstance = null; marker = null;
            q('#propertyMap').innerHTML = '';
        }
    }

    function initMap(lat, lng){
        if(!q('#propertyMap')) return;
        mapInstance = L.map('propertyMap').setView([lat, lng], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(mapInstance);
        marker = L.marker([lat, lng]).addTo(mapInstance);
    }

    function setupEvents(){
        q('#searchBtn').addEventListener('click', applyFilters);
        q('#citySelect').addEventListener('change', (e)=>{
            const city = e.target.value;
            const neighborhoods = Array.from(new Set(properties.filter(p=> !city || p.city===city).map(p=>p.neighborhood))).sort();
            q('#neighborhoodSelect').innerHTML = '<option value="">Tous les quartiers</option>' + neighborhoods.map(n=>`<option value="${n}">${n}</option>`).join('');
            applyFilters();
        });
        q('#neighborhoodSelect').addEventListener('change', applyFilters);
        q('#searchInput').addEventListener('keyup', (e)=>{ if(e.key === 'Enter') applyFilters(); });
        q('#closeModalBtn').addEventListener('click', closeModal);
        q('#propertyModal').addEventListener('click', (e)=>{ if(e.target === q('#propertyModal')) closeModal(); });
    }

    function refreshProperties(){
        // in real app fetch from API
        properties = sampleProperties.slice();
        populateCityNeighborhood();
        renderTable(properties);
    }

    // Init
    document.addEventListener('DOMContentLoaded', ()=>{
        populateCityNeighborhood();
        renderTable(properties);
        setupEvents();
        // expose refresh
        window.refreshProperties = refreshProperties;
        // expose opener for interactive UI (stat-cards, clickable panels)
        window.openPropertyModal = openPropertyModal;
    });

})();
