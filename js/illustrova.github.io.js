(function () {
'use strict';

/* @preserve
    _____ __ _     __                _
   / ___// /(_)___/ /___  ____      (_)___
  / (_ // // // _  // -_)/ __/_    / /(_-<
  \___//_//_/ \_,_/ \__//_/  (_)__/ //___/
                              |___/

  Version: 1.7.4
  Author: Nick Piscitelli (pickykneee)
  Website: https://nickpiscitelli.com
  Documentation: http://nickpiscitelli.github.io/Glider.js
  License: MIT License
  Release Date: October 25th, 2018

*/

/* global define */

(function (factory) {
  typeof define === 'function' && define.amd
    ? define(factory)
    : typeof exports === 'object'
      ? (module.exports = factory())
      : factory();
})(function () {
  var _window = typeof window !== 'undefined' ? window : this;

  var Glider = (_window.Glider = function (element, settings) {
    var _ = this;

    if (element._glider) return element._glider

    _.ele = element;
    _.ele.classList.add('glider');

    // expose glider object to its DOM element
    _.ele._glider = _;

    // merge user setting with defaults
    _.opt = Object.assign(
      {},
      {
        slidesToScroll: 1,
        slidesToShow: 1,
        resizeLock: true,
        duration: 0.5,
        // easeInQuad
        easing: function (x, t, b, c, d) {
          return c * (t /= d) * t + b
        }
      },
      settings
    );

    // set defaults
    _.animate_id = _.page = _.slide = 0;
    _.arrows = {};

    // preserve original options to
    // extend breakpoint settings
    _._opt = _.opt;

    if (_.opt.skipTrack) {
      // first and only child is the track
      _.track = _.ele.children[0];
    } else {
      // create track and wrap slides
      _.track = document.createElement('div');
      _.ele.appendChild(_.track);
      while (_.ele.children.length !== 1) {
        _.track.appendChild(_.ele.children[0]);
      }
    }

    _.track.classList.add('glider-track');

    // start glider
    _.init();

    // set events
    _.resize = _.init.bind(_, true);
    _.event(_.ele, 'add', {
      scroll: _.updateControls.bind(_)
    });
    _.event(_window, 'add', {
      resize: _.resize
    });
  });

  var gliderPrototype = Glider.prototype;
  gliderPrototype.init = function (refresh, paging) {
    var _ = this;

    var width = 0;

    var height = 0;

    _.slides = _.track.children;

    [].forEach.call(_.slides, function (_, i) {
      _.classList.add('glider-slide');
      _.setAttribute('data-gslide', i);
    });

    _.containerWidth = _.ele.clientWidth;

    var breakpointChanged = _.settingsBreakpoint();
    if (!paging) paging = breakpointChanged;

    if (
      _.opt.slidesToShow === 'auto' ||
      typeof _.opt._autoSlide !== 'undefined'
    ) {
      var slideCount = _.containerWidth / _.opt.itemWidth;

      _.opt._autoSlide = _.opt.slidesToShow = _.opt.exactWidth
        ? slideCount
        : Math.max(1, Math.floor(slideCount));
    }
    if (_.opt.slidesToScroll === 'auto') {
      _.opt.slidesToScroll = Math.floor(_.opt.slidesToShow);
    }

    _.itemWidth = _.opt.exactWidth
      ? _.opt.itemWidth
      : _.containerWidth / _.opt.slidesToShow;

    // set slide dimensions
    [].forEach.call(_.slides, function (__) {
      __.style.height = 'auto';
      __.style.width = _.itemWidth + 'px';
      width += _.itemWidth;
      height = Math.max(__.offsetHeight, height);
    });

    _.track.style.width = width + 'px';
    _.trackWidth = width;
    _.isDrag = false;
    _.preventClick = false;

    _.opt.resizeLock && _.scrollTo(_.slide * _.itemWidth, 0);

    if (breakpointChanged || paging) {
      _.bindArrows();
      _.buildDots();
      _.bindDrag();
    }

    _.updateControls();

    _.emit(refresh ? 'refresh' : 'loaded');
  };

  gliderPrototype.bindDrag = function () {
    var _ = this;
    _.mouse = _.mouse || _.handleMouse.bind(_);

    var mouseup = function () {
      _.mouseDown = undefined;
      _.ele.classList.remove('drag');
      if (_.isDrag) {
        _.preventClick = true;
      }
      _.isDrag = false;
    };

    var events = {
      mouseup: mouseup,
      mouseleave: mouseup,
      mousedown: function (e) {
        e.preventDefault();
        e.stopPropagation();
        _.mouseDown = e.clientX;
        _.ele.classList.add('drag');
      },
      mousemove: _.mouse,
      click: function (e) {
        if (_.preventClick) {
          e.preventDefault();
          e.stopPropagation();
        }
        _.preventClick = false;
      }
    };

    _.ele.classList.toggle('draggable', _.opt.draggable === true);
    _.event(_.ele, 'remove', events);
    if (_.opt.draggable) _.event(_.ele, 'add', events);
  };

  gliderPrototype.buildDots = function () {
    var _ = this;

    if (!_.opt.dots) {
      if (_.dots) _.dots.innerHTML = '';
      return
    }

    if (typeof _.opt.dots === 'string') {
      _.dots = document.querySelector(_.opt.dots);
    } else _.dots = _.opt.dots;
    if (!_.dots) return

    _.dots.innerHTML = '';
    _.dots.classList.add('glider-dots');

    for (var i = 0; i < Math.ceil(_.slides.length / _.opt.slidesToShow); ++i) {
      var dot = document.createElement('button');
      dot.dataset.index = i;
      dot.setAttribute('aria-label', 'Page ' + (i + 1));
      dot.setAttribute('role', 'tab');
      dot.className = 'glider-dot ' + (i ? '' : 'active');
      _.event(dot, 'add', {
        click: _.scrollItem.bind(_, i, true)
      });
      _.dots.appendChild(dot);
    }
  };

  gliderPrototype.bindArrows = function () {
    var _ = this;
    if (!_.opt.arrows) {
      Object.keys(_.arrows).forEach(function (direction) {
        var element = _.arrows[direction];
        _.event(element, 'remove', { click: element._func });
      });
      return
    }
    ['prev', 'next'].forEach(function (direction) {
      var arrow = _.opt.arrows[direction];
      if (arrow) {
        if (typeof arrow === 'string') arrow = document.querySelector(arrow);
        if (arrow) {
          arrow._func = arrow._func || _.scrollItem.bind(_, direction);
          _.event(arrow, 'remove', {
            click: arrow._func
          });
          _.event(arrow, 'add', {
            click: arrow._func
          });
          _.arrows[direction] = arrow;
        }
      }
    });
  };

  gliderPrototype.updateControls = function (event) {
    var _ = this;

    if (event && !_.opt.scrollPropagate) {
      event.stopPropagation();
    }

    var disableArrows = _.containerWidth >= _.trackWidth;

    if (!_.opt.rewind) {
      if (_.arrows.prev) {
        _.arrows.prev.classList.toggle(
          'disabled',
          _.ele.scrollLeft <= 0 || disableArrows
        );
        _.arrows.prev.classList.contains('disabled')
          ? _.arrows.prev.setAttribute('aria-disabled', true)
          : _.arrows.prev.setAttribute('aria-disabled', false);
      }
      if (_.arrows.next) {
        _.arrows.next.classList.toggle(
          'disabled',
          Math.ceil(_.ele.scrollLeft + _.containerWidth) >=
            Math.floor(_.trackWidth) || disableArrows
        );
        _.arrows.next.classList.contains('disabled')
          ? _.arrows.next.setAttribute('aria-disabled', true)
          : _.arrows.next.setAttribute('aria-disabled', false);
      }
    }

    _.slide = Math.round(_.ele.scrollLeft / _.itemWidth);
    _.page = Math.round(_.ele.scrollLeft / _.containerWidth);

    var middle = _.slide + Math.floor(Math.floor(_.opt.slidesToShow) / 2);

    var extraMiddle = Math.floor(_.opt.slidesToShow) % 2 ? 0 : middle + 1;
    if (Math.floor(_.opt.slidesToShow) === 1) {
      extraMiddle = 0;
    }

    // the last page may be less than one half of a normal page width so
    // the page is rounded down. when at the end, force the page to turn
    if (_.ele.scrollLeft + _.containerWidth >= Math.floor(_.trackWidth)) {
      _.page = _.dots ? _.dots.children.length - 1 : 0;
    }

    [].forEach.call(_.slides, function (slide, index) {
      var slideClasses = slide.classList;

      var wasVisible = slideClasses.contains('visible');

      var start = _.ele.scrollLeft;

      var end = _.ele.scrollLeft + _.containerWidth;

      var itemStart = _.itemWidth * index;

      var itemEnd = itemStart + _.itemWidth;

      [].forEach.call(slideClasses, function (className) {
        /^left|right/.test(className) && slideClasses.remove(className);
      });
      slideClasses.toggle('active', _.slide === index);
      if (middle === index || (extraMiddle && extraMiddle === index)) {
        slideClasses.add('center');
      } else {
        slideClasses.remove('center');
        slideClasses.add(
          [
            index < middle ? 'left' : 'right',
            Math.abs(index - (index < middle ? middle : extraMiddle || middle))
          ].join('-')
        );
      }

      var isVisible =
        Math.ceil(itemStart) >= Math.floor(start) &&
        Math.floor(itemEnd) <= Math.ceil(end);
      slideClasses.toggle('visible', isVisible);
      if (isVisible !== wasVisible) {
        _.emit('slide-' + (isVisible ? 'visible' : 'hidden'), {
          slide: index
        });
      }
    });
    if (_.dots) {
      [].forEach.call(_.dots.children, function (dot, index) {
        dot.classList.toggle('active', _.page === index);
      });
    }

    if (event && _.opt.scrollLock) {
      clearTimeout(_.scrollLock);
      _.scrollLock = setTimeout(function () {
        clearTimeout(_.scrollLock);
        // dont attempt to scroll less than a pixel fraction - causes looping
        if (Math.abs(_.ele.scrollLeft / _.itemWidth - _.slide) > 0.02) {
          if (!_.mouseDown) {
            // Only scroll if not at the end (#94)
            if (_.trackWidth > _.containerWidth + _.ele.scrollLeft) {
              _.scrollItem(_.getCurrentSlide());
            }
          }
        }
      }, _.opt.scrollLockDelay || 250);
    }
  };

  gliderPrototype.getCurrentSlide = function () {
    var _ = this;
    return _.round(_.ele.scrollLeft / _.itemWidth)
  };

  gliderPrototype.scrollItem = function (slide, dot, e) {
    if (e) e.preventDefault();

    var _ = this;

    var originalSlide = slide;
    ++_.animate_id;

    if (dot === true) {
      slide = slide * _.containerWidth;
      slide = Math.round(slide / _.itemWidth) * _.itemWidth;
    } else {
      if (typeof slide === 'string') {
        var backwards = slide === 'prev';

        // use precise location if fractional slides are on
        if (_.opt.slidesToScroll % 1 || _.opt.slidesToShow % 1) {
          slide = _.getCurrentSlide();
        } else {
          slide = _.slide;
        }

        if (backwards) slide -= _.opt.slidesToScroll;
        else slide += _.opt.slidesToScroll;

        if (_.opt.rewind) {
          var scrollLeft = _.ele.scrollLeft;
          slide =
            backwards && !scrollLeft
              ? _.slides.length
              : !backwards &&
                scrollLeft + _.containerWidth >= Math.floor(_.trackWidth)
                ? 0
                : slide;
        }
      }

      slide = Math.max(Math.min(slide, _.slides.length), 0);

      _.slide = slide;
      slide = _.itemWidth * slide;
    }

    _.scrollTo(
      slide,
      _.opt.duration * Math.abs(_.ele.scrollLeft - slide),
      function () {
        _.updateControls();
        _.emit('animated', {
          value: originalSlide,
          type:
            typeof originalSlide === 'string' ? 'arrow' : dot ? 'dot' : 'slide'
        });
      }
    );

    return false
  };

  gliderPrototype.settingsBreakpoint = function () {
    var _ = this;

    var resp = _._opt.responsive;

    if (resp) {
      // Sort the breakpoints in mobile first order
      resp.sort(function (a, b) {
        return b.breakpoint - a.breakpoint
      });

      for (var i = 0; i < resp.length; ++i) {
        var size = resp[i];
        if (_window.innerWidth >= size.breakpoint) {
          if (_.breakpoint !== size.breakpoint) {
            _.opt = Object.assign({}, _._opt, size.settings);
            _.breakpoint = size.breakpoint;
            return true
          }
          return false
        }
      }
    }
    // set back to defaults in case they were overriden
    var breakpointChanged = _.breakpoint !== 0;
    _.opt = Object.assign({}, _._opt);
    _.breakpoint = 0;
    return breakpointChanged
  };

  gliderPrototype.scrollTo = function (scrollTarget, scrollDuration, callback) {
    var _ = this;

    var start = new Date().getTime();

    var animateIndex = _.animate_id;

    var animate = function () {
      var now = new Date().getTime() - start;
      _.ele.scrollLeft =
        _.ele.scrollLeft +
        (scrollTarget - _.ele.scrollLeft) *
          _.opt.easing(0, now, 0, 1, scrollDuration);
      if (now < scrollDuration && animateIndex === _.animate_id) {
        _window.requestAnimationFrame(animate);
      } else {
        _.ele.scrollLeft = scrollTarget;
        callback && callback.call(_);
      }
    };

    _window.requestAnimationFrame(animate);
  };

  gliderPrototype.removeItem = function (index) {
    var _ = this;

    if (_.slides.length) {
      _.track.removeChild(_.slides[index]);
      _.refresh(true);
      _.emit('remove');
    }
  };

  gliderPrototype.addItem = function (ele) {
    var _ = this;

    _.track.appendChild(ele);
    _.refresh(true);
    _.emit('add');
  };

  gliderPrototype.handleMouse = function (e) {
    var _ = this;
    if (_.mouseDown) {
      _.isDrag = true;
      _.ele.scrollLeft +=
        (_.mouseDown - e.clientX) * (_.opt.dragVelocity || 3.3);
      _.mouseDown = e.clientX;
    }
  };

  // used to round to the nearest 0.XX fraction
  gliderPrototype.round = function (double) {
    var _ = this;
    var step = _.opt.slidesToScroll % 1 || 1;
    var inv = 1.0 / step;
    return Math.round(double * inv) / inv
  };

  gliderPrototype.refresh = function (paging) {
    var _ = this;
    _.init(true, paging);
  };

  gliderPrototype.setOption = function (opt, global) {
    var _ = this;

    if (_.breakpoint && !global) {
      _._opt.responsive.forEach(function (v) {
        if (v.breakpoint === _.breakpoint) {
          v.settings = Object.assign({}, v.settings, opt);
        }
      });
    } else {
      _._opt = Object.assign({}, _._opt, opt);
    }

    _.breakpoint = 0;
    _.settingsBreakpoint();
  };

  gliderPrototype.destroy = function () {
    var _ = this;

    var replace = _.ele.cloneNode(true);

    var clear = function (ele) {
      ele.removeAttribute('style');
      [].forEach.call(ele.classList, function (className) {
        /^glider/.test(className) && ele.classList.remove(className);
      });
    };
    // remove track
    replace.children[0].outerHTML = replace.children[0].innerHTML;
    clear(replace);
    [].forEach.call(replace.getElementsByTagName('*'), clear);
    _.ele.parentNode.replaceChild(replace, _.ele);
    _.event(_window, 'remove', {
      resize: _.resize
    });
    _.emit('destroy');
  };

  gliderPrototype.emit = function (name, arg) {
    var _ = this;

    var e = new _window.CustomEvent('glider-' + name, {
      bubbles: !_.opt.eventPropagate,
      detail: arg
    });
    _.ele.dispatchEvent(e);
  };

  gliderPrototype.event = function (ele, type, args) {
    var eventHandler = ele[type + 'EventListener'].bind(ele);
    Object.keys(args).forEach(function (k) {
      eventHandler(k, args[k]);
    });
  };

  return Glider
});

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var MicroModal = function () {

  var FOCUSABLE_ELEMENTS = ['a[href]', 'area[href]', 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', 'select:not([disabled]):not([aria-hidden])', 'textarea:not([disabled]):not([aria-hidden])', 'button:not([disabled]):not([aria-hidden])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex^="-"])'];

  var Modal = /*#__PURE__*/function () {
    function Modal(_ref) {
      var targetModal = _ref.targetModal,
          _ref$triggers = _ref.triggers,
          triggers = _ref$triggers === void 0 ? [] : _ref$triggers,
          _ref$onShow = _ref.onShow,
          onShow = _ref$onShow === void 0 ? function () {} : _ref$onShow,
          _ref$onClose = _ref.onClose,
          onClose = _ref$onClose === void 0 ? function () {} : _ref$onClose,
          _ref$openTrigger = _ref.openTrigger,
          openTrigger = _ref$openTrigger === void 0 ? 'data-micromodal-trigger' : _ref$openTrigger,
          _ref$closeTrigger = _ref.closeTrigger,
          closeTrigger = _ref$closeTrigger === void 0 ? 'data-micromodal-close' : _ref$closeTrigger,
          _ref$openClass = _ref.openClass,
          openClass = _ref$openClass === void 0 ? 'is-open' : _ref$openClass,
          _ref$disableScroll = _ref.disableScroll,
          disableScroll = _ref$disableScroll === void 0 ? false : _ref$disableScroll,
          _ref$disableFocus = _ref.disableFocus,
          disableFocus = _ref$disableFocus === void 0 ? false : _ref$disableFocus,
          _ref$awaitCloseAnimat = _ref.awaitCloseAnimation,
          awaitCloseAnimation = _ref$awaitCloseAnimat === void 0 ? false : _ref$awaitCloseAnimat,
          _ref$awaitOpenAnimati = _ref.awaitOpenAnimation,
          awaitOpenAnimation = _ref$awaitOpenAnimati === void 0 ? false : _ref$awaitOpenAnimati,
          _ref$debugMode = _ref.debugMode,
          debugMode = _ref$debugMode === void 0 ? false : _ref$debugMode;

      _classCallCheck(this, Modal);

      // Save a reference of the modal
      this.modal = document.getElementById(targetModal); // Save a reference to the passed config

      this.config = {
        debugMode: debugMode,
        disableScroll: disableScroll,
        openTrigger: openTrigger,
        closeTrigger: closeTrigger,
        openClass: openClass,
        onShow: onShow,
        onClose: onClose,
        awaitCloseAnimation: awaitCloseAnimation,
        awaitOpenAnimation: awaitOpenAnimation,
        disableFocus: disableFocus
      }; // Register click events only if pre binding eventListeners

      if (triggers.length > 0) this.registerTriggers.apply(this, _toConsumableArray(triggers)); // pre bind functions for event listeners

      this.onClick = this.onClick.bind(this);
      this.onKeydown = this.onKeydown.bind(this);
    }
    /**
     * Loops through all openTriggers and binds click event
     * @param  {array} triggers [Array of node elements]
     * @return {void}
     */


    _createClass(Modal, [{
      key: "registerTriggers",
      value: function registerTriggers() {
        var _this = this;

        for (var _len = arguments.length, triggers = new Array(_len), _key = 0; _key < _len; _key++) {
          triggers[_key] = arguments[_key];
        }

        triggers.filter(Boolean).forEach(function (trigger) {
          trigger.addEventListener('click', function (event) {
            return _this.showModal(event);
          });
        });
      }
    }, {
      key: "showModal",
      value: function showModal() {
        var _this2 = this;

        var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        this.activeElement = document.activeElement;
        this.modal.setAttribute('aria-hidden', 'false');
        this.modal.classList.add(this.config.openClass);
        this.scrollBehaviour('disable');
        this.addEventListeners();

        if (this.config.awaitOpenAnimation) {
          var handler = function handler() {
            _this2.modal.removeEventListener('animationend', handler, false);

            _this2.setFocusToFirstNode();
          };

          this.modal.addEventListener('animationend', handler, false);
        } else {
          this.setFocusToFirstNode();
        }

        this.config.onShow(this.modal, this.activeElement, event);
      }
    }, {
      key: "closeModal",
      value: function closeModal() {
        var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var modal = this.modal;
        this.modal.setAttribute('aria-hidden', 'true');
        this.removeEventListeners();
        this.scrollBehaviour('enable');

        if (this.activeElement && this.activeElement.focus) {
          this.activeElement.focus();
        }

        this.config.onClose(this.modal, this.activeElement, event);

        if (this.config.awaitCloseAnimation) {
          var openClass = this.config.openClass; // <- old school ftw

          this.modal.addEventListener('animationend', function handler() {
            modal.classList.remove(openClass);
            modal.removeEventListener('animationend', handler, false);
          }, false);
        } else {
          modal.classList.remove(this.config.openClass);
        }
      }
    }, {
      key: "closeModalById",
      value: function closeModalById(targetModal) {
        this.modal = document.getElementById(targetModal);
        if (this.modal) this.closeModal();
      }
    }, {
      key: "scrollBehaviour",
      value: function scrollBehaviour(toggle) {
        if (!this.config.disableScroll) return;
        var body = document.querySelector('body');

        switch (toggle) {
          case 'enable':
            Object.assign(body.style, {
              overflow: ''
            });
            break;

          case 'disable':
            Object.assign(body.style, {
              overflow: 'hidden'
            });
            break;
        }
      }
    }, {
      key: "addEventListeners",
      value: function addEventListeners() {
        this.modal.addEventListener('touchstart', this.onClick);
        this.modal.addEventListener('click', this.onClick);
        document.addEventListener('keydown', this.onKeydown);
      }
    }, {
      key: "removeEventListeners",
      value: function removeEventListeners() {
        this.modal.removeEventListener('touchstart', this.onClick);
        this.modal.removeEventListener('click', this.onClick);
        document.removeEventListener('keydown', this.onKeydown);
      }
    }, {
      key: "onClick",
      value: function onClick(event) {
        if (event.target.hasAttribute(this.config.closeTrigger)) {
          this.closeModal(event);
        }
      }
    }, {
      key: "onKeydown",
      value: function onKeydown(event) {
        if (event.keyCode === 27) this.closeModal(event); // esc

        if (event.keyCode === 9) this.retainFocus(event); // tab
      }
    }, {
      key: "getFocusableNodes",
      value: function getFocusableNodes() {
        var nodes = this.modal.querySelectorAll(FOCUSABLE_ELEMENTS);
        return Array.apply(void 0, _toConsumableArray(nodes));
      }
      /**
       * Tries to set focus on a node which is not a close trigger
       * if no other nodes exist then focuses on first close trigger
       */

    }, {
      key: "setFocusToFirstNode",
      value: function setFocusToFirstNode() {
        var _this3 = this;

        if (this.config.disableFocus) return;
        var focusableNodes = this.getFocusableNodes(); // no focusable nodes

        if (focusableNodes.length === 0) return; // remove nodes on whose click, the modal closes
        // could not think of a better name :(

        var nodesWhichAreNotCloseTargets = focusableNodes.filter(function (node) {
          return !node.hasAttribute(_this3.config.closeTrigger);
        });
        if (nodesWhichAreNotCloseTargets.length > 0) nodesWhichAreNotCloseTargets[0].focus();
        if (nodesWhichAreNotCloseTargets.length === 0) focusableNodes[0].focus();
      }
    }, {
      key: "retainFocus",
      value: function retainFocus(event) {
        var focusableNodes = this.getFocusableNodes(); // no focusable nodes

        if (focusableNodes.length === 0) return;
        /**
         * Filters nodes which are hidden to prevent
         * focus leak outside modal
         */

        focusableNodes = focusableNodes.filter(function (node) {
          return node.offsetParent !== null;
        }); // if disableFocus is true

        if (!this.modal.contains(document.activeElement)) {
          focusableNodes[0].focus();
        } else {
          var focusedItemIndex = focusableNodes.indexOf(document.activeElement);

          if (event.shiftKey && focusedItemIndex === 0) {
            focusableNodes[focusableNodes.length - 1].focus();
            event.preventDefault();
          }

          if (!event.shiftKey && focusableNodes.length > 0 && focusedItemIndex === focusableNodes.length - 1) {
            focusableNodes[0].focus();
            event.preventDefault();
          }
        }
      }
    }]);

    return Modal;
  }();
  /**
   * Modal prototype ends.
   * Here on code is responsible for detecting and
   * auto binding event handlers on modal triggers
   */
  // Keep a reference to the opened modal


  var activeModal = null;
  /**
   * Generates an associative array of modals and it's
   * respective triggers
   * @param  {array} triggers     An array of all triggers
   * @param  {string} triggerAttr The data-attribute which triggers the module
   * @return {array}
   */

  var generateTriggerMap = function generateTriggerMap(triggers, triggerAttr) {
    var triggerMap = [];
    triggers.forEach(function (trigger) {
      var targetModal = trigger.attributes[triggerAttr].value;
      if (triggerMap[targetModal] === undefined) triggerMap[targetModal] = [];
      triggerMap[targetModal].push(trigger);
    });
    return triggerMap;
  };
  /**
   * Validates whether a modal of the given id exists
   * in the DOM
   * @param  {number} id  The id of the modal
   * @return {boolean}
   */


  var validateModalPresence = function validateModalPresence(id) {
    if (!document.getElementById(id)) {
      console.warn("MicroModal: \u2757Seems like you have missed %c'".concat(id, "'"), 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', 'ID somewhere in your code. Refer example below to resolve it.');
      console.warn("%cExample:", 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', "<div class=\"modal\" id=\"".concat(id, "\"></div>"));
      return false;
    }
  };
  /**
   * Validates if there are modal triggers present
   * in the DOM
   * @param  {array} triggers An array of data-triggers
   * @return {boolean}
   */


  var validateTriggerPresence = function validateTriggerPresence(triggers) {
    if (triggers.length <= 0) {
      console.warn("MicroModal: \u2757Please specify at least one %c'micromodal-trigger'", 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', 'data attribute.');
      console.warn("%cExample:", 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', "<a href=\"#\" data-micromodal-trigger=\"my-modal\"></a>");
      return false;
    }
  };
  /**
   * Checks if triggers and their corresponding modals
   * are present in the DOM
   * @param  {array} triggers   Array of DOM nodes which have data-triggers
   * @param  {array} triggerMap Associative array of modals and their triggers
   * @return {boolean}
   */


  var validateArgs = function validateArgs(triggers, triggerMap) {
    validateTriggerPresence(triggers);
    if (!triggerMap) return true;

    for (var id in triggerMap) {
      validateModalPresence(id);
    }

    return true;
  };
  /**
   * Binds click handlers to all modal triggers
   * @param  {object} config [description]
   * @return void
   */


  var init = function init(config) {
    // Create an config object with default openTrigger
    var options = Object.assign({}, {
      openTrigger: 'data-micromodal-trigger'
    }, config); // Collects all the nodes with the trigger

    var triggers = _toConsumableArray(document.querySelectorAll("[".concat(options.openTrigger, "]"))); // Makes a mappings of modals with their trigger nodes


    var triggerMap = generateTriggerMap(triggers, options.openTrigger); // Checks if modals and triggers exist in dom

    if (options.debugMode === true && validateArgs(triggers, triggerMap) === false) return; // For every target modal creates a new instance

    for (var key in triggerMap) {
      var value = triggerMap[key];
      options.targetModal = key;
      options.triggers = _toConsumableArray(value);
      activeModal = new Modal(options); // eslint-disable-line no-new
    }
  };
  /**
   * Shows a particular modal
   * @param  {string} targetModal [The id of the modal to display]
   * @param  {object} config [The configuration object to pass]
   * @return {void}
   */


  var show = function show(targetModal, config) {
    var options = config || {};
    options.targetModal = targetModal; // Checks if modals and triggers exist in dom

    if (options.debugMode === true && validateModalPresence(targetModal) === false) return; // clear events in case previous modal wasn't close

    if (activeModal) activeModal.removeEventListeners(); // stores reference to active modal

    activeModal = new Modal(options); // eslint-disable-line no-new

    activeModal.showModal();
  };
  /**
   * Closes the active modal
   * @param  {string} targetModal [The id of the modal to close]
   * @return {void}
   */


  var close = function close(targetModal) {
    targetModal ? activeModal.closeModalById(targetModal) : activeModal.closeModal();
  };

  return {
    init: init,
    show: show,
    close: close
  };
}();
window.MicroModal = MicroModal;

var breakpoints = {
	xxs: 320,
	xs: 450,
	s: 540,
	m: 720,
	l: 990,
	xl: 1240,
	xxl: 1600
};
var columns = {
	xxs: 1,
	s: 2,
	m: 3,
	l: 4,
	xl: 6
};
var defaultImageWidth = 1000;
var defaultAspectRatio = {
	width: 3,
	height: 2
};
var iconWidth = 32;
var iconHeight = 32;
var iconHoverColor = "#d1d1d1";
var dotNavTransitionDuration = 300;
var vars = {
	breakpoints: breakpoints,
	columns: columns,
	defaultImageWidth: defaultImageWidth,
	defaultAspectRatio: defaultAspectRatio,
	iconWidth: iconWidth,
	iconHeight: iconHeight,
	iconHoverColor: iconHoverColor,
	dotNavTransitionDuration: dotNavTransitionDuration
};

document.addEventListener("DOMContentLoaded", function () {
  /** SETUP BUTTON TOGGLE FOR PORTFOLIO */
  const btnWorks = document.querySelector(".btn--show-works");
  btnWorks.onclick = () => btnWorks.closest(".works").classList.toggle("show");

  /** SETUP PORTFOLIO CAROUSEL */
  let glider = new Glider(document.querySelector(".works__carousel"), {
    slidesToShow: "auto",
    draggable: false,
    scrollLock: true,
    duration: 1.5,
    responsive: [{
      // screens greater than >= 775px
      breakpoint: vars.breakpoints.m,
      settings: {
        // Set to `auto` and provide item width to adjust to viewport
        slidesToShow: 3.4,
        slidesToScroll: "auto",
        duration: 0.25
      }
    }, {
      breakpoint: vars.breakpoints.xl,
      settings: {
        slidesToShow: 5.4,
        duration: 0.25
      }
    }]
  });

  glider.scrollToCenter = function (slideNum) {
    const { breakpoint, opt } = this;

    const slidesShown = opt.responsive.find(i => i.breakpoint === breakpoint).settings.slidesToShow;

    const offsetToCenter = Math.floor(Math.floor(slidesShown) / 2);

    this.scrollItem(slideNum - offsetToCenter);
  };

  let activeItem;
  glider.ele.addEventListener("click", e => {
    activeItem && activeItem.classList.remove("is-active");
    activeItem = e.target.closest("figure");
    activeItem.classList.add("is-active");

    const slideNum = parseInt(activeItem.dataset.gslide);
    glider.scrollToCenter(slideNum);
  });

  /** SETUP MODAL */
  MicroModal.init({
    onShow: (modal, trigger) => {
      loadModalContent(trigger.dataset.project);
      trigger.classList.add("active");
    },
    awaitCloseAnimation: true,
    onClose: () => {
      activeItem && activeItem.classList.remove("is-active");
    }
  });

  // fixing button not getting focus in safari/firefox
  // Since micromodal detects trigger as document.activeElement, we need to fake it
  [...document.querySelectorAll("button[data-project]")].map(button => button.addEventListener("click", e => e.target.closest("button").focus()));

  const modalContentEl = document.getElementById("modalContent");
  const loadModalContent = project => {
    const template = document.getElementById(project);
    const node = document.importNode(template.content, true);
    modalContentEl.innerHTML = "";
    modalContentEl.appendChild(node);
  };
});

}());
