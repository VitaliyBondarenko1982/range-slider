'use strict';

const scale = document.querySelector('.slider__scale');
const minToggle = scale.querySelector('.slider__toggle--min');
const maxToggle = scale.querySelector('.slider__toggle--max');
const inputMin = document.querySelector('.slider__input--min');
const inputMax = document.querySelector('.slider__input--max');
const lineDiff = scale.querySelector('.slider__diff-line');
const toggleWidth = minToggle.offsetWidth;

minToggle.style.left = '50px';
maxToggle.style.left = '300px';

inputMin.value = parseInt(minToggle.style.left);
inputMax.value = parseInt(maxToggle.style.left);

let diffToggles;

diffToggles = parseInt(maxToggle.style.left) - parseInt(minToggle.style.left);

lineDiff.style.width = `${diffToggles}px`;
lineDiff.style.left = minToggle.style.left;

const diffCounter = (min, max) => {
  diffToggles = parseInt(max.style.left) - parseInt(min.style.left);
  lineDiff.style.width = `${diffToggles}px`;
  lineDiff.style.left = min.style.left;
};

const onClickHandler = (evt) => {
  const scalePosition = scale.getBoundingClientRect();
  const scaleX = scalePosition.left + scale.clientLeft;
  let clickPoint = evt.clientX - scaleX - toggleWidth / 2;

  if (clickPoint < 0) {
    clickPoint = 0;
  }

  if (clickPoint > scale.clientWidth) {
    return;
  }

  const distanseToMin = Math.abs(parseInt(minToggle.style.left) - clickPoint);
  const distanseToMax = Math.abs(parseInt(maxToggle.style.left) - clickPoint);

  if (distanseToMin <= distanseToMax) {
    minToggle.style.left = `${clickPoint}px`;
    inputMin.value = Math.round(parseInt(minToggle.style.left));
  } else {
    maxToggle.style.left = `${clickPoint}px`;
    inputMax.value = parseInt(maxToggle.style.left) + toggleWidth / 2;
  }

  diffCounter(minToggle, maxToggle);
};

// limits

const limitMinToggle = function(left) {
  if ((left < -toggleWidth / 2)
  || (left > parseInt(maxToggle.style.left) - toggleWidth)) {
    return true;
  }

  return false;
};

const limitMaxToggle = function(left) {
  if ((left < parseInt(minToggle.style.left) + toggleWidth)
  || (left > scale.offsetWidth - maxToggle.offsetWidth)) {
    return true;
  }

  return false;
};

// moveMinToggle

const removeListeners = (move, up) => {
  document.removeEventListener('mousemove', move);
  document.removeEventListener('mouseup', up);
};

const addListeners = (move, up) => {
  document.addEventListener('mousemove', move);
  document.addEventListener('mouseup', up);
};

const moveMinToggle = (downEvt) => {
  downEvt.preventDefault();

  let startPoint = downEvt.clientX;

  const onMouseMove = (moveEvt) => {
    moveEvt.preventDefault();

    const distance = startPoint - moveEvt.clientX;

    if (limitMinToggle(minToggle.offsetLeft - distance)) {
      return;
    }

    startPoint = moveEvt.clientX;
    minToggle.style.left = `${minToggle.offsetLeft - distance}px`;
    inputMin.value = parseInt(minToggle.style.left) + toggleWidth / 2;

    diffCounter(minToggle, maxToggle);
  };

  const onMouseUp = (upEvt) => {
    upEvt.preventDefault();

    removeListeners(onMouseMove, onMouseUp);
  };

  addListeners(onMouseMove, onMouseUp);
};

// moveMaxToggle

const moveMaxToggle = (downEvt) => {
  downEvt.preventDefault();
  maxToggle.style.transition = 'none';

  let startPoint = downEvt.clientX;

  const onMouseMove = (moveEvt) => {
    moveEvt.preventDefault();

    const distance = startPoint - moveEvt.clientX;

    if (limitMaxToggle(maxToggle.offsetLeft - distance)) {
      return;
    }

    startPoint = moveEvt.clientX;
    maxToggle.style.left = `${maxToggle.offsetLeft - distance}px`;
    inputMax.value = parseInt(maxToggle.style.left) + toggleWidth / 2;

    diffCounter(minToggle, maxToggle);
  };

  const onMouseUp = (upEvt) => {
    upEvt.preventDefault();

    removeListeners(onMouseMove, onMouseUp);
  };

  addListeners(onMouseMove, onMouseUp);
};

// inputEvents

const minInputHandler = (inputEvt) => {
  if (inputMin.value > inputMax.value - toggleWidth) {
    inputMin.value = inputMax.value - toggleWidth;
  }

  minToggle.style.left = `${inputMin.value}px`;
  diffCounter(minToggle, maxToggle);
};

const maxInputHandler = (inputEvt) => {
  maxToggle.style.left = `${inputMax.value}px`;
  diffCounter(minToggle, maxToggle);
};

inputMin.addEventListener('input', debounce(minInputHandler));
inputMax.addEventListener('input', debounce(maxInputHandler));
minToggle.addEventListener('mousedown', moveMinToggle);
maxToggle.addEventListener('mousedown', moveMaxToggle);
scale.addEventListener('click', onClickHandler);

function debounce(callback) {
  let lastTimeout = null;

  return function() {
    if (lastTimeout) {
      clearTimeout(lastTimeout);
    }

    lastTimeout = setTimeout(() => {
      callback.apply(null, arguments);
    }, 1000);
  };
};
