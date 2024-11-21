$(document).ready(function() {
    // Phone number mask
    $('#phoneNumber').mask('+55 (00) 00000-0000', {
        placeholder: "+55 (00) 00000-0000"
    });

    // Form validation and submission
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();

        // Basic validation
        const name = $('#name').val().trim();
        const companyName = $('#companyName').val().trim();
        const companySize = $('#companySize').val();
        const phoneNumber = $('#phoneNumber').val().trim();
        const email = $('#email').val().trim();
        const description = $('#description').val().trim();

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, insira um e-mail válido');
            return;
        }

        // Validate phone number
        if (phoneNumber.replace(/\D/g, '').length !== 13) {
            alert('Por favor, insira um número de telefone válido');
            return;
        }

        // Prepare data for submission
        const formData = {
            name,
            companyName,
            companySize,
            phoneNumber: phoneNumber.replace(/\D/g, ''), // Remove non-digits
            email,
            description
        };

        // Disable submit button and show loading state
        const submitButton = $(this).find('button[type="submit"]');
        const originalButtonText = submitButton.text();
        submitButton.prop('disabled', true).text('Enviando...');

        // Submit form
        $.ajax({
            url: 'https://webhookn8n.otimiza.ai/webhook/main_sdr_agent',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
                alert('Mensagem enviada com sucesso! Em breve entraremos em contato.');
                $('#contactForm')[0].reset();
            },
            error: function(xhr, status, error) {
                alert('Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.');
                console.error('Error:', error);
            },
            complete: function() {
                // Re-enable submit button and restore text
                submitButton.prop('disabled', false).text(originalButtonText);
            }
        });
    });
}); 