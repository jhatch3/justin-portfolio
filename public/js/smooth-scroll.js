/**
 * Inertial page scrolling.
 *
 * The browser moves the page the instant the wheel turns. This puts a spring
 * between the two: the wheel moves a *target* position, and the page eases
 * toward it every frame. Stop scrolling and the page keeps travelling for a
 * beat before settling - the way a pushed car coasts to a stop.
 *
 * Deliberately hands-off in the cases where the native behaviour is already
 * right or already better: touch screens (iOS/Android momentum), users who
 * asked for reduced motion, inner scrollers like the chat transcript, and any
 * moment the page itself is locked behind a modal.
 *
 * Plain ES5-ish JS on purpose - it loads before Babel and must not wait on it.
 */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var coarse = window.matchMedia('(pointer: coarse)');
  if (reduced.matches || coarse.matches) return;

  // How much of the remaining distance to close each 60fps frame. Lower is
  // looser and coasts longer; higher snaps to the wheel. 0.09 lands around a
  // 180ms time constant - roughly half a second of visible glide.
  var EASE = 0.09;
  var FRAME = 1000 / 60;
  var WHEEL_MULTIPLIER = 1.05;
  var LINE_HEIGHT = 16; // px per line for deltaMode === DOM_DELTA_LINE
  var SETTLED = 0.12;   // px - below this we snap and stop the loop

  var target = window.scrollY;   // where the page is heading
  var current = target;          // where the page actually is (sub-pixel)
  var rafId = null;
  var tween = null;              // set while a jump-to-anchor is animating

  function maxScroll() {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  function clamp(y) {
    return Math.max(0, Math.min(y, maxScroll()));
  }

  /** The page is locked (project modal, mobile nav drawer) - stay out of it. */
  function pageLocked() {
    return getComputedStyle(document.body).overflowY === 'hidden';
  }

  /**
   * True when something under the cursor is its own scroller that still has
   * room to move in this direction - the chat transcript, the modal body. That
   * scroll belongs to the element, not the page.
   */
  function insideScroller(node, delta) {
    while (node && node !== document.body && node !== document.documentElement) {
      if (node.nodeType === 1 && node.scrollHeight > node.clientHeight + 1) {
        var overflow = getComputedStyle(node).overflowY;
        if (overflow === 'auto' || overflow === 'scroll' || overflow === 'overlay') {
          var room = delta < 0
            ? node.scrollTop > 0
            : node.scrollTop + node.clientHeight < node.scrollHeight - 1;
          if (room) return true;
        }
      }
      node = node.parentElement;
    }
    return false;
  }

  function apply() {
    window.scrollTo(0, current);
  }

  function start() {
    if (rafId === null) {
      last = null;
      rafId = requestAnimationFrame(frame);
    }
  }

  function stop() {
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
    last = null;
  }

  var last = null;

  function frame(now) {
    rafId = null;
    var dt = last === null ? FRAME : Math.min(now - last, 100);
    last = now;

    if (tween) {
      tween.elapsed += dt;
      var t = Math.min(1, tween.elapsed / tween.duration);
      // easeOutExpo: leaves fast, arrives almost imperceptibly.
      var eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      current = tween.from + (tween.to - tween.from) * eased;
      target = current;
      apply();
      if (t === 1) { tween = null; return; }
      rafId = requestAnimationFrame(frame);
      return;
    }

    target = clamp(target);
    var distance = target - current;
    if (Math.abs(distance) < SETTLED) {
      current = target;
      apply();
      return;
    }

    // Frame-rate independent exponential approach, so a 120Hz display coasts
    // for the same wall-clock time as a 60Hz one.
    current += distance * (1 - Math.pow(1 - EASE, dt / FRAME));
    apply();
    rafId = requestAnimationFrame(frame);
  }

  window.addEventListener('wheel', function (e) {
    if (e.ctrlKey || e.defaultPrevented) return;      // pinch-zoom
    if (pageLocked()) return;
    if (insideScroller(e.target, e.deltaY)) return;

    var delta = e.deltaY;
    if (e.deltaMode === 1) delta *= LINE_HEIGHT;
    else if (e.deltaMode === 2) delta *= window.innerHeight;

    e.preventDefault();
    tween = null;
    target = clamp(target + delta * WHEEL_MULTIPLIER);
    start();
  }, { passive: false });

  /** Animate to an absolute page offset (anchor links, the scroll cue). */
  function scrollToY(y) {
    y = clamp(y);
    var distance = Math.abs(y - current);
    if (distance < 1) return;
    tween = {
      from: current,
      to: y,
      elapsed: 0,
      // Longer trips take longer, but never drag: ~450ms near, ~1.1s far.
      duration: Math.min(1100, 420 + distance * 0.22),
    };
    start();
  }

  function scrollPadding() {
    var value = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
    return isNaN(value) ? 0 : value;
  }

  // Anchor links: the CSS `scroll-behavior: smooth` is switched off below, so
  // the same spring that handles the wheel handles these too.
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var link = e.target.closest && e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute('href').slice(1);
    if (!id) return;
    var el = document.getElementById(id);
    if (!el || pageLocked()) return;
    e.preventDefault();
    scrollToY(window.scrollY + el.getBoundingClientRect().top - scrollPadding());
    if (history.replaceState) history.replaceState(null, '', '#' + id);
  });

  // Keyboard scrolling gets the same feel, so the page never moves two
  // different ways. Typing in the chat composer is left alone.
  var KEYS = {
    ArrowDown: function () { return 90; },
    ArrowUp: function () { return -90; },
    PageDown: function () { return window.innerHeight * 0.85; },
    PageUp: function () { return -window.innerHeight * 0.85; },
    ' ': function () { return window.innerHeight * 0.85; },
    Spacebar: function () { return window.innerHeight * 0.85; },
  };

  window.addEventListener('keydown', function (e) {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
    if (pageLocked()) return;
    var el = document.activeElement;
    if (el && (el.isContentEditable || /^(input|textarea|select)$/i.test(el.tagName))) return;
    if (insideScroller(el, 1)) return;

    if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      scrollToY(e.key === 'Home' ? 0 : maxScroll());
      return;
    }
    var step = KEYS[e.key];
    if (!step) return;
    var amount = step();
    if (e.shiftKey && (e.key === ' ' || e.key === 'Spacebar')) amount = -amount;
    e.preventDefault();
    tween = null;
    target = clamp(target + amount);
    start();
  });

  // Anything that moves the page behind our back - scrollbar drags, find-in-
  // page, an element calling scrollIntoView - resets the spring to reality.
  window.addEventListener('scroll', function () {
    if (rafId !== null || tween) return;
    if (Math.abs(window.scrollY - current) < 2) return;
    current = target = window.scrollY;
  }, { passive: true });

  window.addEventListener('resize', function () {
    current = target = clamp(window.scrollY);
  });

  // With JS driving, the CSS smooth-scroll would be a second animation racing
  // the first. (Left in the stylesheet for the reduced-motion path above.)
  document.documentElement.style.scrollBehavior = 'auto';
})();
