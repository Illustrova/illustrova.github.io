import PortfolioNav from './portfolioNav'
import MyModal from './modals'
// import scroll from './scroll.js'
import { fullpage } from 'fullpage.js'
import PerfectScrollbar from 'perfect-scrollbar'
// import SimpleBar from 'simplebar'

document.addEventListener('DOMContentLoaded', function() {
  console.log('loaded')
  window.portfolioNav = new PortfolioNav(
    document.querySelector('.portfolio-shuffle')
  )
  // console.log("document.getElementById('portfolio-item') => ",document.getElementById('portfolio-item'));
  // console.log("new MyModal => ",new MyModal);
  window.modal = new MyModal(document.getElementById('portfolio-item'))
  // console.log("window.modal => ",window.modal);

  $('.main-content').fullpage({ //options here
    autoScrolling: true, // scrollHorizontally: true,
    scrollBar: true, 
    fitToSection: true,
     scrollOverflow: true,
    // scrollOverflowReset: true,
    normalScrollElements: '.shuffle', afterResponsive: function(isResponsive) {
      alert('Is responsive: ' + isResponsive)
    } })
  // const ps = new PerfectScrollbar('.portfolio-shuffle');
  // console.log(ps)
  // window.portfolioItem =
  // window.portfolioItem.setupButtons()
})

