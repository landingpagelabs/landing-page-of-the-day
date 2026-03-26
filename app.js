/* ============================================================
   Landing Page of the Day — Client-side JS
   Hero carousel, infinite scroll, mobile menu, dynamic dates
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

  // ----- Hero Carousel -----
  var items = Array.from(document.querySelectorAll('.hero_block-item'));
  if (items.length) {
    var currentIndex = 0;

    function setActive(index) {
      items.forEach(function (el) { el.classList.remove('active'); });
      items[index].classList.add('active');
    }

    function goTo(index) {
      currentIndex = (index + items.length) % items.length;
      setActive(currentIndex);
    }

    // Bind all prev/next buttons upfront (use closure to always read currentIndex)
    items.forEach(function (item) {
      var prevBtn = item.querySelector('.hero_block-content-prev');
      var nextBtn = item.querySelector('.hero_block-content-next');
      if (prevBtn) {
        prevBtn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          goTo(currentIndex - 1);
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          goTo(currentIndex + 1);
        });
      }
    });

    // "Return To Today" buttons -> go back to first item
    document.querySelectorAll('[data-new-cms]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        goTo(0);
      });
    });

    // Keyboard navigation (left/right arrows)
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') {
        goTo(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        goTo(currentIndex + 1);
      }
    });

    // Init
    setActive(currentIndex);
  }

  // ----- Winners Infinite Scroll -----
  var list = document.querySelector(".winners_list");
  var hiddenItems = list ? list.querySelectorAll(".winners_list-item") : [];
  var loadMoreBtn = document.querySelector(".winners_list-cta");
  var BATCH_SIZE = 6;
  var revealedCount = 0;

  function revealBatch() {
    var end = Math.min(revealedCount + BATCH_SIZE, hiddenItems.length);
    for (var i = revealedCount; i < end; i++) {
      hiddenItems[i].style.display = '';
    }
    revealedCount = end;

    // Hide the sentinel and button when all revealed
    if (revealedCount >= hiddenItems.length) {
      if (loadMoreBtn) loadMoreBtn.style.display = 'none';
      if (sentinel) sentinel.style.display = 'none';
    }
  }

  // Create an invisible sentinel element after the grid
  var sentinel = null;
  if (list && hiddenItems.length > BATCH_SIZE) {
    sentinel = document.createElement('div');
    sentinel.className = 'winners_scroll-sentinel';
    sentinel.style.height = '1px';
    list.parentNode.insertBefore(sentinel, list.nextSibling);

    // Use IntersectionObserver for infinite scroll
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting && revealedCount < hiddenItems.length) {
          revealBatch();
        }
      }, { rootMargin: '200px' });
      observer.observe(sentinel);
    }

    // Also keep the load more button as fallback
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', function () {
        revealBatch();
      });
    }

    // Initially show first batch, hide the rest
    hiddenItems.forEach(function (item, i) {
      if (i >= BATCH_SIZE) item.style.display = 'none';
    });
    revealedCount = BATCH_SIZE;
  } else if (loadMoreBtn) {
    // Fewer items than batch size — hide the button
    loadMoreBtn.style.display = 'none';
  }

  // ----- Mobile Menu -----
  var iconMenu = document.querySelector('.menu_icon');
  var iconMenuWrap = document.querySelector('.menu_icon-wrap');
  var menuBody = document.querySelector('.header_menu');

  if (iconMenu && iconMenuWrap && menuBody) {
    iconMenuWrap.addEventListener('click', function () {
      document.body.classList.toggle('_lock');
      iconMenu.classList.toggle('_active');
      menuBody.classList.toggle('_active');
      iconMenuWrap.classList.toggle('_active');
    });
  }

  // ----- Dynamic Month/Year -----
  var now = new Date();
  var monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  document.querySelectorAll('[dyn]').forEach(function (el) {
    var type = el.getAttribute('dyn');
    if (type === 'Month') {
      el.textContent = monthNames[now.getMonth()];
    } else if (type === 'Year') {
      el.textContent = now.getFullYear();
    }
  });

});

// ----- Favicon Change on Tab Switch -----
document.addEventListener("visibilitychange", function () {
  var favicon = document.querySelector('link[rel="shortcut icon"]');
  if (!favicon) return;

  var standardFavicon = "https://lpl-client-research.b-cdn.net/lp-of-the-day/favicon-default.avif";
  var changedFavicon = "https://lpl-client-research.b-cdn.net/lp-of-the-day/favicon-changed.avif";

  if (document.hidden) {
    favicon.href = changedFavicon;
  } else {
    favicon.href = standardFavicon;
  }
});
