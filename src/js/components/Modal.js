var CustomModal = function(element) {
	this.element = $(element);

	this.relatedItem = '';
	this.modalAnimations = {
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
	};
	this.btnPrev = $(this.element.find('.modal-nav-previous'));
	this.btnNext = $(this.element.find('.modal-nav-next'));
	this.setupListeners();
};

CustomModal.prototype.setupListeners = function() {
	var self = this;

	//In order to work properly, animations should be applied to .modal-dialog, while the .modal has to have class "fade"
	this.element.on('show.bs.modal', function(event) {
		$('.modal .modal-dialog').attr(
			'class',
			'modal-dialog  ' + self.modalAnimations.base.in
		);
		self.setModalSet();
		self.setCurrentIndex(event.relatedTarget);
		self.displayModal(self.currentIndex);
		self.setupButtons();
	});

	this.element.on('hide.bs.modal', function() {
		$('.modal .modal-dialog').attr(
			'class',
			'modal-dialog  ' + self.modalAnimations.base.out
		);
	});
};

CustomModal.prototype.setModalSet = function() {
	this.currentSet = $(window.portfolioShown);
};

CustomModal.prototype.setupButtons = function() {
	var self = this;
	self.btnPrev.off().on('click', function() {
		self.displayModal(--self.currentIndex);
	});
	self.btnNext.off().on('click', function() {
		self.displayModal(++self.currentIndex);
	});
};

CustomModal.prototype.setCurrentIndex = function(currentItem) {
	this.currItem = $(currentItem);
	this.currentIndex = this.currentSet.index(this.currItem.parent());
	this.prevItem = $(this.currItem)
		.parent()
		.prevAll(':visible:first')
		.find('.portfolio-item-link');
	this.nextItem = $(this.currItem)
		.parent()
		.nextAll(':visible:first')
		.find('.portfolio-item-link');
};

CustomModal.prototype.setBtnState = function() {
	this.currentIndex == 0
		? this.disableBtn(this.btnPrev)
		: this.enableBtn(this.btnPrev);

	this.currentIndex == this.currentSet.length - 1
		? this.disableBtn(this.btnNext)
		: this.enableBtn(this.btnNext);
};

CustomModal.prototype.disableBtn = function(btn) {
	btn.addClass('disabled');
};

CustomModal.prototype.enableBtn = function(btn) {
	btn.removeClass('disabled');
};

CustomModal.prototype.displayModal = function(itemIndex) {
	this.loadContent(itemIndex);
	this.setBtnState();
};

CustomModal.prototype.loadContent = function(itemIndex) {
	var item = $(this.currentSet[itemIndex]).children('a');

	//Add modal title
	let name = item.data('name');
	$(this.element)
		.find('.modal-title')
		.text(name);

	//Set aria label
	$(this).attr('aria-labelledby', item.attr('id'));

	//Load data
	let url = `${item.data('ajax')}/${item.attr('href')}`;
	$.get(url, function(data) {
		$('#portfolio-item .modal-body .container-fluid').empty(); //Cleanup modal contents
		$('#portfolio-item .modal-body .container-fluid').append(data);
	});
};

export default CustomModal;
