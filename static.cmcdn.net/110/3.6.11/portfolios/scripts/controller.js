(function() {

  requestAnimationFrame(() => {
    const wrapper = document.getElementById('wrap');
    const nav = document.getElementById('nav');

    wrapper.classList.add('is-shown');
    nav.classList.add('is-shown');
  });


  let browseLink = document.querySelector('.browse-link');

  browseLink && browseLink.addEventListener('click', function() {
    document.body.classList.toggle('open-specialties');
  });

  let scrollingElement = document.scrollingElement || document.documentElement;

  let stickyHeader = document.querySelector('.sticky-header');

  window.addEventListener('scroll', () => {
    stickyHeader && stickyHeader.classList.toggle('sticky', scrollingElement.scrollTop > 343);
  }, false);

  /* ------------------- Scroll to content ------------------- */
  function scrollToInTime(element, duration) {
    const offset = 180,
      endPoint = document.querySelector(element).offsetTop - offset,
      distance = endPoint - window.pageYOffset,
      rate = (distance * 4) / duration,
      interval = setInterval(scrollIncrement, 4);

    function scrollIncrement() {
      const yOffset = Math.ceil(window.pageYOffset);

      if (
        (yOffset >= endPoint && rate >= 0) ||
        (yOffset <= endPoint && rate <= 0)
      ) {
        clearInterval(interval)
      } else {
        window.scrollBy(0, rate)
      }
    }
  }

  for (var link of Array.from(document.querySelectorAll('.scroll-to-element'))) {
    link.addEventListener('click', e => {
      e.preventDefault();
      scrollToInTime(e.currentTarget.getAttribute('href'), 400);
    });
  }
})();

Carbon.ActionKit.observe('click');
