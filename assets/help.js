// Client-side search for the Help Center hub (/help/).
(function () {
  var input = document.getElementById('helpSearch');
  var box = document.getElementById('helpResults');
  var data = document.getElementById('helpIndex');
  if (!input || !box || !data) return;

  var items = [];
  try { items = JSON.parse(data.textContent); } catch (e) { return; }

  function esc(s) {
    return s.replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function render() {
    var q = input.value.trim().toLowerCase();
    if (q.length < 2) { box.hidden = true; box.innerHTML = ''; return; }
    var words = q.split(/\s+/);
    var hits = items.filter(function (it) {
      var hay = (it.t + ' ' + it.d + ' ' + it.k + ' ' + it.c).toLowerCase();
      return words.every(function (w) { return hay.indexOf(w) !== -1; });
    }).slice(0, 8);
    box.innerHTML = hits.length
      ? hits.map(function (it) {
          return '<a href="' + it.u + '"><strong>' + esc(it.t) + '</strong><span>' + esc(it.c) + '</span></a>';
        }).join('')
      : '<div class="help-empty">No articles found. Try another word, or message us on WhatsApp.</div>';
    box.hidden = false;
  }

  input.addEventListener('input', render);
  input.addEventListener('focus', render);
  document.addEventListener('click', function (e) {
    if (!box.contains(e.target) && e.target !== input) box.hidden = true;
  });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') box.hidden = true;
  });
})();
