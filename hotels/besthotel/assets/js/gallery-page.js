(function () {
  'use strict';

  var GALLERY_FOLDER = '../assets/img/gallery/';
  var GALLERY_MANIFEST = GALLERY_FOLDER + 'gallery-manifest.json';
  var IMAGE_EXT_RE = /\.(jpg|jpeg|png|webp|avif|gif)$/i;
  var FALLBACK_EXTENSIONS = ['jpg', 'jpeg', 'webp', 'png', 'avif'];
  var MAX_INDEX_SCAN = 200;
  var MAX_CONSECUTIVE_MISSES = 15;

  function getLocale() {
    var lang = (document.documentElement.lang || 'fr').toLowerCase();
    return lang.indexOf('fr') === 0 ? 'fr' : 'en';
  }

  function getI18n(locale) {
    if (locale === 'fr') {
      return {
        loading: 'Chargement des photos...',
        empty: 'Aucune photo trouvee pour le moment dans le dossier galerie.',
        openLabel: 'Ouvrir ',
        close: 'Fermer la galerie',
        previous: 'Photo precedente',
        next: 'Photo suivante',
        thumbPrev: 'Defiler les miniatures vers la gauche',
        thumbNext: 'Defiler les miniatures vers la droite'
      };
    }

    return {
      loading: 'Loading photos...',
      empty: 'No photos were found in the gallery folder yet.',
      openLabel: 'Open ',
      close: 'Close gallery',
      previous: 'Previous photo',
      next: 'Next photo',
      thumbPrev: 'Scroll thumbnails left',
      thumbNext: 'Scroll thumbnails right'
    };
  }

  function getBaseName(pathLike) {
    var raw = String(pathLike || '');
    var decoded = raw;

    try {
      decoded = decodeURIComponent(raw);
    } catch (error) {
      decoded = raw;
    }

    return decoded.split(/[\\/]/).pop();
  }

  function toAssetPath(fileName) {
    var safeFileName = getBaseName(fileName);
    return GALLERY_FOLDER + encodeURIComponent(safeFileName);
  }

  function normalizeFileName(href) {
    if (!href) {
      return null;
    }

    var withoutQuery = href.split('?')[0].split('#')[0];
    var fileName = getBaseName(withoutQuery);

    if (!fileName || !IMAGE_EXT_RE.test(fileName)) {
      return null;
    }

    return fileName;
  }

  function uniqueSorted(list) {
    var set = {};
    var output = [];

    for (var i = 0; i < list.length; i += 1) {
      var key = list[i];
      if (!key || set[key]) {
        continue;
      }
      set[key] = true;
      output.push(key);
    }

    output.sort(function (a, b) {
      return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    });

    return output;
  }

  function imageExists(url) {
    return new Promise(function (resolve) {
      var img = new Image();
      var timer = setTimeout(function () {
        cleanup(false);
      }, 3500);

      function cleanup(result) {
        clearTimeout(timer);
        img.onload = null;
        img.onerror = null;
        resolve(result);
      }

      img.onload = function () {
        cleanup(true);
      };
      img.onerror = function () {
        cleanup(false);
      };

      img.src = url;
    });
  }

  async function discoverFromDirectoryListing() {
    try {
      var response = await fetch(GALLERY_FOLDER, { cache: 'no-store' });
      if (!response.ok) {
        return [];
      }

      var contentType = response.headers.get('content-type') || '';
      if (contentType.indexOf('text/html') === -1) {
        return [];
      }

      var html = await response.text();
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, 'text/html');
      var links = doc.querySelectorAll('a[href]');
      var files = [];

      for (var i = 0; i < links.length; i += 1) {
        var fileName = normalizeFileName(links[i].getAttribute('href'));
        if (fileName) {
          files.push(fileName);
        }
      }

      return uniqueSorted(files);
    } catch (error) {
      return [];
    }
  }

  async function discoverFromManifest() {
    try {
      var response = await fetch(GALLERY_MANIFEST, { cache: 'no-store' });
      if (!response.ok) {
        return [];
      }

      var list = await response.json();
      if (!Array.isArray(list)) {
        return [];
      }

      var files = [];

      for (var i = 0; i < list.length; i += 1) {
        var fileName = normalizeFileName(String(list[i] || ''));
        if (fileName) {
          files.push(fileName);
        }
      }

      return uniqueSorted(files);
    } catch (error) {
      return [];
    }
  }

  async function discoverFromPatternProbe() {
    var files = [];
    var misses = 0;

    for (var i = 1; i <= MAX_INDEX_SCAN; i += 1) {
      var foundThisIndex = false;

      for (var j = 0; j < FALLBACK_EXTENSIONS.length; j += 1) {
        var ext = FALLBACK_EXTENSIONS[j];
        var fileName = 'gallery-' + i + '.' + ext;
        var exists = await imageExists(toAssetPath(fileName));

        if (exists) {
          files.push(fileName);
          foundThisIndex = true;
          break;
        }
      }

      if (foundThisIndex) {
        misses = 0;
      } else {
        misses += 1;
      }

      if (misses >= MAX_CONSECUTIVE_MISSES) {
        break;
      }
    }

    return uniqueSorted(files);
  }

  function setStatus(message) {
    var statusNode = document.querySelector('[data-gallery-status]');
    if (!statusNode) {
      return;
    }
    statusNode.textContent = message;
  }

  function buildCaption(fileName, index) {
    var safeFileName = getBaseName(fileName);
    var baseName = safeFileName.replace(IMAGE_EXT_RE, '').replace(/[-_]+/g, ' ').trim();
    if (!baseName) {
      return 'Photo ' + (index + 1);
    }
    return baseName.charAt(0).toUpperCase() + baseName.slice(1);
  }

  function renderGrid(files, i18n) {
    var grid = document.querySelector('[data-gallery-grid]');
    var desktopLayoutCycle = ['feature', 'portrait', 'square', 'landscape'];
    if (!grid) {
      return;
    }

    grid.innerHTML = '';

    for (var i = 0; i < files.length; i += 1) {
      var fileName = files[i];
      var imageSrc = toAssetPath(fileName);
      var caption = buildCaption(fileName, i);
      var layoutVariant = desktopLayoutCycle[i % desktopLayoutCycle.length];

      var link = document.createElement('a');
      link.className = 'gallery-card gallery-card--' + layoutVariant;
      link.href = imageSrc;
      link.setAttribute('title', caption);
      link.setAttribute('aria-label', i18n.openLabel + caption);
      link.setAttribute('data-gallery-index', String(i));

      var frame = document.createElement('span');
      frame.className = 'gallery-card__frame';

      var image = document.createElement('img');
      image.src = imageSrc;
      image.alt = caption;
      image.loading = 'lazy';
      image.decoding = 'async';

      frame.appendChild(image);
      link.appendChild(frame);
      grid.appendChild(link);
    }
  }

  function createModal(i18n) {
    var existing = document.querySelector('[data-gallery-modal]');

    if (existing) {
      return {
        root: existing,
        closeButton: existing.querySelector('[data-gallery-close]'),
        previousButton: existing.querySelector('[data-gallery-prev]'),
        nextButton: existing.querySelector('[data-gallery-next]'),
        mainImage: existing.querySelector('[data-gallery-main-image]'),
        caption: existing.querySelector('[data-gallery-caption]'),
        thumbsScroller: existing.querySelector('[data-gallery-thumbs]'),
        thumbsPrevButton: existing.querySelector('[data-gallery-thumbs-prev]'),
        thumbsNextButton: existing.querySelector('[data-gallery-thumbs-next]'),
        backdrop: existing.querySelector('[data-gallery-backdrop]')
      };
    }

    var modal = document.createElement('div');
    modal.className = 'gallery-modal';
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('data-gallery-modal', '');

    modal.innerHTML = [
      '<div class="gallery-modal__backdrop" data-gallery-backdrop></div>',
      '<div class="gallery-modal__viewport" role="dialog" aria-modal="true">',
      '  <button type="button" class="gallery-modal__close" aria-label="' + i18n.close + '" data-gallery-close>&times;</button>',
      '  <div class="gallery-modal__stage">',
      '    <button type="button" class="gallery-modal__nav gallery-modal__nav--prev" aria-label="' + i18n.previous + '" data-gallery-prev>&#10094;</button>',
      '    <figure class="gallery-modal__figure">',
      '      <img src="" alt="" data-gallery-main-image />',
      '      <figcaption class="gallery-modal__caption" data-gallery-caption></figcaption>',
      '    </figure>',
      '    <button type="button" class="gallery-modal__nav gallery-modal__nav--next" aria-label="' + i18n.next + '" data-gallery-next>&#10095;</button>',
      '  </div>',
      '  <div class="gallery-modal__thumbs-wrap">',
      '    <button type="button" class="gallery-modal__thumb-nav" aria-label="' + i18n.thumbPrev + '" data-gallery-thumbs-prev>&#10094;</button>',
      '    <div class="gallery-modal__thumbs" data-gallery-thumbs></div>',
      '    <button type="button" class="gallery-modal__thumb-nav" aria-label="' + i18n.thumbNext + '" data-gallery-thumbs-next>&#10095;</button>',
      '  </div>',
      '</div>'
    ].join('');

    document.body.appendChild(modal);

    return {
      root: modal,
      closeButton: modal.querySelector('[data-gallery-close]'),
      previousButton: modal.querySelector('[data-gallery-prev]'),
      nextButton: modal.querySelector('[data-gallery-next]'),
      mainImage: modal.querySelector('[data-gallery-main-image]'),
      caption: modal.querySelector('[data-gallery-caption]'),
      thumbsScroller: modal.querySelector('[data-gallery-thumbs]'),
      thumbsPrevButton: modal.querySelector('[data-gallery-thumbs-prev]'),
      thumbsNextButton: modal.querySelector('[data-gallery-thumbs-next]'),
      backdrop: modal.querySelector('[data-gallery-backdrop]')
    };
  }

  function initPopup(files, i18n) {
    var grid = document.querySelector('[data-gallery-grid]');
    if (!grid || !files || !files.length) {
      return;
    }

    if (grid.getAttribute('data-gallery-bound') === 'true') {
      return;
    }

    grid.setAttribute('data-gallery-bound', 'true');

    var modal = createModal(i18n);
    var activeIndex = 0;
    var previousFocusedElement = null;
    var thumbButtons = [];

    function normalizeIndex(index) {
      var total = files.length;
      if (total <= 0) {
        return 0;
      }
      return (index + total) % total;
    }

    function setActive(index, scrollThumb) {
      activeIndex = normalizeIndex(index);
      var fileName = files[activeIndex];
      var imageSrc = toAssetPath(fileName);
      var caption = buildCaption(fileName, activeIndex);

      modal.mainImage.src = imageSrc;
      modal.mainImage.alt = caption;
      modal.caption.textContent = caption;

      for (var i = 0; i < thumbButtons.length; i += 1) {
        var isActive = i === activeIndex;
        thumbButtons[i].classList.toggle('is-active', isActive);
        thumbButtons[i].setAttribute('aria-current', isActive ? 'true' : 'false');
      }

      if (scrollThumb && thumbButtons[activeIndex]) {
        thumbButtons[activeIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }

    function openModal(index, trigger) {
      previousFocusedElement = trigger || document.activeElement;
      modal.root.hidden = false;
      modal.root.setAttribute('aria-hidden', 'false');
      document.body.classList.add('gallery-modal-open');
      requestAnimationFrame(function () {
        modal.root.classList.add('is-open');
      });

      setActive(index, true);
      modal.closeButton.focus();
      document.addEventListener('keydown', onKeyDown);
    }

    function closeModal() {
      modal.root.classList.remove('is-open');
      modal.root.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('gallery-modal-open');
      document.removeEventListener('keydown', onKeyDown);

      setTimeout(function () {
        modal.root.hidden = true;
      }, 180);

      if (previousFocusedElement && typeof previousFocusedElement.focus === 'function') {
        previousFocusedElement.focus();
      }
    }

    function onKeyDown(event) {
      if (modal.root.hidden) {
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        closeModal();
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setActive(activeIndex - 1, true);
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setActive(activeIndex + 1, true);
      }
    }

    function buildThumbRail() {
      modal.thumbsScroller.innerHTML = '';
      thumbButtons = [];

      for (var i = 0; i < files.length; i += 1) {
        var fileName = files[i];
        var caption = buildCaption(fileName, i);
        var thumbButton = document.createElement('button');
        thumbButton.type = 'button';
        thumbButton.className = 'gallery-modal__thumb';
        thumbButton.setAttribute('aria-label', i18n.openLabel + caption);
        thumbButton.setAttribute('data-index', String(i));

        var thumbImage = document.createElement('img');
        thumbImage.src = toAssetPath(fileName);
        thumbImage.alt = caption;
        thumbImage.loading = 'lazy';
        thumbImage.decoding = 'async';

        thumbButton.appendChild(thumbImage);
        modal.thumbsScroller.appendChild(thumbButton);
        thumbButtons.push(thumbButton);
      }
    }

    function scrollThumbs(direction) {
      var amount = Math.max(220, Math.floor(modal.thumbsScroller.clientWidth * 0.75));
      modal.thumbsScroller.scrollBy({
        left: direction * amount,
        behavior: 'smooth'
      });
    }

    buildThumbRail();

    grid.addEventListener('click', function (event) {
      var target = event.target.closest('a.gallery-card');
      if (!target) {
        return;
      }

      event.preventDefault();
      var index = Number(target.getAttribute('data-gallery-index'));
      openModal(isNaN(index) ? 0 : index, target);
    });

    modal.thumbsScroller.addEventListener('click', function (event) {
      var button = event.target.closest('button.gallery-modal__thumb');
      if (!button) {
        return;
      }

      var index = Number(button.getAttribute('data-index'));
      setActive(isNaN(index) ? activeIndex : index, true);
    });

    modal.previousButton.addEventListener('click', function () {
      setActive(activeIndex - 1, true);
    });

    modal.nextButton.addEventListener('click', function () {
      setActive(activeIndex + 1, true);
    });

    modal.thumbsPrevButton.addEventListener('click', function () {
      scrollThumbs(-1);
    });

    modal.thumbsNextButton.addEventListener('click', function () {
      scrollThumbs(1);
    });

    modal.closeButton.addEventListener('click', closeModal);
    modal.backdrop.addEventListener('click', closeModal);
  }

  async function initGallery() {
    var grid = document.querySelector('[data-gallery-grid]');
    if (!grid) {
      return;
    }

    var i18n = getI18n(getLocale());

    setStatus(i18n.loading);

    var files = await discoverFromManifest();

    if (!files.length) {
      files = await discoverFromDirectoryListing();
    }

    if (!files.length) {
      files = await discoverFromPatternProbe();
    }

    if (!files.length) {
      setStatus(i18n.empty);
      return;
    }

    setStatus('');
    renderGrid(files, i18n);
    initPopup(files, i18n);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGallery);
  } else {
    initGallery();
  }
})();
