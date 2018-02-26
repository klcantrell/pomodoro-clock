const elements = {
  init: function() {
     this.addHandlers();
    },
  activate: document.getElementById("activate"),
  triangle: document.getElementById("triangle"),
  tenSecs: document.getElementById("ten"),
  hundredTwentySecs: document.getElementById("hundred-twenty"),
  reset: document.getElementById("reset"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
  breakMinutes: document.getElementById("break-minutes"),
  breakSeconds: document.getElementById("break-seconds"),
  btns: document.querySelectorAll(".btn"),
  breakBtns: document.querySelectorAll(".break-clock__adjuster"),
  workMessage: document.getElementById("work-message"),
  breakMessage: document.getElementById("break-message"),
  adder: document.getElementById("adder"),
  subtracter: document.getElementById("subtracter"),
  breakAdder: document.getElementById("break-adder"),
  breakSubtracter: document.getElementById("break-subtracter"),
  addHandlers: function() {
    this.activate.addEventListener("click", function() {
        if (!timer.inProgress && !breakTimer.inProgress && timer.memory > 0) {
          breakTimer.reset();
          eyeCandy.toggleWorkMessage();
          animator.play(timer.memory);
          timer.run();
        }
      });
    this.tenSecs.addEventListener("click", function() {
        animator.reset();
        timer.reset();
        timer.setMainClock(10);
      });
    this.hundredTwentySecs.addEventListener("click", function() {
        animator.reset();
        timer.reset();
        timer.setMainClock(25);
      });
    this.reset.addEventListener("click", function() {
        animator.reset();
        timer.reset();
        breakTimer.reset();
      });
    this.adder.addEventListener("click", function() {
        timer.reset();
        timer.increment();
        timer.setMainClock(timer.minutesRemaining);
        animator.reset();
      });
    this.subtracter.addEventListener("click", function() {
        timer.reset();
        timer.decrement();
        timer.setMainClock(timer.minutesRemaining);
        animator.reset();
      });
    this.breakAdder.addEventListener("click", function() {
        breakTimer.reset();
        breakTimer.increment();
        timer.reset();
        animator.reset();
      });
    this.breakSubtracter.addEventListener("click", function() {
        breakTimer.reset();
        breakTimer.decrement();
        timer.reset();
        animator.reset();
      });
    eyeCandy.btnClick(this.btns);
    eyeCandy.breakBtnClick(this.breakBtns);
  }
};


const eyeCandy = {
  // see refactored version with object.keys() and for loop
  btnClick: function(btns) {
      btns.forEach((btn) => {
        btn.addEventListener("mousedown", (e) => {
            e.currentTarget.classList.toggle("btn--click");
          });
        btn.addEventListener("mouseup", (e) => {
            e.currentTarget.classList.toggle("btn--click");
          });
        btn.addEventListener("mouseleave", (e) => {
            e.currentTarget.classList.remove("btn--click");
          });
      });
    },
  // see refactored version with object.keys() and for loop
  breakBtnClick: function(btns) {
    btns.forEach((btn) => {
         btn.addEventListener("mousedown", (e) => {
            e.currentTarget.classList.toggle("break-clock__adjuster--click");
          });
        btn.addEventListener("mouseup", (e) => {
            e.currentTarget.classList.toggle("break-clock__adjuster--click");
          });
        btn.addEventListener("mouseleave", (e) => {
            e.currentTarget.classList.remove("break-clock__adjuster--click");
          });
      });
  },
  breakBtnClick: function(btns) {
      for (let i = 0, keys = Object.keys(btns); i < keys.length; i++) {
        btns[keys[i]].addEventListener("mousedown", (e) => {
            e.currentTarget.classList.toggle("break-clock__adjuster--click");
          });
        btns[keys[i]].addEventListener("mouseup", (e) => {
            e.currentTarget.classList.toggle("break-clock__adjuster--click");
          });
        btns[keys[i]].addEventListener("mouseleave", (e) => {
            e.currentTarget.classList.remove("break-clock__adjuster--click");
          });
      }
    },
  toggleWorkMessage: function() {
    elements.workMessage.classList.toggle("message--hidden");
   },
  toggleBreakMessage: function() {
    elements.breakMessage.classList.toggle("message--hidden");
   }
}

const animator = {
  init: function(initValue){
      this.tl.set(triangle, {transformOrigin: "center 15%"});
      this.setTweens(initValue);
    },
  tl: new TimelineMax(),
  reset: function() {
      this.tl.pause(0);
    },
  play: function(minutes) {
    this.setTweens(minutes);
    this.tl.play(0);
  },
  reverse: function(minutes) {
    this.setTweens(minutes);
    this.tl.seek(minutes * 60 - 1);
    this.tl.reverse();
  },
  setTweens: function(minutes) {
    let seconds = minutes * 60;
    this.reset();
    this.tl.clear();
    this.tl.addCallback(this.reset.bind(animator), seconds);
    this.tl
      .to(triangle, seconds, {rotationZ:"360deg"}, 0)
      .fromTo("#circle", seconds < 60 ? seconds : 60, {drawSVG:100, stroke: "hsla(243, 100%, 62%, 0.47)"}, {drawSVG:0, stroke: "hsla(0, 0%, 84%, 0.76)", repeat: -1}, 0)
      .to("#line", 1, {stroke: "hsla(243, 100%, 62%, 0.47)", repeat: seconds - 1, yoyo: true}, 0);
  }
};

// write about how I could have made the timer more of a reusable component vs. so much repetition yet with enough inconsistencies to make it hard to refactor

const timer = {
  inProgress: false,
  memory: 0,
  minutesRemaining: 0,
  seconds: 60,
  minutesElapsed: 0,
  init: function(initValue) {
      this.memory = initValue;
      this.minutesRemaining = initValue;
    },
  run: function() {
      this.toggleInProgress();
      this.minutesElapsed = 0;
      this.minutesRemaining = parseInt(elements.minutes.textContent) <= 0 ? this.memory : parseInt(elements.minutes.textContent);
      this.memory = this.minutesRemaining;
      if (this.minutesRemaining > 0) {
        this.countMinutesDown();
        this.countSecondsDown();
        this.secondsInterval = setInterval(this.countSecondsDown.bind(this), 1000);
      }
    },
  toggleInProgress: function() {
      if (this.inProgress) {
        this.inProgress = false;
      } else {
        this.inProgress = true;
      }
    },
  countMinutesDown: function() {
        if (this.minutesRemaining > 0) {
          this.minutesRemaining -= 1;
          elements.minutes.textContent = this.minutesRemaining;
        } else {
          this.toggleInProgress();
          eyeCandy.toggleWorkMessage();
          breakTimer.run();
        }
    },
  countSecondsDown: function() {
      this.seconds -= 1;
      if (this.seconds.toString().length < 2) {
        elements.seconds.textContent = `:0${this.seconds}`;
      } else {
        elements.seconds.textContent = `:${this.seconds}`;
      }
      if (this.seconds === 0) {
        this.minutesElapsed += 1;
        this.countMinutesDown();
        this.seconds = 60;
      }
      if (this.minutesElapsed === this.memory) {
        clearInterval(this.secondsInterval);
      }
    },
  reset: function() {
      if (this.inProgress) {
        this.toggleInProgress();
        this.minutesRemaining = this.memory;
        elements.minutes.textContent = this.minutesRemaining;
        this.seconds = 60;
        elements.seconds.textContent = ':00';
        eyeCandy.toggleWorkMessage();
      } else {
        elements.minutes.textContent = this.memory;
      }
      if (timer.secondsInterval) {
        clearInterval(timer.secondsInterval);
      }
    },
  increment: function() {
      let temp = parseInt(elements.minutes.textContent);
      this.minutesRemaining = temp;
      this.minutesRemaining += 1;
    },
  decrement: function() {
      if (parseInt(elements.minutes.textContent) > 1) {
        let temp = parseInt(elements.minutes.textContent);
        this.minutesRemaining = temp;
        this.minutesRemaining -= 1;
      }
    },
  setMainClock: function(time) {
      this.memory = time;
      elements.minutes.textContent = time;
    }
};

const breakTimer = {
  inProgress: false,
  memory: 0,
  minutesRemaining: 0,
  seconds: 60,
  minutesElapsed: 0,
  init: function(initValue) {
      this.memory = initValue;
      this.minutesRemaining = initValue;
    },
  run: function() {
      this.toggleInProgress();
      eyeCandy.toggleBreakMessage();
      this.minutesElapsed = 0;
      this.minutesRemaining = parseInt(elements.breakMinutes.textContent) <= 0 ? this.memory : parseInt(elements.breakMinutes.textContent);
      this.memory = this.minutesRemaining;
      animator.reverse(this.memory);
      if (this.minutesRemaining > 0) {
        this.countMinutesDown();
        this.countSecondsDown();
        this.secondsInterval = setInterval(breakTimer.countSecondsDown.bind(breakTimer), 1000);
      } /* else {
        this.toggleInProgress();
        eyeCandy.toggleBreakMessage();
      } */
    },
  toggleInProgress: function() {
      if (this.inProgress) {
        this.inProgress = false;
      } else {
        this.inProgress = true;
      }
    },
  countMinutesDown: function() {
        if (this.minutesRemaining > 0) {
          this.minutesRemaining -= 1;
          elements.breakMinutes.textContent = this.minutesRemaining;
        } else {
          this.toggleInProgress();
          eyeCandy.toggleBreakMessage();
        }
    },
  countSecondsDown: function() {
      this.seconds -= 1;
      if (this.seconds.toString().length < 2) {
        elements.breakSeconds.textContent = `:0${this.seconds}`;
      } else {
        elements.breakSeconds.textContent = `:${this.seconds}`;
      }
      if (this.seconds === 0) {
        this.minutesElapsed += 1;
        this.countMinutesDown();
        this.seconds = 60;
      }
      if (this.minutesElapsed === this.memory) {
        clearInterval(this.secondsInterval);
      }
    },
  reset: function() {
      if (this.inProgress) {
        this.toggleInProgress();
        this.minutesRemaining = this.memory;
        elements.breakMinutes.textContent = this.minutesRemaining > 0 && !isNaN(this.minutesRemaining) ? this.minutesRemaining : 'Set Break Time';
        this.seconds = 60;
        elements.breakSeconds.textContent = '';
        eyeCandy.toggleBreakMessage();
      } /* else if (this.memory > 0) {
        elements.breakMinutes.textContent = this.memory;
        elements.breakSeconds.textContent = ':00';
      } */
      if (this.secondsInterval) {
        clearInterval(this.secondsInterval);
      }
    },
  increment: function() {
      if (elements.breakSeconds.textContent === '') {
        elements.breakSeconds.textContent = ':00';
      }
      let temp = isNaN(parseInt(elements.breakMinutes.textContent)) ? 0 : parseInt(elements.breakMinutes.textContent);
      this.minutesRemaining = temp;
      this.minutesRemaining += 1;
      elements.breakMinutes.textContent = this.minutesRemaining;
    },
  decrement: function() {
      if (parseInt(elements.breakMinutes.textContent) > 1 && !isNaN(parseInt(elements.breakMinutes.textContent))) {
        if (elements.breakSeconds.textContent === '') {
          elements.breakSeconds.textContent = ':00';
        }
        let temp = parseInt(elements.breakMinutes.textContent);
        this.minutesRemaining = temp;
        this.minutesRemaining -= 1;
        elements.breakMinutes.textContent = this.minutesRemaining;
      } else {
        elements.breakMinutes.textContent = "Set Break Time";
        elements.breakSeconds.textContent = '';
      }
    }
};

elements.init();
animator.init(25);
timer.init(25);
