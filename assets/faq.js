// FAQ accordion: animated open/close, one item open at a time, deep links.
(function () {
  const items = Array.from(document.querySelectorAll('details.faq-item'));
  if (!items.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const DURATION = 340;
  const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';
  const running = new WeakMap();

  function collapsedHeight(item) {
    const summary = item.querySelector('summary');
    return summary.offsetHeight + (item.offsetHeight - item.clientHeight);
  }

  function setOpen(item, open, animated) {
    const previous = running.get(item);
    const startHeight = item.offsetHeight;
    if (previous) previous.cancel();
    item.classList.remove('closing');

    if (!animated || reduce.matches) {
      item.open = open;
      return;
    }

    const answer = item.querySelector('.faq-answer');
    let from;
    let to;
    if (open) {
      item.open = true;
      from = startHeight;
      to = item.offsetHeight;
    } else {
      item.classList.add('closing');
      from = startHeight;
      to = collapsedHeight(item);
    }

    const heightAnim = item.animate(
      { height: [from + 'px', to + 'px'] },
      { duration: DURATION, easing: EASING }
    );
    if (answer) {
      answer.animate(
        { opacity: open ? [0, 1] : [1, 0], transform: open ? ['translateY(-6px)', 'none'] : ['none', 'translateY(-6px)'] },
        { duration: DURATION, easing: EASING }
      );
    }
    running.set(item, heightAnim);
    heightAnim.onfinish = function () {
      running.delete(item);
      item.classList.remove('closing');
      item.open = open;
    };
    heightAnim.oncancel = function () {
      running.delete(item);
    };
  }

  items.forEach(function (item) {
    const summary = item.querySelector('summary');
    summary.addEventListener('click', function (event) {
      event.preventDefault();
      const isOpen = item.open && !item.classList.contains('closing');
      if (isOpen) {
        setOpen(item, false, true);
        return;
      }
      items.forEach(function (other) {
        if (other !== item && other.open && !other.classList.contains('closing')) setOpen(other, false, true);
      });
      setOpen(item, true, true);
    });
  });

  // Only one item open on load (pages mark the first item of each group open).
  let seen = false;
  items.forEach(function (item) {
    if (item.open) {
      if (seen) item.open = false;
      seen = true;
    }
  });

  // Deep links such as /faq/delivery/#order-cutoff open that answer.
  function openFromHash(animated) {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    const target = document.getElementById(id);
    if (!target || !target.matches('details.faq-item')) return;
    items.forEach(function (other) {
      if (other !== target && other.open) setOpen(other, false, false);
    });
    setOpen(target, true, animated);
    target.scrollIntoView({ block: 'start', behavior: reduce.matches ? 'auto' : 'smooth' });
  }
  openFromHash(false);
  window.addEventListener('hashchange', function () { openFromHash(true); });
})();
