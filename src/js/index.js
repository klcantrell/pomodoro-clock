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
        if (mainTimer.isReady() && breakTimer.isReady()) {
          breakTimer.reset();
          animator.play(mainTimer.memory);
          mainTimer.run();
        }
      });
    this.tenSecs.addEventListener("click", function() {
        animator.reset();
        mainTimer.reset();
        mainTimer.setPreset(10);
      });
    this.hundredTwentySecs.addEventListener("click", function() {
        animator.reset();
        mainTimer.reset();
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
  init: function(initValue){
      this.tl.set("#triangle", {transformOrigin: "center 15%"});
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
      .to("#triangle", seconds, {rotationZ:"360deg"}, 0)
      .fromTo("#circle", seconds < 60 ? seconds : 60, {drawSVG:100, stroke: "hsla(243, 100%, 62%, 0.47)"}, {drawSVG:0, stroke: "hsla(0, 0%, 84%, 0.76)", repeat: -1}, 0)
      .to("#line", 1, {stroke: "hsla(243, 100%, 62%, 0.47)", repeat: seconds - 1, yoyo: true}, 0);
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
      animator.reverse(breakTimer.minutesRemaining);
			breakTimer.run();
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

const mainTimer = new MainTimer(elements.minutes, elements.seconds, elements.workMessage);
const breakTimer = new BreakTimer(elements.breakMinutes, elements.breakSeconds, elements.breakMessage);

elements.init();
animator.init(25);
mainTimer.init(25);
