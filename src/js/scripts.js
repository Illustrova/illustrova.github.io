import "glider-js";
import MicroModal from "micromodal";
import vars from "../data/variables.json";

document.addEventListener("DOMContentLoaded", function() {
  /** SETUP BUTTON TOGGLE FOR PORTFOLIO */
  const btnWorks = document.querySelector(".btn--show-works");
  btnWorks.onclick = () => btnWorks.closest(".works").classList.toggle("show");

  /** SETUP PORTFOLIO CAROUSEL */
  let glider = new Glider(document.querySelector(".works__carousel"), {
    slidesToShow: "auto",
    draggable: false,
    scrollLock: true,
    duration: 1.5,
    responsive: [
      {
        // screens greater than >= 775px
        breakpoint: vars.breakpoints.m,
        settings: {
          // Set to `auto` and provide item width to adjust to viewport
          slidesToShow: 3.4,
          slidesToScroll: "auto",
          duration: 0.25,
        },
      },
      {
        breakpoint: vars.breakpoints.xl,
        settings: {
          slidesToShow: 5.4,
          duration: 0.25,
        },
      },
    ],
  });

  glider.scrollToCenter = function(slideNum) {
    const { breakpoint, opt } = this;

    const slidesShown = opt.responsive.find(i => i.breakpoint === breakpoint)
      .settings.slidesToShow;

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
    },
  });

  // fixing button not getting focus in safari/firefox
  // Since micromodal detects trigger as document.activeElement, we need to fake it
  [...document.querySelectorAll("button[data-project]")].map(button =>
    button.addEventListener("click", e => e.target.closest("button").focus())
  );

  const modalContentEl = document.getElementById("modalContent");
  const loadModalContent = project => {
    const template = document.getElementById(project);
    const node = document.importNode(template.content, true);
    modalContentEl.innerHTML = "";
    modalContentEl.appendChild(node);
  };
});
