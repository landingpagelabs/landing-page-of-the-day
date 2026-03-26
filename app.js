/* ============================================================
   Landing Page of the Day — Client-side JS
   Hero carousel, load more, mobile menu, favicon, title flash
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

  // ----- Hero Carousel -----
  const items = Array.from(document.querySelectorAll('.hero_block-item'));
  if (items.length) {
    let currentIndex = 0;

    function setActive(index) {
      items.forEach(function (el) { el.classList.remove('active'); });
      items[index].classList.add('active');
    }

    function bindPrevButton() {
      var activeBlock = items[currentIndex];
      var prevBtn = activeBlock.querySelector('.hero_block-content-prev');
      if (!prevBtn) return;

      prevBtn.onclick = function (e) {
        e.preventDefault();
        currentIndex = (currentIndex + 1) % items.length;
        setActive(currentIndex);
        bindPrevButton();
      };
    }

    // "Return To Today" buttons -> go back to first item
    var newCmsButtons = document.querySelectorAll('[data-new-cms]');
    newCmsButtons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        currentIndex = 0;
        setActive(currentIndex);
        bindPrevButton();
      });
    });

    // Init
    setActive(currentIndex);
    bindPrevButton();
  }

  // ----- Winners Load More -----
  var btn = document.querySelector(".winners_list-cta");
  var list = document.querySelector(".winners_list");
  var icon = document.querySelector(".winners_list-icon-plus");
  var text = document.querySelector(".label-medium.cta");

  if (btn && list) {
    btn.addEventListener("click", function () {
      var isOpen = list.classList.toggle("_show-all");

      if (icon) {
        icon.classList.toggle("active", isOpen);
      }

      if (text) {
        text.textContent = isOpen ? "Close more" : "Load more";
      }
    });
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

// ----- Title Flashing on Tab Switch -----
(function () {
  var originalTitle = document.title;
  var flashInterval = null;
  var preventFlashing = false;

  function startFlashing() {
    if (preventFlashing) return;
    var isFlashing = false;
    if (!flashInterval) {
      flashInterval = setInterval(function () {
        document.title = isFlashing ? "(1) New Message!" : originalTitle;
        isFlashing = !isFlashing;
      }, 1000);
    }
  }

  function stopFlashing() {
    if (flashInterval) {
      clearInterval(flashInterval);
      flashInterval = null;
      document.title = originalTitle;
    }
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden && !preventFlashing) {
      startFlashing();
    } else {
      stopFlashing();
    }
  });

  document.querySelectorAll("[data-stop-flashing='true']").forEach(function (button) {
    button.addEventListener("click", function () {
      preventFlashing = true;
      stopFlashing();
    });
  });
})();
