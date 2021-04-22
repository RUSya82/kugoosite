const burgerMenu = document.querySelector('.header__burger'),
      menu = document.querySelector('.header__nav'),
      links = document.querySelector('.header__menu'),
      close = document.querySelector('.close');

function openModal() {
    menu.classList.add('show');
    menu.classList.remove('hide');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    menu.classList.remove('show');
    document.body.style.overflow = '';
}

burgerMenu.addEventListener('click', openModal);
close.addEventListener('click', closeModal);
links.addEventListener('click', closeModal);

document.addEventListener('click', (e) => {
    if (e.target === menu) {
        closeModal();
    }
});

function animateMarquee(el, duration) {
    const innerEl = el.querySelector('.marquee__inner');
    const innerWidth = innerEl.offsetWidth;
    const cloneEl = innerEl.cloneNode(true);
    el.appendChild(cloneEl);
    
    let start = performance.now();
    let progress;
    let translateX;
  
    requestAnimationFrame(function step(now) {
      progress = (now - start) / duration;
   
      if (progress > 1) {
          progress %= 1;
        start = now;
      }
  
      translateX = innerWidth * progress;
      
      innerEl.style.transform = `translate3d(-${translateX}px, 0 , 0)`;
      cloneEl.style.transform = `translate3d(-${translateX}px, 0 , 0)`;
      requestAnimationFrame(step);
    });
  }
  
  const marquee1 = document.querySelector('#marquee1');
  
  animateMarquee(marquee1, 15000);