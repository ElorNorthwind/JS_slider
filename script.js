let wrap = document.getElementsByClassName('wrap')[0];
let width = wrap.clientWidth;
let courusel = document.getElementsByClassName('courusel')[0];
let slide = 0;
let slidecount = courusel.childElementCount - 1;
let dots = [];

courusel.style.width = slidecount + 1 + '00%';
window.addEventListener("resize", function newWidth() {
  width = wrap.clientWidth;
  moveSlide(slide);

});

function createNavs() {
  let prev = wrap.appendChild(document.createElement('a'));
  prev.classList.add('nav', 'prev');
  prev.textContent = '<';
  prev.addEventListener('click', prevSlide);
  
  let next = wrap.appendChild(document.createElement('a'));
  next.classList.add('nav', 'next');
  next.textContent = '>';
  next.addEventListener('click', nextSlide);
}



function nextSlide() {
  slide = slide === slidecount ? 0 : slide + 1;
  moveSlide(slide);
}

function prevSlide() {
  slide = slide === 0 ? slidecount : slide - 1;
  moveSlide(slide);
}

function moveSlide(pos) {
  courusel.style.transform = 'translate(-' + width * pos + 'px';
  for (let i = 0; i <= slidecount; i++) {
    i == pos ? dots[i].classList.add('active') : dots[i].classList.remove('active')
  }
}


function createDots() {
  let dotbar = wrap.appendChild(document.createElement('span'));
  dotbar.classList.add('dots');
  for (let i = 0; i <= slidecount; i++) {
    dots[i] = dotbar.appendChild(document.createElement('span'));
    dots[i].classList.add('dot');
    dots[i].setAttribute('data-num', i);
    dots[i].addEventListener('click', jumtToSlide);
  }
 dots[0].classList.add('active');
}

function jumtToSlide(event) {
  slide = Number(event.target.getAttribute('data-num'));

  moveSlide(slide);
}

createDots();
createNavs();