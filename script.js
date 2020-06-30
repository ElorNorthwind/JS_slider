const test_slider = document.getElementsByClassName('slide-container')[0];

function createElements(node) {
  const slider = node.getElementsByClassName('slider')[0];
  const slideCount = slider.childElementCount;
  const firstSlide = slider.firstElementChild.cloneNode(true);
  const lastSlide = slider.lastElementChild.cloneNode(true);
  node.setAttribute('data-current-slide', 1); //To keep consistency across multiple sliders
  
  //previus slide button
  let prev = document.createElement('a');
  prev.classList.add('nav', 'prev');
  prev.addEventListener('click', moveLeft);
  node.appendChild(prev); //APPENDING TO LIVE DOM
  
  //next slide button
  let next = document.createElement('a');
  next.classList.add('nav', 'next');
  next.addEventListener('click', moveRight);
  node.appendChild(next); //APPENDING TO LIVE DOM
  
  //navigation dots
  let dotbar = document.createElement('div');
  let dots = [];
  dotbar.classList.add('dotbar');
  for (let i = 0; i < slideCount; i++) {
    dots[i] = document.createElement('div');
    dots[i].setAttribute('data-slide-num', i+1);
    dots[i].addEventListener('click', jumpToSlide);
    dotbar.appendChild(dots[i]);
  }
  node.appendChild(dotbar); //APPENDING TO LIVE DOM
 
  //duplicate first and last slides for smooth transition
  slider.appendChild(firstSlide);  //APPENDING TO LIVE DOM
  slider.insertBefore(lastSlide, slider.firstChild);  //APPENDING TO LIVE DOM
  
  // add hidden teleportation at the ends of the slider
  slider.addEventListener('transitionend', hiddenMovement)
  
  //show the first slide
  moveSlider(node, 1);
}

function moveSlider(node, pos) {
  const slider = node.getElementsByClassName('slider')[0];
  const slideCount = slider.childElementCount - 2;
  node.setAttribute('data-current-slide', pos); //To keep consistency across multiple sliders
  slider.style.right = (pos * 100) + '%';
  if (pos <= 0)  moveDots(node, slideCount);
  else if (pos >= slideCount + 1)  moveDots(node, 1);
  else moveDots(node, pos);
}

function moveDots(node, pos) {
  const dotbar = node.getElementsByClassName('dotbar')[0];
  Array.from(dotbar.childNodes).map(function(dot, index) {
    index == pos - 1 ? dot.classList.add('active') : dot.classList.remove('active')
  });
}

function hiddenMovement(event) {
  const slider = event.target;
  const node = slider.parentNode;
  const lastSlide = slider.childElementCount;
  let pos = Number(node.getAttribute('data-current-slide'));

  if (pos == lastSlide - 1) {
    slider.classList.add('no-transition');
    moveSlider(node, 1);
    slider.offsetHeight; //flush CSS
    slider.classList.remove('no-transition');
  }
  else if (pos == 0) {
    slider.classList.add('no-transition');
    moveSlider(node, lastSlide - 2);
    slider.offsetHeight; //flush CSS
    slider.classList.remove('no-transition');
  }
}


function moveLeft(event) {
  const node = event.target.parentNode;
  let pos = Number(node.getAttribute('data-current-slide'));
  if (pos > 0)  moveSlider(node, pos - 1);
}

function moveRight(event) {
  const node = event.target.parentNode;
  const lastSlide = node.getElementsByClassName('slider')[0].childElementCount;
  let pos = Number(node.getAttribute('data-current-slide'));
  if (pos < lastSlide - 1)  moveSlider(node, pos + 1);
}

function jumpToSlide(event) {
  const node = event.target.parentNode.parentNode;
  let target = Number(event.target.getAttribute('data-slide-num'));
  moveSlider(node, target);
}

createElements(test_slider);
moveSlider(test_slider, 1);
