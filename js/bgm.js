// ===== 배경음악: 모든 페이지 공통, 켬/끔 상태와 재생 위치를 페이지 간에 이어감 =====
(function () {
  var KEY_STATE = 'bgmState'; // 'on' | 'off' (방문자가 끄면 다른 페이지에서도 꺼진 채 유지)
  var KEY_TIME = 'bgmTime';

  function load(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function save(key, val) { try { localStorage.setItem(key, val); } catch (e) {} }

  var audio = document.createElement('audio');
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = 0.3;
  audio.src = encodeURI('mp3/서울구강사 Good 남녀혼성뚜엣.mp3');

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.id = 'bgm-btn';
  btn.title = '배경음악 켜기/끄기';
  btn.setAttribute('aria-label', '배경음악 켜기/끄기');
  btn.textContent = '🔇';

  document.body.appendChild(audio);
  document.body.appendChild(btn);

  var savedTime = parseFloat(load(KEY_TIME));
  if (savedTime > 0) {
    audio.addEventListener('loadedmetadata', function () {
      if (savedTime < audio.duration) audio.currentTime = savedTime;
    }, { once: true });
  }

  function play() {
    var p = audio.play();
    if (p && p.catch) p.catch(function () {});
    return p;
  }

  audio.addEventListener('play', function () { btn.textContent = '🔊'; });
  audio.addEventListener('pause', function () { btn.textContent = '🔇'; });

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (audio.paused) { save(KEY_STATE, 'on'); play(); }
    else { save(KEY_STATE, 'off'); audio.pause(); }
  });

  // 방문자가 끄지 않았다면: 바로 재생을 시도하고, 브라우저가 막으면 첫 터치/클릭/키 입력 때 시작
  if (load(KEY_STATE) !== 'off') {
    var events = ['pointerdown', 'touchend', 'keydown'];
    var startOnGesture = function (e) {
      if (e.target === btn) return; // 버튼 자체는 click 핸들러가 처리
      events.forEach(function (ev) { document.removeEventListener(ev, startOnGesture, true); });
      if (audio.paused && load(KEY_STATE) !== 'off') play();
    };
    var p = play();
    if (p && p.catch) {
      p.catch(function () {
        events.forEach(function (ev) { document.addEventListener(ev, startOnGesture, true); });
      });
    }
  }

  // 다른 페이지로 넘어갈 때 재생 위치 저장
  function saveTime() { if (!isNaN(audio.currentTime)) save(KEY_TIME, String(audio.currentTime)); }
  window.addEventListener('pagehide', saveTime);
  setInterval(function () { if (!audio.paused) saveTime(); }, 2000);
})();
