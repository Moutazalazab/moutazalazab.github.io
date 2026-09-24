// ==============================================================
//  Google Scholar figures for the whole website.
//  To update: open this file on GitHub, click the pencil icon,
//  change the numbers below, and click "Commit changes".
//  Every page picks up the new figures automatically.
// ==============================================================
window.SCHOLAR = {
  citations: 3700,        // "Citations · All" on Google Scholar
  hIndex: 28,             // "h-index · All"
  i10Index: null,         // "i10-index · All" (optional, leave null to hide)
  updated: "Sep 2026"     // month you checked Google Scholar
};

// --- no need to edit below this line ---
(function () {
  var S = window.SCHOLAR, fmt = function (n) { return Number(n).toLocaleString('en-US'); };
  function apply() {
    document.querySelectorAll('[data-stat]').forEach(function (el) {
      var k = el.getAttribute('data-stat'), v = S[k];
      if (v === null || v === undefined) { var box = el.closest('[data-stat-box]'); if (box) box.hidden = true; return; }
      var txt = typeof v === 'number' ? fmt(v) + (el.hasAttribute('data-plus') ? '+' : '') : v;
      if (el.hasAttribute('data-count')) el.setAttribute('data-count', v);
      el.textContent = txt;
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply); else apply();
})();
