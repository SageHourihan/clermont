$(document).ready(function() {
    $('#contactForm').submit(function(e) {
        e.preventDefault();

        $('#submitBtn').prop('disabled', true).text('Sending...');

        $.ajax({
            type: 'POST',
            url: 'process_contact.php',
            data: $(this).serialize(),
            dataType: 'json',
            success: function(response) {
                if(response.success) {
                    $('#formResponse').html('<div class="success-message">Message sent successfully! We\'ll get back to you soon.</div>');
                    $('#contactForm')[0].reset();
                } else {
                    $('#formResponse').html('<div class="error-message">Error: ' + response.message + '</div>');
                }
                $('#submitBtn').prop('disabled', false).text('Send Message');
            },
            error: function() {
                $('#formResponse').html('<div class="error-message">An error occurred. Please try again later.</div>');
                $('#submitBtn').prop('disabled', false).text('Send Message');
            }
        });
    });
});
