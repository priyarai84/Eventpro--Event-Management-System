// ================================================
//   EventPro - Main JavaScript File
//   Project  : EventPro - Event Management Website
//   Developer: Priya Rai
//   Email    : priyarai0804@gmail.com
//   Phone    : 9129931077
// ================================================

// ── API Base URL ──────────────────────────────────────
// Change this to your Railway URL after deployment
const API_URL = 'http://localhost:5000/api';

// ── API Helper Function ───────────────────────────────
async function api(endpoint, method = 'GET', body = null, auth = true) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = localStorage.getItem('ep_token');
    if (token) headers['Authorization'] = 'Bearer ' + token;
  }
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  try {
    const res  = await fetch(API_URL + endpoint, opts);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Something went wrong');
    return data;
  } catch (err) {
    if (err.message === 'Failed to fetch') {
      console.warn('⚠️ Backend not reachable — running in offline mode');
      return null;
    }
    throw err;
  }
}

// ── Button Loading State ──────────────────────────────
function setLoading(btn, loading) {
  if (loading) {
    btn.disabled    = true;
    btn.dataset.orig = btn.innerText;
    btn.innerText   = '⏳ Please wait...';
  } else {
    btn.disabled  = false;
    btn.innerText = btn.dataset.orig || btn.innerText;
  }
}

// ════════════════════════════════════════════════════════
//   PHOTO / EVENT DATA
// ════════════════════════════════════════════════════════
const eventData = {
  Birthday: {
    emoji: '🎂',
    subtitle: 'Celebrate every moment — browse our birthday setups',
    photos: [
      { url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600', caption: 'Balloon Decoration' },
      { url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600', caption: 'Party Hall' },
      { url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600', caption: 'Theme Decoration' },
      { url: 'https://images.unsplash.com/photo-1481833761820-0509d3217039?w=600', caption: 'Flower Setup' },
      { url: 'https://images.unsplash.com/photo-1567696153798-9111f9cd3d0d?w=600', caption: 'Candle Decor' },
      { url: 'https://images.unsplash.com/photo-1533294455009-a77b7557d2d1?w=600', caption: 'Birthday Night' },
    ]
  },
  Wedding: {
    emoji: '💍',
    subtitle: 'Your dream wedding — explore our beautiful arrangements',
    photos: [
      { url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600', caption: 'Wedding Stage' },
      { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600', caption: 'Floral Mandap' },
      { url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600', caption: 'Reception Decor' },
      { url: 'https://images.unsplash.com/photo-1511285560929-80b456503681?w=600', caption: 'Couple Photography' },
      { url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600', caption: 'Bridal Entry' },
      { url: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69c837?w=600', caption: 'Dinner Setup' },
    ]
  },
  Corporate: {
    emoji: '🏢',
    subtitle: 'Professional events, seamless execution — see our work',
    photos: [
      { url: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600', caption: 'Conference Setup' },
      { url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600', caption: 'Corporate Summit' },
      { url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600', caption: 'Award Ceremony' },
      { url: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=600', caption: 'Team Building' },
      { url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600', caption: 'Seminar Hall' },
      { url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600', caption: 'Exhibition Stall' },
    ]
  }
};

// Flat array for gallery page
const allGallery = [
  ...eventData.Birthday.photos.map(p => ({ ...p, cat: 'Birthday' })),
  ...eventData.Wedding.photos.map(p  => ({ ...p, cat: 'Wedding'  })),
  ...eventData.Corporate.photos.map(p => ({ ...p, cat: 'Corporate' })),
];

// ════════════════════════════════════════════════════════
//   INIT — runs when page loads
// ════════════════════════════════════════════════════════
window.onload = async function () {
  // Hide splash after 2 seconds
  setTimeout(() => {
    splash.style.opacity = '0';
    setTimeout(() => splash.style.display = 'none', 600);
  }, 2000);

  await initSession();
  buildGallery('All');
};

// Verify JWT token with backend on load
async function initSession() {
  const token = localStorage.getItem('ep_token');
  if (!token) { showProfile(null); return; }
  try {
    const data = await api('/auth/me');
    if (data && data.user) {
      localStorage.setItem('ep_user', JSON.stringify(data.user));
      showProfile(data.user);
    } else {
      localStorage.removeItem('ep_token');
      localStorage.removeItem('ep_user');
      showProfile(null);
    }
  } catch (e) {
    // If backend is offline use cached user
    const cached = localStorage.getItem('ep_user');
    showProfile(cached ? JSON.parse(cached) : null);
  }
}

// ════════════════════════════════════════════════════════
//   HERO SLIDER with dots
// ════════════════════════════════════════════════════════
let slides = document.querySelectorAll('.slide'), si = 0;

function goToSlide(index) {
  slides[si].classList.remove('active');
  document.querySelectorAll('.hero-dot')[si].classList.remove('active');
  si = index;
  slides[si].classList.add('active');
  document.querySelectorAll('.hero-dot')[si].classList.add('active');
}

setInterval(() => {
  goToSlide((si + 1) % slides.length);
}, 4000);

// ════════════════════════════════════════════════════════
//   NAVIGATION — show / hide page sections
// ════════════════════════════════════════════════════════
function showSection(name) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-links div').forEach(d => d.classList.remove('active'));
  document.getElementById('sec-' + name).classList.add('active');
  document.getElementById('nav-' + name).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ════════════════════════════════════════════════════════
//   GALLERY — build and filter
// ════════════════════════════════════════════════════════
function buildGallery(filter) {
  const grid  = document.getElementById('galleryGrid');
  grid.innerHTML = '';
  const items = filter === 'All' ? allGallery : allGallery.filter(p => p.cat === filter);
  items.forEach(photo => {
    const div       = document.createElement('div');
    div.className   = 'gal-item';
    div.innerHTML   = `
      <img src="${photo.url}" alt="${photo.caption}" loading="lazy">
      <div class="cat-badge">${photo.cat}</div>
      <div class="gal-overlay"><span>🔍 ${photo.caption}</span></div>
    `;
    div.onclick = () => openLightbox(photo.url);
    grid.appendChild(div);
  });
}

function filterGallery(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  buildGallery(cat);
}

// ════════════════════════════════════════════════════════
//   EVENT DETAIL PAGE (Gallery + Booking)
// ════════════════════════════════════════════════════════
function openEventPage(type) {
  const data = eventData[type];
  epTitle.innerText    = data.emoji + ' ' + type + ' Events';
  epSubtitle.innerText = data.subtitle;
  bEventType.value     = type;
  bPackage.value       = '';
  document.querySelectorAll('.pkg-btn').forEach(b => b.classList.remove('active'));

  // Build photo grid
  photoGrid.innerHTML = '';
  data.photos.forEach(photo => {
    const div     = document.createElement('div');
    div.className = 'photo-item';
    div.innerHTML = `
      <img src="${photo.url}" alt="${photo.caption}" loading="lazy">
      <div class="photo-overlay"><span>🔍 ${photo.caption}</span></div>
    `;
    div.querySelector('img').onclick = () => openLightbox(photo.url);
    photoGrid.appendChild(div);
  });

  // Reset steps
  document.getElementById('bookingStep1').style.display = 'block';
  document.getElementById('bookingStep2').style.display = 'none';

  // Show booking form only if logged in
  const isLoggedIn = !!localStorage.getItem('ep_token');
  document.getElementById('loginRequiredBanner').style.display = isLoggedIn ? 'none'  : 'block';
  document.getElementById('bookingFormSection').style.display  = isLoggedIn ? 'block' : 'none';

  eventPage.style.display      = 'block';
  eventPage.scrollTop          = 0;
  document.body.style.overflow = 'hidden';
}

function closeEventPage() {
  eventPage.style.display      = 'none';
  document.body.style.overflow = '';
}

function selectPkg(btn, pkg) {
  document.querySelectorAll('.pkg-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  bPackage.value = pkg;
}

// ── Live advance calculation ──────────────────────────
function updateAdvance() {
  const amt     = Number(document.getElementById('bAmount').value) || 0;
  const advance = Math.round(amt * 0.20);
  const remain  = amt - advance;
  const box     = document.getElementById('advanceInfoBox');

  if (amt > 0) {
    box.style.display = 'block';
    document.getElementById('advTotal').innerText     = '₹' + amt.toLocaleString('en-IN');
    document.getElementById('advAmount').innerText    = '₹' + advance.toLocaleString('en-IN');
    document.getElementById('advRemaining').innerText = '₹' + remain.toLocaleString('en-IN');
  } else {
    box.style.display = 'none';
  }
}

// ── Step 1 → Step 2 ───────────────────────────────────
function goToPayment() {
  const name  = document.getElementById('bName').value.trim();
  const phone = document.getElementById('bPhone').value.trim();
  const date  = document.getElementById('bDate').value;
  const amt   = document.getElementById('bAmount').value.trim();
  const place = document.getElementById('bPlace').value.trim();
  const pkg   = bPackage.value;

  if (!name || !phone || !date || !amt || !place) { showToast('⚠️ Please fill all fields'); return; }
  if (phone.length !== 10) { showToast('⚠️ Enter valid 10-digit phone number'); return; }
  if (!pkg) { showToast('⚠️ Please select a package'); return; }

  const total   = Number(amt);
  const advance = Math.round(total * 0.20);

  // Update payment step UI
  document.getElementById('payAmountDisplay').innerText = '₹' + advance.toLocaleString('en-IN');
  document.getElementById('payAmountSub').innerText     = `20% of ₹${total.toLocaleString('en-IN')} total budget`;

  // Update QR code with actual amount
  document.getElementById('qrImg').src =
    `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=priyarai0804@okicici%26pn=EventPro%26am=${advance}%26cu=INR`;

  // Switch to step 2
  document.getElementById('bookingStep1').style.display = 'none';
  document.getElementById('bookingStep2').style.display = 'block';
  document.getElementById('bookingFormSection').scrollIntoView({ behavior: 'smooth' });
}

function backToBooking() {
  document.getElementById('bookingStep1').style.display = 'block';
  document.getElementById('bookingStep2').style.display = 'none';
}

// ── Payment tabs ──────────────────────────────────────
function switchPayTab(tab) {
  document.getElementById('tabUpi').classList.toggle('active',  tab === 'upi');
  document.getElementById('tabBank').classList.toggle('active', tab === 'bank');
  document.getElementById('payUpi').style.display  = tab === 'upi'  ? 'block' : 'none';
  document.getElementById('payBank').style.display = tab === 'bank' ? 'block' : 'none';
}

// ── Copy UPI ID ───────────────────────────────────────
function copyUpiId() {
  const upiId = document.getElementById('upiIdText').innerText;
  navigator.clipboard.writeText(upiId).then(() => {
    showToast('✅ UPI ID copied to clipboard!');
  }).catch(() => {
    showToast('UPI ID: ' + upiId);
  });
}

// ── Submit Final Booking → POST /api/bookings ─────────
async function submitBooking() {
  const name  = document.getElementById('bName').value.trim();
  const phone = document.getElementById('bPhone').value.trim();
  const date  = document.getElementById('bDate').value;
  const amt   = document.getElementById('bAmount').value.trim();
  const place = document.getElementById('bPlace').value.trim();
  const etype = bEventType.value;
  const pkg   = bPackage.value;
  const txnId = document.getElementById('bTxnId').value.trim();

  if (!txnId) { showToast('⚠️ Please enter Transaction / Reference ID'); return; }

  const total   = Number(amt);
  const advance = Math.round(total * 0.20);

  const btn = document.querySelector('.book-submit-btn');
  setLoading(btn, true);

  try {
    const data = await api('/bookings', 'POST', {
      name, phone, eventType: etype,
      package: pkg, eventDate: date,
      venue: place, budget: total,
      advanceAmount: advance, txnId
    });

    if (data) {
      showToast('🎉 Booking Confirmed! We\'ll call you soon.');
    } else {
      let local = JSON.parse(localStorage.getItem('ep_local_bookings') || '[]');
      local.push({
        id: 'BK' + Date.now(),
        name, phone, date, amount: amt, place,
        event: etype, package: pkg,
        advanceAmount: advance, txnId,
        status: 'pending',
        time: new Date().toLocaleString()
      });
      localStorage.setItem('ep_local_bookings', JSON.stringify(local));
      showToast('🎉 Booking saved! Will sync when connected.');
    }

    // Reset form
    document.getElementById('bName').value  = '';
    document.getElementById('bPhone').value = '';
    document.getElementById('bDate').value  = '';
    document.getElementById('bAmount').value = '';
    document.getElementById('bPlace').value = '';
    document.getElementById('bTxnId').value = '';
    bPackage.value = '';
    document.querySelectorAll('.pkg-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('advanceInfoBox').style.display = 'none';

    // Go back to step 1
    document.getElementById('bookingStep1').style.display = 'block';
    document.getElementById('bookingStep2').style.display = 'none';

    setTimeout(() => closeEventPage(), 1500);
  } catch (err) {
    showToast('⚠️ ' + err.message);
  } finally {
    setLoading(btn, false);
  }
}

// ════════════════════════════════════════════════════════
//   CONTACT FORM → POST /api/contact
// ════════════════════════════════════════════════════════
async function submitContact() {
  const n = cfName.value.trim();
  const p = cfPhone.value.trim();
  const m = cfMsg.value.trim();
  if (!n || !p || !m) { showToast('⚠️ Name, phone and message are required'); return; }

  const btn = document.querySelector('.cf-submit');
  setLoading(btn, true);
  try {
    await api('/contact', 'POST', {
      name: n, phone: p,
      email: cfEmail.value.trim(),
      eventType: cfEvent.value,
      message: m
    }, false);
    cfName.value = ''; cfPhone.value = ''; cfEmail.value = ''; cfEvent.value = ''; cfMsg.value = '';
    showToast('✅ Message sent! We will contact you soon.');
  } catch (err) {
    showToast('⚠️ ' + err.message);
  } finally {
    setLoading(btn, false);
  }
}

// ════════════════════════════════════════════════════════
//   LIGHTBOX
// ════════════════════════════════════════════════════════
function openLightbox(url)  { lightboxImg.src = url; lightbox.classList.add('open'); }
function closeLightbox()    { lightbox.classList.remove('open'); }

// ════════════════════════════════════════════════════════
//   TOAST NOTIFICATION
// ════════════════════════════════════════════════════════
function showToast(msg) {
  toast.innerText      = msg;
  toast.style.display  = 'block';
  setTimeout(() => toast.style.display = 'none', 3500);
}

// ════════════════════════════════════════════════════════
//   AUTH MODAL
// ════════════════════════════════════════════════════════
function openAuth(tab)            { authOverlay.classList.add('show'); switchTab(tab || 'login'); }
function closeAuth()              { authOverlay.classList.remove('show'); }
function handleOverlayClick(e)   { if (e.target === authOverlay) closeAuth(); }

function switchTab(tab) {
  if (tab === 'login') {
    authTitle.innerText    = 'Welcome Back';
    authSubtitle.innerText = 'Sign in to manage your events';
    tabLogin.classList.add('active');    tabRegister.classList.remove('active');
    loginBody.style.display = 'block';  registerBody.style.display = 'none';
    forgotPanel.classList.remove('active'); authTabs.style.display = 'flex';
  } else {
    authTitle.innerText    = 'Join EventPro';
    authSubtitle.innerText = 'Create your free account today';
    tabRegister.classList.add('active'); tabLogin.classList.remove('active');
    loginBody.style.display = 'none';   registerBody.style.display = 'block';
    forgotPanel.classList.remove('active'); authTabs.style.display = 'flex';
  }
}

function showForgot() {
  loginBody.style.display = 'none';
  authTabs.style.display  = 'none';
  authTitle.innerText     = 'Reset Password';
  authSubtitle.innerText  = 'Enter your registered email or phone';
  forgotPanel.classList.add('active');
}

function showForgotBack() {
  forgotPanel.classList.remove('active');
  authTabs.style.display = 'flex';
  switchTab('login');
}

// ── Register → POST /api/auth/register ───────────────
async function register() {
  const first = regFirst.value.trim();
  const last  = regLast.value.trim();
  const email = regEmail.value.trim();
  const phone = regPhone.value.trim();
  const pass  = regPass.value;

  if (!first)          { showToast('Enter your first name'); return; }
  if (!email && !phone){ showToast('Enter email or phone number'); return; }
  if (pass.length < 6) { showToast('Password must be 6+ characters'); return; }

  const btn = document.querySelector('#registerBody .auth-btn');
  setLoading(btn, true);

  try {
    const data = await api('/auth/register', 'POST',
      { firstName: first, lastName: last, email, phone, password: pass }, false);

    if (data) {
      localStorage.setItem('ep_token', data.token);
      localStorage.setItem('ep_user',  JSON.stringify(data.user));
      closeAuth();
      showProfile(data.user);
      showToast('Account Created! Welcome to EventPro 🎉');
    } else {
      // Offline fallback
      const u = { firstName: first, lastName: last, email, phone, pass, city: '' };
      if (email) localStorage.setItem('of_user_' + email, JSON.stringify(u));
      if (phone) localStorage.setItem('of_user_' + phone, JSON.stringify(u));
      const fakeUser = { firstName: first, lastName: last, fullName: first + ' ' + last, email, phone };
      localStorage.setItem('ep_user',  JSON.stringify(fakeUser));
      localStorage.setItem('ep_token', 'offline');
      closeAuth();
      showProfile(fakeUser);
      showToast('Account Created (offline mode) 🎉');
    }
  } catch (err) {
    showToast('⚠️ ' + err.message);
  } finally {
    setLoading(btn, false);
  }
}

// ── Login → POST /api/auth/login ─────────────────────
async function login() {
  const id   = loginId.value.trim();
  const pass = loginPass.value;
  if (!id || !pass) { showToast('Please fill all fields'); return; }

  const btn = document.querySelector('#loginBody .auth-btn');
  setLoading(btn, true);

  try {
    const data = await api('/auth/login', 'POST', { identifier: id, password: pass }, false);

    if (data) {
      localStorage.setItem('ep_token', data.token);
      localStorage.setItem('ep_user',  JSON.stringify(data.user));
      closeAuth();
      showProfile(data.user);
      showToast('Welcome back! 👋');
    } else {
      // Offline fallback
      const raw = localStorage.getItem('of_user_' + id);
      if (raw) {
        const u = JSON.parse(raw);
        if (u.pass === pass) {
          const fu = { firstName: u.firstName, lastName: u.lastName, fullName: u.firstName + ' ' + u.lastName, email: u.email, phone: u.phone };
          localStorage.setItem('ep_user',  JSON.stringify(fu));
          localStorage.setItem('ep_token', 'offline');
          closeAuth(); showProfile(fu); showToast('Welcome back! (offline) 👋');
        } else { showToast('Incorrect credentials.'); }
      } else { showToast('Backend not reachable. Please try again.'); }
    }

    // If event detail page is open, show booking form
    if (eventPage.style.display === 'block') {
      document.getElementById('loginRequiredBanner').style.display = 'none';
      document.getElementById('bookingFormSection').style.display  = 'block';
    }
  } catch (err) {
    showToast('⚠️ ' + err.message);
  } finally {
    setLoading(btn, false);
  }
}

// ── Forgot Password → POST /api/auth/forgot-password ─
async function resetPass() {
  const id = forgotId.value.trim();
  const np = newPass.value;
  if (!id || !np) { showToast('Please fill all fields'); return; }
  if (np.length < 6) { showToast('Password too short'); return; }

  const btn = document.querySelector('#forgotPanel .auth-btn');
  setLoading(btn, true);
  try {
    const data = await api('/auth/forgot-password', 'POST', { identifier: id, newPassword: np }, false);
    showToast(data ? '✅ Password reset successfully!' : '✅ Password reset (offline).');
    switchTab('login');
  } catch (err) {
    showToast('⚠️ ' + err.message);
  } finally {
    setLoading(btn, false);
  }
}

// ════════════════════════════════════════════════════════
//   PROFILE — show in navbar after login
// ════════════════════════════════════════════════════════
function showProfile(user) {
  if (user) {
    const name = user.fullName || user.firstName || 'User';
    document.getElementById('loginNavBtn').style.display   = 'none';
    document.getElementById('userMenu').style.display      = 'block';
    document.getElementById('userAvatar').innerText        = name.charAt(0).toUpperCase();
    document.getElementById('userNameShort').innerText     = name.split(' ')[0];
    document.getElementById('dropdownName').innerText      = name;
  } else {
    document.getElementById('loginNavBtn').style.display   = 'block';
    document.getElementById('userMenu').style.display      = 'none';
  }
}

function toggleDropdown() { document.getElementById('userMenu').classList.toggle('open'); }

// Close dropdown when clicking outside
document.addEventListener('click', function (e) {
  const m = document.getElementById('userMenu');
  if (m && !m.contains(e.target)) m.classList.remove('open');
});

function logout() {
  localStorage.removeItem('ep_token');
  localStorage.removeItem('ep_user');
  location.reload();
}

// ════════════════════════════════════════════════════════
//   SETTINGS MODAL
// ════════════════════════════════════════════════════════
async function openSettings() {
  document.getElementById('userMenu').classList.remove('open');

  // Pre-fill from cached data
  const user = JSON.parse(localStorage.getItem('ep_user') || '{}');
  document.getElementById('sFirst').value = user.firstName || '';
  document.getElementById('sLast').value  = user.lastName  || '';
  document.getElementById('sEmail').value = user.email     || '';
  document.getElementById('sPhone').value = user.phone     || '';
  document.getElementById('sCity').value  = user.city      || '';

  // Fetch fresh data from backend
  try {
    const data = await api('/auth/me');
    if (data && data.user) {
      const u = data.user;
      document.getElementById('sFirst').value = u.firstName || '';
      document.getElementById('sLast').value  = u.lastName  || '';
      document.getElementById('sEmail').value = u.email     || '';
      document.getElementById('sPhone').value = u.phone     || '';
      document.getElementById('sCity').value  = u.city      || '';
      if (u.notifications) {
        document.getElementById('sEmailNotif').value = u.notifications.email ? 'on' : 'off';
        document.getElementById('sSmsNotif').value   = u.notifications.sms   ? 'on' : 'off';
      }
      localStorage.setItem('ep_user', JSON.stringify(u));
    }
  } catch (e) {}

  document.getElementById('settingsOverlay').classList.add('show');
}

function closeSettings()        { document.getElementById('settingsOverlay').classList.remove('show'); }
function handleSettingsClick(e) { if (e.target === document.getElementById('settingsOverlay')) closeSettings(); }

// ── Save Profile → PUT /api/auth/update-profile ───────
async function saveProfile() {
  const first = document.getElementById('sFirst').value.trim();
  const last  = document.getElementById('sLast').value.trim();
  const email = document.getElementById('sEmail').value.trim();
  const phone = document.getElementById('sPhone').value.trim();
  const city  = document.getElementById('sCity').value.trim();
  if (!first) { showToast('First name is required'); return; }

  const btn = document.querySelectorAll('.settings-save-btn')[0];
  setLoading(btn, true);
  try {
    const data = await api('/auth/update-profile', 'PUT', { firstName: first, lastName: last, email, phone, city });
    const updated = { ...JSON.parse(localStorage.getItem('ep_user') || '{}'), firstName: first, lastName: last, email, phone, city, fullName: first + ' ' + last };
    localStorage.setItem('ep_user', JSON.stringify(updated));
    showProfile(updated);
    showToast(data ? '✅ Profile saved successfully!' : '✅ Profile saved (offline)!');
  } catch (err) {
    showToast('⚠️ ' + err.message);
  } finally {
    setLoading(btn, false);
  }
}

// ── Change Password → PUT /api/auth/change-password ───
async function changePassword() {
  const curr = document.getElementById('sCurrPass').value;
  const newp = document.getElementById('sNewPass').value;
  const conf = document.getElementById('sConfPass').value;
  if (!curr || !newp || !conf) { showToast('Please fill all password fields'); return; }
  if (newp.length < 6)         { showToast('New password must be 6+ characters'); return; }
  if (newp !== conf)           { showToast('Passwords do not match'); return; }

  const btn = document.querySelectorAll('.settings-save-btn')[1];
  setLoading(btn, true);
  try {
    await api('/auth/change-password', 'PUT', { currentPassword: curr, newPassword: newp });
    document.getElementById('sCurrPass').value = '';
    document.getElementById('sNewPass').value  = '';
    document.getElementById('sConfPass').value = '';
    showToast('✅ Password updated successfully!');
  } catch (err) {
    showToast('⚠️ ' + err.message);
  } finally {
    setLoading(btn, false);
  }
}

// ── Notifications → PUT /api/auth/notifications ───────
async function saveNotifications() {
  const emailOn = document.getElementById('sEmailNotif').value === 'on';
  const smsOn   = document.getElementById('sSmsNotif').value   === 'on';
  const btn     = document.querySelectorAll('.settings-save-btn')[2];
  setLoading(btn, true);
  try {
    await api('/auth/notifications', 'PUT', { email: emailOn, sms: smsOn });
    showToast('✅ Notification preferences saved!');
  } catch (e) {
    showToast('✅ Preferences saved (offline)!');
  } finally {
    setLoading(btn, false);
  }
}

// ── Delete Account ─────────────────────────────────────
async function deleteAccount() {
  if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
  try { await api('/auth/delete-account', 'DELETE'); } catch (e) {}
  localStorage.removeItem('ep_token');
  localStorage.removeItem('ep_user');
  showToast('Account deleted.');
  setTimeout(() => location.reload(), 1500);
}

// ════════════════════════════════════════════════════════
//   MY BOOKINGS → GET /api/bookings/my
// ════════════════════════════════════════════════════════
async function openMyBookings() {
  document.getElementById('userMenu').classList.remove('open');
  const el = document.getElementById('bookingsContent');
  el.innerHTML = '<p class="no-bookings">⏳ Loading your bookings...</p>';
  document.getElementById('bookingsOverlay').classList.add('show');

  try {
    const data   = await api('/bookings/my');
    let bookings = [];

    if (data && data.bookings) {
      bookings = data.bookings;
    } else {
      bookings = JSON.parse(localStorage.getItem('ep_local_bookings') || '[]');
    }

    if (bookings.length === 0) {
      el.innerHTML = '<p class="no-bookings">No bookings yet. Book your first event! 🎉</p>';
    } else {
      const statusColor = {
        pending:   '#f39c12',
        confirmed: '#27ae60',
        cancelled: '#e74c3c',
        completed: '#2980b9'
      };

      el.innerHTML = `
        <div class="bookings-table-wrap">
          <table class="bookings-table">
            <thead>
              <tr>
                <th>Event</th><th>Package</th><th>Date</th>
                <th>Venue</th><th>Budget</th><th>Advance</th>
                <th>Txn ID</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${bookings.map(b => {
                const status   = b.status || 'pending';
                const date     = b.eventDate
                  ? new Date(b.eventDate).toLocaleDateString('en-IN')
                  : (b.date || '-');
                const budget   = Number(b.budget || b.amount || 0);
                const advance  = b.advanceAmount || Math.round(budget * 0.20);
                const canCancel = status !== 'cancelled' && status !== 'completed';
                const bId      = b._id || b.id || '';

                return `<tr>
                  <td>${b.eventType || b.event || '-'}</td>
                  <td>${b.package || '-'}</td>
                  <td>${date}</td>
                  <td>${b.venue || b.place || '-'}</td>
                  <td>₹${budget.toLocaleString('en-IN')}</td>
                  <td style="color:#27ae60;font-weight:600;">₹${advance.toLocaleString('en-IN')}</td>
                  <td style="font-size:11px;color:#888;">${b.txnId || '-'}</td>
                  <td>
                    <span style="color:${statusColor[status] || '#333'};font-weight:600;text-transform:capitalize">
                      ${status}
                    </span>
                  </td>
                  <td>
                    ${canCancel
                      ? `<button class="cancel-booking-btn"
                           onclick="openCancelModal('${bId}', '${b.eventType || b.event}', '${date}')">
                           🚫 Cancel
                         </button>`
                      : `<span style="font-size:11px;color:#aaa;">—</span>`
                    }
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>`;
    }
  } catch (err) {
    el.innerHTML = '<p class="no-bookings">⚠️ Could not load bookings. Please try again.</p>';
  }
}

function closeMyBookings()      { document.getElementById('bookingsOverlay').classList.remove('show'); }
function handleBookingsClick(e) { if (e.target === document.getElementById('bookingsOverlay')) closeMyBookings(); }

// ════════════════════════════════════════════════════════
//   CANCEL BOOKING
// ════════════════════════════════════════════════════════
function openCancelModal(bookingId, eventType, date) {
  document.getElementById('cancelBookingId').value   = bookingId;
  document.getElementById('cancelBookingInfo').innerText =
    `${eventType} booking on ${date}`;
  document.getElementById('cancelOverlay').classList.add('show');
}

function closeCancelModal() {
  document.getElementById('cancelOverlay').classList.remove('show');
}

function handleCancelClick(e) {
  if (e.target === document.getElementById('cancelOverlay')) closeCancelModal();
}

async function confirmCancel() {
  const bookingId = document.getElementById('cancelBookingId').value;
  const btn = document.querySelector('#cancelOverlay .danger-btn');
  setLoading(btn, true);

  try {
    // Try API cancel
    const data = await api(`/bookings/${bookingId}/cancel`, 'PUT');

    if (data) {
      showToast('✅ Booking cancelled. Refund in 5–7 working days.');
    } else {
      // Offline: update local bookings
      let local = JSON.parse(localStorage.getItem('ep_local_bookings') || '[]');
      local = local.map(b =>
        (b.id === bookingId || b._id === bookingId)
          ? { ...b, status: 'cancelled' }
          : b
      );
      localStorage.setItem('ep_local_bookings', JSON.stringify(local));
      showToast('✅ Booking cancelled (offline).');
    }

    closeCancelModal();
    // Refresh bookings list
    setTimeout(() => openMyBookings(), 500);
  } catch (err) {
    showToast('⚠️ ' + err.message);
  } finally {
    setLoading(btn, false);
  }
}