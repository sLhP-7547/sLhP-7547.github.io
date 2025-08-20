/*
    Massively by HTML5 UP
    html5up.net | @ajlkn
    Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

    var $window = $(window),
        $body = $('body'),
        $wrapper = $('#wrapper'),
        $header = $('#header'),
        $nav = $('#nav'),
        $main = $('#main'),
        $navPanelToggle, $navPanel, $navPanelInner;

    // Breakpoints.
    breakpoints({
        default:   ['1681px',   null       ],
        xlarge:    ['1281px',   '1680px'   ],
        large:     ['981px',    '1280px'   ],
        medium:    ['737px',    '980px'    ],
        small:     ['481px',    '736px'    ],
        xsmall:    ['361px',    '480px'    ],
        xxsmall:   [null,       '360px'    ]
    });

    /**
     * Applies parallax scrolling to an element's background image.
     * @return {jQuery} jQuery object.
     */
    $.fn._parallax = function(intensity) {

        var $window = $(window),
            $this = $(this);

        if (this.length == 0 || intensity === 0)
            return $this;

        if (this.length > 1) {

            for (var i=0; i < this.length; i++)
                $(this[i])._parallax(intensity);

            return $this;

        }

        if (!intensity)
            intensity = 0.25;

        $this.each(function() {

            var $t = $(this),
                $bg = $('<div class="bg"></div>').appendTo($t),
                on, off;

            on = function() {

                $bg
                    .removeClass('fixed')
                    .css('transform', 'matrix(1,0,0,1,0,0)');

                $window
                    .on('scroll._parallax', function() {

                        var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

                        $bg.css('transform', 'matrix(1,0,0,1,0,' + (pos * intensity) + ')');

                    });

            };

            off = function() {

                $bg
                    .addClass('fixed')
                    .css('transform', 'none');

                $window
                    .off('scroll._parallax');

            };

            // Disable parallax on ..
                if (browser.name == 'ie'            // IE
                ||  browser.name == 'edge'          // Edge
                ||  window.devicePixelRatio > 1     // Retina/HiDPI (= poor performance)
                ||  browser.mobile)                 // Mobile devices
                    off();

            // Enable everywhere else.
                else {

                    breakpoints.on('>large', on);
                    breakpoints.on('<=large', off);

                }

        });

        $window
            .off('load._parallax resize._parallax')
            .on('load._parallax resize._parallax', function() {
                $window.trigger('scroll');
            });

        return $(this);

    };

    // Play initial animations on page load.
    $window.on('load', function() {
        window.setTimeout(function() {
            $body.removeClass('is-preload');
        }, 100);
    });

    // Scrolly.
    $('.scrolly').scrolly();

    // Background.
    $wrapper._parallax(0.925);

    // Nav Panel.

    // Toggle.
    $navPanelToggle = $(
        '<a href="#navPanel" id="navPanelToggle">Menu</a>'
    )
        .appendTo($wrapper);

    // Change toggle styling once we've scrolled past the header.
    $header.scrollex({
        bottom: '5vh',
        enter: function() {
            $navPanelToggle.removeClass('alt');
        },
        leave: function() {
            $navPanelToggle.addClass('alt');
        }
    });

    // Panel.
    $navPanel = $(
        '<div id="navPanel">' +
            '<nav>' +
            '</nav>' +
            '<a href="#navPanel" class="close"></a>' +
        '</div>'
    )
        .appendTo($body)
        .panel({
            delay: 500,
            hideOnClick: true,
            hideOnSwipe: true,
            resetScroll: true,
            resetForms: true,
            side: 'right',
            target: $body,
            visibleClass: 'is-navPanel-visible'
        });

    // Get inner.
    $navPanelInner = $navPanel.children('nav');

    // Move nav content on breakpoint change.
    var $navContent = $nav.children();

    breakpoints.on('>medium', function() {

        // NavPanel -> Nav.
        $navContent.appendTo($nav);

        // Flip icon classes.
        $nav.find('.icons, .icon')
            .removeClass('alt');

    });

    breakpoints.on('<=medium', function() {

        // Nav -> NavPanel.
        $navContent.appendTo($navPanelInner);

        // Flip icon classes.
        $navPanelInner.find('.icons, .icon')
            .addClass('alt');

    });

    // Hack: Disable transitions on WP.
    if (browser.os == 'wp'
    &&  browser.osVersion < 10)
        $navPanel
            .css('transition', 'none');

    // Intro.
    var $intro = $('#intro');

    if ($intro.length > 0) {

        // Hack: Fix flex min-height on IE.
        if (browser.name == 'ie') {
            $window.on('resize.ie-intro-fix', function() {

                var h = $intro.height();

                if (h > $window.height())
                    $intro.css('height', 'auto');
                else
                    $intro.css('height', h);

            }).trigger('resize.ie-intro-fix');
        }

        // Hide intro on scroll (> small).
        breakpoints.on('>small', function() {

            $main.unscrollex();

            $main.scrollex({
                mode: 'bottom',
                top: '25vh',
                bottom: '-50vh',
                enter: function() {
                    $intro.addClass('hidden');
                },
                leave: function() {
                    $intro.removeClass('hidden');
                }
            });

        });

        // Hide intro on scroll (<= small).
        breakpoints.on('<=small', function() {

            $main.unscrollex();

            $main.scrollex({
                mode: 'middle',
                top: '15vh',
                bottom: '-15vh',
                enter: function() {
                    $intro.addClass('hidden');
                },
                leave: function() {
                    $intro.removeClass('hidden');
                }
            });

        });

    }

    // ===========================
    // Equipo - pestañas con toggle
    // ===========================
    document.querySelectorAll('.tab-buttons li').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            const content = document.getElementById(tab);
            const wasActive = btn.classList.contains('active');
            // collapse all first
            document.querySelectorAll('.tab-buttons li').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            // if not previously active, open it
            if (!wasActive) {
                btn.classList.add('active');
                content.classList.add('active');
            }
        });
    });

    
    // Animate Documents section and items on scroll
    const docsSection = document.querySelector('.section-docs');
    const docsItems = document.querySelectorAll('.docs-list li a');

    if ('IntersectionObserver' in window && docsSection) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // reveal section
                    entry.target.classList.add('visible');
                    // stagger reveal items
                    docsItems.forEach((item, idx) => {
                        setTimeout(() => item.classList.add('visible'), idx * 150);
                    });
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        observer.observe(docsSection);
    }

//Embeed pdf//
document.addEventListener('DOMContentLoaded', () => {
  const docsList = document.getElementById('docs-list');
  const pdfSelect = document.getElementById('pdf-list');
  const pdfViewer = document.getElementById('pdfViewer');
  const pdfContainer = document.getElementById('pdfContainer');

  if (!docsList || !pdfSelect || !pdfViewer || !pdfContainer) return;

  // Limpiar opciones (menos la placeholder)
  pdfSelect.innerHTML = '<option value="" selected disabled>-- Selecciona un documento --</option>';

  // Crear opciones a partir de los enlaces en la lista
  const links = docsList.querySelectorAll('li > a');
  links.forEach(link => {
    const href = link.getAttribute('href');
    const title = link.querySelector('span:last-child').textContent || href;
    const option = document.createElement('option');
    option.value = href;
    option.textContent = title;
    pdfSelect.appendChild(option);
  });

  // Evento para cambiar el PDF mostrado
  pdfSelect.addEventListener('change', () => {
    const selectedValue = pdfSelect.value;
    if (selectedValue) {
      pdfViewer.src = selectedValue;
      pdfContainer.style.display = 'block';
      setTimeout(() => pdfContainer.classList.add('visible'), 10);
    } else {
      pdfContainer.classList.remove('visible');
      setTimeout(() => {
        pdfContainer.style.display = 'none';
        pdfViewer.src = '';
      }, 600);
    }
  });
});
//Animación bienvenida//
document.addEventListener('DOMContentLoaded', () => {
  const welcomeSection = document.querySelector('#welcome');
  const logo = welcomeSection.querySelector('.image.fit');
  const welcomeText = welcomeSection.querySelector('.col-8 p');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        logo.classList.add('animate');
        welcomeText.classList.add('animate');
      } else {
        logo.classList.remove('animate');
        welcomeText.classList.remove('animate');
      }
    });
  }, { threshold: 0.3 });

  observer.observe(welcomeSection);
});
})(jQuery);