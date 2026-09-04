const spotsData = [
  { id: 'A1', name: 'Downtown Garage A1', location: 'Downtown', status: 'available', price: '$5/hr', ev: true, cctv: true, disabled: false, type: 'car' },
  { id: 'A2', name: 'Downtown Garage A2', location: 'Downtown', status: 'occupied', price: '$5/hr', ev: false, cctv: true, disabled: true, type: 'car' },
  { id: 'B1', name: 'Mall Plaza B1', location: 'Mall', status: 'available', price: '$3/hr', ev: true, cctv: true, disabled: true, type: 'bike' },
  { id: 'B2', name: 'Mall Plaza B2', location: 'Mall', status: 'available', price: '$8/hr', ev: false, cctv: true, disabled: false, type: 'truck' },
  { id: 'C1', name: 'City Center C1', location: 'City Center', status: 'occupied', price: '$4/hr', ev: true, cctv: false, disabled: true, type: 'car' }
];

let bookings = JSON.parse(localStorage.getItem('myBookings')) || [];

document.addEventListener('DOMContentLoaded', () => {
  setupTheme();
  setupMobileMenu();
  
  if (document.getElementById('parking-grid')) renderMap();
  if (document.getElementById('parking-list')) renderCards(spotsData);
  if (document.getElementById('booking-form')) handleBookingForm();
  
  const urlParams = new URLSearchParams(window.location.search);
  const spotParam = urlParams.get('spot');
  if (spotParam && document.getElementById('book-spot-name')) {
    document.getElementById('book-spot-name').value = spotParam;
  }
});

function setupMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('header nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });
}

function renderMap() {
  const grid = document.getElementById('parking-grid');
  grid.innerHTML = '';
  spotsData.forEach(spot => {
    const div = document.createElement('div');
    div.className = `spot ${spot.status}`;
    div.innerText = spot.id;
    if (spot.status === 'available') {
      div.onclick = () => selectSpotForBooking(spot.name);
    }
    grid.appendChild(div);
  });
}

function renderCards(data) {
  const list = document.getElementById('parking-list');
  if(!list) return;
  list.innerHTML = '';
  data.forEach(spot => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${spot.name}</h3>
      <p>📍 Location: ${spot.location}</p>
      <p>💰 Price: ${spot.price}</p>
      <p>🚘 Type: ${spot.type.toUpperCase()}</p>
      <p>Features: ${spot.ev ? '⚡ EV ' : ''}${spot.cctv ? '🛡️ CCTV ' : ''}${spot.disabled ? '♿ Accessible' : ''}</p>
      <br>
      <button class="btn-primary" ${spot.status === 'occupied' ? 'disabled style="opacity:0.5"' : ''} 
        onclick="selectSpotForBooking('${spot.name}')">
        ${spot.status === 'available' ? 'Book Now' : 'Occupied'}
      </button>
    `;
    list.appendChild(card);
  });
}

function selectSpotForBooking(spotName) {
  window.location.href = `booking.html?spot=${encodeURIComponent(spotName)}`;
}

function searchLocation() {
  const input = document.getElementById('location-input');
  if (!input) return;
  const query = input.value.toLowerCase();
  const filtered = spotsData.filter(s => s.location.toLowerCase().includes(query));
  renderCards(filtered);
}

function findNearMe() {
  alert('📍 Fetching nearest spots based on GPS...');
  window.location.href = 'choose-parking.html';
}

function handleBookingForm() {
  document.getElementById('booking-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const spot = document.getElementById('book-spot-name').value;
    const time = document.getElementById('book-time').value;
    const type = document.getElementById('book-type').value;

    const booking = { id: Date.now(), spot, time, type };
    bookings.push(booking);
    localStorage.setItem('myBookings', JSON.stringify(bookings));
    
    showModal(`
      <p><strong>Status:</strong> Confirmed ✅</p>
      <p><strong>Spot:</strong> ${spot}</p>
      <p><strong>Time:</strong> ${time}</p>
      <p><strong>Rate Type:</strong> ${type}</p>
    `);
  });
}

function showModal(content) {
  document.getElementById('modal-details').innerHTML = content;
  document.getElementById('booking-modal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('booking-modal').style.display = 'none';
}

function openMyBookings() {
  if (bookings.length === 0) {
    showModal('<p>No active bookings found.</p>');
  } else {
    let html = bookings.map(b => `<div style="border-bottom:1px solid #ccc; margin-bottom:5px;">${b.spot} - ${b.time}</div>`).join('');
    showModal(html);
  }
}

function setupTheme() {
  const btn = document.getElementById('theme-toggle');
  const isDark = localStorage.getItem('theme') === 'dark';
  if(isDark) document.body.classList.add('dark-theme');
  
  if(btn) {
    btn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    btn.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      const activeDark = document.body.classList.contains('dark-theme');
      localStorage.setItem('theme', activeDark ? 'dark' : 'light');
      btn.innerHTML = activeDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    });
  }
}