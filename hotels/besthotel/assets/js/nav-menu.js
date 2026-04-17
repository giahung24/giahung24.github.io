'use strict';

(function () {
  var MENU_ITEMS = [
    { key: 'index', label: { fr: 'Accueil', en: 'Home' }, href: './index.html' },
    { key: 'rooms', label: { fr: 'Chambres', en: 'Rooms' }, href: './rooms.html' },
    { key: 'services', label: { fr: 'Services', en: 'Services' }, href: './services.html' },
    { key: 'gallery', label: { fr: 'Galerie', en: 'Gallery' }, href: './gallery.html' },
    { key: 'about', label: { fr: 'À propos de l\'Hôtel', en: 'About the Hotel' }, href: './about.html' }
  ];

  function getLocale() {
    var lang = (document.documentElement.lang || 'fr').toLowerCase();
    return lang.indexOf('fr') === 0 ? 'fr' : 'en';
  }

  function getActiveKey() {
    var path = (window.location.pathname || '').toLowerCase();

    if (/about(_)?\.html$/.test(path)) {
      return 'about';
    }

    if (/rooms\.html$/.test(path)) {
      return 'rooms';
    }

    if (/services\.html$/.test(path)) {
      return 'services';
    }

    if (/gallery\.html$/.test(path)) {
      return 'gallery';
    }

    return 'index';
  }

  function buildNavMarkup(locale, activeKey) {
    var menuItems = MENU_ITEMS.map(function (item) {
      var isActive = item.key === activeKey ? ' class="active"' : '';
      return '<li' + isActive + '><a href="' + item.href + '">' + item.label[locale] + '</a></li>';
    }).join('');

    return [
      '<nav class="mainmenu">',
      '  <ul>',
      menuItems,
      '  </ul>',
      '</nav>',
      '<span id="fb-widget-1" class="fb-widget top-btn" data-fbConfig="0"></span>',
      '<div class="language-option">',
      '  <span class="current-lang">' + locale.toUpperCase() + ' <i class="fa fa-angle-down"></i></span>',
      '  <div class="flag-dropdown">',
      '    <ul>',
      '      <li><a href="../en/index.html" data-lang-switch="en">EN</a></li>',
      '      <li><a href="../fr/index.html" data-lang-switch="fr">FR</a></li>',
      '    </ul>',
      '  </div>',
      '</div>'
    ].join('');
  }

  function buildMobileNavMarkup(locale, activeKey) {
    var menuItems = MENU_ITEMS.map(function (item) {
      var isActive = item.key === activeKey ? ' class="active"' : '';
      return '<li' + isActive + '><a href="' + item.href + '" role="menuitem">' + item.label[locale] + '</a></li>';
    }).join('');

    return [
      '<a href="#" aria-haspopup="true" role="button" tabindex="0" class="slicknav_btn slicknav_collapsed" style="outline: none">',
      '<span class="slicknav_menutxt">MENU</span>',
      '<span class="slicknav_icon">',
      '<span class="slicknav_icon-bar"></span>',
      '<span class="slicknav_icon-bar"></span>',
      '<span class="slicknav_icon-bar"></span>',
      '</span>',
      '</a>',
      '<nav class="slicknav_nav slicknav_hidden" aria-hidden="true" role="menu" style="display: none">',
      '<ul>',
      menuItems,
      '</ul>',
      '</nav>'
    ].join('');
  }

  function buildFooterMarkup(locale) {
    var isFrench = locale === 'fr';
    var contactTitle = isFrench ? 'Contactez-nous' : 'Contact Us';
    var footerAlt = isFrench ? 'Best Hotel Bordeaux Sud footer logo' : 'Best Hotel Bordeaux Sud footer logo';

    return [
      '<div class="container">',
      '  <div class="footer-text">',
      '    <div class="row">',
      '      <div class="col-lg-6">',
      '        <div class="ft-about">',
      '          <div class="logo">',
      '            <a href="./index.html">',
      '              <img src="../assets/img/footer-logo.png" alt="' + footerAlt + '" width="250" height="73" loading="lazy" decoding="async" />',
      '            </a>',
      '          </div>',
      '        </div>',
      '      </div>',
      '      <div class="col-lg-6">',
      '        <div class="ft-contact">',
      '          <h6>' + contactTitle + '</h6>',
      '          <ul>',
      '            <li>',
      '              <span><i aria-hidden="true" class="fa fa-phone"></i></span>',
      '              <span>05 56 37 90 00</span>',
      '            </li>',
      '            <li>',
      '              <span><i aria-hidden="true" class="fa fa-envelope"></i></span>',
      '              <span>contact@besthotelbordeauxsud.fr</span>',
      '            </li>',
      '            <li>',
      '              <span><i aria-hidden="true" class="fa fa-map-marker"></i></span>',
      '              <span>6 Rue Salvador Dali, 33140 Villenave-d\'Ornon</span>',
      '            </li>',
      '          </ul>',
      '        </div>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('');
  }

  function renderNavMenu() {
    var locale = getLocale();
    var activeKey = getActiveKey();
    var containers = document.querySelectorAll('.nav-menu');

    for (var i = 0; i < containers.length; i += 1) {
      containers[i].innerHTML = buildNavMarkup(locale, activeKey);
    }

    var mobileContainers = document.querySelectorAll('.slicknav_menu');

    for (var j = 0; j < mobileContainers.length; j += 1) {
      mobileContainers[j].innerHTML = buildMobileNavMarkup(locale, activeKey);
    }

    var footerContainers = document.querySelectorAll('.footer-section');

    for (var k = 0; k < footerContainers.length; k += 1) {
      footerContainers[k].innerHTML = buildFooterMarkup(locale);
    }
  }

  renderNavMenu();
})();