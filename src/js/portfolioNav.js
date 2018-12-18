import Shuffle from 'shufflejs'
;('use strict')

var PortfolioNav = function(element) {
  this.element = element
  this.shuffle = new Shuffle(element, {
    itemSelector: '.portfolio-item',
    sizer: element.querySelector('.portfolio-shuffle-sizer'),
  })

  this.addFilterButtons()
  this.mode = 'exclusive'
}

PortfolioNav.prototype.addFilterButtons = function() {
  var options = document.querySelector('.nav-pills')
  if (!options) {
    return
  }

  var filterButtons = Array.from(options.children)

  filterButtons.forEach(function(button) {
    button.addEventListener('click', this._handleFilterClick.bind(this), false)
  }, this)
}

PortfolioNav.prototype._handleFilterClick = function(evt) {
  var tag = evt.target.getAttribute('data-tag')
  this.shuffle.filter(tag)
}

export default PortfolioNav
