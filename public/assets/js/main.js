/*
 *
 * JS Script
 * @ThemeEaster
 */

(function ($) {
    "use strict";

    /* ======= Preloader ======= */
    $(window).on('load', function () {
        $('body').addClass('loaded');
    });

    $(document).ready(function () {

        /* ======= Header ======= */
        var primaryHeader = $('.primary-header'),
            headerClone = primaryHeader.clone();
        $('.header').after('<div class="sticky-header"></div>');
        $('.sticky-header').html(headerClone);
        var headerSelector = document.querySelector(".sticky-header");
        var triggerPoint = $('.header').height();
        var yOffset = 0;

        $(window).on('scroll', function () {
            yOffset = $(window).scrollTop();
            if (yOffset >= triggerPoint) {
                $('.sticky-header').addClass('sticky-fixed-top');
            } else {
                $('.sticky-header').removeClass('sticky-fixed-top');
            }
        });

        if ($('.primary-header').length) {
            $('.header .primary-header .burger-menu').on("click", function () {
                $(this).toggleClass('menu-open');
                $('.header .header-menu-wrap').slideToggle(300);
            });

            $('.sticky-header .primary-header .burger-menu').on("click", function () {
                $(this).toggleClass('menu-open');
                $('.sticky-header .header-menu-wrap').slideToggle(300);
            });
        }

        $('.header-menu-wrap ul li:has(ul)').each(function () {
            $(this).append('<span class="dropdown-plus"></span>');
            $(this).addClass('dropdown_menu');
        });

        $('.header-menu-wrap .dropdown-plus').on("click", function () {
            $(this).prev('ul').slideToggle(300);
            $(this,).toggleClass('dropdown-open');
            $('.header-menu-wrap ul li:has(ul)').toggleClass('dropdown-open');
        });

        $('.header-menu-wrap .dropdown_menu a').append('<span></span>');

        // Responsive Classes
        function responsiveClasses() {
            var body = $('body');
            if ($(window).width() < 992) {
                body.removeClass('viewport-lg');
                body.addClass('viewport-sm');
            } else {
                body.removeClass('viewport-sm');
                body.addClass('viewport-lg');
            }
        }

        // Transparent Header
        function transparentHeader() {
            if ($('body').hasClass('header-3')) {
                var stickyHeader = $('.header-3 .header .header-logo'),
                    stickyHeaderLogo = stickyHeader.data('sticky-logo');
                if ('' != stickyHeaderLogo) {
                    $(".header-3 .sticky-header .header-logo img").attr('src', stickyHeaderLogo);
                }
            }
            var header = $('.header.header-three'),
                headerHeight = header.height(),
                pageHeader = $('.page-header');
            pageHeader.css('padding-top', headerHeight + 'px');
        }

        //responsiveClasses();
        $(window).on("resize", function () {
            responsiveClasses();
            transparentHeader();
        }).resize();

        /* ========== Popup Search Box ========== */
        $(function () {
            $('#dl-popup-search-box').removeClass('toggled');

            $('.dl-search-icon').on('click', function (e) {
                e.stopPropagation();
                $('#dl-popup-search-box').toggleClass('toggled');
                $("#popup-search").focus();
            });

            $('#dl-popup-search-box input').on('click', function (e) {
                e.stopPropagation();
            });

            $('#dl-popup-search-box, body').on('click', function () {
                $('#dl-popup-search-box').removeClass('toggled');
            });
        });

        // Unified Ripple Effect for Buttons and Icons
        $('.header-btn, .custom-btn, .ripple-wrapper').on('mouseenter mouseout', function (e) {
            var parentOffset = $(this).offset(),
                relX = e.pageX - parentOffset.left,
                relY = e.pageY - parentOffset.top;

            $(this).find('span').css({
                top: relY,
                left: relX
            });
        });
        

        /* Smooth Scrolling */
        $('a[href*="#"]').smoothscroll({
            duration: 400
        });

        /* Scroll to Top */
        var scrollTop = $("#scroll-top");
        $(window).on('scroll', function () {
            var topPos = $(this).scrollTop();
            if (topPos > 100) {
                $('#scrollup').removeClass('hide');
                $('#scrollup').addClass('show');

            } else {
                $('#scrollup').removeClass('show');
                $('#scrollup').addClass('hide');
            }
        });

        /* Click event to scroll to top */
        $(scrollTop).on("click", function () {
            $('html, body').animate({
                scrollTop: 0
            }, 800);
            return false;
        });

        /* ======= Main Slider ======= */
        $('#main-slider').on('init', function (e, slick) {
            var $firstAnimatingElements = $('div.single-slide:first-child').find('[data-animation]');
            doAnimations($firstAnimatingElements);
        });
        $('#main-slider').on('beforeChange', function (e, slick, currentSlide, nextSlide) {
            var $animatingElements = $('div.single-slide[data-slick-index="' + nextSlide + '"]').find('[data-animation]');
            doAnimations($animatingElements);
        });
        $('#main-slider').slick({
            autoplay: true,
            autoplaySpeed: 10000,
            dots: true,
            fade: true,
            prevArrow: '<div class="slick-prev"><i class="fa fa-chevron-left"></i></div>',
            nextArrow: '<div class="slick-next"><i class="fa fa-chevron-right"></i></div>'
        });

        function doAnimations(elements) {
            var animationEndEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            elements.each(function () {
                var $this = $(this);
                var $animationDelay = $this.data('delay');
                var $animationType = 'animated ' + $this.data('animation');
                $this.css({
                    'animation-delay': $animationDelay,
                    '-webkit-animation-delay': $animationDelay
                });
                $this.addClass($animationType).one(animationEndEvents, function () {
                    $this.removeClass($animationType);
                });
            });
        }

        /* ======= Button Effect ======= */
        $('.default-btn').on('mouseenter', function (e) {
            var parentOffset = $(this).offset(),
                relX = e.pageX - parentOffset.left,
                relY = e.pageY - parentOffset.top;
            $(this).find('span').css({
                top: relY,
                left: relX
            })
        }).on('mouseout', function (e) {
            var parentOffset = $(this).offset(),
                relX = e.pageX - parentOffset.left,
                relY = e.pageY - parentOffset.top;
            $(this).find('span').css({
                top: relY,
                left: relX
            })
        });

        /* ======= Odometer ======= */
        $('.odometer').waypoint(
            function () {
                var odo = $(".odometer");
                odo.each(function () {
                    var countNumber = $(this).attr("data-count");
                    $(this).html(countNumber);
                });
            }, {
            offset: "80%",
            triggerOnce: true
        }
        );

        /* ======= CurrentYear ======= */
        var currentYear = new Date().getFullYear();
        $('#currentYear').append(currentYear);

        /* ======= WOW Active ======= */
        new WOW().init();

        $('select').niceSelect();

        /* ======= Lightbox Active ======= */
        $('.popup-video').magnificPopup({
            disableOn: 700,
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: false,
            fixedContentPos: false
        });

        // Gallery Popup
        $('.popup-gallery').magnificPopup({
            delegate: '.popup-img',
            type: 'image',
            closeOnContentClick: false,
            closeBtnInside: false,
            mainClass: 'mfp-with-zoom mfp-img-mobile',
            image: {
                verticalFit: true,
                titleSrc: function (item) {
                    return item.el.attr('title') + ' &middot; <a class="image-source-link" href="' + item.el.attr('data-source') + '" target="_blank">image source</a>';
                }
            },
            gallery: {
                enabled: true
            },
            zoom: {
                enabled: true,
                duration: 300, // don't foget to change the duration also in CSS
                opener: function (element) {
                    return element.find('img');
                }
            }
        });

        // Single Image
        $('.img-popup').magnificPopup({
            type: 'image',
            closeOnContentClick: true,
            mainClass: 'mfp-img-mobile',
            image: {
                verticalFit: true
            }

        });

        /* ======= Projects ======= */
        $('.project-carousel').slick({
            dots: true,
            infinite: false,
            speed: 300,
            slidesToShow: 5,
            slidesToScroll: 3,
            prevArrow: '<i class="ti-arrow-left left"></i>',
            nextArrow: '<i class="ti-arrow-right right"></i>',
            infinite: true,
            dots: true,
            pauseOnFocus: false,
            pauseOnHover: true,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                    }
                },
                {
                    breakpoint: 767,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2
                    }
                },
                {
                    breakpoint: 580,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });

        /* ======= YT Player ======= */
        $("#video-bg").YTPlayer();

        /* ======= Testimonials ======= */
        $('.testimonials-carousel').slick({
            dots: true,
            infinite: false,
            speed: 300,
            slidesToShow: 2,
            slidesToScroll: 2,
            prevArrow: '<i class="ti-arrow-left left"></i>',
            nextArrow: '<i class="ti-arrow-right right"></i>',
            infinite: true,
            dots: true,
            pauseOnFocus: false,
            pauseOnHover: true,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    }
                },
                {
                    breakpoint: 767,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    }
                },
                {
                    breakpoint: 580,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });

        /* ======= Project Details ======= */
        $('.project-details-carousel').slick({
            dots: true,
            infinite: false,
            speed: 300,
            slidesToShow: 1,
            slidesToScroll: 1,
            prevArrow: '<i class="ti-arrow-left left"></i>',
            nextArrow: '<i class="ti-arrow-right right"></i>',
            infinite: true,
            dots: false,
            pauseOnFocus: false,
            pauseOnHover: true,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    }
                },
                {
                    breakpoint: 767,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    }
                },
                {
                    breakpoint: 580,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });

        /* ======= Simple Parralax ======= */
        var bgBack = document.getElementsByClassName('img-2');
        var bgFront = document.getElementsByClassName('img-1');
        var bgRight = document.getElementsByClassName('bg-right');
        var bgBottom = document.getElementsByClassName('bg-bottom');
        var bgCenter = document.getElementsByClassName('bg-center');
        new simpleParallax(bgBack, {
            overflow: true,
            orientation: 'right',
            maxTransition: 70
        });

        new simpleParallax(bgFront, {
            overflow: true,
            orientation: 'down',
            maxTransition: 70
        });
        new simpleParallax(bgRight, {
            overflow: true,
            orientation: 'right',
            maxTransition: 70
        });
        new simpleParallax(bgBottom, {
            overflow: true,
            orientation: 'bottom',
            maxTransition: 70
        });
        new simpleParallax(bgCenter, {
            overflow: true,
            orientation: 'left',
            maxTransition: 70
        });

        /* ======= Faq Accordion ======= */
        $('.collapse').on('shown.bs.collapse', function () {
            $(".collapse.show").parent().addClass('active-acc');
        });
        $('.collapse').on('hidden.bs.collapse', function () {
            $(".collapse").parent().removeClass('active-acc');
        });

        /* ======= MAILCHIMP ======= */
        if ($('.subscribe_form').length > 0) {
            /*  MAILCHIMP  */
            $('.subscribe_form').ajaxChimp({
                language: 'es',
                callback: mailchimpCallback,
                url: "//alexatheme.us14.list-manage.com/subscribe/post?u=48e55a88ece7641124b31a029&amp;id=361ec5b369"
            });
        }

        function mailchimpCallback(resp) {
            if (resp.result === 'success') {
                $('#subscribe-result').addClass('subs-result');
                $('.subscription-success').text(resp.msg).fadeIn();
                $('.subscription-error').fadeOut();

            } else if (resp.result === 'error') {
                $('#subscribe-result').addClass('subs-result');
                $('.subscription-error').text(resp.msg).fadeIn();
            }
        }
        $.ajaxChimp.translations.es = {
            'submit': 'Submitting...',
            0: 'We have sent you a confirmation email',
            1: 'Please enter your email',
            2: 'An email address must contain a single @',
            3: 'The domain portion of the email address is invalid (the portion after the @: )',
            4: 'The username portion of the email address is invalid (the portion before the @: )',
            5: 'This email address looks fake or invalid. Please enter a real email address'
        };
    });


})(jQuery);
