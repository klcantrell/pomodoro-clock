import { view } from './view';
import { animator } from './animator';
import Timer from './Timer';
import '../css/style.css';

view.cacheDom();

class MainTimer extends Timer {
	constructor({minutesEl, secondsEl, messageEl, animator, breakTimer}) {
		super({minutesEl, secondsEl, messageEl, animator});
    this.deps.breakTimer = breakTimer;
	}

	init(initValue) {
		this.memory = initValue;
		this.minutesRemaining = initValue;
	}

  countMinutesDown() {
		if (this.minutesRemaining > 0) {
			this.minutesRemaining -= 1;
			this.minutesEl.textContent = this.minutesRemaining;
		} else {
			this.toggleInProgress();
			this.toggleMessage();
      if (this.deps.breakTimer.minutesRemaining > 0) {
        this.deps.animator.reverse(this.deps.breakTimer.minutesRemaining);
        this.deps.breakTimer.run();
      } else {
        this.deps.animator.reset();
      }
		}
	}

 	setPreset(time) {
 		this.memory = time;
 		this.minutesEl.textContent = time;
 	}
}

class BreakTimer extends Timer {
	constructor({minutesEl, secondsEl, messageEl, animator}) {
		super({minutesEl, secondsEl, messageEl, animator});
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

const breakTimer = new BreakTimer({
  minutesEl: view.breakMinutes,
  secondsEl: view.breakSeconds,
  messageEl: view.breakMessage,
  animator
});

const mainTimer = new MainTimer({
  minutesEl: view.minutes,
  secondsEl: view.seconds,
  messageEl: view.workMessage,
  animator,
  breakTimer
});

const initMainTimerMinutes = 25;

view.injectDependencies({mainTimer, breakTimer, animator});
mainTimer.init(initMainTimerMinutes);
animator.init({initMainTimerMinutes, view});
