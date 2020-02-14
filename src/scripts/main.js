'use strict';

const scale = document.querySelector('.slider__scale');
const minThumb = scale.querySelector('.slider__thumb--min');
const maxThumb = scale.querySelector('.slider__thumb--max');
const inputMin = document.querySelector('.slider__input--min');
const inputMax = document.querySelector('.slider__input--max');
const tooltipMin = document.querySelector('.slider__tooltip--min');
const tooltipMax = document.querySelector('.slider__tooltip--max');

const lineDiff = scale.querySelector('.slider__diff-line');
const thumbWidth = minThumb.offsetWidth;

minThumb.style.left = '50px';
maxThumb.style.left = '300px';

inputMin.value = parseInt(minThumb.style.left);
inputMax.value = parseInt(maxThumb.style.left);
tooltipMin.textContent = parseInt(minThumb.style.left);
tooltipMax.textContent = parseInt(maxThumb.style.left);

let diffThumbs;

diffThumbs = parseInt(maxThumb.style.left) - parseInt(minThumb.style.left);

lineDiff.style.width = `${diffThumbs}px`;
lineDiff.style.left = minThumb.style.left;

const diffCounter = (min, max) => {
  diffThumbs = parseInt(max.style.left) - parseInt(min.style.left);
  lineDiff.style.width = `${diffThumbs}px`;
  lineDiff.style.left = min.style.left;
};

const onClickHandler = (evt) => {
  const scalePosition = scale.getBoundingClientRect();
  const scaleX = scalePosition.left + scale.clientLeft;
  let clickPoint = evt.clientX - scaleX - thumbWidth / 2;

  if (clickPoint < 0) {
    clickPoint = 0;
  }

  if (clickPoint > scale.clientWidth) {
    return;
  }

  const distanseToMin = Math.abs(parseInt(minThumb.style.left) - clickPoint);
  const distanseToMax = Math.abs(parseInt(maxThumb.style.left) - clickPoint);

  if (distanseToMin <= distanseToMax) {
    minThumb.style.left = `${clickPoint}px`;
    inputMin.value = parseInt(minThumb.style.left) + thumbWidth / 2;
    tooltipMin.textContent = parseInt(minThumb.style.left) + thumbWidth / 2;
  } else {
    maxThumb.style.left = `${clickPoint}px`;
    inputMax.value = parseInt(maxThumb.style.left) + thumbWidth / 2;
    tooltipMax.value = parseInt(maxThumb.style.left) + thumbWidth / 2;
  }

  diffCounter(minThumb, maxThumb);
};

// limits

const limitMinThumb = function(left) {
  if ((left < -thumbWidth / 2)
  || (left > parseInt(maxThumb.style.left) - thumbWidth)) {
    return true;
  }

  return false;
};

const limitmaxThumb = function(left) {
  if ((left < parseInt(minThumb.style.left) + thumbWidth)
  || (left > scale.offsetWidth - maxThumb.offsetWidth)) {
    return true;
  }

  return false;
};

// moveMinThumb

const removeListeners = (move, up) => {
  document.removeEventListener('mousemove', move);
  document.removeEventListener('mouseup', up);
};

const addListeners = (move, up) => {
  document.addEventListener('mousemove', move);
  document.addEventListener('mouseup', up);
};

const moveMinThumb = (downEvent) => {
  downEvent.preventDefault();

  let startPoint = downEvent.clientX;

  const onMouseMove = (moveEvent) => {
    moveEvent.preventDefault();

    const distance = startPoint - moveEvent.clientX;

    if (limitMinThumb(minThumb.offsetLeft - distance)) {
      return;
    }

    startPoint = moveEvent.clientX;
    minThumb.style.left = `${minThumb.offsetLeft - distance}px`;
    inputMin.value = parseInt(minThumb.style.left) + thumbWidth / 2;
    tooltipMin.textContent = parseInt(minThumb.style.left) + thumbWidth / 2;

    diffCounter(minThumb, maxThumb);
  };

  const onMouseUp = (upEvent) => {
    upEvent.preventDefault();

    removeListeners(onMouseMove, onMouseUp);
  };

  addListeners(onMouseMove, onMouseUp);
};

// movemaxThumb

const movemaxThumb = (downEvent) => {
  downEvent.preventDefault();
  maxThumb.style.transition = 'none';

  let startPoint = downEvent.clientX;

  const onMouseMove = (moveEvent) => {
    moveEvent.preventDefault();

    const distance = startPoint - moveEvent.clientX;

    if (limitmaxThumb(maxThumb.offsetLeft - distance)) {
      return;
    }

    startPoint = moveEvent.clientX;
    maxThumb.style.left = `${maxThumb.offsetLeft - distance}px`;
    inputMax.value = parseInt(maxThumb.style.left) + thumbWidth / 2;
    tooltipMax.textContent = parseInt(maxThumb.style.left) + thumbWidth / 2;

    diffCounter(minThumb, maxThumb);
  };

  const onMouseUp = (upEvent) => {
    upEvent.preventDefault();

    removeListeners(onMouseMove, onMouseUp);
  };

  addListeners(onMouseMove, onMouseUp);
};

// inputEvents

const minInputHandler = (inputEvent) => {
  if (inputMin.value < 0) {
    inputMin.value = 0;
  }

  if (inputMin.value > inputMax.value - thumbWidth) {
    inputMin.value = inputMax.value - thumbWidth;
  }

  minThumb.style.left = `${inputMin.value}px`;
  diffCounter(minThumb, maxThumb);
};

const maxInputHandler = (inputEvent) => {
  if (inputMax.value > 500) {
    inputMax.value = 500;
  }

  maxThumb.style.left = `${inputMax.value}px`;
  diffCounter(minThumb, maxThumb);
};

inputMin.addEventListener('input', debounce(minInputHandler));
inputMax.addEventListener('input', debounce(maxInputHandler));
minThumb.addEventListener('mousedown', moveMinThumb);
maxThumb.addEventListener('mousedown', movemaxThumb);
scale.addEventListener('click', onClickHandler);

function debounce(callback) {
  let lastTimeout = null;

  return function() {
    if (lastTimeout) {
      clearTimeout(lastTimeout);
    }

    lastTimeout = setTimeout(() => {
      callback.apply(null, arguments);
    }, 500);
  };
};
