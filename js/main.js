(function () {
  // ===== 1. 모바일 메뉴 토글 스크립트 =====
  var menuToggle = document.getElementById('menuToggle');
  var mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
  var mobileLinks = document.querySelectorAll('.mobile-nav-links a');

  if (menuToggle && mobileMenuOverlay) {
    function toggleMobileMenu() {
      var isOpen = mobileMenuOverlay.classList.contains('is-open');
      if (isOpen) {
        mobileMenuOverlay.classList.remove('is-open');
        menuToggle.classList.remove('is-active');
        document.body.style.overflow = '';
      } else {
        mobileMenuOverlay.classList.add('is-open');
        menuToggle.classList.add('is-active');
        document.body.style.overflow = 'hidden';
      }
    }

    menuToggle.addEventListener('click', toggleMobileMenu);

    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenuOverlay.classList.remove('is-open');
        menuToggle.classList.remove('is-active');
        document.body.style.overflow = '';
      });
    });
  }

  // ===== 2. 상단 메뉴 드롭다운 (Quick Guide / 구강사 공지 / 구강사 소식) =====
  var tmGroups = document.querySelectorAll('.tm-group');

  function closeAllTmGroups() {
    tmGroups.forEach(function (g) {
      g.classList.remove('is-open');
      var t = g.querySelector('.tm-trigger');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }

  if (tmGroups.length > 0) {
    tmGroups.forEach(function (group) {
      var trigger = group.querySelector('.tm-trigger');
      if (!trigger) return;
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var wasOpen = group.classList.contains('is-open');
        closeAllTmGroups();
        if (!wasOpen) {
          group.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });

    document.addEventListener('click', function (e) {
      var openGroup = document.querySelector('.tm-group.is-open');
      if (openGroup && !openGroup.contains(e.target)) closeAllTmGroups();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAllTmGroups();
    });
  }

  // ===== 3. 스크롤 페이드인 (Intersection Observer) =====
  var revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // 한 번 등장하면 관찰 해제
        }
      });
    }, {
      threshold: 0.15 // 15% 정도 노출되었을 때 동작
    });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Intersection Observer 미지원 브라우저 대응 (폴백)
    revealElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }
})();
