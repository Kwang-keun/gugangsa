(function () {
  var backdrop = document.getElementById('baekjungModal');
  if (!backdrop) return;

  var openBtns = document.querySelectorAll('.js-open-baekjung');
  var closeBtn = document.getElementById('baekjungClose');

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
})();
