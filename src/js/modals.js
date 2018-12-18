var MyModal = function(element) {
  console.log(element)
  this.element = $(element)
  this.relatedItem = this.modalAnimations = {
    base: {
      in: 'rotateInDownLeft animated',
      out: 'rotateOutUpRight animated',
    },
    prev: {
      in: 'slideInLeft animated',
      out: 'slideOutRight animated',
    },
    next: {
      in: 'slideInRight animated',
      out: 'slideOutLeft animated',
    },
  }
  this.btnPrev = $(this.element.find('.modal-nav-previous'))
  this.btnNext = $(this.element.find('.modal-nav-next'))
  this.setupListeners()
}

MyModal.prototype.setupListeners = function() {
  var self = this
  const modal = $(this.element)

  //In order to work properly, animations should be applied to  .modal-dialog, while the .modal has to have class "fade"
  modal.on('show.bs.modal', function(event) {
    $('.modal .modal-dialog').attr(
      'class',
      'modal-dialog  ' + self.modalAnimations.base.in
    )

    self.loadContent(event.relatedTarget)
    self.setupButtons()
    self.setNextModals(event.relatedTarget)
  })

  modal.on('hide.bs.modal', function(event) {
    $('.modal .modal-dialog').attr(
      'class',
      'modal-dialog  ' + self.modalAnimations.base.out
    )
  })

  // Reset unnecessary padding-right (scrollbar allowance) for fullscreen modal
  $('.modal-fullscreen').on('resize.bs.modal', function () {
    console.log("resize")
    $('.modal-fullscreen').css('padding-right', 0)
  });
}

MyModal.prototype.setNextModals = function(currentItem) {
  this.currItem = $(currentItem)
  this.prevItem = $(this.currItem)
    .parent()
    .prev(':visible')
    .find('.portfolio-item-link')
  this.nextItem = $(this.currItem)
    .parent()
    .next(':visible')
    .find('.portfolio-item-link')

  this.setBtnState()
}

MyModal.prototype.loadContent = function(relatedItem) {
  var item = $(relatedItem)

  //Add modal title
  let name = item.data('name')
  $(this.element)
    .find('.modal-title')
    .text(name)

  //Set aria label
  $(this).attr('aria-labelledby', item.attr('id'))

  //Load data
  let url = `projects/${item.attr('href')}`
  $.get(url, function(data) {
    $('#portfolio-item .modal-body').remove() //Cleanup modal contents
    $('#portfolio-item .modal-content').append(data)
  })
}

MyModal.prototype.setupButtons = function() {
  var self = this
  self.btnPrev.on('click', function() {
    if (self.prevItem.length > 0) {
      self.loadContent(self.prevItem)
      self.setNextModals(self.prevItem)
    }
  })
  self.btnNext.on('click', function() {
    if (self.nextItem.length > 0) {
      self.loadContent(self.nextItem)
      self.setNextModals(self.nextItem)
    }
  })
}

MyModal.prototype.setBtnState = function() {
  this.prevItem.length <= 0
    ? this.disableBtn(this.btnPrev)
    : this.enableBtn(this.btnPrev)
  this.nextItem.length <= 0
    ? this.disableBtn(this.btnNext)
    : this.enableBtn(this.btnNext)
}

MyModal.prototype.disableBtn = function(btn) {
  btn.addClass('disabled')
}

MyModal.prototype.enableBtn = function(btn) {
  btn.removeClass('disabled')
}

export default MyModal
// $('.modal-nav-previous').on('click', function (e) {
//     console.log('  e => ', e);
//     var currentModal = $(e.currentTarget).closest('.modal');
//     var prevModal = currentModal.prev('.modal');

//   prev: {
//     in: "slideInLeft animated",
//     out: "slideOutRight animated"
//   },
//   next: {
//     in: "slideInLeft",
//     out: "slideOutLeft"
//   }
// }
