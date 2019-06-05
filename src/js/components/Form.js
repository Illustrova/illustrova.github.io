let Form = function(element) {
	this.element = $(element);
	this.formResponse = $('#contact-form-response');
	this.formResponseText = $('#contact-form-response-text');
	this.formResponseLink = $('#contact-form-response-link');
	this.valid = false;
	this.setupListeners();
};

Form.prototype.setupListeners = function() {
	const self = this;
	//Validate and send message on submit
	document.getElementById('contact-form').onsubmit = e => {
		e.preventDefault();
		this.validate();
		if (this.valid) {
			this.sendMessage();
		} else {
			e.stopPropagation();
			this.element.addClass('was-validated');
		}
	};

	// Listen to all blur events and validate on the go
	document.getElementById('contact-form').addEventListener(
		'blur',
		function(e) {
			// Only run if the field is in a form to be validated
			if (!e.target.form.classList.contains('needs-validation')) return;
			// Prevent validation of cleared form
			if (e.target.type == 'submit') return;
			self.validate();
			self.element.addClass('was-validated');
		},
		true
	);
};

Form.prototype.validate = function() {
	this.element[0].checkValidity() ? (this.valid = true) : (this.valid = false);
};

Form.prototype.sendMessage = function() {
	// Prepare data to send
	const formElements = this.element.find('.form-control').toArray();
	let data = formElements.reduce((obj, field) => {
		obj[field.name] = field.value;
		return obj;
	}, {});

	var xhr = new XMLHttpRequest();

	xhr.open(this.element.attr('method'), this.element.attr('action'), true);
	xhr.setRequestHeader('Accept', 'application/json; charset=utf-8');
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

	// Send the collected data as JSON
	xhr.send(JSON.stringify(data));
	xhr.onloadend = response => this.displayAlert(response);
};

Form.prototype.displayAlert = function(response) {
	this.formResponse.removeClass('alert-danger');
	this.formResponse.removeClass('alert-primary');

	if (response.target.status === 200) {
		// The form submission was successful
		this.formResponse.addClass('alert-primary');
		this.formResponseText.text(
			'Thanks for the message. I’ll get back to you shortly.'
		);
		this.formResponseLink.text('Send another?');
		this.formResponse.show();
		this.element[0].reset();
		this.element.removeClass('was-validated');
	} else {
		// The form submission failed
		this.formResponse.addClass('alert-danger');
		this.formResponseText.text('Something went wrong');
		this.formResponseLink.text('Try again?');
		this.formResponse.show();
	}
};

export default Form;
