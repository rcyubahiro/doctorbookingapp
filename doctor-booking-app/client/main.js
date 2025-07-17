const API_URL = 'http://localhost:5000/api';

const registerBtn = document.getElementById('register-btn');
const loginBtn = document.getElementById('login-btn');
const bookBtn = document.getElementById('book-btn');
const logoutBtn = document.getElementById('logout-btn');

const registerMsg = document.getElementById('register-msg');
const loginMsg = document.getElementById('login-msg');
const bookingMsg = document.getElementById('booking-msg');

const bookingSection = document.getElementById('booking-section');
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');

const doctorsList = document.getElementById('doctors-list');

let token = localStorage.getItem('token') || null;
let currentUser = null;

function showMessage(elem, msg, isError = false) {
  elem.textContent = msg;
  elem.style.color = isError ? 'red' : 'green';
}

async function fetchDoctors() {
  const res = await fetch(`${API_URL}/doctors`);
  if (res.ok) {
    const doctors = await res.json();
    doctorsList.innerHTML = '';
    doctors.forEach(doc => {
      const option = document.createElement('option');
      option.value = doc._id;
      option.textContent = `${doc.userId.name} (${doc.specialization})`;
      doctorsList.appendChild(option);
    });
  }
}

async function register() {
  const name = document.getElementById('register-name').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;
  const role = document.getElementById('register-role').value;

  if (!name || !email || !password) {
    showMessage(registerMsg, 'Please fill all fields', true);
    return;
  }

  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role }),
  });

  if (res.ok) {
    showMessage(registerMsg, 'Registered successfully! You can now login.');
  } else {
    const data = await res.json();
    showMessage(registerMsg, data.msg || 'Registration failed', true);
  }
}

async function login() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    showMessage(loginMsg, 'Please enter email and password', true);
    return;
  }

  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (res.ok) {
    const data = await res.json();
    token = data.token;
    currentUser = data.user;
    localStorage.setItem('token', token);
    showMessage(loginMsg, 'Login successful');
    toggleSections(true);
    await fetchDoctors();
  } else {
    const data = await res.json();
    showMessage(loginMsg, data.msg || 'Login failed', true);
  }
}

async function bookAppointment() {
  if (!token) {
    showMessage(bookingMsg, 'You must be logged in', true);
    return;
  }
  const doctorId = doctorsList.value;
  const date = document.getElementById('booking-date').value;
  const time = document.getElementById('booking-time').value;

  if (!doctorId || !date || !time) {
    showMessage(bookingMsg, 'Please select doctor, date, and time', true);
    return;
  }

  const res = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ doctorId, date, time }),
  });

  if (res.ok) {
    showMessage(bookingMsg, 'Appointment booked successfully!');
  } else {
    const data = await res.json();
    showMessage(bookingMsg, data.msg || 'Booking failed', true);
  }
}

function toggleSections(isLoggedIn) {
  if (isLoggedIn) {
    bookingSection.classList.remove('hidden');
    loginSection.classList.add('hidden');
    registerSection.classList.add('hidden');
  } else {
    bookingSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
    registerSection.classList.remove('hidden');
  }
}

function logout() {
  token = null;
  currentUser = null;
  localStorage.removeItem('token');
  toggleSections(false);
  showMessage(loginMsg, 'Logged out');
}

registerBtn.addEventListener('click', register);
loginBtn.addEventListener('click', login);
bookBtn.addEventListener('click', bookAppointment);
logoutBtn.addEventListener('click', logout);

// On page load, check if token exists
if (token) {
  toggleSections(true);
  fetchDoctors();
} else {
  toggleSections(false);
}
