// Lahore Expo Center bulk order calculator.
// Pricing is deliberately not shown to visitors: the rates below are stored
// encoded and only surface as a reference code in the WhatsApp message, which
// the NoshMaté team can decode into the estimate.
(function () {
  var STOPS = [10, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500];
  var MIN_CORPORATE = 50;
  var RATE = Number(atob('NDAw'));      // per meal
  var DELIVERY = Number(atob('NTAw'));  // per delivery day
  var WA = 'https://wa.me/923309993307';

  var head = document.getElementById('calcHead');
  var days = document.getElementById('calcDays');
  var evt = document.getElementById('calcEvent');
  if (!head || !days) return;

  // Searchable event picker (combobox). evt is a hidden input holding the slug.
  var search = document.getElementById('calcEventSearch');
  var list = document.getElementById('calcEventList');
  var empty = document.getElementById('calcEventEmpty');
  var clear = document.getElementById('calcEventClear');
  var items = Array.prototype.slice.call(list.children);
  var active = -1;

  function visible() { return items.filter(function (li) { return !li.hidden; }); }
  function setActive(i) {
    var v = visible();
    items.forEach(function (li) { li.classList.remove('active'); });
    active = v.length ? (i + v.length) % v.length : -1;
    if (active >= 0) {
      v[active].classList.add('active');
      v[active].scrollIntoView({ block: 'nearest' });
      search.setAttribute('aria-activedescendant', v[active].id);
    }
  }
  function openList(open) {
    list.hidden = !open;
    search.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (!open) search.removeAttribute('aria-activedescendant');
  }
  function filter() {
    var q = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    var shown = 0;
    items.forEach(function (li) {
      var hay = li.getAttribute('data-search');
      var ok = q.every(function (t) { return hay.indexOf(t) !== -1; });
      li.hidden = !ok;
      if (ok) shown++;
    });
    empty.hidden = shown > 0 || list.hidden;
    setActive(0);
  }
  function choose(li) {
    evt.value = li.getAttribute('data-value');
    search.value = li.querySelector('strong').textContent;
    clear.hidden = false;
    openList(false);
    empty.hidden = true;
  }
  function reset() {
    evt.value = '';
    search.value = '';
    clear.hidden = true;
    filter();
  }

  search.addEventListener('focus', function () { search.select(); openList(true); filter(); });
  search.addEventListener('input', function () {
    evt.value = '';
    clear.hidden = !search.value;
    openList(true);
    filter();
  });
  search.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (list.hidden) { openList(true); filter(); } else setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Enter') { var v = visible(); if (!list.hidden && v[active]) { e.preventDefault(); choose(v[active]); } }
    else if (e.key === 'Escape') { openList(false); empty.hidden = true; }
  });
  list.addEventListener('mousedown', function (e) {
    var li = e.target.closest('li');
    if (li) { e.preventDefault(); choose(li); }
  });
  clear.addEventListener('click', function () { reset(); search.focus(); });
  document.addEventListener('mousedown', function (e) {
    if (!document.getElementById('calcCombo').contains(e.target)) { openList(false); empty.hidden = true; }
  });

  var out = {
    head: document.getElementById('calcHeadOut'),
    days: document.getElementById('calcDaysOut'),
    sHead: document.getElementById('sumHead'),
    sDays: document.getElementById('sumDays'),
    sTotal: document.getElementById('sumTotal'),
    warn: document.getElementById('calcWarn')
  };

  function state() {
    var h = STOPS[Number(head.value)];
    var d = Number(days.value);
    return { h: h, d: d, meals: h * d };
  }

  function render() {
    var s = state();
    out.head.textContent = s.h;
    out.days.textContent = s.d;
    out.sHead.textContent = s.h;
    out.sDays.textContent = s.d;
    out.sTotal.textContent = s.meals.toLocaleString('en-US');
    head.setAttribute('aria-valuetext', s.h + ' meals per day');
    out.warn.hidden = s.h >= MIN_CORPORATE;
  }

  var params = new URLSearchParams(location.search);
  var preset = params.get('event');
  var presetLi = items.filter(function (li) { return li.getAttribute('data-value') === preset; })[0];
  if (presetLi) choose(presetLi);

  head.addEventListener('input', render);
  days.addEventListener('input', render);

  document.getElementById('calcSend').addEventListener('click', function () {
    var s = state();
    var total = (s.h * RATE + DELIVERY) * s.d;
    var ref = 'EX-' + btoa(s.h + ':' + s.d + ':' + total).replace(/=+$/, '');
    var name = evt.value && window.EXPO_EVENTS ? window.EXPO_EVENTS[evt.value] : '';
    var lines = [
      'Hi NoshMaté, please check availability for Lahore Expo Center.',
      name ? 'Event: ' + name : '',
      'Daily headcount: ' + s.h,
      'Exhibition days: ' + s.d,
      'Total meals: ' + s.meals,
      'Ref: ' + ref
    ].filter(Boolean);
    window.open(WA + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    if (window.gtag) gtag('event', 'expo_calculator_whatsapp', { headcount: s.h, days: s.d });
  });

  render();
})();
