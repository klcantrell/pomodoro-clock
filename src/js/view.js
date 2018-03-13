const view = {
  deps: {
    mainTimer: '',
    breakTimer: '',
    animator: ''
  },
  rootEl: document.getElementById('pomodoro'),
  injectDependencies: function({mainTimer, breakTimer, animator}) {
    this.deps.mainTimer = mainTimer;
    this.deps.breakTimer = breakTimer;
    this.deps.animator = animator;
    this.bindEvents();
  },
  cacheDom: function() {
    this.activate = this.rootEl.querySelector("#activate"),
    this.triangle = this.rootEl.querySelector("#triangle"),
    this.circle = this.rootEl.querySelector("#circle"),
    this.line = this.rootEl.querySelector("#line"),
    this.tenSecs = this.rootEl.querySelector("#ten"),
    this.hundredTwentySecs = this.rootEl.querySelector("#hundred-twenty"),
    this.reset = this.rootEl.querySelector("#reset"),
    this.minutes = this.rootEl.querySelector("#minutes"),
    this.seconds = this.rootEl.querySelector("#seconds"),
    this.breakMinutes = this.rootEl.querySelector("#break-minutes"),
    this.breakSeconds = this.rootEl.querySelector("#break-seconds"),
    this.btns = this.rootEl.querySelectorAll(".btn"),
    this.breakBtns = this.rootEl.querySelectorAll(".break-clock__adjuster"),
    this.workMessage = this.rootEl.querySelector("#work-message"),
    this.breakMessage = this.rootEl.querySelector("#break-message"),
    this.adder = this.rootEl.querySelector("#adder"),
    this.subtracter = this.rootEl.querySelector("#subtracter"),
    this.breakAdder = this.rootEl.querySelector("#break-adder"),
    this.breakSubtracter = this.rootEl.querySelector("#break-subtracter")
  },
  bindEvents: function() {
    const _this = this;
    this.activate.addEventListener("click", function() {
        if (_this.deps.mainTimer.isReady() && _this.deps.breakTimer.isReady()) {
          _this.deps.breakTimer.reset();
          _this.deps.animator.play(_this.deps.mainTimer.memory);
          _this.deps.mainTimer.run();
        }
      });
    this.tenSecs.addEventListener("click", function() {
        _this.deps.animator.reset();
        _this.deps.mainTimer.reset();
        _this.deps.breakTimer.reset();
        _this.deps.mainTimer.setPreset(10);
      });
    this.hundredTwentySecs.addEventListener("click", function() {
        _this.deps.animator.reset();
        _this.deps.mainTimer.reset();
        _this.deps.breakTimer.reset();
        _this.deps.mainTimer.setPreset(25);
      });
    this.reset.addEventListener("click", function() {
        _this.deps.animator.reset();
        _this.deps.mainTimer.reset();
        _this.deps.breakTimer.reset();
      });
    this.adder.addEventListener("click", function() {
        _this.deps.mainTimer.reset();
        _this.deps.mainTimer.increment();
        _this.deps.animator.reset();
      });
    this.subtracter.addEventListener("click", function() {
        _this.deps.mainTimer.reset();
        _this.deps.mainTimer.decrement();
        _this.deps.animator.reset();
      });
    this.breakAdder.addEventListener("click", function() {
        _this.deps.mainTimer.reset();
        _this.deps.breakTimer.reset();
        _this.deps.breakTimer.increment();
        _this.deps.animator.reset();
      });
    this.breakSubtracter.addEventListener("click", function() {
        _this.deps.mainTimer.reset();
        _this.deps.breakTimer.reset();
        _this.deps.breakTimer.decrement();
        _this.deps.animator.reset();
      });
  }
};

export { view };
