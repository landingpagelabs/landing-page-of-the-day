/* ============================================================
   Landing Page of the Day — Client-side JS
   Load more, mobile menu, notification favicon
   ============================================================ */

(function () {
  'use strict';

  var itemsPerPage = (typeof ITEMS_PER_PAGE !== 'undefined') ? ITEMS_PER_PAGE : 6;

  // --- Load More (Previous Winners) ---
  var grid = document.getElementById('winnersGrid');
  var loadMoreWrap = document.getElementById('loadMoreWrap');
  var loadMoreBtn = document.getElementById('loadMoreBtn');

  if (grid) {
    var allCards = Array.from(grid.querySelectorAll('.winner-card'));
    var visibleCount = 0;

    // Initial state: show first batch, hide rest
    allCards.forEach(function (card, i) {
      if (i < itemsPerPage) {
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    // Show/hide load more button
    if (allCards.length > itemsPerPage && loadMoreWrap) {
      loadMoreWrap.style.display = 'block';
    }

    function showMore() {
      var nextBatch = allCards.slice(visibleCount, visibleCount + itemsPerPage);
      nextBatch.forEach(function (card) {
        card.classList.remove('hidden');
        visibleCount++;
      });

      // Hide button when all shown
      if (visibleCount >= allCards.length && loadMoreWrap) {
        loadMoreWrap.style.display = 'none';
      }

      // Update button text
      if (loadMoreBtn) {
        var remaining = allCards.length - visibleCount;
        if (remaining > 0) {
          loadMoreBtn.querySelector('span').textContent = 'Load more (' + remaining + ' remaining)';
        }
      }
    }

    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', function () { showMore(); });
    }
  }


  // --- Mobile Menu ---
  var menuIcon = document.getElementById('menuIcon');
  var mobileMenu = document.getElementById('mobileMenu');

  if (menuIcon && mobileMenu) {
    menuIcon.addEventListener('click', function () {
      menuIcon.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    var menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        menuIcon.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }


  // --- Form submission (Formspree) ---
  var form = document.getElementById('submitForm');
  var formSuccess = document.getElementById('formSuccess');
  var formError = document.getElementById('formError');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var formData = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          form.style.display = 'none';
          if (formSuccess) formSuccess.style.display = 'block';
        } else {
          if (formError) formError.style.display = 'block';
        }
      }).catch(function () {
        if (formError) formError.style.display = 'block';
      });
    });
  }

})();


/* ============================================================
   Notification favicon + flashing title when tab is inactive
   ============================================================ */
(function () {
  'use strict';

  var originalTitle = document.title;
  var originalFavicon = null;
  var notificationFavicon = null;
  var flashInterval = null;
  var isFlashing = false;

  // Capture original favicon href
  var linkEl = document.querySelector('link[rel="icon"][type="image/png"][sizes="32x32"]')
            || document.querySelector('link[rel="shortcut icon"]')
            || document.querySelector('link[rel="icon"]');
  if (linkEl) {
    originalFavicon = linkEl.href;
  }

  // Build notification favicon with (1) badge using canvas
  function buildNotificationFavicon(callback) {
    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function () {
      var canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      var ctx = canvas.getContext('2d');

      // Draw original favicon
      ctx.drawImage(img, 0, 0, 32, 32);

      // Draw red circle badge
      ctx.beginPath();
      ctx.arc(24, 8, 8, 0, 2 * Math.PI);
      ctx.fillStyle = '#FF3B30';
      ctx.fill();

      // Draw "1" text
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('1', 24, 9);

      callback(canvas.toDataURL('image/png'));
    };
    img.onerror = function () { callback(null); };
    img.src = originalFavicon || '/favicon.png';
  }

  function setFavicon(href) {
    var links = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
    links.forEach(function (l) {
      l.href = href;
    });
  }

  function startFlashing() {
    if (isFlashing) return;
    isFlashing = true;

    buildNotificationFavicon(function (dataUrl) {
      notificationFavicon = dataUrl;
      var showNotification = true;

      flashInterval = setInterval(function () {
        if (showNotification) {
          document.title = '(1) New Message!';
          if (notificationFavicon) setFavicon(notificationFavicon);
        } else {
          document.title = originalTitle;
          if (originalFavicon) setFavicon(originalFavicon);
        }
        showNotification = !showNotification;
      }, 1500);
    });
  }

  function stopFlashing() {
    if (!isFlashing) return;
    isFlashing = false;
    clearInterval(flashInterval);
    document.title = originalTitle;
    if (originalFavicon) setFavicon(originalFavicon);
  }

  // Start flashing when user leaves tab, stop when they return
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      setTimeout(function () {
        if (document.hidden) startFlashing();
      }, 3000);
    } else {
      stopFlashing();
    }
  });
})();
