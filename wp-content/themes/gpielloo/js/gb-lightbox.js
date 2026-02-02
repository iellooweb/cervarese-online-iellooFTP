document.addEventListener('DOMContentLoaded', () => {
  // Selettore universale: include GenerateBlocks e Gallerie/Immagini standard di WordPress
  const selector = '.gb-lightbox, .wp-block-gallery a[href$=".jpg"], .wp-block-gallery a[href$=".jpeg"], .wp-block-gallery a[href$=".png"], .wp-block-gallery a[href$=".webp"], .wp-block-image a[href$=".jpg"], .wp-block-image a[href$=".jpeg"], .wp-block-image a[href$=".png"], .wp-block-image a[href$=".webp"]';
  
  const links = [...document.querySelectorAll(selector)];
  if (!links.length) return;

  // Crea overlay (se non esiste già)
  let overlay = document.querySelector('.gb-lightbox-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'gb-lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.style.display = 'none'; // Nascondi inizialmente
    overlay.innerHTML = `
      <button class="gb-lightbox-close" aria-label="Chiudi">&times;</button>
      <div class="gb-lightbox-content">
        <img alt="" src="">
      </div>
      <div class="gb-lightbox-controls">
        <button class="gb-lightbox-button gb-lightbox-prev" aria-label="Immagine precedente">&#10094; Precedente</button>
        <button class="gb-lightbox-button gb-lightbox-next" aria-label="Immagine successiva">Successiva &#10095;</button>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  const img = overlay.querySelector('img');
  const btnClose = overlay.querySelector('.gb-lightbox-close');
  const btnPrev = overlay.querySelector('.gb-lightbox-prev');
  const btnNext = overlay.querySelector('.gb-lightbox-next');
  const focusable = [btnClose, btnPrev, btnNext];
  let current = 0;
  let lastFocused = null;
  let startX = 0, endX = 0;

  // Funzione per mostrare l'immagine
  const showImage = (i) => {
    current = (i + links.length) % links.length;
    const targetLink = links[current];
    
    // Mostra un loader o resetta src per evitare flash della vecchia immagine
    img.src = targetLink.href;
    img.alt = targetLink.querySelector('img')?.alt || '';
    
    overlay.classList.add('active');
    overlay.style.display = 'flex';
    btnClose.focus();
  };

  // Funzione per chiudere
  const closeLightbox = () => {
    overlay.classList.remove('active');
    setTimeout(() => {
      if (!overlay.classList.contains('active')) {
        overlay.style.display = 'none';
        img.src = '';
      }
    }, 300);
    if (lastFocused) lastFocused.focus();
  };

  // Assegna l'evento click a tutti i link trovati
  links.forEach((link, i) => {
    link.addEventListener('click', e => {
      e.preventDefault();
      lastFocused = document.activeElement;
      showImage(i);
    });
  });

  // Eventi pulsanti
  btnClose.onclick = (e) => { e.stopPropagation(); closeLightbox(); };
  btnPrev.onclick = (e) => { e.stopPropagation(); showImage(current - 1); };
  btnNext.onclick = (e) => { e.stopPropagation(); showImage(current + 1); };
  
  // Chiudi cliccando fuori dall'immagine
  overlay.onclick = (e) => {
    if (e.target === overlay || e.target.classList.contains('gb-lightbox-content')) {
      closeLightbox();
    }
  };

  // Gestione Tastiera
  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(current - 1);
    if (e.key === 'ArrowRight') showImage(current + 1);

    // Focus Trap
    if (e.key === 'Tab') {
      const idx = focusable.indexOf(document.activeElement);
      if (e.shiftKey && (idx === 0 || idx === -1)) {
        e.preventDefault();
        focusable[focusable.length - 1].focus();
      } else if (!e.shiftKey && idx === focusable.length - 1) {
        e.preventDefault();
        focusable[0].focus();
      }
    }
  });

  // Supporto Touch Swipe
  img.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, {passive: true});
  img.addEventListener('touchmove', e => { endX = e.touches[0].clientX; }, {passive: true});
  img.addEventListener('touchend', () => {
    const diff = startX - endX;
    if (Math.abs(diff) > 50 && endX !== 0) {
      if (diff > 0) showImage(current + 1);
      else showImage(current - 1);
    }
    startX = 0; endX = 0;
  });
});