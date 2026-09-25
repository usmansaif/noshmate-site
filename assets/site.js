// Shared header/nav behavior for noshmate.pk sub-pages — copied from
// index.html's inline <script> (same DOM ids: hamburger, navLinks, overlay).
const siteHeader = document.querySelector('header');
const onScroll = () => siteHeader.classList.toggle('scrolled', window.scrollY > 12);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const overlay = document.getElementById('overlay');

function closeMenu() {
  hamburger.classList.remove('active');
  navLinks.classList.remove('open');
  overlay.classList.remove('show');
}

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  overlay.classList.toggle('show', isOpen);
});

overlay.addEventListener('click', closeMenu);
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', closeMenu));
