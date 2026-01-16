/**
 * Contact Page Initialization
 * Form handling, validation, submission
 */
$(() => {
  // Handle contact form submission
  $('#contact-form').on('submit', function(e) {
    e.preventDefault();

    // Get form values using Domma
    const formData = {
      name: $('#name').val(),
      email: $('#email').val(),
      subject: $('#subject').val(),
      message: $('#message').val()
    };

    // Show success message (in a real app, send to backend)
    Domma.elements.toast({
      message: 'Thank you! Your message has been sent successfully.',
      type: 'success',
      duration: 5000
    });

    // Reset form
    $(this)[0].reset();
  });

  // Initialize accordion for FAQ
  Domma.elements.accordion('#faq-accordion');

  console.log('Contact page initialized');
});
