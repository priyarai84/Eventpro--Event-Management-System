// ================================================
//   EventPro - Main JavaScript File
//   Developer: Priya Rai
//   FIXED:
//     1. slides initialization moved inside window.onload
//     2. setInterval moved inside window.onload (DOM ready ke baad)
//     3. API_URL fixed for localhost:5000
// ================================================

// ── API URL ───────────────────────────────────────
const API_URL = 'http://localhost:5000/api';

// ── API Helper ────────────────────────────────────
async function api(endpoint, method = 'GET', body = null, auth = true) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = localStorage.getItem('ep_token');
    if (token && token !== 'offline') {
      headers['Authorization'] = 'Bearer ' + token;
    }
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
      console.warn('⚠️ Backend not reachable — offline mode');
      return null;
    }
    throw err;
  }
}

// ── Button loading ────────────────────────────────
function setLoading(btn, loading) {
  if (!btn) return;
  if (loading) {
    btn.disabled     = true;
    btn.dataset.orig = btn.innerText;
    btn.innerText    = '⏳ Please wait...';
  } else {
    btn.disabled  = false;
    btn.innerText = btn.dataset.orig || btn.innerText;
  }
}

// ════════════════════════════════════════════════
//   EVENT DATA
// ════════════════════════════════════════════════
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

const allGallery = [
  ...eventData.Birthday.photos.map(p  => ({ ...p, cat: 'Birthday'  })),
  ...eventData.Wedding.photos.map(p   => ({ ...p, cat: 'Wedding'   })),
  ...eventData.Corporate.photos.map(p => ({ ...p, cat: 'Corporate' })),
];

// ════════════════════════════════════════════════
//   HERO SLIDER — variables declared here,
//   initialized inside window.onload
// ════════════════════════════════════════════════
let slides = [];
let si = 0;
let sliderInterval = null;

function goToSlide(index) {
  if (!slides.length) return;
  slides[si].classList.remove('active');
  const dots = document.querySelectorAll('.hero-dot');
  if (dots[si]) dots[si].classList.remove('active');
  si = index;
  slides[si].classList.add('active');
  if (dots[si]) dots[si].classList.add('active');
}

function startSlider() {
  slides = document.querySelectorAll('.slide');
  if (!slides.length) return;
  if (sliderInterval) clearInterval(sliderInterval);
  sliderInterval = setInterval(() => goToSlide((si + 1) % slides.length), 4000);
}

// ════════════════════════════════════════════════
//   PAGE LOAD — sab kuch yahan se shuru hoga
// ════════════════════════════════════════════════
window.onload = async function () {
  // Splash screen hide karo
  setTimeout(() => {
    const s = document.getElementById('splash');
    if (s) {
      s.style.opacity = '0';
      setTimeout(() => s.style.display = 'none', 600);
    }
  }, 2000);

  // Slider start karo (DOM ready hai ab)
  startSlider();

  // Session check karo
  await initSession();

  // Gallery banao
  buildGallery('All');
};

async function initSession() {
  const token = localStorage.getItem('ep_token');
  if (!token) { showProfile(null); return; }
  if (token === 'offline') {
    const cached = localStorage.getItem('ep_user');
    showProfile(cached ? JSON.parse(cached) : null);
    return;
  }
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
    const cached = localStorage.getItem('ep_user');
    showProfile(cached ? JSON.parse(cached) : null);
  }
}

// ════════════════════════════════════════════════
//   NAVIGATION
// ════════════════════════════════════════════════
function showSection(name) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-links div').forEach(d => d.classList.remove('active'));
  const sec = document.getElementById('sec-' + name);
  const nav = document.getElementById('nav-' + name);
  if (sec) sec.classList.add('active');
  if (nav) nav.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ════════════════════════════════════════════════
//   GALLERY
// ════════════════════════════════════════════════
function buildGallery(filter) {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const items = filter === 'All' ? allGallery : allGallery.filter(p => p.cat === filter);
  items.forEach(photo => {
    const div = document.createElement('div');
    div.className = 'gal-item';
    div.innerHTML = `
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
  if (btn) btn.classList.add('active');
  buildGallery(cat);
}

// ════════════════════════════════════════════════
//   EVENT DETAIL PAGE
// ════════════════════════════════════════════════
function openEventPage(type) {
  const data = eventData[type];
  if (!data) return;

  document.getElementById('epTitle').innerText    = data.emoji + ' ' + type + ' Events';
  document.getElementById('epSubtitle').innerText = data.subtitle;
  document.getElementById('bEventType').value     = type;
  document.getElementById('bPackage').value       = '';
  document.querySelectorAll('.pkg-btn').forEach(b => b.classList.remove('active'));

  const photoGrid = document.getElementById('photoGrid');
  photoGrid.innerHTML = '';
  data.photos.forEach(photo => {
    const div = document.createElement('div');
    div.className = 'photo-item';
    div.innerHTML = `
      <img src="${photo.url}" alt="${photo.caption}" loading="lazy">
      <div class="photo-overlay"><span>🔍 ${photo.caption}</span></div>
    `;
    div.querySelector('img').onclick = () => openLightbox(photo.url);
    photoGrid.appendChild(div);
  });

  document.getElementById('bookingStep1').style.display = 'block';
  document.getElementById('bookingStep2').style.display = 'none';

  const isLoggedIn = !!localStorage.getItem('ep_token');
  document.getElementById('loginRequiredBanner').style.display = isLoggedIn ? 'none'  : 'block';
  document.getElementById('bookingFormSection').style.display  = isLoggedIn ? 'block' : 'none';

  const ep = document.getElementById('eventPage');
  ep.style.display = 'block';
  ep.scrollTop     = 0;
  document.body.style.overflow = 'hidden';
}

function closeEventPage() {
  document.getElementById('eventPage').style.display = 'none';
  document.body.style.overflow = '';
}

function selectPkg(btn, pkg) {
  document.querySelectorAll('.pkg-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('bPackage').value = pkg;
}

function updateAdvance() {
  const amt    = Number(document.getElementById('bAmount').value) || 0;
  const adv    = Math.round(amt * 0.20);
  const remain = amt - adv;
  const box    = document.getElementById('advanceInfoBox');
  if (amt > 0) {
    box.style.display = 'block';
    document.getElementById('advTotal').innerText     = '₹' + amt.toLocaleString('en-IN');
    document.getElementById('advAmount').innerText    = '₹' + adv.toLocaleString('en-IN');
    document.getElementById('advRemaining').innerText = '₹' + remain.toLocaleString('en-IN');
  } else {
    box.style.display = 'none';
  }
}

function goToPayment() {
  const name  = document.getElementById('bName').value.trim();
  const phone = document.getElementById('bPhone').value.trim();
  const date  = document.getElementById('bDate').value;
  const amt   = document.getElementById('bAmount').value.trim();
  const place = document.getElementById('bPlace').value.trim();
  const pkg   = document.getElementById('bPackage').value;

  if (!name || !phone || !date || !amt || !place) { showToast('⚠️ Saare fields bharo'); return; }
  if (phone.length !== 10) { showToast('⚠️ 10 digit ka phone daalo'); return; }
  if (!pkg) { showToast('⚠️ Package select karo'); return; }

  const total = Number(amt);
  const adv   = Math.round(total * 0.20);

  document.getElementById('payAmountDisplay').innerText = '₹' + adv.toLocaleString('en-IN');
  document.getElementById('payAmountSub').innerText     = '20% of ₹' + total.toLocaleString('en-IN') + ' total budget';
  document.getElementById('qrImg').src =
    `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=priyarai0804@okicici%26pn=EventPro%26am=${adv}%26cu=INR`;

  document.getElementById('bookingStep1').style.display = 'none';
  document.getElementById('bookingStep2').style.display = 'block';
  document.getElementById('bookingFormSection').scrollIntoView({ behavior: 'smooth' });
}

function backToBooking() {
  document.getElementById('bookingStep1').style.display = 'block';
  document.getElementById('bookingStep2').style.display = 'none';
}

function switchPayTab(tab) {
  document.getElementById('tabUpi').classList.toggle('active',  tab === 'upi');
  document.getElementById('tabBank').classList.toggle('active', tab === 'bank');
  document.getElementById('payUpi').style.display  = tab === 'upi'  ? 'block' : 'none';
  document.getElementById('payBank').style.display = tab === 'bank' ? 'block' : 'none';
}

function copyUpiId() {
  const upiId = document.getElementById('upiIdText').innerText;
  navigator.clipboard.writeText(upiId)
    .then(() => showToast('✅ UPI ID copy ho gaya!'))
    .catch(() => showToast('UPI ID: ' + upiId));
}

// ── Booking Submit ────────────────────────────────
async function submitBooking() {
  const name  = document.getElementById('bName').value.trim();
  const phone = document.getElementById('bPhone').value.trim();
  const date  = document.getElementById('bDate').value;
  const amt   = document.getElementById('bAmount').value.trim();
  const place = document.getElementById('bPlace').value.trim();
  const etype = document.getElementById('bEventType').value;
  const pkg   = document.getElementById('bPackage').value;
  const txnId = document.getElementById('bTxnId').value.trim();

  if (!txnId) { showToast('⚠️ Transaction ID daalo'); return; }

  const total = Number(amt);
  const adv   = Math.round(total * 0.20);
  const btn   = document.querySelector('#bookingStep2 .book-submit-btn');
  setLoading(btn, true);

  try {
    const data = await api('/bookings', 'POST', {
      name, phone,
      eventType:     etype,
      package:       pkg,
      eventDate:     date,
      venue:         place,
      budget:        total,
      advanceAmount: adv,
      txnId
    });

    if (data) {
      showToast('🎉 Booking Confirm! Hum aapko call karenge.');
    } else {
      let local = JSON.parse(localStorage.getItem('ep_local_bookings') || '[]');
      local.push({ id: 'BK' + Date.now(), name, phone, date, amount: amt, place, event: etype, package: pkg, advanceAmount: adv, txnId, status: 'pending' });
      localStorage.setItem('ep_local_bookings', JSON.stringify(local));
      showToast('🎉 Booking save ho gayi!');
    }

    ['bName','bPhone','bDate','bAmount','bPlace','bTxnId'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('bPackage').value = '';
    document.querySelectorAll('.pkg-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('advanceInfoBox').style.display = 'none';
    document.getElementById('bookingStep1').style.display = 'block';
    document.getElementById('bookingStep2').style.display = 'none';
    setTimeout(() => closeEventPage(), 1500);
  } catch (err) {
    showToast('⚠️ ' + err.message);
  } finally {
    setLoading(btn, false);
  }
}

// ════════════════════════════════════════════════
//   CONTACT FORM
// ════════════════════════════════════════════════
async function submitContact() {
  const n = document.getElementById('cfName').value.trim();
  const p = document.getElementById('cfPhone').value.trim();
  const m = document.getElementById('cfMsg').value.trim();
  if (!n || !p || !m) { showToast('⚠️ Naam, phone aur message zaroori hai'); return; }

  const btn = document.querySelector('.cf-submit');
  setLoading(btn, true);
  try {
    await api('/contact', 'POST', {
      name: n, phone: p,
      email:     document.getElementById('cfEmail').value.trim(),
      eventType: document.getElementById('cfEvent').value,
      message:   m
    }, false);
    ['cfName','cfPhone','cfEmail','cfMsg'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('cfEvent').value = '';
    showToast('✅ Message bhej diya! Hum contact karenge.');
  } catch (err) {
    showToast('⚠️ ' + err.message);
  } finally {
    setLoading(btn, false);
  }
}

// ════════════════════════════════════════════════
//   LIGHTBOX
// ════════════════════════════════════════════════
function openLightbox(url) {
  document.getElementById('lightboxImg').src = url;
  document.getElementById('lightbox').classList.add('open');
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}

// ════════════════════════════════════════════════
//   TOAST
// ════════════════════════════════════════════════
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.innerText = msg;
  t.style.display = 'block';
  setTimeout(() => t.style.display = 'none', 3500);
}

// ════════════════════════════════════════════════
//   AUTH MODAL
// ════════════════════════════════════════════════
function openAuth(tab) {
  document.getElementById('authOverlay').classList.add('show');
  switchTab(tab || 'login');
}
function closeAuth() {
  document.getElementById('authOverlay').classList.remove('show');
}
function handleOverlayClick(e) {
  if (e.target === document.getElementById('authOverlay')) closeAuth();
}

function switchTab(tab) {
  const isLogin = tab === 'login';
  document.getElementById('authTitle').innerText    = isLogin ? 'Welcome Back'               : 'Join EventPro';
  document.getElementById('authSubtitle').innerText = isLogin ? 'Sign in to manage your events' : 'Create your free account today';
  document.getElementById('tabLogin').classList.toggle('active',    isLogin);
  document.getElementById('tabRegister').classList.toggle('active', !isLogin);
  document.getElementById('loginBody').style.display    = isLogin ? 'block' : 'none';
  document.getElementById('registerBody').style.display = isLogin ? 'none'  : 'block';
  document.getElementById('forgotPanel').classList.remove('active');
  document.getElementById('authTabs').style.display = 'flex';
}

function showForgot() {
  document.getElementById('loginBody').style.display = 'none';
  document.getElementById('authTabs').style.display  = 'none';
  document.getElementById('authTitle').innerText     = 'Reset Password';
  document.getElementById('authSubtitle').innerText  = 'Enter your registered email or phone';
  document.getElementById('forgotPanel').classList.add('active');
}
function showForgotBack() {
  document.getElementById('forgotPanel').classList.remove('active');
  document.getElementById('authTabs').style.display = 'flex';
  switchTab('login');
}
async function resetPass() { showToast('⚠️ Password reset jald aayega!'); }

// ── Register ──────────────────────────────────────
async function register() {
  const first = document.getElementById('regFirst').value.trim();
  const last  = document.getElementById('regLast').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const pass  = document.getElementById('regPass').value;

  if (!first)           { showToast('Pehla naam daalo'); return; }
  if (!email && !phone) { showToast('Email ya phone daalo'); return; }
  if (pass.length < 6)  { showToast('Password 6+ characters ka hona chahiye'); return; }

  const btn = document.querySelector('#registerBody .auth-btn');
  setLoading(btn, true);
  try {
    const data = await api('/auth/signup', 'POST',
      { firstName: first, lastName: last, email, phone, password: pass }, false);

    if (data) {
      localStorage.setItem('ep_token', data.token);
      localStorage.setItem('ep_user',  JSON.stringify(data.user));
      closeAuth(); showProfile(data.user);
      showToast('Account ban gaya! EventPro mein swagat hai 🎉');
    } else {
      const u = { firstName: first, lastName: last, email, phone, pass };
      if (email) localStorage.setItem('of_user_' + email, JSON.stringify(u));
      if (phone) localStorage.setItem('of_user_' + phone, JSON.stringify(u));
      const fakeUser = { firstName: first, lastName: last, fullName: first + ' ' + last, email, phone };
      localStorage.setItem('ep_user', JSON.stringify(fakeUser));
      localStorage.setItem('ep_token', 'offline');
      closeAuth(); showProfile(fakeUser);
      showToast('Account ban gaya (offline mode) 🎉');
    }
  } catch (err) { showToast('⚠️ ' + err.message); }
  finally { setLoading(btn, false); }
}

// ── Login ─────────────────────────────────────────
async function login() {
  const id   = document.getElementById('loginId').value.trim();
  const pass = document.getElementById('loginPass').value;
  if (!id || !pass) { showToast('Saare fields bharo'); return; }

  const btn = document.querySelector('#loginBody .auth-btn');
  setLoading(btn, true);
  try {
    const data = await api('/auth/login', 'POST', { email: id, password: pass }, false);

    if (data) {
      localStorage.setItem('ep_token', data.token);
      localStorage.setItem('ep_user',  JSON.stringify(data.user));
      closeAuth(); showProfile(data.user);
      showToast('Welcome back! 👋');
    } else {
      const raw = localStorage.getItem('of_user_' + id);
      if (raw) {
        const u = JSON.parse(raw);
        if (u.pass === pass) {
          const fu = { firstName: u.firstName, lastName: u.lastName, fullName: u.firstName + ' ' + u.lastName, email: u.email, phone: u.phone };
          localStorage.setItem('ep_user', JSON.stringify(fu));
          localStorage.setItem('ep_token', 'offline');
          closeAuth(); showProfile(fu); showToast('Welcome back! (offline) 👋');
        } else { showToast('Galat password.'); }
      } else { showToast('Backend se connect nahi ho saka.'); }
    }

    const ep = document.getElementById('eventPage');
    if (ep && ep.style.display === 'block') {
      document.getElementById('loginRequiredBanner').style.display = 'none';
      document.getElementById('bookingFormSection').style.display  = 'block';
    }
  } catch (err) { showToast('⚠️ ' + err.message); }
  finally { setLoading(btn, false); }
}

// ════════════════════════════════════════════════
//   PROFILE
// ════════════════════════════════════════════════
function showProfile(user) {
  if (user) {
    const name = user.fullName || user.firstName || 'User';
    document.getElementById('loginNavBtn').style.display  = 'none';
    document.getElementById('userMenu').style.display     = 'block';
    document.getElementById('userAvatar').innerText       = name.charAt(0).toUpperCase();
    document.getElementById('userNameShort').innerText    = name.split(' ')[0];
    document.getElementById('dropdownName').innerText     = name;
  } else {
    document.getElementById('loginNavBtn').style.display  = 'block';
    document.getElementById('userMenu').style.display     = 'none';
  }
}

function toggleDropdown() {
  document.getElementById('userMenu').classList.toggle('open');
}

document.addEventListener('click', function (e) {
  const m = document.getElementById('userMenu');
  if (m && !m.contains(e.target)) m.classList.remove('open');
});

function logout() {
  localStorage.removeItem('ep_token');
  localStorage.removeItem('ep_user');
  location.reload();
}

// ════════════════════════════════════════════════
//   SETTINGS
// ════════════════════════════════════════════════
async function openSettings() {
  document.getElementById('userMenu').classList.remove('open');
  const user = JSON.parse(localStorage.getItem('ep_user') || '{}');
  document.getElementById('sFirst').value = user.firstName || '';
  document.getElementById('sLast').value  = user.lastName  || '';
  document.getElementById('sEmail').value = user.email     || '';
  document.getElementById('sPhone').value = user.phone     || '';
  document.getElementById('sCity').value  = user.city      || '';
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

async function saveProfile() {
  const first = document.getElementById('sFirst').value.trim();
  const last  = document.getElementById('sLast').value.trim();
  const email = document.getElementById('sEmail').value.trim();
  const phone = document.getElementById('sPhone').value.trim();
  const city  = document.getElementById('sCity').value.trim();
  if (!first) { showToast('Pehla naam zaroori hai'); return; }
  const btn = document.querySelectorAll('.settings-save-btn')[0];
  setLoading(btn, true);
  try {
    const data = await api('/auth/profile', 'PUT', { firstName: first, lastName: last, email, phone, city });
    const updated = (data && data.user) ? data.user : { ...JSON.parse(localStorage.getItem('ep_user') || '{}'), firstName: first, lastName: last, email, phone, city, fullName: first + ' ' + last };
    localStorage.setItem('ep_user', JSON.stringify(updated));
    showProfile(updated);
    showToast('✅ Profile save ho gayi!');
  } catch (err) { showToast('⚠️ ' + err.message); }
  finally { setLoading(btn, false); }
}

async function changePassword() {
  const curr = document.getElementById('sCurrPass').value;
  const newP = document.getElementById('sNewPass').value;
  const conf = document.getElementById('sConfPass').value;
  if (!curr || !newP || !conf) { showToast('Saare password fields bharo'); return; }
  if (newP !== conf)           { showToast('⚠️ Naya password match nahi karta'); return; }
  if (newP.length < 6)        { showToast('⚠️ Password 6+ characters hona chahiye'); return; }
  const btn = document.querySelectorAll('.settings-save-btn')[1];
  setLoading(btn, true);
  try {
    await api('/auth/change-password', 'PUT', { currentPassword: curr, newPassword: newP });
    ['sCurrPass','sNewPass','sConfPass'].forEach(id => document.getElementById(id).value = '');
    showToast('✅ Password badal gaya!');
  } catch (err) { showToast('⚠️ ' + err.message); }
  finally { setLoading(btn, false); }
}

async function saveNotifications() {
  try {
    await api('/auth/notifications', 'PUT', {
      emailNotif: document.getElementById('sEmailNotif').value,
      smsNotif:   document.getElementById('sSmsNotif').value
    });
    showToast('✅ Notifications save ho gayi!');
  } catch (err) { showToast('✅ Preferences save ho gayi!'); }
}

async function deleteAccount() {
  if (!confirm('Kya aap account delete karna chahte hain? Yeh wapis nahi hoga.')) return;
  try { await api('/auth/delete', 'DELETE'); } catch (e) {}
  localStorage.removeItem('ep_token');
  localStorage.removeItem('ep_user');
  showToast('Account delete ho gaya.');
  setTimeout(() => location.reload(), 1500);
}

// ════════════════════════════════════════════════
//   MY BOOKINGS
// ════════════════════════════════════════════════
async function openMyBookings() {
  document.getElementById('userMenu').classList.remove('open');
  const el = document.getElementById('bookingsContent');
  el.innerHTML = '<p class="no-bookings">⏳ Bookings load ho rahi hain...</p>';
  document.getElementById('bookingsOverlay').classList.add('show');

  try {
    const data   = await api('/bookings/my-bookings');
    let bookings = (data && data.bookings) ? data.bookings : JSON.parse(localStorage.getItem('ep_local_bookings') || '[]');

    if (bookings.length === 0) {
      el.innerHTML = '<p class="no-bookings">Abhi koi booking nahi. Pehla event book karo! 🎉</p>';
      return;
    }

    const sc = { pending: '#f39c12', confirmed: '#27ae60', cancelled: '#e74c3c', completed: '#2980b9' };
    el.innerHTML = `
      <div class="bookings-table-wrap">
        <table class="bookings-table">
          <thead><tr>
            <th>Event</th><th>Package</th><th>Date</th>
            <th>Venue</th><th>Budget</th><th>Advance</th>
            <th>Txn ID</th><th>Status</th><th>Action</th>
          </tr></thead>
          <tbody>
            ${bookings.map(b => {
              const status  = b.status || 'pending';
              const date    = b.eventDate ? new Date(b.eventDate).toLocaleDateString('en-IN') : (b.date || '-');
              const budget  = Number(b.budget || b.amount || 0);
              const advance = b.advanceAmount || Math.round(budget * 0.20);
              const canCancel = status !== 'cancelled' && status !== 'completed';
              const bId     = b._id || b.id || '';
              return `<tr>
                <td>${b.eventType || b.event || '-'}</td>
                <td>${b.package || '-'}</td>
                <td>${date}</td>
                <td>${b.venue || b.place || '-'}</td>
                <td>₹${budget.toLocaleString('en-IN')}</td>
                <td style="color:#27ae60;font-weight:600;">₹${advance.toLocaleString('en-IN')}</td>
                <td style="font-size:11px;color:#888;">${b.txnId || '-'}</td>
                <td><span style="color:${sc[status] || '#333'};font-weight:600;text-transform:capitalize">${status}</span></td>
                <td>${canCancel
                  ? `<button class="cancel-booking-btn" onclick="openCancelModal('${bId}','${b.eventType || b.event}','${date}')">🚫 Cancel</button>`
                  : `<span style="font-size:11px;color:#aaa;">—</span>`
                }</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>`;
  } catch (err) {
    el.innerHTML = '<p class="no-bookings">⚠️ Bookings load nahi hui. Try again.</p>';
  }
}

function closeMyBookings()      { document.getElementById('bookingsOverlay').classList.remove('show'); }
function handleBookingsClick(e) { if (e.target === document.getElementById('bookingsOverlay')) closeMyBookings(); }

// ════════════════════════════════════════════════
//   CANCEL BOOKING
// ════════════════════════════════════════════════
function openCancelModal(bookingId, eventType, date) {
  document.getElementById('cancelBookingId').value       = bookingId;
  document.getElementById('cancelBookingInfo').innerText = `${eventType} booking on ${date}`;
  document.getElementById('cancelOverlay').classList.add('show');
}
function closeCancelModal()   { document.getElementById('cancelOverlay').classList.remove('show'); }
function handleCancelClick(e) { if (e.target === document.getElementById('cancelOverlay')) closeCancelModal(); }

async function confirmCancel() {
  const bookingId = document.getElementById('cancelBookingId').value;
  const btn = document.querySelector('#cancelOverlay .danger-btn');
  setLoading(btn, true);
  try {
    const data = await api('/bookings/' + bookingId, 'PATCH', { status: 'cancelled' });
    showToast(data ? '✅ Booking cancel ho gayi. Refund 5-7 days mein.' : '✅ Booking cancel ho gayi (offline).');
    if (!data) {
      let local = JSON.parse(localStorage.getItem('ep_local_bookings') || '[]');
      local = local.map(b => (b.id === bookingId || b._id === bookingId) ? { ...b, status: 'cancelled' } : b);
      localStorage.setItem('ep_local_bookings', JSON.stringify(local));
    }
    closeCancelModal();
    setTimeout(() => openMyBookings(), 500);
  } catch (err) { showToast('⚠️ ' + err.message); }
  finally { setLoading(btn, false); }
}