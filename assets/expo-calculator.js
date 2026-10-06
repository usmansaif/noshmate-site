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
  if (preset && window.EXPO_EVENTS && window.EXPO_EVENTS[preset]) evt.value = preset;

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
