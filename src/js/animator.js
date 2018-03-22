import KUTE from 'kute.js';
import 'kute.js/kute-svg';
import 'kute.js/kute-attr';

const animator = {
  deps: {
    view: ''
  },
  triangle: '',
  circle: '',
  line: '',
  init({initTime, view}) {
    this.deps.view = view;
    this.deps.view.triangle.setAttribute("transform", "rotate(0 290 4)");
    this.deps.view.circle.style["stroke-dasharray"] = 0;
    this.deps.view.circle.setAttribute("stroke", "rgba(71, 61, 255, 0.47)");
    this.deps.view.line.setAttribute("stroke", "rgba(184, 184, 184, 0.79)");
    this.setTweens(initTime);
  },
  reset: function() {
      this.triangle.stop();
      this.circle.stop();
      this.line.stop();
      this.deps.view.triangle.setAttribute("transform", "rotate(0 290 4)");
      this.deps.view.circle.style["stroke-dasharray"] = 0;
      this.deps.view.circle.setAttribute("stroke", "rgba(71, 61, 255, 0.47)");
      this.deps.view.line.setAttribute("stroke", "rgba(184, 184, 184, 0.79)");
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
    this.triangle = KUTE.fromTo(this.deps.view.triangle, {svgTransform: {rotate: 360}}, {svgTransform: {rotate: 0}}, {duration: ms, easing: "easingCubicOut"});
    this.circle = KUTE.fromTo(this.deps.view.circle, {draw: "0% 0%", attr: {stroke: "rgba(214, 214, 214, 0.76)"}}, {draw: "0% 100%", attr: {stroke: "rgba(71, 61, 255, 0.47)"}}, {duration: ms < 60000 ? ms : 60000, repeat: minutes - 1});
    this.line = KUTE.fromTo(this.deps.view.line, {attr: {stroke: "rgba(71, 61, 255, 0.47)"}}, {attr: {stroke: "rgba(184, 184, 184, 0.79)"}}, {duration: 1000, repeat: (ms / 1000) - 3, yoyo: true});

    this.triangle.start();
    this.circle.start();
    this.line.start();
  },
  setTweens: function(minutes) {
    let ms = minutes * 60000;
    this.triangle = KUTE.fromTo(this.deps.view.triangle, {svgTransform: {rotate: 0}}, {svgTransform: {rotate: 360}}, {duration: ms, easing: "easingCubicOut"});
    this.circle = KUTE.fromTo(this.deps.view.circle, {draw: "0% 100%", attr: {stroke: "rgba(71, 61, 255, 0.47)"}}, {draw: "0% 0%", attr: {stroke: "rgba(214, 214, 214, 0.76)"}}, {duration: ms < 60000 ? ms : 60000, repeat: minutes - 1});
    this.line = KUTE.fromTo(this.deps.view.line, {attr: {stroke: "rgba(184, 184, 184, 0.79)"}}, {attr: {stroke: "rgba(71, 61, 255, 0.47)"}}, {duration: 1000, repeat: (ms / 1000) - 3, yoyo: true});
  }
};

export { animator };
