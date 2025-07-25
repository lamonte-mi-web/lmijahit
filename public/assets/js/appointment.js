/*
*
* Appointment JS
* @ThemeEaster
*/
$(function() {
    // Get the form.
    var form = $('#ajax_appointment');

    // Get the messages div.
    var formMessages = $('#form-messages');

    // Set up an event listener for the contact form.
	$(form).submit(function(event) {
		// Stop the browser from submitting the form.
		event.preventDefault();

		// Serialize the form data.
		var formData = $(form).serialize();
		// Submit the form using AJAX.
		$.ajax({
			type: 'POST',
			url: $(form).attr('action'),
			data: formData
		})
		.done(function(response) {
			// Make sure that the formMessages div has the 'success' class.
			$(formMessages).removeClass('alert-danger');
			$(formMessages).addClass('alert-success');

			// Set the message text.
			$(formMessages).text(response);

			// Clear the form.
			$('#name').val('');
			$('#email').val('');
			$('#services').val('');
			$('#sf').val('');
			$('#phone').val('');
			$('#zip').val('');
			$('#address').val('');
		})
		.fail(function(data) {
			// Make sure that the formMessages div has the 'error' class.
      $(formMessages).removeClass('alert-danger');
			$(formMessages).addClass('alert-success');

			// Set the message text.
			if (data.responseText !== '') {
				$(formMessages).text(data.responseText);
			} else {
				$(formMessages).text('Thank You! Your appointment has been completed.');
			}
      $('.form-control').val('');
		});

	});

});
