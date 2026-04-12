/*  ---------------------------------------------------
    Template Name: Sona
    Description: Sona Hotel Html Template
    Author: Colorlib
    Author URI: https://colorlib.com
    Version: 1.0
    Created: Colorlib
---------------------------------------------------------  */

'use strict';

(function ($) {

    /*------------------
        Preloader
    --------------------*/
    $(window).on('load', function () {
        var $preloader = $("#preloader");
        if (!$preloader.length) {
            return;
        }

        $(".loader").fadeOut();
        $preloader.delay(200).fadeOut("slow");
    });

    /*------------------
        Background Set
    --------------------*/
    function applySetBg(node) {
        if (!node || node.dataset.bgLoaded === 'true') {
            return;
        }

        var bg = node.getAttribute('data-setbg');
        if (!bg) {
            return;
        }

        node.style.backgroundImage = 'url(' + bg + ')';
        node.dataset.bgLoaded = 'true';
    }

    var setBgNodes = document.querySelectorAll('.set-bg');

    if ('IntersectionObserver' in window) {
        var setBgObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                    return;
                }

                applySetBg(entry.target);
                observer.unobserve(entry.target);
            });
        }, {
            rootMargin: '300px 0px'
        });

        setBgNodes.forEach(function (node) {
            if (node.getAttribute('data-priority') === 'high') {
                applySetBg(node);
                return;
            }

            setBgObserver.observe(node);
        });
    } else {
        setBgNodes.forEach(function (node) {
            applySetBg(node);
        });
    }

    //Offcanvas Menu
    $(".canvas-open").on('click', function () {
        $(".offcanvas-menu-wrapper").addClass("show-offcanvas-menu-wrapper");
        $(".offcanvas-menu-overlay").addClass("active");
    });

    $(".canvas-close, .offcanvas-menu-overlay").on('click', function () {
        $(".offcanvas-menu-wrapper").removeClass("show-offcanvas-menu-wrapper");
        $(".offcanvas-menu-overlay").removeClass("active");
    });

    // Search model
    $('.search-switch').on('click', function () {
        $('.search-model').fadeIn(400);
    });

    $('.search-close-switch').on('click', function () {
        $('.search-model').fadeOut(400, function () {
            $('#search-input').val('');
        });
    });

    /*------------------
		Navigation
	--------------------*/
    if ($.fn.slicknav && $(".mobile-menu").length) {
        $(".mobile-menu").slicknav({
            prependTo: '#mobile-menu-wrap',
            allowParentLinks: true
        });
    }

    /*------------------
        Hero Slider
    --------------------*/
    if ($.fn.owlCarousel && $(".hero-slider").length) {
        $(".hero-slider").owlCarousel({
            loop: true,
            margin: 0,
            items: 1,
            dots: true,
            animateOut: 'fadeOut',
            animateIn: 'fadeIn',
            smartSpeed: 1200,
            autoHeight: false,
            autoplay: true,
            mouseDrag: false
        });

        $('.hero-slider .owl-dot').each(function (index) {
            $(this).attr('aria-label', 'Go to hero slide ' + (index + 1));
        });
    }

    /*------------------------
		Testimonial Slider
    ----------------------- */
    if ($.fn.owlCarousel && $(".testimonial-slider").length) {
        $(".testimonial-slider").owlCarousel({
            items: 1,
            dots: false,
            autoplay: true,
            loop: true,
            smartSpeed: 1200,
            nav: true,
            navText: ["<i class='arrow_left'></i>", "<i class='arrow_right'></i>"]
        });

        $('.testimonial-slider .owl-prev').attr('aria-label', 'Previous testimonial');
        $('.testimonial-slider .owl-next').attr('aria-label', 'Next testimonial');
    }

    /*------------------
        Magnific Popup
    --------------------*/
    if ($.fn.magnificPopup && $('.video-popup').length) {
        $('.video-popup').magnificPopup({
            type: 'iframe'
        });
    }

    /*------------------
        Room Detail Modal
    --------------------*/
    (function initRoomDetailModal() {
        var $modal = $('#roomDetailModal');
        if (!$modal.length) {
            return;
        }

        var dataNode = document.getElementById('roomDetailData');
        if (!dataNode) {
            return;
        }

        var roomData = null;
        var roomDataPromise = null;

        function resolveRoomData() {
            if (roomData) {
                return $.Deferred().resolve(roomData).promise();
            }

            if (roomDataPromise) {
                return roomDataPromise;
            }

            var inlineJson = (dataNode.textContent || '').trim();
            if (inlineJson) {
                try {
                    roomData = JSON.parse(inlineJson);
                    return $.Deferred().resolve(roomData).promise();
                } catch (error) {
                    // Fall back to src-based JSON loading.
                }
            }

            var dataSrc = dataNode.getAttribute('src');
            if (!dataSrc) {
                return $.Deferred().reject().promise();
            }

            var deferred = $.Deferred();
            roomDataPromise = deferred.promise();

            $.getJSON(dataSrc)
                .done(function (data) {
                    roomData = data || {};
                    deferred.resolve(roomData);
                })
                .fail(function () {
                    deferred.reject();
                });

            return roomDataPromise;
        }

        var $title = $('#roomDetailModalTitle');
        var $mainImage = $('#roomDetailMainImage');
        var $thumbs = $('#roomDetailThumbs');
        var $chips = $('#roomDetailChips');
        var $size = $('#roomDetailSize');
        var $bed = $('#roomDetailBed');
        var $capacity = $('#roomDetailCapacity');
        var $description = $('#roomDetailDescription');
        var $bathroom = $('#roomDetailBathroom');
        var $facilities = $('#roomDetailFacilities');
        var $bookButton = $('#roomBookButton');
        var $closeButton = $modal.find('.room-detail-modal__close');
        var lastFocusedElement = null;
        var roomBookingLocale = (function resolveRoomBookingLocale() {
            var segments = (window.location.pathname || '').split('/').filter(Boolean);
            for (var i = 0; i < segments.length; i++) {
                var s = segments[i].toLowerCase();
                if (s === 'en' || s === '@en') {
                    return 'en-US';
                }
                if (s === 'fr' || s === '@fr') {
                    return 'fr-FR';
                }
            }
            return 'fr-FR';
        })();
        var roomBookingUrlPrefix =
            'https://www.secure-hotel-booking.com/d-edge/Best-Hotel-Bordeaux-Sud/J6VH/' +
            roomBookingLocale +
            '/DateSelection?roomId=';

        function buildList($container, items) {
            $container.empty();
            if (!items || !items.length) {
                return;
            }

            $.each(items, function (_, item) {
                $container.append($('<li>').text(item));
            });
        }

        function buildChips(items) {
            $chips.empty();
            if (!items || !items.length) {
                return;
            }

            $.each(items, function (_, item) {
                $chips.append($('<span>').text(item));
            });
        }

        function setMainImage(src, altText) {
            $mainImage.attr('src', src);
            $mainImage.attr('alt', altText);
        }

        function buildThumbnails(images, title) {
            $thumbs.empty();

            if (!images || !images.length) {
                return;
            }

            $.each(images, function (index, imageSrc) {
                var $button = $('<button>')
                    .attr('type', 'button')
                    .addClass('room-detail-modal__thumb')
                    .attr('aria-label', 'View photo ' + (index + 1) + ' of ' + title)
                    .attr('data-image-src', imageSrc);

                if (index === 0) {
                    $button.addClass('is-active');
                    setMainImage(imageSrc, title + ' photo ' + (index + 1));
                }

                $button.append(
                    $('<img>')
                        .attr('src', imageSrc)
                        .attr('alt', title + ' thumbnail ' + (index + 1))
                );

                $thumbs.append($button);
            });
        }

        function renderRoom(room) {
            $title.text(room.title || 'Room details');
            $size.text(room.size || '');
            $bed.text(room.bed || '');
            $capacity.text(room.capacity != null ? String(room.capacity) : '0');
            $description.text(room.description || '');
            
            buildChips(room.chips);
            buildList($bathroom, room.bathroom);
            buildList($facilities, room.facilities);
            buildThumbnails(room.images, room.title || 'Room');
        }

        function openModal(roomId, triggerElement) {
            if (!roomData) {
                return;
            }

            var room = roomData[roomId];
            if (!room) {
                return;
            }

            renderRoom(room);
            if ($bookButton.length) {
                if (room.roomId) {
                    $bookButton.attr(
                        'href',
                        roomBookingUrlPrefix +
                            encodeURIComponent(String(room.roomId)) +
                            '&currency=EUR'
                    );
                } else {
                    $bookButton.attr('href', '#');
                }
            }
            lastFocusedElement = triggerElement || null;
            $modal.addClass('is-open').attr('aria-hidden', 'false');
            $('body').addClass('room-modal-open');
            $closeButton.trigger('focus');
        }

        function closeModal() {
            $modal.removeClass('is-open').attr('aria-hidden', 'true');
            $('body').removeClass('room-modal-open');
            if (lastFocusedElement) {
                $(lastFocusedElement).trigger('focus');
                lastFocusedElement = null;
            }
        }

        $(document).on('click', '.room-modal-trigger', function (event) {
            event.preventDefault();

            var roomId = $(this).data('roomId');
            var triggerElement = this;

            resolveRoomData().done(function () {
                openModal(roomId, triggerElement);
            });
        });

        $modal.on('click', '[data-room-modal-close]', function () {
            closeModal();
        });

        $modal.on('click', '.room-detail-modal__thumb', function () {
            var imageSrc = $(this).attr('data-image-src');
            if (!imageSrc) {
                return;
            }

            var currentTitle = $title.text() || 'Room';
            $thumbs.find('.room-detail-modal__thumb').removeClass('is-active');
            $(this).addClass('is-active');
            setMainImage(imageSrc, currentTitle + ' photo');
        });

        $(document).on('keydown', function (event) {
            if (event.key === 'Escape' && $modal.hasClass('is-open')) {
                closeModal();
            }
        });

        resolveRoomData().done(function (data) {
            $('.room-showcase-item').each(function () {
                var $item = $(this);
                var roomId = $item.find('.room-modal-trigger').data('roomId');
                if (roomId && data[roomId]) {
                    var room = data[roomId];
                    if (room.description) {
                        $item.find('.room-showcase-desc').text(room.description);
                    }
                    if (room.price) {
                        $item.find('.room-showcase-amount').text(room.price);
                    }
                }
            });
        });
    })();

    /*------------------
		Date Picker
	--------------------*/
    if ($.fn.datepicker && $(".date-input").length) {
        var docLang = (document.documentElement.lang || '').toLowerCase();
        var isFr = docLang.indexOf('fr') === 0;

        var datepickerOpts = {
            minDate: 0,
            dateFormat: 'dd MM, yy',
            prevText: '',
            nextText: '',
            beforeShow: function () {
                setTimeout(function () {
                    var fr = (document.documentElement.lang || '').toLowerCase().indexOf('fr') === 0;
                    $('#ui-datepicker-div .ui-datepicker-prev').attr('aria-label', fr ? 'Mois précédent' : 'Previous month');
                    $('#ui-datepicker-div .ui-datepicker-next').attr('aria-label', fr ? 'Mois suivant' : 'Next month');
                }, 0);
            }
        };

        if (isFr) {
            $.extend(datepickerOpts, {
                closeText: 'Fermer',
                currentText: "Aujourd'hui",
                monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
                monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
                dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
                dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
                dayNamesMin: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
                weekHeader: 'Sem.',
                firstDay: 1,
                isRTL: false,
                showMonthAfterYear: false,
                yearSuffix: ''
            });
        } else {
            datepickerOpts.firstDay = 0;
        }

        $('.date-input').datepicker(datepickerOpts);

        var $dateIn = $('#date-in');
        var $dateOut = $('#date-out');
        if ($dateIn.length && $dateOut.length) {
            function syncCheckoutMinDate() {
                var arrival = $dateIn.datepicker('getDate');
                if (arrival) {
                    var minDeparture = new Date(
                        arrival.getFullYear(),
                        arrival.getMonth(),
                        arrival.getDate() + 1
                    );
                    $dateOut.datepicker('option', 'minDate', minDeparture);
                    var departure = $dateOut.datepicker('getDate');
                    if (departure && departure.getTime() <= arrival.getTime()) {
                        $dateOut.datepicker('setDate', minDeparture);
                    }
                } else {
                    $dateOut.datepicker('option', 'minDate', 1);
                }
            }

            var checkoutPrevBeforeShow = $dateOut.datepicker('option', 'beforeShow');
            $dateOut.datepicker('option', 'beforeShow', function (input, inst) {
                syncCheckoutMinDate();
                if (typeof checkoutPrevBeforeShow === 'function') {
                    checkoutPrevBeforeShow.call(this, input, inst);
                }
            });

            var openDepartureAfterArrivalPickerCloses = false;

            $dateIn.datepicker('option', 'onSelect', function () {
                syncCheckoutMinDate();
                openDepartureAfterArrivalPickerCloses = true;
            });
            $dateIn.datepicker('option', 'onClose', function () {
                if (!openDepartureAfterArrivalPickerCloses) {
                    return;
                }
                openDepartureAfterArrivalPickerCloses = false;
                setTimeout(function () {
                    syncCheckoutMinDate();
                    $dateOut.datepicker('show');
                }, 0);
            });
            $dateIn.on('change', function () {
                syncCheckoutMinDate();
            });
            syncCheckoutMinDate();
        }
    }

    /*------------------
		Nice Select
	--------------------*/
    if ($.fn.niceSelect && $("select").length) {
        $("select").niceSelect();
    }

    /*------------------
        D-edge widget selects -> Nice Select
    --------------------*/
    (function initWidgetNiceSelect() {
        if (!$.fn.niceSelect) {
            return;
        }

        var hosts = Array.prototype.slice.call(
            document.querySelectorAll('#fb-widget-1, #fb-widget-2, .fb-widget')
        );

        if (!hosts.length) {
            return;
        }

        function applyNiceSelectToWidget(root) {
            var $root = $(root);
            var $widgetSelects = $root.find('.fbw-calendar--config select');

            if (!$widgetSelects.length) {
                return;
            }

            $widgetSelects.each(function () {
                var $select = $(this);
                var $next = $select.next('.nice-select');

                if ($next.length) {
                    try {
                        $select.niceSelect('update');
                    } catch (error) {
                        // Re-initialize if update fails due to stale plugin state.
                        $next.remove();
                        $select.niceSelect();
                    }
                } else {
                    $select.niceSelect();
                }
            });
        }

        hosts.forEach(function (host) {
            applyNiceSelectToWidget(host);

            var observer = new MutationObserver(function (mutations) {
                var shouldRefresh = false;

                for (var i = 0; i < mutations.length; i++) {
                    var mutation = mutations[i];
                    if (!mutation.addedNodes || !mutation.addedNodes.length) {
                        continue;
                    }

                    for (var j = 0; j < mutation.addedNodes.length; j++) {
                        var node = mutation.addedNodes[j];
                        if (!(node instanceof Element)) {
                            continue;
                        }

                        if (
                            node.matches('select') ||
                            node.matches('.fbw-calendar--config') ||
                            node.querySelector('.fbw-calendar--config select')
                        ) {
                            shouldRefresh = true;
                            break;
                        }
                    }

                    if (shouldRefresh) {
                        break;
                    }
                }

                if (shouldRefresh) {
                    applyNiceSelectToWidget(host);
                }
            });

            observer.observe(host, {
                childList: true,
                subtree: true
            });
        });
    })();

    /*------------------
        D-edge widget modal -> lock page scroll
    --------------------*/
    (function initWidgetModalScrollLock() {
        var hosts = Array.prototype.slice.call(
            document.querySelectorAll('#fb-widget-1, #fb-widget-2, .fb-widget')
        );

        if (!hosts.length) {
            return;
        }

        var isLocked = false;
        var savedScrollY = 0;

        function setScrollLock(shouldLock) {
            if (shouldLock && !isLocked) {
                savedScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;

                document.body.classList.add('fb-widget-modal-open');
                document.documentElement.classList.add('fb-widget-modal-open');

                document.body.style.position = 'fixed';
                document.body.style.top = '-' + savedScrollY + 'px';
                document.body.style.left = '0';
                document.body.style.right = '0';
                document.body.style.width = '100%';

                isLocked = true;
                return;
            }

            if (!shouldLock && isLocked) {
                document.body.classList.remove('fb-widget-modal-open');
                document.documentElement.classList.remove('fb-widget-modal-open');

                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.left = '';
                document.body.style.right = '';
                document.body.style.width = '';

                window.scrollTo(0, savedScrollY);
                isLocked = false;
            }
        }

        function isElementVisible(node) {
            if (!(node instanceof Element)) {
                return false;
            }

            var style = window.getComputedStyle(node);
            if (
                style.display === 'none' ||
                style.visibility === 'hidden' ||
                style.opacity === '0'
            ) {
                return false;
            }

            var rect = node.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
        }

        function updateBodyScrollLock() {
            var isOpen = false;

            for (var i = 0; i < hosts.length; i++) {
                var masks = hosts[i].querySelectorAll('.modal-mask');
                for (var j = 0; j < masks.length; j++) {
                    if (isElementVisible(masks[j])) {
                        isOpen = true;
                        break;
                    }
                }

                if (isOpen) {
                    break;
                }
            }

            setScrollLock(isOpen);
        }

        updateBodyScrollLock();

        hosts.forEach(function (host) {
            var observer = new MutationObserver(function () {
                updateBodyScrollLock();
            });

            observer.observe(host, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'style']
            });

            host.addEventListener('click', function () {
                setTimeout(updateBodyScrollLock, 0);
            }, true);
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                setTimeout(updateBodyScrollLock, 0);
            }
        });
    })();

    /*------------------
        Secure booking form (#AVP) — POST like fr/template.html + base.js validate():
        action .../search?hotelId=20932; body: language, arrivalDate (Y-M-D), nights, _ga,
        guestCountSelector, crossSell, selectedAdultCount, selectedChildCount, selectedInfantCount, rate
	--------------------*/
    (function initSecureHotelBookingForm() {
        var $form = $('#AVP');
        if (!$form.length) {
            return;
        }

        var maxDuration = 30;
        var messageFr = 'Date en dehors du planning';

        function stripTime(d) {
            return new Date(d.getFullYear(), d.getMonth(), d.getDate());
        }

        function countNights(arrival, departure) {
            var a = stripTime(arrival).getTime();
            var dep = stripTime(departure).getTime();
            return Math.round((dep - a) / (1000 * 60 * 60 * 24));
        }

        function formatArrivalDateForAvp(arrival) {
            var y = arrival.getFullYear();
            var m = arrival.getMonth() + 1;
            var day = arrival.getDate();
            return y + '-' + m + '-' + day;
        }

        function checkGa() {
            if (typeof ga !== 'function') {
                return;
            }
            ga(function (tracker) {
                var el = document.getElementById('_ga');
                if (el) {
                    el.value = tracker.get('clientId');
                }
            });
        }

        checkGa();

        $form.on('submit', function (e) {
            e.preventDefault();

            var $in = $('#date-in');
            var $out = $('#date-out');
            var arrival = $in.datepicker('getDate');
            var departure = $out.datepicker('getDate');

            if (!arrival || !departure) {
                alert(messageFr);
                return;
            }

            var today = stripTime(new Date());
            if (stripTime(arrival) < today) {
                alert(messageFr);
                return;
            }

            var nights = countNights(arrival, departure);
            if (departure <= arrival || nights < 1 || (maxDuration > 0 && nights > maxDuration)) {
                alert(messageFr);
                return;
            }

            document.getElementById('AVP_arrivalDate').value = formatArrivalDateForAvp(arrival);
            document.getElementById('AVP_nights').value = String(nights);
            checkGa();

            this.submit();
        });
    })();

    /*------------------
        Contact form validation
    --------------------*/
    (function initContactFormValidation() {
        var forms = document.querySelectorAll('.contact-form');
        if (!forms.length) {
            return;
        }

        var messages = {
            fr: {
                email: 'Veuillez saisir une adresse e-mail valide.',
                message: 'Votre message doit contenir au moins 10 mots et plus de 50 caractères.'
            },
            en: {
                email: 'Please enter a valid email address.',
                message: 'Your message must contain at least 10 words and more than 50 characters.'
            }
        };

        function resolveLocale() {
            var lang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
            if (lang.indexOf('en') === 0) {
                return 'en';
            }
            if (lang.indexOf('fr') === 0) {
                return 'fr';
            }

            return (window.location.pathname || '').toLowerCase().indexOf('/en/') !== -1 ? 'en' : 'fr';
        }

        function countWords(value) {
            var trimmed = (value || '').trim();
            if (!trimmed) {
                return 0;
            }

            return trimmed.split(/\s+/).filter(Boolean).length;
        }

        function isValidEmail(value) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((value || '').trim());
        }

        function getTooltipElement(field) {
            return field._validationTooltip || null;
        }

        function removeTooltip(field) {
            var tooltip = getTooltipElement(field);
            if (tooltip && tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }

            field._validationTooltip = null;
            field.classList.remove('is-validation-invalid');
            field.removeAttribute('aria-invalid');
        }

        function showTooltip(field, message) {
            var tooltip = getTooltipElement(field);

            if (!tooltip) {
                tooltip = document.createElement('div');
                tooltip.className = 'field-validation-tooltip';
                tooltip.setAttribute('role', 'alert');
                tooltip.setAttribute('aria-live', 'polite');
                field.parentNode.insertBefore(tooltip, field.nextSibling);
                field._validationTooltip = tooltip;
            }

            tooltip.textContent = message;
            tooltip.classList.add('is-visible');
            field.classList.add('is-validation-invalid');
            field.setAttribute('aria-invalid', 'true');
        }

        function validateEmailField(field, locale, showError) {
            var valid = isValidEmail(field.value);
            if (!valid) {
                if (showError) {
                    showTooltip(field, messages[locale].email);
                }
                return false;
            }

            removeTooltip(field);
            return true;
        }

        function validateMessageField(field, locale, showError) {
            var text = (field.value || '').trim();
            var valid = text.length > 50 && countWords(text) >= 10;
            if (!valid) {
                if (showError) {
                    showTooltip(field, messages[locale].message);
                }
                return false;
            }

            removeTooltip(field);
            return true;
        }

        forms.forEach(function (form) {
            var locale = resolveLocale();
            var emailField = form.querySelector('input[name="email"]');
            var messageField = form.querySelector('textarea[name="message"]');

            form.noValidate = true;

            function validateField(field) {
                if (!field) {
                    return true;
                }

                if (field === emailField) {
                    return validateEmailField(field, locale, true);
                }

                if (field === messageField) {
                    return validateMessageField(field, locale, true);
                }

                return true;
            }

            function refreshField(field) {
                if (!field) {
                    return;
                }

                if (field === emailField) {
                    validateEmailField(field, locale, false);
                }

                if (field === messageField) {
                    validateMessageField(field, locale, false);
                }
            }

            if (emailField) {
                emailField.addEventListener('input', function () {
                    refreshField(emailField);
                });
                emailField.addEventListener('blur', function () {
                    validateField(emailField);
                });
            }

            if (messageField) {
                messageField.addEventListener('input', function () {
                    refreshField(messageField);
                });
                messageField.addEventListener('blur', function () {
                    validateField(messageField);
                });
            }

            form.addEventListener('submit', function (event) {
                var emailValid = true;
                var messageValid = true;

                if (emailField) {
                    emailValid = validateField(emailField);
                }

                if (messageField) {
                    messageValid = validateField(messageField);
                }

                if (!emailValid || !messageValid) {
                    event.preventDefault();

                    if (!emailValid && emailField) {
                        emailField.focus();
                    } else if (!messageValid && messageField) {
                        messageField.focus();
                    }
                }
            });
        });
    })();

    /*------------------
        Smooth Scroll
    --------------------*/
    $('.mainmenu ul li a[href*="#"]').on('click', function (e) {
        e.preventDefault();
        var id = $(this).attr('href');
        var $target = $(id);
        if ($target.length) {
            $('html, body').animate({
                scrollTop: $target.offset().top
            }, 800);
        }
    });

})(jQuery);