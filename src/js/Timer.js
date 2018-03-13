export default class Timer {
	constructor({minutesEl, secondsEl, messageEl, animator}) {
    this.deps = {
			animator: animator
		},
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
