// Language toggle: cycles through en → zh → dual
(function() {
  const modes = ['dual', 'en', 'zh'];
  const labels = { dual: '中英', en: '中文', zh: 'EN' };
  let current = localStorage.getItem('fano-lang') || 'dual';
  
  function applyLang(mode) {
    current = mode;
    localStorage.setItem('fano-lang', mode);
    document.body.className = document.body.className.replace(/lang-\w+/g, '');
    if (mode !== 'dual') {
      document.body.classList.add('lang-' + mode);
    }
    // Update all data-zh/data-en spans
    document.querySelectorAll('[data-zh][data-en]').forEach(el => {
      el.textContent = el.getAttribute('data-' + mode) || el.getAttribute('data-en');
    });
    // Update toggle button
    const btn = document.getElementById('langBtn');
    if (btn) btn.textContent = labels[mode];
    // Re-render MathJax after text swap
    if (window.MathJax && MathJax.typeset) {
      MathJax.typeset();
    }
  }

  window.toggleLang = function() {
    const idx = (modes.indexOf(current) + 1) % modes.length;
    applyLang(modes[idx]);
  };

  // Apply saved preference on load
  document.addEventListener('DOMContentLoaded', () => {
    applyLang(current);
  });
})();
