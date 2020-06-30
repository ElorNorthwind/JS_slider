function createElements(node) {
  const slider = node.getElementsByClassName('slider')[0];
  const slideCount = slider.childElementCount;
  let slideCurrent = 1;  
  let slideTarget = 1;
  let slideHiddenTarget = 1;
  const autoplayMs = node.hasAttribute('data-autoplay-interval') ? Number(node.getAttribute('data-autoplay-interval')) : 3000;
  let autoplay = node.classList.contains('autoplay'); //refactor to a data field?
  let unpaused = autoplay;

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
    dots[i] = {dot: document.createElement('div'), slideNum: i + 1};
    dots[i].dot.addEventListener('click', jumpToSlideGenerator(dots[i].slideNum));
    dotbar.appendChild(dots[i].dot);
  }
  node.appendChild(dotbar); //APPENDING TO LIVE DOM

  //duplicate first and last slides for smooth transition
  const firstSlide = slider.firstElementChild.cloneNode(true);
  const lastSlide = slider.lastElementChild.cloneNode(true);
  slider.appendChild(firstSlide);  //APPENDING TO LIVE DOM
  slider.insertBefore(lastSlide, slider.firstChild);  //APPENDING TO LIVE DOM

  // add hidden teleportation at the ends of the slider
  slider.addEventListener('transitionend', hiddenMove)

  //show the first slide
  transitionMove();


  //autoplay
  if (autoplay) {

    node.addEventListener('mouseover', () => unpaused = false);
    node.addEventListener('mouseout', () => unpaused = true);

    let autoplayInterval = setInterval(function () {
      if (unpaused && document.hasFocus()) moveRight();
    }, autoplayMs);

  }

  //supporting functions

  function findTarget(adjustment, direct = false) {
    let target = direct ? adjustment : slideCurrent + adjustment; //in case of a direct move (through navigation dots) - just jump to the target, else calculate the target;
    if (target <= 0) return [0, slideCount]; //if trying to move left of the first slide - return slide 0 as a visible target and last slide as a hidden one;
    else if (target >= slideCount + 1) return [slideCount + 1, 1] //if trying to move right of the last slide - return slide last + 1 as a visible target and slide 1 as a hidden one;
    else return [target, target]; //normal case - return the neiboring slide as both targets. No hidden movement needed.
  }

  function transitionMove() {
      slider.style.right = (slideTarget * 100) + '%';
      slideCurrent = slideTarget;
      dots.map( ({dot, slideNum}) => slideNum == slideHiddenTarget ? dot.classList.add('active') : dot.classList.remove('active') ); // move the dot to the hidden (true) target
  }

  function hiddenMove() {
    if (slideCurrent !== slideHiddenTarget)  {
      slider.classList.add('no-transition');
      slider.style.right = (slideHiddenTarget * 100) + '%';
      slideCurrent = slideHiddenTarget;
      slider.offsetHeight; //flush CSS
      slider.classList.remove('no-transition');
    }
  }

  //navigation functions

  function moveLeft() {
    [slideTarget, slideHiddenTarget] = findTarget(-1);
    transitionMove(); 
  }

  function moveRight() {
    [slideTarget, slideHiddenTarget] = findTarget(1);
    transitionMove(); 
  }

  function jumpToSlideGenerator(tar) {
    return function() {
      [slideTarget, slideHiddenTarget] = findTarget(tar, true);
      transitionMove(); 
    };
  }



}

//launch the code for each slider element on page

function launchSliders() {
  const sliderWrappers = Array.from(document.getElementsByClassName('slide-container'));
  sliderWrappers.map(node => createElements(node));
}
launchSliders()
