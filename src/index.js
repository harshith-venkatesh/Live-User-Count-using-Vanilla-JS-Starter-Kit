import './App.css';

let root;

function init() {
  root = document.getElementById('root');

  root.innerHTML = `
        <div class="container">
        <h1>Project on constant update on user score using mock pub/sub system</h1>
        <div id="live__timer" class="timer-display">0</div>
        <h1>Lottery Mock system which alerts user on reaching the value of 50</h1>
        <div id='lottery__update' class='timer-display'>0</div>
        <!-- <script src="script.js"></script> -->
        <script src="pubsubScript.js"></script>
        <script src='newAnimationScript.js'></script>
        </div>
        `;
}

init();

// const homePageButton = document.querySelector('#click_home_page');
// homePageButton.addEventListener('click', loadAbout);
// const aboutButton = document.querySelector('#click_about');
// aboutButton.addEventListener('click', redirectToGithub);

const liveCountDisplay = document.querySelector('#live__timer');
const lotteryDisplay = document.querySelector('#lottery__update');
let startCount = 0;
let variableCount = 0;
const ANIMATION_DURATION = 1337;
const lotteryLot = [];
let lotteryValue = 0;

function animateValue(display, start, end) {
  let startTimestamp = null;

  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min(
      (timestamp - startTimestamp) / ANIMATION_DURATION,
      // eslint-disable-next-line comma-dangle
      1
    );
    // eslint-disable-next-line no-param-reassign
    display.innerHTML = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      window.cancelAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

function initiateAnimation(obj, initialCount, endCount, lotteryCheck = false) {
  let activateCheck;
  function throttle() {
    if (!activateCheck) {
      if (lotteryCheck) {
        animateValue(obj, initialCount, endCount);
      }
      animateValue(obj, initialCount, endCount);
      activateCheck = true;
      // eslint-disable-next-line no-return-assign
      setTimeout(() => (activateCheck = false), ANIMATION_DURATION);
    }
  }
  if (startCount !== endCount) {
    throttle();
  }
}

function lotteryLotUpdate(lotteryNumber) {
  if (lotteryLot.length === 5) {
    lotteryValue -= lotteryLot[0];
    lotteryLot.shift();
    lotteryLot.push(Number(lotteryNumber));
    lotteryValue += lotteryNumber;
  } else {
    lotteryLot.push(Number(lotteryNumber));
    lotteryValue += lotteryNumber;
  }
}

function lotteryInitiateAnimation() {
  if (lotteryLot.length === 5) {
    initiateAnimation(lotteryDisplay, 0, lotteryValue, true);
    if (lotteryValue === 30) {
      // eslint-disable-next-line no-alert
      setTimeout(() => alert('WON'), ANIMATION_DURATION);
    }
  }
}
// when work with stram focus on large data set(big number) optimize the array called
function liveStream(dataInput) {
  if (dataInput?.showNow) {
    initiateAnimation(liveCountDisplay, startCount, variableCount);
    lotteryInitiateAnimation();
    startCount = variableCount;
  } else if (dataInput?.userChange) {
    variableCount += dataInput.userChange;
  } else if (dataInput?.number) {
    lotteryLotUpdate(dataInput.number);
  }
}

function createMockMessage() {
  const newValue = Math.floor(Math.random() * 100);
  const msg = {};
  if (newValue % 7 === 0) {
    msg.showNow = true;
  } else if (newValue % 5 === 0) {
    msg.userChange = -newValue;
  } else if (newValue % 3 === 0) {
    msg.number = newValue;
  } else {
    msg.userChange = newValue;
  }

  liveStream(msg);
}

function pubsubMock() {
  setInterval(() => createMockMessage(), 1000);
  setInterval(() => createMockMessage(), 2000);
}
pubsubMock();
