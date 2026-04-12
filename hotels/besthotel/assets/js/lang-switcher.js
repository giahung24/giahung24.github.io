/* Locale switcher for static EN/FR mirrored pages */
(function () {
  'use strict';

  function getLocaleFromPath(pathname) {
    const supported = ['en', 'fr', 'es'];
    var parts = pathname.split('/').filter(Boolean);
    for (var i = 0; i < parts.length; i += 1) {
      if (supported.includes(parts[i])) {
        return parts[i];
      }
    }
    return 'en';
  }

  function getFileFromPath(pathname) {
    var clean = pathname.split('?')[0].split('#')[0];
    var parts = clean.split('/').filter(Boolean);
    if (parts.length === 0) {
      return 'index.html';
    }
    var last = parts[parts.length - 1];
    if (last === 'en' || last === 'fr') {
      return 'index.html';
    }
    return last;
  }

  var locale = getLocaleFromPath(window.location.pathname);
  var currentFile = getFileFromPath(window.location.pathname);

  document.documentElement.lang = locale;

  var currentLabels = document.querySelectorAll('.language-option .current-lang');
  for (var i = 0; i < currentLabels.length; i += 1) {
    currentLabels[i].innerHTML = locale.toUpperCase() + ' <i class="fa fa-angle-down"></i>';
  }

  var links = document.querySelectorAll('[data-lang-switch]');
  for (var j = 0; j < links.length; j += 1) {
    var targetLocale = links[j].getAttribute('data-lang-switch');
    if (targetLocale !== 'en' && targetLocale !== 'fr') {
      continue;
    }
    links[j].setAttribute('href', '../' + targetLocale + '/' + currentFile);
  }
})();
