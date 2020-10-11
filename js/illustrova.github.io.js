(function () {
'use strict';

/*!
 * fullPage 3.0.8
 * https://github.com/alvarotrigo/fullPage.js
 *
 * @license GPLv3 for open source use only
 * or Fullpage Commercial License for commercial use
 * http://alvarotrigo.com/fullPage/pricing/
 *
 * Copyright (C) 2018 http://alvarotrigo.com/fullPage - A project by Alvaro Trigo
 */
(function( root, window, document, factory, undefined) {
    if( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define( function() {
            root.fullpage = factory(window, document);
            return root.fullpage;
        } );
    } else if( typeof exports === 'object' ) {
        // Node. Does not work with strict CommonJS.
        module.exports = factory(window, document);
    } else {
        // Browser globals.
        window.fullpage = factory(window, document);
    }
}(undefined, window, document, function(window, document){
    var WRAPPER =               'fullpage-wrapper';
    var WRAPPER_SEL =           '.' + WRAPPER;

    // slimscroll
    var RESPONSIVE =            'fp-responsive';
    var NO_TRANSITION =         'fp-notransition';
    var DESTROYED =             'fp-destroyed';
    var ENABLED =               'fp-enabled';
    var VIEWING_PREFIX =        'fp-viewing';
    var ACTIVE =                'active';
    var ACTIVE_SEL =            '.' + ACTIVE;
    var COMPLETELY =            'fp-completely';
    var COMPLETELY_SEL =        '.' + COMPLETELY;

    // section
    var SECTION_DEFAULT_SEL =   '.section';
    var SECTION =               'fp-section';
    var SECTION_SEL =           '.' + SECTION;
    var SECTION_ACTIVE_SEL =    SECTION_SEL + ACTIVE_SEL;
    var TABLE_CELL =            'fp-tableCell';
    var TABLE_CELL_SEL =        '.' + TABLE_CELL;
    var AUTO_HEIGHT =           'fp-auto-height';
    var AUTO_HEIGHT_SEL =       '.' + AUTO_HEIGHT;
    var AUTO_HEIGHT_RESPONSIVE = 'fp-auto-height-responsive';
    var AUTO_HEIGHT_RESPONSIVE_SEL = '.' + AUTO_HEIGHT_RESPONSIVE;
    var NORMAL_SCROLL =         'fp-normal-scroll';
    var SECTION_NAV =           'fp-nav';
    var SECTION_NAV_SEL =       '#' + SECTION_NAV;
    var SECTION_NAV_TOOLTIP =   'fp-tooltip';
    var SECTION_NAV_TOOLTIP_SEL='.'+SECTION_NAV_TOOLTIP;
    var SHOW_ACTIVE_TOOLTIP =   'fp-show-active';

    // slide
    var SLIDE_DEFAULT_SEL =     '.slide';
    var SLIDE =                 'fp-slide';
    var SLIDE_SEL =             '.' + SLIDE;
    var SLIDE_ACTIVE_SEL =      SLIDE_SEL + ACTIVE_SEL;
    var SLIDES_WRAPPER =        'fp-slides';
    var SLIDES_WRAPPER_SEL =    '.' + SLIDES_WRAPPER;
    var SLIDES_CONTAINER =      'fp-slidesContainer';
    var SLIDES_CONTAINER_SEL =  '.' + SLIDES_CONTAINER;
    var TABLE =                 'fp-table';

    // slide nav
    var SLIDES_NAV =            'fp-slidesNav';
    var SLIDES_NAV_SEL =        '.' + SLIDES_NAV;
    var SLIDES_NAV_LINK_SEL =   SLIDES_NAV_SEL + ' a';
    var SLIDES_ARROW =          'fp-controlArrow';
    var SLIDES_ARROW_SEL =      '.' + SLIDES_ARROW;
    var SLIDES_PREV =           'fp-prev';
    var SLIDES_PREV_SEL =       '.' + SLIDES_PREV;
    var SLIDES_ARROW_PREV =     SLIDES_ARROW + ' ' + SLIDES_PREV;
    var SLIDES_ARROW_PREV_SEL = SLIDES_ARROW_SEL + SLIDES_PREV_SEL;
    var SLIDES_NEXT =           'fp-next';
    var SLIDES_NEXT_SEL =       '.' + SLIDES_NEXT;
    var SLIDES_ARROW_NEXT =     SLIDES_ARROW + ' ' + SLIDES_NEXT;
    var SLIDES_ARROW_NEXT_SEL = SLIDES_ARROW_SEL + SLIDES_NEXT_SEL;

    function initialise(containerSelector, options) {
        var isOK = options && new RegExp('([\\d\\w]{8}-){3}[\\d\\w]{8}|^(?=.*?[A-Y])(?=.*?[a-y])(?=.*?[0-8])(?=.*?[#?!@$%^&*-]).{8,}$').test(options['li'+'cen'+'seK' + 'e' + 'y']) || document.domain.indexOf('al'+'varotri' +'go' + '.' + 'com') > -1;

        // cache common elements
        var $htmlBody = $('html, body');
        var $html = $('html')[0];
        var $body = $('body')[0];

        //only once my friend!
        if(hasClass($html, ENABLED)){ displayWarnings(); return; }

        var FP = {};

        // Creating some defaults, extending them with any options that were provided
        options = deepExtend({
            //navigation
            menu: false,
            anchors:[],
            lockAnchors: false,
            navigation: false,
            navigationPosition: 'right',
            navigationTooltips: [],
            showActiveTooltip: false,
            slidesNavigation: false,
            slidesNavPosition: 'bottom',
            scrollBar: false,
            hybrid: false,

            //scrolling
            css3: true,
            scrollingSpeed: 700,
            autoScrolling: true,
            fitToSection: true,
            fitToSectionDelay: 1000,
            easing: 'easeInOutCubic',
            easingcss3: 'ease',
            loopBottom: false,
            loopTop: false,
            loopHorizontal: true,
            continuousVertical: false,
            continuousHorizontal: false,
            scrollHorizontally: false,
            interlockedSlides: false,
            dragAndMove: false,
            offsetSections: false,
            resetSliders: false,
            fadingEffect: false,
            normalScrollElements: null,
            scrollOverflow: false,
            scrollOverflowReset: false,
            scrollOverflowHandler: window.fp_scrolloverflow ? window.fp_scrolloverflow.iscrollHandler : null,
            scrollOverflowOptions: null,
            touchSensitivity: 5,
            touchWrapper: typeof containerSelector === 'string' ? $(containerSelector)[0] : containerSelector,
            bigSectionsDestination: null,

            //Accessibility
            keyboardScrolling: true,
            animateAnchor: true,
            recordHistory: true,

            //design
            controlArrows: true,
            controlArrowColor: '#fff',
            verticalCentered: true,
            sectionsColor : [],
            paddingTop: 0,
            paddingBottom: 0,
            fixedElements: null,
            responsive: 0, //backwards compabitility with responsiveWiddth
            responsiveWidth: 0,
            responsiveHeight: 0,
            responsiveSlides: false,
            parallax: false,
            parallaxOptions: {
                type: 'reveal',
                percentage: 62,
                property: 'translate'
            },
            cards: false,
            cardsOptions: {
                perspective: 100,
                fadeContent: true,
                fadeBackground: true
            },

            //Custom selectors
            sectionSelector: SECTION_DEFAULT_SEL,
            slideSelector: SLIDE_DEFAULT_SEL,

            //events
            v2compatible: false,
            afterLoad: null,
            onLeave: null,
            afterRender: null,
            afterResize: null,
            afterReBuild: null,
            afterSlideLoad: null,
            onSlideLeave: null,
            afterResponsive: null,

            lazyLoading: true
        }, options);

        //flag to avoid very fast sliding for landscape sliders
        var slideMoving = false;

        var isTouchDevice = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/);
        var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.maxTouchPoints));
        var container = typeof containerSelector === 'string' ? $(containerSelector)[0] : containerSelector;
        var windowsHeight = getWindowHeight();
        var windowsWidth = getWindowWidth();
        var isResizing = false;
        var isWindowFocused = true;
        var lastScrolledDestiny;
        var lastScrolledSlide;
        var canScroll = true;
        var scrollings = [];
        var controlPressed;
        var startingSection;
        var isScrollAllowed = {};
        isScrollAllowed.m = {  'up':true, 'down':true, 'left':true, 'right':true };
        isScrollAllowed.k = deepExtend({}, isScrollAllowed.m);
        var MSPointer = getMSPointer();
        var events = {
            touchmove: 'ontouchmove' in window ? 'touchmove' :  MSPointer.move,
            touchstart: 'ontouchstart' in window ? 'touchstart' :  MSPointer.down
        };
        var scrollBarHandler;

        // taken from https://github.com/udacity/ud891/blob/gh-pages/lesson2-focus/07-modals-and-keyboard-traps/solution/modal.js
        var focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

        //cheks for passive event support
        var g_supportsPassive = false;
        try {
          var opts = Object.defineProperty({}, 'passive', {
            get: function() {
              g_supportsPassive = true;
            }
          });
          window.addEventListener("testPassive", null, opts);
          window.removeEventListener("testPassive", null, opts);
        } catch (e) {}

        //timeouts
        var resizeId;
        var resizeHandlerId;
        var afterSectionLoadsId;
        var afterSlideLoadsId;
        var scrollId;
        var scrollId2;
        var keydownId;
        var g_doubleCheckHeightId;
        var originals = deepExtend({}, options); //deep copy
        var activeAnimation;
        var g_initialAnchorsInDom = false;
        var g_canFireMouseEnterNormalScroll = true;
        var g_mediaLoadedId;
        var extensions = [
            'parallax',
            'scrollOverflowReset',
            'dragAndMove',
            'offsetSections',
            'fadingEffect',
            'responsiveSlides',
            'continuousHorizontal',
            'interlockedSlides',
            'scrollHorizontally',
            'resetSliders',
            'cards'
        ];

        displayWarnings();

        //easeInOutCubic animation included in the plugin
        window.fp_easings = deepExtend(window.fp_easings, {
            easeInOutCubic: function (t, b, c, d) {
                if ((t/=d/2) < 1) return c/2*t*t*t + b;return c/2*((t-=2)*t*t + 2) + b;
            }
        });

        /**
        * Sets the autoScroll option.
        * It changes the scroll bar visibility and the history of the site as a result.
        */
        function setAutoScrolling(value, type){
            //removing the transformation
            if(!value){
                silentScroll(0);
            }

            setVariableState('autoScrolling', value, type);

            var element = $(SECTION_ACTIVE_SEL)[0];

            if(options.autoScrolling && !options.scrollBar){
                css($htmlBody, {
                    'overflow': 'hidden',
                    'height': '100%'
                });

                setRecordHistory(originals.recordHistory, 'internal');

                //for IE touch devices
                css(container, {
                    '-ms-touch-action': 'none',
                    'touch-action': 'none'
                });

                if(element != null){
                    //moving the container up
                    silentScroll(element.offsetTop);
                }
            }else{
                css($htmlBody, {
                    'overflow' : 'visible',
                    'height' : 'initial'
                });

                var recordHistory = !options.autoScrolling ? false : originals.recordHistory;
                setRecordHistory(recordHistory, 'internal');

                //for IE touch devices
                css(container, {
                    '-ms-touch-action': '',
                    'touch-action': ''
                });

                //scrolling the page to the section with no animation
                if (element != null) {
                    var scrollSettings = getScrollSettings(element.offsetTop);
                    scrollSettings.element.scrollTo(0, scrollSettings.options);
                }
            }
        }

        /**
        * Defines wheter to record the history for each hash change in the URL.
        */
        function setRecordHistory(value, type){
            setVariableState('recordHistory', value, type);
        }

        /**
        * Defines the scrolling speed
        */
        function setScrollingSpeed(value, type){
            setVariableState('scrollingSpeed', value, type);
        }

        /**
        * Sets fitToSection
        */
        function setFitToSection(value, type){
            setVariableState('fitToSection', value, type);
        }

        /**
        * Sets lockAnchors
        */
        function setLockAnchors(value){
            options.lockAnchors = value;
        }

        /**
        * Adds or remove the possibility of scrolling through sections by using the mouse wheel or the trackpad.
        */
        function setMouseWheelScrolling(value){
            if(value){
                addMouseWheelHandler();
                addMiddleWheelHandler();
            }else{
                removeMouseWheelHandler();
                removeMiddleWheelHandler();
            }
        }

        /**
        * Adds or remove the possibility of scrolling through sections by using the mouse wheel/trackpad or touch gestures.
        * Optionally a second parameter can be used to specify the direction for which the action will be applied.
        *
        * @param directions string containing the direction or directions separated by comma.
        */
        function setAllowScrolling(value, directions){
            if(typeof directions !== 'undefined'){
                directions = directions.replace(/ /g,'').split(',');

                directions.forEach(function (direction){
                    setIsScrollAllowed(value, direction, 'm');
                });
            }
            else{
                setIsScrollAllowed(value, 'all', 'm');
            }
        }

        /**
        * Adds or remove the mouse wheel hijacking
        */
        function setMouseHijack(value){
            if(value){
                setMouseWheelScrolling(true);
                addTouchHandler();
            }else{
                setMouseWheelScrolling(false);
                removeTouchHandler();
            }
        }

        /**
        * Adds or remove the possibility of scrolling through sections by using the keyboard arrow keys
        */
        function setKeyboardScrolling(value, directions){
            if(typeof directions !== 'undefined'){
                directions = directions.replace(/ /g,'').split(',');

                directions.forEach(function(direction){
                    setIsScrollAllowed(value, direction, 'k');
                });
            }else{
                setIsScrollAllowed(value, 'all', 'k');
                options.keyboardScrolling = value;
            }
        }

        /**
        * Moves the page up one section.
        */
        function moveSectionUp(){
            var prev = prevUntil($(SECTION_ACTIVE_SEL)[0], SECTION_SEL);

            //looping to the bottom if there's no more sections above
            if (!prev && (options.loopTop || options.continuousVertical)) {
                prev = last($(SECTION_SEL));
            }

            if (prev != null) {
                scrollPage(prev, null, true);
            }
        }

        /**
        * Moves the page down one section.
        */
        function moveSectionDown(){
            var next = nextUntil($(SECTION_ACTIVE_SEL)[0], SECTION_SEL);

            //looping to the top if there's no more sections below
            if(!next &&
                (options.loopBottom || options.continuousVertical)){
                next = $(SECTION_SEL)[0];
            }

            if(next != null){
                scrollPage(next, null, false);
            }
        }

        /**
        * Moves the page to the given section and slide with no animation.
        * Anchors or index positions can be used as params.
        */
        function silentMoveTo(sectionAnchor, slideAnchor){
            setScrollingSpeed (0, 'internal');
            moveTo(sectionAnchor, slideAnchor);
            setScrollingSpeed (originals.scrollingSpeed, 'internal');
        }

        /**
        * Moves the page to the given section and slide.
        * Anchors or index positions can be used as params.
        */
        function moveTo(sectionAnchor, slideAnchor){
            var destiny = getSectionByAnchor(sectionAnchor);

            if (typeof slideAnchor !== 'undefined'){
                scrollPageAndSlide(sectionAnchor, slideAnchor);
            }else if(destiny != null){
                scrollPage(destiny);
            }
        }

        /**
        * Slides right the slider of the active section.
        * Optional `section` param.
        */
        function moveSlideRight(section){
            moveSlide('right', section);
        }

        /**
        * Slides left the slider of the active section.
        * Optional `section` param.
        */
        function moveSlideLeft(section){
            moveSlide('left', section);
        }

        /**
         * When resizing is finished, we adjust the slides sizes and positions
         */
        function reBuild(resizing){
            if(hasClass(container, DESTROYED)){ return; }  //nothing to do if the plugin was destroyed

            isResizing = true;

            //updating global vars
            windowsHeight = getWindowHeight();
            windowsWidth = getWindowWidth();

            var sections = $(SECTION_SEL);
            for (var i = 0; i < sections.length; ++i) {
                var section = sections[i];
                var slidesWrap = $(SLIDES_WRAPPER_SEL, section)[0];
                var slides = $(SLIDE_SEL, section);

                //adjusting the height of the table-cell for IE and Firefox
                if(options.verticalCentered){
                    css($(TABLE_CELL_SEL, section), {'height': getTableHeight(section) + 'px'});
                }

                css(section, {'height': windowsHeight + 'px'});

                //adjusting the position fo the FULL WIDTH slides...
                if (slides.length > 1) {
                    landscapeScroll(slidesWrap, $(SLIDE_ACTIVE_SEL, slidesWrap)[0]);
                }
            }

            if(options.scrollOverflow){
                scrollBarHandler.createScrollBarForAll();
            }

            var activeSection = $(SECTION_ACTIVE_SEL)[0];
            var sectionIndex = index(activeSection, SECTION_SEL);

            //isn't it the first section?
            if(sectionIndex){
                //adjusting the position for the current section
                silentMoveTo(sectionIndex + 1);
            }

            isResizing = false;
            if(isFunction( options.afterResize ) && resizing){
                options.afterResize.call(container, window.innerWidth, window.innerHeight);
            }
            if(isFunction( options.afterReBuild ) && !resizing){
                options.afterReBuild.call(container);
            }
        }

        /**
        * Determines whether fullpage.js is in responsive mode or not.
        */
        function isResponsiveMode(){
           return hasClass($body, RESPONSIVE);
        }

        /**
        * Turns fullPage.js to normal scrolling mode when the viewport `width` or `height`
        * are smaller than the set limit values.
        */
        function setResponsive(active){
            var isResponsive = isResponsiveMode();

            if(active){
                if(!isResponsive){
                    setAutoScrolling(false, 'internal');
                    setFitToSection(false, 'internal');
                    hide($(SECTION_NAV_SEL));
                    addClass($body, RESPONSIVE);
                    if(isFunction( options.afterResponsive )){
                        options.afterResponsive.call( container, active);
                    }

                    //when on page load, we will remove scrolloverflow if necessary
                    if(options.scrollOverflow){
                        scrollBarHandler.createScrollBarForAll();
                    }
                }
            }
            else if(isResponsive){
                setAutoScrolling(originals.autoScrolling, 'internal');
                setFitToSection(originals.autoScrolling, 'internal');
                show($(SECTION_NAV_SEL));
                removeClass($body, RESPONSIVE);
                if(isFunction( options.afterResponsive )){
                    options.afterResponsive.call( container, active);
                }
            }
        }

        if(container){
            //public functions
            FP.version = '3.0.8';
            FP.setAutoScrolling = setAutoScrolling;
            FP.setRecordHistory = setRecordHistory;
            FP.setScrollingSpeed = setScrollingSpeed;
            FP.setFitToSection = setFitToSection;
            FP.setLockAnchors = setLockAnchors;
            FP.setMouseWheelScrolling = setMouseWheelScrolling;
            FP.setAllowScrolling = setAllowScrolling;
            FP.setKeyboardScrolling = setKeyboardScrolling;
            FP.moveSectionUp = moveSectionUp;
            FP.moveSectionDown = moveSectionDown;
            FP.silentMoveTo = silentMoveTo;
            FP.moveTo = moveTo;
            FP.moveSlideRight = moveSlideRight;
            FP.moveSlideLeft = moveSlideLeft;
            FP.fitToSection = fitToSection;
            FP.reBuild = reBuild;
            FP.setResponsive = setResponsive;
            FP.getFullpageData = function(){ return options; };
            FP.destroy = destroy;
            FP.getActiveSection = getActiveSection;
            FP.getActiveSlide = getActiveSlide;

            FP.test = {
                top: '0px',
                translate3d: 'translate3d(0px, 0px, 0px)',
                translate3dH: (function(){
                    var a = [];
                    for(var i = 0; i < $(options.sectionSelector, container).length; i++){
                        a.push('translate3d(0px, 0px, 0px)');
                    }
                    return a;
                })(),
                left: (function(){
                    var a = [];
                    for(var i = 0; i < $(options.sectionSelector, container).length; i++){
                        a.push(0);
                    }
                    return a;
                })(),
                options: options,
                setAutoScrolling: setAutoScrolling
            };

            //functions we want to share across files but which are not
            //mean to be used on their own by developers
            FP.shared = {
                afterRenderActions: afterRenderActions,
                isNormalScrollElement: false
            };

            window.fullpage_api = FP;

            //using jQuery initialization? Creating the $.fn.fullpage object
            if(options.$){
                Object.keys(FP).forEach(function (key) {    
                    options.$.fn.fullpage[key] = FP[key];   
                });
            }

            init();

            bindEvents();
        }

        function init(){
            //if css3 is not supported, it will use jQuery animations
            if(options.css3){
                options.css3 = support3d();
            }

            options.scrollBar = options.scrollBar || options.hybrid;

            setOptionsFromDOM();
            prepareDom();
            setAllowScrolling(true);
            setMouseHijack(true);
            setAutoScrolling(options.autoScrolling, 'internal');
            responsive();

            //setting the class for the body element
            setBodyClass();

            if(document.readyState === 'complete'){
                scrollToAnchor();
            }
            window.addEventListener('load', scrollToAnchor);

            //if we use scrollOverflow we'll fire afterRender in the scrolloverflow file
            if(!options.scrollOverflow){
                afterRenderActions();
            }

            doubleCheckHeight();
        }

        function bindEvents(){

            //when scrolling...
            window.addEventListener('scroll', scrollHandler);

            //detecting any change on the URL to scroll to the given anchor link
            //(a way to detect back history button as we play with the hashes on the URL)
            window.addEventListener('hashchange', hashChangeHandler);

            //when opening a new tab (ctrl + t), `control` won't be pressed when coming back.
            window.addEventListener('blur', blurHandler);

            //when resizing the site, we adjust the heights of the sections, slimScroll...
            window.addEventListener('resize', resizeHandler);

            //Sliding with arrow keys, both, vertical and horizontal
            document.addEventListener('keydown', keydownHandler);

            //to prevent scrolling while zooming
            document.addEventListener('keyup', keyUpHandler);

            //Scrolls to the section when clicking the navigation bullet
            //simulating the jQuery .on('click') event using delegation
            ['click', 'touchstart'].forEach(function(eventName){
                document.addEventListener(eventName, delegatedEvents);
            });

            /**
            * Applying normalScroll elements.
            * Ignoring the scrolls over the specified selectors.
            */
            if(options.normalScrollElements){
                ['mouseenter', 'touchstart'].forEach(function(eventName){
                    forMouseLeaveOrTouch(eventName, false);
                });

                ['mouseleave', 'touchend'].forEach(function(eventName){
                   forMouseLeaveOrTouch(eventName, true);
                });
            }
        }

        function delegatedEvents(e){
            var target = e.target;

            if(target && closest(target, SECTION_NAV_SEL + ' a')){
                sectionBulletHandler.call(target, e);
            }
            else if(matches(target, SECTION_NAV_TOOLTIP_SEL)){
                tooltipTextHandler.call(target);
            }
            else if(matches(target, SLIDES_ARROW_SEL)){
                slideArrowHandler.call(target, e);
            }
            else if(matches(target, SLIDES_NAV_LINK_SEL) || closest(target, SLIDES_NAV_LINK_SEL) != null){
                slideBulletHandler.call(target, e);
            }
            else if(closest(target, options.menu + ' [data-menuanchor]')){
                menuItemsHandler.call(target, e);
            }
        }

        function forMouseLeaveOrTouch(eventName, allowScrolling){
            //a way to pass arguments to the onMouseEnterOrLeave function
            document['fp_' + eventName] = allowScrolling;
            document.addEventListener(eventName, onMouseEnterOrLeave, true); //capturing phase
        }

        function onMouseEnterOrLeave(e) {
            var type = e.type;
            var isInsideOneNormalScroll = false;
            var isUsingScrollOverflow = options.scrollOverflow;

            //onMouseLeave will use the destination target, not the one we are moving away from
            var target = type === 'mouseleave' ? e.toElement || e.relatedTarget : e.target;

            //coming from closing a normalScrollElements modal or moving outside viewport?
            if(target == document || !target){
                setMouseHijack(true);

                if(isUsingScrollOverflow){
                    options.scrollOverflowHandler.setIscroll(target, true);
                }
                return;
            }

            if(type === 'touchend'){
                g_canFireMouseEnterNormalScroll = false;
                setTimeout(function(){
                    g_canFireMouseEnterNormalScroll = true;
                }, 800);
            }

            //preventing mouseenter event to do anything when coming from a touchEnd event
            //fixing issue #3576
            if(type === 'mouseenter' && !g_canFireMouseEnterNormalScroll){
                return;
            }

            var normalSelectors = options.normalScrollElements.split(',');

            normalSelectors.forEach(function(normalSelector){
                if(!isInsideOneNormalScroll){
                    var isNormalScrollTarget = matches(target, normalSelector);

                    //leaving a child inside the normalScoll element is not leaving the normalScroll #3661
                    var isNormalScrollChildFocused = closest(target, normalSelector);

                    if(isNormalScrollTarget || isNormalScrollChildFocused){
                        if(!FP.shared.isNormalScrollElement){
                            setMouseHijack(false);

                            if(isUsingScrollOverflow){
                                options.scrollOverflowHandler.setIscroll(target, false);
                            }
                        }
                        FP.shared.isNormalScrollElement = true;
                        isInsideOneNormalScroll = true;
                    }
                }
            });

            //not inside a single normal scroll element anymore?
            if(!isInsideOneNormalScroll && FP.shared.isNormalScrollElement){
                setMouseHijack(true);
                
                if(isUsingScrollOverflow){
                    options.scrollOverflowHandler.setIscroll(target, true);
                }

                FP.shared.isNormalScrollElement = false;
            }
        }

        /**
        * Checks the viewport a few times on a define interval of time to 
        * see if it has changed in any of those. If that's the case, it resizes.
        */
        function doubleCheckHeight(){
            for(var i = 1; i < 4; i++){
                g_doubleCheckHeightId = setTimeout(adjustToNewViewport, 350 * i);
            }
        }

        /**
        * Adjusts a section to the viewport if it has changed.
        */
        function adjustToNewViewport(){
            var newWindowHeight = getWindowHeight();
            var newWindowWidth = getWindowWidth();

            if(windowsHeight !== newWindowHeight || windowsWidth !== newWindowWidth){
                windowsHeight = newWindowHeight;
                windowsWidth = newWindowWidth;
                reBuild(true);
            }
        }

        /**
        * Setting options from DOM elements if they are not provided.
        */
        function setOptionsFromDOM(){

            //no anchors option? Checking for them in the DOM attributes
            if(!options.anchors.length){
                var anchorsAttribute = '[data-anchor]';
                var anchors = $(options.sectionSelector.split(',').join(anchorsAttribute + ',') + anchorsAttribute, container);
                if(anchors.length){
                    g_initialAnchorsInDom = true;
                    anchors.forEach(function(item){
                        options.anchors.push(item.getAttribute('data-anchor').toString());
                    });
                }
            }

            //no tooltips option? Checking for them in the DOM attributes
            if(!options.navigationTooltips.length){
                var tooltipsAttribute = '[data-tooltip]';
                var tooltips = $(options.sectionSelector.split(',').join(tooltipsAttribute + ',') + tooltipsAttribute, container);
                if(tooltips.length){
                    tooltips.forEach(function(item){
                        options.navigationTooltips.push(item.getAttribute('data-tooltip').toString());
                    });
                }
            }
        }

        /**
        * Works over the DOM structure to set it up for the current fullpage options.
        */
        function prepareDom(){
            css(container, {
                'height': '100%',
                'position': 'relative'
            });

            //adding a class to recognize the container internally in the code
            addClass(container, WRAPPER);
            addClass($html, ENABLED);

            //due to https://github.com/alvarotrigo/fullPage.js/issues/1502
            windowsHeight = getWindowHeight();

            removeClass(container, DESTROYED); //in case it was destroyed before initializing it again

            addInternalSelectors();

            var sections = $(SECTION_SEL);

            //styling the sections / slides / menu
            for(var i = 0; i<sections.length; i++){
                var sectionIndex = i;
                var section = sections[i];
                var slides = $(SLIDE_SEL, section);
                var numSlides = slides.length;

                //caching the original styles to add them back on destroy('all')
                section.setAttribute('data-fp-styles', section.getAttribute('style'));

                styleSection(section, sectionIndex);
                styleMenu(section, sectionIndex);

                // if there's any slide
                if (numSlides > 0) {
                    styleSlides(section, slides, numSlides);
                }else{
                    if(options.verticalCentered){
                        addTableClass(section);
                    }
                }
            }

            //fixed elements need to be moved out of the plugin container due to problems with CSS3.
            if(options.fixedElements && options.css3){
                $(options.fixedElements).forEach(function(item){
                    $body.appendChild(item);
                });
            }

            //vertical centered of the navigation + active bullet
            if(options.navigation){
                addVerticalNavigation();
            }

            enableYoutubeAPI();

            if(options.scrollOverflow){
                scrollBarHandler = options.scrollOverflowHandler.init(options);
            }
        }

        /**
        * Styles the horizontal slides for a section.
        */
        function styleSlides(section, slides, numSlides){
            var sliderWidth = numSlides * 100;
            var slideWidth = 100 / numSlides;

            var slidesWrapper = document.createElement('div');
            slidesWrapper.className = SLIDES_WRAPPER; //fp-slides
            wrapAll(slides, slidesWrapper);

            var slidesContainer = document.createElement('div');
            slidesContainer.className = SLIDES_CONTAINER; //fp-slidesContainer
            wrapAll(slides, slidesContainer);

            css($(SLIDES_CONTAINER_SEL, section), {'width': sliderWidth + '%'});

            if(numSlides > 1){
                if(options.controlArrows){
                    createSlideArrows(section);
                }

                if(options.slidesNavigation){
                    addSlidesNavigation(section, numSlides);
                }
            }

            slides.forEach(function(slide) {
                css(slide, {'width': slideWidth + '%'});

                if(options.verticalCentered){
                    addTableClass(slide);
                }
            });

            var startingSlide = $(SLIDE_ACTIVE_SEL, section)[0];

            //if the slide won't be an starting point, the default will be the first one
            //the active section isn't the first one? Is not the first slide of the first section? Then we load that section/slide by default.
            if( startingSlide != null && (index($(SECTION_ACTIVE_SEL), SECTION_SEL) !== 0 || (index($(SECTION_ACTIVE_SEL), SECTION_SEL) === 0 && index(startingSlide) !== 0))){
                silentLandscapeScroll(startingSlide, 'internal');
            }else{
                addClass(slides[0], ACTIVE);
            }
        }

        /**
        * Styling vertical sections
        */
        function styleSection(section, index){
            //if no active section is defined, the 1st one will be the default one
            if(!index && $(SECTION_ACTIVE_SEL)[0] == null) {
                addClass(section, ACTIVE);
            }
            startingSection = $(SECTION_ACTIVE_SEL)[0];

            css(section, {'height': windowsHeight + 'px'});

            if(options.paddingTop){
                css(section, {'padding-top': options.paddingTop});
            }

            if(options.paddingBottom){
                css(section, {'padding-bottom': options.paddingBottom});
            }

            if (typeof options.sectionsColor[index] !==  'undefined') {
                css(section, {'background-color': options.sectionsColor[index]});
            }

            if (typeof options.anchors[index] !== 'undefined') {
                section.setAttribute('data-anchor', options.anchors[index]);
            }
        }

        /**
        * Sets the data-anchor attributes to the menu elements and activates the current one.
        */
        function styleMenu(section, index){
            if (typeof options.anchors[index] !== 'undefined') {
                //activating the menu / nav element on load
                if(hasClass(section, ACTIVE)){
                    activateMenuAndNav(options.anchors[index], index);
                }
            }

            //moving the menu outside the main container if it is inside (avoid problems with fixed positions when using CSS3 tranforms)
            if(options.menu && options.css3 && closest($(options.menu)[0], WRAPPER_SEL) != null){
                $(options.menu).forEach(function(menu) {
                    $body.appendChild(menu);
                });
            }
        }

        /**
        * Adds internal classes to be able to provide customizable selectors
        * keeping the link with the style sheet.
        */
        function addInternalSelectors(){
            addClass($(options.sectionSelector, container), SECTION);
            addClass($(options.slideSelector, container), SLIDE);
        }

        /**
        * Creates the control arrows for the given section
        */
        function createSlideArrows(section){
            var arrows = [createElementFromHTML('<div class="' + SLIDES_ARROW_PREV + '"></div>'), createElementFromHTML('<div class="' + SLIDES_ARROW_NEXT + '"></div>')];
            after($(SLIDES_WRAPPER_SEL, section)[0], arrows);

            if(options.controlArrowColor !== '#fff'){
                css($(SLIDES_ARROW_NEXT_SEL, section), {'border-color': 'transparent transparent transparent '+options.controlArrowColor});
                css($(SLIDES_ARROW_PREV_SEL, section), {'border-color': 'transparent '+ options.controlArrowColor + ' transparent transparent'});
            }

            if(!options.loopHorizontal){
                hide($(SLIDES_ARROW_PREV_SEL, section));
            }
        }

        /**
        * Creates a vertical navigation bar.
        */
        function addVerticalNavigation(){
            var navigation = document.createElement('div');
            navigation.setAttribute('id', SECTION_NAV);

            var divUl = document.createElement('ul');
            navigation.appendChild(divUl);

            appendTo(navigation, $body);
            var nav = $(SECTION_NAV_SEL)[0];

            addClass(nav, 'fp-' + options.navigationPosition);

            if(options.showActiveTooltip){
                addClass(nav, SHOW_ACTIVE_TOOLTIP);
            }

            var li = '';

            for (var i = 0; i < $(SECTION_SEL).length; i++) {
                var link = '';
                if (options.anchors.length) {
                    link = options.anchors[i];
                }

                li += '<li><a href="#' + link + '"><span class="fp-sr-only">' + getBulletLinkName(i, 'Section') + '</span><span></span></a>';

                // Only add tooltip if needed (defined by user)
                var tooltip = options.navigationTooltips[i];

                if (typeof tooltip !== 'undefined' && tooltip !== '') {
                    li += '<div class="' + SECTION_NAV_TOOLTIP + ' fp-' + options.navigationPosition + '">' + tooltip + '</div>';
                }

                li += '</li>';
            }
            $('ul', nav)[0].innerHTML = li;

            //centering it vertically
            css($(SECTION_NAV_SEL), {'margin-top': '-' + ($(SECTION_NAV_SEL)[0].offsetHeight/2) + 'px'});

            //activating the current active section

            var bullet = $('li', $(SECTION_NAV_SEL)[0])[index($(SECTION_ACTIVE_SEL)[0], SECTION_SEL)];
            addClass($('a', bullet), ACTIVE);
        }

        /**
        * Gets the name for screen readers for a section/slide navigation bullet.
        */
        function getBulletLinkName(i, defaultName){
            return options.navigationTooltips[i]
                || options.anchors[i]
                || defaultName + ' ' + (i+1);
        }

        /*
        * Enables the Youtube videos API so we can control their flow if necessary.
        */
        function enableYoutubeAPI(){
            $('iframe[src*="youtube.com/embed/"]', container).forEach(function(item){
                addURLParam(item, 'enablejsapi=1');
            });
        }

        /**
        * Adds a new parameter and its value to the `src` of a given element
        */
        function addURLParam(element, newParam){
            var originalSrc = element.getAttribute('src');
            element.setAttribute('src', originalSrc + getUrlParamSign(originalSrc) + newParam);
        }

        /*
        * Returns the prefix sign to use for a new parameter in an existen URL.
        *
        * @return {String}  ? | &
        */
        function getUrlParamSign(url){
            return ( !/\?/.test( url ) ) ? '?' : '&';
        }

        /**
        * Actions and callbacks to fire afterRender
        */
        function afterRenderActions(){
            var section = $(SECTION_ACTIVE_SEL)[0];

            addClass(section, COMPLETELY);

            lazyLoad(section);
            lazyLoadOthers();
            playMedia(section);

            if(options.scrollOverflow){
                options.scrollOverflowHandler.afterLoad();
            }

            if(isDestinyTheStartingSection() && isFunction(options.afterLoad) ){
                fireCallback('afterLoad', {
                    activeSection: section,
                    element: section,
                    direction: null,

                    //for backwards compatibility callback (to be removed in a future!)
                    anchorLink: section.getAttribute('data-anchor'),
                    sectionIndex: index(section, SECTION_SEL)
                });
            }

            if(isFunction(options.afterRender)){
                fireCallback('afterRender');
            }
        }

        /**
        * Determines if the URL anchor destiny is the starting section (the one using 'active' class before initialization)
        */
        function isDestinyTheStartingSection(){
            var anchor = getAnchorsURL();
            var destinationSection = getSectionByAnchor(anchor.section);
            return !anchor.section || !destinationSection || typeof destinationSection !=='undefined' && index(destinationSection) === index(startingSection);
        }

        var isScrolling = false;
        var lastScroll = 0;

        //when scrolling...
        function scrollHandler(){
            var currentSection;

            if(!options.autoScrolling || options.scrollBar){
                var currentScroll = getScrollTop();
                var scrollDirection = getScrollDirection(currentScroll);
                var visibleSectionIndex = 0;
                var screen_mid = currentScroll + (getWindowHeight() / 2.0);
                var isAtBottom = $body.offsetHeight - getWindowHeight() === currentScroll;
                var sections =  $(SECTION_SEL);

                //when using `auto-height` for a small last section it won't be centered in the viewport
                if(isAtBottom){
                    visibleSectionIndex = sections.length - 1;
                }
                //is at top? when using `auto-height` for a small first section it won't be centered in the viewport
                else if(!currentScroll){
                    visibleSectionIndex = 0;
                }

                //taking the section which is showing more content in the viewport
                else{
                    for (var i = 0; i < sections.length; ++i) {
                        var section = sections[i];

                        // Pick the the last section which passes the middle line of the screen.
                        if (section.offsetTop <= screen_mid)
                        {
                            visibleSectionIndex = i;
                        }
                    }
                }

                if(isCompletelyInViewPort(scrollDirection)){
                    if(!hasClass($(SECTION_ACTIVE_SEL)[0], COMPLETELY)){
                        addClass($(SECTION_ACTIVE_SEL)[0], COMPLETELY);
                        removeClass(siblings($(SECTION_ACTIVE_SEL)[0]), COMPLETELY);
                    }
                }

                //geting the last one, the current one on the screen
                currentSection = sections[visibleSectionIndex];

                //setting the visible section as active when manually scrolling
                //executing only once the first time we reach the section
                if(!hasClass(currentSection, ACTIVE)){
                    isScrolling = true;
                    var leavingSection = $(SECTION_ACTIVE_SEL)[0];
                    var leavingSectionIndex = index(leavingSection, SECTION_SEL) + 1;
                    var yMovement = getYmovement(currentSection);
                    var anchorLink  = currentSection.getAttribute('data-anchor');
                    var sectionIndex = index(currentSection, SECTION_SEL) + 1;
                    var activeSlide = $(SLIDE_ACTIVE_SEL, currentSection)[0];
                    var slideIndex;
                    var slideAnchorLink;
                    var callbacksParams = {
                        activeSection: leavingSection,
                        sectionIndex: sectionIndex -1,
                        anchorLink: anchorLink,
                        element: currentSection,
                        leavingSection: leavingSectionIndex,
                        direction: yMovement
                    };

                    if(activeSlide){
                        slideAnchorLink = activeSlide.getAttribute('data-anchor');
                        slideIndex = index(activeSlide);
                    }

                    if(canScroll){
                        addClass(currentSection, ACTIVE);
                        removeClass(siblings(currentSection), ACTIVE);

                        if(isFunction( options.onLeave )){
                            fireCallback('onLeave', callbacksParams);
                        }
                        if(isFunction( options.afterLoad )){
                            fireCallback('afterLoad', callbacksParams);
                        }

                        stopMedia(leavingSection);
                        lazyLoad(currentSection);
                        playMedia(currentSection);

                        activateMenuAndNav(anchorLink, sectionIndex - 1);

                        if(options.anchors.length){
                            //needed to enter in hashChange event when using the menu with anchor links
                            lastScrolledDestiny = anchorLink;
                        }
                        setState(slideIndex, slideAnchorLink, anchorLink, sectionIndex);
                    }

                    //small timeout in order to avoid entering in hashChange event when scrolling is not finished yet
                    clearTimeout(scrollId);
                    scrollId = setTimeout(function(){
                        isScrolling = false;
                    }, 100);
                }

                if(options.fitToSection){
                    //for the auto adjust of the viewport to fit a whole section
                    clearTimeout(scrollId2);

                    scrollId2 = setTimeout(function(){
                        //checking it again in case it changed during the delay
                        if(options.fitToSection &&

                            //is the destination element bigger than the viewport?
                            $(SECTION_ACTIVE_SEL)[0].offsetHeight <= windowsHeight
                        ){
                            fitToSection();
                        }
                    }, options.fitToSectionDelay);
                }
            }
        }

        /**
        * Fits the site to the nearest active section
        */
        function fitToSection(){
            //checking fitToSection again in case it was set to false before the timeout delay
            if(canScroll){
                //allows to scroll to an active section and
                //if the section is already active, we prevent firing callbacks
                isResizing = true;

                scrollPage($(SECTION_ACTIVE_SEL)[0]);
                isResizing = false;
            }
        }

        /**
        * Determines whether the active section has seen in its whole or not.
        */
        function isCompletelyInViewPort(movement){
            var top = $(SECTION_ACTIVE_SEL)[0].offsetTop;
            var bottom = top + getWindowHeight();

            if(movement == 'up'){
                return bottom >= (getScrollTop() + getWindowHeight());
            }
            return top <= getScrollTop();
        }

        /**
        * Determines whether a section is in the viewport or not.
        */
        function isSectionInViewport (el) {
            var rect = el.getBoundingClientRect();
            var top = rect.top;
            var bottom = rect.bottom;

            //sometimes there's a 1px offset on the bottom of the screen even when the 
            //section's height is the window.innerHeight one. I guess because pixels won't allow decimals.
            //using this prevents from lazyLoading the section that is not yet visible 
            //(only 1 pixel offset is)
            var pixelOffset = 2;
            
            var isTopInView = top + pixelOffset < windowsHeight && top > 0;
            var isBottomInView = bottom > pixelOffset && bottom < windowsHeight;

            return isTopInView || isBottomInView;
        }

        /**
        * Gets the directon of the the scrolling fired by the scroll event.
        */
        function getScrollDirection(currentScroll){
            var direction = currentScroll > lastScroll ? 'down' : 'up';

            lastScroll = currentScroll;

            //needed for auto-height sections to determine if we want to scroll to the top or bottom of the destination
            previousDestTop = currentScroll;

            return direction;
        }

        /**
        * Determines the way of scrolling up or down:
        * by 'automatically' scrolling a section or by using the default and normal scrolling.
        */
        function scrolling(type){
            if (!isScrollAllowed.m[type]){
                return;
            }

            var scrollSection = (type === 'down') ? moveSectionDown : moveSectionUp;

            if(options.scrollOverflow){
                var scrollable = options.scrollOverflowHandler.scrollable($(SECTION_ACTIVE_SEL)[0]);
                var check = (type === 'down') ? 'bottom' : 'top';

                if(scrollable != null ){
                    //is the scrollbar at the start/end of the scroll?
                    if(options.scrollOverflowHandler.isScrolled(check, scrollable)){
                        scrollSection();
                    }else{
                        return true;
                    }
                }else{
                    // moved up/down
                    scrollSection();
                }
            }else{
                // moved up/down
                scrollSection();
            }
        }

        /*
        * Preventing bouncing in iOS #2285
        */
        function preventBouncing(e){
            if(options.autoScrolling && isReallyTouch(e) && isScrollAllowed.m.up){
                //preventing the easing on iOS devices
                preventDefault(e);
            }
        }

        var touchStartY = 0;
        var touchStartX = 0;
        var touchEndY = 0;
        var touchEndX = 0;

        /* Detecting touch events

        * As we are changing the top property of the page on scrolling, we can not use the traditional way to detect it.
        * This way, the touchstart and the touch moves shows an small difference between them which is the
        * used one to determine the direction.
        */
        function touchMoveHandler(e){
            var activeSection = closest(e.target, SECTION_SEL) || $(SECTION_ACTIVE_SEL)[0];

            if (isReallyTouch(e) ) {

                if(options.autoScrolling){
                    //preventing the easing on iOS devices
                    preventDefault(e);
                }

                var touchEvents = getEventsPage(e);

                touchEndY = touchEvents.y;
                touchEndX = touchEvents.x;

                //if movement in the X axys is greater than in the Y and the currect section has slides...
                if ($(SLIDES_WRAPPER_SEL, activeSection).length && Math.abs(touchStartX - touchEndX) > (Math.abs(touchStartY - touchEndY))) {

                    //is the movement greater than the minimum resistance to scroll?
                    if (!slideMoving && Math.abs(touchStartX - touchEndX) > (getWindowWidth() / 100 * options.touchSensitivity)) {
                        if (touchStartX > touchEndX) {
                            if(isScrollAllowed.m.right){
                                moveSlideRight(activeSection); //next
                            }
                        } else {
                            if(isScrollAllowed.m.left){
                                moveSlideLeft(activeSection); //prev
                            }
                        }
                    }
                }

                //vertical scrolling (only when autoScrolling is enabled)
                else if(options.autoScrolling && canScroll){

                    //is the movement greater than the minimum resistance to scroll?
                    if (Math.abs(touchStartY - touchEndY) > (window.innerHeight / 100 * options.touchSensitivity)) {
                        if (touchStartY > touchEndY) {
                            scrolling('down');
                        } else if (touchEndY > touchStartY) {
                            scrolling('up');
                        }
                    }
                }
            }
        }

        /**
        * As IE >= 10 fires both touch and mouse events when using a mouse in a touchscreen
        * this way we make sure that is really a touch event what IE is detecting.
        */
        function isReallyTouch(e){
            //if is not IE   ||  IE is detecting `touch` or `pen`
            return typeof e.pointerType === 'undefined' || e.pointerType != 'mouse';
        }

        /**
        * Handler for the touch start event.
        */
        function touchStartHandler(e){

            //stopping the auto scroll to adjust to a section
            if(options.fitToSection){
                activeAnimation = false;
            }

            if(isReallyTouch(e)){
                var touchEvents = getEventsPage(e);
                touchStartY = touchEvents.y;
                touchStartX = touchEvents.x;
            }
        }

        /**
        * Gets the average of the last `number` elements of the given array.
        */
        function getAverage(elements, number){
            var sum = 0;

            //taking `number` elements from the end to make the average, if there are not enought, 1
            var lastElements = elements.slice(Math.max(elements.length - number, 1));

            for(var i = 0; i < lastElements.length; i++){
                sum = sum + lastElements[i];
            }

            return Math.ceil(sum/number);
        }

        /**
         * Detecting mousewheel scrolling
         *
         * http://blogs.sitepointstatic.com/examples/tech/mouse-wheel/index.html
         * http://www.sitepoint.com/html5-javascript-mouse-wheel/
         */
        var prevTime = new Date().getTime();

        function MouseWheelHandler(e) {
            var curTime = new Date().getTime();
            var isNormalScroll = hasClass($(COMPLETELY_SEL)[0], NORMAL_SCROLL);

            //is scroll allowed?
            if (!isScrollAllowed.m.down && !isScrollAllowed.m.up) {
                preventDefault(e);
                return false;
            }

            //autoscrolling and not zooming?
            if(options.autoScrolling && !controlPressed && !isNormalScroll){
                // cross-browser wheel delta
                e = e || window.event;
                var value = e.wheelDelta || -e.deltaY || -e.detail;
                var delta = Math.max(-1, Math.min(1, value));

                var horizontalDetection = typeof e.wheelDeltaX !== 'undefined' || typeof e.deltaX !== 'undefined';
                var isScrollingVertically = (Math.abs(e.wheelDeltaX) < Math.abs(e.wheelDelta)) || (Math.abs(e.deltaX ) < Math.abs(e.deltaY) || !horizontalDetection);

                //Limiting the array to 150 (lets not waste memory!)
                if(scrollings.length > 149){
                    scrollings.shift();
                }

                //keeping record of the previous scrollings
                scrollings.push(Math.abs(value));

                //preventing to scroll the site on mouse wheel when scrollbar is present
                if(options.scrollBar){
                    preventDefault(e);
                }

                //time difference between the last scroll and the current one
                var timeDiff = curTime-prevTime;
                prevTime = curTime;

                //haven't they scrolled in a while?
                //(enough to be consider a different scrolling action to scroll another section)
                if(timeDiff > 200){
                    //emptying the array, we dont care about old scrollings for our averages
                    scrollings = [];
                }

                if(canScroll){
                    var averageEnd = getAverage(scrollings, 10);
                    var averageMiddle = getAverage(scrollings, 70);
                    var isAccelerating = averageEnd >= averageMiddle;

                    //to avoid double swipes...
                    if(isAccelerating && isScrollingVertically){
                        //scrolling down?
                        if (delta < 0) {
                            scrolling('down');

                        //scrolling up?
                        }else {
                            scrolling('up');
                        }
                    }
                }

                return false;
            }

            if(options.fitToSection){
                //stopping the auto scroll to adjust to a section
                activeAnimation = false;
            }
        }

        /**
        * Slides a slider to the given direction.
        * Optional `section` param.
        */
        function moveSlide(direction, section){
            var activeSection = section == null ? $(SECTION_ACTIVE_SEL)[0] : section;
            var slides = $(SLIDES_WRAPPER_SEL, activeSection)[0];

            // more than one slide needed and nothing should be sliding
            if (slides == null || slideMoving || $(SLIDE_SEL, slides).length < 2) {
                return;
            }

            var currentSlide = $(SLIDE_ACTIVE_SEL, slides)[0];
            var destiny = null;

            if(direction === 'left'){
                destiny = prevUntil(currentSlide, SLIDE_SEL);
            }else{
                destiny = nextUntil(currentSlide, SLIDE_SEL);
            }

            //isn't there a next slide in the secuence?
            if(destiny == null){
                //respect loopHorizontal settin
                if (!options.loopHorizontal) return;

                var slideSiblings = siblings(currentSlide);
                if(direction === 'left'){
                    destiny = slideSiblings[slideSiblings.length - 1]; //last
                }else{
                    destiny = slideSiblings[0]; //first
                }
            }

            slideMoving = true && !FP.test.isTesting;
            landscapeScroll(slides, destiny, direction);
        }

        /**
        * Maintains the active slides in the viewport
        * (Because the `scroll` animation might get lost with some actions, such as when using continuousVertical)
        */
        function keepSlidesPosition(){
            var activeSlides = $(SLIDE_ACTIVE_SEL);
            for( var i =0; i<activeSlides.length; i++){
                silentLandscapeScroll(activeSlides[i], 'internal');
            }
        }

        var previousDestTop = 0;
        /**
        * Returns the destination Y position based on the scrolling direction and
        * the height of the section.
        */
        function getDestinationPosition(element){
            var elementHeight = element.offsetHeight;
            var elementTop = element.offsetTop;

            //top of the desination will be at the top of the viewport
            var position = elementTop;
            var isScrollingDown =  elementTop > previousDestTop;
            var sectionBottom = position - windowsHeight + elementHeight;
            var bigSectionsDestination = options.bigSectionsDestination;

            //is the destination element bigger than the viewport?
            if(elementHeight > windowsHeight){
                //scrolling up?
                if(!isScrollingDown && !bigSectionsDestination || bigSectionsDestination === 'bottom' ){
                    position = sectionBottom;
                }
            }

            //sections equal or smaller than the viewport height && scrolling down? ||  is resizing and its in the last section
            else if(isScrollingDown || (isResizing && next(element) == null) ){
                //The bottom of the destination will be at the bottom of the viewport
                position = sectionBottom;
            }

            /*
            Keeping record of the last scrolled position to determine the scrolling direction.
            No conventional methods can be used as the scroll bar might not be present
            AND the section might not be active if it is auto-height and didnt reach the middle
            of the viewport.
            */
            previousDestTop = position;
            return position;
        }

        /**
        * Scrolls the site to the given element and scrolls to the slide if a callback is given.
        */
        function scrollPage(element, callback, isMovementUp){
            if(element == null){ return; } //there's no element to scroll, leaving the function

            var dtop = getDestinationPosition(element);
            var slideAnchorLink;
            var slideIndex;

            //local variables
            var v = {
                element: element,
                callback: callback,
                isMovementUp: isMovementUp,
                dtop: dtop,
                yMovement: getYmovement(element),
                anchorLink: element.getAttribute('data-anchor'),
                sectionIndex: index(element, SECTION_SEL),
                activeSlide: $(SLIDE_ACTIVE_SEL, element)[0],
                activeSection: $(SECTION_ACTIVE_SEL)[0],
                leavingSection: index($(SECTION_ACTIVE_SEL), SECTION_SEL) + 1,

                //caching the value of isResizing at the momment the function is called
                //because it will be checked later inside a setTimeout and the value might change
                localIsResizing: isResizing
            };

            //quiting when destination scroll is the same as the current one
            if((v.activeSection == element && !isResizing) || (options.scrollBar && getScrollTop() === v.dtop && !hasClass(element, AUTO_HEIGHT) )){ return; }

            if(v.activeSlide != null){
                slideAnchorLink = v.activeSlide.getAttribute('data-anchor');
                slideIndex = index(v.activeSlide);
            }

            //callback (onLeave) if the site is not just resizing and readjusting the slides
            if(!v.localIsResizing){
                var direction = v.yMovement;

                //required for continousVertical
                if(typeof isMovementUp !== 'undefined'){
                    direction = isMovementUp ? 'up' : 'down';
                }

                //for the callback
                v.direction = direction;

                if(isFunction(options.onLeave)){
                    if(fireCallback('onLeave', v) === false){
                        return;
                    }
                }
            }

            // If continuousVertical && we need to wrap around
            if (options.autoScrolling && options.continuousVertical && typeof (v.isMovementUp) !== "undefined" &&
                ((!v.isMovementUp && v.yMovement == 'up') || // Intending to scroll down but about to go up or
                (v.isMovementUp && v.yMovement == 'down'))) { // intending to scroll up but about to go down

                v = createInfiniteSections(v);
            }

            //pausing media of the leaving section (if we are not just resizing, as destinatino will be the same one)
            if(!v.localIsResizing){
                stopMedia(v.activeSection);
            }

            if(options.scrollOverflow){
                options.scrollOverflowHandler.beforeLeave();
            }

            addClass(element, ACTIVE);
            removeClass(siblings(element), ACTIVE);
            lazyLoad(element);

            if(options.scrollOverflow){
                options.scrollOverflowHandler.onLeave();
            }

            //preventing from activating the MouseWheelHandler event
            //more than once if the page is scrolling
            canScroll = false || FP.test.isTesting;

            setState(slideIndex, slideAnchorLink, v.anchorLink, v.sectionIndex);

            performMovement(v);

            //flag to avoid callingn `scrollPage()` twice in case of using anchor links
            lastScrolledDestiny = v.anchorLink;

            //avoid firing it twice (as it does also on scroll)
            activateMenuAndNav(v.anchorLink, v.sectionIndex);
        }

        /**
        * Dispatch events & callbacks making sure it does it on the right format, depending on
        * whether v2compatible is being used or not.
        */
        function fireCallback(eventName, v){
            var eventData = getEventData(eventName, v);

            if(!options.v2compatible){
                trigger(container, eventName, eventData);

                if(options[eventName].apply(eventData[Object.keys(eventData)[0]], toArray(eventData)) === false){
                    return false;
                }
            }
            else{
                if(options[eventName].apply(eventData[0], eventData.slice(1)) === false){
                    return false;
                }
            }

            return true;
        }

        /**
        * Makes sure to only create a Panel object if the element exist
        */
        function nullOrSection(el){
            return el ? new Section(el) : null;
        }

        function nullOrSlide(el){
            return el ? new Slide(el) : null;
        }

        /**
        * Gets the event's data for the given event on the right format. Depending on whether
        * v2compatible is being used or not.
        */
        function getEventData(eventName, v){
            var paramsPerEvent;

            if(!options.v2compatible){

                //using functions to run only the necessary bits within the object
                paramsPerEvent = {
                    afterRender: function(){
                        return {
                            section: nullOrSection($(SECTION_ACTIVE_SEL)[0]),
                            slide: nullOrSlide($(SLIDE_ACTIVE_SEL, $(SECTION_ACTIVE_SEL)[0])[0])
                        };
                    },
                    onLeave: function(){
                        return {
                            origin: nullOrSection(v.activeSection),
                            destination: nullOrSection(v.element),
                            direction: v.direction
                        };
                    },

                    afterLoad: function(){
                        return paramsPerEvent.onLeave();
                    },

                    afterSlideLoad: function(){
                        return {
                            section: nullOrSection(v.section),
                            origin: nullOrSlide(v.prevSlide),
                            destination: nullOrSlide(v.destiny),
                            direction: v.direction
                        };
                    },

                    onSlideLeave: function(){
                        return paramsPerEvent.afterSlideLoad();
                    }
                };
            }
            else{
                paramsPerEvent = {
                    afterRender: function(){ return [container]; },
                    onLeave: function(){ return [v.activeSection, v.leavingSection, (v.sectionIndex + 1), v.direction]; },
                    afterLoad: function(){ return [v.element, v.anchorLink, (v.sectionIndex + 1)]; },
                    afterSlideLoad: function(){ return [v.destiny, v.anchorLink, (v.sectionIndex + 1), v.slideAnchor, v.slideIndex]; },
                    onSlideLeave: function(){ return [v.prevSlide, v.anchorLink, (v.sectionIndex + 1), v.prevSlideIndex, v.direction, v.slideIndex]; },
                };
            }

            return paramsPerEvent[eventName]();
        }

        /**
        * Performs the vertical movement (by CSS3 or by jQuery)
        */
        function performMovement(v){
            // using CSS3 translate functionality
            if (options.css3 && options.autoScrolling && !options.scrollBar) {

                // The first section can have a negative value in iOS 10. Not quite sure why: -0.0142822265625
                // that's why we round it to 0.
                var translate3d = 'translate3d(0px, -' + Math.round(v.dtop) + 'px, 0px)';
                transformContainer(translate3d, true);

                //even when the scrollingSpeed is 0 there's a little delay, which might cause the
                //scrollingSpeed to change in case of using silentMoveTo();
                if(options.scrollingSpeed){
                    clearTimeout(afterSectionLoadsId);
                    afterSectionLoadsId = setTimeout(function () {
                        afterSectionLoads(v);
                    }, options.scrollingSpeed);
                }else{
                    afterSectionLoads(v);
                }
            }

            // using JS to animate
            else{
                var scrollSettings = getScrollSettings(v.dtop);
                FP.test.top = -v.dtop + 'px';

                scrollTo(scrollSettings.element, scrollSettings.options, options.scrollingSpeed, function(){
                    if(options.scrollBar){

                        /* Hack!
                        The timeout prevents setting the most dominant section in the viewport as "active" when the user
                        scrolled to a smaller section by using the mousewheel (auto scrolling) rather than draging the scroll bar.

                        When using scrollBar:true It seems like the scroll events still getting propagated even after the scrolling animation has finished.
                        */
                        setTimeout(function(){
                            afterSectionLoads(v);
                        },30);
                    }else{
                        afterSectionLoads(v);
                    }
                });
            }
        }

        /**
        * Gets the scrolling settings depending on the plugin autoScrolling option
        */
        function getScrollSettings(top){
            var scroll = {};

            //top property animation
            if(options.autoScrolling && !options.scrollBar){
                scroll.options = -top;
                scroll.element = $(WRAPPER_SEL)[0];
            }

            //window real scrolling
            else{
                scroll.options = top;
                scroll.element = window;
            }

            return scroll;
        }

        /**
        * Adds sections before or after the current one to create the infinite effect.
        */
        function createInfiniteSections(v){
            // Scrolling down
            if (!v.isMovementUp) {
                // Move all previous sections to after the active section
                after($(SECTION_ACTIVE_SEL)[0], prevAll(v.activeSection, SECTION_SEL).reverse());
            }
            else { // Scrolling up
                // Move all next sections to before the active section
                before($(SECTION_ACTIVE_SEL)[0], nextAll(v.activeSection, SECTION_SEL));
            }

            // Maintain the displayed position (now that we changed the element order)
            silentScroll($(SECTION_ACTIVE_SEL)[0].offsetTop);

            // Maintain the active slides visible in the viewport
            keepSlidesPosition();

            // save for later the elements that still need to be reordered
            v.wrapAroundElements = v.activeSection;

            // Recalculate animation variables
            v.dtop = v.element.offsetTop;
            v.yMovement = getYmovement(v.element);

            return v;
        }

        /**
        * Fix section order after continuousVertical changes have been animated
        */
        function continuousVerticalFixSectionOrder (v) {
            // If continuousVertical is in effect (and autoScrolling would also be in effect then),
            // finish moving the elements around so the direct navigation will function more simply
            if (v.wrapAroundElements == null) {
                return;
            }

            if (v.isMovementUp) {
                before($(SECTION_SEL)[0], v.wrapAroundElements);
            }
            else {
                after($(SECTION_SEL)[$(SECTION_SEL).length-1], v.wrapAroundElements);
            }

            silentScroll($(SECTION_ACTIVE_SEL)[0].offsetTop);

            // Maintain the active slides visible in the viewport
            keepSlidesPosition();
        }

        /**
        * Actions to do once the section is loaded.
        */
        function afterSectionLoads (v){
            continuousVerticalFixSectionOrder(v);

            //callback (afterLoad) if the site is not just resizing and readjusting the slides
            if(isFunction(options.afterLoad) && !v.localIsResizing){
                fireCallback('afterLoad', v);
            }

            if(options.scrollOverflow){
                options.scrollOverflowHandler.afterLoad();
            }

            if(!v.localIsResizing){
                playMedia(v.element);
            }

            addClass(v.element, COMPLETELY);
            removeClass(siblings(v.element), COMPLETELY);
            lazyLoadOthers();

            canScroll = true;

            if(isFunction(v.callback)){
                v.callback();
            }
        }

        /**
        * Sets the value for the given attribute from the `data-` attribute with the same suffix
        * ie: data-srcset ==> srcset  |  data-src ==> src
        */
        function setSrc(element, attribute){
            element.setAttribute(attribute, element.getAttribute('data-' + attribute));
            element.removeAttribute('data-' + attribute);
        }

        /**
        * Makes sure lazyload is done for other sections in the viewport that are not the
        * active one. 
        */
        function lazyLoadOthers(){
            var hasAutoHeightSections = $(AUTO_HEIGHT_SEL)[0] || isResponsiveMode() && $(AUTO_HEIGHT_RESPONSIVE_SEL)[0];

            //quitting when it doesn't apply
            if (!options.lazyLoading || !hasAutoHeightSections){
                return;
            }

            //making sure to lazy load auto-height sections that are in the viewport
            $(SECTION_SEL + ':not(' + ACTIVE_SEL + ')').forEach(function(section){
                if(isSectionInViewport(section)){
                    lazyLoad(section);
                }
            });
        }

        /**
        * Lazy loads image, video and audio elements.
        */
        function lazyLoad(destiny){
            if (!options.lazyLoading){
                return;
            }

            var panel = getSlideOrSection(destiny);

            $('img[data-src], img[data-srcset], source[data-src], source[data-srcset], video[data-src], audio[data-src], iframe[data-src]', panel).forEach(function(element){
                ['src', 'srcset'].forEach(function(type){
                    var attribute = element.getAttribute('data-' + type);
                    if(attribute != null && attribute){
                        setSrc(element, type);
                        element.addEventListener('load', function(){
                            onMediaLoad(destiny);
                        });
                    }
                });

                if(matches(element, 'source')){
                    var elementToPlay =  closest(element, 'video, audio');
                    if(elementToPlay){
                        elementToPlay.load();
                        elementToPlay.onloadeddata = function(){
                            onMediaLoad(destiny);
                        };
                    }
                }
            });
        }

        /**
        * Callback firing when a lazy load media element has loaded.
        * Making sure it only fires one per section in normal conditions (if load time is not huge)
        */
        function onMediaLoad(section){
            if(options.scrollOverflow){
                clearTimeout(g_mediaLoadedId);
                g_mediaLoadedId = setTimeout(function(){
                    scrollBarHandler.createScrollBar(section);
                }, 200);
            }
        }

        /**
        * Plays video and audio elements.
        */
        function playMedia(destiny){
            var panel = getSlideOrSection(destiny);

            //playing HTML5 media elements
            $('video, audio', panel).forEach(function(element){
                if( element.hasAttribute('data-autoplay') && typeof element.play === 'function' ) {
                    element.play();
                }
            });

            //youtube videos
            $('iframe[src*="youtube.com/embed/"]', panel).forEach(function(element){
                if ( element.hasAttribute('data-autoplay') ){
                    playYoutube(element);
                }

                //in case the URL was not loaded yet. On page load we need time for the new URL (with the API string) to load.
                element.onload = function() {
                    if ( element.hasAttribute('data-autoplay') ){
                        playYoutube(element);
                    }
                };
            });
        }

        /**
        * Plays a youtube video
        */
        function playYoutube(element){
            element.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        }

        /**
        * Stops video and audio elements.
        */
        function stopMedia(destiny){
            var panel = getSlideOrSection(destiny);

            //stopping HTML5 media elements
            $('video, audio', panel).forEach(function(element){
                if( !element.hasAttribute('data-keepplaying') && typeof element.pause === 'function' ) {
                    element.pause();
                }
            });

            //youtube videos
            $('iframe[src*="youtube.com/embed/"]', panel).forEach(function(element){
                if( /youtube\.com\/embed\//.test(element.getAttribute('src')) && !element.hasAttribute('data-keepplaying')){
                    element.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}','*');
                }
            });
        }

        /**
        * Gets the active slide (or section) for the given section
        */
        function getSlideOrSection(destiny){
            var slide = $(SLIDE_ACTIVE_SEL, destiny);
            if( slide.length ) {
                destiny = slide[0];
            }

            return destiny;
        }

        /**
        * Scrolls to the anchor in the URL when loading the site
        */
        function scrollToAnchor(){
            var anchors =  getAnchorsURL();
            var sectionAnchor = anchors.section;
            var slideAnchor = anchors.slide;

            if(sectionAnchor){  //if theres any #
                if(options.animateAnchor){
                    scrollPageAndSlide(sectionAnchor, slideAnchor);
                }else{
                    silentMoveTo(sectionAnchor, slideAnchor);
                }
            }
        }

        /**
        * Detecting any change on the URL to scroll to the given anchor link
        * (a way to detect back history button as we play with the hashes on the URL)
        */
        function hashChangeHandler(){
            if(!isScrolling && !options.lockAnchors){
                var anchors = getAnchorsURL();
                var sectionAnchor = anchors.section;
                var slideAnchor = anchors.slide;

                //when moving to a slide in the first section for the first time (first time to add an anchor to the URL)
                var isFirstSlideMove =  (typeof lastScrolledDestiny === 'undefined');
                var isFirstScrollMove = (typeof lastScrolledDestiny === 'undefined' && typeof slideAnchor === 'undefined' && !slideMoving);

                if(sectionAnchor && sectionAnchor.length){
                    /*in order to call scrollpage() only once for each destination at a time
                    It is called twice for each scroll otherwise, as in case of using anchorlinks `hashChange`
                    event is fired on every scroll too.*/
                    if ((sectionAnchor && sectionAnchor !== lastScrolledDestiny) && !isFirstSlideMove
                        || isFirstScrollMove
                        || (!slideMoving && lastScrolledSlide != slideAnchor )){

                        scrollPageAndSlide(sectionAnchor, slideAnchor);
                    }
                }
            }
        }

        //gets the URL anchors (section and slide)
        function getAnchorsURL(){
            var section;
            var slide;
            var hash = window.location.hash;

            if(hash.length){
                //getting the anchor link in the URL and deleting the `#`
                var anchorsParts =  hash.replace('#', '').split('/');

                //using / for visual reasons and not as a section/slide separator #2803
                var isFunkyAnchor = hash.indexOf('#/') > -1;

                section = isFunkyAnchor ? '/' + anchorsParts[1] : decodeURIComponent(anchorsParts[0]);

                var slideAnchor = isFunkyAnchor ? anchorsParts[2] : anchorsParts[1];
                if(slideAnchor && slideAnchor.length){
                    slide = decodeURIComponent(slideAnchor);
                }
            }

            return {
                section: section,
                slide: slide
            };
        }

        //Sliding with arrow keys, both, vertical and horizontal
        function keydownHandler(e) {
            clearTimeout(keydownId);

            var activeElement = document.activeElement;
            var keyCode = e.keyCode;

            //tab?
            if(keyCode === 9){
                onTab(e);
            }

            else if(!matches(activeElement, 'textarea') && !matches(activeElement, 'input') && !matches(activeElement, 'select') &&
                activeElement.getAttribute('contentEditable') !== "true" && activeElement.getAttribute('contentEditable') !== '' &&
                options.keyboardScrolling && options.autoScrolling){

                //preventing the scroll with arrow keys & spacebar & Page Up & Down keys
                var keyControls = [40, 38, 32, 33, 34];
                if(keyControls.indexOf(keyCode) > -1){
                    preventDefault(e);
                }

                controlPressed = e.ctrlKey;

                keydownId = setTimeout(function(){
                    onkeydown(e);
                },150);
            }
        }

        function tooltipTextHandler(){
            /*jshint validthis:true */
            trigger(prev(this), 'click');
        }

        //to prevent scrolling while zooming
        function keyUpHandler(e){
            if(isWindowFocused){ //the keyup gets fired on new tab ctrl + t in Firefox
                controlPressed = e.ctrlKey;
            }
        }

        //binding the mousemove when the mouse's middle button is released
        function mouseDownHandler(e){
            //middle button
            if (e.which == 2){
                oldPageY = e.pageY;
                container.addEventListener('mousemove', mouseMoveHandler);
            }
        }

        //unbinding the mousemove when the mouse's middle button is released
        function mouseUpHandler(e){
            //middle button
            if (e.which == 2){
                container.removeEventListener('mousemove', mouseMoveHandler);
            }
        }

        /**
        * Makes sure the tab key will only focus elements within the current section/slide
        * preventing this way from breaking the page.
        * Based on "Modals and keyboard traps"
        * from https://developers.google.com/web/fundamentals/accessibility/focus/using-tabindex
        */
        function onTab(e){
            var isShiftPressed = e.shiftKey;
            var activeElement = document.activeElement;
            var focusableElements = getFocusables(getSlideOrSection($(SECTION_ACTIVE_SEL)[0]));

            function preventAndFocusFirst(e){
                preventDefault(e);
                return focusableElements[0] ? focusableElements[0].focus() : null;
            }

            //outside any section or slide? Let's not hijack the tab!
            if(isFocusOutside(e)){
                return;
            }

            //is there an element with focus?
            if(activeElement){
                if(closest(activeElement, SECTION_ACTIVE_SEL + ',' + SECTION_ACTIVE_SEL + ' ' + SLIDE_ACTIVE_SEL) == null){
                    activeElement = preventAndFocusFirst(e);
                }
            }

            //no element if focused? Let's focus the first one of the section/slide
            else{
                preventAndFocusFirst(e);
            }

            //when reached the first or last focusable element of the section/slide
            //we prevent the tab action to keep it in the last focusable element
            if(!isShiftPressed && activeElement == focusableElements[focusableElements.length - 1] ||
                isShiftPressed && activeElement == focusableElements[0]
            ){
                preventDefault(e);
            }
        }

        /**
        * Gets all the focusable elements inside the passed element.
        */
        function getFocusables(el){
            return [].slice.call($(focusableElementsString, el)).filter(function(item) {
                    return item.getAttribute('tabindex') !== '-1'
                    //are also not hidden elements (or with hidden parents)
                    && item.offsetParent !== null;
            });
        }

        /**
        * Determines whether the focus is outside fullpage.js sections/slides or not.
        */
        function isFocusOutside(e){
            var allFocusables = getFocusables(document);
            var currentFocusIndex = allFocusables.indexOf(document.activeElement);
            var focusDestinationIndex = e.shiftKey ? currentFocusIndex - 1 : currentFocusIndex + 1;
            var focusDestination = allFocusables[focusDestinationIndex];
            var destinationItemSlide = nullOrSlide(closest(focusDestination, SLIDE_SEL));
            var destinationItemSection = nullOrSection(closest(focusDestination, SECTION_SEL));

            return !destinationItemSlide && !destinationItemSection;
        }

        //Scrolling horizontally when clicking on the slider controls.
        function slideArrowHandler(){
            /*jshint validthis:true */
            var section = closest(this, SECTION_SEL);

            /*jshint validthis:true */
            if (hasClass(this, SLIDES_PREV)) {
                if(isScrollAllowed.m.left){
                    moveSlideLeft(section);
                }
            } else {
                if(isScrollAllowed.m.right){
                    moveSlideRight(section);
                }
            }
        }

        //when opening a new tab (ctrl + t), `control` won't be pressed when coming back.
        function blurHandler(){
            isWindowFocused = false;
            controlPressed = false;
        }

        //Scrolls to the section when clicking the navigation bullet
        function sectionBulletHandler(e){
            preventDefault(e);

            /*jshint validthis:true */
            var indexBullet = index(closest(this, SECTION_NAV_SEL + ' li'));
            scrollPage($(SECTION_SEL)[indexBullet]);
        }

        //Scrolls the slider to the given slide destination for the given section
        function slideBulletHandler(e){
            preventDefault(e);

            /*jshint validthis:true */
            var slides = $(SLIDES_WRAPPER_SEL, closest(this, SECTION_SEL))[0];
            var destiny = $(SLIDE_SEL, slides)[index(closest(this, 'li'))];

            landscapeScroll(slides, destiny);
        }

        //Menu item handler when not using anchors or using lockAnchors:true
        function menuItemsHandler(e){
            if($(options.menu)[0] && (options.lockAnchors || !options.anchors.length)){
                preventDefault(e);
                /*jshint validthis:true */
                moveTo(this.getAttribute('data-menuanchor'));
            }
        }

        /**
        * Keydown event
        */
        function onkeydown(e){
            var shiftPressed = e.shiftKey;
            var activeElement = document.activeElement;
            var isMediaFocused = matches(activeElement, 'video') || matches(activeElement, 'audio');

            //do nothing if we can not scroll or we are not using horizotnal key arrows.
            if(!canScroll && [37,39].indexOf(e.keyCode) < 0){
                return;
            }

            switch (e.keyCode) {
                //up
                case 38:
                case 33:
                    if(isScrollAllowed.k.up){
                        moveSectionUp();
                    }
                    break;

                //down
                case 32: //spacebar

                    if(shiftPressed && isScrollAllowed.k.up && !isMediaFocused){
                        moveSectionUp();
                        break;
                    }
                /* falls through */
                case 40:
                case 34:
                    if(isScrollAllowed.k.down){
                        // space bar?
                        if(e.keyCode !== 32 || !isMediaFocused){
                            moveSectionDown();
                        }
                    }
                    break;

                //Home
                case 36:
                    if(isScrollAllowed.k.up){
                        moveTo(1);
                    }
                    break;

                //End
                case 35:
                     if(isScrollAllowed.k.down){
                        moveTo( $(SECTION_SEL).length );
                    }
                    break;

                //left
                case 37:
                    if(isScrollAllowed.k.left){
                        moveSlideLeft();
                    }
                    break;

                //right
                case 39:
                    if(isScrollAllowed.k.right){
                        moveSlideRight();
                    }
                    break;

                default:
                    return; // exit this handler for other keys
            }
        }

        /**
        * Detecting the direction of the mouse movement.
        * Used only for the middle button of the mouse.
        */
        var oldPageY = 0;
        function mouseMoveHandler(e){
            if(!options.autoScrolling){
                return;
            }
            if(canScroll){
                // moving up
                if (e.pageY < oldPageY && isScrollAllowed.m.up){
                    moveSectionUp();
                }

                // moving down
                else if(e.pageY > oldPageY && isScrollAllowed.m.down){
                    moveSectionDown();
                }
            }
            oldPageY = e.pageY;
        }

        /**
        * Scrolls horizontal sliders.
        */
        function landscapeScroll(slides, destiny, direction){
            var section = closest(slides, SECTION_SEL);
            var v = {
                slides: slides,
                destiny: destiny,
                direction: direction,
                destinyPos: {left: destiny.offsetLeft},
                slideIndex: index(destiny),
                section: section,
                sectionIndex: index(section, SECTION_SEL),
                anchorLink: section.getAttribute('data-anchor'),
                slidesNav: $(SLIDES_NAV_SEL, section)[0],
                slideAnchor: getAnchor(destiny),
                prevSlide: $(SLIDE_ACTIVE_SEL, section)[0],
                prevSlideIndex: index($(SLIDE_ACTIVE_SEL, section)[0]),

                //caching the value of isResizing at the momment the function is called
                //because it will be checked later inside a setTimeout and the value might change
                localIsResizing: isResizing
            };
            v.xMovement = getXmovement(v.prevSlideIndex, v.slideIndex);
            v.direction = v.direction ? v.direction : v.xMovement;

            //important!! Only do it when not resizing
            if(!v.localIsResizing){
                //preventing from scrolling to the next/prev section when using scrollHorizontally
                canScroll = false;
            }

            if(options.onSlideLeave){

                //if the site is not just resizing and readjusting the slides
                if(!v.localIsResizing && v.xMovement!=='none'){
                    if(isFunction( options.onSlideLeave )){
                        if( fireCallback('onSlideLeave', v) === false){
                            slideMoving = false;
                            return;
                        }
                    }
                }
            }

            addClass(destiny, ACTIVE);
            removeClass(siblings(destiny), ACTIVE);

            if(!v.localIsResizing){
                stopMedia(v.prevSlide);
                lazyLoad(destiny);
            }

            if(!options.loopHorizontal && options.controlArrows){
                //hidding it for the fist slide, showing for the rest
                toggle($(SLIDES_ARROW_PREV_SEL, section), v.slideIndex!==0);

                //hidding it for the last slide, showing for the rest
                toggle($(SLIDES_ARROW_NEXT_SEL, section), next(destiny) != null);
            }

            //only changing the URL if the slides are in the current section (not for resize re-adjusting)
            if(hasClass(section, ACTIVE) && !v.localIsResizing){
                setState(v.slideIndex, v.slideAnchor, v.anchorLink, v.sectionIndex);
            }

            performHorizontalMove(slides, v, true);
        }


        function afterSlideLoads(v){
            activeSlidesNavigation(v.slidesNav, v.slideIndex);

            //if the site is not just resizing and readjusting the slides
            if(!v.localIsResizing){
                if(isFunction( options.afterSlideLoad )){
                    fireCallback('afterSlideLoad', v);
                }

                //needs to be inside the condition to prevent problems with continuousVertical and scrollHorizontally
                //and to prevent double scroll right after a windows resize
                canScroll = true;

                playMedia(v.destiny);
            }

            //letting them slide again
            slideMoving = false;
        }

        /**
        * Performs the horizontal movement. (CSS3 or jQuery)
        *
        * @param fireCallback {Bool} - determines whether or not to fire the callback
        */
        function performHorizontalMove(slides, v, fireCallback){
            var destinyPos = v.destinyPos;

            if(options.css3){
                var translate3d = 'translate3d(-' + Math.round(destinyPos.left) + 'px, 0px, 0px)';

                FP.test.translate3dH[v.sectionIndex] = translate3d;
                css(addAnimation($(SLIDES_CONTAINER_SEL, slides)), getTransforms(translate3d));

                afterSlideLoadsId = setTimeout(function(){
                    if(fireCallback){
                        afterSlideLoads(v);
                    }
                }, options.scrollingSpeed);
            }else{
                FP.test.left[v.sectionIndex] = Math.round(destinyPos.left);

                scrollTo(slides, Math.round(destinyPos.left), options.scrollingSpeed, function(){
                    if(fireCallback){
                        afterSlideLoads(v);
                    }
                });
            }
        }

        /**
        * Sets the state for the horizontal bullet navigations.
        */
        function activeSlidesNavigation(slidesNav, slideIndex){
            if(options.slidesNavigation && slidesNav != null){
                removeClass($(ACTIVE_SEL, slidesNav), ACTIVE);
                addClass( $('a', $('li', slidesNav)[slideIndex] ), ACTIVE);
            }
        }

        var previousHeight = windowsHeight;

        /*
        * Resize event handler.
        */        
        function resizeHandler(){
            clearTimeout(resizeId);

            //in order to call the functions only when the resize is finished
            //http://stackoverflow.com/questions/4298612/jquery-how-to-call-resize-event-only-once-its-finished-resizing    
            resizeId = setTimeout(function(){

                //issue #3336 
                //(some apps or browsers, like Chrome/Firefox for Mobile take time to report the real height)
                //so we check it 3 times with intervals in that case
                for(var i = 0; i< 4; i++){
                    resizeHandlerId = setTimeout(resizeActions, 200 * i);
                }
            }, 200);
        }

        /**
        * When resizing the site, we adjust the heights of the sections, slimScroll...
        */
        function resizeActions(){

            //checking if it needs to get responsive
            responsive();

            // rebuild immediately on touch devices
            if (isTouchDevice) {
                var activeElement = document.activeElement;

                //if the keyboard is NOT visible
                if (!matches(activeElement, 'textarea') && !matches(activeElement, 'input') && !matches(activeElement, 'select')) {
                    var currentHeight = getWindowHeight();

                    //making sure the change in the viewport size is enough to force a rebuild. (20 % of the window to avoid problems when hidding scroll bars)
                    if( Math.abs(currentHeight - previousHeight) > (20 * Math.max(previousHeight, currentHeight) / 100) ){
                        reBuild(true);
                        previousHeight = currentHeight;
                    }
                }
            }
            else{
                adjustToNewViewport();
            }
        }

        /**
        * Checks if the site needs to get responsive and disables autoScrolling if so.
        * A class `fp-responsive` is added to the plugin's container in case the user wants to use it for his own responsive CSS.
        */
        function responsive(){
            var widthLimit = options.responsive || options.responsiveWidth; //backwards compatiblity
            var heightLimit = options.responsiveHeight;

            //only calculating what we need. Remember its called on the resize event.
            var isBreakingPointWidth = widthLimit && window.innerWidth < widthLimit;
            var isBreakingPointHeight = heightLimit && window.innerHeight < heightLimit;

            if(widthLimit && heightLimit){
                setResponsive(isBreakingPointWidth || isBreakingPointHeight);
            }
            else if(widthLimit){
                setResponsive(isBreakingPointWidth);
            }
            else if(heightLimit){
                setResponsive(isBreakingPointHeight);
            }
        }

        /**
        * Adds transition animations for the given element
        */
        function addAnimation(element){
            var transition = 'all ' + options.scrollingSpeed + 'ms ' + options.easingcss3;

            removeClass(element, NO_TRANSITION);
            return css(element, {
                '-webkit-transition': transition,
                'transition': transition
            });
        }

        /**
        * Remove transition animations for the given element
        */
        function removeAnimation(element){
            return addClass(element, NO_TRANSITION);
        }

        /**
        * Activating the vertical navigation bullets according to the given slide name.
        */
        function activateNavDots(name, sectionIndex){
            if(options.navigation && $(SECTION_NAV_SEL)[0] != null){
                    removeClass($(ACTIVE_SEL, $(SECTION_NAV_SEL)[0]), ACTIVE);
                if(name){
                    addClass( $('a[href="#' + name + '"]', $(SECTION_NAV_SEL)[0]), ACTIVE);
                }else{
                    addClass($('a', $('li', $(SECTION_NAV_SEL)[0])[sectionIndex]), ACTIVE);
                }
            }
        }

        /**
        * Activating the website main menu elements according to the given slide name.
        */
        function activateMenuElement(name){
            $(options.menu).forEach(function(menu) {
                if(options.menu && menu != null){
                    removeClass($(ACTIVE_SEL, menu), ACTIVE);
                    addClass($('[data-menuanchor="'+name+'"]', menu), ACTIVE);
                }
            });
        }

        /**
        * Sets to active the current menu and vertical nav items.
        */
        function activateMenuAndNav(anchor, index){
            activateMenuElement(anchor);
            activateNavDots(anchor, index);
        }

        /**
        * Retuns `up` or `down` depending on the scrolling movement to reach its destination
        * from the current section.
        */
        function getYmovement(destiny){
            var fromIndex = index($(SECTION_ACTIVE_SEL)[0], SECTION_SEL);
            var toIndex = index(destiny, SECTION_SEL);
            if( fromIndex == toIndex){
                return 'none';
            }
            if(fromIndex > toIndex){
                return 'up';
            }
            return 'down';
        }

        /**
        * Retuns `right` or `left` depending on the scrolling movement to reach its destination
        * from the current slide.
        */
        function getXmovement(fromIndex, toIndex){
            if( fromIndex == toIndex){
                return 'none';
            }
            if(fromIndex > toIndex){
                return 'left';
            }
            return 'right';
        }

        function addTableClass(element){
            //In case we are styling for the 2nd time as in with reponsiveSlides
            if(!hasClass(element, TABLE)){
                var wrapper = document.createElement('div');
                wrapper.className = TABLE_CELL;
                wrapper.style.height = getTableHeight(element) + 'px';

                addClass(element, TABLE);
                wrapInner(element, wrapper);
            }
        }

        function getTableHeight(element){
            var sectionHeight = windowsHeight;

            if(options.paddingTop || options.paddingBottom){
                var section = element;
                if(!hasClass(section, SECTION)){
                    section = closest(element, SECTION_SEL);
                }

                var paddings = parseInt(getComputedStyle(section)['padding-top']) + parseInt(getComputedStyle(section)['padding-bottom']);
                sectionHeight = (windowsHeight - paddings);
            }

            return sectionHeight;
        }

        /**
        * Adds a css3 transform property to the container class with or without animation depending on the animated param.
        */
        function transformContainer(translate3d, animated){
            if(animated){
                addAnimation(container);
            }else{
                removeAnimation(container);
            }

            css(container, getTransforms(translate3d));
            FP.test.translate3d = translate3d;

            //syncronously removing the class after the animation has been applied.
            setTimeout(function(){
                removeClass(container, NO_TRANSITION);
            },10);
        }

        /**
        * Gets a section by its anchor / index
        */
        function getSectionByAnchor(sectionAnchor){
            var section = $(SECTION_SEL + '[data-anchor="'+sectionAnchor+'"]', container)[0];
            if(!section){
                var sectionIndex = typeof sectionAnchor !== 'undefined' ? sectionAnchor -1 : 0;
                section = $(SECTION_SEL)[sectionIndex];
            }

            return section;
        }

        /**
        * Gets a slide inside a given section by its anchor / index
        */
        function getSlideByAnchor(slideAnchor, section){
            var slide = $(SLIDE_SEL + '[data-anchor="'+slideAnchor+'"]', section)[0];
            if(slide == null){
                slideAnchor = typeof slideAnchor !== 'undefined' ? slideAnchor : 0;
                slide = $(SLIDE_SEL, section)[slideAnchor];
            }

            return slide;
        }

        /**
        * Scrolls to the given section and slide anchors
        */
        function scrollPageAndSlide(sectionAnchor, slideAnchor){
            var section = getSectionByAnchor(sectionAnchor);

            //do nothing if there's no section with the given anchor name
            if(section == null) return;

            var slide = getSlideByAnchor(slideAnchor, section);

            //we need to scroll to the section and then to the slide
            if (getAnchor(section) !== lastScrolledDestiny && !hasClass(section, ACTIVE)){
                scrollPage(section, function(){
                    scrollSlider(slide);
                });
            }
            //if we were already in the section
            else{
                scrollSlider(slide);
            }
        }

        /**
        * Scrolls the slider to the given slide destination for the given section
        */
        function scrollSlider(slide){
            if(slide != null){
                landscapeScroll(closest(slide, SLIDES_WRAPPER_SEL), slide);
            }
        }

        /**
        * Creates a landscape navigation bar with dots for horizontal sliders.
        */
        function addSlidesNavigation(section, numSlides){
            appendTo(createElementFromHTML('<div class="' + SLIDES_NAV + '"><ul></ul></div>'), section);
            var nav = $(SLIDES_NAV_SEL, section)[0];

            //top or bottom
            addClass(nav, 'fp-' + options.slidesNavPosition);

            for(var i=0; i< numSlides; i++){
                appendTo(createElementFromHTML('<li><a href="#"><span class="fp-sr-only">'+ getBulletLinkName(i, 'Slide') +'</span><span></span></a></li>'), $('ul', nav)[0] );
            }

            //centering it
            css(nav, {'margin-left': '-' + (nav.innerWidth/2) + 'px'});

            addClass($('a', $('li', nav)[0] ), ACTIVE);
        }


        /**
        * Sets the state of the website depending on the active section/slide.
        * It changes the URL hash when needed and updates the body class.
        */
        function setState(slideIndex, slideAnchor, anchorLink, sectionIndex){
            var sectionHash = '';

            if(options.anchors.length && !options.lockAnchors){

                //isn't it the first slide?
                if(slideIndex){
                    if(anchorLink != null){
                        sectionHash = anchorLink;
                    }

                    //slide without anchor link? We take the index instead.
                    if(slideAnchor == null){
                        slideAnchor = slideIndex;
                    }

                    lastScrolledSlide = slideAnchor;
                    setUrlHash(sectionHash + '/' + slideAnchor);

                //first slide won't have slide anchor, just the section one
                }else if(slideIndex != null){
                    lastScrolledSlide = slideAnchor;
                    setUrlHash(anchorLink);
                }

                //section without slides
                else{
                    setUrlHash(anchorLink);
                }
            }

            setBodyClass();
        }

        /**
        * Sets the URL hash.
        */
        function setUrlHash(url){
            if(options.recordHistory){
                location.hash = url;
            }else{
                //Mobile Chrome doesn't work the normal way, so... lets use HTML5 for phones :)
                if(isTouchDevice || isTouch){
                    window.history.replaceState(undefined, undefined, '#' + url);
                }else{
                    var baseUrl = window.location.href.split('#')[0];
                    window.location.replace( baseUrl + '#' + url );
                }
            }
        }

        /**
        * Gets the anchor for the given slide / section. Its index will be used if there's none.
        */
        function getAnchor(element){
            if(!element){
                return null;
            }
            var anchor = element.getAttribute('data-anchor');
            var elementIndex = index(element);

            //Slide without anchor link? We take the index instead.
            if(anchor == null){
                anchor = elementIndex;
            }

            return anchor;
        }

        /**
        * Sets a class for the body of the page depending on the active section / slide
        */
        function setBodyClass(){
            var section = $(SECTION_ACTIVE_SEL)[0];
            var slide = $(SLIDE_ACTIVE_SEL, section)[0];

            var sectionAnchor = getAnchor(section);
            var slideAnchor = getAnchor(slide);

            var text = String(sectionAnchor);

            if(slide){
                text = text + '-' + slideAnchor;
            }

            //changing slash for dash to make it a valid CSS style
            text = text.replace('/', '-').replace('#','');

            //removing previous anchor classes
            var classRe = new RegExp('\\b\\s?' + VIEWING_PREFIX + '-[^\\s]+\\b', "g");
            $body.className = $body.className.replace(classRe, '');

            //adding the current anchor
            addClass($body, VIEWING_PREFIX + '-' + text);
        }

        /**
        * Checks for translate3d support
        * @return boolean
        * http://stackoverflow.com/questions/5661671/detecting-transform-translate3d-support
        */
        function support3d() {
            var el = document.createElement('p'),
                has3d,
                transforms = {
                    'webkitTransform':'-webkit-transform',
                    'OTransform':'-o-transform',
                    'msTransform':'-ms-transform',
                    'MozTransform':'-moz-transform',
                    'transform':'transform'
                };

            //preventing the style p:empty{display: none;} from returning the wrong result
            el.style.display = 'block';

            // Add it to the body to get the computed style.
            document.body.insertBefore(el, null);

            for (var t in transforms) {
                if (el.style[t] !== undefined) {
                    el.style[t] = 'translate3d(1px,1px,1px)';
                    has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
                }
            }

            document.body.removeChild(el);

            return (has3d !== undefined && has3d.length > 0 && has3d !== 'none');
        }

        /**
        * Removes the auto scrolling action fired by the mouse wheel and trackpad.
        * After this function is called, the mousewheel and trackpad movements won't scroll through sections.
        */
        function removeMouseWheelHandler(){
            if (document.addEventListener) {
                document.removeEventListener('mousewheel', MouseWheelHandler, false); //IE9, Chrome, Safari, Oper
                document.removeEventListener('wheel', MouseWheelHandler, false); //Firefox
                document.removeEventListener('MozMousePixelScroll', MouseWheelHandler, false); //old Firefox
            } else {
                document.detachEvent('onmousewheel', MouseWheelHandler); //IE 6/7/8
            }
        }

        /**
        * Adds the auto scrolling action for the mouse wheel and trackpad.
        * After this function is called, the mousewheel and trackpad movements will scroll through sections
        * https://developer.mozilla.org/en-US/docs/Web/Events/wheel
        */
        function addMouseWheelHandler(){
            var prefix = '';
            var _addEventListener;

            if (window.addEventListener){
                _addEventListener = "addEventListener";
            }else{
                _addEventListener = "attachEvent";
                prefix = 'on';
            }

            // detect available wheel event
            var support = 'onwheel' in document.createElement('div') ? 'wheel' : // Modern browsers support "wheel"
                      document.onmousewheel !== undefined ? 'mousewheel' : // Webkit and IE support at least "mousewheel"
                      'DOMMouseScroll'; // let's assume that remaining browsers are older Firefox
            var passiveEvent = g_supportsPassive ? {passive: false }: false;

            if(support == 'DOMMouseScroll'){
                document[ _addEventListener ](prefix + 'MozMousePixelScroll', MouseWheelHandler, passiveEvent);
            }

            //handle MozMousePixelScroll in older Firefox
            else{
                document[ _addEventListener ](prefix + support, MouseWheelHandler, passiveEvent);
            }
        }

        /**
        * Binding the mousemove when the mouse's middle button is pressed
        */
        function addMiddleWheelHandler(){
            container.addEventListener('mousedown', mouseDownHandler);
            container.addEventListener('mouseup', mouseUpHandler);
        }

        /**
        * Unbinding the mousemove when the mouse's middle button is released
        */
        function removeMiddleWheelHandler(){
            container.removeEventListener('mousedown', mouseDownHandler);
            container.removeEventListener('mouseup', mouseUpHandler);
        }

        /**
        * Adds the possibility to auto scroll through sections on touch devices.
        */
        function addTouchHandler(){
            if(isTouchDevice || isTouch){
                if(options.autoScrolling){
                    $body.removeEventListener(events.touchmove, preventBouncing, {passive: false});
                    $body.addEventListener(events.touchmove, preventBouncing, {passive: false});
                }

                var touchWrapper = options.touchWrapper;
                touchWrapper.removeEventListener(events.touchstart, touchStartHandler);
                touchWrapper.removeEventListener(events.touchmove, touchMoveHandler, {passive: false});

                touchWrapper.addEventListener(events.touchstart, touchStartHandler);
                touchWrapper.addEventListener(events.touchmove, touchMoveHandler, {passive: false});
            }
        }

        /**
        * Removes the auto scrolling for touch devices.
        */
        function removeTouchHandler(){
            if(isTouchDevice || isTouch){
                // normalScrollElements requires it off #2691
                if(options.autoScrolling){
                    $body.removeEventListener(events.touchmove, touchMoveHandler, {passive: false});
                    $body.removeEventListener(events.touchmove, preventBouncing, {passive: false});
                }

                var touchWrapper = options.touchWrapper;
                touchWrapper.removeEventListener(events.touchstart, touchStartHandler);
                touchWrapper.removeEventListener(events.touchmove, touchMoveHandler, {passive: false});
            }
        }

        /*
        * Returns and object with Microsoft pointers (for IE<11 and for IE >= 11)
        * http://msdn.microsoft.com/en-us/library/ie/dn304886(v=vs.85).aspx
        */
        function getMSPointer(){
            var pointer;

            //IE >= 11 & rest of browsers
            if(window.PointerEvent){
                pointer = { down: 'pointerdown', move: 'pointermove'};
            }

            //IE < 11
            else{
                pointer = { down: 'MSPointerDown', move: 'MSPointerMove'};
            }

            return pointer;
        }

        /**
        * Gets the pageX and pageY properties depending on the browser.
        * https://github.com/alvarotrigo/fullPage.js/issues/194#issuecomment-34069854
        */
        function getEventsPage(e){
            var events = [];

            events.y = (typeof e.pageY !== 'undefined' && (e.pageY || e.pageX) ? e.pageY : e.touches[0].pageY);
            events.x = (typeof e.pageX !== 'undefined' && (e.pageY || e.pageX) ? e.pageX : e.touches[0].pageX);

            //in touch devices with scrollBar:true, e.pageY is detected, but we have to deal with touch events. #1008
            if(isTouch && isReallyTouch(e) && options.scrollBar && typeof e.touches !== 'undefined'){
                events.y = e.touches[0].pageY;
                events.x = e.touches[0].pageX;
            }

            return events;
        }

        /**
        * Slides silently (with no animation) the active slider to the given slide.
        * @param noCallback {bool} true or defined -> no callbacks
        */
        function silentLandscapeScroll(activeSlide, noCallbacks){
            setScrollingSpeed(0, 'internal');

            if(typeof noCallbacks !== 'undefined'){
                //preventing firing callbacks afterSlideLoad etc.
                isResizing = true;
            }

            landscapeScroll(closest(activeSlide, SLIDES_WRAPPER_SEL), activeSlide);

            if(typeof noCallbacks !== 'undefined'){
                isResizing = false;
            }

            setScrollingSpeed(originals.scrollingSpeed, 'internal');
        }

        /**
        * Scrolls silently (with no animation) the page to the given Y position.
        */
        function silentScroll(top){
            // The first section can have a negative value in iOS 10. Not quite sure why: -0.0142822265625
            // that's why we round it to 0.
            var roundedTop = Math.round(top);

            if (options.css3 && options.autoScrolling && !options.scrollBar){
                var translate3d = 'translate3d(0px, -' + roundedTop + 'px, 0px)';
                transformContainer(translate3d, false);
            }
            else if(options.autoScrolling && !options.scrollBar){
                css(container, {'top': -roundedTop + 'px'});
                FP.test.top = -roundedTop + 'px';
            }
            else{
                var scrollSettings = getScrollSettings(roundedTop);
                setScrolling(scrollSettings.element, scrollSettings.options);
            }
        }

        /**
        * Returns the cross-browser transform string.
        */
        function getTransforms(translate3d){
            return {
                '-webkit-transform': translate3d,
                '-moz-transform': translate3d,
                '-ms-transform':translate3d,
                'transform': translate3d
            };
        }

        /**
        * Allowing or disallowing the mouse/swipe scroll in a given direction. (not for keyboard)
        * @type  m (mouse) or k (keyboard)
        */
        function setIsScrollAllowed(value, direction, type){
            //up, down, left, right
            if(direction !== 'all'){
                isScrollAllowed[type][direction] = value;
            }

            //all directions?
            else{
                Object.keys(isScrollAllowed[type]).forEach(function(key){
                    isScrollAllowed[type][key] = value;
                });
            }
        }

        /*
        * Destroys fullpage.js plugin events and optinally its html markup and styles
        */
        function destroy(all){
            setAutoScrolling(false, 'internal');
            setAllowScrolling(true);
            setMouseHijack(false);
            setKeyboardScrolling(false);
            addClass(container, DESTROYED);

            [
                afterSlideLoadsId, 
                afterSectionLoadsId,
                resizeId,
                scrollId,
                scrollId2,
                g_doubleCheckHeightId,
                resizeHandlerId
            ].forEach(function(timeoutId){
                clearTimeout(timeoutId);
            });

            window.removeEventListener('scroll', scrollHandler);
            window.removeEventListener('hashchange', hashChangeHandler);
            window.removeEventListener('resize', resizeHandler);

            document.removeEventListener('keydown', keydownHandler);
            document.removeEventListener('keyup', keyUpHandler);

            ['click', 'touchstart'].forEach(function(eventName){
                document.removeEventListener(eventName, delegatedEvents);
            });

            ['mouseenter', 'touchstart', 'mouseleave', 'touchend'].forEach(function(eventName){
                document.removeEventListener(eventName, onMouseEnterOrLeave, true); //true is required!
            });

            //lets make a mess!
            if(all){
                destroyStructure();
            }
        }

        /*
        * Removes inline styles added by fullpage.js
        */
        function destroyStructure(){
            //reseting the `top` or `translate` properties to 0
            silentScroll(0);

            //loading all the lazy load content
            $('img[data-src], source[data-src], audio[data-src], iframe[data-src]', container).forEach(function(item){
                setSrc(item, 'src');
            });

            $('img[data-srcset]').forEach(function(item){
                setSrc(item, 'srcset');
            });

            remove($(SECTION_NAV_SEL + ', ' + SLIDES_NAV_SEL +  ', ' + SLIDES_ARROW_SEL));

            //removing inline styles
            css($(SECTION_SEL), {
                'height': '',
                'background-color' : '',
                'padding': ''
            });

            css($(SLIDE_SEL), {
                'width': ''
            });

            css(container, {
                'height': '',
                'position': '',
                '-ms-touch-action': '',
                'touch-action': ''
            });

            css($htmlBody, {
                'overflow': '',
                'height': ''
            });

            // remove .fp-enabled class
            removeClass($html, ENABLED);

            // remove .fp-responsive class
            removeClass($body, RESPONSIVE);

            // remove all of the .fp-viewing- classes
            $body.className.split(/\s+/).forEach(function (className) {
                if (className.indexOf(VIEWING_PREFIX) === 0) {
                    removeClass($body, className);
                }
            });

            //removing added classes
            $(SECTION_SEL + ', ' + SLIDE_SEL).forEach(function(item){
                if(options.scrollOverflowHandler && options.scrollOverflow){
                    options.scrollOverflowHandler.remove(item);
                }
                removeClass(item, TABLE + ' ' + ACTIVE + ' ' + COMPLETELY);
                var previousStyles = item.getAttribute('data-fp-styles');
                if(previousStyles){
                    item.setAttribute('style', item.getAttribute('data-fp-styles'));
                }

                //removing anchors if they were not set using the HTML markup
                if(hasClass(item, SECTION) && !g_initialAnchorsInDom){
                    item.removeAttribute('data-anchor');
                }
            });

            //removing the applied transition from the fullpage wrapper
            removeAnimation(container);

            //Unwrapping content
            [TABLE_CELL_SEL, SLIDES_CONTAINER_SEL,SLIDES_WRAPPER_SEL].forEach(function(selector){
                $(selector, container).forEach(function(item){
                    //unwrap not being use in case there's no child element inside and its just text
                    unwrap(item);
                });
            });

            //removing the applied transition from the fullpage wrapper
            css(container, {
                '-webkit-transition': 'none',
                'transition': 'none'
            });

            //scrolling the page to the top with no animation
            window.scrollTo(0, 0);

            //removing selectors
            var usedSelectors = [SECTION, SLIDE, SLIDES_CONTAINER];
            usedSelectors.forEach(function(item){
                removeClass($('.' + item), item);
            });
        }

        /*
        * Sets the state for a variable with multiple states (original, and temporal)
        * Some variables such as `autoScrolling` or `recordHistory` might change automatically its state when using `responsive` or `autoScrolling:false`.
        * This function is used to keep track of both states, the original and the temporal one.
        * If type is not 'internal', then we assume the user is globally changing the variable.
        */
        function setVariableState(variable, value, type){
            options[variable] = value;
            if(type !== 'internal'){
                originals[variable] = value;
            }
        }

        /**
        * Displays warnings
        */
        function displayWarnings(){
            var l = options['li' + 'c' + 'enseK' + 'e' + 'y'];
            var msgStyle = 'font-size: 15px;background:yellow;';

            if(!isOK){
                showError('error', 'Fullpage.js version 3 has changed its license to GPLv3 and it requires a `licenseKey` option. Read about it here:');
                showError('error', 'https://github.com/alvarotrigo/fullPage.js#options.');
            }
            else if(l && l.length < 20){
                console.warn('%c This website was made using fullPage.js slider. More info on the following website:', msgStyle);
                console.warn('%c https://alvarotrigo.com/fullPage/', msgStyle);
            }

            if(hasClass($html, ENABLED)){
                showError('error', 'Fullpage.js can only be initialized once and you are doing it multiple times!');
                return;
            }

            // Disable mutually exclusive settings
            if (options.continuousVertical &&
                (options.loopTop || options.loopBottom)) {
                options.continuousVertical = false;
                showError('warn', 'Option `loopTop/loopBottom` is mutually exclusive with `continuousVertical`; `continuousVertical` disabled');
            }

            if(options.scrollOverflow &&
               (options.scrollBar || !options.autoScrolling)){
                showError('warn', 'Options scrollBar:true and autoScrolling:false are mutually exclusive with scrollOverflow:true. Sections with scrollOverflow might not work well in Firefox');
            }

            if(options.continuousVertical && (options.scrollBar || !options.autoScrolling)){
                options.continuousVertical = false;
                showError('warn', 'Scroll bars (`scrollBar:true` or `autoScrolling:false`) are mutually exclusive with `continuousVertical`; `continuousVertical` disabled');
            }

            if(options.scrollOverflow && options.scrollOverflowHandler == null){
                options.scrollOverflow = false;
                showError('error', 'The option `scrollOverflow:true` requires the file `scrolloverflow.min.js`. Please include it before fullPage.js.');
            }

            //using extensions? Wrong file!
            extensions.forEach(function(extension){
                //is the option set to true?
                if(options[extension]){
                    showError('warn', 'fullpage.js extensions require fullpage.extensions.min.js file instead of the usual fullpage.js. Requested: '+ extension);
                }
            });

            //anchors can not have the same value as any element ID or NAME
            options.anchors.forEach(function(name){

                //case insensitive selectors (http://stackoverflow.com/a/19465187/1081396)
                var nameAttr = [].slice.call($('[name]')).filter(function(item) {
                    return item.getAttribute('name') && item.getAttribute('name').toLowerCase() == name.toLowerCase();
                });

                var idAttr = [].slice.call($('[id]')).filter(function(item) {
                    return item.getAttribute('id') && item.getAttribute('id').toLowerCase() == name.toLowerCase();
                });

                if(idAttr.length || nameAttr.length ){
                    showError('error', 'data-anchor tags can not have the same value as any `id` element on the site (or `name` element for IE).');
                    var propertyName = idAttr.length ? 'id' : 'name';

                    if(idAttr.length || nameAttr.length){
                        showError('error', '"' + name + '" is is being used by another element `'+ propertyName +'` property');
                    }
                }
            });
        }

        /**
        * Getting the position of the element to scroll when using jQuery animations
        */
        function getScrolledPosition(element){
            var position;

            //is not the window element and is a slide?
            if(element.self != window && hasClass(element, SLIDES_WRAPPER)){
                position = element.scrollLeft;
            }
            else if(!options.autoScrolling  || options.scrollBar){
                position = getScrollTop();
            }
            else{
                position = element.offsetTop;
            }

            //gets the top property of the wrapper
            return position;
        }

        /**
        * Simulates the animated scrollTop of jQuery. Used when css3:false or scrollBar:true or autoScrolling:false
        * http://stackoverflow.com/a/16136789/1081396
        */
        function scrollTo(element, to, duration, callback) {
            var start = getScrolledPosition(element);
            var change = to - start;
            var currentTime = 0;
            var increment = 20;
            activeAnimation = true;

            var animateScroll = function(){
                if(activeAnimation){ //in order to stope it from other function whenever we want
                    var val = to;

                    currentTime += increment;

                    if(duration){
                        val = window.fp_easings[options.easing](currentTime, start, change, duration);
                    }

                    setScrolling(element, val);

                    if(currentTime < duration) {
                        setTimeout(animateScroll, increment);
                    }else if(typeof callback !== 'undefined'){
                        callback();
                    }
                }else if (currentTime < duration){
                    callback();
                }
            };

            animateScroll();
        }

        /**
        * Scrolls the page / slider the given number of pixels.
        * It will do it one or another way dependiong on the library's config.
        */
        function setScrolling(element, val){
            if(!options.autoScrolling || options.scrollBar || (element.self != window && hasClass(element, SLIDES_WRAPPER))){

                //scrolling horizontally through the slides?
                if(element.self != window  && hasClass(element, SLIDES_WRAPPER)){
                    element.scrollLeft = val;
                }
                //vertical scroll
                else{
                    element.scrollTo(0, val);
                }
            }else{
                 element.style.top = val + 'px';
            }
        }

        /**
        * Gets the active slide.
        */
        function getActiveSlide(){
            var activeSlide = $(SLIDE_ACTIVE_SEL, $(SECTION_ACTIVE_SEL)[0])[0];
            return nullOrSlide(activeSlide);
        }

        /**
        * Gets the active section.
        */
        function getActiveSection(){
            return new Section($(SECTION_ACTIVE_SEL)[0]);
        }

        /**
        * Item. Slide or Section objects share the same properties.
        */
        function Item(el, selector){
            this.anchor = el.getAttribute('data-anchor');
            this.item = el;
            this.index = index(el, selector);
            this.isLast = this.index === el.parentElement.querySelectorAll(selector).length -1;
            this.isFirst = !this.index;
        }

        /**
        * Section object
        */
        function Section(el){
            Item.call(this, el, SECTION_SEL);
        }

        /**
        * Slide object
        */
        function Slide(el){
            Item.call(this, el, SLIDE_SEL);
        }

        return FP;
    } //end of $.fn.fullpage

    //utils
    /**
    * Shows a message in the console of the given type.
    */
    function showError(type, text){
        window.console && window.console[type] && window.console[type]('fullPage: ' + text);
    }

    /**
    * Equivalent or jQuery function $().
    */
    function $(selector, context){
        context = arguments.length > 1 ? context : document;
        return context ? context.querySelectorAll(selector) : null;
    }

    /**
    * Extends a given Object properties and its childs.
    */
    function deepExtend(out) {
        out = out || {};
        for (var i = 1, len = arguments.length; i < len; ++i){
            var obj = arguments[i];

            if(!obj){
              continue;
            }

            for(var key in obj){
              if (!obj.hasOwnProperty(key)){
                continue;
              }

              // based on https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
              if (Object.prototype.toString.call(obj[key]) === '[object Object]'){
                out[key] = deepExtend(out[key], obj[key]);
                continue;
              }

              out[key] = obj[key];
            }
        }
        return out;
    }

    /**
    * Checks if the passed element contains the passed class.
    */
    function hasClass(el, className){
        if(el == null){
            return false;
        }
        if (el.classList){
            return el.classList.contains(className);
        }
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    }

    /**
    * Gets the window height. Crossbrowser.
    */
    function getWindowHeight(){
        return 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
    }

    /**
    * Gets the window width.
    */
    function getWindowWidth(){
        return window.innerWidth;
    }

    /**
    * Set's the CSS properties for the passed item/s.
    * @param {NodeList|HTMLElement} items
    * @param {Object} props css properties and values.
    */
    function css(items, props) {
        items = getList(items);

        var key;
        for (key in props) {
            if (props.hasOwnProperty(key)) {
                if (key !== null) {
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        item.style[key] = props[key];
                    }
                }
            }
        }

        return items;
    }

    /**
    * Generic function to get the previous or next element.
    */
    function until(item, selector, fn){
        var sibling = item[fn];
        while(sibling && !matches(sibling, selector)){
            sibling = sibling[fn];
        }

        return sibling;
    }

    /**
    * Gets the previous element to the passed element that matches the passed selector.
    */
    function prevUntil(item, selector){
        return until(item, selector, 'previousElementSibling');
    }

    /**
    * Gets the next element to the passed element that matches the passed selector.
    */
    function nextUntil(item, selector){
        return until(item, selector, 'nextElementSibling');
    }

    /**
    * Gets the previous element to the passed element.
    */
    function prev(item){
        return item.previousElementSibling;
    }

    /**
    * Gets the next element to the passed element.
    */
    function next(item){
        return item.nextElementSibling;
    }

    /**
    * Gets the last element from the passed list of elements.
    */
    function last(item){
        return item[item.length-1];
    }

    /**
    * Gets index from the passed element.
    * @param {String} selector is optional.
    */
    function index(item, selector) {
        item = isArrayOrList(item) ? item[0] : item;
        var children = selector != null? $(selector, item.parentNode) : item.parentNode.childNodes;
        var num = 0;
        for (var i=0; i<children.length; i++) {
             if (children[i] == item) return num;
             if (children[i].nodeType==1) num++;
        }
        return -1;
    }

    /**
    * Gets an iterable element for the passed element/s
    */
    function getList(item){
        return !isArrayOrList(item) ? [item] : item;
    }

    /**
    * Adds the display=none property for the passed element/s
    */
    function hide(el){
        el = getList(el);

        for(var i = 0; i<el.length; i++){
            el[i].style.display = 'none';
        }
        return el;
    }

    /**
    * Adds the display=block property for the passed element/s
    */
    function show(el){
        el = getList(el);

        for(var i = 0; i<el.length; i++){
            el[i].style.display = 'block';
        }
        return el;
    }

    /**
    * Checks if the passed element is an iterable element or not
    */
    function isArrayOrList(el){
        return Object.prototype.toString.call( el ) === '[object Array]' ||
            Object.prototype.toString.call( el ) === '[object NodeList]';
    }

    /**
    * Adds the passed class to the passed element/s
    */
    function addClass(el, className) {
        el = getList(el);

        for(var i = 0; i<el.length; i++){
            var item = el[i];
            if (item.classList){
                item.classList.add(className);
            }
            else{
              item.className += ' ' + className;
            }
        }
        return el;
    }

    /**
    * Removes the passed class to the passed element/s
    * @param {String} `className` can be multiple classnames separated by whitespace
    */
    function removeClass(el, className){
        el = getList(el);

        var classNames = className.split(' ');

        for(var a = 0; a<classNames.length; a++){
            className = classNames[a];
            for(var i = 0; i<el.length; i++){
                var item = el[i];
                if (item.classList){
                    item.classList.remove(className);
                }
                else{
                    item.className = item.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
                }
            }
        }
        return el;
    }

    /**
    * Appends the given element ot the given parent.
    */
    function appendTo(el, parent){
        parent.appendChild(el);
    }

    /**
    Usage:

    var wrapper = document.createElement('div');
    wrapper.className = 'fp-slides';
    wrap($('.slide'), wrapper);

    https://jsfiddle.net/qwzc7oy3/15/ (vanilla)
    https://jsfiddle.net/oya6ndka/1/ (jquery equivalent)
    */
    function wrap(toWrap, wrapper, isWrapAll) {
        var newParent;
        wrapper = wrapper || document.createElement('div');
        for(var i = 0; i < toWrap.length; i++){
            var item = toWrap[i];
            if(isWrapAll && !i || !isWrapAll){
                newParent = wrapper.cloneNode(true);
                item.parentNode.insertBefore(newParent, item);
            }
            newParent.appendChild(item);
        }
        return toWrap;
    }

    /**
    Usage:
    var wrapper = document.createElement('div');
    wrapper.className = 'fp-slides';
    wrap($('.slide'), wrapper);

    https://jsfiddle.net/qwzc7oy3/27/ (vanilla)
    https://jsfiddle.net/oya6ndka/4/ (jquery equivalent)
    */
    function wrapAll(toWrap, wrapper) {
        wrap(toWrap, wrapper, true);
    }

    /**
    * Usage:
    * wrapInner(document.querySelector('#pepe'), '<div class="test">afdas</div>');
    * wrapInner(document.querySelector('#pepe'), element);
    *
    * https://jsfiddle.net/zexxz0tw/6/
    *
    * https://stackoverflow.com/a/21817590/1081396
    */
    function wrapInner(parent, wrapper) {
        if (typeof wrapper === "string"){
            wrapper = createElementFromHTML(wrapper);
        }

        parent.appendChild(wrapper);

        while(parent.firstChild !== wrapper){
            wrapper.appendChild(parent.firstChild);
       }
    }

    /**
    * Usage:
    * unwrap(document.querySelector('#pepe'));
    * unwrap(element);
    *
    * https://jsfiddle.net/szjt0hxq/1/
    *
    */
    function unwrap(wrapper) {
        var wrapperContent = document.createDocumentFragment();
        while (wrapper.firstChild) {
            wrapperContent.appendChild(wrapper.firstChild);
        }

        wrapper.parentNode.replaceChild(wrapperContent, wrapper);
    }

    /**
    * http://stackoverflow.com/questions/22100853/dom-pure-javascript-solution-to-jquery-closest-implementation
    * Returns the element or `false` if there's none
    */
    function closest(el, selector) {
        if(el && el.nodeType === 1){
            if(matches(el, selector)){
                return el;
            }
            return closest(el.parentNode, selector);
        }
        return null;
    }

    /**
    * Places one element (rel) after another one or group of them (reference).
    * @param {HTMLElement} reference
    * @param {HTMLElement|NodeList|String} el
    * https://jsfiddle.net/9s97hhzv/1/
    */
    function after(reference, el) {
        insertBefore(reference, reference.nextSibling, el);
    }

    /**
    * Places one element (rel) before another one or group of them (reference).
    * @param {HTMLElement} reference
    * @param {HTMLElement|NodeList|String} el
    * https://jsfiddle.net/9s97hhzv/1/
    */
    function before(reference, el) {
        insertBefore(reference, reference, el);
    }

    /**
    * Based in https://stackoverflow.com/a/19316024/1081396
    * and https://stackoverflow.com/a/4793630/1081396
    */
    function insertBefore(reference, beforeElement, el){
        if(!isArrayOrList(el)){
            if(typeof el == 'string'){
                el = createElementFromHTML(el);
            }
            el = [el];
        }

        for(var i = 0; i<el.length; i++){
            reference.parentNode.insertBefore(el[i], beforeElement);
        }
    }

    //http://stackoverflow.com/questions/3464876/javascript-get-window-x-y-position-for-scroll
    function getScrollTop(){
        var doc = document.documentElement;
        return (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
    }

    /**
    * Gets the siblings of the passed element
    */
    function siblings(el){
        return Array.prototype.filter.call(el.parentNode.children, function(child){
          return child !== el;
        });
    }

    //for IE 9 ?
    function preventDefault(event){
        if(event.preventDefault){
            event.preventDefault();
        }
        else{
            event.returnValue = false;
        }
    }

    /**
    * Determines whether the passed item is of function type.
    */
    function isFunction(item) {
      if (typeof item === 'function') {
        return true;
      }
      var type = Object.prototype.toString(item);
      return type === '[object Function]' || type === '[object GeneratorFunction]';
    }

    /**
    * Trigger custom events
    */
    function trigger(el, eventName, data){
        var event;
        data = typeof data === 'undefined' ? {} : data;

        // Native
        if(typeof window.CustomEvent === "function" ){
            event = new CustomEvent(eventName, {detail: data});
        }
        else{
            event = document.createEvent('CustomEvent');
            event.initCustomEvent(eventName, true, true, data);
        }

        el.dispatchEvent(event);
    }

    /**
    * Polyfill of .matches()
    */
    function matches(el, selector) {
        return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
    }

    /**
    * Toggles the visibility of the passed element el.
    */
    function toggle(el, value){
        if(typeof value === "boolean"){
            for(var i = 0; i<el.length; i++){
                el[i].style.display = value ? 'block' : 'none';
            }
        }
        //we don't use it in other way, so no else :)

        return el;
    }

    /**
    * Creates a HTMLElement from the passed HTML string.
    * https://stackoverflow.com/a/494348/1081396
    */
    function createElementFromHTML(htmlString) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();

        // Change this to div.childNodes to support multiple top-level nodes
        return div.firstChild;
    }

    /**
    * Removes the passed item/s from the DOM.
    */
    function remove(items){
        items = getList(items);
        for(var i = 0; i<items.length; i++){
            var item = items[i];
            if(item && item.parentElement) {
                item.parentNode.removeChild(item);
            }
        }
    }

    /**
    * Filters an array by the passed filter funtion.
    */
    function filter(el, filterFn){
        Array.prototype.filter.call(el, filterFn);
    }

    //https://jsfiddle.net/w1rktecz/
    function untilAll(item, selector, fn){
        var sibling = item[fn];
        var siblings = [];
        while(sibling){
            if(matches(sibling, selector) || selector == null) {
                siblings.push(sibling);
            }
            sibling = sibling[fn];
        }

        return siblings;
    }

    /**
    * Gets all next elements matching the passed selector.
    */
    function nextAll(item, selector){
        return untilAll(item, selector, 'nextElementSibling');
    }

    /**
    * Gets all previous elements matching the passed selector.
    */
    function prevAll(item, selector){
        return untilAll(item, selector, 'previousElementSibling');
    }

    /**
    * Converts an object to an array.
    */
    function toArray(objectData){
        return Object.keys(objectData).map(function(key) {
           return objectData[key];
        });
    }

    /**
    * forEach polyfill for IE
    * https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach#Browser_Compatibility
    */
    if (window.NodeList && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = function (callback, thisArg) {
            thisArg = thisArg || window;
            for (var i = 0; i < this.length; i++) {
                callback.call(thisArg, this[i], i, this);
            }
        };
    }

    //utils are public, so we can use it wherever we want
    window.fp_utils = {
        $: $,
        deepExtend: deepExtend,
        hasClass: hasClass,
        getWindowHeight: getWindowHeight,
        css: css,
        until: until,
        prevUntil: prevUntil,
        nextUntil: nextUntil,
        prev: prev,
        next: next,
        last: last,
        index: index,
        getList: getList,
        hide: hide,
        show: show,
        isArrayOrList: isArrayOrList,
        addClass: addClass,
        removeClass: removeClass,
        appendTo: appendTo,
        wrap: wrap,
        wrapAll: wrapAll,
        wrapInner: wrapInner,
        unwrap: unwrap,
        closest: closest,
        after: after,
        before: before,
        insertBefore: insertBefore,
        getScrollTop: getScrollTop,
        siblings: siblings,
        preventDefault: preventDefault,
        isFunction: isFunction,
        trigger: trigger,
        matches: matches,
        toggle: toggle,
        createElementFromHTML: createElementFromHTML,
        remove: remove,
        filter: filter,
        untilAll: untilAll,
        nextAll: nextAll,
        prevAll: prevAll,
        showError: showError
    };

    return initialise;
}));

/**
 * jQuery adapter for fullPage.js 3.0.0
 */
if(window.jQuery && window.fullpage){
    (function ($, fullpage) {
        if (!$ || !fullpage) {
            window.fp_utils.showError('error', 'jQuery is required to use the jQuery fullpage adapter!');
            return;
        }

        $.fn.fullpage = function(options) {
            options = $.extend({}, options, {'$': $});
            var instance = new fullpage(this[0], options);
        };
    })(window.jQuery, window.fullpage);
}

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

// eslint-disable-next-line no-unused-vars
function setupFullpage(element) {
	$(element).fullpage({
		autoScrolling: true,
		scrollBar: true,
		fitToSection: true,
		scrollOverflow: false,
		verticalCentered: false,
		normalScrollElements: ".modal-open .modal",
		navigation: true,
		navigationPosition: "right",
		navigationTooltips: ["Hello", "Portfolio", "About", "Contact"],
		responsiveWidth: vars.breakpoints.m,
		responsiveHeight: 550, //TODO: calculate maximum heighth of content dynamically
		// Dot nav decorative classes
		onLeave: function (origin, destination, direction) {
			if (direction && direction == "down") {
				$("#fp-nav li a").slice(0, destination.index).each(function (i) {
					let self = $(this);
					setTimeout(function () {
						self.addClass("before-active");
					}, i * vars.dotNavTransitionDuration);
				});
			} else if (direction && direction == "up") {
				$($("#fp-nav li a").get().slice(destination.index).reverse()).each(function (i) {
					let self = $(this);
					setTimeout(function () {
						self.removeClass("before-active");
					}, i * vars.dotNavTransitionDuration);
				});
			}
		}
		// afterRender: function() {
		// 	$(this.item).addClass("start-animation");
		// },
	});
}

/**!
 * MixItUp v3.3.1
 * A high-performance, dependency-free library for animated filtering, sorting and more
 * Build 94e0fbf6-cd0b-4987-b3c0-14b59b67b8a0
 *
 * @copyright Copyright 2014-2018 KunkaLabs Limited.
 * @author    KunkaLabs Limited.
 * @link      https://www.kunkalabs.com/mixitup/
 *
 * @license   Commercial use requires a commercial license.
 *            https://www.kunkalabs.com/mixitup/licenses/
 *
 *            Non-commercial use permitted under same terms as CC BY-NC 3.0 license.
 *            http://creativecommons.org/licenses/by-nc/3.0/
 */

(function(window) {
    var mixitup = null,
        h       = null;

    (function() {
        var VENDORS = ['webkit', 'moz', 'o', 'ms'],
            canary  = window.document.createElement('div'),
            i       = -1;

        // window.requestAnimationFrame

        for (i = 0; i < VENDORS.length && !window.requestAnimationFrame; i++) {
            window.requestAnimationFrame = window[VENDORS[i] + 'RequestAnimationFrame'];
        }

        // Element.nextElementSibling

        if (typeof canary.nextElementSibling === 'undefined') {
            Object.defineProperty(window.Element.prototype, 'nextElementSibling', {
                get: function() {
                    var el = this.nextSibling;

                    while (el) {
                        if (el.nodeType === 1) {
                            return el;
                        }

                        el = el.nextSibling;
                    }

                    return null;
                }
            });
        }

        // Element.matches

        (function(ElementPrototype) {
            ElementPrototype.matches =
                ElementPrototype.matches ||
                ElementPrototype.machesSelector ||
                ElementPrototype.mozMatchesSelector ||
                ElementPrototype.msMatchesSelector ||
                ElementPrototype.oMatchesSelector ||
                ElementPrototype.webkitMatchesSelector ||
                function (selector) {
                    return Array.prototype.indexOf.call(this.parentElement.querySelectorAll(selector), this) > -1;
                };
        })(window.Element.prototype);

        // Object.keys
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys

        if (!Object.keys) {
            Object.keys = (function() {
                var hasOwnProperty      = Object.prototype.hasOwnProperty,
                    hasDontEnumBug      = false,
                    dontEnums           = [],
                    dontEnumsLength     = -1;

                hasDontEnumBug = !({
                    toString: null
                })
                    .propertyIsEnumerable('toString');

                dontEnums = [
                    'toString',
                    'toLocaleString',
                    'valueOf',
                    'hasOwnProperty',
                    'isPrototypeOf',
                    'propertyIsEnumerable',
                    'constructor'
                ];

                dontEnumsLength = dontEnums.length;

                return function(obj) {
                    var result  = [],
                        prop    = '',
                        i       = -1;

                    if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                        throw new TypeError('Object.keys called on non-object');
                    }

                    for (prop in obj) {
                        if (hasOwnProperty.call(obj, prop)) {
                            result.push(prop);
                        }
                    }

                    if (hasDontEnumBug) {
                        for (i = 0; i < dontEnumsLength; i++) {
                            if (hasOwnProperty.call(obj, dontEnums[i])) {
                                result.push(dontEnums[i]);
                            }
                        }
                    }

                    return result;
                };
            }());
        }

        // Array.isArray
        // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray

        if (!Array.isArray) {
            Array.isArray = function(arg) {
                return Object.prototype.toString.call(arg) === '[object Array]';
            };
        }

        // Object.create
        // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/create

        if (typeof Object.create !== 'function') {
            Object.create = (function(undefined) {
                var Temp = function() {};

                return function (prototype, propertiesObject) {
                    if (prototype !== Object(prototype) && prototype !== null) {
                        throw TypeError('Argument must be an object, or null');
                    }

                    Temp.prototype = prototype || {};

                    var result = new Temp();

                    Temp.prototype = null;

                    if (propertiesObject !== undefined) {
                        Object.defineProperties(result, propertiesObject);
                    }

                    if (prototype === null) {
                        /* jshint ignore:start */
                        result.__proto__ = null;
                        /* jshint ignore:end */
                    }

                    return result;
                };
            })();
        }

        // String.prototyoe.trim

        if (!String.prototype.trim) {
            String.prototype.trim = function() {
                return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
            };
        }

        // Array.prototype.indexOf
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf

        if (!Array.prototype.indexOf) {
            Array.prototype.indexOf = function(searchElement) {
                var n, k, t, len;

                if (this === null) {
                    throw new TypeError();
                }

                t = Object(this);

                len = t.length >>> 0;

                if (len === 0) {
                    return -1;
                }

                n = 0;

                if (arguments.length > 1) {
                    n = Number(arguments[1]);

                    if (n !== n) {
                        n = 0;
                    } else if (n !== 0 && n !== Infinity && n !== -Infinity) {
                        n = (n > 0 || -1) * Math.floor(Math.abs(n));
                    }
                }

                if (n >= len) {
                    return -1;
                }

                for (k = n >= 0 ? n : Math.max(len - Math.abs(n), 0); k < len; k++) {
                    if (k in t && t[k] === searchElement) {
                        return k;
                    }
                }

                return -1;
            };
        }

        // Function.prototype.bind
        // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_objects/Function/bind

        if (!Function.prototype.bind) {
            Function.prototype.bind = function(oThis) {
                var aArgs, self, FNOP, fBound;

                if (typeof this !== 'function') {
                    throw new TypeError();
                }

                aArgs = Array.prototype.slice.call(arguments, 1);

                self = this;

                FNOP = function() {};

                fBound = function() {
                    return self.apply(this instanceof FNOP ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
                };

                if (this.prototype) {
                    FNOP.prototype = this.prototype;
                }

                fBound.prototype = new FNOP();

                return fBound;
            };
        }

        // Element.prototype.dispatchEvent

        if (!window.Element.prototype.dispatchEvent) {
            window.Element.prototype.dispatchEvent = function(event) {
                try {
                    return this.fireEvent('on' + event.type, event);
                } catch (err) {}
            };
        }
    })();

    /**
     * The `mixitup()` "factory" function creates and returns individual instances
     * of MixItUp, known as "mixers", on which API methods can be called.
     *
     * When loading MixItUp via a script tag, the factory function is accessed
     * via the global variable `mixitup`. When using a module loading
     * system (e.g. ES2015, CommonJS, RequireJS), the factory function is
     * exported into your module when you require the MixItUp library.
     *
     * @example
     * mixitup(container [,config] [,foreignDoc])
     *
     * @example <caption>Example 1: Creating a mixer instance with an element reference</caption>
     * var containerEl = document.querySelector('.container');
     *
     * var mixer = mixitup(containerEl);
     *
     * @example <caption>Example 2: Creating a mixer instance with a selector string</caption>
     * var mixer = mixitup('.container');
     *
     * @example <caption>Example 3: Passing a configuration object</caption>
     * var mixer = mixitup(containerEl, {
     *     animation: {
     *         effects: 'fade scale(0.5)'
     *     }
     * });
     *
     * @example <caption>Example 4: Passing an iframe reference</caption>
     * var mixer = mixitup(containerEl, config, foreignDocument);
     *
     * @global
     * @namespace
     * @public
     * @kind        function
     * @since       3.0.0
     * @param       {(Element|string)}  container
     *      A DOM element or selector string representing the container(s) on which to instantiate MixItUp.
     * @param       {object}            [config]
     *      An optional "configuration object" used to customize the behavior of the MixItUp instance.
     * @param       {object}            [foreignDoc]
     *      An optional reference to a `document`, which can be used to control a MixItUp instance in an iframe.
     * @return      {mixitup.Mixer}
     *      A "mixer" object holding the MixItUp instance.
     */

    mixitup = function(container, config, foreignDoc) {
        var el                  = null,
            returnCollection    = false,
            instance            = null,
            facade              = null,
            doc                 = null,
            output              = null,
            instances           = [],
            id                  = '',
            elements            = [],
            i                   = -1;

        doc = foreignDoc || window.document;

        if (returnCollection = arguments[3]) {
            // A non-documented 4th paramater enabling control of multiple instances

            returnCollection = typeof returnCollection === 'boolean';
        }

        if (typeof container === 'string') {
            elements = doc.querySelectorAll(container);
        } else if (container && typeof container === 'object' && h.isElement(container, doc)) {
            elements = [container];
        } else if (container && typeof container === 'object' && container.length) {
            // Although not documented, the container may also be an array-like list of
            // elements such as a NodeList or jQuery collection, is returnCollection is true

            elements = container;
        } else {
            throw new Error(mixitup.messages.errorFactoryInvalidContainer());
        }

        if (elements.length < 1) {
            throw new Error(mixitup.messages.errorFactoryContainerNotFound());
        }

        for (i = 0; el = elements[i]; i++) {
            if (i > 0 && !returnCollection) break;

            if (!el.id) {
                id = 'MixItUp' + h.randomHex();

                el.id = id;
            } else {
                id = el.id;
            }

            if (mixitup.instances[id] instanceof mixitup.Mixer) {
                instance = mixitup.instances[id];

                if (!config || (config && config.debug && config.debug.showWarnings !== false)) {
                    console.warn(mixitup.messages.warningFactoryPreexistingInstance());
                }
            } else {
                instance = new mixitup.Mixer();

                instance.attach(el, doc, id, config);

                mixitup.instances[id] = instance;
            }

            facade = new mixitup.Facade(instance);

            if (config && config.debug && config.debug.enable) {
                instances.push(instance);
            } else {
                instances.push(facade);
            }
        }

        if (returnCollection) {
            output = new mixitup.Collection(instances);
        } else {
            // Return the first instance regardless

            output = instances[0];
        }

        return output;
    };

    /**
     * The `.use()` static method is used to extend the functionality of mixitup with compatible
     * extensions and libraries in an environment with modular scoping e.g. ES2015, CommonJS, or RequireJS.
     *
     * You need only call the `.use()` function once per project, per extension, as module loaders
     * will cache a single reference to MixItUp inclusive of all changes made.
     *
     * @example
     * mixitup.use(extension)
     *
     * @example <caption>Example 1: Extending MixItUp with the Pagination Extension</caption>
     *
     * import mixitup from 'mixitup';
     * import mixitupPagination from 'mixitup-pagination';
     *
     * mixitup.use(mixitupPagination);
     *
     * // All mixers created by the factory function in all modules will now
     * // have pagination functionality
     *
     * var mixer = mixitup('.container');
     *
     * @public
     * @name     use
     * @memberof mixitup
     * @kind     function
     * @static
     * @since    3.0.0
     * @param    {*}  extension   A reference to the extension or library to be used.
     * @return   {void}
     */

    mixitup.use = function(extension) {
        mixitup.Base.prototype.callActions.call(mixitup, 'beforeUse', arguments);

        // Call the extension's factory function, passing
        // the mixitup factory as a paramater

        if (typeof extension === 'function' && extension.TYPE === 'mixitup-extension') {
            // Mixitup extension

            if (typeof mixitup.extensions[extension.NAME] === 'undefined') {
                extension(mixitup);

                mixitup.extensions[extension.NAME] = extension;
            }
        } else if (extension.fn && extension.fn.jquery) {
            // jQuery

            mixitup.libraries.$ = extension;
        }

        mixitup.Base.prototype.callActions.call(mixitup, 'afterUse', arguments);
    };

    mixitup.instances   = {};
    mixitup.extensions  = {};
    mixitup.libraries   = {};

    /**
     * @private
     */

    h = {

        /**
         * @private
         * @param   {HTMLElement}   el
         * @param   {string}        cls
         * @return  {boolean}
         */

        hasClass: function(el, cls) {
            return !!el.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
        },

        /**
         * @private
         * @param   {HTMLElement}   el
         * @param   {string}        cls
         * @return  {void}
         */

        addClass: function(el, cls) {
            if (!this.hasClass(el, cls)) el.className += el.className ? ' ' + cls : cls;
        },

        /**
         * @private
         * @param   {HTMLElement}   el
         * @param   {string}        cls
         * @return  {void}
         */

        removeClass: function(el, cls) {
            if (this.hasClass(el, cls)) {
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');

                el.className = el.className.replace(reg, ' ').trim();
            }
        },

        /**
         * Merges the properties of the source object onto the
         * target object. Alters the target object.
         *
         * @private
         * @param   {object}    destination
         * @param   {object}    source
         * @param   {boolean}   [deep=false]
         * @param   {boolean}   [handleErrors=false]
         * @return  {void}
         */

        extend: function(destination, source, deep, handleErrors) {
            var sourceKeys  = [],
                key         = '',
                i           = -1;

            deep = deep || false;
            handleErrors = handleErrors || false;

            try {
                if (Array.isArray(source)) {
                    for (i = 0; i < source.length; i++) {
                        sourceKeys.push(i);
                    }
                } else if (source) {
                    sourceKeys = Object.keys(source);
                }

                for (i = 0; i < sourceKeys.length; i++) {
                    key = sourceKeys[i];

                    if (!deep || typeof source[key] !== 'object' || this.isElement(source[key])) {
                        // All non-object properties, or all properties if shallow extend

                        destination[key] = source[key];
                    } else if (Array.isArray(source[key])) {
                        // Arrays

                        if (!destination[key]) {
                            destination[key] = [];
                        }

                        this.extend(destination[key], source[key], deep, handleErrors);
                    } else {
                        // Objects

                        if (!destination[key]) {
                            destination[key] = {};
                        }

                        this.extend(destination[key], source[key], deep, handleErrors);
                    }
                }
            } catch(err) {
                if (handleErrors) {
                    this.handleExtendError(err, destination);
                } else {
                    throw err;
                }
            }

            return destination;
        },

        /**
         * @private
         * @param   {Error}  err
         * @param   {object} destination
         * @return  {void}
         */

        handleExtendError: function(err, destination) {
            var re                  = /property "?(\w*)"?[,:] object/i,
                matches             = null,
                erroneous           = '',
                message             = '',
                suggestion          = '',
                probableMatch       = '',
                key                 = '',
                mostMatchingChars   = -1,
                i                   = -1;

            if (err instanceof TypeError && (matches = re.exec(err.message))) {
                erroneous = matches[1];

                for (key in destination) {
                    i = 0;

                    while (i < erroneous.length && erroneous.charAt(i) === key.charAt(i)) {
                        i++;
                    }

                    if (i > mostMatchingChars) {
                        mostMatchingChars = i;
                        probableMatch = key;
                    }
                }

                if (mostMatchingChars > 1) {
                    suggestion = mixitup.messages.errorConfigInvalidPropertySuggestion({
                        probableMatch: probableMatch
                    });
                }

                message = mixitup.messages.errorConfigInvalidProperty({
                    erroneous: erroneous,
                    suggestion: suggestion
                });

                throw new TypeError(message);
            }

            throw err;
        },

        /**
         * @private
         * @param   {string} str
         * @return  {function}
         */

        template: function(str) {
            var re          = /\${([\w]*)}/g,
                dynamics    = {},
                matches     = null;

            while ((matches = re.exec(str))) {
                dynamics[matches[1]] = new RegExp('\\${' + matches[1] + '}', 'g');
            }

            return function(data) {
                var key     = '',
                    output  = str;

                data = data || {};

                for (key in dynamics) {
                    output = output.replace(dynamics[key], typeof data[key] !== 'undefined' ? data[key] : '');
                }

                return output;
            };
        },

        /**
         * @private
         * @param   {HTMLElement}   el
         * @param   {string}        type
         * @param   {function}      fn
         * @param   {boolean}       useCapture
         * @return  {void}
         */

        on: function(el, type, fn, useCapture) {
            if (!el) return;

            if (el.addEventListener) {
                el.addEventListener(type, fn, useCapture);
            } else if (el.attachEvent) {
                el['e' + type + fn] = fn;

                el[type + fn] = function() {
                    el['e' + type + fn](window.event);
                };

                el.attachEvent('on' + type, el[type + fn]);
            }
        },

        /**
         * @private
         * @param   {HTMLElement}   el
         * @param   {string}        type
         * @param   {function}      fn
         * @return  {void}
         */

        off: function(el, type, fn) {
            if (!el) return;

            if (el.removeEventListener) {
                el.removeEventListener(type, fn, false);
            } else if (el.detachEvent) {
                el.detachEvent('on' + type, el[type + fn]);
                el[type + fn] = null;
            }
        },

        /**
         * @private
         * @param   {string}      eventType
         * @param   {object}      detail
         * @param   {Document}    [doc]
         * @return  {CustomEvent}
         */

        getCustomEvent: function(eventType, detail, doc) {
            var event = null;

            doc = doc || window.document;

            if (typeof window.CustomEvent === 'function') {
                event = new window.CustomEvent(eventType, {
                    detail: detail,
                    bubbles: true,
                    cancelable: true
                });
            } else if (typeof doc.createEvent === 'function') {
                event = doc.createEvent('CustomEvent');
                event.initCustomEvent(eventType, true, true, detail);
            } else {
                event = doc.createEventObject(), event.type = eventType;

                event.returnValue = false;
                event.cancelBubble = false;
                event.detail = detail;
            }

            return event;
        },

        /**
         * @private
         * @param   {Event} e
         * @return  {Event}
         */

        getOriginalEvent: function(e) {
            if (e.touches && e.touches.length) {
                return e.touches[0];
            } else if (e.changedTouches && e.changedTouches.length) {
                return e.changedTouches[0];
            } else {
                return e;
            }
        },

        /**
         * @private
         * @param   {HTMLElement}   el
         * @param   {string}        selector
         * @return  {Number}
         */

        index: function(el, selector) {
            var i = 0;

            while ((el = el.previousElementSibling) !== null) {
                if (!selector || el.matches(selector)) {
                    ++i;
                }
            }

            return i;
        },

        /**
         * Converts a dash or snake-case string to camel case.
         *
         * @private
         * @param   {string}    str
         * @param   {boolean}   [isPascal]
         * @return  {string}
         */

        camelCase: function(str) {
            return str.toLowerCase().replace(/([_-][a-z])/g, function($1) {
                return $1.toUpperCase().replace(/[_-]/, '');
            });
        },

        /**
         * Converts a dash or snake-case string to pascal case.
         *
         * @private
         * @param   {string}    str
         * @param   {boolean}   [isPascal]
         * @return  {string}
         */

        pascalCase: function(str) {
            return (str = this.camelCase(str)).charAt(0).toUpperCase() + str.slice(1);
        },

        /**
         * Converts a camel or pascal-case string to dash case.
         *
         * @private
         * @param   {string}    str
         * @return  {string}
         */

        dashCase: function(str) {
            return str.replace(/([A-Z])/g, '-$1').replace(/^-/, '').toLowerCase();
        },

        /**
         * @private
         * @param   {HTMLElement}       el
         * @param   {HTMLHtmlElement}   [doc]
         * @return  {boolean}
         */

        isElement: function(el, doc) {
            doc = doc || window.document;

            if (
                window.HTMLElement &&
                el instanceof window.HTMLElement
            ) {
                return true;
            } else if (
                doc.defaultView &&
                doc.defaultView.HTMLElement &&
                el instanceof doc.defaultView.HTMLElement
            ) {
                return true;
            } else {
                return (
                    el !== null &&
                    el.nodeType === 1 &&
                    typeof el.nodeName === 'string'
                );
            }
        },

        /**
         * @private
         * @param   {string}            htmlString
         * @param   {HTMLHtmlElement}   [doc]
         * @return  {DocumentFragment}
         */

        createElement: function(htmlString, doc) {
            var frag = null,
                temp = null;

            doc = doc || window.document;

            frag = doc.createDocumentFragment();
            temp = doc.createElement('div');

            temp.innerHTML = htmlString.trim();

            while (temp.firstChild) {
                frag.appendChild(temp.firstChild);
            }

            return frag;
        },

        /**
         * @private
         * @param   {Node} node
         * @return  {void}
         */

        removeWhitespace: function(node) {
            var deleting;

            while (node && node.nodeName === '#text') {
                deleting = node;

                node = node.previousSibling;

                deleting.parentElement && deleting.parentElement.removeChild(deleting);
            }
        },

        /**
         * @private
         * @param   {Array<*>}  a
         * @param   {Array<*>}  b
         * @return  {boolean}
         */

        isEqualArray: function(a, b) {
            var i = a.length;

            if (i !== b.length) return false;

            while (i--) {
                if (a[i] !== b[i]) return false;
            }

            return true;
        },

        /**
         * @private
         * @param   {object}  a
         * @param   {object}  b
         * @return  {boolean}
         */

        deepEquals: function(a, b) {
            var key;

            if (typeof a === 'object' && a && typeof b === 'object' && b) {
                if (Object.keys(a).length !== Object.keys(b).length) return false;

                for (key in a) {
                    if (!b.hasOwnProperty(key) || !this.deepEquals(a[key], b[key])) return false;
                }
            } else if (a !== b) {
                return false;
            }

            return true;
        },

        /**
         * @private
         * @param   {Array<*>}  oldArray
         * @return  {Array<*>}
         */

        arrayShuffle: function(oldArray) {
            var newArray    = oldArray.slice(),
                len         = newArray.length,
                i           = len,
                p           = -1,
                t           = [];

            while (i--) {
                p = ~~(Math.random() * len);
                t = newArray[i];

                newArray[i] = newArray[p];
                newArray[p] = t;
            }

            return newArray;
        },

        /**
         * @private
         * @param   {object}    list
         */

        arrayFromList: function(list) {
            var output, i;

            try {
                return Array.prototype.slice.call(list);
            } catch(err) {
                output = [];

                for (i = 0; i < list.length; i++) {
                    output.push(list[i]);
                }

                return output;
            }
        },

        /**
         * @private
         * @param   {function}  func
         * @param   {Number}    wait
         * @param   {boolean}   immediate
         * @return  {function}
         */

        debounce: function(func, wait, immediate) {
            var timeout;

            return function() {
                var self     = this,
                    args     = arguments,
                    callNow  = immediate && !timeout,
                    later    = null;

                later = function() {
                    timeout  = null;

                    if (!immediate) {
                        func.apply(self, args);
                    }
                };

                clearTimeout(timeout);

                timeout = setTimeout(later, wait);

                if (callNow) func.apply(self, args);
            };
        },

        /**
         * @private
         * @param   {HTMLElement}   element
         * @return  {object}
         */

        position: function(element) {
            var xPosition       = 0,
                yPosition       = 0,
                offsetParent    = element;

            while (element) {
                xPosition -= element.scrollLeft;
                yPosition -= element.scrollTop;

                if (element === offsetParent) {
                    xPosition += element.offsetLeft;
                    yPosition += element.offsetTop;

                    offsetParent = element.offsetParent;
                }

                element = element.parentElement;
            }

            return {
                x: xPosition,
                y: yPosition
            };
        },

        /**
         * @private
         * @param   {object}    node1
         * @param   {object}    node2
         * @return  {Number}
         */

        getHypotenuse: function(node1, node2) {
            var distanceX = node1.x - node2.x,
                distanceY = node1.y - node2.y;

            distanceX = distanceX < 0 ? distanceX * -1 : distanceX, distanceY = distanceY < 0 ? distanceY * -1 : distanceY;

            return Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
        },

        /**
         * Calcuates the area of intersection between two rectangles and expresses it as
         * a ratio in comparison to the area of the first rectangle.
         *
         * @private
         * @param   {Rect}  box1
         * @param   {Rect}  box2
         * @return  {number}
         */

        getIntersectionRatio: function(box1, box2) {
            var controlArea         = box1.width * box1.height,
                intersectionX       = -1,
                intersectionY       = -1,
                intersectionArea    = -1,
                ratio               = -1;

            intersectionX =
                Math.max(0, Math.min(box1.left + box1.width, box2.left + box2.width) - Math.max(box1.left, box2.left));

            intersectionY =
                Math.max(0, Math.min(box1.top + box1.height, box2.top + box2.height) - Math.max(box1.top, box2.top));

            intersectionArea = intersectionY * intersectionX;

            ratio = intersectionArea / controlArea;

            return ratio;
        },

        /**
         * @private
         * @param   {object}            el
         * @param   {string}            selector
         * @param   {boolean}           [includeSelf]
         * @param   {HTMLHtmlElement}   [doc]
         * @return  {Element|null}
         */

        closestParent: function(el, selector, includeSelf, doc) {
            var parent  = el.parentNode;

            doc = doc || window.document;

            if (includeSelf && el.matches(selector)) {
                return el;
            }

            while (parent && parent != doc.body) {
                if (parent.matches && parent.matches(selector)) {
                    return parent;
                } else if (parent.parentNode) {
                    parent = parent.parentNode;
                } else {
                    return null;
                }
            }

            return null;
        },

        /**
         * @private
         * @param   {HTMLElement}       el
         * @param   {string}            selector
         * @param   {HTMLHtmlElement}   [doc]
         * @return  {NodeList}
         */

        children: function(el, selector, doc) {
            var children    = [],
                tempId      = '';

            doc = doc || window.doc;

            if (el) {
                if (!el.id) {
                    tempId = 'Temp' + this.randomHexKey();

                    el.id = tempId;
                }

                children = doc.querySelectorAll('#' + el.id + ' > ' + selector);

                if (tempId) {
                    el.removeAttribute('id');
                }
            }

            return children;
        },

        /**
         * Creates a clone of a provided array, with any empty strings removed.
         *
         * @private
         * @param   {Array<*>} originalArray
         * @return  {Array<*>}
         */

        clean: function(originalArray) {
            var cleanArray = [],
                i = -1;

            for (i = 0; i < originalArray.length; i++) {
                if (originalArray[i] !== '') {
                    cleanArray.push(originalArray[i]);
                }
            }

            return cleanArray;
        },

        /**
         * Abstracts an ES6 promise into a q-like deferred interface for storage and deferred resolution.
         *
         * @private
         * @param  {object} libraries
         * @return {h.Deferred}
         */

        defer: function(libraries) {
            var deferred       = null,
                promiseWrapper = null,
                $              = null;

            promiseWrapper = new this.Deferred();

            if (mixitup.features.has.promises) {
                // ES6 native promise or polyfill

                promiseWrapper.promise = new Promise(function(resolve, reject) {
                    promiseWrapper.resolve = resolve;
                    promiseWrapper.reject  = reject;
                });
            } else if (($ = (window.jQuery || libraries.$)) && typeof $.Deferred === 'function') {
                // jQuery

                deferred = $.Deferred();

                promiseWrapper.promise = deferred.promise();
                promiseWrapper.resolve = deferred.resolve;
                promiseWrapper.reject  = deferred.reject;
            } else if (window.console) {
                // No implementation

                console.warn(mixitup.messages.warningNoPromiseImplementation());
            }

            return promiseWrapper;
        },

        /**
         * @private
         * @param   {Array<Promise>}    tasks
         * @param   {object}            libraries
         * @return  {Promise<Array>}
         */

        all: function(tasks, libraries) {
            var $ = null;

            if (mixitup.features.has.promises) {
                return Promise.all(tasks);
            } else if (($ = (window.jQuery || libraries.$)) && typeof $.when === 'function') {
                return $.when.apply($, tasks)
                    .done(function() {
                        // jQuery when returns spread arguments rather than an array or resolutions

                        return arguments;
                    });
            }

            // No implementation

            if (window.console) {
                console.warn(mixitup.messages.warningNoPromiseImplementation());
            }

            return [];
        },

        /**
         * @private
         * @param   {HTMLElement}   el
         * @param   {string}        property
         * @param   {Array<string>} vendors
         * @return  {string}
         */

        getPrefix: function(el, property, vendors) {
            var i       = -1,
                prefix  = '';

            if (h.dashCase(property) in el.style) return '';

            for (i = 0; prefix = vendors[i]; i++) {
                if (prefix + property in el.style) {
                    return prefix.toLowerCase();
                }
            }

            return 'unsupported';
        },

        /**
         * @private
         * @return  {string}
         */

        randomHex: function() {
            return ('00000' + (Math.random() * 16777216 << 0).toString(16)).substr(-6).toUpperCase();
        },

        /**
         * @private
         * @param   {HTMLDocument}  [doc]
         * @return  {object}
         */

        getDocumentState: function(doc) {
            doc = typeof doc.body === 'object' ? doc : window.document;

            return {
                scrollTop: window.pageYOffset,
                scrollLeft: window.pageXOffset,
                docHeight: doc.documentElement.scrollHeight,
                docWidth: doc.documentElement.scrollWidth,
                viewportHeight: doc.documentElement.clientHeight,
                viewportWidth: doc.documentElement.clientWidth
            };
        },

        /**
         * @private
         * @param   {object}    obj
         * @param   {function}  fn
         * @return  {function}
         */

        bind: function(obj, fn) {
            return function() {
                return fn.apply(obj, arguments);
            };
        },

        /**
         * @private
         * @param   {HTMLElement}   el
         * @return  {boolean}
         */

        isVisible: function(el) {
            var styles = null;

            if (el.offsetParent) return true;

            styles = window.getComputedStyle(el);

            if (
                styles.position === 'fixed' &&
                styles.visibility !== 'hidden' &&
                styles.opacity !== '0'
            ) {
                // Fixed elements report no offsetParent,
                // but may still be invisible

                return true;
            }

            return false;
        },

        /**
         * @private
         * @param   {object}    obj
         */

        seal: function(obj) {
            if (typeof Object.seal === 'function') {
                Object.seal(obj);
            }
        },

        /**
         * @private
         * @param   {object}    obj
         */

        freeze: function(obj) {
            if (typeof Object.freeze === 'function') {
                Object.freeze(obj);
            }
        },

        /**
         * @private
         * @param   {string}    control
         * @param   {string}    specimen
         * @return  {boolean}
         */

        compareVersions: function(control, specimen) {
            var controlParts    = control.split('.'),
                specimenParts   = specimen.split('.'),
                controlPart     = -1,
                specimenPart    = -1,
                i               = -1;

            for (i = 0; i < controlParts.length; i++) {
                controlPart     = parseInt(controlParts[i].replace(/[^\d.]/g, ''));
                specimenPart    = parseInt(specimenParts[i].replace(/[^\d.]/g, '') || 0);

                if (specimenPart < controlPart) {
                    return false;
                } else if (specimenPart > controlPart) {
                    return true;
                }
            }

            return true;
        },

        /**
         * @private
         * @constructor
         */

        Deferred: function() {
            this.promise    = null;
            this.resolve    = null;
            this.reject     = null;
            this.id         = h.randomHex();
        },

        /**
         * @private
         * @param   {object}  obj
         * @return  {boolean}
         */

        isEmptyObject: function(obj) {
            var key = '';

            if (typeof Object.keys === 'function') {
                return Object.keys(obj).length === 0;
            }

            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    return false;
                }
            }

            return true;
        },

        /**
         * @param   {mixitup.Config.ClassNames}   classNames
         * @param   {string}                      elementName
         * @param   {string}                      [modifier]
         * @return  {string}
         */

        getClassname: function(classNames, elementName, modifier) {
            var classname = '';

            classname += classNames.block;

            if (classname.length) {
                classname += classNames.delineatorElement;
            }

            classname += classNames['element' + this.pascalCase(elementName)];

            if (!modifier) return classname;

            if (classname.length) {
                classname += classNames.delineatorModifier;
            }

            classname += modifier;

            return classname;
        },

        /**
         * Returns the value of a property on a given object via its string key.
         *
         * @param   {object}    obj
         * @param   {string}    stringKey
         * @return  {*} value
         */

        getProperty: function(obj, stringKey) {
            var parts           = stringKey.split('.'),
                returnCurrent   = null,
                current         = '',
                i               = 0;

            if (!stringKey) {
                return obj;
            }

            returnCurrent = function(obj) {
                if (!obj) {
                    return null;
                } else {
                    return obj[current];
                }
            };

            while (i < parts.length) {
                current = parts[i];

                obj = returnCurrent(obj);

                i++;
            }

            if (typeof obj !== 'undefined') {
                return obj;
            } else {
                return null;
            }
        }
    };

    mixitup.h = h;

    /**
     * The Base class adds instance methods to all other extensible MixItUp classes,
     * enabling the calling of any registered hooks.
     *
     * @constructor
     * @namespace
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.Base = function() {};

    mixitup.Base.prototype = {
        constructor: mixitup.Base,

        /**
         * Calls any registered hooks for the provided action.
         *
         * @memberof    mixitup.Base
         * @private
         * @instance
         * @since       2.0.0
         * @param       {string}    actionName
         * @param       {Array<*>}  args
         * @return      {void}
         */

        callActions: function(actionName, args) {
            var self            = this,
                hooks           = self.constructor.actions[actionName],
                extensionName   = '';

            if (!hooks || h.isEmptyObject(hooks)) return;

            for (extensionName in hooks) {
                hooks[extensionName].apply(self, args);
            }
        },

        /**
         * Calls any registered hooks for the provided filter.
         *
         * @memberof    mixitup.Base
         * @private
         * @instance
         * @since       2.0.0
         * @param       {string}    filterName
         * @param       {*}         input
         * @param       {Array<*>}  args
         * @return      {*}
         */

        callFilters: function(filterName, input, args) {
            var self            = this,
                hooks           = self.constructor.filters[filterName],
                output          = input,
                extensionName   = '';

            if (!hooks || h.isEmptyObject(hooks)) return output;

            args = args || [];

            for (extensionName in hooks) {
                args = h.arrayFromList(args);

                args.unshift(output);

                output = hooks[extensionName].apply(self, args);
            }

            return output;
        }
    };

    /**
     * The BaseStatic class holds a set of static methods which are then added to all other
     * extensible MixItUp classes as a means of integrating extensions via the addition of new
     * methods and/or actions and hooks.
     *
     * @constructor
     * @namespace
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.BaseStatic = function() {
        this.actions = {};
        this.filters = {};

        /**
         * Performs a shallow extend on the class's prototype, adding one or more new members to
         * the class in a single operation.
         *
         * @memberof    mixitup.BaseStatic
         * @public
         * @static
         * @since       2.1.0
         * @param       {object} extension
         * @return      {void}
         */

        this.extend = function(extension) {
            h.extend(this.prototype, extension);
        };

        /**
         * Registers a function to be called on the action hook of the provided name.
         *
         * @memberof    mixitup.BaseStatic
         * @public
         * @static
         * @since       2.1.0
         * @param       {string}    hookName
         * @param       {string}    extensionName
         * @param       {function}  func
         * @return      {void}
         */

        this.registerAction = function(hookName, extensionName, func) {
            (this.actions[hookName] = this.actions[hookName] || {})[extensionName] = func;
        };

        /**
         * Registers a function to be called on the filter of the provided name.
         *
         * @memberof    mixitup.BaseStatic
         * @public
         * @static
         * @since       2.1.0
         * @param       {string}    hookName
         * @param       {string}    extensionName
         * @param       {function}  func
         * @return      {void}
         */

        this.registerFilter = function(hookName, extensionName, func) {
            (this.filters[hookName] = this.filters[hookName] || {})[extensionName] = func;
        };
    };

    /**
     * The `mixitup.Features` class performs all feature and CSS prefix detection
     * neccessary for MixItUp to function correctly, as well as storing various
     * string and array constants. All feature decection is on evaluation of the
     * library and stored in a singleton instance for use by other internal classes.
     *
     * @constructor
     * @namespace
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.Features = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        this.boxSizingPrefix            = '';
        this.transformPrefix            = '';
        this.transitionPrefix           = '';

        this.boxSizingPrefix            = '';
        this.transformProp              = '';
        this.transformRule              = '';
        this.transitionProp             = '';
        this.perspectiveProp            = '';
        this.perspectiveOriginProp      = '';

        this.has                        = new mixitup.Has();

        this.canary                     = null;

        this.BOX_SIZING_PROP            = 'boxSizing';
        this.TRANSITION_PROP            = 'transition';
        this.TRANSFORM_PROP             = 'transform';
        this.PERSPECTIVE_PROP           = 'perspective';
        this.PERSPECTIVE_ORIGIN_PROP    = 'perspectiveOrigin';
        this.VENDORS                    = ['Webkit', 'moz', 'O', 'ms'];

        this.TWEENABLE = [
            'opacity',
            'width', 'height',
            'marginRight', 'marginBottom',
            'x', 'y',
            'scale',
            'translateX', 'translateY', 'translateZ',
            'rotateX', 'rotateY', 'rotateZ'
        ];

        this.callActions('afterConstruct');
    };

    mixitup.BaseStatic.call(mixitup.Features);

    mixitup.Features.prototype = Object.create(mixitup.Base.prototype);

    h.extend(mixitup.Features.prototype,
    /** @lends mixitup.Features */
    {
        constructor: mixitup.Features,

        /**
         * @private
         * @return  {void}
         */

        init: function() {
            var self = this;

            self.callActions('beforeInit', arguments);

            self.canary = document.createElement('div');

            self.setPrefixes();
            self.runTests();

            self.callActions('beforeInit', arguments);
        },

        /**
         * @private
         * @return  {void}
         */

        runTests: function() {
            var self = this;

            self.callActions('beforeRunTests', arguments);

            self.has.promises       = typeof window.Promise === 'function';
            self.has.transitions    = self.transitionPrefix !== 'unsupported';

            self.callActions('afterRunTests', arguments);

            h.freeze(self.has);
        },

        /**
         * @private
         * @return  {void}
         */

        setPrefixes: function() {
            var self = this;

            self.callActions('beforeSetPrefixes', arguments);

            self.transitionPrefix   = h.getPrefix(self.canary, 'Transition', self.VENDORS);
            self.transformPrefix    = h.getPrefix(self.canary, 'Transform', self.VENDORS);
            self.boxSizingPrefix    = h.getPrefix(self.canary, 'BoxSizing', self.VENDORS);

            self.boxSizingProp = self.boxSizingPrefix ?
                self.boxSizingPrefix + h.pascalCase(self.BOX_SIZING_PROP) : self.BOX_SIZING_PROP;

            self.transitionProp = self.transitionPrefix ?
                self.transitionPrefix + h.pascalCase(self.TRANSITION_PROP) : self.TRANSITION_PROP;

            self.transformProp = self.transformPrefix ?
                self.transformPrefix + h.pascalCase(self.TRANSFORM_PROP) : self.TRANSFORM_PROP;

            self.transformRule = self.transformPrefix ?
                '-' + self.transformPrefix + '-' + self.TRANSFORM_PROP : self.TRANSFORM_PROP;

            self.perspectiveProp = self.transformPrefix ?
                self.transformPrefix + h.pascalCase(self.PERSPECTIVE_PROP) : self.PERSPECTIVE_PROP;

            self.perspectiveOriginProp = self.transformPrefix ?
                self.transformPrefix + h.pascalCase(self.PERSPECTIVE_ORIGIN_PROP) :
                self.PERSPECTIVE_ORIGIN_PROP;

            self.callActions('afterSetPrefixes', arguments);
        }
    });

    /**
     * @constructor
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.Has = function() {
        this.transitions    = false;
        this.promises       = false;

        h.seal(this);
    };

    // Assign a singleton instance to `mixitup.features` and initialise:

    mixitup.features = new mixitup.Features();

    mixitup.features.init();

    /**
     * A group of properties defining the mixer's animation and effects settings.
     *
     * @constructor
     * @memberof    mixitup.Config
     * @name        animation
     * @namespace
     * @public
     * @since       2.0.0
     */

    mixitup.ConfigAnimation = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        /**
         * A boolean dictating whether or not animation should be enabled for the MixItUp instance.
         * If `false`, all operations will occur instantly and syncronously, although callback
         * functions and any returned promises will still be fulfilled.
         *
         * @example <caption>Example: Create a mixer with all animations disabled</caption>
         * var mixer = mixitup(containerEl, {
         *     animation: {
         *         enable: false
         *     }
         * });
         *
         * @name        enable
         * @memberof    mixitup.Config.animation
         * @instance
         * @type        {boolean}
         * @default     true
         */

        this.enable = true;

        /**
         * A string of one or more space-seperated properties to which transitions will be
         * applied for all filtering animations.
         *
         * Properties can be listed any order or combination, although they will be applied in a specific
         * predefined order to produce consistent results.
         *
         * To learn more about available effects, experiment with our <a href="https://www.kunkalabs.com/mixitup/">
         * sandbox demo</a> and try out the "Export config" button in the Animation options drop down.
         *
         * @example <caption>Example: Apply "fade" and "translateZ" effects to all animations</caption>
         * // As targets are filtered in and out, they will fade between
         * // opacity 1 and 0 and transform between translateZ(-100px) and
         * // translateZ(0).
         *
         * var mixer = mixitup(containerEl, {
         *     animation: {
         *         effects: 'fade translateZ(-100px)'
         *     }
         * });
         *
         * @name        effects
         * @memberof    mixitup.Config.animation
         * @instance
         * @type        {string}
         * @default     'fade scale'
         */

        this.effects = 'fade scale';

        /**
         * A string of one or more space-seperated effects to be applied only to filter-in
         * animations, overriding `config.animation.effects` if set.
         *
         * @example <caption>Example: Apply downwards vertical translate to targets being filtered in</caption>
         *
         * var mixer = mixitup(containerEl, {
         *     animation: {
         *         effectsIn: 'fade translateY(-100%)'
         *     }
         * });
         *
         * @name        effectsIn
         * @memberof    mixitup.Config.animation
         * @instance
         * @type        {string}
         * @default     ''
         */

        this.effectsIn = '';

        /**
         * A string of one or more space-seperated effects to be applied only to filter-out
         * animations, overriding `config.animation.effects` if set.
         *
         * @example <caption>Example: Apply upwards vertical translate to targets being filtered out</caption>
         *
         * var mixer = mixitup(containerEl, {
         *     animation: {
         *         effectsOut: 'fade translateY(-100%)'
         *     }
         * });
         *
         * @name        effectsOut
         * @memberof    mixitup.Config.animation
         * @instance
         * @type        {string}
         * @default     ''
         */

        this.effectsOut = '';

        /**
         * An integer dictating the duration of all MixItUp animations in milliseconds, not
         * including any additional delay apllied via the `'stagger'` effect.
         *
         * @example <caption>Example: Apply an animation duration of 200ms to all mixitup animations</caption>
         *
         * var mixer = mixitup(containerEl, {
         *     animation: {
         *         duration: 200
         *     }
         * });
         *
         * @name        duration
         * @memberof    mixitup.Config.animation
         * @instance
         * @type        {number}
         * @default     600
         */

        this.duration = 600;

        /**
         * A valid CSS3 transition-timing function or shorthand. For a full list of accepted
         * values, visit <a href="http://easings.net" target="_blank">easings.net</a>.
         *
         * @example <caption>Example 1: Apply "ease-in-out" easing to all animations</caption>
         *
         * var mixer = mixitup(containerEl, {
         *     animation: {
         *         easing: 'ease-in-out'
         *     }
         * });
         *
         * @example <caption>Example 2: Apply a custom "cubic-bezier" easing function to all animations</caption>
         * var mixer = mixitup(containerEl, {
         *     animation: {
         *         easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)'
         *     }
         * });
         *
         * @name        easing
         * @memberof    mixitup.Config.animation
         * @instance
         * @type        {string}
         * @default     'ease'
         */

        this.easing = 'ease';

        /**
         * A boolean dictating whether or not to apply perspective to the MixItUp container
         * during animations. By default, perspective is always applied and creates the
         * illusion of three-dimensional space for effects such as `translateZ`, `rotateX`,
         * and `rotateY`.
         *
         * You may wish to disable this and define your own perspective settings via CSS.
         *
         * @example <caption>Example: Prevent perspective from being applied to any 3D transforms</caption>
         * var mixer = mixitup(containerEl, {
         *     animation: {
         *         applyPerspective: false
         *     }
         * });
         *
         * @name        applyPerspective
         * @memberof    mixitup.Config.animation
         * @instance
         * @type        {bolean}
         * @default     true
         */

        this.applyPerspective = true;

        /**
         * The perspective distance value to be applied to the container during animations,
         * affecting any 3D-transform-based effects.
         *
         * @example <caption>Example: Set a perspective distance of 2000px</caption>
         * var mixer = mixitup(containerEl, {
         *     animation: {
         *         effects: 'rotateY(-25deg)',
         *         perspectiveDistance: '2000px'
         *     }
         * });
         *
         * @name        perspectiveDistance
         * @memberof    mixitup.Config.animation
         * @instance
         * @type        {string}
         * @default     '3000px'
         */

        this.perspectiveDistance = '3000px';

        /**
         * The perspective-origin value to be applied to the container during animations,
         * affecting any 3D-transform-based effects.
         *
         * @example <caption>Example: Set a perspective origin in the top-right of the container</caption>
         * var mixer = mixitup(containerEl, {
         *     animation: {
         *         effects: 'transateZ(-200px)',
         *         perspectiveOrigin: '100% 0'
         *     }
         * });
         *
         * @name        perspectiveOrigin
         * @memberof    mixitup.Config.animation
         * @instance
         * @type        {string}
         * @default     '50% 50%'
         */

        this.perspectiveOrigin = '50% 50%';

        /**
         * A boolean dictating whether or not to enable the queuing of operations.
         *
         * If `true` (default), and a control is clicked or an API call is made while another
         * operation is progress, the operation will go into the queue and will be automatically exectuted
         * when the previous operaitons is finished.
         *
         * If `false`, any requested operations will be ignored, and the `onMixBusy` callback and `mixBusy`
         * event will be fired. If `debug.showWarnings` is enabled, a console warning will also occur.
         *
         * @example <caption>Example: Disable queuing</caption>
         * var mixer = mixitup(containerEl, {
         *     animation: {
         *         queue: false
         *     }
         * });
         *
         * @name        queue
         * @memberof    mixitup.Config.animation
         * @instance
         * @type        {boolean}
         * @default     true
         */

        this.queue = true;

        /**
         * An integer dictacting the maximum number of operations allowed in the queue at
         * any time, when queuing is enabled.
         *
         * @example <caption>Example: Allow a maximum of 5 operations in the queue at any time</caption>
         * var mixer = mixitup(containerEl, {
         *     animation: {
         *         queueLimit: 5
         *     }
         * });
         *
         * @name        queueLimit
         * @memberof    mixitup.Config.animation
         * @instance
         * @type        {number}
         * @default     3
         */

        this.queueLimit = 3;

        /**
         * A boolean dictating whether or not to transition the height and width of the
         * container as elements are filtered in and out. If disabled, the container height
         * will change abruptly.
         *
         * It may be desirable to disable this on mobile devices as the CSS `height` and
         * `width` properties do not receive GPU-acceleration and can therefore cause stuttering.
         *
         * @example <caption>Example 1: Disable the transitioning of the container height and/or width</caption>
         * var mixer = mixitup(containerEl, {
         *     animation: {
         *         animateResizeContainer: false
         *     }
         * });
         *
         * @example <caption>Example 2: Disable the transitioning of the container height and/or width for mobile devices only</caption>
         * var mixer = mixitup(containerEl, {
         *     animation: {
         *         animateResizeContainer: myFeatureTests.isMobile ? false : true
         *     }
         * });
         *
         * @name        animateResizeContainer
         * @memberof    mixitup.Config.animation
         * @instance
         * @type        {boolean}
         * @default     true
         */

        this.animateResizeContainer = true;

        /**
         * A boolean dictating whether or not to transition the height and width of target
         * elements as they change throughout the course of an animation.
         *
         * This is often a must for flex-box grid layouts where the size of target elements may change
         * depending on final their position in relation to their siblings, or for `.changeLayout()`
         * operations where the size of targets change between layouts.
         *
         * NB: This feature requires additional calculations and manipulation to non-hardware-accelerated
         * properties which may adversely affect performance on slower devices, and is therefore
         * disabled by default.
         *
         * @example <caption>Example: Enable the transitioning of target widths and heights</caption>
         * var mixer = mixitup(containerEl, {
         *     animation: {
         *         animateResizeTargets: true
         *     }
         * });
         *
         * @name        animateResizeTargets
         * @memberof    mixitup.Config.animation
         * @instance
         * @type        {boolean}
         * @default     false
         */

        this.animateResizeTargets = false;

        /**
         * A custom function used to manipulate the order in which the stagger delay is
         * incremented when using the ‘stagger’ effect.
         *
         * When using the 'stagger' effect, the delay applied to each target element is incremented
         * based on its index. You may create a custom function to manipulate the order in which the
         * delay is incremented and create engaging non-linear stagger effects.
         *
         * The function receives the index of the target element as a parameter, and must
         * return an integer which serves as the multiplier for the stagger delay.
         *
         * @example <caption>Example 1: Stagger target elements by column in a 3-column grid</caption>
         * var mixer = mixitup(containerEl, {
         *     animation: {
         *         effects: 'fade stagger(100ms)',
         *         staggerSequence: function(i) {
         *             return i % 3;
         *         }
         *     }
         * });
         *
         * @example <caption>Example 2: Using an algorithm to produce a more complex sequence</caption>
         * var mixer = mixitup(containerEl, {
         *     animation: {
         *         effects: 'fade stagger(100ms)',
         *         staggerSequence: function(i) {
         *             return (2*i) - (5*((i/3) - ((1/3) * (i%3))));
         *         }
         *     }
         * });
         *
         * @name        staggerSequence
         * @memberof    mixitup.Config.animation
         * @instance
         * @type        {function}
         * @default     null
         */

        this.staggerSequence = null;

        /**
         * A boolean dictating whether or not to reverse the direction of `translate`
         * and `rotate` transforms for elements being filtered out.
         *
         * It can be used to create carousel-like animations where elements enter and exit
         * from opposite directions. If enabled, the effect `translateX(-100%)` for elements
         * being filtered in would become `translateX(100%)` for targets being filtered out.
         *
         * This functionality can also be achieved by providing seperate effects
         * strings for `config.animation.effectsIn` and `config.animation.effectsOut`.
         *
         * @example <caption>Example: Reverse the desired direction on any translate/rotate effect for targets being filtered out</caption>
         * // Elements being filtered in will be translated from '100%' to '0' while
         * // elements being filtered out will be translated from 0 to '-100%'
         *
         * var mixer = mixitup(containerEl, {
         *     animation: {
         *         effects: 'fade translateX(100%)',
         *         reverseOut: true,
         *         nudge: false // Disable nudging to create a carousel-like effect
         *     }
         * });
         *
         * @name        reverseOut
         * @memberof    mixitup.Config.animation
         * @instance
         * @type        {boolean}
         * @default     false
         */

        this.reverseOut = false;

        /**
         * A boolean dictating whether or not to "nudge" the animation path of targets
         * when they are being filtered in and out simulatenously.
         *
         * This has been the default behavior of MixItUp since version 1, but it
         * may be desirable to disable this effect when filtering directly from
         * one exclusive set of targets to a different exclusive set of targets,
         * to create a carousel-like effect, or a generally more subtle animation.
         *
         * @example <caption>Example: Disable the "nudging" of targets being filtered in and out simulatenously</caption>
         *
         * var mixer = mixitup(containerEl, {
         *     animation: {
         *         nudge: false
         *     }
         * });
         *
         * @name        nudge
         * @memberof    mixitup.Config.animation
         * @instance
         * @type        {boolean}
         * @default     true
         */

        this.nudge = true;

        /**
         * A boolean dictating whether or not to clamp the height of the container while MixItUp's
         * geometry tests are carried out before an operation.
         *
         * To prevent scroll-bar flicker, clamping is turned on by default. But in the case where the
         * height of the container might affect its vertical positioning in the viewport
         * (e.g. a vertically-centered container), this should be turned off to ensure accurate
         * test results and a smooth animation.
         *
         * @example <caption>Example: Disable container height-clamping</caption>
         *
         * var mixer = mixitup(containerEl, {
         *     animation: {
         *         clampHeight: false
         *     }
         * });
         *
         * @name        clampHeight
         * @memberof    mixitup.Config.animation
         * @instance
         * @type        {boolean}
         * @default     true
         */

        this.clampHeight = true;

        /**
         * A boolean dictating whether or not to clamp the width of the container while MixItUp's
         * geometry tests are carried out before an operation.
         *
         * To prevent scroll-bar flicker, clamping is turned on by default. But in the case where the
         * width of the container might affect its horitzontal positioning in the viewport
         * (e.g. a horizontall-centered container), this should be turned off to ensure accurate
         * test results and a smooth animation.
         *
         * @example <caption>Example: Disable container width-clamping</caption>
         *
         * var mixer = mixitup(containerEl, {
         *     animation: {
         *         clampWidth: false
         *     }
         * });
         *
         * @name        clampWidth
         * @memberof    mixitup.Config.animation
         * @instance
         * @type        {boolean}
         * @default     true
         */

        this.clampWidth = true;

        this.callActions('afterConstruct');

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.ConfigAnimation);

    mixitup.ConfigAnimation.prototype = Object.create(mixitup.Base.prototype);

    mixitup.ConfigAnimation.prototype.constructor = mixitup.ConfigAnimation;

    /**
     * A group of properties relating to the behavior of the Mixer.
     *
     * @constructor
     * @memberof    mixitup.Config
     * @name        behavior
     * @namespace
     * @public
     * @since       3.1.12
     */

    mixitup.ConfigBehavior = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        /**
         * A boolean dictating whether to allow "live" sorting of the mixer.
         *
         * Because of the expensive nature of sorting, MixItUp makes use of several
         * internal optimizations to skip redundant sorting operations, such as when
         * the newly requested sort command is the same as the active one. The caveat
         * to this optimization is that "live" edits to the value of a target's sorting
         * attribute will be ignored when requesting a re-sort by the same attribute.
         *
         * By setting to `behavior.liveSort` to `true`, the mixer will always re-sort
         * regardless of whether or not the sorting attribute and order have changed.
         *
         * @example <caption>Example: Enabling `liveSort` to allow for re-sorting</caption>
         *
         * var mixer = mixitup(containerEl, {
         *     behavior: {
         *         liveSort: true
         *     },
         *     load: {
         *         sort: 'edited:desc'
         *     }
         * });
         *
         * var target = containerEl.children[3];
         *
         * console.log(target.getAttribute('data-edited')); // '2015-04-24'
         *
         * target.setAttribute('data-edited', '2017-08-10'); // Update the target's edited date
         *
         * mixer.sort('edited:desc')
         *     .then(function(state) {
         *         // The target is now at the top of the list
         *
         *         console.log(state.targets[0] === target); // true
         *     });
         *
         * @name        liveSort
         * @memberof    mixitup.Config.behavior
         * @instance
         * @type        {boolean}
         * @default     false
         */

        this.liveSort = false;

        this.callActions('afterConstruct');

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.ConfigBehavior);

    mixitup.ConfigBehavior.prototype = Object.create(mixitup.Base.prototype);

    mixitup.ConfigBehavior.prototype.constructor = mixitup.ConfigBehavior;

    /**
     * A group of optional callback functions to be invoked at various
     * points within the lifecycle of a mixer operation.
     *
     * Each function is analogous to an event of the same name triggered from the
     * container element, and is invoked immediately after it.
     *
     * All callback functions receive the current `state` object as their first
     * argument, as well as other more specific arguments described below.
     *
     * @constructor
     * @memberof    mixitup.Config
     * @name        callbacks
     * @namespace
     * @public
     * @since       2.0.0
     */

    mixitup.ConfigCallbacks = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        /**
         * A callback function invoked immediately after any MixItUp operation is requested
         * and before animations have begun.
         *
         * A second `futureState` argument is passed to the function which represents the final
         * state of the mixer once the requested operation has completed.
         *
         * @example <caption>Example: Adding an `onMixStart` callback function</caption>
         * var mixer = mixitup(containerEl, {
         *     callbacks: {
         *         onMixStart: function(state, futureState) {
         *              console.log('Starting operation...');
         *         }
         *     }
         * });
         *
         * @name        onMixStart
         * @memberof    mixitup.Config.callbacks
         * @instance
         * @type        {function}
         * @default     null
         */

        this.onMixStart = null;

        /**
         * A callback function invoked when a MixItUp operation is requested while another
         * operation is in progress, and the animation queue is full, or queueing
         * is disabled.
         *
         * @example <caption>Example: Adding an `onMixBusy` callback function</caption>
         * var mixer = mixitup(containerEl, {
         *     callbacks: {
         *         onMixBusy: function(state) {
         *              console.log('Mixer busy');
         *         }
         *     }
         * });
         *
         * @name        onMixBusy
         * @memberof    mixitup.Config.callbacks
         * @instance
         * @type        {function}
         * @default     null
         */

        this.onMixBusy  = null;

        /**
         * A callback function invoked after any MixItUp operation has completed, and the
         * state has been updated.
         *
         * @example <caption>Example: Adding an `onMixEnd` callback function</caption>
         * var mixer = mixitup(containerEl, {
         *     callbacks: {
         *         onMixEnd: function(state) {
         *              console.log('Operation complete');
         *         }
         *     }
         * });
         *
         * @name        onMixEnd
         * @memberof    mixitup.Config.callbacks
         * @instance
         * @type        {function}
         * @default     null
         */

        this.onMixEnd   = null;

        /**
         * A callback function invoked whenever an operation "fails", i.e. no targets
         * could be found matching the requested filter.
         *
         * @example <caption>Example: Adding an `onMixFail` callback function</caption>
         * var mixer = mixitup(containerEl, {
         *     callbacks: {
         *         onMixFail: function(state) {
         *              console.log('No items could be found matching the requested filter');
         *         }
         *     }
         * });
         *
         * @name        onMixFail
         * @memberof    mixitup.Config.callbacks
         * @instance
         * @type        {function}
         * @default     null
         */

        this.onMixFail  = null;

        /**
         * A callback function invoked whenever a MixItUp control is clicked, and before its
         * respective operation is requested.
         *
         * The clicked element is assigned to the `this` keyword within the function. The original
         * click event is passed to the function as the second argument, which can be useful if
         * using `<a>` tags as controls where the default behavior needs to be prevented.
         *
         * Returning `false` from the callback will prevent the control click from triggering
         * an operation.
         *
         * @example <caption>Example 1: Adding an `onMixClick` callback function</caption>
         * var mixer = mixitup(containerEl, {
         *     callbacks: {
         *         onMixClick: function(state, originalEvent) {
         *              console.log('The control "' + this.innerText + '" was clicked');
         *         }
         *     }
         * });
         *
         * @example <caption>Example 2: Using `onMixClick` to manipulate the original click event</caption>
         * var mixer = mixitup(containerEl, {
         *     callbacks: {
         *         onMixClick: function(state, originalEvent) {
         *              // Prevent original click event from bubbling up:
         *              originalEvent.stopPropagation();
         *
         *              // Prevent default behavior of clicked element:
         *              originalEvent.preventDefault();
         *         }
         *     }
         * });
         *
         * @example <caption>Example 3: Using `onMixClick` to conditionally cancel operations</caption>
         * var mixer = mixitup(containerEl, {
         *     callbacks: {
         *         onMixClick: function(state, originalEvent) {
         *              // Perform some conditional check:
         *
         *              if (myApp.isLoading) {
         *                  // By returning false, we can prevent the control click from triggering an operation.
         *
         *                  return false;
         *              }
         *         }
         *     }
         * });
         *
         * @name        onMixClick
         * @memberof    mixitup.Config.callbacks
         * @instance
         * @type        {function}
         * @default     null
         */

        this.onMixClick = null;

        this.callActions('afterConstruct');

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.ConfigCallbacks);

    mixitup.ConfigCallbacks.prototype = Object.create(mixitup.Base.prototype);

    mixitup.ConfigCallbacks.prototype.constructor = mixitup.ConfigCallbacks;

    /**
     * A group of properties relating to clickable control elements.
     *
     * @constructor
     * @memberof    mixitup.Config
     * @name        controls
     * @namespace
     * @public
     * @since       2.0.0
     */

    mixitup.ConfigControls = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        /**
         * A boolean dictating whether or not controls should be enabled for the mixer instance.
         *
         * If `true` (default behavior), MixItUp will search the DOM for any clickable elements with
         * `data-filter`, `data-sort` or `data-toggle` attributes, and bind them for click events.
         *
         * If `false`, no click handlers will be bound, and all functionality must therefore be performed
         * via the mixer's API methods.
         *
         * If you do not intend to use the default controls, setting this property to `false` will
         * marginally improve the startup time of your mixer instance, and will also prevent any other active
         * mixer instances in the DOM which are bound to controls from controlling the instance.
         *
         * @example <caption>Example: Disabling controls</caption>
         * var mixer = mixitup(containerEl, {
         *     controls: {
         *         enable: false
         *     }
         * });
         *
         * // With the default controls disabled, we can only control
         * // the mixer via its API methods, e.g.:
         *
         * mixer.filter('.cat-1');
         *
         * @name        enable
         * @memberof    mixitup.Config.controls
         * @instance
         * @type        {boolean}
         * @default     true
         */

        this.enable = true;

        /**
         * A boolean dictating whether or not to use event delegation when binding click events
         * to the default controls.
         *
         * If `false` (default behavior), each control button in the DOM will be found and
         * individually bound when a mixer is instantiated, with their corresponding actions
         * cached for performance.
         *
         * If `true`, a single click handler will be applied to the `window` (or container element - see
         * `config.controls.scope`), and any click events triggered by elements with `data-filter`,
         * `data-sort` or `data-toggle` attributes present will be handled as they propagate upwards.
         *
         * If you require a user interface where control buttons may be added, removed, or changed during the
         * lifetime of a mixer, `controls.live` should be set to `true`. There is a marginal but unavoidable
         * performance deficit when using live controls, as the value of each control button must be read
         * from the DOM in real time once the click event has propagated.
         *
         * @example <caption>Example: Setting live controls</caption>
         * var mixer = mixitup(containerEl, {
         *     controls: {
         *         live: true
         *     }
         * });
         *
         * // Control buttons can now be added, remove and changed without breaking
         * // the mixer's UI
         *
         * @name        live
         * @memberof    mixitup.Config.controls
         * @instance
         * @type        {boolean}
         * @default     true
         */

        this.live = false;

        /**
         * A string dictating the "scope" to use when binding or querying the default controls. The available
         * values are `'global'` or `'local'`.
         *
         * When set to `'global'` (default behavior), MixItUp will query the entire document for control buttons
         * to bind, or delegate click events from (see `config.controls.live`).
         *
         * When set to `'local'`, MixItUp will only query (or bind click events to) its own container element.
         * This may be desireable if you require multiple active mixer instances within the same document, with
         * controls that would otherwise intefere with each other if scoped globally.
         *
         * Conversely, if you wish to control multiple instances with a single UI, you would create one
         * set of controls and keep the controls scope of each mixer set to `global`.
         *
         * @example <caption>Example: Setting 'local' scoped controls</caption>
         * var mixerOne = mixitup(containerOne, {
         *     controls: {
         *         scope: 'local'
         *     }
         * });
         *
         * var mixerTwo = mixitup(containerTwo, {
         *     controls: {
         *         scope: 'local'
         *     }
         * });
         *
         * // Both mixers can now exist within the same document with
         * // isolated controls placed within their container elements.
         *
         * @name        scope
         * @memberof    mixitup.Config.controls
         * @instance
         * @type        {string}
         * @default     'global'
         */

        this.scope = 'global'; // enum: ['local' ,'global']

        /**
         * A string dictating the type of logic to apply when concatenating the filter selectors of
         * active toggle buttons (i.e. any clickable element with a `data-toggle` attribute).
         *
         * If set to `'or'` (default behavior), selectors will be concatenated together as
         * a comma-seperated list. For example:
         *
         * `'.cat-1, .cat-2'` (shows any elements matching `'.cat-1'` OR `'.cat-2'`)
         *
         * If set to `'and'`, selectors will be directly concatenated together. For example:
         *
         * `'.cat-1.cat-2'` (shows any elements which match both `'.cat-1'` AND `'.cat-2'`)
         *
         * @example <caption>Example: Setting "and" toggle logic</caption>
         * var mixer = mixitup(containerEl, {
         *     controls: {
         *         toggleLogic: 'and'
         *     }
         * });
         *
         * @name        toggleLogic
         * @memberof    mixitup.Config.controls
         * @instance
         * @type        {string}
         * @default     'or'
         */

        this.toggleLogic = 'or'; // enum: ['or', 'and']

        /**
         * A string dictating the filter behavior when all toggles are inactive.
         *
         * When set to `'all'` (default behavior), *all* targets will be shown by default
         * when no toggles are active, or at the moment all active toggles are toggled off.
         *
         * When set to `'none'`, no targets will be shown by default when no toggles are
         * active, or at the moment all active toggles are toggled off.
         *
         * @example <caption>Example 1: Setting the default toggle behavior to `'all'`</caption>
         * var mixer = mixitup(containerEl, {
         *     controls: {
         *         toggleDefault: 'all'
         *     }
         * });
         *
         * mixer.toggleOn('.cat-2')
         *     .then(function() {
         *         // Deactivate all active toggles
         *
         *         return mixer.toggleOff('.cat-2')
         *     })
         *     .then(function(state) {
         *          console.log(state.activeFilter.selector); // 'all'
         *          console.log(state.totalShow); // 12
         *     });
         *
         * @example <caption>Example 2: Setting the default toggle behavior to `'none'`</caption>
         * var mixer = mixitup(containerEl, {
         *     controls: {
         *         toggleDefault: 'none'
         *     }
         * });
         *
         * mixer.toggleOn('.cat-2')
         *     .then(function() {
         *         // Deactivate all active toggles
         *
         *         return mixer.toggleOff('.cat-2')
         *     })
         *     .then(function(state) {
         *          console.log(state.activeFilter.selector); // 'none'
         *          console.log(state.totalShow); // 0
         *     });
         *
         * @name        toggleDefault
         * @memberof    mixitup.Config.controls
         * @instance
         * @type        {string}
         * @default     'all'
         */

        this.toggleDefault = 'all'; // enum: ['all', 'none']

        this.callActions('afterConstruct');

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.ConfigControls);

    mixitup.ConfigControls.prototype = Object.create(mixitup.Base.prototype);

    mixitup.ConfigControls.prototype.constructor = mixitup.ConfigControls;

    /**
     * A group of properties defining the output and structure of class names programmatically
     * added to controls and containers to reflect the state of the mixer.
     *
     * Most commonly, class names are added to controls by MixItUp to indicate that
     * the control is active so that it can be styled accordingly - `'mixitup-control-active'` by default.
     *
     * Using a "BEM" like structure, each classname is broken into the three parts:
     * a block namespace (`'mixitup'`), an element name (e.g. `'control'`), and an optional modifier
     * name (e.g. `'active'`) reflecting the state of the element.
     *
     * By default, each part of the classname is concatenated together using single hyphens as
     * delineators, but this can be easily customised to match the naming convention and style of
     * your project.
     *
     * @constructor
     * @memberof    mixitup.Config
     * @name        classNames
     * @namespace
     * @public
     * @since       3.0.0
     */

    mixitup.ConfigClassNames = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        /**
         * The "block" portion, or top-level namespace added to the start of any class names created by MixItUp.
         *
         * @example <caption>Example 1: changing the `config.classNames.block` value</caption>
         * var mixer = mixitup(containerEl, {
         *     classNames: {
         *         block: 'portfolio'
         *     }
         * });
         *
         * // Active control output: "portfolio-control-active"
         *
         * @example <caption>Example 2: Removing `config.classNames.block`</caption>
         * var mixer = mixitup(containerEl, {
         *     classNames: {
         *         block: ''
         *     }
         * });
         *
         * // Active control output: "control-active"
         *
         * @name        block
         * @memberof    mixitup.Config.classNames
         * @instance
         * @type        {string}
         * @default     'mixitup'
         */

        this.block = 'mixitup';

        /**
         * The "element" portion of the class name added to container.
         *
         * @name        elementContainer
         * @memberof    mixitup.Config.classNames
         * @instance
         * @type        {string}
         * @default     'container'
         */

        this.elementContainer = 'container';

        /**
         * The "element" portion of the class name added to filter controls.
         *
         * By default, all filter, sort, multimix and toggle controls take the same element value of `'control'`, but
         * each type's element value can be individually overwritten to match the unique classNames of your controls as needed.
         *
         * @example <caption>Example 1: changing the `config.classNames.elementFilter` value</caption>
         * var mixer = mixitup(containerEl, {
         *     classNames: {
         *         elementFilter: 'filter'
         *     }
         * });
         *
         * // Active filter output: "mixitup-filter-active"
         *
         * @example <caption>Example 2: changing the `config.classNames.block` and `config.classNames.elementFilter` values</caption>
         * var mixer = mixitup(containerEl, {
         *     classNames: {
         *         block: 'portfolio',
         *         elementFilter: 'filter'
         *     }
         * });
         *
         * // Active filter output: "portfolio-filter-active"
         *
         * @name        elementFilter
         * @memberof    mixitup.Config.classNames
         * @instance
         * @type        {string}
         * @default     'control'
         */

        this.elementFilter = 'control';

        /**
         * The "element" portion of the class name added to sort controls.
         *
         * By default, all filter, sort, multimix and toggle controls take the same element value of `'control'`, but
         * each type's element value can be individually overwritten to match the unique classNames of your controls as needed.
         *
         * @example <caption>Example 1: changing the `config.classNames.elementSort` value</caption>
         * var mixer = mixitup(containerEl, {
         *     classNames: {
         *         elementSort: 'sort'
         *     }
         * });
         *
         * // Active sort output: "mixitup-sort-active"
         *
         * @example <caption>Example 2: changing the `config.classNames.block` and `config.classNames.elementSort` values</caption>
         * var mixer = mixitup(containerEl, {
         *     classNames: {
         *         block: 'portfolio',
         *         elementSort: 'sort'
         *     }
         * });
         *
         * // Active sort output: "portfolio-sort-active"
         *
         * @name        elementSort
         * @memberof    mixitup.Config.classNames
         * @instance
         * @type        {string}
         * @default     'control'
         */

        this.elementSort = 'control';

        /**
         * The "element" portion of the class name added to multimix controls.
         *
         * By default, all filter, sort, multimix and toggle controls take the same element value of `'control'`, but
         * each type's element value can be individually overwritten to match the unique classNames of your controls as needed.
         *
         * @example <caption>Example 1: changing the `config.classNames.elementMultimix` value</caption>
         * var mixer = mixitup(containerEl, {
         *     classNames: {
         *         elementMultimix: 'multimix'
         *     }
         * });
         *
         * // Active multimix output: "mixitup-multimix-active"
         *
         * @example <caption>Example 2: changing the `config.classNames.block` and `config.classNames.elementMultimix` values</caption>
         * var mixer = mixitup(containerEl, {
         *     classNames: {
         *         block: 'portfolio',
         *         elementSort: 'multimix'
         *     }
         * });
         *
         * // Active multimix output: "portfolio-multimix-active"
         *
         * @name        elementMultimix
         * @memberof    mixitup.Config.classNames
         * @instance
         * @type        {string}
         * @default     'control'
         */

        this.elementMultimix = 'control';

        /**
         * The "element" portion of the class name added to toggle controls.
         *
         * By default, all filter, sort, multimix and toggle controls take the same element value of `'control'`, but
         * each type's element value can be individually overwritten to match the unique classNames of your controls as needed.
         *
         * @example <caption>Example 1: changing the `config.classNames.elementToggle` value</caption>
         * var mixer = mixitup(containerEl, {
         *     classNames: {
         *         elementToggle: 'toggle'
         *     }
         * });
         *
         * // Active toggle output: "mixitup-toggle-active"
         *
         * @example <caption>Example 2: changing the `config.classNames.block` and `config.classNames.elementToggle` values</caption>
         * var mixer = mixitup(containerEl, {
         *     classNames: {
         *         block: 'portfolio',
         *         elementToggle: 'toggle'
         *     }
         * });
         *
         * // Active toggle output: "portfolio-toggle-active"
         *
         * @name        elementToggle
         * @memberof    mixitup.Config.classNames
         * @instance
         * @type        {string}
         * @default     'control'
         */

        this.elementToggle = 'control';

        /**
         * The "modifier" portion of the class name added to active controls.
         * @name        modifierActive
         * @memberof    mixitup.Config.classNames
         * @instance
         * @type        {string}
         * @default     'active'
         */

        this.modifierActive = 'active';

        /**
         * The "modifier" portion of the class name added to disabled controls.
         *
         * @name        modifierDisabled
         * @memberof    mixitup.Config.classNames
         * @instance
         * @type        {string}
         * @default     'disabled'
         */

        this.modifierDisabled = 'disabled';

        /**
         * The "modifier" portion of the class name added to the container when in a "failed" state.
         *
         * @name        modifierFailed
         * @memberof    mixitup.Config.classNames
         * @instance
         * @type        {string}
         * @default     'failed'
         */

        this.modifierFailed = 'failed';

        /**
         * The delineator used between the "block" and "element" portions of any class name added by MixItUp.
         *
         * If the block portion is ommited by setting it to an empty string, no delineator will be added.
         *
         * @example <caption>Example: changing the delineator to match BEM convention</caption>
         * var mixer = mixitup(containerEl, {
         *     classNames: {
         *         delineatorElement: '__'
         *     }
         * });
         *
         * // example active control output: "mixitup__control-active"
         *
         * @name        delineatorElement
         * @memberof    mixitup.Config.classNames
         * @instance
         * @type        {string}
         * @default     '-'
         */

        this.delineatorElement = '-';

        /**
         * The delineator used between the "element" and "modifier" portions of any class name added by MixItUp.
         *
         * If the element portion is ommited by setting it to an empty string, no delineator will be added.
         *
         * @example <caption>Example: changing both delineators to match BEM convention</caption>
         * var mixer = mixitup(containerEl, {
         *     classNames: {
         *         delineatorElement: '__'
         *         delineatorModifier: '--'
         *     }
         * });
         *
         * // Active control output: "mixitup__control--active"
         *
         * @name        delineatorModifier
         * @memberof    mixitup.Config.classNames
         * @instance
         * @type        {string}
         * @default     '-'
         */

        this.delineatorModifier = '-';

        this.callActions('afterConstruct');

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.ConfigClassNames);

    mixitup.ConfigClassNames.prototype = Object.create(mixitup.Base.prototype);

    mixitup.ConfigClassNames.prototype.constructor = mixitup.ConfigClassNames;

    /**
     * A group of properties relating to MixItUp's dataset API.
     *
     * @constructor
     * @memberof    mixitup.Config
     * @name        data
     * @namespace
     * @public
     * @since       3.0.0
     */

    mixitup.ConfigData = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        /**
         * A string specifying the name of the key containing your data model's unique
         * identifier (UID). To use the dataset API, a UID key must be specified and
         * be present and unique on all objects in the dataset you provide to MixItUp.
         *
         * For example, if your dataset is made up of MongoDB documents, the UID
         * key would be `'id'` or `'_id'`.
         *
         * @example <caption>Example: Setting the UID to `'id'`</caption>
         * var mixer = mixitup(containerEl, {
         *     data: {
         *         uidKey: 'id'
         *     }
         * });
         *
         * @name        uidKey
         * @memberof    mixitup.Config.data
         * @instance
         * @type        {string}
         * @default     ''
         */

        this.uidKey = '';

        /**
         * A boolean dictating whether or not MixItUp should "dirty check" each object in
         * your dataset for changes whenever `.dataset()` is called, and re-render any targets
         * for which a change is found.
         *
         * Depending on the complexity of your data model, dirty checking can be expensive
         * and is therefore disabled by default.
         *
         * NB: For changes to be detected, a new immutable instance of the edited model must be
         * provided to mixitup, rather than manipulating properties on the existing instance.
         * If your changes are a result of a DB write and read, you will most likely be calling
         * `.dataset()` with a clean set of objects each time, so this will not be an issue.
         *
         * @example <caption>Example: Enabling dirty checking</caption>
         *
         * var myDataset = [
         *     {
         *         id: 0,
         *         title: "Blog Post Title 0"
         *         ...
         *     },
         *     {
         *         id: 1,
         *         title: "Blog Post Title 1"
         *         ...
         *     }
         * ];
         *
         * // Instantiate a mixer with a pre-loaded dataset, and a target renderer
         * // function defined
         *
         * var mixer = mixitup(containerEl, {
         *     data: {
         *         uidKey: 'id',
         *         dirtyCheck: true
         *     },
         *     load: {
         *         dataset: myDataset
         *     },
         *     render: {
         *         target: function() { ... }
         *     }
         * });
         *
         * // For illustration, we will clone and edit the second object in the dataset.
         * // NB: this would typically be done server-side in response to a DB update,
         * and then re-queried via an API.
         *
         * myDataset[1] = Object.assign({}, myDataset[1]);
         *
         * myDataset[1].title = 'Blog Post Title 11';
         *
         * mixer.dataset(myDataset)
         *    .then(function() {
         *        // the target with ID "1", will be re-rendered reflecting its new title
         *    });
         *
         * @name        dirtyCheck
         * @memberof    mixitup.Config.data
         * @instance
         * @type        {boolean}
         * @default     false
         */

        this.dirtyCheck = false;

        this.callActions('afterConstruct');

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.ConfigData);

    mixitup.ConfigData.prototype = Object.create(mixitup.Base.prototype);

    mixitup.ConfigData.prototype.constructor = mixitup.ConfigData;

    /**
     * A group of properties allowing the toggling of various debug features.
     *
     * @constructor
     * @memberof    mixitup.Config
     * @name        debug
     * @namespace
     * @public
     * @since       3.0.0
     */

    mixitup.ConfigDebug = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        /**
         * A boolean dictating whether or not the mixer instance returned by the
         * `mixitup()` factory function should expose private properties and methods.
         *
         * By default, mixer instances only expose their public API, but enabling
         * debug mode will give you access to various mixer internals which may aid
         * in debugging, or the authoring of extensions.
         *
         * @example <caption>Example: Enabling debug mode</caption>
         *
         * var mixer = mixitup(containerEl, {
         *     debug: {
         *         enable: true
         *     }
         * });
         *
         * // Private properties and methods will now be visible on the mixer instance:
         *
         * console.log(mixer);
         *
         * @name        enable
         * @memberof    mixitup.Config.debug
         * @instance
         * @type        {boolean}
         * @default     false
         */

        this.enable = false;

        /**
         * A boolean dictating whether or not warnings should be shown when various
         * common gotchas occur.
         *
         * Warnings are intended to provide insights during development when something
         * occurs that is not a fatal, but may indicate an issue with your integration,
         * and are therefore turned on by default. However, you may wish to disable
         * them in production.
         *
         * @example <caption>Example 1: Disabling warnings</caption>
         *
         * var mixer = mixitup(containerEl, {
         *     debug: {
         *         showWarnings: false
         *     }
         * });
         *
         * @example <caption>Example 2: Disabling warnings based on environment</caption>
         *
         * var showWarnings = myAppConfig.environment === 'development' ? true : false;
         *
         * var mixer = mixitup(containerEl, {
         *     debug: {
         *         showWarnings: showWarnings
         *     }
         * });
         *
         * @name        showWarnings
         * @memberof    mixitup.Config.debug
         * @instance
         * @type        {boolean}
         * @default     true
         */

        this.showWarnings = true;

        /**
         * Used for server-side testing only.
         *
         * @private
         * @name        fauxAsync
         * @memberof    mixitup.Config.debug
         * @instance
         * @type        {boolean}
         * @default     false
         */

        this.fauxAsync = false;

        this.callActions('afterConstruct');

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.ConfigDebug);

    mixitup.ConfigDebug.prototype = Object.create(mixitup.Base.prototype);

    mixitup.ConfigDebug.prototype.constructor = mixitup.ConfigDebug;

    /**
     * A group of properties relating to the layout of the container.
     *
     * @constructor
     * @memberof    mixitup.Config
     * @name        layout
     * @namespace
     * @public
     * @since       3.0.0
     */

    mixitup.ConfigLayout = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        /**
         * A boolean dictating whether or not mixitup should query all descendants
         * of the container for targets, or only immediate children.
         *
         * By default, mixitup will query all descendants matching the
         * `selectors.target` selector when indexing targets upon instantiation.
         * This allows for targets to be nested inside a sub-container which is
         * useful when ring-fencing targets from locally scoped controls in your
         * markup (see `controls.scope`).
         *
         * However, if you are building a more complex UI requiring the nesting
         * of mixers within mixers, you will most likely want to limit targets to
         * immediate children of the container by setting this property to `false`.
         *
         * @example <caption>Example: Restricting targets to immediate children</caption>
         *
         * var mixer = mixitup(containerEl, {
         *     layout: {
         *         allowNestedTargets: false
         *     }
         * });
         *
         * @name        allowNestedTargets
         * @memberof    mixitup.Config.layout
         * @instance
         * @type        {boolean}
         * @default     true
         */

        this.allowNestedTargets = true;

        /**
         * A string specifying an optional class name to apply to the container when in
         * its default state.
         *
         * By changing this class name or adding a class name to the container via the
         * `.changeLayout()` API method, the CSS layout of the container can be changed,
         * and MixItUp will attemp to gracefully animate the container and its targets
         * between states.
         *
         * @example <caption>Example 1: Specifying a container class name</caption>
         *
         * var mixer = mixitup(containerEl, {
         *     layout: {
         *         containerClassName: 'grid'
         *     }
         * });
         *
         * @example <caption>Example 2: Changing the default class name with `.changeLayout()`</caption>
         *
         * var mixer = mixitup(containerEl, {
         *     layout: {
         *         containerClassName: 'grid'
         *     }
         * });
         *
         * mixer.changeLayout('list')
         *     .then(function(state) {
         *          console.log(state.activeContainerClass); // "list"
         *     });
         *
         * @name        containerClassName
         * @memberof    mixitup.Config.layout
         * @instance
         * @type        {string}
         * @default     ''
         */

        this.containerClassName = '';

        /**
         * A reference to a non-target sibling element after which to insert targets
         * when there are no targets in the container.
         *
         * @example <caption>Example: Setting a `siblingBefore` reference element</caption>
         *
         * var addButton = containerEl.querySelector('button');
         *
         * var mixer = mixitup(containerEl, {
         *     layout: {
         *         siblingBefore: addButton
         *     }
         * });
         *
         * @name        siblingBefore
         * @memberof    mixitup.Config.layout
         * @instance
         * @type        {HTMLElement}
         * @default     null
         */

        this.siblingBefore = null;

        /**
         * A reference to a non-target sibling element before which to insert targets
         * when there are no targets in the container.
         *
         * @example <caption>Example: Setting an `siblingAfter` reference element</caption>
         *
         * var gap = containerEl.querySelector('.gap');
         *
         * var mixer = mixitup(containerEl, {
         *     layout: {
         *         siblingAfter: gap
         *     }
         * });
         *
         * @name        siblingAfter
         * @memberof    mixitup.Config.layout
         * @instance
         * @type        {HTMLElement}
         * @default     null
         */

        this.siblingAfter = null;

        this.callActions('afterConstruct');

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.ConfigLayout);

    mixitup.ConfigLayout.prototype = Object.create(mixitup.Base.prototype);

    mixitup.ConfigLayout.prototype.constructor = mixitup.ConfigLayout;

    /**
     * A group of properties defining the initial state of the mixer on load (instantiation).
     *
     * @constructor
     * @memberof    mixitup.Config
     * @name        load
     * @namespace
     * @public
     * @since       2.0.0
     */

    mixitup.ConfigLoad = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        /**
         * A string defining any filtering to be statically applied to the mixer on load.
         * As per the `.filter()` API, this can be any valid selector string, or the
         * values `'all'` or `'none'`.
         *
         * @example <caption>Example 1: Defining an initial filter selector to be applied on load</caption>
         *
         * // The mixer will show only those targets matching '.category-a' on load.
         *
         * var mixer = mixitup(containerEl, {
         *     load: {
         *         filter: '.category-a'
         *     }
         * });
         *
         * @example <caption>Example 2: Hiding all targets on load</caption>
         *
         * // The mixer will show hide all targets on load.
         *
         * var mixer = mixitup(containerEl, {
         *     load: {
         *         filter: 'none'
         *     }
         * });
         *
         * @name        filter
         * @memberof    mixitup.Config.load
         * @instance
         * @type        {string}
         * @default     'all'
         */

        this.filter = 'all';

        /**
         * A string defining any sorting to be statically applied to the mixer on load.
         * As per the `.sort()` API, this should be a valid "sort string" made up of
         * an attribute to sort by (or `'default'`) followed by an optional sorting
         * order, or the value `'random'`;
         *
         * @example <caption>Example: Defining sorting to be applied on load</caption>
         *
         * // The mixer will sort the container by the value of the `data-published-date`
         * // attribute, in descending order.
         *
         * var mixer = mixitup(containerEl, {
         *     load: {
         *         sort: 'published-date:desc'
         *     }
         * });
         *
         * @name        sort
         * @memberof    mixitup.Config.load
         * @instance
         * @type        {string}
         * @default     'default:asc'
         */

        this.sort = 'default:asc';

        /**
         * An array of objects representing the underlying data of any pre-rendered targets,
         * when using the `.dataset()` API.
         *
         * NB: If targets are pre-rendered when the mixer is instantiated, this must be set.
         *
         * @example <caption>Example: Defining the initial underyling dataset</caption>
         *
         * var myDataset = [
         *     {
         *         id: 0,
         *         title: "Blog Post Title 0",
         *         ...
         *     },
         *     {
         *         id: 1,
         *         title: "Blog Post Title 1",
         *         ...
         *     }
         * ];
         *
         * var mixer = mixitup(containerEl, {
         *     data: {
         *         uidKey: 'id'
         *     },
         *     load: {
         *         dataset: myDataset
         *     }
         * });
         *
         * @name        dataset
         * @memberof    mixitup.Config.load
         * @instance
         * @type        {Array.<object>}
         * @default     null
         */

        this.dataset = null;

        this.callActions('afterConstruct');

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.ConfigLoad);

    mixitup.ConfigLoad.prototype = Object.create(mixitup.Base.prototype);

    mixitup.ConfigLoad.prototype.constructor = mixitup.ConfigLoad;

    /**
     * A group of properties defining the selectors used to query elements within a mixitup container.
     *
     * @constructor
     * @memberof    mixitup.Config
     * @name        selectors
     * @namespace
     * @public
     * @since       3.0.0
     */

    mixitup.ConfigSelectors = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        /**
         * A selector string used to query and index target elements within the container.
         *
         * By default, the class selector `'.mix'` is used, but this can be changed to an
         * attribute or element selector to match the style of your project.
         *
         * @example <caption>Example 1: Changing the target selector</caption>
         *
         * var mixer = mixitup(containerEl, {
         *     selectors: {
         *         target: '.portfolio-item'
         *     }
         * });
         *
         * @example <caption>Example 2: Using an attribute selector as a target selector</caption>
         *
         * // The mixer will search for any children with the attribute `data-ref="mix"`
         *
         * var mixer = mixitup(containerEl, {
         *     selectors: {
         *         target: '[data-ref="mix"]'
         *     }
         * });
         *
         * @name        target
         * @memberof    mixitup.Config.selectors
         * @instance
         * @type        {string}
         * @default     '.mix'
         */

        this.target = '.mix';

        /**
         * A optional selector string used to add further specificity to the querying of control elements,
         * in addition to their mandatory data attribute (e.g. `data-filter`, `data-toggle`, `data-sort`).
         *
         * This can be used if other elements in your document must contain the above attributes
         * (e.g. for use in third-party scripts), and would otherwise interfere with MixItUp. Adding
         * an additional `control` selector of your choice allows MixItUp to restrict event handling
         * to only those elements matching the defined selector.
         *
         * @name        control
         * @memberof    mixitup.Config.selectors
         * @instance
         * @type        {string}
         * @default     ''
         *
         * @example <caption>Example 1: Adding a `selectors.control` selector</caption>
         *
         * var mixer = mixitup(containerEl, {
         *     selectors: {
         *         control: '.mixitup-control'
         *     }
         * });
         *
         * // Will not be handled:
         * // <button data-filter=".category-a"></button>
         *
         * // Will be handled:
         * // <button class="mixitup-control" data-filter=".category-a"></button>
         */

        this.control = '';

        this.callActions('afterConstruct');

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.ConfigSelectors);

    mixitup.ConfigSelectors.prototype = Object.create(mixitup.Base.prototype);

    mixitup.ConfigSelectors.prototype.constructor = mixitup.ConfigSelectors;

    /**
     * A group of optional render functions for creating and updating elements.
     *
     * All render functions receive a data object, and should return a valid HTML string.
     *
     * @constructor
     * @memberof    mixitup.Config
     * @name        render
     * @namespace
     * @public
     * @since       3.0.0
     */

    mixitup.ConfigRender = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        /**
         * A function returning an HTML string representing a target element, or a reference to a
         * single DOM element.
         *
         * The function is invoked as part of the `.dataset()` API, whenever a new item is added
         * to the dataset, or an item in the dataset changes (if `dataset.dirtyCheck` is enabled).
         *
         * The function receives the relevant dataset item as its first parameter.
         *
         * @example <caption>Example 1: Using string concatenation</caption>
         *
         * var mixer = mixitup(containerEl, {
         *     render: {
         *         target: function(item) {
         *             return (
         *                 '&lt;div class="mix"&gt;' +
         *                     '&lt;h2&gt;' + item.title + '&lt;/h2&gt;' +
         *                 '&lt;/div&gt;'
         *             );
         *         }
         *     }
         * });
         *
         * @example <caption>Example 2: Using an ES2015 template literal</caption>
         *
         * var mixer = mixitup(containerEl, {
         *     render: {
         *         target: function(item) {
         *             return (
         *                 `&lt;div class="mix"&gt;
         *                     &lt;h2&gt;${item.title}&lt;/h2&gt;
         *                  &lt;/div&gt;`
         *             );
         *         }
         *     }
         * });
         *
         * @example <caption>Example 3: Using a Handlebars template</caption>
         *
         * var targetTemplate = Handlebars.compile('&lt;div class="mix"&gt;&lt;h2&gt;{{title}}&lt;/h2&gt;&lt;/div&gt;');
         *
         * var mixer = mixitup(containerEl, {
         *     render: {
         *         target: targetTemplate
         *     }
         * });
         *
         * @example <caption>Example 4: Returning a DOM element</caption>
         *
         * var mixer = mixitup(containerEl, {
         *     render: {
         *         target: function(item) {
         *              // Create a single element using your framework's built-in renderer
         *
         *              var el = ...
         *
         *              return el;
         *         }
         *     }
         * });
         *
         * @name        target
         * @memberof    mixitup.Config.render
         * @instance
         * @type        {function}
         * @default     'null'
         */

        this.target = null;

        this.callActions('afterConstruct');

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.ConfigRender);

    mixitup.ConfigRender.prototype = Object.create(mixitup.Base.prototype);

    mixitup.ConfigRender.prototype.constructor = mixitup.ConfigRender;

    /**
     * @constructor
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.ConfigTemplates = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        this.callActions('afterConstruct');

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.ConfigTemplates);

    mixitup.ConfigTemplates.prototype = Object.create(mixitup.Base.prototype);

    mixitup.ConfigTemplates.prototype.constructor = mixitup.ConfigTemplates;

    /**
     * `mixitup.Config` is an interface used for customising the functionality of a
     * mixer instance. It is organised into several semantically distinct sub-objects,
     * each one pertaining to a particular aspect of MixItUp functionality.
     *
     * An object literal containing any or all of the available properies,
     * known as the "configuration object", can be passed as the second parameter to
     * the `mixitup` factory function when creating a mixer instance to customise its
     * functionality as needed.
     *
     * If no configuration object is passed, the mixer instance will take on the default
     * configuration values detailed below.
     *
     * @example <caption>Example 1: Creating and passing the configuration object</caption>
     * // Create a configuration object with desired values
     *
     * var config = {
     *     animation: {
     *         enable: false
     *     },
     *     selectors: {
     *         target: '.item'
     *     }
     * };
     *
     * // Pass the configuration object to the mixitup factory function
     *
     * var mixer = mixitup(containerEl, config);
     *
     * @example <caption>Example 2: Passing the configuration object inline</caption>
     * // Typically, the configuration object is passed inline for brevity.
     *
     * var mixer = mixitup(containerEl, {
     *     controls: {
     *         live: true,
     *         toggleLogic: 'and'
     *     }
     * });
     *
     *
     * @constructor
     * @memberof    mixitup
     * @namespace
     * @public
     * @since       2.0.0
     */

    mixitup.Config = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        this.animation          = new mixitup.ConfigAnimation();
        this.behavior           = new mixitup.ConfigBehavior();
        this.callbacks          = new mixitup.ConfigCallbacks();
        this.controls           = new mixitup.ConfigControls();
        this.classNames         = new mixitup.ConfigClassNames();
        this.data               = new mixitup.ConfigData();
        this.debug              = new mixitup.ConfigDebug();
        this.layout             = new mixitup.ConfigLayout();
        this.load               = new mixitup.ConfigLoad();
        this.selectors          = new mixitup.ConfigSelectors();
        this.render             = new mixitup.ConfigRender();
        this.templates          = new mixitup.ConfigTemplates();

        this.callActions('afterConstruct');

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.Config);

    mixitup.Config.prototype = Object.create(mixitup.Base.prototype);

    mixitup.Config.prototype.constructor = mixitup.Config;

    /**
     * @constructor
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.MixerDom = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        this.document               = null;
        this.body                   = null;
        this.container              = null;
        this.parent                 = null;
        this.targets                = [];

        this.callActions('afterConstruct');

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.MixerDom);

    mixitup.MixerDom.prototype = Object.create(mixitup.Base.prototype);

    mixitup.MixerDom.prototype.constructor = mixitup.MixerDom;

    /**
     * @constructor
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.UiClassNames = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        this.base       = '';
        this.active     = '';
        this.disabled   = '';

        this.callActions('afterConstruct');

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.UiClassNames);

    mixitup.UiClassNames.prototype = Object.create(mixitup.Base.prototype);

    mixitup.UiClassNames.prototype.constructor = mixitup.UiClassNames;

    /**
     * An object into which all arbitrary arguments sent to '.dataset()' are mapped.
     *
     * @constructor
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.CommandDataset = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        this.dataset = null;

        this.callActions('afterConstruct');

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.CommandDataset);

    mixitup.CommandDataset.prototype = Object.create(mixitup.Base.prototype);

    mixitup.CommandDataset.prototype.constructor = mixitup.CommandDataset;

    /**
     * An object into which all arbitrary arguments sent to '.multimix()' are mapped.
     *
     * @constructor
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.CommandMultimix = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        this.filter       = null;
        this.sort         = null;
        this.insert       = null;
        this.remove       = null;
        this.changeLayout = null;

        this.callActions('afterConstruct');

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.CommandMultimix);

    mixitup.CommandMultimix.prototype = Object.create(mixitup.Base.prototype);

    mixitup.CommandMultimix.prototype.constructor = mixitup.CommandMultimix;

    /**
     * An object into which all arbitrary arguments sent to '.filter()' are mapped.
     *
     * @constructor
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.CommandFilter = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        this.selector   = '';
        this.collection = null;
        this.action     = 'show'; // enum: ['show', 'hide']

        this.callActions('afterConstruct');

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.CommandFilter);

    mixitup.CommandFilter.prototype = Object.create(mixitup.Base.prototype);

    mixitup.CommandFilter.prototype.constructor = mixitup.CommandFilter;

    /**
     * An object into which all arbitrary arguments sent to '.sort()' are mapped.
     *
     * @constructor
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.CommandSort = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        this.sortString = '';
        this.attribute  = '';
        this.order      = 'asc';
        this.collection = null;
        this.next       = null;

        this.callActions('afterConstruct');

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.CommandSort);

    mixitup.CommandSort.prototype = Object.create(mixitup.Base.prototype);

    mixitup.CommandSort.prototype.constructor = mixitup.CommandSort;

    /**
     * An object into which all arbitrary arguments sent to '.insert()' are mapped.
     *
     * @constructor
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.CommandInsert = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        this.index      = 0;
        this.collection = [];
        this.position   = 'before'; // enum: ['before', 'after']
        this.sibling    = null;

        this.callActions('afterConstruct');

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.CommandInsert);

    mixitup.CommandInsert.prototype = Object.create(mixitup.Base.prototype);

    mixitup.CommandInsert.prototype.constructor = mixitup.CommandInsert;

    /**
     * An object into which all arbitrary arguments sent to '.remove()' are mapped.
     *
     * @constructor
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.CommandRemove = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        this.targets    = [];
        this.collection = [];

        this.callActions('afterConstruct');

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.CommandRemove);

    mixitup.CommandRemove.prototype = Object.create(mixitup.Base.prototype);

    mixitup.CommandRemove.prototype.constructor = mixitup.CommandRemove;

    /**
     * An object into which all arbitrary arguments sent to '.changeLayout()' are mapped.
     *
     * @constructor
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.CommandChangeLayout = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        this.containerClassName = '';

        this.callActions('afterConstruct');

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.CommandChangeLayout);

    mixitup.CommandChangeLayout.prototype = Object.create(mixitup.Base.prototype);

    mixitup.CommandChangeLayout.prototype.constructor = mixitup.CommandChangeLayout;

    /**
     * @constructor
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     * @param       {string}        type
     * @param       {string}        selector
     * @param       {boolean}       [live]
     * @param       {string}        [parent]
     *     An optional string representing the name of the mixer.dom property containing a reference to a parent element.
     */

    mixitup.ControlDefinition = function(type, selector, live, parent) {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        this.type    = type;
        this.selector  = selector;
        this.live      = live || false;
        this.parent    = parent || '';

        this.callActions('afterConstruct');

        h.freeze(this);
        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.ControlDefinition);

    mixitup.ControlDefinition.prototype = Object.create(mixitup.Base.prototype);

    mixitup.ControlDefinition.prototype.constructor = mixitup.ControlDefinition;

    mixitup.controlDefinitions = [];

    mixitup.controlDefinitions.push(new mixitup.ControlDefinition('multimix', '[data-filter][data-sort]'));
    mixitup.controlDefinitions.push(new mixitup.ControlDefinition('filter', '[data-filter]'));
    mixitup.controlDefinitions.push(new mixitup.ControlDefinition('sort', '[data-sort]'));
    mixitup.controlDefinitions.push(new mixitup.ControlDefinition('toggle', '[data-toggle]'));

    /**
     * @constructor
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.Control = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        this.el         = null;
        this.selector   = '';
        this.bound      = [];
        this.pending    = -1;
        this.type       = '';
        this.status     = 'inactive'; // enum: ['inactive', 'active', 'disabled', 'live']
        this.filter     = '';
        this.sort       = '';
        this.canDisable = false;
        this.handler    = null;
        this.classNames = new mixitup.UiClassNames();

        this.callActions('afterConstruct');

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.Control);

    mixitup.Control.prototype = Object.create(mixitup.Base.prototype);

    h.extend(mixitup.Control.prototype,
    /** @lends mixitup.Control */
    {
        constructor: mixitup.Control,

        /**
         * @private
         * @param {HTMLElement} el
         * @param {string}      type
         * @param {string}      selector
         */

        init: function(el, type, selector) {
            var self = this;

            this.callActions('beforeInit', arguments);

            self.el         = el;
            self.type       = type;
            self.selector   = selector;

            if (self.selector) {
                self.status = 'live';
            } else {
                self.canDisable = typeof self.el.disable === 'boolean';

                switch (self.type) {
                    case 'filter':
                        self.filter = self.el.getAttribute('data-filter');

                        break;
                    case 'toggle':
                        self.filter = self.el.getAttribute('data-toggle');

                        break;
                    case 'sort':
                        self.sort   = self.el.getAttribute('data-sort');

                        break;
                    case 'multimix':
                        self.filter = self.el.getAttribute('data-filter');
                        self.sort   = self.el.getAttribute('data-sort');

                        break;
                }
            }

            self.bindClick();

            mixitup.controls.push(self);

            this.callActions('afterInit', arguments);
        },

        /**
         * @private
         * @param  {mixitup.Mixer} mixer
         * @return {boolean}
         */

        isBound: function(mixer) {
            var self    = this,
                isBound = false;

            this.callActions('beforeIsBound', arguments);

            isBound = self.bound.indexOf(mixer) > -1;

            return self.callFilters('afterIsBound', isBound, arguments);
        },

        /**
         * @private
         * @param  {mixitup.Mixer} mixer
         * @return {void}
         */

        addBinding: function(mixer) {
            var self = this;

            this.callActions('beforeAddBinding', arguments);

            if (!self.isBound()) {
                self.bound.push(mixer);
            }

            this.callActions('afterAddBinding', arguments);
        },

        /**
         * @private
         * @param  {mixitup.Mixer} mixer
         * @return {void}
         */

        removeBinding: function(mixer) {
            var self        = this,
                removeIndex = -1;

            this.callActions('beforeRemoveBinding', arguments);

            if ((removeIndex = self.bound.indexOf(mixer)) > -1) {
                self.bound.splice(removeIndex, 1);
            }

            if (self.bound.length < 1) {
                // No bindings exist, unbind event click handlers

                self.unbindClick();

                // Remove from `mixitup.controls` list

                removeIndex = mixitup.controls.indexOf(self);

                mixitup.controls.splice(removeIndex, 1);

                if (self.status === 'active') {
                    self.renderStatus(self.el, 'inactive');
                }
            }

            this.callActions('afterRemoveBinding', arguments);
        },

        /**
         * @private
         * @return {void}
         */

        bindClick: function() {
            var self = this;

            this.callActions('beforeBindClick', arguments);

            self.handler = function(e) {
                self.handleClick(e);
            };

            h.on(self.el, 'click', self.handler);

            this.callActions('afterBindClick', arguments);
        },

        /**
         * @private
         * @return {void}
         */

        unbindClick: function() {
            var self = this;

            this.callActions('beforeUnbindClick', arguments);

            h.off(self.el, 'click', self.handler);

            self.handler = null;

            this.callActions('afterUnbindClick', arguments);
        },

        /**
         * @private
         * @param   {MouseEvent} e
         * @return  {void}
         */

        handleClick: function(e) {
            var self        = this,
                button      = null,
                mixer       = null,
                isActive    = false,
                returnValue = void(0),
                command     = {},
                clone       = null,
                commands    = [],
                i           = -1;

            this.callActions('beforeHandleClick', arguments);

            this.pending = 0;

            mixer = self.bound[0];

            if (!self.selector) {
                button = self.el;
            } else {
                button = h.closestParent(e.target, mixer.config.selectors.control + self.selector, true, mixer.dom.document);
            }

            if (!button) {
                self.callActions('afterHandleClick', arguments);

                return;
            }

            switch (self.type) {
                case 'filter':
                    command.filter = self.filter || button.getAttribute('data-filter');

                    break;
                case 'sort':
                    command.sort = self.sort || button.getAttribute('data-sort');

                    break;
                case 'multimix':
                    command.filter  = self.filter || button.getAttribute('data-filter');
                    command.sort    = self.sort || button.getAttribute('data-sort');

                    break;
                case 'toggle':
                    command.filter  = self.filter || button.getAttribute('data-toggle');

                    if (self.status === 'live') {
                        isActive = h.hasClass(button, self.classNames.active);
                    } else {
                        isActive = self.status === 'active';
                    }

                    break;
            }

            for (i = 0; i < self.bound.length; i++) {
                // Create a clone of the command for each bound mixer instance

                clone = new mixitup.CommandMultimix();

                h.extend(clone, command);

                commands.push(clone);
            }

            commands = self.callFilters('commandsHandleClick', commands, arguments);

            self.pending = self.bound.length;

            for (i = 0; mixer = self.bound[i]; i++) {
                command = commands[i];

                if (!command) {
                    // An extension may set a command null to indicate that the click should not be handled

                    continue;
                }

                if (!mixer.lastClicked) {
                    mixer.lastClicked = button;
                }

                mixitup.events.fire('mixClick', mixer.dom.container, {
                    state: mixer.state,
                    instance: mixer,
                    originalEvent: e,
                    control: mixer.lastClicked
                }, mixer.dom.document);

                if (typeof mixer.config.callbacks.onMixClick === 'function') {
                    returnValue = mixer.config.callbacks.onMixClick.call(mixer.lastClicked, mixer.state, e, mixer);

                    if (returnValue === false) {
                        // User has returned `false` from the callback, so do not handle click

                        continue;
                    }
                }

                if (self.type === 'toggle') {
                    isActive ? mixer.toggleOff(command.filter) : mixer.toggleOn(command.filter);
                } else {
                    mixer.multimix(command);
                }
            }

            this.callActions('afterHandleClick', arguments);
        },

        /**
         * @param   {object}          command
         * @param   {Array<string>}   toggleArray
         * @return  {void}
         */

        update: function(command, toggleArray) {
            var self    = this,
                actions = new mixitup.CommandMultimix();

            self.callActions('beforeUpdate', arguments);

            self.pending--;

            self.pending = Math.max(0, self.pending);

            if (self.pending > 0) return;

            if (self.status === 'live') {
                // Live control (status unknown)

                self.updateLive(command, toggleArray);
            } else {
                // Static control

                actions.sort    = self.sort;
                actions.filter  = self.filter;

                self.callFilters('actionsUpdate', actions, arguments);

                self.parseStatusChange(self.el, command, actions, toggleArray);
            }

            self.callActions('afterUpdate', arguments);
        },

        /**
         * @param   {mixitup.CommandMultimix} command
         * @param   {Array<string>}           toggleArray
         * @return  {void}
         */

        updateLive: function(command, toggleArray) {
            var self            = this,
                controlButtons  = null,
                actions         = null,
                button          = null,
                i               = -1;

            self.callActions('beforeUpdateLive', arguments);

            if (!self.el) return;

            controlButtons = self.el.querySelectorAll(self.selector);

            for (i = 0; button = controlButtons[i]; i++) {
                actions = new mixitup.CommandMultimix();

                switch (self.type) {
                    case 'filter':
                        actions.filter = button.getAttribute('data-filter');

                        break;
                    case 'sort':
                        actions.sort = button.getAttribute('data-sort');

                        break;
                    case 'multimix':
                        actions.filter  = button.getAttribute('data-filter');
                        actions.sort    = button.getAttribute('data-sort');

                        break;
                    case 'toggle':
                        actions.filter  = button.getAttribute('data-toggle');

                        break;
                }

                actions = self.callFilters('actionsUpdateLive', actions, arguments);

                self.parseStatusChange(button, command, actions, toggleArray);
            }

            self.callActions('afterUpdateLive', arguments);
        },

        /**
         * @param   {HTMLElement}             button
         * @param   {mixitup.CommandMultimix} command
         * @param   {mixitup.CommandMultimix} actions
         * @param   {Array<string>}           toggleArray
         * @return  {void}
         */

        parseStatusChange: function(button, command, actions, toggleArray) {
            var self    = this,
                alias   = '',
                toggle  = '',
                i       = -1;

            self.callActions('beforeParseStatusChange', arguments);

            switch (self.type) {
                case 'filter':
                    if (command.filter === actions.filter) {
                        self.renderStatus(button, 'active');
                    } else {
                        self.renderStatus(button, 'inactive');
                    }

                    break;
                case 'multimix':
                    if (command.sort === actions.sort && command.filter === actions.filter) {
                        self.renderStatus(button, 'active');
                    } else {
                        self.renderStatus(button, 'inactive');
                    }

                    break;
                case 'sort':
                    if (command.sort.match(/:asc/g)) {
                        alias = command.sort.replace(/:asc/g, '');
                    }

                    if (command.sort === actions.sort || alias === actions.sort) {
                        self.renderStatus(button, 'active');
                    } else {
                        self.renderStatus(button, 'inactive');
                    }

                    break;
                case 'toggle':
                    if (toggleArray.length < 1) self.renderStatus(button, 'inactive');

                    if (command.filter === actions.filter) {
                        self.renderStatus(button, 'active');
                    }

                    for (i = 0; i < toggleArray.length; i++) {
                        toggle = toggleArray[i];

                        if (toggle === actions.filter) {
                            // Button matches one active toggle

                            self.renderStatus(button, 'active');

                            break;
                        }

                        self.renderStatus(button, 'inactive');
                    }

                    break;
            }

            self.callActions('afterParseStatusChange', arguments);
        },

        /**
         * @param   {HTMLElement}   button
         * @param   {string}        status
         * @return  {void}
         */

        renderStatus: function(button, status) {
            var self = this;

            self.callActions('beforeRenderStatus', arguments);

            switch (status) {
                case 'active':
                    h.addClass(button, self.classNames.active);
                    h.removeClass(button, self.classNames.disabled);

                    if (self.canDisable) self.el.disabled = false;

                    break;
                case 'inactive':
                    h.removeClass(button, self.classNames.active);
                    h.removeClass(button, self.classNames.disabled);

                    if (self.canDisable) self.el.disabled = false;

                    break;
                case 'disabled':
                    if (self.canDisable) self.el.disabled = true;

                    h.addClass(button, self.classNames.disabled);
                    h.removeClass(button, self.classNames.active);

                    break;
            }

            if (self.status !== 'live') {
                // Update the control's status propery if not live

                self.status = status;
            }

            self.callActions('afterRenderStatus', arguments);
        }
    });

    mixitup.controls = [];

    /**
     * @constructor
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.StyleData = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        this.x              = 0;
        this.y              = 0;
        this.top            = 0;
        this.right          = 0;
        this.bottom         = 0;
        this.left           = 0;
        this.width          = 0;
        this.height         = 0;
        this.marginRight    = 0;
        this.marginBottom   = 0;
        this.opacity        = 0;
        this.scale          = new mixitup.TransformData();
        this.translateX     = new mixitup.TransformData();
        this.translateY     = new mixitup.TransformData();
        this.translateZ     = new mixitup.TransformData();
        this.rotateX        = new mixitup.TransformData();
        this.rotateY        = new mixitup.TransformData();
        this.rotateZ        = new mixitup.TransformData();

        this.callActions('afterConstruct');

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.StyleData);

    mixitup.StyleData.prototype = Object.create(mixitup.Base.prototype);

    mixitup.StyleData.prototype.constructor = mixitup.StyleData;

    /**
     * @constructor
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.TransformData = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        this.value  = 0;
        this.unit   = '';

        this.callActions('afterConstruct');

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.TransformData);

    mixitup.TransformData.prototype = Object.create(mixitup.Base.prototype);

    mixitup.TransformData.prototype.constructor = mixitup.TransformData;

    /**
     * @constructor
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.TransformDefaults = function() {
        mixitup.StyleData.apply(this);

        this.callActions('beforeConstruct');

        this.scale.value        = 0.01;
        this.scale.unit         = '';

        this.translateX.value   = 20;
        this.translateX.unit    = 'px';

        this.translateY.value   = 20;
        this.translateY.unit    = 'px';

        this.translateZ.value   = 20;
        this.translateZ.unit    = 'px';

        this.rotateX.value      = 90;
        this.rotateX.unit       = 'deg';

        this.rotateY.value      = 90;
        this.rotateY.unit       = 'deg';

        this.rotateX.value      = 90;
        this.rotateX.unit       = 'deg';

        this.rotateZ.value      = 180;
        this.rotateZ.unit       = 'deg';

        this.callActions('afterConstruct');

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.TransformDefaults);

    mixitup.TransformDefaults.prototype = Object.create(mixitup.StyleData.prototype);

    mixitup.TransformDefaults.prototype.constructor = mixitup.TransformDefaults;

    /**
     * @private
     * @static
     * @since   3.0.0
     * @type    {mixitup.TransformDefaults}
     */

    mixitup.transformDefaults = new mixitup.TransformDefaults();

    /**
     * @constructor
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.EventDetail = function() {
        this.state          = null;
        this.futureState    = null;
        this.instance       = null;
        this.originalEvent  = null;
    };

    /**
     * The `mixitup.Events` class contains all custom events dispatched by MixItUp at various
     * points within the lifecycle of a mixer operation.
     *
     * Each event is analogous to the callback function of the same name defined in
     * the `callbacks` configuration object, and is triggered immediately before it.
     *
     * Events are always triggered from the container element on which MixItUp is instantiated
     * upon.
     *
     * As with any event, registered event handlers receive the event object as a parameter
     * which includes a `detail` property containting references to the current `state`,
     * the `mixer` instance, and other event-specific properties described below.
     *
     * @constructor
     * @namespace
     * @memberof    mixitup
     * @public
     * @since       3.0.0
     */

    mixitup.Events = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        /**
         * A custom event triggered immediately after any MixItUp operation is requested
         * and before animations have begun.
         *
         * The `mixStart` event also exposes a `futureState` property via the
         * `event.detail` object, which represents the final state of the mixer once
         * the requested operation has completed.
         *
         * @name        mixStart
         * @memberof    mixitup.Events
         * @static
         * @type        {CustomEvent}
         */

        this.mixStart = null;

        /**
         * A custom event triggered when a MixItUp operation is requested while another
         * operation is in progress, and the animation queue is full, or queueing
         * is disabled.
         *
         * @name        mixBusy
         * @memberof    mixitup.Events
         * @static
         * @type        {CustomEvent}
         */

        this.mixBusy = null;

        /**
         * A custom event triggered after any MixItUp operation has completed, and the
         * state has been updated.
         *
         * @name        mixEnd
         * @memberof    mixitup.Events
         * @static
         * @type        {CustomEvent}
         */

        this.mixEnd = null;

        /**
         * A custom event triggered whenever a filter operation "fails", i.e. no targets
         * could be found matching the requested filter.
         *
         * @name        mixFail
         * @memberof    mixitup.Events
         * @static
         * @type        {CustomEvent}
         */

        this.mixFail = null;

        /**
         * A custom event triggered whenever a MixItUp control is clicked, and before its
         * respective operation is requested.
         *
         * This event also exposes an `originalEvent` property via the `event.detail`
         * object, which holds a reference to the original click event.
         *
         * @name        mixClick
         * @memberof    mixitup.Events
         * @static
         * @type        {CustomEvent}
         */

        this.mixClick = null;

        this.callActions('afterConstruct');

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.Events);

    mixitup.Events.prototype = Object.create(mixitup.Base.prototype);

    mixitup.Events.prototype.constructor = mixitup.Events;

    /**
     * @private
     * @param   {string}      eventType
     * @param   {Element}     el
     * @param   {object}      detail
     * @param   {Document}    [doc]
     */

    mixitup.Events.prototype.fire = function(eventType, el, detail, doc) {
        var self        = this,
            event       = null,
            eventDetail = new mixitup.EventDetail();

        self.callActions('beforeFire', arguments);

        if (typeof self[eventType] === 'undefined') {
            throw new Error('Event type "' + eventType + '" not found.');
        }

        eventDetail.state = new mixitup.State();

        h.extend(eventDetail.state, detail.state);

        if (detail.futureState) {
            eventDetail.futureState = new mixitup.State();

            h.extend(eventDetail.futureState, detail.futureState);
        }

        eventDetail.instance = detail.instance;

        if (detail.originalEvent) {
            eventDetail.originalEvent = detail.originalEvent;
        }

        event = h.getCustomEvent(eventType, eventDetail, doc);

        self.callFilters('eventFire', event, arguments);

        el.dispatchEvent(event);
    };

    // Asign a singleton instance to `mixitup.events`:

    mixitup.events = new mixitup.Events();

    /**
     * @constructor
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.QueueItem = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        this.args           = [];
        this.instruction    = null;
        this.triggerElement = null;
        this.deferred       = null;
        this.isToggling     = false;

        this.callActions('afterConstruct');

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.QueueItem);

    mixitup.QueueItem.prototype = Object.create(mixitup.Base.prototype);

    mixitup.QueueItem.prototype.constructor = mixitup.QueueItem;

    /**
     * The `mixitup.Mixer` class is used to hold discreet, user-configured
     * instances of MixItUp on a provided container element.
     *
     * Mixer instances are returned whenever the `mixitup()` factory function is called,
     * which expose a range of methods enabling API-based filtering, sorting,
     * insertion, removal and more.
     *
     * @constructor
     * @namespace
     * @memberof    mixitup
     * @public
     * @since       3.0.0
     */

    mixitup.Mixer = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        this.config            = new mixitup.Config();

        this.id                = '';

        this.isBusy            = false;
        this.isToggling        = false;
        this.incPadding        = true;

        this.controls          = [];
        this.targets           = [];
        this.origOrder         = [];
        this.cache             = {};

        this.toggleArray       = [];

        this.targetsMoved      = 0;
        this.targetsImmovable  = 0;
        this.targetsBound      = 0;
        this.targetsDone       = 0;

        this.staggerDuration   = 0;
        this.effectsIn         = null;
        this.effectsOut        = null;
        this.transformIn       = [];
        this.transformOut      = [];
        this.queue             = [];

        this.state             = null;
        this.lastOperation     = null;
        this.lastClicked       = null;
        this.userCallback      = null;
        this.userDeferred      = null;

        this.dom               = new mixitup.MixerDom();

        this.callActions('afterConstruct');

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.Mixer);

    mixitup.Mixer.prototype = Object.create(mixitup.Base.prototype);

    h.extend(mixitup.Mixer.prototype,
    /** @lends mixitup.Mixer */
    {
        constructor: mixitup.Mixer,

        /**
         * @private
         * @instance
         * @since 3.0.0
         * @param {HTMLElement} container
         * @param {HTMLElement} document
         * @param {string}      id
         * @param {object}      [config]
         */

        attach: function(container, document, id, config) {
            var self    = this,
                target  = null,
                i       = -1;

            self.callActions('beforeAttach', arguments);

            self.id = id;

            if (config) {
                h.extend(self.config, config, true, true);
            }

            self.sanitizeConfig();

            self.cacheDom(container, document);

            if (self.config.layout.containerClassName) {
                h.addClass(self.dom.container, self.config.layout.containerClassName);
            }

            if (!mixitup.features.has.transitions) {
                self.config.animation.enable = false;
            }

            if (typeof window.console === 'undefined') {
                self.config.debug.showWarnings = false;
            }

            if (self.config.data.uidKey) {
                // If the dataset API is in use, force disable controls

                self.config.controls.enable = false;
            }

            self.indexTargets();

            self.state = self.getInitialState();

            for (i = 0; target = self.lastOperation.toHide[i]; i++) {
                target.hide();
            }

            if (self.config.controls.enable) {
                self.initControls();

                self.buildToggleArray(null, self.state);

                self.updateControls({
                    filter: self.state.activeFilter,
                    sort: self.state.activeSort
                });
            }

            self.parseEffects();

            self.callActions('afterAttach', arguments);
        },

        /**
         * @private
         * @instance
         * @since 3.0.0
         * @return {void}
         */

        sanitizeConfig: function() {
            var self = this;

            self.callActions('beforeSanitizeConfig', arguments);

            // Sanitize enum/string config options

            self.config.controls.scope          = self.config.controls.scope.toLowerCase().trim();
            self.config.controls.toggleLogic    = self.config.controls.toggleLogic.toLowerCase().trim();
            self.config.controls.toggleDefault  = self.config.controls.toggleDefault.toLowerCase().trim();

            self.config.animation.effects       = self.config.animation.effects.trim();

            self.callActions('afterSanitizeConfig', arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @return  {mixitup.State}
         */

        getInitialState: function() {
            var self        = this,
                state       = new mixitup.State(),
                operation   = new mixitup.Operation();

            self.callActions('beforeGetInitialState', arguments);

            // Map initial values into a mock state object in order to construct an operation

            state.activeContainerClassName = self.config.layout.containerClassName;

            if (self.config.load.dataset) {
                // Dataset API

                if (!self.config.data.uidKey || typeof self.config.data.uidKey !== 'string') {
                    throw new TypeError(mixitup.messages.errorConfigDataUidKeyNotSet());
                }

                operation.startDataset = operation.newDataset = state.activeDataset = self.config.load.dataset.slice();
                operation.startContainerClassName = operation.newContainerClassName = state.activeContainerClassName;
                operation.show = self.targets.slice();

                state = self.callFilters('stateGetInitialState', state, arguments);
            } else {
                // DOM API

                state.activeFilter              = self.parseFilterArgs([self.config.load.filter]).command;
                state.activeSort                = self.parseSortArgs([self.config.load.sort]).command;
                state.totalTargets              = self.targets.length;

                state = self.callFilters('stateGetInitialState', state, arguments);

                if (
                    state.activeSort.collection || state.activeSort.attribute ||
                    state.activeSort.order === 'random' || state.activeSort.order === 'desc'
                ) {
                    // Sorting on load

                    operation.newSort = state.activeSort;

                    self.sortOperation(operation);

                    self.printSort(false, operation);

                    self.targets = operation.newOrder;
                } else {
                    operation.startOrder = operation.newOrder = self.targets;
                }

                operation.startFilter               = operation.newFilter               = state.activeFilter;
                operation.startSort                 = operation.newSort                 = state.activeSort;
                operation.startContainerClassName   = operation.newContainerClassName   = state.activeContainerClassName;

                if (operation.newFilter.selector === 'all') {
                    operation.newFilter.selector = self.config.selectors.target;
                } else if (operation.newFilter.selector === 'none') {
                    operation.newFilter.selector = '';
                }
            }

            operation = self.callFilters('operationGetInitialState', operation, [state]);

            self.lastOperation = operation;

            if (operation.newFilter) {
                self.filterOperation(operation);
            }

            state = self.buildState(operation);

            return state;
        },

        /**
         * Caches references of DOM elements neccessary for the mixer's functionality.
         *
         * @private
         * @instance
         * @since   3.0.0
         * @param   {HTMLElement}       el
         * @param   {HTMLHtmlElement}   document
         * @return  {void}
         */

        cacheDom: function(el, document) {
            var self    = this;

            self.callActions('beforeCacheDom', arguments);

            self.dom.document  = document;
            self.dom.body      = self.dom.document.querySelector('body');
            self.dom.container = el;
            self.dom.parent    = el;

            self.callActions('afterCacheDom', arguments);
        },

        /**
         * Indexes all child elements of the mixer matching the `selectors.target`
         * selector, instantiating a mixitup.Target for each one.
         *
         * @private
         * @instance
         * @since   3.0.0
         * @return  {void}
         */

        indexTargets: function() {
            var self            = this,
                target          = null,
                el              = null,
                dataset         = null,
                i               = -1;

            self.callActions('beforeIndexTargets', arguments);

            self.dom.targets = self.config.layout.allowNestedTargets ?
                self.dom.container.querySelectorAll(self.config.selectors.target) :
                h.children(self.dom.container, self.config.selectors.target, self.dom.document);

            self.dom.targets = h.arrayFromList(self.dom.targets);

            self.targets = [];

            if ((dataset = self.config.load.dataset) && dataset.length !== self.dom.targets.length) {
                throw new Error(mixitup.messages.errorDatasetPrerenderedMismatch());
            }

            if (self.dom.targets.length) {
                for (i = 0; el = self.dom.targets[i]; i++) {
                    target = new mixitup.Target();

                    target.init(el, self, dataset ? dataset[i] : void(0));

                    target.isInDom = true;

                    self.targets.push(target);
                }

                self.dom.parent = self.dom.targets[0].parentElement === self.dom.container ?
                    self.dom.container :
                    self.dom.targets[0].parentElement;
            }

            self.origOrder = self.targets;

            self.callActions('afterIndexTargets', arguments);
        },

        initControls: function() {
            var self                = this,
                definition          = '',
                controlElements     = null,
                el                  = null,
                parent              = null,
                delagators          = null,
                control             = null,
                i                   = -1,
                j                   = -1;

            self.callActions('beforeInitControls', arguments);

            switch (self.config.controls.scope) {
                case 'local':
                    parent = self.dom.container;

                    break;
                case 'global':
                    parent = self.dom.document;

                    break;
                default:
                    throw new Error(mixitup.messages.errorConfigInvalidControlsScope());
            }

            for (i = 0; definition = mixitup.controlDefinitions[i]; i++) {
                if (self.config.controls.live || definition.live) {
                    if (definition.parent) {
                        delagators = self.dom[definition.parent];

                        if (!delagators || delagators.length < 0) continue;

                        if (typeof delagators.length !== 'number') {
                            delagators = [delagators];
                        }
                    } else {
                        delagators = [parent];
                    }

                    for (j = 0; (el = delagators[j]); j++) {
                        control = self.getControl(el,  definition.type, definition.selector);

                        self.controls.push(control);
                    }
                } else {
                    controlElements = parent.querySelectorAll(self.config.selectors.control + definition.selector);

                    for (j = 0; (el = controlElements[j]); j++) {
                        control = self.getControl(el, definition.type, '');

                        if (!control) continue;

                        self.controls.push(control);
                    }
                }
            }

            self.callActions('afterInitControls', arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {HTMLElement} el
         * @param   {string}      type
         * @param   {string}      selector
         * @return  {mixitup.Control|null}
         */

        getControl: function(el, type, selector) {
            var self    = this,
                control = null,
                i       = -1;

            self.callActions('beforeGetControl', arguments);

            if (!selector) {
                // Static controls only

                for (i = 0; control = mixitup.controls[i]; i++) {
                    if (control.el === el && control.isBound(self)) {
                        // Control already bound to this mixer (as another type).

                        // NB: This prevents duplicate controls from being registered where a selector
                        // might collide, eg: "[data-filter]" and "[data-filter][data-sort]"

                        return self.callFilters('controlGetControl', null, arguments);
                    } else if (control.el === el && control.type === type && control.selector === selector) {
                        // Another mixer is already using this control, add this mixer as a binding

                        control.addBinding(self);

                        return self.callFilters('controlGetControl', control, arguments);
                    }
                }
            }

            // Create new control

            control = new mixitup.Control();

            control.init(el, type, selector);

            control.classNames.base     = h.getClassname(self.config.classNames, type);
            control.classNames.active   = h.getClassname(self.config.classNames, type, self.config.classNames.modifierActive);
            control.classNames.disabled = h.getClassname(self.config.classNames, type, self.config.classNames.modifierDisabled);

            // Add a reference to this mixer as a binding

            control.addBinding(self);

            return self.callFilters('controlGetControl', control, arguments);
        },

        /**
         * Creates a compound selector by joining the `toggleArray` value as per the
         * defined toggle logic.
         *
         * @private
         * @instance
         * @since   3.0.0
         * @return  {string}
         */

        getToggleSelector: function() {
            var self            = this,
                delineator      = self.config.controls.toggleLogic === 'or' ? ', ' : '',
                toggleSelector  = '';

            self.callActions('beforeGetToggleSelector', arguments);

            self.toggleArray = h.clean(self.toggleArray);

            toggleSelector = self.toggleArray.join(delineator);

            if (toggleSelector === '') {
                toggleSelector = self.config.controls.toggleDefault;
            }

            return self.callFilters('selectorGetToggleSelector', toggleSelector, arguments);
        },

        /**
         * Breaks compound selector strings in an array of discreet selectors,
         * as per the active `controls.toggleLogic` configuration option. Accepts
         * either a dynamic command object, or a state object.
         *
         * @private
         * @instance
         * @since   2.0.0
         * @param   {object}        [command]
         * @param   {mixitup.State} [state]
         * @return  {void}
         */

        buildToggleArray: function(command, state) {
            var self                    = this,
                activeFilterSelector    = '';

            self.callActions('beforeBuildToggleArray', arguments);

            if (command && command.filter) {
                activeFilterSelector = command.filter.selector.replace(/\s/g, '');
            } else if (state) {
                activeFilterSelector = state.activeFilter.selector.replace(/\s/g, '');
            } else {
                return;
            }

            if (activeFilterSelector === self.config.selectors.target || activeFilterSelector === 'all') {
                activeFilterSelector = '';
            }

            if (self.config.controls.toggleLogic === 'or') {
                self.toggleArray = activeFilterSelector.split(',');
            } else {
                self.toggleArray = self.splitCompoundSelector(activeFilterSelector);
            }

            self.toggleArray = h.clean(self.toggleArray);

            self.callActions('afterBuildToggleArray', arguments);
        },

        /**
         * Takes a compound selector (e.g. `.cat-1.cat-2`, `[data-cat="1"][data-cat="2"]`)
         * and breaks into its individual selectors.
         *
         * @private
         * @instance
         * @since   3.0.0
         * @param   {string} compoundSelector
         * @return  {string[]}
         */

        splitCompoundSelector: function(compoundSelector) {
            // Break at a `.` or `[`, capturing the delineator

            var partials    = compoundSelector.split(/([\.\[])/g),
                toggleArray = [],
                selector    = '',
                i           = -1;

            if (partials[0] === '') {
                partials.shift();
            }

            for (i = 0; i < partials.length; i++) {
                if (i % 2 === 0) {
                    selector = '';
                }

                selector += partials[i];

                if (i % 2 !== 0) {
                    toggleArray.push(selector);
                }
            }

            return toggleArray;
        },

        /**
         * Updates controls to their active/inactive state based on the command or
         * current state of the mixer.
         *
         * @private
         * @instance
         * @since   2.0.0
         * @param   {object} command
         * @return  {void}
         */

        updateControls: function(command) {
            var self    = this,
                control = null,
                output  = new mixitup.CommandMultimix(),
                i       = -1;

            self.callActions('beforeUpdateControls', arguments);

            // Sanitise to defaults

            if (command.filter) {
                output.filter = command.filter.selector;
            } else {
                output.filter = self.state.activeFilter.selector;
            }

            if (command.sort) {
                output.sort = self.buildSortString(command.sort);
            } else {
                output.sort = self.buildSortString(self.state.activeSort);
            }

            if (output.filter === self.config.selectors.target) {
                output.filter = 'all';
            }

            if (output.filter === '') {
                output.filter = 'none';
            }

            h.freeze(output);

            for (i = 0; control = self.controls[i]; i++) {
                control.update(output, self.toggleArray);
            }

            self.callActions('afterUpdateControls', arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {mixitup.CommandSort}   command
         * @return  {string}
         */

        buildSortString: function(command) {
            var self    = this;
            var output  = '';

            output += command.sortString;

            if (command.next) {
                output += ' ' + self.buildSortString(command.next);
            }

            return output;
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {object}        command
         * @param   {Operation}     operation
         * @return  {Promise.<mixitup.State>}
         */

        insertTargets: function(command, operation) {
            var self            = this,
                nextSibling     = null,
                insertionIndex  = -1,
                frag            = null,
                target          = null,
                el              = null,
                i               = -1;

            self.callActions('beforeInsertTargets', arguments);

            if (typeof command.index === 'undefined') command.index = 0;

            nextSibling = self.getNextSibling(command.index, command.sibling, command.position);
            frag        = self.dom.document.createDocumentFragment();

            if (nextSibling) {
                insertionIndex = h.index(nextSibling, self.config.selectors.target);
            } else {
                insertionIndex = self.targets.length;
            }

            if (command.collection) {
                for (i = 0; el = command.collection[i]; i++) {
                    if (self.dom.targets.indexOf(el) > -1) {
                        throw new Error(mixitup.messages.errorInsertPreexistingElement());
                    }

                    // Ensure elements are hidden when they are added to the DOM, so they can
                    // be animated in gracefully

                    el.style.display = 'none';

                    frag.appendChild(el);
                    frag.appendChild(self.dom.document.createTextNode(' '));

                    if (!h.isElement(el, self.dom.document) || !el.matches(self.config.selectors.target)) continue;

                    target = new mixitup.Target();

                    target.init(el, self);

                    target.isInDom = true;

                    self.targets.splice(insertionIndex, 0, target);

                    insertionIndex++;
                }

                self.dom.parent.insertBefore(frag, nextSibling);
            }

            // Since targets have been added, the original order must be updated

            operation.startOrder = self.origOrder = self.targets;

            self.callActions('afterInsertTargets', arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {Number}      [index]
         * @param   {Element}     [sibling]
         * @param   {string}      [position]
         * @return  {Element}
         */

        getNextSibling: function(index, sibling, position) {
            var self    = this,
                element = null;

            index = Math.max(index, 0);

            if (sibling && position === 'before') {
                // Explicit sibling

                element = sibling;
            } else if (sibling && position === 'after') {
                // Explicit sibling

                element = sibling.nextElementSibling || null;
            } else if (self.targets.length > 0 && typeof index !== 'undefined') {
                // Index and targets exist

                element = (index < self.targets.length || !self.targets.length) ?
                    self.targets[index].dom.el :
                    self.targets[self.targets.length - 1].dom.el.nextElementSibling;
            } else if (self.targets.length === 0 && self.dom.parent.children.length > 0) {
                // No targets but other siblings

                if (self.config.layout.siblingAfter) {
                    element = self.config.layout.siblingAfter;
                } else if (self.config.layout.siblingBefore) {
                    element = self.config.layout.siblingBefore.nextElementSibling;
                } else {
                    self.dom.parent.children[0];
                }
            } else {
                
            }

            return self.callFilters('elementGetNextSibling', element, arguments);
        },

        /**
         * @private
         * @instance
         * @since   2.0.0
         * @param   {Operation}     operation
         * @return  {void}
         */

        filterOperation: function(operation) {
            var self        = this,
                testResult  = false,
                index       = -1,
                action      = '',
                target      = null,
                i           = -1;

            self.callActions('beforeFilterOperation', arguments);

            action = operation.newFilter.action;

            for (i = 0; target = operation.newOrder[i]; i++) {
                if (operation.newFilter.collection) {
                    // show via collection

                    testResult = operation.newFilter.collection.indexOf(target.dom.el) > -1;
                } else {
                    // show via selector

                    if (operation.newFilter.selector === '') {
                        testResult = false;
                    } else {
                        testResult = target.dom.el.matches(operation.newFilter.selector);
                    }
                }

                self.evaluateHideShow(testResult, target, action, operation);
            }

            if (operation.toRemove.length) {
                for (i = 0; target = operation.show[i]; i++) {
                    if (operation.toRemove.indexOf(target) > -1) {
                        // If any shown targets should be removed, move them into the toHide array

                        operation.show.splice(i, 1);

                        if ((index = operation.toShow.indexOf(target)) > -1) {
                            operation.toShow.splice(index, 1);
                        }

                        operation.toHide.push(target);
                        operation.hide.push(target);

                        i--;
                    }
                }
            }

            operation.matching = operation.show.slice();

            if (operation.show.length === 0 && operation.newFilter.selector !== '' && self.targets.length !== 0) {
                operation.hasFailed = true;
            }

            self.callActions('afterFilterOperation', arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {boolean}   testResult
         * @param   {Element}   target
         * @param   {string}    action
         * @param   {Operation} operation
         * @return  {void}
         */

        evaluateHideShow: function(testResult, target, action, operation) {
            var self = this,
                filteredTestResult = false,
                args = Array.prototype.slice.call(arguments, 1);

            filteredTestResult = self.callFilters('testResultEvaluateHideShow', testResult, args);

            self.callActions('beforeEvaluateHideShow', arguments);

            if (
                filteredTestResult === true && action === 'show' ||
                filteredTestResult === false && action === 'hide'
            ) {
                operation.show.push(target);

                !target.isShown && operation.toShow.push(target);
            } else {
                operation.hide.push(target);

                target.isShown && operation.toHide.push(target);
            }

            self.callActions('afterEvaluateHideShow', arguments);
        },

        /**
         * @private
         * @instance
         * @since   2.0.0
         * @param   {Operation}     operation
         * @return  {void}
         */

        sortOperation: function(operation) {
            var self     = this,
                newOrder = [],
                target   = null,
                el       = null,
                i        = -1;

            self.callActions('beforeSortOperation', arguments);

            operation.startOrder = self.targets;

            if (operation.newSort.collection) {
                // Sort by collection

                newOrder = [];

                for (i = 0; (el = operation.newSort.collection[i]); i++) {
                    if (self.dom.targets.indexOf(el) < 0) {
                        throw new Error(mixitup.messages.errorSortNonExistentElement());
                    }

                    target = new mixitup.Target();

                    target.init(el, self);

                    target.isInDom = true;

                    newOrder.push(target);
                }

                operation.newOrder = newOrder;
            } else if (operation.newSort.order === 'random') {
                // Sort random

                operation.newOrder = h.arrayShuffle(operation.startOrder);
            } else if (operation.newSort.attribute === '') {
                // Sort by default

                operation.newOrder = self.origOrder.slice();

                if (operation.newSort.order === 'desc') {
                    operation.newOrder.reverse();
                }
            } else {
                // Sort by attribute

                operation.newOrder = operation.startOrder.slice();

                operation.newOrder.sort(function(a, b) {
                    return self.compare(a, b, operation.newSort);
                });
            }

            if (h.isEqualArray(operation.newOrder, operation.startOrder)) {
                operation.willSort = false;
            }

            self.callActions('afterSortOperation', arguments);
        },

        /**
         * @private
         * @instance
         * @since   2.0.0
         * @param   {mixitup.Target}        a
         * @param   {mixitup.Target}        b
         * @param   {mixitup.CommandSort}   command
         * @return  {Number}
         */

        compare: function(a, b, command) {
            var self        = this,
                order       = command.order,
                attrA       = self.getAttributeValue(a, command.attribute),
                attrB       = self.getAttributeValue(b, command.attribute);

            if (isNaN(attrA * 1) || isNaN(attrB * 1)) {
                attrA = attrA.toLowerCase();
                attrB = attrB.toLowerCase();
            } else {
                attrA = attrA * 1;
                attrB = attrB * 1;
            }

            if (attrA < attrB) {
                return order === 'asc' ? -1 : 1;
            }

            if (attrA > attrB) {
                return order === 'asc' ? 1 : -1;
            }

            if (attrA === attrB && command.next) {
                return self.compare(a, b, command.next);
            }

            return 0;
        },

        /**
         * Reads the values of any data attributes present the provided target element
         * which match the current sort command.
         *
         * @private
         * @instance
         * @since   3.0.0
         * @param   {mixitup.Target}    target
         * @param   {string}            [attribute]
         * @return  {(String|Number)}
         */

        getAttributeValue: function(target, attribute) {
            var self    = this,
                value   = '';

            value = target.dom.el.getAttribute('data-' + attribute);

            if (value === null) {
                if (self.config.debug.showWarnings) {
                    // Encourage users to assign values to all targets to avoid erroneous sorting
                    // when types are mixed

                    console.warn(mixitup.messages.warningInconsistentSortingAttributes({
                        attribute: 'data-' + attribute
                    }));
                }
            }

            // If an attribute is not present, return 0 as a safety value

            return self.callFilters('valueGetAttributeValue', value || 0, arguments);
        },

        /**
         * Inserts elements into the DOM in the appropriate
         * order using a document fragment for minimal
         * DOM thrashing
         *
         * @private
         * @instance
         * @since   2.0.0
         * @param   {boolean}   isResetting
         * @param   {Operation} operation
         * @return  {void}
         */

        printSort: function(isResetting, operation) {
            var self        = this,
                startOrder  = isResetting ? operation.newOrder : operation.startOrder,
                newOrder    = isResetting ? operation.startOrder : operation.newOrder,
                nextSibling = startOrder.length ? startOrder[startOrder.length - 1].dom.el.nextElementSibling : null,
                frag        = window.document.createDocumentFragment(),
                whitespace  = null,
                target      = null,
                el          = null,
                i           = -1;

            self.callActions('beforePrintSort', arguments);

            // Empty the container

            for (i = 0; target = startOrder[i]; i++) {
                el = target.dom.el;

                if (el.style.position === 'absolute') continue;

                h.removeWhitespace(el.previousSibling);

                el.parentElement.removeChild(el);
            }

            whitespace = nextSibling ? nextSibling.previousSibling : self.dom.parent.lastChild;

            if (whitespace && whitespace.nodeName === '#text') {
                h.removeWhitespace(whitespace);
            }

            for (i = 0; target = newOrder[i]; i++) {
                // Add targets into a document fragment

                el = target.dom.el;

                if (h.isElement(frag.lastChild)) {
                    frag.appendChild(window.document.createTextNode(' '));
                }

                frag.appendChild(el);
            }

            // Insert the document fragment into the container
            // before any other non-target elements

            if (self.dom.parent.firstChild && self.dom.parent.firstChild !== nextSibling) {
                frag.insertBefore(window.document.createTextNode(' '), frag.childNodes[0]);
            }

            if (nextSibling) {
                frag.appendChild(window.document.createTextNode(' '));

                self.dom.parent.insertBefore(frag, nextSibling);
            } else {
                self.dom.parent.appendChild(frag);
            }

            self.callActions('afterPrintSort', arguments);
        },

        /**
         * Parses user-defined sort strings (i.e. `default:asc`) into sort commands objects.
         *
         * @private
         * @instance
         * @since   3.0.0
         * @param   {string}                sortString
         * @param   {mixitup.CommandSort}   command
         * @return  {mixitup.CommandSort}
         */

        parseSortString: function(sortString, command) {
            var self        = this,
                rules       = sortString.split(' '),
                current     = command,
                rule        = [],
                i           = -1;

            // command.sortString = sortString;

            for (i = 0; i < rules.length; i++) {
                rule = rules[i].split(':');

                current.sortString  = rules[i];
                current.attribute   = h.dashCase(rule[0]);
                current.order       = rule[1] || 'asc';

                switch (current.attribute) {
                    case 'default':
                        // treat "default" as sorting by no attribute

                        current.attribute = '';

                        break;
                    case 'random':
                        // treat "random" as an order not an attribute

                        current.attribute   = '';
                        current.order       = 'random';

                        break;
                }

                if (!current.attribute || current.order === 'random') break;

                if (i < rules.length - 1) {
                    // Embed reference to the next command

                    current.next = new mixitup.CommandSort();

                    h.freeze(current);

                    current = current.next;
                }
            }

            return self.callFilters('commandsParseSort', command, arguments);
        },

        /**
         * Parses all effects out of the user-defined `animation.effects` string into
         * their respective properties and units.
         *
         * @private
         * @instance
         * @since   2.0.0
         * @return  {void}
         */

        parseEffects: function() {
            var self            = this,
                transformName   = '',
                effectsIn       = self.config.animation.effectsIn || self.config.animation.effects,
                effectsOut      = self.config.animation.effectsOut || self.config.animation.effects;

            self.callActions('beforeParseEffects', arguments);

            self.effectsIn      = new mixitup.StyleData();
            self.effectsOut     = new mixitup.StyleData();
            self.transformIn    = [];
            self.transformOut   = [];

            self.effectsIn.opacity = self.effectsOut.opacity = 1;

            self.parseEffect('fade', effectsIn, self.effectsIn, self.transformIn);
            self.parseEffect('fade', effectsOut, self.effectsOut, self.transformOut, true);

            for (transformName in mixitup.transformDefaults) {
                if (!(mixitup.transformDefaults[transformName] instanceof mixitup.TransformData)) {
                    continue;
                }

                self.parseEffect(transformName, effectsIn, self.effectsIn, self.transformIn);
                self.parseEffect(transformName, effectsOut, self.effectsOut, self.transformOut, true);
            }

            self.parseEffect('stagger', effectsIn, self.effectsIn, self.transformIn);
            self.parseEffect('stagger', effectsOut, self.effectsOut, self.transformOut, true);

            self.callActions('afterParseEffects', arguments);
        },

        /**
         * @private
         * @instance
         * @since   2.0.0
         * @param   {string}    effectName
         * @param   {string}    effectString
         * @param   {StyleData} effects
         * @param   {String[]}  transform
         * @param   {boolean}   [isOut]
         */

        parseEffect: function(effectName, effectString, effects, transform, isOut) {
            var self        = this,
                re          = /\(([^)]+)\)/,
                propIndex   = -1,
                str         = '',
                match       = [],
                val         = '',
                units       = ['%', 'px', 'em', 'rem', 'vh', 'vw', 'deg'],
                unit        = '',
                i           = -1;

            self.callActions('beforeParseEffect', arguments);

            if (typeof effectString !== 'string') {
                throw new TypeError(mixitup.messages.errorConfigInvalidAnimationEffects());
            }

            if (effectString.indexOf(effectName) < 0) {
                // The effect is not present in the effects string

                if (effectName === 'stagger') {
                    // Reset stagger to 0

                    self.staggerDuration = 0;
                }

                return;
            }

            // The effect is present

            propIndex = effectString.indexOf(effectName + '(');

            if (propIndex > -1) {
                // The effect has a user defined value in parentheses

                // Extract from the first parenthesis to the end of string

                str = effectString.substring(propIndex);

                // Match any number of characters between "(" and ")"

                match = re.exec(str);

                val = match[1];
            }

            switch (effectName) {
                case 'fade':
                    effects.opacity = val ? parseFloat(val) : 0;

                    break;
                case 'stagger':
                    self.staggerDuration = val ? parseFloat(val) : 100;

                    // TODO: Currently stagger must be applied globally, but
                    // if seperate values are specified for in/out, this should
                    // be respected

                    break;
                default:
                    // All other effects are transforms following the same structure

                    if (isOut && self.config.animation.reverseOut && effectName !== 'scale') {
                        effects[effectName].value =
                            (val ? parseFloat(val) : mixitup.transformDefaults[effectName].value) * -1;
                    } else {
                        effects[effectName].value =
                            (val ? parseFloat(val) : mixitup.transformDefaults[effectName].value);
                    }

                    if (val) {
                        for (i = 0; unit = units[i]; i++) {
                            if (val.indexOf(unit) > -1) {
                                effects[effectName].unit = unit;

                                break;
                            }
                        }
                    } else {
                        effects[effectName].unit = mixitup.transformDefaults[effectName].unit;
                    }

                    transform.push(
                        effectName +
                        '(' +
                        effects[effectName].value +
                        effects[effectName].unit +
                        ')'
                    );
            }

            self.callActions('afterParseEffect', arguments);
        },

        /**
         * @private
         * @instance
         * @since   2.0.0
         * @param   {Operation}     operation
         * @return  {State}
         */

        buildState: function(operation) {
            var self        = this,
                state       = new mixitup.State(),
                target      = null,
                i           = -1;

            self.callActions('beforeBuildState', arguments);

            // Map target elements into state arrays.
            // the real target objects should never be exposed

            for (i = 0; target = self.targets[i]; i++) {
                if (!operation.toRemove.length || operation.toRemove.indexOf(target) < 0) {
                    state.targets.push(target.dom.el);
                }
            }

            for (i = 0; target = operation.matching[i]; i++) {
                state.matching.push(target.dom.el);
            }

            for (i = 0; target = operation.show[i]; i++) {
                state.show.push(target.dom.el);
            }

            for (i = 0; target = operation.hide[i]; i++) {
                if (!operation.toRemove.length || operation.toRemove.indexOf(target) < 0) {
                    state.hide.push(target.dom.el);
                }
            }

            state.id                        = self.id;
            state.container                 = self.dom.container;
            state.activeFilter              = operation.newFilter;
            state.activeSort                = operation.newSort;
            state.activeDataset             = operation.newDataset;
            state.activeContainerClassName  = operation.newContainerClassName;
            state.hasFailed                 = operation.hasFailed;
            state.totalTargets              = self.targets.length;
            state.totalShow                 = operation.show.length;
            state.totalHide                 = operation.hide.length;
            state.totalMatching             = operation.matching.length;
            state.triggerElement            = operation.triggerElement;

            return self.callFilters('stateBuildState', state, arguments);
        },

        /**
         * @private
         * @instance
         * @since   2.0.0
         * @param   {boolean}   shouldAnimate
         * @param   {Operation} operation
         * @return  {void}
         */

        goMix: function(shouldAnimate, operation) {
            var self        = this,
                deferred    = null;

            self.callActions('beforeGoMix', arguments);

            // If the animation duration is set to 0ms,
            // or no effects specified,
            // or the container is hidden
            // then abort animation

            if (
                !self.config.animation.duration || !self.config.animation.effects || !h.isVisible(self.dom.container)
            ) {
                shouldAnimate = false;
            }

            if (
                !operation.toShow.length &&
                !operation.toHide.length &&
                !operation.willSort &&
                !operation.willChangeLayout
            ) {
                // If nothing to show or hide, and not sorting or
                // changing layout

                shouldAnimate = false;
            }

            if (
                !operation.startState.show.length &&
                !operation.show.length
            ) {
                // If nothing currently shown, nothing to show

                shouldAnimate = false;
            }

            mixitup.events.fire('mixStart', self.dom.container, {
                state: operation.startState,
                futureState: operation.newState,
                instance: self
            }, self.dom.document);

            if (typeof self.config.callbacks.onMixStart === 'function') {
                self.config.callbacks.onMixStart.call(
                    self.dom.container,
                    operation.startState,
                    operation.newState,
                    self
                );
            }

            h.removeClass(self.dom.container, h.getClassname(self.config.classNames, 'container', self.config.classNames.modifierFailed));

            if (!self.userDeferred) {
                // Queue empty, no pending operations

                deferred = self.userDeferred = h.defer(mixitup.libraries);
            } else {
                // Use existing deferred

                deferred = self.userDeferred;
            }

            self.isBusy = true;

            if (!shouldAnimate || !mixitup.features.has.transitions) {
                // Abort

                if (self.config.debug.fauxAsync) {
                    setTimeout(function() {
                        self.cleanUp(operation);
                    }, self.config.animation.duration);
                } else {
                    self.cleanUp(operation);
                }

                return self.callFilters('promiseGoMix', deferred.promise, arguments);
            }

            // If we should animate and the platform supports transitions, go for it

            if (window.pageYOffset !== operation.docState.scrollTop) {
                window.scrollTo(operation.docState.scrollLeft, operation.docState.scrollTop);
            }

            if (self.config.animation.applyPerspective) {
                self.dom.parent.style[mixitup.features.perspectiveProp] =
                    self.config.animation.perspectiveDistance;

                self.dom.parent.style[mixitup.features.perspectiveOriginProp] =
                    self.config.animation.perspectiveOrigin;
            }

            if (
                self.config.animation.animateResizeContainer &&
                operation.startHeight !== operation.newHeight &&
                operation.viewportDeltaY !== operation.startHeight - operation.newHeight
            ) {
                self.dom.parent.style.height = operation.startHeight + 'px';
            }

            if (
                self.config.animation.animateResizeContainer &&
                operation.startWidth !== operation.newWidth &&
                operation.viewportDeltaX !== operation.startWidth - operation.newWidth
            ) {
                self.dom.parent.style.width = operation.startWidth + 'px';
            }

            if (operation.startHeight === operation.newHeight) {
                self.dom.parent.style.height = operation.startHeight + 'px';
            }

            if (operation.startWidth === operation.newWidth) {
                self.dom.parent.style.width = operation.startWidth + 'px';
            }

            if (operation.startHeight === operation.newHeight && operation.startWidth === operation.newWidth) {
                self.dom.parent.style.overflow = 'hidden';
            }

            requestAnimationFrame(function() {
                self.moveTargets(operation);
            });

            return self.callFilters('promiseGoMix', deferred.promise, arguments);
        },

        /**
         * @private
         * @instance
         * @since   2.0.0
         * @param   {Operation}     operation
         * @return  {void}
         */

        getStartMixData: function(operation) {
            var self        = this,
                parentStyle = window.getComputedStyle(self.dom.parent),
                parentRect  = self.dom.parent.getBoundingClientRect(),
                target      = null,
                data        = {},
                i           = -1,
                boxSizing   = parentStyle[mixitup.features.boxSizingProp];

            self.incPadding = (boxSizing === 'border-box');

            self.callActions('beforeGetStartMixData', arguments);

            for (i = 0; target = operation.show[i]; i++) {
                data = target.getPosData();

                operation.showPosData[i] = {
                    startPosData: data
                };
            }

            for (i = 0; target = operation.toHide[i]; i++) {
                data = target.getPosData();

                operation.toHidePosData[i] = {
                    startPosData: data
                };
            }

            operation.startX = parentRect.left;
            operation.startY = parentRect.top;

            operation.startHeight = self.incPadding ?
                parentRect.height :
                parentRect.height -
                    parseFloat(parentStyle.paddingTop) -
                    parseFloat(parentStyle.paddingBottom) -
                    parseFloat(parentStyle.borderTop) -
                    parseFloat(parentStyle.borderBottom);

            operation.startWidth = self.incPadding ?
                parentRect.width :
                parentRect.width -
                    parseFloat(parentStyle.paddingLeft) -
                    parseFloat(parentStyle.paddingRight) -
                    parseFloat(parentStyle.borderLeft) -
                    parseFloat(parentStyle.borderRight);

            self.callActions('afterGetStartMixData', arguments);
        },

        /**
         * @private
         * @instance
         * @since   2.0.0
         * @param   {Operation}     operation
         * @return  {void}
         */

        setInter: function(operation) {
            var self    = this,
                target  = null,
                i       = -1;

            self.callActions('beforeSetInter', arguments);

            // Prevent scrollbar flicker on non-inertial scroll platforms by clamping height/width

            if (self.config.animation.clampHeight) {
                self.dom.parent.style.height    = operation.startHeight + 'px';
                self.dom.parent.style.overflow  = 'hidden';
            }

            if (self.config.animation.clampWidth) {
                self.dom.parent.style.width     = operation.startWidth + 'px';
                self.dom.parent.style.overflow  = 'hidden';
            }

            for (i = 0; target = operation.toShow[i]; i++) {
                target.show();
            }

            if (operation.willChangeLayout) {
                h.removeClass(self.dom.container, operation.startContainerClassName);
                h.addClass(self.dom.container, operation.newContainerClassName);
            }

            self.callActions('afterSetInter', arguments);
        },

        /**
         * @private
         * @instance
         * @since   2.0.0
         * @param   {Operation}     operation
         * @return  {void}
         */

        getInterMixData: function(operation) {
            var self    = this,
                target  = null,
                i       = -1;

            self.callActions('beforeGetInterMixData', arguments);

            for (i = 0; target = operation.show[i]; i++) {
                operation.showPosData[i].interPosData = target.getPosData();
            }

            for (i = 0; target = operation.toHide[i]; i++) {
                operation.toHidePosData[i].interPosData = target.getPosData();
            }

            self.callActions('afterGetInterMixData', arguments);
        },

        /**
         * @private
         * @instance
         * @since   2.0.0
         * @param   {Operation}     operation
         * @return  {void}
         */

        setFinal: function(operation) {
            var self    = this,
                target  = null,
                i       = -1;

            self.callActions('beforeSetFinal', arguments);

            operation.willSort && self.printSort(false, operation);

            for (i = 0; target = operation.toHide[i]; i++) {
                target.hide();
            }

            self.callActions('afterSetFinal', arguments);
        },

        /**
         * @private
         * @instance
         * @since   2.0.0
         * @param   {Operation}     operation
         * @return  {void}
         */

        getFinalMixData: function(operation) {
            var self        = this,
                parentStyle = null,
                parentRect  = null,
                target      = null,
                i           = -1;

            self.callActions('beforeGetFinalMixData', arguments);

            for (i = 0; target = operation.show[i]; i++) {
                operation.showPosData[i].finalPosData = target.getPosData();
            }

            for (i = 0; target = operation.toHide[i]; i++) {
                operation.toHidePosData[i].finalPosData = target.getPosData();
            }

            // Remove clamping

            if (self.config.animation.clampHeight || self.config.animation.clampWidth) {
                self.dom.parent.style.height    =
                self.dom.parent.style.width     =
                self.dom.parent.style.overflow  = '';
            }

            if (!self.incPadding) {
                parentStyle = window.getComputedStyle(self.dom.parent);
            }

            parentRect  = self.dom.parent.getBoundingClientRect();

            operation.newX = parentRect.left;
            operation.newY = parentRect.top;

            operation.newHeight = self.incPadding ?
                parentRect.height :
                parentRect.height -
                    parseFloat(parentStyle.paddingTop) -
                    parseFloat(parentStyle.paddingBottom) -
                    parseFloat(parentStyle.borderTop) -
                    parseFloat(parentStyle.borderBottom);

            operation.newWidth = self.incPadding ?
                parentRect.width :
                parentRect.width -
                    parseFloat(parentStyle.paddingLeft) -
                    parseFloat(parentStyle.paddingRight) -
                    parseFloat(parentStyle.borderLeft) -
                    parseFloat(parentStyle.borderRight);

            operation.viewportDeltaX = operation.docState.viewportWidth - this.dom.document.documentElement.clientWidth;
            operation.viewportDeltaY = operation.docState.viewportHeight - this.dom.document.documentElement.clientHeight;

            if (operation.willSort) {
                self.printSort(true, operation);
            }

            for (i = 0; target = operation.toShow[i]; i++) {
                target.hide();
            }

            for (i = 0; target = operation.toHide[i]; i++) {
                target.show();
            }

            if (operation.willChangeLayout) {
                h.removeClass(self.dom.container, operation.newContainerClassName);
                h.addClass(self.dom.container, self.config.layout.containerClassName);
            }

            self.callActions('afterGetFinalMixData', arguments);
        },

        /**
         * @private
         * @instance
         * @since    3.0.0
         * @param    {Operation}     operation
         */

        getTweenData: function(operation) {
            var self            = this,
                target          = null,
                posData         = null,
                effectNames     = Object.getOwnPropertyNames(self.effectsIn),
                effectName      = '',
                effect          = null,
                widthChange     = -1,
                heightChange    = -1,
                i               = -1,
                j               = -1;

            self.callActions('beforeGetTweenData', arguments);

            for (i = 0; target = operation.show[i]; i++) {
                posData             = operation.showPosData[i];
                posData.posIn       = new mixitup.StyleData();
                posData.posOut      = new mixitup.StyleData();
                posData.tweenData   = new mixitup.StyleData();

                // Process x and y

                if (target.isShown) {
                    posData.posIn.x = posData.startPosData.x - posData.interPosData.x;
                    posData.posIn.y = posData.startPosData.y - posData.interPosData.y;
                } else {
                    posData.posIn.x = posData.posIn.y = 0;
                }

                posData.posOut.x = posData.finalPosData.x - posData.interPosData.x;
                posData.posOut.y = posData.finalPosData.y - posData.interPosData.y;

                // Process opacity

                posData.posIn.opacity       = target.isShown ? 1 : self.effectsIn.opacity;
                posData.posOut.opacity      = 1;
                posData.tweenData.opacity   = posData.posOut.opacity - posData.posIn.opacity;

                // Adjust x and y if not nudging

                if (!target.isShown && !self.config.animation.nudge) {
                    posData.posIn.x = posData.posOut.x;
                    posData.posIn.y = posData.posOut.y;
                }

                posData.tweenData.x = posData.posOut.x - posData.posIn.x;
                posData.tweenData.y = posData.posOut.y - posData.posIn.y;

                // Process width, height, and margins

                if (self.config.animation.animateResizeTargets) {
                    posData.posIn.width     = posData.startPosData.width;
                    posData.posIn.height    = posData.startPosData.height;

                    // "||" Prevents width/height change from including 0 width/height if hiding or showing

                    widthChange = (posData.startPosData.width || posData.finalPosData.width) - posData.interPosData.width;

                    posData.posIn.marginRight = posData.startPosData.marginRight - widthChange;

                    heightChange = (posData.startPosData.height || posData.finalPosData.height) - posData.interPosData.height;

                    posData.posIn.marginBottom = posData.startPosData.marginBottom - heightChange;

                    posData.posOut.width    = posData.finalPosData.width;
                    posData.posOut.height   = posData.finalPosData.height;

                    widthChange = (posData.finalPosData.width || posData.startPosData.width) - posData.interPosData.width;

                    posData.posOut.marginRight = posData.finalPosData.marginRight - widthChange;

                    heightChange = (posData.finalPosData.height || posData.startPosData.height) - posData.interPosData.height;

                    posData.posOut.marginBottom = posData.finalPosData.marginBottom - heightChange;

                    posData.tweenData.width         = posData.posOut.width - posData.posIn.width;
                    posData.tweenData.height        = posData.posOut.height - posData.posIn.height;
                    posData.tweenData.marginRight   = posData.posOut.marginRight - posData.posIn.marginRight;
                    posData.tweenData.marginBottom  = posData.posOut.marginBottom - posData.posIn.marginBottom;
                }

                // Process transforms

                for (j = 0; effectName = effectNames[j]; j++) {
                    effect = self.effectsIn[effectName];

                    if (!(effect instanceof mixitup.TransformData) || !effect.value) continue;

                    posData.posIn[effectName].value     = effect.value;
                    posData.posOut[effectName].value    = 0;

                    posData.tweenData[effectName].value =
                        posData.posOut[effectName].value - posData.posIn[effectName].value;

                    posData.posIn[effectName].unit =
                        posData.posOut[effectName].unit =
                        posData.tweenData[effectName].unit =
                        effect.unit;
                }
            }

            for (i = 0; target = operation.toHide[i]; i++) {
                posData             = operation.toHidePosData[i];
                posData.posIn       = new mixitup.StyleData();
                posData.posOut      = new mixitup.StyleData();
                posData.tweenData   = new mixitup.StyleData();

                // Process x and y

                posData.posIn.x     = target.isShown ? posData.startPosData.x - posData.interPosData.x : 0;
                posData.posIn.y     = target.isShown ? posData.startPosData.y - posData.interPosData.y : 0;
                posData.posOut.x    = self.config.animation.nudge ? 0 : posData.posIn.x;
                posData.posOut.y    = self.config.animation.nudge ? 0 : posData.posIn.y;
                posData.tweenData.x = posData.posOut.x - posData.posIn.x;
                posData.tweenData.y = posData.posOut.y - posData.posIn.y;

                // Process width, height, and margins

                if (self.config.animation.animateResizeTargets) {
                    posData.posIn.width         = posData.startPosData.width;
                    posData.posIn.height        = posData.startPosData.height;

                    widthChange = posData.startPosData.width - posData.interPosData.width;

                    posData.posIn.marginRight = posData.startPosData.marginRight - widthChange;

                    heightChange = posData.startPosData.height - posData.interPosData.height;

                    posData.posIn.marginBottom = posData.startPosData.marginBottom - heightChange;
                }

                // Process opacity

                posData.posIn.opacity       = 1;
                posData.posOut.opacity      = self.effectsOut.opacity;
                posData.tweenData.opacity   = posData.posOut.opacity - posData.posIn.opacity;

                // Process transforms

                for (j = 0; effectName = effectNames[j]; j++) {
                    effect = self.effectsOut[effectName];

                    if (!(effect instanceof mixitup.TransformData) || !effect.value) continue;

                    posData.posIn[effectName].value     = 0;
                    posData.posOut[effectName].value    = effect.value;

                    posData.tweenData[effectName].value =
                        posData.posOut[effectName].value - posData.posIn[effectName].value;

                    posData.posIn[effectName].unit =
                        posData.posOut[effectName].unit =
                        posData.tweenData[effectName].unit =
                        effect.unit;
                }
            }

            self.callActions('afterGetTweenData', arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {Operation}     operation
         * @return  {void}
         */

        moveTargets: function(operation) {
            var self            = this,
                target          = null,
                moveData        = null,
                posData         = null,
                statusChange    = '',
                willTransition  = false,
                staggerIndex    = -1,
                i               = -1,
                checkProgress   = self.checkProgress.bind(self);

            self.callActions('beforeMoveTargets', arguments);

            // TODO: this is an extra loop in addition to the calcs
            // done in getOperation, could some of this be done there?

            for (i = 0; target = operation.show[i]; i++) {
                moveData    = new mixitup.IMoveData();
                posData     = operation.showPosData[i];

                statusChange = target.isShown ? 'none' : 'show';

                willTransition = self.willTransition(
                    statusChange,
                    operation.hasEffect,
                    posData.posIn,
                    posData.posOut
                );

                if (willTransition) {
                    // Prevent non-transitioning targets from incrementing the staggerIndex

                    staggerIndex++;
                }

                target.show();

                moveData.posIn          = posData.posIn;
                moveData.posOut         = posData.posOut;
                moveData.statusChange   = statusChange;
                moveData.staggerIndex   = staggerIndex;
                moveData.operation      = operation;
                moveData.callback       = willTransition ? checkProgress : null;

                target.move(moveData);
            }

            for (i = 0; target = operation.toHide[i]; i++) {
                posData  = operation.toHidePosData[i];
                moveData = new mixitup.IMoveData();

                statusChange = 'hide';

                willTransition = self.willTransition(statusChange, posData.posIn, posData.posOut);

                moveData.posIn          = posData.posIn;
                moveData.posOut         = posData.posOut;
                moveData.statusChange   = statusChange;
                moveData.staggerIndex   = i;
                moveData.operation      = operation;
                moveData.callback       = willTransition ? checkProgress : null;

                target.move(moveData);
            }

            if (self.config.animation.animateResizeContainer) {
                self.dom.parent.style[mixitup.features.transitionProp] =
                    'height ' + self.config.animation.duration + 'ms ease, ' +
                    'width ' + self.config.animation.duration + 'ms ease ';

                requestAnimationFrame(function() {
                    if (
                        operation.startHeight !== operation.newHeight &&
                        operation.viewportDeltaY !== operation.startHeight - operation.newHeight
                    ) {
                        self.dom.parent.style.height = operation.newHeight + 'px';
                    }

                    if (
                        operation.startWidth !== operation.newWidth &&
                        operation.viewportDeltaX !== operation.startWidth - operation.newWidth
                    ) {
                        self.dom.parent.style.width = operation.newWidth + 'px';
                    }
                });
            }

            if (operation.willChangeLayout) {
                h.removeClass(self.dom.container, self.config.layout.ContainerClassName);
                h.addClass(self.dom.container, operation.newContainerClassName);
            }

            self.callActions('afterMoveTargets', arguments);
        },

        /**
         * @private
         * @instance
         * @return  {boolean}
         */

        hasEffect: function() {
            var self        = this,
                EFFECTABLES = [
                    'scale',
                    'translateX', 'translateY', 'translateZ',
                    'rotateX', 'rotateY', 'rotateZ'
                ],
                effectName  = '',
                effect      = null,
                result      = false,
                value       = -1,
                i           = -1;

            if (self.effectsIn.opacity !== 1) {
                return self.callFilters('resultHasEffect', true, arguments);
            }

            for (i = 0; effectName = EFFECTABLES[i]; i++) {
                effect  = self.effectsIn[effectName];
                value   = (typeof effect && effect.value !== 'undefined') ?
                    effect.value : effect;

                if (value !== 0) {
                    result = true;

                    break;
                }
            }

            return self.callFilters('resultHasEffect', result, arguments);
        },

        /**
         * Determines if a target element will transition in
         * some fasion and therefore requires binding of
         * transitionEnd
         *
         * @private
         * @instance
         * @since   3.0.0
         * @param   {string}        statusChange
         * @param   {boolean}       hasEffect
         * @param   {StyleData}     posIn
         * @param   {StyleData}     posOut
         * @return  {boolean}
         */

        willTransition: function(statusChange, hasEffect, posIn, posOut) {
            var self    = this,
                result  = false;

            if (!h.isVisible(self.dom.container)) {
                // If the container is not visible, the transitionEnd
                // event will not occur and MixItUp will hang

                result = false;
            } else if (
                (statusChange !== 'none' && hasEffect) ||
                posIn.x !== posOut.x ||
                posIn.y !== posOut.y
            ) {
                // If opacity and/or translate will change

                result = true;
            } else if (self.config.animation.animateResizeTargets) {
                // Check if width, height or margins will change

                result = (
                    posIn.width !== posOut.width ||
                    posIn.height !== posOut.height ||
                    posIn.marginRight !== posOut.marginRight ||
                    posIn.marginTop !== posOut.marginTop
                );
            } else {
                result = false;
            }

            return self.callFilters('resultWillTransition', result, arguments);
        },

        /**
         * @private
         * @instance
         * @since   2.0.0
         * @param   {Operation}     operation
         * @return  {void}
         */

        checkProgress: function(operation) {
            var self = this;

            self.targetsDone++;

            if (self.targetsBound === self.targetsDone) {
                self.cleanUp(operation);
            }
        },

        /**
         * @private
         * @instance
         * @since   2.0.0
         * @param   {Operation}     operation
         * @return  {void}
         */

        cleanUp: function(operation) {
            var self                = this,
                target              = null,
                whitespaceBefore    = null,
                whitespaceAfter     = null,
                nextInQueue         = null,
                i                   = -1;

            self.callActions('beforeCleanUp', arguments);

            self.targetsMoved          =
                self.targetsImmovable  =
                self.targetsBound      =
                self.targetsDone       = 0;

            for (i = 0; target = operation.show[i]; i++) {
                target.cleanUp();

                target.show();
            }

            for (i = 0; target = operation.toHide[i]; i++) {
                target.cleanUp();

                target.hide();
            }

            if (operation.willSort) {
                self.printSort(false, operation);
            }

            // Remove any styles applied to the parent container

            self.dom.parent.style[mixitup.features.transitionProp]             =
                self.dom.parent.style.height                                   =
                self.dom.parent.style.width                                    =
                self.dom.parent.style.overflow                                 =
                self.dom.parent.style[mixitup.features.perspectiveProp]        =
                self.dom.parent.style[mixitup.features.perspectiveOriginProp]  = '';

            if (operation.willChangeLayout) {
                h.removeClass(self.dom.container, operation.startContainerClassName);
                h.addClass(self.dom.container, operation.newContainerClassName);
            }

            if (operation.toRemove.length) {
                for (i = 0; target = self.targets[i]; i++) {
                    if (operation.toRemove.indexOf(target) > -1) {
                        if (
                            (whitespaceBefore = target.dom.el.previousSibling) && whitespaceBefore.nodeName === '#text' &&
                            (whitespaceAfter = target.dom.el.nextSibling) && whitespaceAfter.nodeName === '#text'
                        ) {
                            h.removeWhitespace(whitespaceBefore);
                        }

                        if (!operation.willSort) {
                            // NB: Sorting will remove targets as a bi-product of `printSort()`

                            self.dom.parent.removeChild(target.dom.el);
                        }

                        self.targets.splice(i, 1);

                        target.isInDom = false;

                        i--;
                    }
                }

                // Since targets have been removed, the original order must be updated

                self.origOrder = self.targets;
            }

            if (operation.willSort) {
                self.targets = operation.newOrder;
            }

            self.state = operation.newState;
            self.lastOperation = operation;

            self.dom.targets = self.state.targets;

            // mixEnd

            mixitup.events.fire('mixEnd', self.dom.container, {
                state: self.state,
                instance: self
            }, self.dom.document);

            if (typeof self.config.callbacks.onMixEnd === 'function') {
                self.config.callbacks.onMixEnd.call(self.dom.container, self.state, self);
            }

            if (operation.hasFailed) {
                // mixFail

                mixitup.events.fire('mixFail', self.dom.container, {
                    state: self.state,
                    instance: self
                }, self.dom.document);

                if (typeof self.config.callbacks.onMixFail === 'function') {
                    self.config.callbacks.onMixFail.call(self.dom.container, self.state, self);
                }

                h.addClass(self.dom.container, h.getClassname(self.config.classNames, 'container', self.config.classNames.modifierFailed));
            }

            // User-defined callback function

            if (typeof self.userCallback === 'function') {
                self.userCallback.call(self.dom.container, self.state, self);
            }

            if (typeof self.userDeferred.resolve === 'function') {
                self.userDeferred.resolve(self.state);
            }

            self.userCallback  = null;
            self.userDeferred  = null;
            self.lastClicked   = null;
            self.isToggling    = false;
            self.isBusy        = false;

            if (self.queue.length) {
                self.callActions('beforeReadQueueCleanUp', arguments);

                nextInQueue = self.queue.shift();

                // Update non-public API properties stored in queue

                self.userDeferred  = nextInQueue.deferred;
                self.isToggling    = nextInQueue.isToggling;
                self.lastClicked   = nextInQueue.triggerElement;

                if (nextInQueue.instruction.command instanceof mixitup.CommandMultimix) {
                    self.multimix.apply(self, nextInQueue.args);
                } else {
                    self.dataset.apply(self, nextInQueue.args);
                }
            }

            self.callActions('afterCleanUp', arguments);
        },

        /**
         * @private
         * @instance
         * @since   2.0.0
         * @param   {Array<*>}  args
         * @return  {mixitup.UserInstruction}
         */

        parseMultimixArgs: function(args) {
            var self        = this,
                instruction = new mixitup.UserInstruction(),
                arg         = null,
                i           = -1;

            instruction.animate = self.config.animation.enable;
            instruction.command = new mixitup.CommandMultimix();

            for (i = 0; i < args.length; i++) {
                arg = args[i];

                if (arg === null) continue;

                if (typeof arg === 'object') {
                    h.extend(instruction.command, arg);
                } else if (typeof arg === 'boolean') {
                    instruction.animate = arg;
                } else if (typeof arg === 'function') {
                    instruction.callback = arg;
                }
            }

            // Coerce arbitrary command arguments into typed command objects

            if (instruction.command.insert && !(instruction.command.insert instanceof mixitup.CommandInsert)) {
                instruction.command.insert = self.parseInsertArgs([instruction.command.insert]).command;
            }

            if (instruction.command.remove && !(instruction.command.remove instanceof mixitup.CommandRemove)) {
                instruction.command.remove = self.parseRemoveArgs([instruction.command.remove]).command;
            }

            if (instruction.command.filter && !(instruction.command.filter instanceof mixitup.CommandFilter)) {
                instruction.command.filter = self.parseFilterArgs([instruction.command.filter]).command;
            }

            if (instruction.command.sort && !(instruction.command.sort instanceof mixitup.CommandSort)) {
                instruction.command.sort = self.parseSortArgs([instruction.command.sort]).command;
            }

            if (instruction.command.changeLayout && !(instruction.command.changeLayout instanceof mixitup.CommandChangeLayout)) {
                instruction.command.changeLayout = self.parseChangeLayoutArgs([instruction.command.changeLayout]).command;
            }

            instruction = self.callFilters('instructionParseMultimixArgs', instruction, arguments);

            h.freeze(instruction);

            return instruction;
        },

        /**
         * @private
         * @instance
         * @since   2.0.0
         * @param   {Array<*>}  args
         * @return  {mixitup.UserInstruction}
         */

        parseFilterArgs: function(args) {
            var self        = this,
                instruction = new mixitup.UserInstruction(),
                arg         = null,
                i           = -1;

            instruction.animate = self.config.animation.enable;
            instruction.command = new mixitup.CommandFilter();

            for (i = 0; i < args.length; i++) {
                arg = args[i];

                if (typeof arg === 'string') {
                    // Selector

                    instruction.command.selector = arg;
                } else if (arg === null) {
                    instruction.command.collection = [];
                } else if (typeof arg === 'object' && h.isElement(arg, self.dom.document)) {
                    // Single element

                    instruction.command.collection = [arg];
                } else if (typeof arg === 'object' && typeof arg.length !== 'undefined') {
                    // Multiple elements in array, NodeList or jQuery collection

                    instruction.command.collection = h.arrayFromList(arg);
                } else if (typeof arg === 'object') {
                    // Filter command

                    h.extend(instruction.command, arg);
                } else if (typeof arg === 'boolean') {
                    instruction.animate = arg;
                } else if (typeof arg === 'function') {
                    instruction.callback = arg;
                }
            }

            if (instruction.command.selector && instruction.command.collection) {
                throw new Error(mixitup.messages.errorFilterInvalidArguments());
            }

            instruction = self.callFilters('instructionParseFilterArgs', instruction, arguments);

            h.freeze(instruction);

            return instruction;
        },

        parseSortArgs: function(args) {
            var self        = this,
                instruction = new mixitup.UserInstruction(),
                arg         = null,
                sortString  = '',
                i           = -1;

            instruction.animate = self.config.animation.enable;
            instruction.command = new mixitup.CommandSort();

            for (i = 0; i < args.length; i++) {
                arg = args[i];

                if (arg === null) continue;

                switch (typeof arg) {
                    case 'string':
                        // Sort string

                        sortString = arg;

                        break;
                    case 'object':
                        // Array of element references

                        if (arg.length) {
                            instruction.command.collection = h.arrayFromList(arg);
                        }

                        break;
                    case 'boolean':
                        instruction.animate = arg;

                        break;
                    case 'function':
                        instruction.callback = arg;

                        break;
                }
            }

            if (sortString) {
                instruction.command = self.parseSortString(sortString, instruction.command);
            }

            instruction = self.callFilters('instructionParseSortArgs', instruction, arguments);

            h.freeze(instruction);

            return instruction;
        },

        /**
         * @private
         * @instance
         * @since   2.0.0
         * @param   {Array<*>}  args
         * @return  {mixitup.UserInstruction}
         */

        parseInsertArgs: function(args) {
            var self        = this,
                instruction = new mixitup.UserInstruction(),
                arg         = null,
                i           = -1;

            instruction.animate = self.config.animation.enable;
            instruction.command = new mixitup.CommandInsert();

            for (i = 0; i < args.length; i++) {
                arg = args[i];

                if (arg === null) continue;

                if (typeof arg === 'number') {
                    // Insert index

                    instruction.command.index = arg;
                } else if (typeof arg === 'string' && ['before', 'after'].indexOf(arg) > -1) {
                    // 'before'/'after'

                    instruction.command.position = arg;
                } else if (typeof arg === 'string') {
                    // Markup

                    instruction.command.collection =
                        h.arrayFromList(h.createElement(arg).childNodes);
                } else if (typeof arg === 'object' && h.isElement(arg, self.dom.document)) {
                    // Single element

                    !instruction.command.collection.length ?
                        (instruction.command.collection = [arg]) :
                        (instruction.command.sibling = arg);
                } else if (typeof arg === 'object' && arg.length) {
                    // Multiple elements in array or jQuery collection

                    !instruction.command.collection.length ?
                        (instruction.command.collection = arg) :
                        instruction.command.sibling = arg[0];
                } else if (typeof arg === 'object' && arg.childNodes && arg.childNodes.length) {
                    // Document fragment

                    !instruction.command.collection.length ?
                        instruction.command.collection = h.arrayFromList(arg.childNodes) :
                        instruction.command.sibling = arg.childNodes[0];
                } else if (typeof arg === 'object') {
                    // Insert command

                    h.extend(instruction.command, arg);
                } else if (typeof arg === 'boolean') {
                    instruction.animate = arg;
                } else if (typeof arg === 'function') {
                    instruction.callback = arg;
                }
            }

            if (instruction.command.index && instruction.command.sibling) {
                throw new Error(mixitup.messages.errorInsertInvalidArguments());
            }

            if (!instruction.command.collection.length && self.config.debug.showWarnings) {
                console.warn(mixitup.messages.warningInsertNoElements());
            }

            instruction = self.callFilters('instructionParseInsertArgs', instruction, arguments);

            h.freeze(instruction);

            return instruction;
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {Array<*>}  args
         * @return  {mixitup.UserInstruction}
         */

        parseRemoveArgs: function(args) {
            var self        = this,
                instruction = new mixitup.UserInstruction(),
                target      = null,
                arg         = null,
                i           = -1;

            instruction.animate = self.config.animation.enable;
            instruction.command = new mixitup.CommandRemove();

            for (i = 0; i < args.length; i++) {
                arg = args[i];

                if (arg === null) continue;

                switch (typeof arg) {
                    case 'number':
                        if (self.targets[arg]) {
                            instruction.command.targets[0] = self.targets[arg];
                        }

                        break;
                    case 'string':
                        instruction.command.collection = h.arrayFromList(self.dom.parent.querySelectorAll(arg));

                        break;
                    case 'object':
                        if (arg && arg.length) {
                            instruction.command.collection = arg;
                        } else if (h.isElement(arg, self.dom.document)) {
                            instruction.command.collection = [arg];
                        } else {
                            // Remove command

                            h.extend(instruction.command, arg);
                        }

                        break;
                    case 'boolean':
                        instruction.animate = arg;

                        break;
                    case 'function':
                        instruction.callback = arg;

                        break;
                }
            }

            if (instruction.command.collection.length) {
                for (i = 0; target = self.targets[i]; i++) {
                    if (instruction.command.collection.indexOf(target.dom.el) > -1) {
                        instruction.command.targets.push(target);
                    }
                }
            }

            if (!instruction.command.targets.length && self.config.debug.showWarnings) {
                console.warn(mixitup.messages.warningRemoveNoElements());
            }

            h.freeze(instruction);

            return instruction;
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {Array<*>}  args
         * @return  {mixitup.UserInstruction}
         */

        parseDatasetArgs: function(args) {
            var self        = this,
                instruction = new mixitup.UserInstruction(),
                arg         = null,
                i           = -1;

            instruction.animate = self.config.animation.enable;
            instruction.command = new mixitup.CommandDataset();

            for (i = 0; i < args.length; i++) {
                arg = args[i];

                if (arg === null) continue;

                switch (typeof arg) {
                    case 'object':
                        if (Array.isArray(arg) || typeof arg.length === 'number') {
                            instruction.command.dataset = arg;
                        } else {
                            // Change layout command

                            h.extend(instruction.command, arg);
                        }

                        break;
                    case 'boolean':
                        instruction.animate = arg;

                        break;
                    case 'function':
                        instruction.callback = arg;

                        break;
                }
            }

            h.freeze(instruction);

            return instruction;
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {Array<*>}  args
         * @return  {mixitup.UserInstruction}
         */

        parseChangeLayoutArgs: function(args) {
            var self        = this,
                instruction = new mixitup.UserInstruction(),
                arg         = null,
                i           = -1;

            instruction.animate = self.config.animation.enable;
            instruction.command = new mixitup.CommandChangeLayout();

            for (i = 0; i < args.length; i++) {
                arg = args[i];

                if (arg === null) continue;

                switch (typeof arg) {
                    case 'string':
                        instruction.command.containerClassName = arg;

                        break;
                    case 'object':
                        // Change layout command

                        h.extend(instruction.command, arg);

                        break;
                    case 'boolean':
                        instruction.animate = arg;

                        break;
                    case 'function':
                        instruction.callback = arg;

                        break;
                }
            }

            h.freeze(instruction);

            return instruction;
        },

        /**
         * @private
         * @instance
         * @since       3.0.0
         * @param       {mixitup.QueueItem}         queueItem
         * @return      {Promise.<mixitup.State>}
         */

        queueMix: function(queueItem) {
            var self            = this,
                deferred        = null,
                toggleSelector  = '';

            self.callActions('beforeQueueMix', arguments);

            deferred = h.defer(mixitup.libraries);

            if (self.config.animation.queue && self.queue.length < self.config.animation.queueLimit) {
                queueItem.deferred = deferred;

                self.queue.push(queueItem);

                // Keep controls in sync with user interactions. Mixer will catch up as it drains the queue.

                if (self.config.controls.enable) {
                    if (self.isToggling) {
                        self.buildToggleArray(queueItem.instruction.command);

                        toggleSelector = self.getToggleSelector();

                        self.updateControls({
                            filter: {
                                selector: toggleSelector
                            }
                        });
                    } else {
                        self.updateControls(queueItem.instruction.command);
                    }
                }
            } else {
                if (self.config.debug.showWarnings) {
                    console.warn(mixitup.messages.warningMultimixInstanceQueueFull());
                }

                deferred.resolve(self.state);

                mixitup.events.fire('mixBusy', self.dom.container, {
                    state: self.state,
                    instance: self
                }, self.dom.document);

                if (typeof self.config.callbacks.onMixBusy === 'function') {
                    self.config.callbacks.onMixBusy.call(self.dom.container, self.state, self);
                }
            }

            return self.callFilters('promiseQueueMix', deferred.promise, arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {Array.<object>}    newDataset
         * @return  {Operation}
         */

        getDataOperation: function(newDataset) {
            var self                = this,
                operation           = new mixitup.Operation(),
                startDataset        = [];

            operation = self.callFilters('operationUnmappedGetDataOperation', operation, arguments);

            if (self.dom.targets.length && !(startDataset = (self.state.activeDataset || [])).length) {
                throw new Error(mixitup.messages.errorDatasetNotSet());
            }

            operation.id            = h.randomHex();
            operation.startState    = self.state;
            operation.startDataset  = startDataset;
            operation.newDataset    = newDataset.slice();

            self.diffDatasets(operation);

            operation.startOrder = self.targets;
            operation.newOrder = operation.show;

            if (self.config.animation.enable) {
                self.getStartMixData(operation);
                self.setInter(operation);

                operation.docState = h.getDocumentState(self.dom.document);

                self.getInterMixData(operation);
                self.setFinal(operation);
                self.getFinalMixData(operation);

                self.parseEffects();

                operation.hasEffect = self.hasEffect();

                self.getTweenData(operation);
            }

            self.targets = operation.show.slice();

            operation.newState = self.buildState(operation);

            // NB: Targets to be removed must be included in `self.targets` for removal during clean up,
            // but are added after state is built so that state is accurate

            Array.prototype.push.apply(self.targets, operation.toRemove);

            operation = self.callFilters('operationMappedGetDataOperation', operation, arguments);

            return operation;
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {mixitup.Operation} operation
         * @return  {void}
         */

        diffDatasets: function(operation) {
            var self                = this,
                persistantStartIds  = [],
                persistantNewIds    = [],
                insertedTargets     = [],
                data                = null,
                target              = null,
                el                  = null,
                frag                = null,
                nextEl              = null,
                uids                = {},
                id                  = '',
                i                   = -1;

            self.callActions('beforeDiffDatasets', arguments);

            for (i = 0; data = operation.newDataset[i]; i++) {
                if (typeof (id = data[self.config.data.uidKey]) === 'undefined' || id.toString().length < 1) {
                    throw new TypeError(mixitup.messages.errorDatasetInvalidUidKey({
                        uidKey: self.config.data.uidKey
                    }));
                }

                if (!uids[id]) {
                    uids[id] = true;
                } else {
                    throw new Error(mixitup.messages.errorDatasetDuplicateUid({
                        uid: id
                    }));
                }

                if ((target = self.cache[id]) instanceof mixitup.Target) {
                    // Already in cache

                    if (self.config.data.dirtyCheck && !h.deepEquals(data, target.data)) {
                        // change detected

                        el = target.render(data);

                        target.data = data;

                        if (el !== target.dom.el) {
                            // Update target element reference

                            if (target.isInDom) {
                                target.unbindEvents();

                                self.dom.parent.replaceChild(el, target.dom.el);
                            }

                            if (!target.isShown) {
                                el.style.display = 'none';
                            }

                            target.dom.el = el;

                            if (target.isInDom) {
                                target.bindEvents();
                            }
                        }
                    }

                    el = target.dom.el;
                } else {
                    // New target

                    target = new mixitup.Target();

                    target.init(null, self, data);

                    target.hide();
                }

                if (!target.isInDom) {
                    // Adding to DOM

                    if (!frag) {
                        // Open frag

                        frag = self.dom.document.createDocumentFragment();
                    }

                    if (frag.lastElementChild) {
                        frag.appendChild(self.dom.document.createTextNode(' '));
                    }

                    frag.appendChild(target.dom.el);

                    target.isInDom = true;

                    target.unbindEvents();
                    target.bindEvents();
                    target.hide();

                    operation.toShow.push(target);

                    insertedTargets.push(target);
                } else {
                    // Already in DOM

                    nextEl = target.dom.el.nextElementSibling;

                    persistantNewIds.push(id);

                    if (frag) {
                        // Close and insert previously opened frag

                        if (frag.lastElementChild) {
                            frag.appendChild(self.dom.document.createTextNode(' '));
                        }

                        self.insertDatasetFrag(frag, target.dom.el, insertedTargets);

                        frag = null;
                    }
                }

                operation.show.push(target);
            }

            if (frag) {
                // Unclosed frag remaining

                nextEl = nextEl || self.config.layout.siblingAfter;

                if (nextEl) {
                    frag.appendChild(self.dom.document.createTextNode(' '));
                }

                self.insertDatasetFrag(frag, nextEl, insertedTargets);
            }

            for (i = 0; data = operation.startDataset[i]; i++) {
                id = data[self.config.data.uidKey];

                target = self.cache[id];

                if (operation.show.indexOf(target) < 0) {
                    // Previously shown but now absent

                    operation.hide.push(target);
                    operation.toHide.push(target);
                    operation.toRemove.push(target);
                } else {
                    persistantStartIds.push(id);
                }
            }

            if (!h.isEqualArray(persistantStartIds, persistantNewIds)) {
                operation.willSort = true;
            }

            self.callActions('afterDiffDatasets', arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.1.5
         * @param   {DocumentFragment}          frag
         * @param   {(HTMLElement|null)}        nextEl
         * @param   {Array.<mixitup.Target>}    targets
         * @return  {void}
         */

        insertDatasetFrag: function(frag, nextEl, targets) {
            var self = this;
            var insertAt = nextEl ? h.arrayFromList(self.dom.parent.children).indexOf(nextEl) : self.targets.length;

            self.dom.parent.insertBefore(frag, nextEl);

            while (targets.length) {
                self.targets.splice(insertAt, 0, targets.shift());

                insertAt++;
            }
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {mixitup.CommandSort} sortCommandA
         * @param   {mixitup.CommandSort} sortCommandB
         * @return  {boolean}
         */

        willSort: function(sortCommandA, sortCommandB) {
            var self    = this,
                result  = false;

            if (
                self.config.behavior.liveSort ||
                sortCommandA.order       === 'random' ||
                sortCommandA.attribute   !== sortCommandB.attribute ||
                sortCommandA.order       !== sortCommandB.order ||
                sortCommandA.collection  !== sortCommandB.collection ||
                (sortCommandA.next === null && sortCommandB.next) ||
                (sortCommandA.next && sortCommandB.next === null)
            ) {
                result = true;
            } else if (sortCommandA.next && sortCommandB.next) {
                result = self.willSort(sortCommandA.next, sortCommandB.next);
            } else {
                result = false;
            }

            return self.callFilters('resultWillSort', result, arguments);
        },

        /**
         * A shorthand method for `.filter('all')`. Shows all targets in the container.
         *
         * @example
         *
         * .show()
         *
         * @example <caption>Example: Showing all targets</caption>
         *
         * mixer.show()
         *     .then(function(state) {
         *         console.log(state.totalShow === state.totalTargets); // true
         *     });
         *
         * @public
         * @instance
         * @since       3.0.0
         * @return      {Promise.<mixitup.State>}
         */

        show: function() {
            var self = this;

            return self.filter('all');
        },

        /**
         * A shorthand method for `.filter('none')`. Hides all targets in the container.
         *
         * @example
         *
         * .hide()
         *
         * @example <caption>Example: Hiding all targets</caption>
         *
         * mixer.hide()
         *     .then(function(state) {
         *         console.log(state.totalShow === 0); // true
         *         console.log(state.totalHide === state.totalTargets); // true
         *     });
         *
         * @public
         * @instance
         * @since       3.0.0
         * @return      {Promise.<mixitup.State>}
         */

        hide: function() {
            var self = this;

            return self.filter('none');
        },

        /**
         * Returns a boolean indicating whether or not a MixItUp operation is
         * currently in progress.
         *
         * @example
         *
         * .isMixing()
         *
         * @example <caption>Example: Checking the status of a mixer</caption>
         *
         * mixer.sort('random', function() {
         *     console.log(mixer.isMixing()) // false
         * });
         *
         * console.log(mixer.isMixing()) // true
         *
         * @public
         * @instance
         * @since   2.0.0
         * @return  {boolean}
         */

        isMixing: function() {
            var self = this;

            return self.isBusy;
        },

        /**
         * Filters all targets in the container by a provided selector string, or the values `'all'`
         * or `'none'`. Only targets matching the selector will be shown.
         *
         * @example
         *
         * .filter(selector [, animate] [, callback])
         *
         * @example <caption>Example 1: Filtering targets by a class selector</caption>
         *
         * mixer.filter('.category-a')
         *     .then(function(state) {
         *         console.log(state.totalShow === containerEl.querySelectorAll('.category-a').length); // true
         *     });
         *
         * @example <caption>Example 2: Filtering targets by an attribute selector</caption>
         *
         * mixer.filter('[data-category~="a"]')
         *     .then(function(state) {
         *         console.log(state.totalShow === containerEl.querySelectorAll('[data-category~="a"]').length); // true
         *     });
         *
         * @example <caption>Example 3: Filtering targets by a compound selector</caption>
         *
         * // Show only those targets with the classes 'category-a' AND 'category-b'
         *
         * mixer.filter('.category-a.category-c')
         *     .then(function(state) {
         *         console.log(state.totalShow === containerEl.querySelectorAll('.category-a.category-c').length); // true
         *     });
         *
         * @example <caption>Example 4: Filtering via an element collection</caption>
         *
         * var collection = Array.from(container.querySelectorAll('.mix'));
         *
         * console.log(collection.length); // 34
         *
         * // Filter the collection manually using Array.prototype.filter
         *
         * var filtered = collection.filter(function(target) {
         *    return parseInt(target.getAttribute('data-price')) > 10;
         * });
         *
         * console.log(filtered.length); // 22
         *
         * // Pass the filtered collection to MixItUp
         *
         * mixer.filter(filtered)
         *    .then(function(state) {
         *        console.log(state.activeFilter.collection.length === 22); // true
         *    });
         *
         * @public
         * @instance
         * @since       2.0.0
         * @param       {(string|HTMLElement|Array.<HTMLElement>)} selector
         *      Any valid CSS selector (i.e. `'.category-a'`), or the values `'all'` or `'none'`. The filter method also accepts a reference to single target element or a collection of target elements to show.
         * @param       {boolean}   [animate=true]
         *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
         * @param       {function}  [callback=null]
         *      An optional callback function to be invoked after the operation has completed.
         * @return      {Promise.<mixitup.State>}
         *      A promise resolving with the current state object.
         */

        filter: function() {
            var self        = this,
                instruction = self.parseFilterArgs(arguments);

            return self.multimix({
                filter: instruction.command
            }, instruction.animate, instruction.callback);
        },

        /**
         * Adds an additional selector to the currently active filter selector, concatenating
         * as per the logic defined in `controls.toggleLogic`.
         *
         * @example
         *
         * .toggleOn(selector [, animate] [, callback])
         *
         * @example <caption>Example: Toggling on a filter selector</caption>
         *
         * console.log(mixer.getState().activeFilter.selector); // '.category-a'
         *
         * mixer.toggleOn('.category-b')
         *     .then(function(state) {
         *         console.log(state.activeFilter.selector); // '.category-a, .category-b'
         *     });
         *
         * @public
         * @instance
         * @since       3.0.0
         * @param       {string}    selector
         *      Any valid CSS selector (i.e. `'.category-a'`)
         * @param       {boolean}   [animate=true]
         *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
         * @param       {function}  [callback=null]
         *      An optional callback function to be invoked after the operation has completed.
         * @return      {Promise.<mixitup.State>}
         *      A promise resolving with the current state object.
         */

        toggleOn: function() {
            var self            = this,
                instruction     = self.parseFilterArgs(arguments),
                selector        = instruction.command.selector,
                toggleSelector  = '';

            self.isToggling = true;

            if (self.toggleArray.indexOf(selector) < 0) {
                self.toggleArray.push(selector);
            }

            toggleSelector = self.getToggleSelector();

            return self.multimix({
                filter: toggleSelector
            }, instruction.animate, instruction.callback);
        },

        /**
         * Removes a selector from the active filter selector.
         *
         * @example
         *
         * .toggleOff(selector [, animate] [, callback])
         *
         * @example <caption>Example: Toggling off a filter selector</caption>
         *
         * console.log(mixer.getState().activeFilter.selector); // '.category-a, .category-b'
         *
         * mixer.toggleOff('.category-b')
         *     .then(function(state) {
         *         console.log(state.activeFilter.selector); // '.category-a'
         *     });
         *
         * @public
         * @instance
         * @since       3.0.0
         * @param       {string}    selector
         *      Any valid CSS selector (i.e. `'.category-a'`)
         * @param       {boolean}   [animate=true]
         *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
         * @param       {function}  [callback=null]
         *      An optional callback function to be invoked after the operation has completed.
         * @return      {Promise.<mixitup.State>}
         *      A promise resolving with the current state object.
         */

        toggleOff: function() {
            var self            = this,
                instruction     = self.parseFilterArgs(arguments),
                selector        = instruction.command.selector,
                selectorIndex   = self.toggleArray.indexOf(selector),
                toggleSelector  = '';

            self.isToggling = true;

            if (selectorIndex > -1) {
                self.toggleArray.splice(selectorIndex, 1);
            }

            toggleSelector = self.getToggleSelector();

            return self.multimix({
                filter: toggleSelector
            }, instruction.animate, instruction.callback);
        },

        /**
         * Sorts all targets in the container according to a provided sort string.
         *
         * @example
         *
         * .sort(sortString [, animate] [, callback])
         *
         * @example <caption>Example 1: Sorting by the default DOM order</caption>
         *
         * // Reverse the default order of the targets
         *
         * mixer.sort('default:desc')
         *     .then(function(state) {
         *         console.log(state.activeSort.attribute === 'default'); // true
         *         console.log(state.activeSort.order === 'desc'); // true
         *     });
         *
         * @example <caption>Example 2: Sorting by a custom data-attribute</caption>
         *
         * // Sort the targets by the value of a `data-published-date` attribute
         *
         * mixer.sort('published-date:asc')
         *     .then(function(state) {
         *         console.log(state.activeSort.attribute === 'published-date'); // true
         *         console.log(state.activeSort.order === 'asc'); // true
         *     });
         *
         * @example <caption>Example 3: Sorting by multiple attributes</caption>
         *
         * // Sort the targets by the value of a `data-published-date` attribute, then by `data-title`
         *
         * mixer.sort('published-date:desc data-title:asc')
         *     .then(function(state) {
         *         console.log(state.activeSort.attribute === 'published-date'); // true
         *         console.log(state.activeSort.order === 'desc'); // true
         *
         *         console.log(state.activeSort.next.attribute === 'title'); // true
         *         console.log(state.activeSort.next.order === 'asc'); // true
         *     });
         *
         * @example <caption>Example 4: Sorting by random</caption>
         *
         * mixer.sort('random')
         *     .then(function(state) {
         *         console.log(state.activeSort.order === 'random') // true
         *     });
         *
         * @example <caption>Example 5: Sorting via an element collection</caption>
         *
         * var collection = Array.from(container.querySelectorAll('.mix'));
         *
         * // Swap the position of two elements in the collection:
         *
         * var temp = collection[1];
         *
         * collection[1] = collection[0];
         * collection[0] = temp;
         *
         * // Pass the sorted collection to MixItUp
         *
         * mixer.sort(collection)
         *     .then(function(state) {
         *         console.log(state.targets[0] === collection[0]); // true
         *     });
         *
         * @public
         * @instance
         * @since       2.0.0
         * @param       {(string|Array.<HTMLElement>)}    sortString
         *      A valid sort string (e.g. `'default'`, `'published-date:asc'`, or `'random'`). The sort method also accepts an array of all target elements in a user-defined order.
         * @param       {boolean}   [animate=true]
         *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
         * @param       {function}  [callback=null]
         *      An optional callback function to be invoked after the operation has completed.
         * @return      {Promise.<mixitup.State>}
         *      A promise resolving with the current state object.
         */

        sort: function() {
            var self        = this,
                instruction = self.parseSortArgs(arguments);

            return self.multimix({
                sort: instruction.command
            }, instruction.animate, instruction.callback);
        },

        /**
         * Changes the layout of the container by adding, removing or updating a
         * layout-specific class name. If `animation.animateResizetargets` is
         * enabled, MixItUp will attempt to gracefully animate the width, height,
         * and position of targets between layout states.
         *
         * @example
         *
         * .changeLayout(containerClassName [, animate] [, callback])
         *
         * @example <caption>Example 1: Adding a new class name to the container</caption>
         *
         * mixer.changeLayout('container-list')
         *      .then(function(state) {
         *          console.log(state.activeContainerClass === 'container-list'); // true
         *      });
         *
         * @example <caption>Example 2: Removing a previously added class name from the container</caption>
         *
         * mixer.changeLayout('')
         *      .then(function(state) {
         *          console.log(state.activeContainerClass === ''); // true
         *      });
         *
         * @public
         * @instance
         * @since       2.0.0
         * @param       {string}    containerClassName
         *      A layout-specific class name to add to the container.
         * @param       {boolean}   [animate=true]
         *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
         * @param       {function}  [callback=null]
         *      An optional callback function to be invoked after the operation has completed.
         * @return      {Promise.<mixitup.State>}
         *      A promise resolving with the current state object.
         */

        changeLayout: function() {
            var self        = this,
                instruction = self.parseChangeLayoutArgs(arguments);

            return self.multimix({
                changeLayout: instruction.command
            }, instruction.animate, instruction.callback);
        },

        /**
         * Updates the contents and order of the container to reflect the provided dataset,
         * if the dataset API is in use.
         *
         * The dataset API is designed for use in API-driven JavaScript applications, and
         * can be used instead of DOM-based methods such as `.filter()`, `.sort()`,
         * `.insert()`, etc. When used, insertion, removal, sorting and pagination can be
         * achieved purely via changes to your data model, without the uglyness of having
         * to interact with or query the DOM directly.
         *
         * @example
         *
         * .dataset(dataset [, animate] [, callback])
         *
         * @example <caption>Example 1: Rendering a dataset</caption>
         *
         * var myDataset = [
         *     {id: 1, ...},
         *     {id: 2, ...},
         *     {id: 3, ...}
         * ];
         *
         * mixer.dataset(myDataset)
         *     .then(function(state) {
         *         console.log(state.totalShow === 3); // true
         *     });
         *
         * @example <caption>Example 2: Sorting a dataset</caption>
         *
         * // Create a new dataset in reverse order
         *
         * var newDataset = myDataset.slice().reverse();
         *
         * mixer.dataset(newDataset)
         *     .then(function(state) {
         *         console.log(state.activeDataset[0] === myDataset[2]); // true
         *     });
         *
         * @example <caption>Example 3: Removing an item from the dataset</caption>
         *
         * console.log(myDataset.length); // 3
         *
         * // Create a new dataset with the last item removed.
         *
         * var newDataset = myDataset.slice().pop();
         *
         * mixer.dataset(newDataset)
         *     .then(function(state) {
         *         console.log(state.totalShow === 2); // true
         *     });
         *
         * @public
         * @instance
         * @since       3.0.0
         * @param       {Array.<object>}    dataset
         *      An array of objects, each one representing the underlying data model of a target to be rendered.
         * @param       {boolean}           [animate=true]
         *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
         * @param       {function}          [callback=null]
         *      An optional callback function to be invoked after the operation has completed.
         * @return      {Promise.<mixitup.State>}
         *      A promise resolving with the current state object.
         */

        dataset: function() {
            var self        = this,
                instruction = self.parseDatasetArgs(arguments),
                operation   = null,
                queueItem   = null,
                animate     = false;

            self.callActions('beforeDataset', arguments);

            if (!self.isBusy) {
                if (instruction.callback) self.userCallback = instruction.callback;

                animate = (instruction.animate ^ self.config.animation.enable) ? instruction.animate : self.config.animation.enable;

                operation = self.getDataOperation(instruction.command.dataset);

                return self.goMix(animate, operation);
            } else {
                queueItem = new mixitup.QueueItem();

                queueItem.args          = arguments;
                queueItem.instruction   = instruction;

                return self.queueMix(queueItem);
            }
        },

        /**
         * Performs simultaneous `filter`, `sort`, `insert`, `remove` and `changeLayout`
         * operations as requested.
         *
         * @example
         *
         * .multimix(multimixCommand [, animate] [, callback])
         *
         * @example <caption>Example 1: Performing simultaneous filtering and sorting</caption>
         *
         * mixer.multimix({
         *     filter: '.category-b',
         *     sort: 'published-date:desc'
         * })
         *     .then(function(state) {
         *         console.log(state.activeFilter.selector === '.category-b'); // true
         *         console.log(state.activeSort.attribute === 'published-date'); // true
         *     });
         *
         * @example <caption>Example 2: Performing simultaneous sorting, insertion, and removal</caption>
         *
         * console.log(mixer.getState().totalShow); // 6
         *
         * // NB: When inserting via `multimix()`, an object should be provided as the value
         * // for the `insert` portion of the command, allowing for a collection of elements
         * // and an insertion index to be specified.
         *
         * mixer.multimix({
         *     sort: 'published-date:desc', // Sort the container, including any new elements
         *     insert: {
         *         collection: [newElementReferenceA, newElementReferenceB], // Add 2 new elements at index 5
         *         index: 5
         *     },
         *     remove: existingElementReference // Remove 1 existing element
         * })
         *     .then(function(state) {
         *         console.log(state.activeSort.attribute === 'published-date'); // true
         *         console.log(state.totalShow === 7); // true
         *     });
         *
         * @public
         * @instance
         * @since       2.0.0
         * @param       {object}    multimixCommand
         *      An object containing one or more things to do
         * @param       {boolean}   [animate=true]
         *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
         * @param       {function}  [callback=null]
         *      An optional callback function to be invoked after the operation has completed.
         * @return      {Promise.<mixitup.State>}
         *      A promise resolving with the current state object.
         */

        multimix: function() {
            var self        = this,
                operation   = null,
                animate     = false,
                queueItem   = null,
                instruction = self.parseMultimixArgs(arguments);

            self.callActions('beforeMultimix', arguments);

            if (!self.isBusy) {
                operation = self.getOperation(instruction.command);

                if (self.config.controls.enable) {
                    // Update controls for API calls

                    if (instruction.command.filter && !self.isToggling) {
                        // As we are not toggling, reset the toggle array
                        // so new filter overrides existing toggles

                        self.toggleArray.length = 0;
                        self.buildToggleArray(operation.command);
                    }

                    if (self.queue.length < 1) {
                        self.updateControls(operation.command);
                    }
                }

                if (instruction.callback) self.userCallback = instruction.callback;

                // Always allow the instruction to override the instance setting

                animate = (instruction.animate ^ self.config.animation.enable) ?
                    instruction.animate :
                    self.config.animation.enable;

                self.callFilters('operationMultimix', operation, arguments);

                return self.goMix(animate, operation);
            } else {
                queueItem = new mixitup.QueueItem();

                queueItem.args           = arguments;
                queueItem.instruction    = instruction;
                queueItem.triggerElement = self.lastClicked;
                queueItem.isToggling     = self.isToggling;

                return self.queueMix(queueItem);
            }
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {object}            multimixCommand
         * @param   {boolean}           [isPreFetch]
         *      An optional boolean indicating that the operation is being pre-fetched for execution at a later time.
         * @return  {Operation|null}
         */

        getOperation: function(multimixCommand) {
            var self                = this,
                sortCommand         = multimixCommand.sort,
                filterCommand       = multimixCommand.filter,
                changeLayoutCommand = multimixCommand.changeLayout,
                removeCommand       = multimixCommand.remove,
                insertCommand       = multimixCommand.insert,
                operation           = new mixitup.Operation();

            operation = self.callFilters('operationUnmappedGetOperation', operation, arguments);

            operation.id                = h.randomHex();
            operation.command           = multimixCommand;
            operation.startState        = self.state;
            operation.triggerElement    = self.lastClicked;

            if (self.isBusy) {
                if (self.config.debug.showWarnings) {
                    console.warn(mixitup.messages.warningGetOperationInstanceBusy());
                }

                return null;
            }

            if (insertCommand) {
                self.insertTargets(insertCommand, operation);
            }

            if (removeCommand) {
                operation.toRemove = removeCommand.targets;
            }

            operation.startSort = operation.newSort = operation.startState.activeSort;
            operation.startOrder = operation.newOrder = self.targets;

            if (sortCommand) {
                operation.startSort = operation.startState.activeSort;
                operation.newSort   = sortCommand;

                operation.willSort = self.willSort(sortCommand, operation.startState.activeSort);

                if (operation.willSort) {
                    self.sortOperation(operation);
                }
            }

            operation.startFilter = operation.startState.activeFilter;

            if (filterCommand) {
                operation.newFilter = filterCommand;
            } else {
                operation.newFilter = h.extend(new mixitup.CommandFilter(), operation.startFilter);
            }

            if (operation.newFilter.selector === 'all') {
                operation.newFilter.selector = self.config.selectors.target;
            } else if (operation.newFilter.selector === 'none') {
                operation.newFilter.selector = '';
            }

            self.filterOperation(operation);

            operation.startContainerClassName = operation.startState.activeContainerClassName;

            if (changeLayoutCommand) {
                operation.newContainerClassName = changeLayoutCommand.containerClassName;

                if (operation.newContainerClassName !== operation.startContainerClassName) {
                    operation.willChangeLayout = true;
                }
            } else {
                operation.newContainerClassName = operation.startContainerClassName;
            }

            if (self.config.animation.enable) {
                // Populate the operation's position data

                self.getStartMixData(operation);
                self.setInter(operation);

                operation.docState = h.getDocumentState(self.dom.document);

                self.getInterMixData(operation);
                self.setFinal(operation);
                self.getFinalMixData(operation);

                self.parseEffects();

                operation.hasEffect = self.hasEffect();

                self.getTweenData(operation);
            }

            if (operation.willSort) {
                self.targets = operation.newOrder;
            }

            operation.newState = self.buildState(operation);

            return self.callFilters('operationMappedGetOperation', operation, arguments);
        },

        /**
         * Renders a previously created operation at a specific point in its path, as
         * determined by a multiplier between 0 and 1.
         *
         * @example
         * .tween(operation, multiplier)
         *
         * @private
         * @instance
         * @since   3.0.0
         * @param   {mixitup.Operation}     operation
         *      An operation object created via the `getOperation` method
         *
         * @param   {Float}                 multiplier
         *      Any number between 0 and 1 representing the percentage complete of the operation
         * @return  {void}
         */

        tween: function(operation, multiplier) {
            var target          = null,
                posData         = null,
                toHideIndex     = -1,
                i               = -1;

            multiplier = Math.min(multiplier, 1);
            multiplier = Math.max(multiplier, 0);

            for (i = 0; target = operation.show[i]; i++) {
                posData = operation.showPosData[i];

                target.applyTween(posData, multiplier);
            }

            for (i = 0; target = operation.hide[i]; i++) {
                if (target.isShown) {
                    target.hide();
                }

                if ((toHideIndex = operation.toHide.indexOf(target)) > -1) {
                    posData = operation.toHidePosData[toHideIndex];

                    if (!target.isShown) {
                        target.show();
                    }

                    target.applyTween(posData, multiplier);
                }
            }
        },

        /**
         * Inserts one or more new target elements into the container at a specified
         * index.
         *
         * To be indexed as targets, new elements must match the `selectors.target`
         * selector (`'.mix'` by default).
         *
         * @example
         *
         * .insert(newElements [, index] [, animate], [, callback])
         *
         * @example <caption>Example 1: Inserting a single element via reference</caption>
         *
         * console.log(mixer.getState().totalShow); // 0
         *
         * // Create a new element
         *
         * var newElement = document.createElement('div');
         * newElement.classList.add('mix');
         *
         * mixer.insert(newElement)
         *     .then(function(state) {
         *         console.log(state.totalShow === 1); // true
         *     });
         *
         * @example <caption>Example 2: Inserting a single element via HTML string</caption>
         *
         * console.log(mixer.getState().totalShow); // 1
         *
         * // Create a new element via reference
         *
         * var newElementHtml = '&lt;div class="mix"&gt;&lt;/div&gt;';
         *
         * // Create and insert the new element at index 1
         *
         * mixer.insert(newElementHtml, 1)
         *     .then(function(state) {
         *         console.log(state.totalShow === 2); // true
         *         console.log(state.show[1].outerHTML === newElementHtml); // true
         *     });
         *
         * @example <caption>Example 3: Inserting multiple elements via reference</caption>
         *
         * console.log(mixer.getState().totalShow); // 2
         *
         * // Create an array of new elements to insert.
         *
         * var newElement1 = document.createElement('div');
         * var newElement2 = document.createElement('div');
         *
         * newElement1.classList.add('mix');
         * newElement2.classList.add('mix');
         *
         * var newElementsCollection = [newElement1, newElement2];
         *
         * // Insert the new elements starting at index 1
         *
         * mixer.insert(newElementsCollection, 1)
         *     .then(function(state) {
         *         console.log(state.totalShow === 4); // true
         *         console.log(state.show[1] === newElement1); // true
         *         console.log(state.show[2] === newElement2); // true
         *     });
         *
         * @example <caption>Example 4: Inserting a jQuery collection object containing one or more elements</caption>
         *
         * console.log(mixer.getState().totalShow); // 4
         *
         * var $newElement = $('&lt;div class="mix"&gt;&lt;/div&gt;');
         *
         * // Insert the new elements starting at index 3
         *
         * mixer.insert($newElement, 3)
         *     .then(function(state) {
         *         console.log(state.totalShow === 5); // true
         *         console.log(state.show[3] === $newElement[0]); // true
         *     });
         *
         * @public
         * @instance
         * @since       2.0.0
         * @param       {(HTMLElement|Array.<HTMLElement>|string)}    newElements
         *      A reference to a single element to insert, an array-like collection of elements, or an HTML string representing a single element.
         * @param       {number}    index=0
         *      The index at which to insert the new element(s). `0` by default.
         * @param       {boolean}   [animate=true]
         *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
         * @param       {function}  [callback=null]
         *      An optional callback function to be invoked after the operation has completed.
         * @return      {Promise.<mixitup.State>}
         *      A promise resolving with the current state object.
         */

        insert: function() {
            var self = this,
                args = self.parseInsertArgs(arguments);

            return self.multimix({
                insert: args.command
            }, args.animate, args.callback);
        },

        /**
         * Inserts one or more new elements before a provided reference element.
         *
         * @example
         *
         * .insertBefore(newElements, referenceElement [, animate] [, callback])
         *
         * @example <caption>Example: Inserting a new element before a reference element</caption>
         *
         * // An existing reference element is chosen at index 2
         *
         * var referenceElement = mixer.getState().show[2];
         *
         * // Create a new element
         *
         * var newElement = document.createElement('div');
         * newElement.classList.add('mix');
         *
         * mixer.insertBefore(newElement, referenceElement)
         *     .then(function(state) {
         *         // The new element is inserted into the container at index 2, before the reference element
         *
         *         console.log(state.show[2] === newElement); // true
         *
         *         // The reference element is now at index 3
         *
         *         console.log(state.show[3] === referenceElement); // true
         *     });
         *
         * @public
         * @instance
         * @since       3.0.0
         * @param       {(HTMLElement|Array.<HTMLElement>|string)}    newElements
         *      A reference to a single element to insert, an array-like collection of elements, or an HTML string representing a single element.
         * @param       {HTMLElement}    referenceElement
         *      A reference to an existing element in the container to insert new elements before.
         *@param       {boolean}   [animate=true]
         *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
         * @param       {function}  [callback=null]
         *      An optional callback function to be invoked after the operation has completed.
         * @return      {Promise.<mixitup.State>}
         *      A promise resolving with the current state object.
         */

        insertBefore: function() {
            var self = this,
                args = self.parseInsertArgs(arguments);

            return self.insert(args.command.collection, 'before', args.command.sibling, args.animate, args.callback);
        },

        /**
         * Inserts one or more new elements after a provided reference element.
         *
         * @example
         *
         * .insertAfter(newElements, referenceElement [, animate] [, callback])
         *
         * @example <caption>Example: Inserting a new element after a reference element</caption>
         *
         * // An existing reference element is chosen at index 2
         *
         * var referenceElement = mixer.getState().show[2];
         *
         * // Create a new element
         *
         * var newElement = document.createElement('div');
         * newElement.classList.add('mix');
         *
         * mixer.insertAfter(newElement, referenceElement)
         *     .then(function(state) {
         *         // The new element is inserted into the container at index 3, after the reference element
         *
         *         console.log(state.show[3] === newElement); // true
         *     });
         *
         * @public
         * @instance
         * @since       3.0.0
         * @param       {(HTMLElement|Array.<HTMLElement>|string)}    newElements
         *      A reference to a single element to insert, an array-like collection of elements, or an HTML string representing a single element.
         * @param       {HTMLElement}    referenceElement
         *      A reference to an existing element in the container to insert new elements after.
         * @param       {boolean}   [animate=true]
         *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
         * @param       {function}  [callback=null]
         *      An optional callback function to be invoked after the operation has completed.
         * @return      {Promise.<mixitup.State>}
         *      A promise resolving with the current state object.
         */

        insertAfter: function() {
            var self = this,
                args = self.parseInsertArgs(arguments);

            return self.insert(args.command.collection, 'after', args.command.sibling, args.animate, args.callback);
        },

        /**
         * Inserts one or more new elements into the container before all existing targets.
         *
         * @example
         *
         * .prepend(newElements [,animate] [,callback])
         *
         * @example <caption>Example: Prepending a new element</caption>
         *
         * // Create a new element
         *
         * var newElement = document.createElement('div');
         * newElement.classList.add('mix');
         *
         * // Insert the element into the container
         *
         * mixer.prepend(newElement)
         *     .then(function(state) {
         *         console.log(state.show[0] === newElement); // true
         *     });
         *
         * @public
         * @instance
         * @since       3.0.0
         * @param       {(HTMLElement|Array.<HTMLElement>|string)}    newElements
         *      A reference to a single element to insert, an array-like collection of elements, or an HTML string representing a single element.
         * @param       {boolean}   [animate=true]
         *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
         * @param       {function}  [callback=null]
         *      An optional callback function to be invoked after the operation has completed.
         * @return      {Promise.<mixitup.State>}
         *      A promise resolving with the current state object.
         */

        prepend: function() {
            var self = this,
                args = self.parseInsertArgs(arguments);

            return self.insert(0, args.command.collection, args.animate, args.callback);
        },

        /**
         * Inserts one or more new elements into the container after all existing targets.
         *
         * @example
         *
         * .append(newElements [,animate] [,callback])
         *
         * @example <caption>Example: Appending a new element</caption>
         *
         * // Create a new element
         *
         * var newElement = document.createElement('div');
         * newElement.classList.add('mix');
         *
         * // Insert the element into the container
         *
         * mixer.append(newElement)
         *     .then(function(state) {
         *         console.log(state.show[state.show.length - 1] === newElement); // true
         *     });
         *
         * @public
         * @instance
         * @since       3.0.0
         * @param       {(HTMLElement|Array.<HTMLElement>|string)}    newElements
         *      A reference to a single element to insert, an array-like collection of elements, or an HTML string representing a single element.
         * @param       {boolean}   [animate=true]
         *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
         * @param       {function}  [callback=null]
         *      An optional callback function to be invoked after the operation has completed.
         * @return      {Promise.<mixitup.State>}
         *      A promise resolving with the current state object.
         */

        append: function() {
            var self = this,
                args = self.parseInsertArgs(arguments);

            return self.insert(self.state.totalTargets, args.command.collection, args.animate, args.callback);
        },

        /**
         * Removes one or more existing target elements from the container.
         *
         * @example
         *
         * .remove(elements [, animate] [, callback])
         *
         * @example <caption>Example 1: Removing an element by reference</caption>
         *
         * var elementToRemove = containerEl.firstElementChild;
         *
         * mixer.remove(elementToRemove)
         *      .then(function(state) {
         *          console.log(state.targets.indexOf(elementToRemove) === -1); // true
         *      });
         *
         * @example <caption>Example 2: Removing a collection of elements by reference</caption>
         *
         * var elementsToRemove = containerEl.querySelectorAll('.category-a');
         *
         * console.log(elementsToRemove.length) // 3
         *
         * mixer.remove(elementsToRemove)
         *      .then(function() {
         *          console.log(containerEl.querySelectorAll('.category-a').length); // 0
         *      });
         *
         * @example <caption>Example 3: Removing one or more elements by selector</caption>
         *
         * mixer.remove('.category-a')
         *      .then(function() {
         *          console.log(containerEl.querySelectorAll('.category-a').length); // 0
         *      });
         *
         * @example <caption>Example 4: Removing an element by index</caption>
         *
         * console.log(mixer.getState.totalShow); // 4
         *
         * // Remove the element at index 3
         *
         * mixer.remove(3)
         *      .then(function(state) {
         *          console.log(state.totalShow); // 3
         *          console.log(state.show[3]); // undefined
         *      });
         *
         *
         * @public
         * @instance
         * @since       3.0.0
         * @param       {(HTMLElement|Array.<HTMLElement>|string|number)}    elements
         *      A reference to a single element to remove, an array-like collection of elements, a selector string, or the index of an element to remove.
         * @param       {boolean}   [animate=true]
         *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
         * @param       {function}  [callback=null]
         *      An optional callback function to be invoked after the operation has completed.
         * @return      {Promise.<mixitup.State>}
         *      A promise resolving with the current state object.
         */

        remove: function() {
            var self = this,
                args = self.parseRemoveArgs(arguments);

            return self.multimix({
                remove: args.command
            }, args.animate, args.callback);
        },

        /**
         * Retrieves the the value of any property or sub-object within the current
         * mixitup configuration, or the whole configuration object.
         *
         * @example
         *
         * .getConfig([stringKey])
         *
         * @example <caption>Example 1: retrieve the entire configuration object</caption>
         *
         * var config = mixer.getConfig(); // Config { ... }
         *
         * @example <caption>Example 2: retrieve a named sub-object of configuration object</caption>
         *
         * var animation = mixer.getConfig('animation'); // ConfigAnimation { ... }
         *
         * @example <caption>Example 3: retrieve a value of configuration object via a dot-notation string key</caption>
         *
         * var effects = mixer.getConfig('animation.effects'); // 'fade scale'
         *
         * @public
         * @instance
         * @since       2.0.0
         * @param       {string}    [stringKey]    A "dot-notation" string key
         * @return      {*}
         */

        getConfig: function(stringKey) {
            var self    = this,
                value   = null;

            if (!stringKey) {
                value = self.config;
            } else {
                value = h.getProperty(self.config, stringKey);
            }

            return self.callFilters('valueGetConfig', value, arguments);
        },

        /**
         * Updates the configuration of the mixer, after it has been instantiated.
         *
         * See the Configuration Object documentation for a full list of avilable
         * configuration options.
         *
         * @example
         *
         * .configure(config)
         *
         * @example <caption>Example 1: Updating animation options</caption>
         *
         * mixer.configure({
         *     animation: {
         *         effects: 'fade translateX(-100%)',
         *         duration: 300
         *     }
         * });
         *
         * @example <caption>Example 2: Removing a callback after it has been set</caption>
         *
         * var mixer;
         *
         * function handleMixEndOnce() {
         *     // Do something ..
         *
         *     // Then nullify the callback
         *
         *     mixer.configure({
         *         callbacks: {
         *             onMixEnd: null
         *         }
         *     });
         * };
         *
         * // Instantiate a mixer with a callback defined
         *
         * mixer = mixitup(containerEl, {
         *     callbacks: {
         *         onMixEnd: handleMixEndOnce
         *     }
         * });
         *
         * @public
         * @instance
         * @since       3.0.0
         * @param       {object}    config
         *      An object containing one of more configuration options.
         * @return      {void}
         */

        configure: function(config) {
            var self = this;

            self.callActions('beforeConfigure', arguments);

            h.extend(self.config, config, true, true);

            self.callActions('afterConfigure', arguments);
        },

        /**
         * Returns an object containing information about the current state of the
         * mixer. See the State Object documentation for more information.
         *
         * NB: State objects are immutable and should therefore be regenerated
         * after any operation.
         *
         * @example
         *
         * .getState();
         *
         * @example <caption>Example: Retrieving a state object</caption>
         *
         * var state = mixer.getState();
         *
         * console.log(state.totalShow + 'targets are currently shown');
         *
         * @public
         * @instance
         * @since       2.0.0
         * @return      {mixitup.State} An object reflecting the current state of the mixer.
         */

        getState: function() {
            var self    = this,
                state   = null;

            state = new mixitup.State();

            h.extend(state, self.state);

            h.freeze(state);

            return self.callFilters('stateGetState', state, arguments);
        },

        /**
         * Forces the re-indexing all targets within the container.
         *
         * This should only be used if some other piece of code in your application
         * has manipulated the contents of your container, which should be avoided.
         *
         * If you need to add or remove target elements from the container, use
         * the built-in `.insert()` or `.remove()` methods, and MixItUp will keep
         * itself up to date.
         *
         * @example
         *
         * .forceRefresh()
         *
         * @example <caption>Example: Force refreshing the mixer after external DOM manipulation</caption>
         *
         * console.log(mixer.getState().totalShow); // 3
         *
         * // An element is removed from the container via some external DOM manipulation code:
         *
         * containerEl.removeChild(containerEl.firstElementChild);
         *
         * // The mixer does not know that the number of targets has changed:
         *
         * console.log(mixer.getState().totalShow); // 3
         *
         * mixer.forceRefresh();
         *
         * // After forceRefresh, the mixer is in sync again:
         *
         * console.log(mixer.getState().totalShow); // 2
         *
         * @public
         * @instance
         * @since 2.1.2
         * @return {void}
         */

        forceRefresh: function() {
            var self = this;

            self.indexTargets();
        },

        /**
         * Forces the re-rendering of all targets when using the Dataset API.
         *
         * By default, targets are only re-rendered when `data.dirtyCheck` is
         * enabled, and an item's data has changed when `dataset()` is called.
         *
         * The `forceRender()` method allows for the re-rendering of all targets
         * in response to some arbitrary event, such as the changing of the target
         * render function.
         *
         * Targets are rendered against their existing data.
         *
         * @example
         *
         * .forceRender()
         *
         * @example <caption>Example: Force render targets after changing the target render function</caption>
         *
         * console.log(container.innerHTML); // ... &lt;span class="mix"&gt;Foo&lt;/span&gt; ...
         *
         * mixer.configure({
         *     render: {
         *         target: (item) => `&lt;a href="/${item.slug}/" class="mix"&gt;${item.title}&lt;/a&gt;`
         *     }
         * });
         *
         * mixer.forceRender();
         *
         * console.log(container.innerHTML); // ... &lt;a href="/foo/" class="mix"&gt;Foo&lt;/a&gt; ...
         *
         * @public
         * @instance
         * @since 3.2.1
         * @return {void}
         */

        forceRender: function() {
            var self    = this,
                target  = null,
                el      = null,
                id      = '';

            for (id in self.cache) {
                target = self.cache[id];

                el = target.render(target.data);

                if (el !== target.dom.el) {
                    // Update target element reference

                    if (target.isInDom) {
                        target.unbindEvents();

                        self.dom.parent.replaceChild(el, target.dom.el);
                    }

                    if (!target.isShown) {
                        el.style.display = 'none';
                    }

                    target.dom.el = el;

                    if (target.isInDom) {
                        target.bindEvents();
                    }
                }
            }

            self.state = self.buildState(self.lastOperation);
        },

        /**
         * Removes mixitup functionality from the container, unbinds all control
         * event handlers, and deletes the mixer instance from MixItUp's internal
         * cache.
         *
         * This should be performed whenever a mixer's container is removed from
         * the DOM, such as during a page change in a single page application,
         * or React's `componentWillUnmount()`.
         *
         * @example
         *
         * .destroy([cleanUp])
         *
         * @example <caption>Example: Destroying the mixer before removing its container element</caption>
         *
         * mixer.destroy();
         *
         * containerEl.parentElement.removeChild(containerEl);
         *
         * @public
         * @instance
         * @since   2.0.0
         * @param   {boolean}   [cleanUp=false]
         *     An optional boolean dictating whether or not to clean up any inline `display: none;` styling applied to hidden targets.
         * @return  {void}
         */

        destroy: function(cleanUp) {
            var self    = this,
                control = null,
                target  = null,
                i       = 0;

            self.callActions('beforeDestroy', arguments);

            for (i = 0; control = self.controls[i]; i++) {
                control.removeBinding(self);
            }

            for (i = 0; target = self.targets[i]; i++) {
                if (cleanUp) {
                    target.show();
                }

                target.unbindEvents();
            }

            if (self.dom.container.id.match(/^MixItUp/)) {
                self.dom.container.removeAttribute('id');
            }

            delete mixitup.instances[self.id];

            self.callActions('afterDestroy', arguments);
        }
    });

    /**
     * @constructor
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.IMoveData = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        this.posIn          = null;
        this.posOut         = null;
        this.operation      = null;
        this.callback       = null;
        this.statusChange   = '';
        this.duration       = -1;
        this.staggerIndex   = -1;

        this.callActions('afterConstruct');

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.IMoveData);

    mixitup.IMoveData.prototype = Object.create(mixitup.Base.prototype);

    mixitup.IMoveData.prototype.constructor = mixitup.IMoveData;

    /**
     * @constructor
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.TargetDom = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        this.el = null;

        this.callActions('afterConstruct');

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.TargetDom);

    mixitup.TargetDom.prototype = Object.create(mixitup.Base.prototype);

    mixitup.TargetDom.prototype.constructor = mixitup.TargetDom;

    /**
     * @constructor
     * @namespace
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.Target = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        this.id         = '';
        this.sortString = '';
        this.mixer      = null;
        this.callback   = null;
        this.isShown    = false;
        this.isBound    = false;
        this.isExcluded = false;
        this.isInDom    = false;
        this.handler    = null;
        this.operation  = null;
        this.data       = null;
        this.dom        = new mixitup.TargetDom();

        this.callActions('afterConstruct');

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.Target);

    mixitup.Target.prototype = Object.create(mixitup.Base.prototype);

    h.extend(mixitup.Target.prototype, {
        constructor: mixitup.Target,

        /**
         * Initialises a newly instantiated Target.
         *
         * @private
         * @instance
         * @since   3.0.0
         * @param   {(Element|null)}    el
         * @param   {object}            mixer
         * @param   {object}            [data]
         * @return  {void}
         */

        init: function(el, mixer, data) {
            var self = this,
                id   = '';

            self.callActions('beforeInit', arguments);

            self.mixer = mixer;

            if (!el) {
                // If no element is provided, render it

                el = self.render(data);
            }

            self.cacheDom(el);

            self.bindEvents();

            if (self.dom.el.style.display !== 'none') {
                self.isShown = true;
            }

            if (data && mixer.config.data.uidKey) {
                if (typeof (id = data[mixer.config.data.uidKey]) === 'undefined' || id.toString().length < 1) {
                    throw new TypeError(mixitup.messages.errorDatasetInvalidUidKey({
                        uidKey: mixer.config.data.uidKey
                    }));
                }

                self.id     = id;
                self.data   = data;

                mixer.cache[id] = self;
            }

            self.callActions('afterInit', arguments);
        },

        /**
         * Renders the target element using a user-defined renderer function.
         *
         * @private
         * @instance
         * @since   3.1.4
         * @param   {object} data
         * @return  {void}
         */

        render: function(data) {
            var self    = this,
                render  = null,
                el      = null,
                temp    = null,
                output  = '';

            self.callActions('beforeRender', arguments);

            render = self.callFilters('renderRender', self.mixer.config.render.target, arguments);

            if (typeof render !== 'function') {
                throw new TypeError(mixitup.messages.errorDatasetRendererNotSet());
            }

            output = render(data);

            if (output && typeof output === 'object' && h.isElement(output)) {
                el = output;
            } else if (typeof output === 'string') {
                temp = document.createElement('div');
                temp.innerHTML = output;

                el = temp.firstElementChild;
            }

            return self.callFilters('elRender', el, arguments);
        },

        /**
         * Caches references of DOM elements neccessary for the target's functionality.
         *
         * @private
         * @instance
         * @since   3.0.0
         * @param   {Element} el
         * @return  {void}
         */

        cacheDom: function(el) {
            var self = this;

            self.callActions('beforeCacheDom', arguments);

            self.dom.el = el;

            self.callActions('afterCacheDom', arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {string}    attributeName
         * @return  {void}
         */

        getSortString: function(attributeName) {
            var self    = this,
                value   = self.dom.el.getAttribute('data-' + attributeName) || '';

            self.callActions('beforeGetSortString', arguments);

            value = isNaN(value * 1) ?
                value.toLowerCase() :
                value * 1;

            self.sortString = value;

            self.callActions('afterGetSortString', arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @return  {void}
         */

        show: function() {
            var self = this;

            self.callActions('beforeShow', arguments);

            if (!self.isShown) {
                self.dom.el.style.display = '';

                self.isShown = true;
            }

            self.callActions('afterShow', arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @return  {void}
         */

        hide: function() {
            var self = this;

            self.callActions('beforeHide', arguments);

            if (self.isShown) {
                self.dom.el.style.display = 'none';

                self.isShown = false;
            }

            self.callActions('afterHide', arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {mixitup.IMoveData} moveData
         * @return  {void}
         */

        move: function(moveData) {
            var self = this;

            self.callActions('beforeMove', arguments);

            if (!self.isExcluded) {
                self.mixer.targetsMoved++;
            }

            self.applyStylesIn(moveData);

            requestAnimationFrame(function() {
                self.applyStylesOut(moveData);
            });

            self.callActions('afterMove', arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {object}    posData
         * @param   {number}    multiplier
         * @return  {void}
         */

        applyTween: function(posData, multiplier) {
            var self                    = this,
                propertyName            = '',
                tweenData               = null,
                posIn                   = posData.posIn,
                currentTransformValues  = [],
                currentValues           = new mixitup.StyleData(),
                i                       = -1;

            self.callActions('beforeApplyTween', arguments);

            currentValues.x     = posIn.x;
            currentValues.y     = posIn.y;

            if (multiplier === 0) {
                self.hide();
            } else if (!self.isShown) {
                self.show();
            }

            for (i = 0; propertyName = mixitup.features.TWEENABLE[i]; i++) {
                tweenData = posData.tweenData[propertyName];

                if (propertyName === 'x') {
                    if (!tweenData) continue;

                    currentValues.x = posIn.x + (tweenData * multiplier);
                } else if (propertyName === 'y') {
                    if (!tweenData) continue;

                    currentValues.y = posIn.y + (tweenData * multiplier);
                } else if (tweenData instanceof mixitup.TransformData) {
                    if (!tweenData.value) continue;

                    currentValues[propertyName].value =
                        posIn[propertyName].value + (tweenData.value * multiplier);

                    currentValues[propertyName].unit  = tweenData.unit;

                    currentTransformValues.push(
                        propertyName + '(' + currentValues[propertyName].value + tweenData.unit + ')'
                    );
                } else {
                    if (!tweenData) continue;

                    currentValues[propertyName] = posIn[propertyName] + (tweenData * multiplier);

                    self.dom.el.style[propertyName] = currentValues[propertyName];
                }
            }

            if (currentValues.x || currentValues.y) {
                currentTransformValues.unshift('translate(' + currentValues.x + 'px, ' + currentValues.y + 'px)');
            }

            if (currentTransformValues.length) {
                self.dom.el.style[mixitup.features.transformProp] = currentTransformValues.join(' ');
            }

            self.callActions('afterApplyTween', arguments);
        },

        /**
         * Applies the initial styling to a target element before any transition
         * is applied.
         *
         * @private
         * @instance
         * @param   {mixitup.IMoveData} moveData
         * @return  {void}
         */

        applyStylesIn: function(moveData) {
            var self            = this,
                posIn           = moveData.posIn,
                isFading        = self.mixer.effectsIn.opacity !== 1,
                transformValues = [];

            self.callActions('beforeApplyStylesIn', arguments);

            transformValues.push('translate(' + posIn.x + 'px, ' + posIn.y + 'px)');

            if (self.mixer.config.animation.animateResizeTargets) {
                if (moveData.statusChange !== 'show') {
                    // Don't apply posIn width or height or showing, as will be 0

                    self.dom.el.style.width  = posIn.width + 'px';
                    self.dom.el.style.height = posIn.height + 'px';
                }

                self.dom.el.style.marginRight  = posIn.marginRight + 'px';
                self.dom.el.style.marginBottom = posIn.marginBottom + 'px';
            }

            isFading && (self.dom.el.style.opacity = posIn.opacity);

            if (moveData.statusChange === 'show') {
                transformValues = transformValues.concat(self.mixer.transformIn);
            }

            self.dom.el.style[mixitup.features.transformProp] = transformValues.join(' ');

            self.callActions('afterApplyStylesIn', arguments);
        },

        /**
         * Applies a transition followed by the final styles for the element to
         * transition towards.
         *
         * @private
         * @instance
         * @param   {mixitup.IMoveData} moveData
         * @return  {void}
         */

        applyStylesOut: function(moveData) {
            var self            = this,
                transitionRules = [],
                transformValues = [],
                isResizing      = self.mixer.config.animation.animateResizeTargets,
                isFading        = typeof self.mixer.effectsIn.opacity !== 'undefined';

            self.callActions('beforeApplyStylesOut', arguments);

            // Build the transition rules

            transitionRules.push(self.writeTransitionRule(
                mixitup.features.transformRule,
                moveData.staggerIndex
            ));

            if (moveData.statusChange !== 'none') {
                transitionRules.push(self.writeTransitionRule(
                    'opacity',
                    moveData.staggerIndex,
                    moveData.duration
                ));
            }

            if (isResizing) {
                transitionRules.push(self.writeTransitionRule(
                    'width',
                    moveData.staggerIndex,
                    moveData.duration
                ));

                transitionRules.push(self.writeTransitionRule(
                    'height',
                    moveData.staggerIndex,
                    moveData.duration
                ));

                transitionRules.push(self.writeTransitionRule(
                    'margin',
                    moveData.staggerIndex,
                    moveData.duration
                ));
            }

            // If no callback was provided, the element will
            // not transition in any way so tag it as "immovable"

            if (!moveData.callback) {
                self.mixer.targetsImmovable++;

                if (self.mixer.targetsMoved === self.mixer.targetsImmovable) {
                    // If the total targets moved is equal to the
                    // number of immovable targets, the operation
                    // should be considered finished

                    self.mixer.cleanUp(moveData.operation);
                }

                return;
            }

            // If the target will transition in some fasion,
            // assign a callback function

            self.operation = moveData.operation;
            self.callback = moveData.callback;

            // As long as the target is not excluded, increment
            // the total number of targets bound

            !self.isExcluded && self.mixer.targetsBound++;

            // Tag the target as bound to differentiate from transitionEnd
            // events that may come from stylesheet driven effects

            self.isBound = true;

            // Apply the transition

            self.applyTransition(transitionRules);

            // Apply width, height and margin negation

            if (isResizing && moveData.posOut.width > 0 && moveData.posOut.height > 0) {
                self.dom.el.style.width        = moveData.posOut.width + 'px';
                self.dom.el.style.height       = moveData.posOut.height + 'px';
                self.dom.el.style.marginRight  = moveData.posOut.marginRight + 'px';
                self.dom.el.style.marginBottom = moveData.posOut.marginBottom + 'px';
            }

            if (!self.mixer.config.animation.nudge && moveData.statusChange === 'hide') {
                // If we're not nudging, the translation should be
                // applied before any other transforms to prevent
                // lateral movement

                transformValues.push('translate(' + moveData.posOut.x + 'px, ' + moveData.posOut.y + 'px)');
            }

            // Apply fade

            switch (moveData.statusChange) {
                case 'hide':
                    isFading && (self.dom.el.style.opacity = self.mixer.effectsOut.opacity);

                    transformValues = transformValues.concat(self.mixer.transformOut);

                    break;
                case 'show':
                    isFading && (self.dom.el.style.opacity = 1);
            }

            if (
                self.mixer.config.animation.nudge ||
                (!self.mixer.config.animation.nudge && moveData.statusChange !== 'hide')
            ) {
                // Opposite of above - apply translate after
                // other transform

                transformValues.push('translate(' + moveData.posOut.x + 'px, ' + moveData.posOut.y + 'px)');
            }

            // Apply transforms

            self.dom.el.style[mixitup.features.transformProp] = transformValues.join(' ');

            self.callActions('afterApplyStylesOut', arguments);
        },

        /**
         * Combines the name of a CSS property with the appropriate duration and delay
         * values to created a valid transition rule.
         *
         * @private
         * @instance
         * @since   3.0.0
         * @param   {string}    property
         * @param   {number}    staggerIndex
         * @param   {number}    duration
         * @return  {string}
         */

        writeTransitionRule: function(property, staggerIndex, duration) {
            var self  = this,
                delay = self.getDelay(staggerIndex),
                rule  = '';

            rule = property + ' ' +
                (duration > 0 ? duration : self.mixer.config.animation.duration) + 'ms ' +
                delay + 'ms ' +
                (property === 'opacity' ? 'linear' : self.mixer.config.animation.easing);

            return self.callFilters('ruleWriteTransitionRule', rule, arguments);
        },

        /**
         * Calculates the transition delay for each target element based on its index, if
         * staggering is applied. If defined, A custom `animation.staggerSeqeuence`
         * function can be used to manipulate the order of indices to produce custom
         * stagger effects (e.g. for use in a grid with irregular row lengths).
         *
         * @private
         * @instance
         * @since   2.0.0
         * @param   {number}    index
         * @return  {number}
         */

        getDelay: function(index) {
            var self    = this,
                delay   = -1;

            if (typeof self.mixer.config.animation.staggerSequence === 'function') {
                index = self.mixer.config.animation.staggerSequence.call(self, index, self.state);
            }

            delay = !!self.mixer.staggerDuration ? index * self.mixer.staggerDuration : 0;

            return self.callFilters('delayGetDelay', delay, arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {string[]}  rules
         * @return  {void}
         */

        applyTransition: function(rules) {
            var self                = this,
                transitionString    = rules.join(', ');

            self.callActions('beforeApplyTransition', arguments);

            self.dom.el.style[mixitup.features.transitionProp] = transitionString;

            self.callActions('afterApplyTransition', arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {Event} e
         * @return  {void}
         */

        handleTransitionEnd: function(e) {
            var self        = this,
                propName    = e.propertyName,
                canResize   = self.mixer.config.animation.animateResizeTargets;

            self.callActions('beforeHandleTransitionEnd', arguments);

            if (
                self.isBound &&
                e.target.matches(self.mixer.config.selectors.target) &&
                (
                    propName.indexOf('transform') > -1 ||
                    propName.indexOf('opacity') > -1 ||
                    canResize && propName.indexOf('height') > -1 ||
                    canResize && propName.indexOf('width') > -1 ||
                    canResize && propName.indexOf('margin') > -1
                )
            ) {
                self.callback.call(self, self.operation);

                self.isBound = false;
                self.callback = null;
                self.operation = null;
            }

            self.callActions('afterHandleTransitionEnd', arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {Event}     e
         * @return  {void}
         */

        eventBus: function(e) {
            var self = this;

            self.callActions('beforeEventBus', arguments);

            switch (e.type) {
                case 'webkitTransitionEnd':
                case 'transitionend':
                    self.handleTransitionEnd(e);
            }

            self.callActions('afterEventBus', arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @return  {void}
         */

        unbindEvents: function() {
            var self = this;

            self.callActions('beforeUnbindEvents', arguments);

            h.off(self.dom.el, 'webkitTransitionEnd', self.handler);
            h.off(self.dom.el, 'transitionend', self.handler);

            self.callActions('afterUnbindEvents', arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @return  {void}
         */

        bindEvents: function() {
            var self                = this,
                transitionEndEvent  = '';

            self.callActions('beforeBindEvents', arguments);

            transitionEndEvent = mixitup.features.transitionPrefix === 'webkit' ? 'webkitTransitionEnd' : 'transitionend';

            self.handler = function(e) {
                return self.eventBus(e);
            };

            h.on(self.dom.el, transitionEndEvent, self.handler);

            self.callActions('afterBindEvents', arguments);
        },

        /**
         * @private
         * @instance
         * @since   3.0.0
         * @param   {boolean}   [getBox]
         * @return  {PosData}
         */

        getPosData: function(getBox) {
            var self    = this,
                styles  = {},
                rect    = null,
                posData = new mixitup.StyleData();

            self.callActions('beforeGetPosData', arguments);

            posData.x = self.dom.el.offsetLeft;
            posData.y = self.dom.el.offsetTop;

            if (self.mixer.config.animation.animateResizeTargets || getBox) {
                rect = self.dom.el.getBoundingClientRect();

                posData.top     = rect.top;
                posData.right   = rect.right;
                posData.bottom  = rect.bottom;
                posData.left    = rect.left;

                posData.width  = rect.width;
                posData.height = rect.height;
            }

            if (self.mixer.config.animation.animateResizeTargets) {
                styles = window.getComputedStyle(self.dom.el);

                posData.marginBottom = parseFloat(styles.marginBottom);
                posData.marginRight  = parseFloat(styles.marginRight);
            }

            return self.callFilters('posDataGetPosData', posData, arguments);
        },

        /**
         * @private
         * @instance
         * @since       3.0.0
         * @return      {void}
         */

        cleanUp: function() {
            var self = this;

            self.callActions('beforeCleanUp', arguments);

            self.dom.el.style[mixitup.features.transformProp]  = '';
            self.dom.el.style[mixitup.features.transitionProp] = '';
            self.dom.el.style.opacity                          = '';

            if (self.mixer.config.animation.animateResizeTargets) {
                self.dom.el.style.width        = '';
                self.dom.el.style.height       = '';
                self.dom.el.style.marginRight  = '';
                self.dom.el.style.marginBottom = '';
            }

            self.callActions('afterCleanUp', arguments);
        }
    });

    /**
     * A jQuery-collection-like wrapper around one or more `mixitup.Mixer` instances
     * allowing simultaneous control of said instances similar to the MixItUp 2 API.
     *
     * @example
     * new mixitup.Collection(instances)
     *
     * @constructor
     * @namespace
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     * @param       {mixitup.Mixer[]}   instances
     */

    mixitup.Collection = function(instances) {
        var instance    = null,
            i           = -1;

        this.callActions('beforeConstruct');

        for (i = 0; instance = instances[i]; i++) {
            this[i] = instance;
        }

        this.length = instances.length;

        this.callActions('afterConstruct');

        h.freeze(this);
    };

    mixitup.BaseStatic.call(mixitup.Collection);

    mixitup.Collection.prototype = Object.create(mixitup.Base.prototype);

    h.extend(mixitup.Collection.prototype,
    /** @lends mixitup.Collection */
    {
        constructor: mixitup.Collection,

        /**
         * Calls a method on all instances in the collection by passing the method
         * name as a string followed by any applicable parameters to be curried into
         * to the method.
         *
         * @example
         * .mixitup(methodName[,arg1][,arg2..]);
         *
         * @example
         * var collection = new Collection([mixer1, mixer2]);
         *
         * return collection.mixitup('filter', '.category-a')
         *     .then(function(states) {
         *         state.forEach(function(state) {
         *             console.log(state.activeFilter.selector); // .category-a
         *         });
         *     });
         *
         * @public
         * @instance
         * @since       3.0.0
         * @param       {string}  methodName
         * @return      {Promise<Array<mixitup.State>>}
         */

        mixitup: function(methodName) {
            var self        = this,
                instance    = null,
                args        = Array.prototype.slice.call(arguments),
                tasks       = [],
                i           = -1;

            this.callActions('beforeMixitup');

            args.shift();

            for (i = 0; instance = self[i]; i++) {
                tasks.push(instance[methodName].apply(instance, args));
            }

            return self.callFilters('promiseMixitup', h.all(tasks, mixitup.libraries), arguments);
        }
    });

    /**
     * `mixitup.Operation` objects contain all data neccessary to describe the full
     * lifecycle of any MixItUp operation. They can be used to compute and store an
     * operation for use at a later time (e.g. programmatic tweening).
     *
     * @constructor
     * @namespace
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.Operation = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        this.id                      = '';

        this.args                    = [];
        this.command                 = null;
        this.showPosData             = [];
        this.toHidePosData           = [];

        this.startState              = null;
        this.newState                = null;
        this.docState                = null;

        this.willSort                = false;
        this.willChangeLayout        = false;
        this.hasEffect               = false;
        this.hasFailed               = false;

        this.triggerElement          = null;

        this.show                    = [];
        this.hide                    = [];
        this.matching                = [];
        this.toShow                  = [];
        this.toHide                  = [];
        this.toMove                  = [];
        this.toRemove                = [];
        this.startOrder              = [];
        this.newOrder                = [];
        this.startSort               = null;
        this.newSort                 = null;
        this.startFilter             = null;
        this.newFilter               = null;
        this.startDataset            = null;
        this.newDataset              = null;
        this.viewportDeltaX          = 0;
        this.viewportDeltaY          = 0;
        this.startX                  = 0;
        this.startY                  = 0;
        this.startHeight             = 0;
        this.startWidth              = 0;
        this.newX                    = 0;
        this.newY                    = 0;
        this.newHeight               = 0;
        this.newWidth                = 0;
        this.startContainerClassName = '';
        this.startDisplay            = '';
        this.newContainerClassName   = '';
        this.newDisplay              = '';

        this.callActions('afterConstruct');

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.Operation);

    mixitup.Operation.prototype = Object.create(mixitup.Base.prototype);

    mixitup.Operation.prototype.constructor = mixitup.Operation;

    /**
     * `mixitup.State` objects expose various pieces of data detailing the state of
     * a MixItUp instance. They are provided at the start and end of any operation via
     * callbacks and events, with the most recent state stored between operations
     * for retrieval at any time via the API.
     *
     * @constructor
     * @namespace
     * @memberof    mixitup
     * @public
     * @since       3.0.0
     */

    mixitup.State = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        /**
         * The ID of the mixer instance.
         *
         * @name        id
         * @memberof    mixitup.State
         * @instance
         * @type        {string}
         * @default     ''
         */

        this.id = '';

        /**
         * The currently active filter command as set by a control click or API call.
         *
         * @name        activeFilter
         * @memberof    mixitup.State
         * @instance
         * @type        {mixitup.CommandFilter}
         * @default     null
         */

        this.activeFilter = null;

        /**
         * The currently active sort command as set by a control click or API call.
         *
         * @name        activeSort
         * @memberof    mixitup.State
         * @instance
         * @type        {mixitup.CommandSort}
         * @default     null
         */

        this.activeSort = null;

        /**
         * The current layout-specific container class name, if applied.
         *
         * @name        activeContainerClassName
         * @memberof    mixitup.State
         * @instance
         * @type        {string}
         * @default     ''
         */

        this.activeContainerClassName = '';

        /**
         * A reference to the container element that the mixer is instantiated on.
         *
         * @name        container
         * @memberof    mixitup.State
         * @instance
         * @type        {Element}
         * @default     null
         */

        this.container = null;

        /**
         * An array of all target elements indexed by the mixer.
         *
         * @name        targets
         * @memberof    mixitup.State
         * @instance
         * @type        {Array.<Element>}
         * @default     []
         */

        this.targets = [];

        /**
         * An array of all target elements not matching the current filter.
         *
         * @name        hide
         * @memberof    mixitup.State
         * @instance
         * @type        {Array.<Element>}
         * @default     []
         */

        this.hide = [];

        /**
         * An array of all target elements matching the current filter and any additional
         * limits applied such as pagination.
         *
         * @name        show
         * @memberof    mixitup.State
         * @instance
         * @type        {Array.<Element>}
         * @default     []
         */

        this.show = [];

        /**
         * An array of all target elements matching the current filter irrespective of
         * any additional limits applied such as pagination.
         *
         * @name        matching
         * @memberof    mixitup.State
         * @instance
         * @type        {Array.<Element>}
         * @default     []
         */

        this.matching = [];

        /**
         * An integer representing the total number of target elements indexed by the
         * mixer. Equivalent to `state.targets.length`.
         *
         * @name        totalTargets
         * @memberof    mixitup.State
         * @instance
         * @type        {number}
         * @default     -1
         */

        this.totalTargets = -1;

        /**
         * An integer representing the total number of target elements matching the
         * current filter and any additional limits applied such as pagination.
         * Equivalent to `state.show.length`.
         *
         * @name        totalShow
         * @memberof    mixitup.State
         * @instance
         * @type        {number}
         * @default     -1
         */

        this.totalShow = -1;

        /**
         * An integer representing the total number of target elements not matching
         * the current filter. Equivalent to `state.hide.length`.
         *
         * @name        totalHide
         * @memberof    mixitup.State
         * @instance
         * @type        {number}
         * @default     -1
         */

        this.totalHide = -1;

        /**
         * An integer representing the total number of target elements matching the
         * current filter irrespective of any other limits applied such as pagination.
         * Equivalent to `state.matching.length`.
         *
         * @name        totalMatching
         * @memberof    mixitup.State
         * @instance
         * @type        {number}
         * @default     -1
         */

        this.totalMatching = -1;

        /**
         * A boolean indicating whether the last operation "failed", i.e. no targets
         * could be found matching the filter.
         *
         * @name        hasFailed
         * @memberof    mixitup.State
         * @instance
         * @type        {boolean}
         * @default     false
         */

        this.hasFailed = false;

        /**
         * The DOM element that was clicked if the last operation was triggered by the
         * clicking of a control and not an API call.
         *
         * @name        triggerElement
         * @memberof    mixitup.State
         * @instance
         * @type        {Element|null}
         * @default     null
         */

        this.triggerElement = null;

        /**
         * The currently active dataset underlying the rendered targets, if the
         * dataset API is in use.
         *
         * @name        activeDataset
         * @memberof    mixitup.State
         * @instance
         * @type        {Array.<object>}
         * @default     null
         */

        this.activeDataset = null;

        this.callActions('afterConstruct');

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.State);

    mixitup.State.prototype = Object.create(mixitup.Base.prototype);

    mixitup.State.prototype.constructor = mixitup.State;

    /**
     * @constructor
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.UserInstruction = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        this.command    = {};
        this.animate    = false;
        this.callback   = null;

        this.callActions('afterConstruct');

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.UserInstruction);

    mixitup.UserInstruction.prototype = Object.create(mixitup.Base.prototype);

    mixitup.UserInstruction.prototype.constructor = mixitup.UserInstruction;

    /**
     * @constructor
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     */

    mixitup.Messages = function() {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct');

        /* Errors
        ----------------------------------------------------------------------------- */

        this.ERROR_FACTORY_INVALID_CONTAINER =
            '[MixItUp] An invalid selector or element reference was passed to the mixitup factory function';

        this.ERROR_FACTORY_CONTAINER_NOT_FOUND =
            '[MixItUp] The provided selector yielded no container element';

        this.ERROR_CONFIG_INVALID_ANIMATION_EFFECTS =
            '[MixItUp] Invalid value for `animation.effects`';

        this.ERROR_CONFIG_INVALID_CONTROLS_SCOPE =
            '[MixItUp] Invalid value for `controls.scope`';

        this.ERROR_CONFIG_INVALID_PROPERTY =
            '[MixitUp] Invalid configuration object property "${erroneous}"${suggestion}';

        this.ERROR_CONFIG_INVALID_PROPERTY_SUGGESTION =
            '. Did you mean "${probableMatch}"?';

        this.ERROR_CONFIG_DATA_UID_KEY_NOT_SET =
            '[MixItUp] To use the dataset API, a UID key must be specified using `data.uidKey`';

        this.ERROR_DATASET_INVALID_UID_KEY =
            '[MixItUp] The specified UID key "${uidKey}" is not present on one or more dataset items';

        this.ERROR_DATASET_DUPLICATE_UID =
            '[MixItUp] The UID "${uid}" was found on two or more dataset items. UIDs must be unique.';

        this.ERROR_INSERT_INVALID_ARGUMENTS =
            '[MixItUp] Please provider either an index or a sibling and position to insert, not both';

        this.ERROR_INSERT_PREEXISTING_ELEMENT =
            '[MixItUp] An element to be inserted already exists in the container';

        this.ERROR_FILTER_INVALID_ARGUMENTS =
            '[MixItUp] Please provide either a selector or collection `.filter()`, not both';

        this.ERROR_DATASET_NOT_SET =
            '[MixItUp] To use the dataset API with pre-rendered targets, a starting dataset must be set using `load.dataset`';

        this.ERROR_DATASET_PRERENDERED_MISMATCH =
            '[MixItUp] `load.dataset` does not match pre-rendered targets';

        this.ERROR_DATASET_RENDERER_NOT_SET =
            '[MixItUp] To insert an element via the dataset API, a target renderer function must be provided to `render.target`';

        this.ERROR_SORT_NON_EXISTENT_ELEMENT =
            '[MixItUp] An element to be sorted does not already exist in the container';

        /* Warnings
        ----------------------------------------------------------------------------- */

        this.WARNING_FACTORY_PREEXISTING_INSTANCE =
            '[MixItUp] WARNING: This element already has an active MixItUp instance. The provided configuration object will be ignored.' +
            ' If you wish to perform additional methods on this instance, please create a reference.';

        this.WARNING_INSERT_NO_ELEMENTS =
            '[MixItUp] WARNING: No valid elements were passed to `.insert()`';

        this.WARNING_REMOVE_NO_ELEMENTS =
            '[MixItUp] WARNING: No valid elements were passed to `.remove()`';

        this.WARNING_MULTIMIX_INSTANCE_QUEUE_FULL =
            '[MixItUp] WARNING: An operation was requested but the MixItUp instance was busy. The operation was rejected because the ' +
            'queue is full or queuing is disabled.';

        this.WARNING_GET_OPERATION_INSTANCE_BUSY =
            '[MixItUp] WARNING: Operations can be be created while the MixItUp instance is busy.';

        this.WARNING_NO_PROMISE_IMPLEMENTATION =
            '[MixItUp] WARNING: No Promise implementations could be found. If you wish to use promises with MixItUp please install' +
            ' an ES6 Promise polyfill.';

        this.WARNING_INCONSISTENT_SORTING_ATTRIBUTES =
            '[MixItUp] WARNING: The requested sorting data attribute "${attribute}" was not present on one or more target elements' +
            ' which may product unexpected sort output';

        this.callActions('afterConstruct');

        this.compileTemplates();

        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.Messages);

    mixitup.Messages.prototype = Object.create(mixitup.Base.prototype);

    mixitup.Messages.prototype.constructor = mixitup.Messages;

    /**
     * @return {void}
     */

    mixitup.Messages.prototype.compileTemplates = function() {
        var errorKey        = '';
        var errorMessage    = '';

        for (errorKey in this) {
            if (typeof (errorMessage = this[errorKey]) !== 'string') continue;

            this[h.camelCase(errorKey)] = h.template(errorMessage);
        }
    };

    mixitup.messages = new mixitup.Messages();

    /**
     * @constructor
     * @memberof    mixitup
     * @private
     * @since       3.0.0
     * @param       {mixitup.Mixer} mixer
     */

    mixitup.Facade = function Mixer(mixer) {
        mixitup.Base.call(this);

        this.callActions('beforeConstruct', arguments);

        this.configure          = mixer.configure.bind(mixer);
        this.show               = mixer.show.bind(mixer);
        this.hide               = mixer.hide.bind(mixer);
        this.filter             = mixer.filter.bind(mixer);
        this.toggleOn           = mixer.toggleOn.bind(mixer);
        this.toggleOff          = mixer.toggleOff.bind(mixer);
        this.sort               = mixer.sort.bind(mixer);
        this.changeLayout       = mixer.changeLayout.bind(mixer);
        this.multimix           = mixer.multimix.bind(mixer);
        this.dataset            = mixer.dataset.bind(mixer);
        this.tween              = mixer.tween.bind(mixer);
        this.insert             = mixer.insert.bind(mixer);
        this.insertBefore       = mixer.insertBefore.bind(mixer);
        this.insertAfter        = mixer.insertAfter.bind(mixer);
        this.prepend            = mixer.prepend.bind(mixer);
        this.append             = mixer.append.bind(mixer);
        this.remove             = mixer.remove.bind(mixer);
        this.destroy            = mixer.destroy.bind(mixer);
        this.forceRefresh       = mixer.forceRefresh.bind(mixer);
        this.forceRender        = mixer.forceRender.bind(mixer);
        this.isMixing           = mixer.isMixing.bind(mixer);
        this.getOperation       = mixer.getOperation.bind(mixer);
        this.getConfig          = mixer.getConfig.bind(mixer);
        this.getState           = mixer.getState.bind(mixer);

        this.callActions('afterConstruct', arguments);

        h.freeze(this);
        h.seal(this);
    };

    mixitup.BaseStatic.call(mixitup.Facade);

    mixitup.Facade.prototype = Object.create(mixitup.Base.prototype);

    mixitup.Facade.prototype.constructor = mixitup.Facade;

    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = mixitup;
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return mixitup;
        });
    } else if (typeof window.mixitup === 'undefined' || typeof window.mixitup !== 'function') {
        window.mixitup = mixitup;
    }
    mixitup.BaseStatic.call(mixitup.constructor);

    mixitup.NAME = 'mixitup';
    mixitup.CORE_VERSION = '3.3.1';
})(window);

/**!
 * MixItUp Pagination v3.3.0
 * Client-side pagination for filtered and sorted content
 * Build 875b7d31-63d1-4040-ac6f-b1c814027891
 *
 * Requires mixitup.js >= v^3.1.8
 *
 * @copyright Copyright 2014-2017 KunkaLabs Limited.
 * @author    KunkaLabs Limited.
 * @link      https://www.kunkalabs.com/mixitup-pagination/
 *
 * @license   Commercial use requires a commercial license.
 *            https://www.kunkalabs.com/mixitup-pagination/licenses/
 *
 *            Non-commercial use permitted under same terms as  license.
 *            http://creativecommons.org/licenses/by-nc/3.0/
 */

(function (window) {
	var mixitupPagination = function (mixitup) {
		var h = mixitup.h;

		if (!mixitup.CORE_VERSION || !h.compareVersions(mixitupPagination.REQUIRE_CORE_VERSION, mixitup.CORE_VERSION)) {
			throw new Error("[MixItUp Pagination] MixItUp Pagination " + mixitupPagination.EXTENSION_VERSION + " requires at least MixItUp " + mixitupPagination.REQUIRE_CORE_VERSION);
		}

		/**
   * A group of optional callback functions to be invoked at various
   * points within the lifecycle of a mixer operation.
   *
   * @constructor
   * @memberof    mixitup.Config
   * @name        callbacks
   * @namespace
   * @public
   * @since       2.0.0
   */

		mixitup.ConfigCallbacks.registerAction("afterConstruct", "pagination", function () {
			/**
    * A callback function invoked whenever a pagination operation starts.
    *
    * This function is equivalent to `onMixStart`, and is invoked immediately
    * after it with the same arguments. Unlike `onMixStart` however, it will
    * not be invoked for filter or sort operations.
    *
    *
    * @name        onPaginateStart
    * @memberof    mixitup.Config.callbacks
    * @instance
    * @type        {function}
    * @default     null
    */

			this.onPaginateStart = null;

			/**
    * A callback function invoked whenever a pagination operation ends.
    *
    * This function is equivalent to `onMixEnd`, and is invoked immediately
    * after it with the same arguments. Unlike `onMixEnd` however, it will
    * not be invoked for filter or sort operations.
    *
    * @name        onPaginateStart
    * @memberof    mixitup.Config.callbacks
    * @instance
    * @type        {function}
    * @default     null
    */

			this.onPaginateEnd = null;
		});

		/**
   * A group of properties defining the output and structure of class names programmatically
   * added to controls and containers to reflect the state of the mixer.
   *
   * @constructor
   * @memberof    mixitup.Config
   * @name        classNames
   * @namespace
   * @public
   * @since       3.0.0
   */

		mixitup.ConfigClassNames.registerAction("afterConstruct", "pagination", function () {
			/**
    * The "element" portion of the class name added to pager controls.
    *
    * @example <caption>Example: changing the `config.classNames.elementPager` value</caption>
    *
    * // Change from the default value of 'control' to 'pager'
    *
    * var mixer = mixitup(containerEl, {
    *     classNames: {
    *         elementPager: 'pager'
    *     }
    * });
    *
    * // Base pager output: "mixitup-pager"
    *
    * @name        elementPager
    * @memberof    mixitup.Config.classNames
    * @instance
    * @type        {string}
    * @default     'control'
    */

			this.elementPager = "control";

			/**
    * The "element" portion of the class name added to the page list element, when it is
    * in its disabled state.
    *
    * The page list element is the containing element in which pagers are rendered.
    *
    * @example <caption>Example: changing the `config.classNames.elementPageList` value</caption>
    *
    * // Change from the default value of 'page-list' to 'pagination-links'
    *
    * var mixer = mixitup(containerEl, {
    *     classNames: {
    *         elementPageList: 'pagination-links'
    *     }
    * });
    *
    * // Disabled page-list output: "mixitup-pagination-links-disabled"
    *
    * @name        elementPageList
    * @memberof    mixitup.Config.classNames
    * @instance
    * @type        {string}
    * @default     'page-list'
    */

			this.elementPageList = "page-list";

			/**
    * The "element" portion of the class name added to the page stats element, when it is
    * in its disabled state.
    *
    * The page stats element is the containing element in which information about the
    * current page and total number of pages is rendered.
    *
    * @example <caption>Example: changing the `config.classNames.elementPageStats` value</caption>
    *
    * // Change from the default value of 'page-stats' to 'pagination-info'
    *
    * var mixer = mixitup(containerEl, {
    *     classNames: {
    *         elementPageList: 'pagination-info'
    *     }
    * });
    *
    * // Disabled page-list output: "mixitup-pagination-info-disabled"
    *
    * @name        elementPageStats
    * @memberof    mixitup.Config.classNames
    * @instance
    * @type        {string}
    * @default     'page-stats'
    */

			this.elementPageStats = "page-stats";

			/**
    * The "modifier" portion of the class name added to the first pager in the list of pager controls.
    *
    * @name        modifierFirst
    * @memberof    mixitup.Config.classNames
    * @instance
    * @type        {string}
    * @default     'first'
    */

			this.modifierFirst = "first";

			/**
    * The "modifier" portion of the class name added to the last pager in the list of pager controls.
    *
    * @name        modifierLast
    * @memberof    mixitup.Config.classNames
    * @instance
    * @type        {string}
    * @default     'last'
    */

			this.modifierLast = "last";

			/**
    * The "modifier" portion of the class name added to the previous pager in the list of pager controls.
    *
    * @name        modifierLast
    * @memberof    mixitup.Config.classNames
    * @instance
    * @type        {string}
    * @default     'prev'
    */

			this.modifierPrev = "prev";

			/**
    * The "modifier" portion of the class name added to the next pager in the list of pager controls.
    *
    * @name        modifierNext
    * @memberof    mixitup.Config.classNames
    * @instance
    * @type        {string}
    * @default     'next'
    */

			this.modifierNext = "next";

			/**
    * The "modifier" portion of the class name added to truncation markers in the list of pager controls.
    *
    * @name        modifierTruncationMarker
    * @memberof    mixitup.Config.classNames
    * @instance
    * @type        {string}
    * @default     'truncation-marker'
    */

			this.modifierTruncationMarker = "truncation-marker";
		});

		/**
   * A group of properties defining the initial state of the mixer on load (instantiation).
   *
   * @constructor
   * @memberof    mixitup.Config
   * @name        load
   * @namespace
   * @public
   * @since       2.0.0
   */

		mixitup.ConfigLoad.registerAction("afterConstruct", "pagination", function () {
			/**
    * An integer defining the starting page on load, if a page limit is active.
    *
    * @example <caption>Example: Defining a start page other than 1 to be applied on load</caption>
    *
    * // The mixer will show page 3 on load, with 8 items per page.
    *
    * var mixer = mixitup(containerEl, {
    *     pagination: {
    *         limit: 8
    *     },
    *     load: {
    *         page: 3
    *     }
    * });
    *
    * @name        page
    * @memberof    mixitup.Config.load
    * @instance
    * @type        {number}
    * @default     1
    */

			this.page = 1;
		});

		/**
   * A group of properties defining the mixer's pagination behavior.
   *
   * @constructor
   * @memberof    mixitup.Config
   * @name        pagination
   * @namespace
   * @public
   * @since       2.0.0
   */

		mixitup.ConfigPagination = function () {
			/**
    * A boolean dictating whether or not MixItUp should render a list of pager controls.
    *
    * If you wish to control pagination functionality via the API, or your own UI, this can be set to `false`.
    *
    * In order for this functionality to work, you must provide MixItUp with a `pageList`
    * element matching the selector defined in `selectors.pageList`. Pager controls will be
    * rendered inside this element as per the templates defined for the `templates.pager`
    * and related configuration options, or if set, a custom render
    * function supplied to the `render.pager` configuration option.
    *
    * @example <caption>Example: Disabling the rendering of the built-in "page list" UI</caption>
    *
    * var mixer = mixitup(containerEl, {
    *     pagination: {
    *         limit: 8,
    *         generatePageList: false
    *     }
    * });
    *
    * @name        generatePageList
    * @memberof    mixitup.Config.pagination
    * @instance
    * @type        {boolean}
    * @default     true
    */

			this.generatePageList = true;

			/**
    * A boolean dictating whether or not MixItUp should render a stats about the
    * current page (e.g. "1 to 4 of 16").
    *
    * In order for this functionality to work, you must provide MixItUp with a `pageStats`
    * element matching the selector defined in `selectors.pageStats`. Page stats content will
    * be rendered inside this element as per the templates defined for the `templates.pageStats`
    * and `templates.pageStatsSingle` configuration options, or if set, a custom render
    * function supplied to the `render.pageStats` configuration option.
    *
    * @example <caption>Example: Disabling the rendering of the built-in "page stats" UI</caption>
    *
    * var mixer = mixitup(containerEl, {
    *     pagination: {
    *         limit: 8,
    *         generatePageStats: false
    *     }
    * });
    *
    * @name        generatePageStats
    * @memberof    mixitup.Config.pagination
    * @instance
    * @type        {boolean}
    * @default     true
    */

			this.generatePageStats = true;

			/**
    * A boolean dictating whether or not to maintain the active page when switching
    * from filter to filter.
    *
    * By default, MixItUp will attempt to maintain the active page or its highest
    * equivalent in the new collection of matching targets (e.g. page 3 would become
    * page 2 if there are not enough targets in the new collection), but by setting
    * this option to `false`, changing the active filter will always cause the mixer
    * to revert to page one of the new collection.
    *
    * @example <caption>Example: Ensuring that the mixer reverts to page one when filtered</caption>
    *
    * var mixer = mixitup(containerEl, {
    *     pagination: {
    *         limit: 8,
    *         maintainActivePage: false
    *     }
    * });
    *
    * @name        maintainActivePage
    * @memberof    mixitup.Config.pagination
    * @instance
    * @type        {boolean}
    * @default     true
    */

			this.maintainActivePage = true;

			/**
    * A boolean dictating whether or not to allow "looping" of the built-in previous
    * and next pagination controls.
    *
    * By default, when on the first page, the "previous" button will be disabled,
    * and when on the last page, the "next" button will be disabled. By setting
    * this option to `true`, the user may loop from the first to last page and
    * vice-versa.
    *
    * @example <caption>Example: Allowing prev/next controls to "loop" through pages</caption>
    *
    * var mixer = mixitup(containerEl, {
    *     pagination: {
    *         limit: 8,
    *         loop: true
    *     }
    * });
    *
    * @name        loop
    * @memberof    mixitup.Config.pagination
    * @instance
    * @type        {boolean}
    * @default     false
    */

			this.loop = false;

			/**
    * A boolean dictating whether or not to prevent rendering of the built-in
    * "page list" UI if the matching collection of targets has only enough content
    * for one page.
    *
    * @example <caption>Example: Hiding the page list UI if only one page</caption>
    *
    * var mixer = mixitup(containerEl, {
    *     pagination: {
    *         limit: 8,
    *         hidePageListIfSinglePage: true
    *     }
    * });
    *
    * @name        hidePageListIfSinglePage
    * @memberof    mixitup.Config.pagination
    * @instance
    * @type        {boolean}
    * @default     false
    */

			this.hidePageListIfSinglePage = false;

			/**
    * A boolean dictating whether or not to prevent rendering of the built-in
    * "page stats" UI if the matching collection of targets has only enough content
    * for one page.
    *
    * @example <caption>Example: Hiding the page stats UI if only one page</caption>
    *
    * var mixer = mixitup(containerEl, {
    *     pagination: {
    *         limit: 8,
    *         hidePageStatsIfSinglePage: true
    *     }
    * });
    *
    * @name        hidePageStatsIfSinglePage
    * @memberof    mixitup.Config.pagination
    * @instance
    * @type        {boolean}
    * @default     false
    */

			this.hidePageStatsIfSinglePage = false;

			/**
    * A number defining the maximum number of items per page.
    *
    * By default, this is set to `-1` and pagination is effectively
    * disabled. By setting this to any number greater than 0, pagination
    * will be applied to the mixers targets, effectively activating the
    * extension.
    *
    * @example <caption>Example: Activating the pagination extension by defining a valid limit</caption>
    *
    * var mixer = mixitup(containerEl, {
    *     pagination: {
    *         limit: 8
    *     }
    * });
    *
    * @name        limit
    * @memberof    mixitup.Config.pagination
    * @instance
    * @type        {number}
    * @default     -1
    */

			this.limit = -1;

			/**
    * A number dictating the maximum number of individual pager controls to render before
    * truncating the list (e.g. adding an ellipses between non-consecutive pagers).
    *
    * The minimum value permitted for this option is 5, which ensures
    * there will always be at least a first, last, and two padding pagers, in addition
    * to the pager representing the currently active page.
    *
    * @name        maxPagers
    * @memberof    mixitup.Config.pagination
    * @instance
    * @type        {number}
    * @default     5
    */

			this.maxPagers = 5;

			h.seal(this);
		};

		/**
   * A group of optional render functions for creating and updating elements.
   *
   * @constructor
   * @memberof    mixitup.Config
   * @name        render
   * @namespace
   * @public
   * @since       3.0.0
   */

		mixitup.ConfigRender.registerAction("afterConstruct", "pagination", function () {
			/**
    * A function returning an HTML string representing a single pager control element.
    *
    * By default, MixItUp will render pager controls using its own internal renderer
    * and templates (see `templates.pager`), but you may override this functionality by
    * providing your own render function here instead. All pager elements must have a
    * data-page element indicating the action of the control.
    *
    * The function receives an object containing all neccessary information
    * about the pager as its first parameter.
    *
    * @name        pager
    * @memberof    mixitup.Config.render
    * @instance
    * @type        {function}
    * @default     'null'
    */

			this.pager = null;

			/**
    * A function returning an HTML string forming the contents of the "page stats" element.
    *
    * By default, MixItUp will render page stats using its own internal renderer
    * and templates (see `templates.pageStats`), but you may override this functionality by
    * providing your own render function here instead.
    *
    * The function receives an object containing all neccessary information
    * about the current page and total pages as its first parameter.
    *
    * @name        pageStats
    * @memberof    mixitup.Config.render
    * @instance
    * @type        {function}
    * @default     'null'
    */

			this.pageStats = null;
		});

		/**
   * A group of properties defining the selectors used to query elements within a mixitup container.
   *
   * @constructor
   * @memberof    mixitup.Config
   * @name        selectors
   * @namespace
   * @public
   * @since       2.0.0
   */

		mixitup.ConfigSelectors.registerAction("afterConstruct", "pagination", function () {
			/**
    * A selector string used to query the page list element.
    *
    * Depending on the value of `controls.scope`, MixItUp will either query the
    * entire document for the page list element, or just the container.
    *
    * @name        pageList
    * @memberof    mixitup.Config.selectors
    * @instance
    * @type        {string}
    * @default     '.mixitup-page-list'
    */

			this.pageList = ".mixitup-page-list";

			/**
    * A selector string used to query the page stats element.
    *
    * Depending on the value of `controls.scope`, MixItUp will either query the
    * entire document for the page stats element, or just the container.
    *
    * @name        pageStats
    * @memberof    mixitup.Config.selectors
    * @instance
    * @type        {string}
    * @default     '.mixitup-page-stats'
    */

			this.pageStats = ".mixitup-page-stats";
		});

		/**
   * A group of template strings used to render pager controls and page stats elements.
   *
   * @constructor
   * @memberof    mixitup.Config
   * @name        templates
   * @namespace
   * @public
   * @since       3.0.0
   */

		mixitup.ConfigTemplates.registerAction("afterConstruct", "pagination", function () {
			/**
    * @name        pager
    * @memberof    mixitup.Config.templates
    * @instance
    * @type        {string}
    * @default     '<button type="button" class="${classNames}" data-page="${pageNumber}">${pageNumber}</button>'
    */

			this.pager = '<button type="button" class="${classNames}" data-page="${pageNumber}">${pageNumber}</button>';

			/**
    * @name        pagerPrev
    * @memberof    mixitup.Config.templates
    * @instance
    * @type        {string}
    * @default     '<button type="button" class="${classNames}" data-page="prev">&laquo;</button>'
    */

			this.pagerPrev = '<button type="button" class="${classNames}" data-page="prev">&laquo;</button>';

			/**
    * @name        pagerNext
    * @memberof    mixitup.Config.templates
    * @instance
    * @type        {string}
    * @default     '<button type="button" class="${classNames}" data-page="next">&raquo;</button>'
    */

			this.pagerNext = '<button type="button" class="${classNames}" data-page="next">&raquo;</button>';

			/**
    * @name        pagerTruncationMarker
    * @memberof    mixitup.Config.templates
    * @instance
    * @type        {string}
    * @default     '<span class="${classNames}">&hellip;</span>'
    */

			this.pagerTruncationMarker = '<span class="${classNames}">&hellip;</span>';

			/**
    * @name        pageStats
    * @memberof    mixitup.Config.templates
    * @instance
    * @type        {string}
    * @default     '${startPageAt} to ${endPageAt} of ${totalTargets}'
    */

			this.pageStats = "${startPageAt} to ${endPageAt} of ${totalTargets}";

			/**
    * @name        pageStatsSingle
    * @memberof    mixitup.Config.templates
    * @instance
    * @type        {string}
    * @default     '${startPageAt} of ${totalTargets}'
    */

			this.pageStatsSingle = "${startPageAt} of ${totalTargets}";

			/**
    * @name        pageStatsFail
    * @memberof    mixitup.Config.templates
    * @instance
    * @type        {string}
    * @default     'None found'
    */

			this.pageStatsFail = "None found";
		});

		/**
   * The MixItUp configuration object is extended with the following properties
   * relating to the Pagination extension.
   *
   * For the full list of configuration options, please refer to the MixItUp
   * core documentation.
   *
   * @constructor
   * @memberof    mixitup
   * @name        Config
   * @namespace
   * @public
   * @since       2.0.0
   */

		mixitup.Config.registerAction("beforeConstruct", "pagination", function () {
			this.pagination = new mixitup.ConfigPagination();
		});

		mixitup.ModelPager = function () {
			this.pageNumber = -1;
			this.classNames = "";
			this.classList = [];
			this.isDisabled = false;
			this.isPrev = false;
			this.isNext = false;
			this.isPageLink = false;
			this.isTruncationMarker = false;

			h.seal(this);
		};

		mixitup.ModelPageStats = function () {
			this.startPageAt = -1;
			this.endPageAt = -1;
			this.totalTargets = -1;

			h.seal(this);
		};

		mixitup.UiClassNames.registerAction("afterConstruct", "pagination", function () {
			this.first = "";
			this.last = "";
			this.prev = "";
			this.next = "";
			this.first = "";
			this.last = "";
			this.truncated = "";
			this.truncationMarker = "";
		});

		mixitup.controlDefinitions.push(new mixitup.ControlDefinition("pager", "[data-page]", true, "pageListEls"));

		/**
   * @param   {mixitup.MultimixCommand[]} commands
   * @param   {ClickEvent}                e
   * @return  {object|null}
   */

		mixitup.Control.registerFilter("commandsHandleClick", "pagination", function (commands, e) {
			var self = this,
			    command = {},
			    page = "",
			    pageNumber = -1,
			    mixer = null,
			    button = null,
			    i = -1;

			if (!self.selector || self.selector !== "[data-page]") {
				// Static control or non-pager live control

				return commands;
			}

			button = h.closestParent(e.target, self.selector, true, self.bound[0].dom.document);

			for (i = 0; mixer = self.bound[i]; i++) {
				command = commands[i];

				if (!mixer.config.pagination || mixer.config.pagination.limit < 0 || mixer.config.pagination.limit === Infinity) {
					// Pagination is disabled for this instance. Do not handle.

					commands[i] = null;

					continue;
				}

				if (!button || h.hasClass(button, mixer.classNamesPager.active) || h.hasClass(button, mixer.classNamesPager.disabled)) {
					// No button was clicked or button is already active. Do not handle.

					commands[i] = null;

					continue;
				}

				page = button.getAttribute("data-page");

				if (page === "prev") {
					command.paginate = "prev";
				} else if (page === "next") {
					command.paginate = "next";
				} else if (pageNumber) {
					command.paginate = parseInt(page);
				}

				if (mixer.lastClicked) {
					mixer.lastClicked = button;
				}
			}

			return commands;
		});

		mixitup.CommandMultimix.registerAction("afterConstruct", "pagination", function () {
			this.paginate = null;
		});

		/**
   * @constructor
   * @memberof    mixitup
   * @private
   * @since       3.0.0
   */

		mixitup.CommandPaginate = function () {
			this.page = -1;
			this.limit = -1;
			this.action = ""; // enum: ['prev', 'next']
			this.anchor = null;

			h.seal(this);
		};

		mixitup.Events.registerAction("afterConstruct", "pagination", function () {
			/**
    * A custom event triggered whenever a pagination operation starts.
    *
    * @name        paginateStart
    * @memberof    mixitup.Events
    * @static
    * @type        {CustomEvent}
    */

			this.paginateStart = null;

			/**
    * A custom event triggered whenever a pagination operation ends.
    *
    * @name        paginateEnd
    * @memberof    mixitup.Events
    * @static
    * @type        {CustomEvent}
    */

			this.paginateEnd = null;
		});

		mixitup.events = new mixitup.Events();

		mixitup.Operation.registerAction("afterConstruct", "pagination", function () {
			this.startPagination = null;
			this.newPagination = null;
			this.startTotalPages = -1;
			this.newTotalPages = -1;
		});

		/**
   * `mixitup.State` objects expose various pieces of data detailing the state of
   * a MixItUp instance. They are provided at the start and end of any operation via
   * callbacks and events, with the most recent state stored between operations
   * for retrieval at any time via the API.
   *
   * @constructor
   * @namespace
   * @name        State
   * @memberof    mixitup
   * @public
   * @since       3.0.0
   */

		mixitup.State.registerAction("afterConstruct", "pagination", function () {
			/**
    * The currently active pagination command as set by a control click or API call.
    *
    * @name        activePagination
    * @memberof    mixitup.State
    * @instance
    * @type        {mixitup.CommandPagination}
    * @default     null
    */

			this.activePagination = null;

			/**
    * The total number of pages produced as a combination of the current page
    * limit and active filter.
    *
    * @name        totalPages
    * @memberof    mixitup.State
    * @instance
    * @type        {number}
    * @default     -1
    */

			this.totalPages = -1;
		});

		mixitup.MixerDom.registerAction("afterConstruct", "pagination", function () {
			this.pageListEls = [];
			this.pageStatsEls = [];
		});

		/**
   * The mixitup.Mixer class is extended with the following methods relating to
   * the Pagination extension.
   *
   * For the full list of methods, please refer to the MixItUp core documentation.
   *
   * @constructor
   * @namespace
   * @name        Mixer
   * @memberof    mixitup
   * @public
   * @since       3.0.0
   */

		mixitup.Mixer.registerAction("afterConstruct", "pagination", function () {
			this.classNamesPager = new mixitup.UiClassNames();
			this.classNamesPageList = new mixitup.UiClassNames();
			this.classNamesPageStats = new mixitup.UiClassNames();
		});

		/**
   * @private
   * @return  {void}
   */

		mixitup.Mixer.registerAction("afterAttach", "pagination", function () {
			var self = this,
			    el = null,
			    i = -1;

			if (self.config.pagination.limit < 0) return;

			// Map pagination ui classNames

			// jscs:disable
			self.classNamesPager.base = h.getClassname(self.config.classNames, "pager");
			self.classNamesPager.active = h.getClassname(self.config.classNames, "pager", self.config.classNames.modifierActive);
			self.classNamesPager.disabled = h.getClassname(self.config.classNames, "pager", self.config.classNames.modifierDisabled);
			self.classNamesPager.first = h.getClassname(self.config.classNames, "pager", self.config.classNames.modifierFirst);
			self.classNamesPager.last = h.getClassname(self.config.classNames, "pager", self.config.classNames.modifierLast);
			self.classNamesPager.prev = h.getClassname(self.config.classNames, "pager", self.config.classNames.modifierPrev);
			self.classNamesPager.next = h.getClassname(self.config.classNames, "pager", self.config.classNames.modifierNext);
			self.classNamesPager.truncationMarker = h.getClassname(self.config.classNames, "pager", self.config.classNames.modifierTruncationMarker);

			self.classNamesPageList.base = h.getClassname(self.config.classNames, "page-list");
			self.classNamesPageList.disabled = h.getClassname(self.config.classNames, "page-list", self.config.classNames.modifierDisabled);

			self.classNamesPageStats.base = h.getClassname(self.config.classNames, "page-stats");
			self.classNamesPageStats.disabled = h.getClassname(self.config.classNames, "page-stats", self.config.classNames.modifierDisabled);
			// jscs:enable

			if (self.config.pagination.generatePageList && self.dom.pageListEls.length > 0) {
				for (i = 0; el = self.dom.pageListEls[i]; i++) {
					self.renderPageListEl(el, self.lastOperation);
				}
			}

			if (self.config.pagination.generatePageStats && self.dom.pageStatsEls.length > 0) {
				for (i = 0; el = self.dom.pageStatsEls[i]; i++) {
					self.renderPageStatsEl(el, self.lastOperation);
				}
			}
		});

		mixitup.Mixer.registerAction("afterSanitizeConfig", "pagination", function () {
			var self = this,
			    onMixStart = self.config.callbacks.onMixStart,
			    onMixEnd = self.config.callbacks.onMixEnd,
			    onPaginateStart = self.config.callbacks.onPaginateStart,
			    onPaginateEnd = self.config.callbacks.onPaginateEnd,
			    didPaginate = false;

			if (self.config.pagination.limit < 0) return;

			self.classNamesPager = new mixitup.UiClassNames();
			self.classNamesPageList = new mixitup.UiClassNames();
			self.classNamesPageStats = new mixitup.UiClassNames();

			self.config.callbacks.onMixStart = function (prevState, nextState) {
				if (prevState.activePagination.limit !== nextState.activePagination.limit || prevState.activePagination.page !== nextState.activePagination.page) {
					didPaginate = true;
				}

				if (typeof onMixStart === "function") onMixStart.apply(self.dom.container, arguments);

				if (!didPaginate) return;

				mixitup.events.fire("paginateStart", self.dom.container, {
					state: prevState,
					futureState: nextState,
					instance: self
				}, self.dom.document);

				if (typeof onPaginateStart === "function") onPaginateStart.apply(self.dom.container, arguments);
			};

			self.config.callbacks.onMixEnd = function (state) {
				if (typeof onMixEnd === "function") onMixEnd.apply(self.dom.container, arguments);

				if (!didPaginate) return;

				didPaginate = false;

				mixitup.events.fire("paginateEnd", self.dom.container, {
					state: state,
					instance: self
				}, self.dom.document);

				if (typeof onPaginateEnd === "function") onPaginateEnd.apply(self.dom.container, arguments);
			};
		});

		/**
   * @private
   * @param   {mixitup.Operation} operation
   * @param   {mixitup.State}     state
   * @return  {mixitup.Operation}
   */

		mixitup.Mixer.registerFilter("operationGetInitialState", "pagination", function (operation, state) {
			var self = this;

			if (self.config.pagination.limit < 0) return operation;

			operation.newPagination = state.activePagination;

			return operation;
		});

		/**
   * @private
   * @param   {mixitup.State} state
   * @return  {mixitup.State}
   */

		mixitup.Mixer.registerFilter("stateGetInitialState", "pagination", function (state) {
			var self = this;

			if (self.config.pagination.limit < 0) return state;

			state.activePagination = new mixitup.CommandPaginate();

			state.activePagination.page = self.config.load.page;
			state.activePagination.limit = self.config.pagination.limit;

			return state;
		});

		/**
   * @private
   * @return  {void}
   */

		mixitup.Mixer.registerAction("afterGetFinalMixData", "pagination", function () {
			var self = this;

			if (self.config.pagination.limit < 0) return;

			if (typeof self.config.pagination.maxPagers === "number") {
				// Restrict max pagers to a minimum of 5. There must always
				// be a first, last, and one on either side of the active pager.
				// e.g. « 1 ... 4 5 6 ... 10 »

				self.config.pagination.maxPagers = Math.max(5, self.config.pagination.maxPagers);
			}
		});

		/**
   * @private
   * @return  {void}
   */

		mixitup.Mixer.registerAction("afterCacheDom", "pagination", function () {
			var self = this,
			    parent = null;

			if (self.config.pagination.limit < 0) return;

			if (!self.config.pagination.generatePageList) return;

			switch (self.config.controls.scope) {
				case "local":
					parent = self.dom.container;

					break;
				case "global":
					parent = self.dom.document;

					break;
				default:
					throw new Error(mixitup.messages.ERROR_CONFIG_INVALID_CONTROLS_SCOPE);
			}

			self.dom.pageListEls = parent.querySelectorAll(self.config.selectors.pageList);
			self.dom.pageStatsEls = parent.querySelectorAll(self.config.selectors.pageStats);
		});

		/**
   * @private
   * @param   {mixitup.State}     state
   * @param   {mixitup.Operation} operation
   * @return  {mixitup.State}
   */

		mixitup.Mixer.registerFilter("stateBuildState", "pagination", function (state, operation) {
			var self = this;

			if (self.config.pagination.limit < 0) return state;

			// Map pagination-specific properties into state

			state.activePagination = operation.newPagination;
			state.totalPages = operation.newTotalPages;

			return state;
		});

		/**
   * @private
   * @param   {mixitup.UserInstruction}     instruction
   * @return  {mixitup.UserInstruction}
   */

		mixitup.Mixer.registerFilter("instructionParseMultimixArgs", "pagination", function (instruction) {
			var self = this;

			if (self.config.pagination.limit < 0) return instruction;

			if (instruction.command.paginate && !(instruction.command.paginate instanceof mixitup.CommandPaginate)) {
				instruction.command.paginate = self.parsePaginateArgs([instruction.command.paginate]).command;
			}

			return instruction;
		});

		/**
   * @private
   * @param   {mixitup.Operation} operation
   * @return  {void}
   */

		mixitup.Mixer.registerAction("afterFilterOperation", "pagination", function (operation) {
			var self = this,
			    startPageAt = -1,
			    endPageAt = -1,
			    inPage = [],
			    notInPage = [],
			    target = null,
			    index = -1,
			    i = -1;

			if (self.config.pagination.limit < 0) return;

			// Calculate the new total pages as a matter of course (i.e. a change in filter)

			// New matching array has already been set at this point

			operation.newTotalPages = operation.newPagination.limit ? Math.max(Math.ceil(operation.matching.length / operation.newPagination.limit), 1) : 1;

			if (self.config.pagination.maintainActivePage) {
				operation.newPagination.page = operation.newPagination.page > operation.newTotalPages ? operation.newTotalPages : operation.newPagination.page;
			}

			// Keep config in sync with latest limit

			self.config.pagination.limit = operation.newPagination.limit;

			if (operation.newPagination.anchor) {
				// Start page at an anchor element

				for (i = 0; target = operation.matching[i]; i++) {
					if (target.dom.el === operation.newPagination.anchor) break;
				}

				startPageAt = i;
				endPageAt = i + operation.newPagination.limit - 1;
			} else {
				// Start page based on limit and page index

				startPageAt = operation.newPagination.limit * (operation.newPagination.page - 1);
				endPageAt = operation.newPagination.limit * operation.newPagination.page - 1;

				if (isNaN(startPageAt)) {
					startPageAt = 0;
				}
			}

			if (operation.newPagination.limit < 0) return;

			for (i = 0; target = operation.show[i]; i++) {
				// For each target in `show`, include in page, only if within the range

				if (i >= startPageAt && i <= endPageAt) {
					inPage.push(target);
				} else {
					// Else move to `notInPage`

					notInPage.push(target);
				}
			}

			// override the operation's `show` array with the newly constructed `inPage` array

			operation.show = inPage;

			// For anything not in the page, make sure it is correctly assigned:

			for (i = 0; target = operation.toHide[i]; i++) {
				// For example, if a target would normally be included in `toHide`, but is
				// now already hidden as not in the page, make sure it is removed from `toHide`
				// so it is not included in the operation.

				if (!target.isShown) {
					operation.toHide.splice(i, 1);

					target.isShown = false;

					i--;
				}
			}

			for (i = 0; target = notInPage[i]; i++) {
				// For each target not in page, move into `hide`

				operation.hide.push(target);

				if ((index = operation.toShow.indexOf(target)) > -1) {
					// Any targets due to be shown will no longer be shown

					operation.toShow.splice(index, 1);
				}

				if (target.isShown) {
					// If currently shown, move to `toHide`

					operation.toHide.push(target);
				}
			}
		});

		/**
   * @private
   * @param   {mixitup.Operation}         operation
   * @param   {mixitup.CommandMultimix}   command
   * @return  {mixitup.Operation}
   */

		mixitup.Mixer.registerFilter("operationUnmappedGetOperation", "pagination", function (operation, command) {
			var self = this;

			if (self.config.pagination.limit < 0) return operation;

			operation.startState = self.state;
			operation.startPagination = self.state.activePagination;
			operation.startTotalPages = self.state.totalPages;

			operation.newPagination = new mixitup.CommandPaginate();

			operation.newPagination.limit = operation.startPagination.limit;
			operation.newPagination.page = operation.startPagination.page;

			if (command.paginate) {
				self.parsePaginateCommand(command.paginate, operation);
			} else if (command.filter || command.sort) {
				h.extend(operation.newPagination, operation.startPagination);

				// Reset to 1, or maintain active:

				if (!self.config.pagination.maintainActivePage) {
					operation.newPagination.page = 1;
				} else {
					operation.newPagination.page = self.state.activePagination.page;
				}
			}

			return operation;
		});

		/**
   * @private
   * @param   {mixitup.Operation} operation
   * @param   {object}            command
   * @param   {boolean}           [isPreFetch=false]
   * @return  {mixitup.Operation}
   */

		mixitup.Mixer.registerFilter("operationMappedGetOperation", "pagination", function (operation, command, isPreFetch) {
			var self = this,
			    el = null,
			    i = -1;

			if (self.config.pagination.limit < 0) return operation;

			if (isPreFetch) {
				// The operation is being pre-fetched, so don't update the pagers or stats yet.

				return operation;
			}

			if (self.config.pagination.generatePageList && self.dom.pageListEls.length > 0) {
				for (i = 0; el = self.dom.pageListEls[i]; i++) {
					self.renderPageListEl(el, operation);
				}
			}

			if (self.config.pagination.generatePageStats && self.dom.pageStatsEls.length > 0) {
				for (i = 0; el = self.dom.pageStatsEls[i]; i++) {
					self.renderPageStatsEl(el, operation);
				}
			}

			return operation;
		});

		mixitup.Mixer.extend(
		/** @lends mixitup.Mixer */
		{
			/**
    * @private
    * @param   {mixitup.CommandPaginate}   command
    * @param   {mixitup.Operation}         operation
    * @return  {void}
    */

			parsePaginateCommand: function (command, operation) {
				var self = this;

				// e.g. mixer.paginate({page: 3, limit: 2});
				// e.g. mixer.paginate({action: 'next'});
				// e.g. mixer.paginate({anchor: anchorTarget, limit: 5});

				if (command.page > -1) {
					if (command.page === 0) throw new Error(mixitup.messages.ERROR_PAGINATE_INDEX_RANGE);

					// TODO: replace Infinity with the highest possible page index

					operation.newPagination.page = Math.max(1, Math.min(Infinity, command.page));
				} else if (command.action === "next") {
					operation.newPagination.page = self.getNextPage();
				} else if (command.action === "prev") {
					operation.newPagination.page = self.getPrevPage();
				} else if (command.anchor) {
					operation.newPagination.anchor = command.anchor;
				}

				if (command.limit > -1) {
					operation.newPagination.limit = command.limit;
				}

				if (operation.newPagination.limit !== operation.startPagination.limit) {
					// A new limit has been sent via the API, calculate total pages

					operation.newTotalPages = operation.newPagination.limit ? Math.max(Math.ceil(operation.startState.matching.length / operation.newPagination.limit), 1) : 1;
				}

				if (operation.newPagination.limit <= 0 || operation.newPagination.limit === Infinity) {
					operation.newPagination.page = 1;
				}
			},

			/**
    * @private
    * @return  {number}    page
    */

			getNextPage: function () {
				var self = this,
				    page = -1;

				page = self.state.activePagination.page + 1;

				if (page > self.state.totalPages) {
					page = self.config.pagination.loop ? 1 : self.state.activePagination.page;
				}

				return page;
			},

			/**
    * @private
    * @return  {Number}    page
    */

			getPrevPage: function () {
				var self = this,
				    page = -1;

				page = self.state.activePagination.page - 1;

				if (page < 1) {
					page = self.config.pagination.loop ? self.state.totalPages : self.state.activePagination.page;
				}

				return page;
			},

			/**
    * @private
    * @param   {HTMLElement}        pageListEl
    * @param   {mixitup.Operation}  operation
    * @return  {void}
    */

			renderPageListEl: function (pageListEl, operation) {
				var self = this,
				    activeIndex = -1,
				    pagerHtml = "",
				    buttonList = [],
				    model = null,
				    renderer = null,
				    allowedIndices = [],
				    truncatedBefore = false,
				    truncatedAfter = false,
				    disabled = null,
				    el = null,
				    html = "",
				    i = -1;

				if (operation.newPagination.limit < 0 || operation.newPagination.limit === Infinity || operation.newTotalPages < 2 && self.config.pagination.hidePageListIfSinglePage) {
					// Empty the pager list, and add disabled class

					pageListEl.innerHTML = "";

					h.addClass(pageListEl, self.classNamesPageList.disabled);

					return;
				}

				activeIndex = operation.newPagination.page - 1;

				renderer = typeof (renderer = self.config.render.pager) === "function" ? renderer : null;

				if (self.config.pagination.maxPagers < Infinity && operation.newTotalPages > self.config.pagination.maxPagers) {
					allowedIndices = self.getAllowedIndices(operation);
				}

				// Render prev button

				model = new mixitup.ModelPager();

				model.isPrev = true;
				model.classList.push(self.classNamesPager.base, self.classNamesPager.prev);

				// If first and not looping, disable the prev button

				if (operation.newPagination.page === 1 && !self.config.pagination.loop) {
					model.classList.push(self.classNamesPager.disabled);

					model.isDisabled = true;
				}

				model.classNames = model.classList.join(" ");

				if (renderer) {
					pagerHtml = renderer(model);
				} else {
					pagerHtml = h.template(self.config.templates.pagerPrev)(model);
				}

				buttonList.push(pagerHtml);

				// Render per-page pagers

				for (i = 0; i < operation.newTotalPages; i++) {
					pagerHtml = self.renderPager(i, operation, allowedIndices);

					if (pagerHtml || i < activeIndex && truncatedBefore || i > activeIndex && truncatedAfter) {
						if (pagerHtml) {
							buttonList.push(pagerHtml);
						}

						continue;
					}

					// Replace gaps between pagers with a truncation maker, but only once

					model = new mixitup.ModelPager();

					model.isTruncationMarker = true;

					model.classList.push(self.classNamesPager.base, self.classNamesPager.truncationMarker);
					model.classNames = model.classList.join(" ");

					if (renderer) {
						pagerHtml = renderer(model);
					} else {
						pagerHtml = h.template(self.config.templates.pagerTruncationMarker)(model);
					}

					buttonList.push(pagerHtml);

					// Prevent multiple truncation markers

					if (i < activeIndex) {
						truncatedBefore = true;
					}

					if (i > activeIndex) {
						truncatedAfter = true;
					}
				}

				// Render next button

				model = new mixitup.ModelPager();

				model.isNext = true;
				model.classList.push(self.classNamesPager.base, self.classNamesPager.next);

				// If last page and not looping, disable the next button

				if (operation.newPagination.page === operation.newTotalPages && !self.config.pagination.loop) {
					model.classList.push(self.classNamesPager.disabled);
				}

				model.classNames = model.classList.join(" ");

				if (renderer) {
					pagerHtml = renderer(model);
				} else {
					pagerHtml = h.template(self.config.templates.pagerNext)(model);
				}

				buttonList.push(pagerHtml);

				// Replace markup

				html = buttonList.join(" ");

				pageListEl.innerHTML = html;

				// Add disabled attribute to disabled buttons

				disabled = pageListEl.querySelectorAll("." + self.classNamesPager.disabled);

				for (i = 0; el = disabled[i]; i++) {
					if (typeof el.disabled === "boolean") {
						el.disabled = true;
					}
				}

				if (truncatedBefore || truncatedAfter) {
					h.addClass(pageListEl, self.classNamesPageList.truncated);
				} else {
					h.removeClass(pageListEl, self.classNamesPageList.truncated);
				}

				if (operation.newTotalPages > 1) {
					h.removeClass(pageListEl, self.classNamesPageList.disabled);
				} else {
					h.addClass(pageListEl, self.classNamesPageList.disabled);
				}
			},

			/**
    * An algorithm defining which pagers should be rendered based on their index
    * and the current active page, when a `pagination.maxPagers` value is applied.
    *
    * @private
    * @param   {mixitup.Operation} operation
    * @return  {number[]}
    */

			getAllowedIndices: function (operation) {
				var self = this,
				    activeIndex = operation.newPagination.page - 1,
				    lastIndex = operation.newTotalPages - 1,
				    indices = [],
				    paddingRange = -1,
				    paddingBack = -1,
				    paddingFront = -1,
				    paddingRangeStart = -1,
				    paddingRangeEnd = -1,
				    paddingRangeOffset = -1,
				    i = -1;

				// Examples:

				// « 1 2 *3* 4 5 »                  maxPagers = 5
				// « 1 ... 4 *5* 6 ... 10 »         maxPagers = 5

				// « 1 ... 6 7 *8* 9 10 »           maxPagers = 6
				// « 1 ... 3 4 *5* 6 ... 10 »       maxPagers = 6

				// « 1 ... 3 4 *5* 6 7 ... 10 »     maxPagers = 7
				// « *1* 2 3 4 5 6 ... 10 »         maxPagers = 7

				// This algorithm ensures that at any time, the active pager
				// should be surrounded by as many "padding" pagers as possible to equal the
				// value of `pagination.maxPagers`, accounting for the fact the first and last
				// pager should also always be rendered.

				// Push in index 0 to represent the first pager

				indices.push(0);

				// Calculate the "padding range" by subtracting 2 from `pagination.maxPagers`

				paddingRange = self.config.pagination.maxPagers - 2;

				// Distribute the padding equally behind and in front of the active pager.
				// If the padding range is an even number, we allow an extra pager behind the active pager.

				paddingBack = Math.ceil((paddingRange - 1) / 2);
				paddingFront = Math.floor((paddingRange - 1) / 2);

				// Calculate where the range should start and finish based on the active index

				paddingRangeStart = activeIndex - paddingBack;
				paddingRangeEnd = activeIndex + paddingFront;

				// Set the offset to 0

				paddingRangeOffset = 0;

				// If the start of the range has collided with the first pager, positively offset as needed

				if (paddingRangeStart < 1) {
					paddingRangeOffset = 1 - paddingRangeStart;
				}

				// If the end of the range has collided with the last pager, negatively offset as needed

				if (paddingRangeEnd > lastIndex - 1) {
					paddingRangeOffset = lastIndex - 1 - paddingRangeEnd;
				}

				// Calcuate the first index of the range taking into account any offset

				i = paddingRangeStart + paddingRangeOffset;

				// Iteratate through the range, adding the respective indices:

				while (paddingRange) {
					indices.push(i);

					i++;
					paddingRange--;
				}

				indices.push(lastIndex);

				return indices;
			},

			/**
    * Renderes individual, per-page pagers.
    *
    * @private
    * @param   {number}              i
    * @param   {mixitup.Operation}   operation
    * @param   {number[]}            [allowedIndices]
    * @return  {string}
    */

			renderPager: function (i, operation, allowedIndices) {
				var self = this,
				    renderer = null,
				    activePage = operation.newPagination.page - 1,
				    model = new mixitup.ModelPager(),
				    output = "";

				if (self.config.pagination.maxPagers < Infinity && allowedIndices.length && allowedIndices.indexOf(i) < 0) {
					// maxPagers is set, and this pager is not in the allowed range

					return "";
				}

				renderer = typeof (renderer = self.config.render.pager) === "function" ? renderer : null;

				model.isPageLink = true;

				model.classList.push(self.classNamesPager.base);

				if (i === 0) {
					model.classList.push(self.classNamesPager.first);
				}

				if (i === operation.newTotalPages - 1) {
					model.classList.push(self.classNamesPager.last);
				}

				if (i === activePage) {
					model.classList.push(self.classNamesPager.active);
				}

				model.classNames = model.classList.join(" ");
				model.pageNumber = i + 1;

				if (renderer) {
					output = renderer(model);
				} else {
					output = h.template(self.config.templates.pager)(model);
				}

				return output;
			},

			/**
    * @private
    * @param   {HTMLElement}       pageStatsEl
    * @param   {mixitup.Operation} operation
    * @return  {void}
    */

			renderPageStatsEl: function (pageStatsEl, operation) {
				var self = this,
				    model = new mixitup.ModelPageStats(),
				    renderer = null,
				    output = "",
				    template = "";

				if (operation.newPagination.limit < 0 || operation.newPagination.limit === Infinity || operation.newTotalPages < 2 && self.config.pagination.hidePageStatsIfSinglePage) {
					// Empty the pager list, and add disabled class

					pageStatsEl.innerHTML = "";

					h.addClass(pageStatsEl, self.classNamesPageStats.disabled);

					return;
				}

				renderer = typeof (renderer = self.config.render.pageStats) === "function" ? renderer : null;

				model.totalTargets = operation.matching.length;

				if (model.totalTargets) {
					template = operation.newPagination.limit === 1 ? self.config.templates.pageStatsSingle : self.config.templates.pageStats;
				} else {
					template = self.config.templates.pageStatsFail;
				}

				if (model.totalTargets && operation.newPagination.limit > 0) {
					model.startPageAt = (operation.newPagination.page - 1) * operation.newPagination.limit + 1;
					model.endPageAt = Math.min(model.startPageAt + operation.newPagination.limit - 1, model.totalTargets);
				} else {
					model.startPageAt = model.endPageAt = 0;
				}

				if (renderer) {
					output = renderer(model);
				} else {
					output = h.template(template)(model);
				}

				pageStatsEl.innerHTML = output;

				if (model.totalTargets) {
					h.removeClass(pageStatsEl, self.classNamesPageStats.disabled);
				} else {
					h.addClass(pageStatsEl, self.classNamesPageStats.disabled);
				}
			},

			/**
    * @private
    * @param   {Array<*>}                  args
    * @return  {mixitup.UserInstruction}   instruction
    */

			parsePaginateArgs: function (args) {
				var self = this,
				    instruction = new mixitup.UserInstruction(),
				    arg = null,
				    i = -1;

				instruction.animate = self.config.animation.enable;
				instruction.command = new mixitup.CommandPaginate();

				for (i = 0; i < args.length; i++) {
					arg = args[i];

					if (arg === null) continue;

					if (typeof arg === "object" && h.isElement(arg, self.dom.document)) {
						instruction.command.anchor = arg;
					} else if (arg instanceof mixitup.CommandPaginate || typeof arg === "object") {
						h.extend(instruction.command, arg);
					} else if (typeof arg === "number") {
						instruction.command.page = arg;
					} else if (typeof arg === "string" && !isNaN(parseInt(arg))) {
						// e.g. "4"

						instruction.command.page = parseInt(arg);
					} else if (typeof arg === "string") {
						instruction.command.action = arg;
					} else if (typeof arg === "boolean") {
						instruction.animate = arg;
					} else if (typeof arg === "function") {
						instruction.callback = arg;
					}
				}

				h.freeze(instruction);

				// NB: Don't freeze command as may need to be sanitized later by other methods

				return instruction;
			},

			/**
    * Changes the current page and/or the current page limit.
    *
    * @example
    *
    * .paginate(page [, animate] [, callback])
    *
    * @example <caption>Example 1: Changing the active page</caption>
    *
    * console.log(mixer.getState().activePagination.page); // 1
    *
    * mixer.paginate(2)
    *     .then(function(state) {
    *         console.log(mixer.getState().activePagination.page === 2); // true
    *     });
    *
    * @example <caption>Example 2: Progressing to the next page</caption>
    *
    * console.log(mixer.getState().activePagination.page); // 1
    *
    * mixer.paginate('next')
    *     .then(function(state) {
    *         console.log(mixer.getState().activePagination.page === 2); // true
    *     });
    *
    * @example <caption>Example 3: Starting a page from an abitrary "anchor" element</caption>
    *
    * var anchorEl = mixer.getState().show[3];
    *
    * mixer.paginate(anchorEl)
    *     .then(function(state) {
    *         console.log(mixer.getState().activePagination.anchor === anchorEl); // true
    *         console.log(mixer.getState().show[0] === anchorEl); // true
    *     });
    *
    * @example <caption>Example 4: Changing the page limit</caption>
    *
    * var anchorEl = mixer.getState().show[3];
    *
    * console.log(mixer.getState().activePagination.limit); // 8
    *
    * mixer.paginate({
    *    limit: 4
    * })
    *     .then(function(state) {
    *         console.log(mixer.getState().activePagination.limit === 4); // true
    *     });
    *
    * @example <caption>Example 5: Changing the active page and page limit</caption>
    *
    * mixer.paginate({
    *    limit: 4,
    *    page: 2
    * })
    *     .then(function(state) {
    *         console.log(mixer.getState().activePagination.page === 2); // true
    *         console.log(mixer.getState().activePagination.limit === 4); // true
    *     });
    *
    * @public
    * @instance
    * @param       {(number|string|object|HTMLElement)}    page
    *     A page number, string (`'next'`, `'prev'`), HTML element reference, or command object.
    * @param       {boolean}   [animate=true]
    *      An optional boolean dictating whether the operation should animate, or occur syncronously with no animation. `true` by default.
    * @param       {function}  [callback=null]
    *      An optional callback function to be invoked after the operation has completed.
    * @return      {Promise.<mixitup.State>}
    *     A promise resolving with the current state object.
    */

			paginate: function () {
				var self = this,
				    instruction = self.parsePaginateArgs(arguments);

				return self.multimix({
					paginate: instruction.command
				}, instruction.animate, instruction.callback);
			},

			/**
    * A shorthand for `.paginate('next')`. Moves to the next page.
    *
    * @example
    *
    * .nextPage()
    *
    * @example <caption>Example: Moving to the next page</caption>
    *
    * console.log(mixer.getState().activePagination.page); // 1
    *
    * mixer.nextPage()
    *     .then(function(state) {
    *         console.log(mixer.getState().activePagination.page === 2); // true
    *     });
    *
    * @public
    * @instance
    * @return      {Promise.<mixitup.State>}
    *     A promise resolving with the current state object.
    */

			nextPage: function () {
				var self = this,
				    instruction = self.parsePaginateArgs(arguments);

				return self.multimix({
					paginate: {
						action: "next"
					}
				}, instruction.animate, instruction.callback);
			},

			/**
    * A shorthand for `.paginate('prev')`. Moves to the previous page.
    *
    * @example
    *
    * .prevPage()
    *
    * @example <caption>Example: Moving to the previous page</caption>
    *
    * console.log(mixer.getState().activePagination.page); // 5
    *
    * mixer.prevPage()
    *     .then(function(state) {
    *         console.log(mixer.getState().activePagination.page === 4); // true
    *     });
    *
    * @public
    * @instance
    * @return      {Promise.<mixitup.State>}
    *     A promise resolving with the current state object.
    */

			prevPage: function () {
				var self = this,
				    instruction = self.parsePaginateArgs(arguments);

				return self.multimix({
					paginate: {
						action: "prev"
					}
				}, instruction.animate, instruction.callback);
			}
		});

		mixitup.Facade.registerAction("afterConstruct", "pagination", function (mixer) {
			this.paginate = mixer.paginate.bind(mixer);
			this.nextPage = mixer.nextPage.bind(mixer);
			this.prevPage = mixer.prevPage.bind(mixer);
		});
	};

	mixitupPagination.TYPE = "mixitup-extension";
	mixitupPagination.NAME = "mixitup-pagination";
	mixitupPagination.EXTENSION_VERSION = "3.3.0";
	mixitupPagination.REQUIRE_CORE_VERSION = "^3.1.8";

	if (typeof exports === "object" && typeof module === "object") {
		module.exports = mixitupPagination;
	} else if (typeof define === "function" && define.amd) {
		define(function () {
			return mixitupPagination;
		});
	} else if (window.mixitup && typeof window.mixitup === "function") {
		mixitupPagination(window.mixitup);
	} else {
		throw new Error("[MixItUp Pagination] MixItUp core not found");
	}
})(window);

/**
 * Calculate number of columns optimal for current layout
 *
 * @param {object} breakpoints - collection of breakpoints used in project, defined in variables.json
 * @param {object} columns - collection of columns number, corresponding to breakpoints, defined in variables.json
 * @param {number} windowWidth - normally window.innerWidth is used
 * @returns {number} number of columns for layout
 */
function getColumns(breakpoints$$1, columns$$1, windowWidth) {
	var prev = "";
	for (var i in breakpoints$$1) {
		if (!columns$$1[i]) {
			continue;
		}
		var n = parseInt(breakpoints$$1[i]);
		if (prev != "" && windowWidth < n) {
			return columns$$1[prev];
		} else {
			prev = i;
		}
	}
	// If nothing matched, return maximum value
	return columns$$1[prev];
}

/**
 * Calculate number of items per page needed to fill mixer layout nicely
 *
 * @returns {number} items per page
 */
function getItemsPerPage() {
	let containerH = document.querySelector(".portfolio-container").offsetHeight;
	let itemH = document.querySelector(".portfolio-item").offsetHeight;

	let rows = Math.floor(containerH / itemH);
	let columns$$1 = getColumns(vars.breakpoints, vars.columns, window.innerWidth);

	return rows * columns$$1;
}

let Portfolio = function (element) {
	this.element = element;
	this.setupMixer();
	this.setupListeners();
};

Portfolio.prototype.setupMixer = function () {
	this.mixer = mixitup(this.element, {
		pagination: {
			limit: getItemsPerPage(),
			hidePageListIfSinglePage: true,
			maintainActivePage: false,
			maxPagers: 10
		},
		animation: {
			clampHeight: false,
			clampWidth: false,
			animateResizeContainer: false // required to prevent column algorithm bug
		},
		classNames: {
			block: "",
			elementPager: "" // keep it empty to match bootstrap naming
		},
		selectors: {
			control: ".mxt-control"
		},
		callbacks: {
			// On each change of filters write current set to global variable,
			// in order to provide access for modal  component
			onMixEnd: function (state) {
				window.portfolioShown = state.matching;
			}
		},
		templates: {
			pager: '<li class="page-item ${classNames}"><a class="page-link rounded-circle  mxt-control" href="#" data-page="${pageNumber}">${pageNumber}</a></li>',
			pagerPrev: '<li class="page-item ${classNames}"><a class="page-link rounded-circle  mxt-control" href="#" data-page="prev" aria-label="Previous">' + '<span aria-hidden="true">&#10229;</span>' + '<span class="sr-only">Previous</span>' + "</a></li>",
			pagerNext: '<li class="page-item ${classNames}"><a class="page-link rounded-circle mxt-control" href="#" aria-label="Next" data-page="next">' + '<span aria-hidden="true">&#10230;</span>' + '<span class="sr-only">Next</span>' + "</a></li>"
		}
	});
};

Portfolio.prototype.setupListeners = function () {
	let self = this;
	$(window).resize(function () {
		clearTimeout(window.resizedFinished);
		window.resizedFinished = setTimeout(function () {
			self.mixer.paginate({
				limit: getItemsPerPage()
			});
		}, 250);
	});
};

/*
Resets standard alert behavior in Bootstrap.
The alert with data-hide attribute will be hidden, instead of being removed from  DOM
*/
$(function () {
	$("[data-hide]").on("click", function () {
		$("." + $(this).attr("data-hide")).hide();
	});
});

var CustomModal = function (element) {
	this.element = $(element);

	this.relatedItem = "";
	this.modalAnimations = {
		base: {
			in: "slideInLeft animated",
			out: "slideOutRight animated"
		},
		// base: {
		// 	in: 'rotateInDownLeft animated',
		// 	out: 'rotateOutUpRight animated',
		// },
		prev: {
			in: "slideInLeft animated",
			out: "slideOutRight animated"
		},
		next: {
			in: "slideInRight animated",
			out: "slideOutLeft animated"
		}
	};
	this.btnPrev = $(this.element.find(".modal-nav-previous"));
	this.btnNext = $(this.element.find(".modal-nav-next"));
	this.setupListeners();
};

CustomModal.prototype.setupListeners = function () {
	var self = this;
	$(".modal .modal-dialog").css("--animate-duration", "50s");
	//In order to work properly, animations should be applied to .modal-dialog, while the .modal has to have class "fade"
	this.element.on("show.bs.modal", function (event) {
		$(".modal .modal-dialog").attr("class", "modal-dialog  " + self.modalAnimations.base.in);
		self.setModalSet();
		self.setCurrentIndex(event.relatedTarget);
		self.displayModal(self.currentIndex);
		self.setupButtons();
	});

	this.element.on("hide.bs.modal", function () {
		$(".modal .modal-dialog").attr("class", "modal-dialog  " + self.modalAnimations.base.out);
	});
};

CustomModal.prototype.setModalSet = function () {
	this.currentSet = $(window.portfolioShown);
};

CustomModal.prototype.setupButtons = function () {
	var self = this;
	self.btnPrev.off().on("click", function () {
		self.displayModal(--self.currentIndex);
	});
	self.btnNext.off().on("click", function () {
		self.displayModal(++self.currentIndex);
	});
};

CustomModal.prototype.setCurrentIndex = function (currentItem) {
	this.currItem = $(currentItem);
	this.currentIndex = this.currentSet.index(this.currItem.parent());
	this.prevItem = $(this.currItem).parent().prevAll(":visible:first").find(".portfolio-item-link");
	this.nextItem = $(this.currItem).parent().nextAll(":visible:first").find(".portfolio-item-link");
};

CustomModal.prototype.setBtnState = function () {
	this.currentIndex == 0 ? this.disableBtn(this.btnPrev) : this.enableBtn(this.btnPrev);

	this.currentIndex == this.currentSet.length - 1 ? this.disableBtn(this.btnNext) : this.enableBtn(this.btnNext);
};

CustomModal.prototype.disableBtn = function (btn) {
	btn.addClass("disabled");
};

CustomModal.prototype.enableBtn = function (btn) {
	btn.removeClass("disabled");
};

CustomModal.prototype.displayModal = function (itemIndex) {
	this.loadContent(itemIndex);
	this.setBtnState();
};

CustomModal.prototype.loadContent = function (itemIndex) {
	var item = $(this.currentSet[itemIndex]).children("a");

	//Add modal title
	let name = item.data("name");
	$(this.element).find(".modal-title").text(name);

	//Set aria label
	$(this).attr("aria-labelledby", item.attr("id"));

	//Load data
	let url = `${item.data("ajax")}/${item.attr("href")}`;
	$.get(url, function (data) {
		$("#portfolio-item .modal-body .container-fluid").empty(); //Cleanup modal contents
		$("#portfolio-item .modal-body .container-fluid").append(data);
	});
};

// import Form from "./components/Form";

document.addEventListener("DOMContentLoaded", function () {
	setupFullpage(".main-content");
	const portfolio = new Portfolio(".portfolio-container");
	window.portfolioShown = portfolio.mixer.getState().matching;
	const portfolioModal = new CustomModal(document.getElementById("portfolio-item"), window.portfolioShown);
	console.log("loaded");
	document.body.classList.remove("loader-open");
	document.getElementById("intro").classList.add("start-animation");

	document.getElementById("intro").addEventListener("animationend", e => {
		console.log("Animation ended", e);
		// check if it's the latest animated element
		if (e.target.classList.contains("intro-menu")) {
			document.querySelector(".btn-skip").classList.add("d-none");
		}
	});
});

}());
