// // Reset unnecessary padding-right (scrollbar allowance) for fullscreen modal
// // $('.modal-fullscreen').on('shown.bs.modal', function () {
// //   $('.modal-fullscreen').css('padding-right', 0)
// // });


// // Modal navigation
// $('.modal-nav-previous').on('click', function(e) {
// console.log('  e => ',  e);
// var currentModal = $(e.currentTarget).closest('.modal');
// var prevModal = currentModal.prev('.modal');



//   currentModal.addClass(modalAnimations.prev.out)
//     .one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
//       console.log("end");
//       currentModal.modal('hide');
//       currentModal.removeClass(modalAnimations.prev.out);
//     });

//   prevModal.addClass(modalAnimations.prev.in)
//     .one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
//       console.log("end");

//       prevModal.removeClass(modalAnimations.prev.in);

//     });
//   prevModal.modal('show');

// })

// //Modals animation
// var modalAnimations = {
//   base: {
//     in: "rotateInDownLeft animated",
//     out: "rotateOutUpRight animated"
//   },
//   prev: {
//     in: "slideInLeft animated",
//     out: "slideOutRight animated"
//   },
//   next: {
//     in: "slideInLeft",
//     out: "slideOutLeft"
//   }
// }
// // var modalInAnimation = "rotateInDownLeft animated";
// // var modalOutAnimation = "rotateOutUpRight animated";


// // card.addClass('bounceOut')
// //   .one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
// //     card
// //       .hide()
// //       .removeClass('bounceOut');
// //   });
// //     }


// $('.modal').on('show.bs.modal', function (e) {
//   if ($(e.relatedTarget).hasClass('portfolio-item-link')) {
//     var el = $(e.target);
//     el.addClass(modalAnimations.base.in)
//       .one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
//         console.log("end");
//         el.removeClass(modalAnimations.base.in);
//         console.log('$(e.target) => ',el);
//       });
//   }


//   console.log('e.target show => ', e.relatedTarget);


//   // if ($(e.target).hasClass(modalOutAnimation)) {
//   //   $(e.target).removeClass(modalOutAnimation);
//   // }
//   // $(e.target).toggleClass(modalInAnimation);
// });

// $('.modal').on('hide.bs.modal', function (e) {
//   console.log('e => ', e);
//   console.log('e.target hide => ', e.relatedTarget);
//   // if ($(e.target).hasClass(modalInAnimation)) {
//   //   $(e.target).removeClass(modalInAnimation);
//   // }
//   // $(e.target).toggleClass(modalOutAnimation);
// });


// // Enable tooltips
// // $(function () {
// //   $('[data-toggle="tooltip"]').tooltip()
// // });

// //Shuffle.js - portfolio grid
// var Shuffle = window.Shuffle;

// var myShuffle = new Shuffle(document.querySelector('.portfolio-shuffle'), {
//   itemSelector: '.portfolio-item',
//   sizer: '.portfolio-shuffle-sizer',
// });

// var tag;
// $('a.tag').on('click', function (evt) {
//   tag = $(evt.currentTarget).attr('data-tag');
//   evt.preventDefault();
//   tag === "all" ? myShuffle.filter() : myShuffle.filter(tag);

//   ;
// });

// // $(document).ready(function() {
// //   $('#fullpage').fullpage(/*{
// //     //Navigation
// //     menu: '#menu',
// //     lockAnchors: false,
// //     anchors:['welcome', 'portfolio', 'contacts'],
// //     navigation: true,
// //     navigationPosition: 'right',
// //     navigationTooltips: ['Welcome', 'Portfolio', 'Contacts'],
// //     showActiveTooltip: false,
// //     slidesNavigation: false,
// //     slidesNavPosition: 'bottom',

// //     //Scrolling
// //     // css3: true,
// //     // scrollingSpeed: 700,
// //     // autoScrolling: true,
// //     // fitToSection: true,
// //     // fitToSectionDelay: 1000,
// //     // scrollBar: false,
// //     // easing: 'easeInOutCubic',
// //     // easingcss3: 'ease',
// //     // loopBottom: false,
// //     // loopTop: false,
// //     // loopHorizontal: true,
// //     // continuousVertical: false,
// //     // continuousHorizontal: false,
// //     // scrollHorizontally: false,
// //     // interlockedSlides: false,
// //     // dragAndMove: false,
// //     // offsetSections: false,
// //     // resetSliders: false,
// //     // fadingEffect: false,
// //     // normalScrollElements: '#element1, .element2',
// //     scrollOverflow: false,
// //     // scrollOverflowReset: false,
// //     // scrollOverflowOptions: null,
// //     // touchSensitivity: 15,
// //     // normalScrollElementTouchThreshold: 5,
// //     // bigSectionsDestination: null,

// //     // //Accessibility
// //     // keyboardScrolling: true,
// //     // animateAnchor: true,
// //     // recordHistory: true,

// //     // //Design
// //     // controlArrows: true,
// //     // verticalCentered: true,
// //     // sectionsColor : ['#ccc', '#fff'],
// //     // paddingTop: '3em',
// //     // paddingBottom: '10px',
// //     // fixedElements: '#header, .footer',
// //     // responsiveWidth: 0,
// //     // responsiveHeight: 0,
// //     // responsiveSlides: false,
// //     // parallax: false,
// //     // parallaxOptions: {type: 'reveal', percentage: 62, property: 'translate'},

// //     //Custom selectors
// //     sectionSelector: '.section',

// //     lazyLoading: true

// //     // //events
// //     // onLeave: function(index, nextIndex, direction){},
// //     // afterLoad: function(anchorLink, index){},
// //     // afterRender: function(){},
// //     // afterResize: function(){},
// //     // afterResponsive: function(isResponsive){},
// //     // afterSlideLoad: function(anchorLink, index, slideAnchor, slideIndex){},
// //     // onSlideLeave: function(anchorLink, index, slideIndex, direction, nextSlideIndex){}
// //   }*/);
// // });