// ════════════════════════════════════════════════════════════════════════════════
//   DOM ELEMENT INITIALIZATION
//   This script initializes all HTML elements as global variables for easy access
//   Run this BEFORE script.js
// ════════════════════════════════════════════════════════════════════════════════

function initDOMElements() {
  // ── Common Elements
  window.splash = document.getElementById('splash');
  window.toast = document.getElementById('toast') || createToastElement();
  window.lightbox = document.getElementById('lightbox') || createLightboxElement();
  window.lightboxImg = document.getElementById('lightboxImg');

  // ── Navigation
  window.loginNavBtn = document.getElementById('loginNavBtn');
  window.userMenu = document.getElementById('userMenu');
  window.userAvatar = document.getElementById('userAvatar');
  window.userNameShort = document.getElementById('userNameShort');
  window.dropdownName = document.getElementById('dropdownName');

  // ── Gallery
  window.galleryGrid = document.getElementById('galleryGrid');

  // ── Event Page
  window.eventPage = document.getElementById('eventPage');
  window.photoGrid = document.getElementById('photoGrid');
  window.epTitle = document.getElementById('epTitle');
  window.epSubtitle = document.getElementById('epSubtitle');
  window.loginRequiredBanner = document.getElementById('loginRequiredBanner');
  window.bookingFormSection = document.getElementById('bookingFormSection');

  // ── Booking Form - Step 1
  window.bName = document.getElementById('bName');
  window.bPhone = document.getElementById('bPhone');
  window.bDate = document.getElementById('bDate');
  window.bAmount = document.getElementById('bAmount');
  window.bPlace = document.getElementById('bPlace');
  window.bEventType = document.getElementById('bEventType');
  window.bPackage = document.getElementById('bPackage');
  window.advanceInfoBox = document.getElementById('advanceInfoBox');
  window.advTotal = document.getElementById('advTotal');
  window.advAmount = document.getElementById('advAmount');
  window.advRemaining = document.getElementById('advRemaining');
  window.bookingStep1 = document.getElementById('bookingStep1');

  // ── Booking Form - Step 2 (Payment)
  window.bookingStep2 = document.getElementById('bookingStep2');
  window.payAmountDisplay = document.getElementById('payAmountDisplay');
  window.payAmountSub = document.getElementById('payAmountSub');
  window.qrImg = document.getElementById('qrImg');
  window.tabUpi = document.getElementById('tabUpi');
  window.tabBank = document.getElementById('tabBank');
  window.payUpi = document.getElementById('payUpi');
  window.payBank = document.getElementById('payBank');
  window.upiIdText = document.getElementById('upiIdText');
  window.bTxnId = document.getElementById('bTxnId');

  // ── Contact Form
  window.cfName = document.getElementById('cfName');
  window.cfPhone = document.getElementById('cfPhone');
  window.cfEmail = document.getElementById('cfEmail');
  window.cfEvent = document.getElementById('cfEvent');
  window.cfMsg = document.getElementById('cfMsg');

  // ── Auth Modal
  window.authOverlay = document.getElementById('authOverlay');
  window.authTitle = document.getElementById('authTitle');
  window.authSubtitle = document.getElementById('authSubtitle');
  window.authTabs = document.getElementById('authTabs');
  window.tabLogin = document.getElementById('tabLogin');
  window.tabRegister = document.getElementById('tabRegister');
  window.loginBody = document.getElementById('loginBody');
  window.loginId = document.getElementById('loginId');
  window.loginPass = document.getElementById('loginPass');
  window.registerBody = document.getElementById('registerBody');
  window.regFirst = document.getElementById('regFirst');
  window.regLast = document.getElementById('regLast');
  window.regEmail = document.getElementById('regEmail');
  window.regPhone = document.getElementById('regPhone');
  window.regPass = document.getElementById('regPass');
  window.forgotPanel = document.getElementById('forgotPanel');
  window.forgotId = document.getElementById('forgotId');
  window.newPass = document.getElementById('newPass');

  // ── Settings Modal
  window.settingsOverlay = document.getElementById('settingsOverlay');
  window.sFirst = document.getElementById('sFirst');
  window.sLast = document.getElementById('sLast');
  window.sEmail = document.getElementById('sEmail');
  window.sPhone = document.getElementById('sPhone');
  window.sCity = document.getElementById('sCity');
  window.sEmailNotif = document.getElementById('sEmailNotif');
  window.sSmsNotif = document.getElementById('sSmsNotif');
  window.sCurrPass = document.getElementById('sCurrPass');
  window.sNewPass = document.getElementById('sNewPass');
  window.sConfPass = document.getElementById('sConfPass');

  // ── Bookings Modal
  window.bookingsOverlay = document.getElementById('bookingsOverlay');
  window.bookingsContent = document.getElementById('bookingsContent');

  // ── Cancel Modal
  window.cancelOverlay = document.getElementById('cancelOverlay');
  window.cancelBookingId = document.getElementById('cancelBookingId');
  window.cancelBookingInfo = document.getElementById('cancelBookingInfo');

  console.log('✅ All DOM elements initialized successfully!');
}

// ── Helper: Create toast element if not found
function createToastElement() {
  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.style.cssText = `
    position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
    background: #333; color: white; padding: 15px 20px;
    border-radius: 8px; z-index: 9999; display: none;
    font-weight: 500; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `;
  document.body.appendChild(toast);
  return toast;
}

// ── Helper: Create lightbox element if not found
function createLightboxElement() {
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <span class="lightbox-close" onclick="closeLightbox()">×</span>
    <img id="lightboxImg" src="" alt="Full size image">
  `;
  lightbox.onclick = (e) => {
    if (e.target === lightbox) closeLightbox();
  };
  document.body.appendChild(lightbox);
  return lightbox;
}

// ── Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDOMElements);
} else {
  initDOMElements();
}
