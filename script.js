(function() {
'use strict';

/* ── CUSTOM CURSOR ── */
const cur  = document.getElementById('cur');
const curR = document.getElementById('curR');

// Debug: verify elements exist
if (!cur || !curR) {
  console.warn('Cursor elements not found in DOM');
}

let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  if (!cur) return;
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx + 'px';
  cur.style.top  = my + 'px';
});

(function animCursor() {
  if (!curR) return;
  rx += (mx - rx) * 0.11;
  ry += (my - ry) * 0.11;
  curR.style.left = rx + 'px';
  curR.style.top  = ry + 'px';
  requestAnimationFrame(animCursor);
})();

document.querySelectorAll('a, button, .tcard, .bcard, .ipost, .afeat').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ── HEADER: topbar slides away on scroll ── */
const siteHdr = document.getElementById('site-header');
const topbar  = document.getElementById('topbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    if (topbar) topbar.classList.add('gone');
    if (siteHdr) siteHdr.classList.add('compact');
  } else {
    if (topbar) topbar.classList.remove('gone');
    if (siteHdr) siteHdr.classList.remove('compact');
  }
}, { passive: true });

/* ── PARALLAX ── */
const heroBg   = document.getElementById('heroBg');
const pb1      = document.getElementById('pb1');
const pb2      = document.getElementById('pb2');
const banner1  = document.getElementById('pbanner1');
const banner2  = document.getElementById('pbanner2');

function doParallax() {
  const s = window.scrollY;

  // Hero bg drifts down as user scrolls
  if (heroBg) heroBg.style.transform = `translateY(${s * 0.38}px)`;

  // Parallax banners — bg drifts in opposite direction to scroll
  if (pb1 && banner1) {
    const rect = banner1.getBoundingClientRect();
    pb1.style.transform = `translateY(${-rect.top * 0.2}px)`;
  }
  if (pb2 && banner2) {
    const rect = banner2.getBoundingClientRect();
    pb2.style.transform = `translateY(${-rect.top * 0.2}px)`;
  }
}

window.addEventListener('scroll', doParallax, { passive: true });
doParallax();

/* ── SCROLL REVEAL (IntersectionObserver) ── */
const revClasses = ['.rev', '.rev-l', '.rev-r', '.rev-scale'];
const allRevEls  = document.querySelectorAll(revClasses.join(','));

const revObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

allRevEls.forEach(el => revObs.observe(el));

/* ── STAGGER CHILDREN on reveal ── */
const staggerEls = document.querySelectorAll('.stagger');
const stagObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      stagObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

staggerEls.forEach(el => stagObs.observe(el));

/* ── COUNTER ANIMATION ── */
function animateCount(el, target, duration) {
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const counters = document.querySelectorAll('.count-up');
const cntObs   = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.target, 10);
      animateCount(entry.target, target, 1800);
      cntObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => cntObs.observe(c));

/* ── SMOOTH SCROLL for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      const offset = siteHdr.offsetHeight + 16;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

/* ── FORM SUBMIT feedback ── */
const formBtn = document.getElementById('formBtn');
if (formBtn) {
  formBtn.addEventListener('click', () => {
    formBtn.innerHTML = '<i class="fas fa-check-circle"></i> Sent! We\'ll reach out soon.';
    formBtn.style.background = 'linear-gradient(135deg,#2E7D32,#388E3C)';
    setTimeout(() => {
      formBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      formBtn.style.background = '';
    }, 5000);
  });
}

/* ── TILT effect on theme cards ── */
document.querySelectorAll('.tcard').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `translateY(-10px) scale(1.02) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


/* ── PROPERTY DETAILS MODAL ── */
document.addEventListener('DOMContentLoaded', ()=>{
  const modalOverlay = document.getElementById('property-modal');
  if (!modalOverlay) return;
  const modalClose = modalOverlay.querySelector('.modal-close');
  const modalTitle = modalOverlay.querySelector('#modal-title');
  const modalDesc = modalOverlay.querySelector('.modal-desc');
  const modalTag = modalOverlay.querySelector('.modal-tag');
  const modalMeta = modalOverlay.querySelector('.modal-meta');
  const modalMainImg = modalOverlay.querySelector('.modal-main-img img');
  const modalGallery = modalOverlay.querySelector('.modal-gallery');
  const modalThumbs = modalOverlay.querySelector('.modal-thumbs');
  const modalBrochure = modalOverlay.querySelector('.modal-brochure');
  const modalBook = modalOverlay.querySelector('.modal-book');
  const btnPrev = modalOverlay.querySelector('.img-nav.prev');
  const btnNext = modalOverlay.querySelector('.img-nav.next');
  const thumbBtnPrev = modalOverlay.querySelector('.thumb-nav.prev');
  const thumbBtnNext = modalOverlay.querySelector('.thumb-nav.next');

  let currentImages = [];
  let currentIndex = 0;

  function updateMain(idx){
    if (!currentImages.length) return;
    idx = (idx + currentImages.length) % currentImages.length;
    currentIndex = idx;
    modalMainImg.src = currentImages[idx];
    
    // Set blurred background image matching the current main image
    if (modalGallery && currentImages[idx]) {
      modalGallery.style.setProperty('--bg-image', `url("${currentImages[idx]}")`);
    }
    
    // Update active thumbnail and scroll it into view
    modalThumbs.querySelectorAll('img').forEach((im,i)=>{
      im.classList.toggle('active', i===idx);
      if (i===idx) {
        // Scroll thumbnail carousel to show active thumb
        im.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });
  }

  async function fetchFolderImages(folder){    // attempt to load a static manifest (index.json) which lists images in the folder
    // this is required for hosts such as GitHub Pages that do not expose directory listings
    try {
      const manifestUrl = folder.replace(/\/+$/,'') + '/index.json';
      const r = await fetch(manifestUrl);
      if (r.ok) {
        const list = await r.json();
        if (Array.isArray(list) && list.length) {
          return list.map(name => folder + name);
        }
      }
    } catch (ex) {
      // ignore and fall back
    }

    // fall back to scraping directory listing (works on local dev servers)
    try {
      const resp = await fetch(folder);
      const text = await resp.text();
      const urls = [];
      const regex = /href="([^"\?]+\.(?:jpe?g|png|webp|gif))"/gi;
      let m;
      while ((m = regex.exec(text)) !== null) {
        // resolve relative URLs
        const url = new URL(m[1], window.location.href).href;
        urls.push(url);
      }
      return urls;
    } catch(e){
      return [];
    }
  }

  function showPrev(){ updateMain(currentIndex - 1); }
  function showNext(){ updateMain(currentIndex + 1); }

  async function openPropertyModal(card){
    if (!card) return;
    const title = card.querySelector('h3') ? card.querySelector('h3').textContent : '';
    const desc = card.querySelector('.b-body p') ? card.querySelector('.b-body p').textContent : '';
    const tag = card.querySelector('.b-img .b-tag') ? card.querySelector('.b-img .b-tag').textContent : '';
    const meta = card.querySelector('.b-date') ? card.querySelector('.b-date').textContent : '';
    const mainImg = card.querySelector('.b-img img') ? card.querySelector('.b-img img').src : '';

    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modalTag.textContent = tag;
    modalMeta.textContent = meta;

    // build gallery from data-folder or data-images or fallback to card image
    modalThumbs.innerHTML = '';
    let images = [];
    if (card.dataset.folder) {
      const fetched = await fetchFolderImages(card.dataset.folder);
      if (fetched.length) images = fetched;
    }
    if (!images.length && card.dataset.images) {
      images = card.dataset.images.split(',').map(s=>s.trim());
    }
    if (!images.length && mainImg) {
      images = [mainImg];
    }

    if (images.length){
      currentImages = images;
      currentIndex = 0;
      modalMainImg.src = images[0];
      images.forEach((src, i) => {
        const img = document.createElement('img');
        img.src = src;
        if (i===0) img.classList.add('active');
        img.addEventListener('click', ()=>{ updateMain(i); });
        modalThumbs.appendChild(img);
      });
    } else {
      modalMainImg.src = '';
      currentImages = [];
      currentIndex = 0;
    }

    // brochure
    if (card.dataset.brochure){
      modalBrochure.href = card.dataset.brochure;
      modalBrochure.style.display = 'inline-flex';
    } else {
      modalBrochure.style.display = 'none';
    }

    modalBook.href = card.dataset.book || '#';

    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }

  function closePropertyModal(){
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.b-read').forEach(btn=>{
    btn.addEventListener('click', async e=>{
      e.preventDefault();
      const card = btn.closest('.bcard');
      if (card) await openPropertyModal(card);
    });
  });

  if (btnPrev) btnPrev.addEventListener('click', showPrev);
  if (btnNext) btnNext.addEventListener('click', showNext);

  function scrollThumbs(dir){
    if (!modalThumbs) return;
    const scrollAmount = 150;
    modalThumbs.scrollBy({ left: dir === 'next' ? scrollAmount : -scrollAmount, behavior: 'smooth' });
  }

  if (thumbBtnPrev) thumbBtnPrev.addEventListener('click', ()=>scrollThumbs('prev'));
  if (thumbBtnNext) thumbBtnNext.addEventListener('click', ()=>scrollThumbs('next'));

  document.addEventListener('keydown', e=>{
    if (!modalOverlay.classList.contains('open')) return;
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  modalClose.addEventListener('click', closePropertyModal);
  modalOverlay.addEventListener('click', e=>{ if (e.target === modalOverlay) closePropertyModal(); });
  document.addEventListener('keydown', e=>{ if (e.key === 'Escape') closePropertyModal(); });

});

})();

