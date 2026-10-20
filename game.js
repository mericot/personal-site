// 404 runner: a dino, a ground line, cacti, one button. Drawn at 2x for crisp pixels.
(function () {
  'use strict';
  var cv = document.getElementById('runner');
  if (!cv) return;
  var cx = cv.getContext('2d');
  var W = cv.width, H = cv.height, S = 8;           // S = size of one "pixel"
  var GROUND = H - 48;
  var count = function (name) { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: name, title: name, event: true }); };

  // 11 x 12 grid, same silhouette as the design canvas
  var DINO = [
    '.....######',
    '.....#.####',
    '.....######',
    '.....####..',
    '#....######',
    '##..#######',
    '##########.',
    '.########..',
    '..######...',
    '...####....',
    '...#..#....',
    '...##.##...'
  ];
  var CACTUS = ['.#.', '##.', '###', '.#.', '.#.', '.#.'];

  var dino, obstacles, speed, score, hi, running, over, t, raf;
  hi = +(localStorage.getItem('dino-hi') || 0);

  function reset() {
    dino = { x: 80, y: GROUND, vy: 0, h: DINO.length * S };
    obstacles = []; speed = 7; score = 0; running = false; over = false; t = 0;
    draw();
  }

  function sprite(rows, x, y, flipGround) {
    for (var r = 0; r < rows.length; r++) {
      for (var c = 0; c < rows[r].length; c++) {
        if (rows[r][c] === '#') cx.fillRect(x + c * S, y - (rows.length - r) * S, S, S);
      }
    }
  }

  function draw() {
    cx.clearRect(0, 0, W, H);
    cx.fillStyle = '#ffffff';
    cx.fillRect(0, GROUND, W, 2);
    sprite(DINO, dino.x, dino.y);
    cx.fillStyle = '#0a0a0a';
    cx.fillRect(dino.x + 6 * S, dino.y - 11 * S, S, S); // eye
    cx.fillStyle = '#ffffff';
    obstacles.forEach(function (o) { sprite(CACTUS, o.x, GROUND); });
    if (over) {
      cx.font = '700 28px "Inter Tight", Inter, sans-serif';
      cx.textAlign = 'center';
      cx.fillText('Game over. Tap to run it back.', W / 2, 90);
    }
  }

  function step() {
    t += 1;
    dino.vy += 1.1;
    dino.y = Math.min(GROUND, dino.y + dino.vy);
    if (dino.y === GROUND) dino.vy = 0;

    if (t % Math.max(40, 90 - Math.floor(score / 100)) === 0 && Math.random() < 0.8) {
      obstacles.push({ x: W + 20 });
    }
    obstacles.forEach(function (o) { o.x -= speed; });
    obstacles = obstacles.filter(function (o) { return o.x > -CACTUS[0].length * S; });

    score += 1;
    if (score % 300 === 0) speed += 0.5;

    var dw = DINO[0].length * S, dh = dino.h;
    var hit = obstacles.some(function (o) {
      var ow = CACTUS[0].length * S, oh = CACTUS.length * S;
      return dino.x + 2 * S < o.x + ow && dino.x + dw - 2 * S > o.x && dino.y > GROUND - oh && dino.y - dh < GROUND;
    });

    document.getElementById('score').textContent = pad(score);
    draw();
    if (hit) return end();
    raf = requestAnimationFrame(step);
  }

  function end() {
    over = true; running = false;
    if (score > hi) { hi = score; localStorage.setItem('dino-hi', hi); document.getElementById('hi').textContent = pad(hi); }
    draw();
    count('404-game-over');
  }

  function jump() {
    if (over) { reset(); return start(); }
    if (!running) return start();
    if (dino.y === GROUND) dino.vy = -17;
  }

  function start() {
    running = true;
    document.getElementById('hint').textContent = 'Jump the cacti';
    count('404-game-start');
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(step);
  }

  function pad(n) { return String(Math.min(n, 99999)).padStart(5, '0'); }

  document.getElementById('hi').textContent = pad(hi);
  cv.addEventListener('pointerdown', function (e) { e.preventDefault(); jump(); });
  document.addEventListener('keydown', function (e) {
    if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); jump(); }
  });
  reset();
})();
