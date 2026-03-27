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
        var $smoking = $('#roomDetailSmoking');
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
            $smoking.text(room.smoking || '');

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