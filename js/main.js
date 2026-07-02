(function () {
  // ===== 1. 백중(우란분절) 모달 스크립트 =====
  var backdrop = document.getElementById('baekjungModal');
  var openBtns = document.querySelectorAll('.js-open-baekjung');
  var closeBtn = document.getElementById('baekjungClose');

  if (backdrop && openBtns.length > 0 && closeBtn) {
    function openModal() {
      backdrop.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function closeModal() {
      backdrop.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    openBtns.forEach(function (btn) {
      btn.addEventListener('click', openModal);
    });

    closeBtn.addEventListener('click', closeModal);

    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) closeModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && backdrop.classList.contains('is-open')) closeModal();
    });
  }

  // ===== 2. 모바일 메뉴 토글 스크립트 =====
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
