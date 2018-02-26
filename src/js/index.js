const elements = {
  init: function() {
     this.addHandlers();
    },
  activate: document.getElementById("activate"),
  triangle: document.getElementById("triangle"),
  circle: document.getElementById("circle"),
  line: document.getElementById("line"),
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
        if (mainTimer.isReady() && breakTimer.isReady()) {
          breakTimer.reset();
          animator.play(mainTimer.memory);
          mainTimer.run();
        }
      });
    this.tenSecs.addEventListener("click", function() {
        animator.reset();
        mainTimer.reset();
        breakTimer.reset();
        mainTimer.setPreset(10);
      });
    this.hundredTwentySecs.addEventListener("click", function() {
        animator.reset();
        mainTimer.reset();
        breakTimer.reset();
        mainTimer.setPreset(25);
      });
    this.reset.addEventListener("click", function() {
        animator.reset();
        mainTimer.reset();
        breakTimer.reset();
      });
    this.adder.addEventListener("click", function() {
        mainTimer.reset();
        mainTimer.increment();
        animator.reset();
      });
    this.subtracter.addEventListener("click", function() {
        mainTimer.reset();
        mainTimer.decrement();
        animator.reset();
      });
    this.breakAdder.addEventListener("click", function() {
        mainTimer.reset();
        breakTimer.reset();
        breakTimer.increment();
        animator.reset();
      });
    this.breakSubtracter.addEventListener("click", function() {
        mainTimer.reset();
        breakTimer.reset();
        breakTimer.decrement();
        animator.reset();
      });
    eyeCandy.btnClick(this.btns);
    eyeCandy.breakBtnClick(this.breakBtns);
  }
};


const eyeCandy = {
  btnClick: function(btns) {
      for (let i = 0, keys = Object.keys(btns); i < keys.length; i++) {
        btns[keys[i]].addEventListener("mousedown", (e) => {
            e.currentTarget.classList.toggle("btn--click");
          });
        btns[keys[i]].addEventListener("mouseup", (e) => {
            e.currentTarget.classList.toggle("btn--click");
          });
        btns[keys[i]].addEventListener("mouseleave", (e) => {
            e.currentTarget.classList.remove("btn--click");
          });
      }
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
    }
}

const animator = {
  triangle: '',
  circle: '',
  line: '',
  reset: function() {
      this.triangle.stop();
      this.circle.stop();
      this.line.stop();
      elements.triangle.style.transform = "rotate(0)";
      elements.circle.style["stroke-dasharray"] = 0;
      elements.circle.setAttribute("stroke", "rgba(71, 61, 255, 0.47)");
      elements.line.setAttribute("stroke", "rgba(184, 184, 184, 0.79)");
    },
  play: function(minutes) {
    this.setTweens(minutes);
    this.triangle.start();
    this.circle.start();
    this.line.start();
  },
  reverse: function(minutes) {
    this.triangle.stop();
    this.circle.stop();
    this.line.stop();

    let ms = minutes * 60000;
    this.triangle = KUTE.fromTo("#triangle", {rotate: 360}, {rotate: 0}, {duration: ms, easing: "easingCubicOut"});
    this.circle = KUTE.fromTo("#circle", {draw: "0% 0%", attr: {stroke: "rgba(214, 214, 214, 0.76)"}}, {draw: "0% 100%", attr: {stroke: "rgba(71, 61, 255, 0.47)"}}, {duration: ms < 60000 ? ms : 60000, repeat: minutes});
    this.line = KUTE.fromTo("#line", {attr: {stroke: "rgba(71, 61, 255, 0.47)"}}, {attr: {stroke: "rgba(184, 184, 184, 0.79)"}}, {duration: 1000, repeat: (ms / 1000), yoyo: true});

    this.triangle.start();
    this.circle.start();
    this.line.start();
  },
  setTweens: function(minutes) {
    let ms = minutes * 60000;
    this.triangle = KUTE.fromTo("#triangle", {rotate: 0}, {rotate: 360}, {duration: ms, easing: "easingCubicOut"});
    this.circle = KUTE.fromTo("#circle", {draw: "0% 100%", attr: {stroke: "rgba(71, 61, 255, 0.47)"}}, {draw: "0% 0%", attr: {stroke: "rgba(214, 214, 214, 0.76)"}}, {duration: ms < 60000 ? ms : 60000, repeat: minutes});
    this.line = KUTE.fromTo("#line", {attr: {stroke: "rgba(184, 184, 184, 0.79)"}}, {attr: {stroke: "rgba(71, 61, 255, 0.47)"}}, {duration: 1000, repeat: (ms / 1000), yoyo: true});
  },
  init(initTime) {
    elements.triangle.style.transform = "rotate(0)";
    elements.circle.style["stroke-dasharray"] = 0;
    elements.circle.setAttribute("stroke", "rgba(71, 61, 255, 0.47)");
    elements.line.setAttribute("stroke", "rgba(184, 184, 184, 0.79)");
    this.setTweens(25);
  }
};

class Timer {
	constructor(minutesEl, secondsEl, messageEl) {
		this.minutesEl = minutesEl;
		this.secondsEl = secondsEl;
		this.messageEl = messageEl;
		this.inProgress = false;
		this.memory = 0;
		this.minutesRemaining = 0;
		this.seconds = 60;
		this.minutesElapsed = 0;
	}

	run() {
		this.toggleInProgress();
		this.toggleMessage();
		this.minutesElapsed = 0;
		this.minutesRemaining = this.getNumFromView(this.minutesEl) <= 0 ? this.memory : this.getNumFromView(this.minutesEl);
		this.memory = this.minutesRemaining;
		if (this.minutesRemaining > 0) {
			this.countMinutesDown();
			this.countSecondsDown();
			this.secondsInterval = setInterval(this.countSecondsDown.bind(this), 1000);
		}
	}

	toggleInProgress() {
		if (this.inProgress) {
   			this.inProgress = false;
      	} else {
        	this.inProgress = true;
      	}
	}

	toggleMessage() {
		this.messageEl.classList.toggle("message--hidden");
	}

	countMinutesDown() {
		if (this.minutesRemaining > 0) {
			this.minutesRemaining -= 1;
			this.minutesEl.textContent = this.minutesRemaining;
		} else {
			this.toggleInProgress();
			this.toggleMessage();
      if (breakTimer.minutesRemaining) {
        console.log(breakTimer.minutesRemaining);
        animator.reverse(breakTimer.minutesRemaining);
        breakTimer.run();
      } else {
        animator.reset();
      }
		}
	}

	countSecondsDown() {
		this.seconds -= 1;
		if (this.seconds.toString().length < 2) {
			this.secondsEl.textContent = `:0${this.seconds}`;
		} else {
			this.secondsEl.textContent = `:${this.seconds}`;
		}
		if (this.seconds === 0) {
			this.minutesElapsed += 1;
			this.countMinutesDown();
			this.seconds = 60;
		}
		if (this.minutesElapsed === this.memory) {
			clearInterval(this.secondsInterval);
		}
 	}

 	reset() {
 		if (this.inProgress) {
 			this.toggleInProgress();
 			this.minutesRemaining = this.memory;
 			this.minutesEl.textContent = this.minutesRemaining > 0 && !isNaN(this.minutesRemaining) ? this.minutesRemaining : "Set Break Time";
 			this.seconds = 60;
 			this.secondsEl.textContent = ":00";
 			this.toggleMessage();
 		} else {
 			this.minutesEl.textContent = this.memory > 0 ? this.memory : "Set Break Time";
 		}
 		if (this.secondsInterval) {
 			clearInterval(this.secondsInterval);
 		}
 	}

 	increment() {
 		let minsFromView = this.getNumFromView(this.minutesEl);
 		if (this.secondsEl.textContent === '') {
 			this.secondsEl.textContent = ":00";
 		}
 		let temp = isNaN(minsFromView) ? 0 : minsFromView;
    temp++;
 		this.minutesRemaining = temp;
    this.memory = temp;
    this.minutesEl.textContent = this.minutesRemaining;
 	}

 	decrement() {
 		let minsFromView = this.getNumFromView(this.minutesEl);
 		if (minsFromView > 1 && !isNaN(minsFromView)) {
 			if (this.seconds.textContent === '') {
 				this.seconds.textContent = ":00";
 			}
	 		let temp = minsFromView;
      temp--;
	 		this.minutesRemaining = temp;
      this.memory = temp;
	 		this.minutesEl.textContent = this.minutesRemaining;
 		}
 	}

 	getNumFromView(viewEl) {
 		return parseInt(viewEl.textContent);
 	}

  isReady() {
    return (!this.inProgress && this.memory > 0);
  }
}

class MainTimer extends Timer {
	constructor(minutesEl, secondsEl, messageEl) {
		super(minutesEl, secondsEl, messageEl);
	}

	init(initValue) {
		this.memory = initValue;
		this.minutesRemaining = initValue;
	}

 	setPreset(time) {
 		this.memory = time;
 		this.minutesEl.textContent = time;
 	}
}

class BreakTimer extends Timer {
	constructor(minutesEl, secondsEl, messageEl) {
		super(minutesEl, secondsEl, messageEl);
	}

	countMinutesDown() {
		if (this.minutesRemaining > 0) {
			this.minutesRemaining -= 1;
			this.minutesEl.textContent = this.minutesRemaining;
		} else {
			this.toggleInProgress();
			this.toggleMessage();
		}
	}

 	decrement() {
 		let minsFromView = this.getNumFromView(this.minutesEl);
 		if (minsFromView > 1 && !isNaN(minsFromView)) {
 			if (this.seconds.textContent === '') {
 				this.seconds.textContent = ":00";
 			}
	 		let temp = minsFromView;
      temp--;
	 		this.minutesRemaining = temp;
      this.memory = temp;
	 		this.minutesEl.textContent = this.minutesRemaining;
 		} else {
      this.memory = 0;
 			this.minutesEl.textContent = "Set Break Time";
 			this.secondsEl.textContent = '';
 		}
  }

    isReady() {
    return (!this.inProgress);
  }
}

const mainTimer = new MainTimer(elements.minutes, elements.seconds, elements.workMessage),
      breakTimer = new BreakTimer(elements.breakMinutes, elements.breakSeconds, elements.breakMessage),
      initMainTimerMinutes = 25;

elements.init();
mainTimer.init(initMainTimerMinutes);
animator.init(initMainTimerMinutes);
