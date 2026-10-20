// Samuel's site: ticker + "this week" from now.json, last-commit from GitHub, Konami flip.
(function () {
  'use strict';

  // Intro animations are gated on this class; it only lands once the page is really painting.
  requestAnimationFrame(function () { document.documentElement.classList.add('ready'); });

  var count = function (name) {
    if (window.goatcounter && window.goatcounter.count) {
      window.goatcounter.count({ path: name, title: name, event: true });
    }
  };

  // --- now.json → every [data-now] and [data-now-href] -------------------------
  fetch('now.json', { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (now) {
      if (!now) return;
      document.querySelectorAll('[data-now]').forEach(function (el) {
        var v = now[el.getAttribute('data-now')];
        if (v) el.textContent = v;
      });
      document.querySelectorAll('[data-now-href]').forEach(function (el) {
        var v = now[el.getAttribute('data-now-href')];
        if (v) el.setAttribute('href', v);
      });
    })
    .catch(function () {})
    .then(cloneTicker);

  // --- last commit, from GitHub's public events (no key, 60 req/h) --------------
  fetch('https://api.github.com/users/mericot/events/public')
    .then(function (r) { return r.ok ? r.json() : []; })
    .then(function (events) {
      var push = events.find(function (e) { return e.type === 'PushEvent'; });
      if (!push) return;
      var ago = relTime(new Date(push.created_at));
      var repo = push.repo.name.split('/')[1];
      document.getElementById('commit-time').textContent = ago;
      document.getElementById('commit-repo').textContent = repo;
      document.getElementById('commit-item').hidden = false;
    })
    .catch(function () {})
    .then(cloneTicker);

  function relTime(d) {
    var s = Math.max(1, (Date.now() - d.getTime()) / 1000);
    if (s < 3600) return Math.round(s / 60) + 'm ago';
    if (s < 86400) return Math.round(s / 3600) + 'h ago';
    return Math.round(s / 86400) + 'd ago';
  }

  // The marquee slides to -50%, so the track holds two copies of its items.
  var cloned = false;
  function cloneTicker() {
    var track = document.getElementById('ticker-track');
    if (!track || cloned) return;
    var pending = document.querySelector('[data-now]') && document.querySelector('[data-now]').textContent === '…';
    if (pending) return; // wait for now.json; the second fetch's .then will try again
    cloned = true;
    Array.prototype.slice.call(track.children).forEach(function (c) {
      var copy = c.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      copy.removeAttribute('id');
      track.appendChild(copy);
    });
  }
  setTimeout(cloneTicker, 2500); // fallback if now.json never loads

  // --- Konami: ↑↑↓↓←→←→BA on a keyboard, ten taps on the name on a phone --------
  var seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  var pos = 0;
  document.addEventListener('keydown', function (e) {
    var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    pos = k === seq[pos] ? pos + 1 : (k === seq[0] ? 1 : 0);
    if (pos === seq.length) { pos = 0; flip(); }
  });

  var taps = 0, tapTimer;
  var mark = document.getElementById('wordmark');
  if (mark) {
    mark.addEventListener('click', function (e) {
      taps += 1;
      clearTimeout(tapTimer);
      tapTimer = setTimeout(function () { taps = 0; }, 1500);
      if (taps >= 10) { taps = 0; e.preventDefault(); flip(); }
      else if (taps > 1) { e.preventDefault(); }
    });
  }

  var toast = document.getElementById('toast');
  var toastText = document.getElementById('toast-text');
  var toastTimer;
  function flip() {
    var on = document.documentElement.classList.toggle('flipped');
    toastText.textContent = on ? 'Page flipped. Enter it again to fix it.' : 'Back to normal. Nice.';
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.hidden = true; }, 3500);
    count('konami');
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
