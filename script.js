/*!
 * Vertex Engineering Services Limited — site script
 * Plain JavaScript, no libraries. Everything you may want to change is in CONFIG.
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     SETTINGS — edit here only
     ------------------------------------------------------------------ */
  var CONFIG = {
    companyName: 'Vertex Engineering Services Limited',
    phoneDisplay: '0912 335 6510',
    phoneIntl: '2349123356510',      // international format, digits only (no +)
    showWhatsApp: true,              // set false to hide the WhatsApp button
    showBackToTop: true,
    showQuotePrompt: true,           // small "Need a quote?" message after a short delay
    quotePromptDelay: 15000,         // milliseconds
    slideInterval: 7000,             // banner change time, in milliseconds
    /* Forms. Option A (best): create a free form at formspree.io and paste its
       address below, e.g. 'https://formspree.io/f/abcd1234'. Enquiries then arrive by email.
       Option B (default while empty): the enquiry is sent to your WhatsApp number. */
    formEndpoint: ''
  };

  var TEL = 'tel:+' + CONFIG.phoneIntl;
  var WA = 'https://wa.me/' + CONFIG.phoneIntl;

  /* ------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------ */
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) { Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); }); }
    if (html) { n.innerHTML = html; }
    return n;
  }
  function store(key, val) {
    try {
      if (val === undefined) { return window.sessionStorage.getItem(key); }
      window.sessionStorage.setItem(key, val);
    } catch (e) { return null; }
  }
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pageName = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  /* ------------------------------------------------------------------
     Styles for the elements this script adds (so only this file is needed)
     ------------------------------------------------------------------ */
  function injectStyles() {
    var css = [
      '@media (prefers-reduced-motion:no-preference){html{scroll-behavior:smooth}}',
      '[id]{scroll-margin-top:96px}',
      '.vx-fab{position:fixed;right:1rem;bottom:1rem;z-index:90;display:flex;flex-direction:column;align-items:center;gap:.7rem}',
      '.vx-fab a,.vx-fab button{width:54px;height:54px;border-radius:50%;border:0;display:grid;place-items:center;color:#fff;cursor:pointer;text-decoration:none;box-shadow:0 6px 18px rgba(29,21,31,.35);transition:transform .15s ease,opacity .2s ease}',
      '.vx-fab a:hover,.vx-fab button:hover{transform:translateY(-2px)}',
      '.vx-fab a:focus-visible,.vx-fab button:focus-visible{outline:3px solid #BEA2E3;outline-offset:3px}',
      '.vx-fab svg{width:26px;height:26px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
      '.vx-fab .vx-wa svg{fill:currentColor;stroke:none}',
      '.vx-call{background:var(--purple,#6839C1)}',
      '.vx-wa{background:#25D366}',
      '.vx-top{background:var(--ink,#1D151F);width:44px!important;height:44px!important;opacity:0;pointer-events:none}',
      '.vx-top.show{opacity:1;pointer-events:auto}',
      '.vx-toast{position:fixed;left:1rem;bottom:1rem;z-index:90;max-width:340px;background:#fff;color:var(--ink,#1D151F);border:1px solid var(--line,#E0D7EE);border-left:4px solid var(--purple,#6839C1);border-radius:6px;padding:1rem 2.6rem 1rem 1.1rem;box-shadow:0 10px 30px rgba(29,21,31,.25);font-size:.98rem;line-height:1.45;transform:translateY(24px);opacity:0;transition:transform .3s ease,opacity .3s ease}',
      '.vx-toast.show{transform:none;opacity:1}',
      '.vx-toast strong{display:block;font-family:var(--head,inherit);font-size:1.15rem;margin-bottom:.25rem}',
      '.vx-toast a.vx-link{display:inline-block;margin-top:.55rem;font-weight:600;color:var(--purple,#6839C1)}',
      '.vx-toast button{position:absolute;top:.4rem;right:.4rem;width:32px;height:32px;border:0;background:transparent;font-size:1.4rem;line-height:1;color:var(--muted,#5E5468);cursor:pointer;border-radius:50%}',
      '.vx-toast button:hover{background:var(--mist,#F4F0FA)}',
      '@media (max-width:640px){.vx-toast{left:1rem;right:5.2rem;bottom:1rem;max-width:none}}',
      '.form-status[data-state="ok"]{color:#1d6b3a}',
      '.form-status[data-state="error"]{color:#a12d2d}',
      '@media print{.vx-fab,.vx-toast{display:none!important}}'
    ].join('\n');
    var s = el('style', { id: 'vx-styles' });
    s.appendChild(document.createTextNode(css));
    document.head.appendChild(s);
  }

  /* ------------------------------------------------------------------
     Mobile menu
     ------------------------------------------------------------------ */
  function initMenu() {
    var toggle = qs('.menu-toggle');
    var nav = document.getElementById('nav');
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      /* close after tapping a normal link */
      qsa('a', nav).forEach(function (a) {
        a.addEventListener('click', function () {
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
      /* close when tapping outside */
      document.addEventListener('click', function (e) {
        if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
    qsa('.sub-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var li = btn.parentElement;
        var open = li.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav && toggle && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------ */
  function initYear() {
    var y = document.getElementById('year');
    if (y) { y.textContent = new Date().getFullYear(); }
  }

  /* ------------------------------------------------------------------
     Home page banner slider
     ------------------------------------------------------------------ */
  function initHero() {
    var hero = qs('.hero');
    if (!hero) { return; }
    var slides = qsa('.slide', hero);
    if (!slides.length) { return; }
    var dots = qsa('.dot', hero);
    var live = qs('.slide-live', hero);
    var pauseBtn = qs('.ctl-pause', hero);
    var prevBtn = qs('.ctl-prev', hero);
    var nextBtn = qs('.ctl-next', hero);
    var index = 0, timer = null, userPaused = reduceMotion, hoverPaused = false;

    function running() { return !userPaused && !hoverPaused; }

    function restart() {
      clearTimeout(timer);
      hero.classList.remove('playing');
      if (running()) {
        void hero.offsetWidth; /* restarts the progress bar */
        hero.classList.add('playing');
        timer = setTimeout(function () { show(index + 1, false); }, CONFIG.slideInterval);
      }
    }

    function show(i, announce) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) {
        var on = n === index;
        s.classList.toggle('is-active', on);
        s.setAttribute('aria-hidden', on ? 'false' : 'true');
        qsa('a', s).forEach(function (a) { a.tabIndex = on ? 0 : -1; });
      });
      dots.forEach(function (d, n) { d.setAttribute('aria-current', n === index ? 'true' : 'false'); });
      if (announce && live) {
        var h = qs('h2', slides[index]);
        live.textContent = 'Slide ' + (index + 1) + ' of ' + slides.length + (h ? ': ' + h.textContent : '');
      }
      restart();
    }

    function syncPause() {
      if (!pauseBtn) { return; }
      pauseBtn.setAttribute('aria-pressed', userPaused ? 'true' : 'false');
      pauseBtn.setAttribute('aria-label', userPaused ? 'Resume slideshow' : 'Pause slideshow');
      var ip = qs('.i-pause', pauseBtn), iy = qs('.i-play', pauseBtn);
      if (ip) { ip.style.display = userPaused ? 'none' : 'block'; }
      if (iy) { iy.style.display = userPaused ? 'block' : 'none'; }
    }

    if (prevBtn) { prevBtn.addEventListener('click', function () { show(index - 1, true); }); }
    if (nextBtn) { nextBtn.addEventListener('click', function () { show(index + 1, true); }); }
    dots.forEach(function (d, n) { d.addEventListener('click', function () { show(n, true); }); });
    if (pauseBtn) {
      pauseBtn.addEventListener('click', function () { userPaused = !userPaused; syncPause(); restart(); });
    }
    hero.addEventListener('mouseenter', function () { hoverPaused = true; restart(); });
    hero.addEventListener('mouseleave', function () { hoverPaused = false; restart(); });
    hero.addEventListener('focusin', function () { hoverPaused = true; restart(); });
    hero.addEventListener('focusout', function () { hoverPaused = false; restart(); });
    hero.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { show(index - 1, true); }
      if (e.key === 'ArrowRight') { show(index + 1, true); }
    });

    /* touch swipe */
    var x0 = null, y0 = null;
    hero.addEventListener('touchstart', function (e) {
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    }, { passive: true });
    hero.addEventListener('touchend', function (e) {
      if (x0 === null) { return; }
      var dx = e.changedTouches[0].clientX - x0;
      var dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) { show(index + (dx < 0 ? 1 : -1), true); }
      x0 = null; y0 = null;
    }, { passive: true });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { clearTimeout(timer); hero.classList.remove('playing'); } else { restart(); }
    });

    syncPause();
    show(0, false);
  }

  /* ------------------------------------------------------------------
     Enquiry forms (Contact + Request a Quote)
     ------------------------------------------------------------------ */
  function labelFor(field) {
    var l = field.id ? document.querySelector('label[for="' + field.id + '"]') : null;
    var text = l ? l.textContent : field.name;
    return text.replace(/\s*\*\s*$/, '').trim();
  }

  function fieldValue(field) {
    if (field.tagName === 'SELECT') {
      var o = field.options[field.selectedIndex];
      return o && o.value !== '' ? o.textContent.trim() : '';
    }
    return (field.value || '').trim();
  }

  function buildEnquiryText(form) {
    var isQuote = pageName.indexOf('quote') !== -1;
    var lines = [
      'Hello ' + CONFIG.companyName + ', I would like to ' + (isQuote ? 'request a quote.' : 'make an enquiry.'),
      ''
    ];
    qsa('input, select, textarea', form).forEach(function (f) {
      if (!f.name || f.name === '_gotcha') { return; }
      if (f.type === 'file' || f.type === 'checkbox' || f.type === 'hidden' || f.type === 'submit') { return; }
      var v = fieldValue(f);
      if (v) { lines.push(labelFor(f) + ': ' + v); }
    });
    return lines.join('\n');
  }

  function openUrl(url) {
    var w = null;
    try { w = window.open(url, '_blank', 'noopener'); } catch (e) { w = null; }
    if (!w) { window.location.href = url; }
  }

  function initForms() {
    qsa('form[data-enquiry]').forEach(function (form) {
      var status = qs('.form-status', form);
      if (!status) {
        status = el('p', { 'class': 'form-status', role: 'status' });
        form.appendChild(status);
      }
      var button = qs('button[type="submit"]', form);
      var buttonText = button ? button.textContent : '';
      var endpoint = CONFIG.formEndpoint || form.getAttribute('action') || '';
      var connected = endpoint && endpoint.indexOf('YOUR_FORM_ID') === -1;

      function say(text, state) {
        status.textContent = text;
        if (state) { status.setAttribute('data-state', state); } else { status.removeAttribute('data-state'); }
      }
      function busy(on) {
        if (!button) { return; }
        button.disabled = on;
        button.textContent = on ? 'Sending…' : buttonText;
      }

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        /* spam trap: real visitors never fill the hidden field */
        var trap = form.elements._gotcha;
        if (trap && trap.value) { say('Thank you. Your enquiry has been received.', 'ok'); return; }

        if (form.checkValidity && !form.checkValidity()) {
          if (form.reportValidity) { form.reportValidity(); }
          say('Please complete the highlighted fields and tick the consent box.', 'error');
          return;
        }

        /* Option A: send to the form service (arrives by email) */
        if (connected && window.fetch) {
          var data = new FormData(form);
          var file = form.elements.attachment;
          if (file && (!file.files || !file.files.length)) { data.delete('attachment'); }
          busy(true);
          say('Sending…');
          fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
            .then(function (r) {
              busy(false);
              if (r.ok) {
                form.reset();
                say('Thank you for contacting ' + CONFIG.companyName + '. Your enquiry has been received. Our team will review the details and contact you using the information provided.', 'ok');
              } else {
                say('Your enquiry was not sent. Please check the fields and try again, or call us on ' + CONFIG.phoneDisplay + '.', 'error');
              }
            })
            .catch(function () {
              busy(false);
              say('Your enquiry was not sent. Check your connection and try again, or call us on ' + CONFIG.phoneDisplay + '.', 'error');
            });
          return;
        }

        /* Option B: no form service yet, so send the enquiry through WhatsApp */
        if (CONFIG.showWhatsApp) {
          say('Opening WhatsApp so you can send your enquiry to our team…', 'ok');
          openUrl(WA + '?text=' + encodeURIComponent(buildEnquiryText(form)));
          return;
        }
        say('Please call us on ' + CONFIG.phoneDisplay + ' to make your enquiry.', 'error');
      });
    });
  }

  /* ------------------------------------------------------------------
     Floating buttons: call, WhatsApp, back to top
     ------------------------------------------------------------------ */
  function initFloating() {
    var box = el('div', { 'class': 'vx-fab' });

    if (CONFIG.showBackToTop) {
      var top = el('button', { 'class': 'vx-top', type: 'button', 'aria-label': 'Back to top' },
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>');
      top.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
      box.appendChild(top);
      var ticking = false;
      window.addEventListener('scroll', function () {
        if (ticking) { return; }
        ticking = true;
        window.requestAnimationFrame(function () {
          top.classList.toggle('show', window.pageYOffset > 700);
          ticking = false;
        });
      }, { passive: true });
    }

    if (CONFIG.showWhatsApp) {
      box.appendChild(el('a', {
        'class': 'vx-wa', href: WA + '?text=' + encodeURIComponent('Hello ' + CONFIG.companyName + ', I would like to make an enquiry.'),
        target: '_blank', rel: 'noopener', 'aria-label': 'Chat with us on WhatsApp'
      }, '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24s8.24 3.7 8.24 8.24-3.7 8.24-8.25 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.29z"/></svg>'));
    }

    box.appendChild(el('a', {
      'class': 'vx-call', href: TEL, 'aria-label': 'Call ' + CONFIG.phoneDisplay
    }, '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>'));

    document.body.appendChild(box);
  }

  /* ------------------------------------------------------------------
     "Need a quote?" prompt (once per visit, not on the form pages)
     ------------------------------------------------------------------ */
  function initQuotePrompt() {
    if (!CONFIG.showQuotePrompt) { return; }
    if (pageName.indexOf('contact') !== -1 || pageName.indexOf('quote') !== -1 || pageName === '404.html') { return; }
    if (store('vx-quote-seen')) { return; }

    window.setTimeout(function () {
      var toast = el('div', { 'class': 'vx-toast', role: 'dialog', 'aria-label': 'Request a quote' },
        '<strong>Need a quote?</strong>Tell us about your project, or call us on <a href="' + TEL + '">' + CONFIG.phoneDisplay + '</a>.' +
        '<br><a class="vx-link" href="request-a-quote.html">Request a quote &rarr;</a>');
      var close = el('button', { type: 'button', 'aria-label': 'Close message' }, '&times;');
      toast.appendChild(close);
      document.body.appendChild(toast);
      window.requestAnimationFrame(function () { toast.classList.add('show'); });
      store('vx-quote-seen', '1');

      function dismiss() {
        toast.classList.remove('show');
        window.setTimeout(function () { if (toast.parentNode) { toast.parentNode.removeChild(toast); } }, 350);
        document.removeEventListener('keydown', onKey);
      }
      function onKey(e) { if (e.key === 'Escape') { dismiss(); } }
      close.addEventListener('click', dismiss);
      document.addEventListener('keydown', onKey);
      window.setTimeout(dismiss, 20000);
    }, CONFIG.quotePromptDelay);
  }

  /* ------------------------------------------------------------------
     Start
     ------------------------------------------------------------------ */
  function safely(fn) {
    try { fn(); } catch (err) { if (window.console) { console.error('[site script]', err); } }
  }

  function init() {
    /* each part runs on its own, so a problem in one never stops the others */
    [injectStyles, initMenu, initYear, initHero, initForms, initFloating, initQuotePrompt].forEach(safely);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
